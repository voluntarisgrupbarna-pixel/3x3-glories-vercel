"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PACKAGES,
  CATEGORIES,
  POSITIONS,
  LEVELS,
  SHIRT_SIZES,
  GENDERS,
  IBAN_INFO,
  type Package,
  type PackageKey,
  type DiscountResult,
  isEarlyBirdActive,
  calcDiscount,
  EARLY_BIRD_DEADLINE,
} from "./wizardData";

// ── Types ─────────────────────────────────────────────────────────────────

type Player = {
  fullName: string;
  birthDate: string;
  gender: string;
  position: string;
  level: string;
  shirtSize: string;
  dorsal: string;
  federated: boolean;
  federationKey: string;
  imageRights: boolean;
};

type ContactPerson = {
  fullName: string;
  phone: string;
  email: string;
  dni: string;
};

type WizardState = {
  step: number;
  // Step 1 — descompte social
  socialShareDone: boolean;
  // Step 2 — paquet
  packageKey: PackageKey | null;
  // Step 3 — contactes
  teamName: string;
  category: string;
  captain: ContactPerson;
  tutor: ContactPerson;
  needsTutor: boolean;
  // Step 4 — pagament + rival
  refCode: string;       // codi rival, ex: RIVAL-ABCDE
  proofFileName: string;
  proofBase64: string;
  proofMime: string;
  // Step 5 — jugadors
  players: Player[];
  // Step 6 — confirma
  rgpdConsent: boolean;
  imageRightsConsent: boolean;
};

// ── Helpers ────────────────────────────────────────────────────────────────

function emptyPlayer(): Player {
  return {
    fullName: "",
    birthDate: "",
    gender: "",
    position: "",
    level: "",
    shirtSize: "",
    dorsal: "",
    federated: false,
    federationKey: "",
    imageRights: true,
  };
}

function emptyContact(): ContactPerson {
  return { fullName: "", phone: "", email: "", dni: "" };
}

function isRivalCodeValid(code: string): boolean {
  return /^RIVAL-[A-Z0-9]{3,}$/i.test(code.trim());
}

const STEPS = [
  { id: 1, label: "Descompte" },
  { id: 2, label: "Paquet" },
  { id: 3, label: "Contactes" },
  { id: 4, label: "Pagament" },
  { id: 5, label: "Jugadors" },
  { id: 6, label: "Confirma" },
];

type Props = { initialRefCode?: string };

// ── Wizard ─────────────────────────────────────────────────────────────────

export default function InscripcioWizard({ initialRefCode }: Props) {
  const [state, setState] = useState<WizardState>(() => ({
    step: 1,
    socialShareDone: false,
    packageKey: null,
    teamName: "",
    category: "",
    captain: emptyContact(),
    tutor: emptyContact(),
    needsTutor: false,
    refCode: initialRefCode || "",
    proofFileName: "",
    proofBase64: "",
    proofMime: "",
    players: [],
    rgpdConsent: false,
    imageRightsConsent: false,
  }));

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<null | {
    ok: boolean;
    teamId?: string;
    playerIds?: string[];
    error?: string;
  }>(null);

  // Refs per capturar abandons
  const stateRef = useRef(state);
  const submitResultRef = useRef(submitResult);
  const abandonedSentRef = useRef(false);
  useEffect(() => { stateRef.current = state; });
  useEffect(() => { submitResultRef.current = submitResult; });

  function sendAbandonedLead(reason: string) {
    if (abandonedSentRef.current) return;
    if (submitResultRef.current?.ok === true) return;
    const s = stateRef.current;
    if (!s.captain.email && !s.captain.phone) return;
    abandonedSentRef.current = true;
    const currentPkg = PACKAGES.find((p) => p.key === s.packageKey) || null;
    const body = JSON.stringify({
      action: "abandoned",
      abandonedAt: new Date().toISOString(),
      reason,
      step: s.step,
      packageKey: s.packageKey || "",
      packageTitle: currentPkg?.title || "",
      packagePrice: currentPkg?.price || 0,
      teamName: s.teamName,
      category: s.category,
      captainName: s.captain.fullName,
      captainPhone: s.captain.phone,
      captainEmail: s.captain.email,
    });
    if (reason === "beforeunload") {
      navigator.sendBeacon("/api/abandoned", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/abandoned", { method: "POST", headers: { "Content-Type": "application/json" }, body }).catch(() => {});
    }
  }

  useEffect(() => {
    const onUnload = () => sendAbandonedLead("beforeunload");
    const onVisibility = () => {
      if (document.visibilityState === "hidden") sendAbandonedLead("hidden");
    };
    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pkg: Package | null = useMemo(
    () => PACKAGES.find((p) => p.key === state.packageKey) || null,
    [state.packageKey],
  );

  /** Descomptes acumulables calculats en temps real */
  const disc: DiscountResult = useMemo(() => {
    if (!pkg) return { earlyBirdAmt: 0, socialAmt: 0, rivalAmt: 0, totalDiscount: 0, finalPrice: 0 };
    return calcDiscount(pkg.price, {
      earlyBird:  isEarlyBirdActive(),
      social:     state.socialShareDone,
      rivalValid: isRivalCodeValid(state.refCode),
    });
  }, [pkg, state.socialShareDone, state.refCode]);

  // ── State helpers ─────────────────────────────────────────────────────────

  function update<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }
  function updateCaptain<K extends keyof ContactPerson>(key: K, value: ContactPerson[K]) {
    setState((prev) => ({ ...prev, captain: { ...prev.captain, [key]: value } }));
  }
  function updateTutor<K extends keyof ContactPerson>(key: K, value: ContactPerson[K]) {
    setState((prev) => ({ ...prev, tutor: { ...prev.tutor, [key]: value } }));
  }
  function updatePlayer(idx: number, patch: Partial<Player>) {
    setState((prev) => {
      const next = [...prev.players];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, players: next };
    });
  }

  function selectPackage(key: PackageKey) {
    const p = PACKAGES.find((x) => x.key === key);
    if (!p) return;
    const players: Player[] = [];
    for (let i = 0; i < p.minPlayers; i++) players.push(emptyPlayer());
    setState((prev) => ({ ...prev, packageKey: key, players, teamName: p.isTeam ? prev.teamName : "" }));
  }

  function addPlayer() {
    if (!pkg || state.players.length >= pkg.maxPlayers) return;
    setState((prev) => ({ ...prev, players: [...prev.players, emptyPlayer()] }));
  }
  function removePlayer(idx: number) {
    if (!pkg || state.players.length <= pkg.minPlayers) return;
    setState((prev) => ({ ...prev, players: prev.players.filter((_, i) => i !== idx) }));
  }

  function next() {
    if (state.step === 3) {
      // Contactes completats → capturem proactivament (poden abandonar al pagament)
      sendAbandonedLead("step3_advance");
    }
    setState((prev) => ({ ...prev, step: Math.min(6, prev.step + 1) }));
  }
  function prev() { setState((prev) => ({ ...prev, step: Math.max(1, prev.step - 1) })); }

  async function handleFileChange(file: File | null) {
    if (!file) {
      setState((prev) => ({ ...prev, proofFileName: "", proofBase64: "", proofMime: "" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) { alert("El fitxer és massa gran (màxim 5 MB)."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setState((prev) => ({
        ...prev,
        proofFileName: file.name,
        proofBase64: (result.split(",")[1] || ""),
        proofMime: file.type,
      }));
    };
    reader.readAsDataURL(file);
  }

  // ── Validació ─────────────────────────────────────────────────────────────

  // Step 1: sempre es pot avançar (social és opcional)
  const canAdvanceStep1 = true;

  // Step 2: paquet seleccionat
  const canAdvanceStep2 = state.packageKey !== null;

  // Step 3: dades de contacte completes
  const canAdvanceStep3 = useMemo(() => {
    if (!pkg) return false;
    if (pkg.isTeam && !state.teamName.trim()) return false;
    if (!state.category) return false;
    const c = state.captain;
    if (!c.fullName.trim() || !c.phone.trim() || !c.email.trim()) return false;
    if (state.needsTutor) {
      const t = state.tutor;
      if (!t.fullName.trim() || !t.phone.trim() || !t.email.trim()) return false;
    }
    return true;
  }, [pkg, state.teamName, state.category, state.captain, state.tutor, state.needsTutor]);

  // Step 4: justificant adjuntat
  const canAdvanceStep4 = state.proofBase64.length > 0;

  // Step 5: tots els jugadors complets
  const canAdvanceStep5 = useMemo(() => {
    if (!state.players.length) return false;
    return state.players.every(
      (p) => p.fullName.trim() && p.birthDate && p.gender && p.position && p.level && p.shirtSize &&
        (!p.federated || p.federationKey.trim()),
    );
  }, [state.players]);

  // Step 6: consents
  const canSubmit = state.rgpdConsent && state.imageRightsConsent;

  // ── Enviament ─────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (submitting || !canSubmit || !pkg) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const activeDisc = calcDiscount(pkg.price, {
        earlyBird:  isEarlyBirdActive(),
        social:     state.socialShareDone,
        rivalValid: isRivalCodeValid(state.refCode),
      });
      const discTypeParts: string[] = [];
      if (activeDisc.earlyBirdAmt > 0) discTypeParts.push("earlybird");
      if (activeDisc.socialAmt    > 0) discTypeParts.push("social");
      if (activeDisc.rivalAmt     > 0) discTypeParts.push("rival");

      const payload = {
        packageKey:        state.packageKey,
        packageTitle:      pkg.title,
        packagePrice:      pkg.price,
        teamName:          state.teamName,
        category:          state.category,
        captain:           state.captain,
        tutor:             state.needsTutor ? state.tutor : null,
        players:           state.players,
        proof: {
          fileName: state.proofFileName,
          mime:     state.proofMime,
          base64:   state.proofBase64,
        },
        rgpdConsent:       state.rgpdConsent,
        imageRightsConsent: state.imageRightsConsent,
        refCode:           state.refCode || null,
        submittedAt:       new Date().toISOString(),
        // Descomptes
        discountType:      discTypeParts.join("+") || null,
        discountAmount:    activeDisc.totalDiscount,
        finalPrice:        activeDisc.finalPrice,
        socialShareDone:   state.socialShareDone,
        earlyBirdApplied:  activeDisc.earlyBirdAmt > 0,
      };

      const res = await fetch("/api/inscripcio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSubmitResult({ ok: true, teamId: data.teamId, playerIds: data.playerIds });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconegut";
      setSubmitResult({ ok: false, error: msg });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (submitResult?.ok) {
    return <SuccessPanel teamId={submitResult.teamId!} playerIds={submitResult.playerIds || []} disc={disc} pkg={pkg!} />;
  }

  return (
    <div className="wizard">
      <Stepper currentStep={state.step} />

      {state.step === 1 && (
        <Step1Social
          socialShareDone={state.socialShareDone}
          onSocialDone={(v) => update("socialShareDone", v)}
          onNext={next}
        />
      )}

      {state.step === 2 && (
        <Step2Package
          selected={state.packageKey}
          onSelect={selectPackage}
          onNext={next}
          onPrev={prev}
          canAdvance={canAdvanceStep2}
          socialShareDone={state.socialShareDone}
        />
      )}

      {state.step === 3 && pkg && (
        <Step3Contacts
          pkg={pkg}
          state={state}
          updateCaptain={updateCaptain}
          updateTutor={updateTutor}
          setTeamName={(v) => update("teamName", v)}
          setCategory={(v) => update("category", v)}
          setNeedsTutor={(v) => update("needsTutor", v)}
          onPrev={prev}
          onNext={() => { sendAbandonedLead("step3_advance"); next(); }}
          canAdvance={canAdvanceStep3}
        />
      )}

      {state.step === 4 && pkg && (
        <Step4Payment
          pkg={pkg}
          state={state}
          disc={disc}
          onRefCode={(v) => update("refCode", v)}
          onFile={handleFileChange}
          onPrev={prev}
          onNext={next}
          canAdvance={canAdvanceStep4}
        />
      )}

      {state.step === 5 && pkg && (
        <Step5Players
          pkg={pkg}
          players={state.players}
          updatePlayer={updatePlayer}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
          onPrev={prev}
          onNext={next}
          canAdvance={canAdvanceStep5}
        />
      )}

      {state.step === 6 && pkg && (
        <Step6Confirm
          pkg={pkg}
          state={state}
          disc={disc}
          setRgpd={(v) => update("rgpdConsent", v)}
          setImageRights={(v) => update("imageRightsConsent", v)}
          onPrev={prev}
          onSubmit={handleSubmit}
          canSubmit={canSubmit}
          submitting={submitting}
          error={submitResult && !submitResult.ok ? submitResult.error ?? null : null}
        />
      )}
    </div>
  );
}

// ── Stepper ────────────────────────────────────────────────────────────────

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="wizard-stepper">
      {STEPS.map((s) => {
        const status = s.id < currentStep ? "done" : s.id === currentStep ? "active" : "pending";
        return (
          <li key={s.id} className={`wizard-stepper-item wizard-stepper-${status}`}>
            <span className="wizard-stepper-num">{s.id < currentStep ? "✓" : s.id}</span>
            <span className="wizard-stepper-label">{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

// ── Step 1 — Descompte social ──────────────────────────────────────────────

function Step1Social({
  socialShareDone,
  onSocialDone,
  onNext,
}: {
  socialShareDone: boolean;
  onSocialDone: (v: boolean) => void;
  onNext: () => void;
}) {
  const earlyBirdActive = isEarlyBirdActive();
  const daysLeft = Math.max(0, Math.ceil((EARLY_BIRD_DEADLINE.getTime() - Date.now()) / 86_400_000));

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Obtén fins a 3 descomptes acumulables</h2>
      <p className="wizard-step-desc">
        Pots combinar tots tres. Comença ara pel descompte social — els altres s'apliquen automàticament o a l'últim pas.
      </p>

      {/* Early bird info */}
      {earlyBirdActive && (
        <div className="wizard-info-banner wizard-info-banner--fire">
          <span className="wizard-info-banner-pct">🔥 −10 %</span>
          <div>
            <strong>Early Bird actiu · {daysLeft} {daysLeft === 1 ? "dia" : "dies"} restants</strong>
            <p>S&apos;aplica automàticament a tots els paquets. Caduca el 20 de maig.</p>
          </div>
        </div>
      )}

      {/* Social share */}
      <div className="wizard-social-block">
        <div className="wizard-social-header">
          <span className="wizard-discount-pct wizard-discount-pct--blue">−5 %</span>
          <div>
            <strong>Descompte social</strong>
            <span className="wizard-discount-badge wizard-discount-badge--insta">📲 WhatsApp + Instagram</span>
          </div>
        </div>
        <p className="wizard-social-desc">
          Comparteix el torneig amb 5 amics per WhatsApp i segueix <strong>@cbgrupbarna</strong> a Instagram. En el moment que marquis la casella s&apos;aplicarà el 5 % al teu paquet.
        </p>
        <div className="wizard-social-actions">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              "Vine al 3×3 Westfield Glòries 2026! Torneig FIBA a Barcelona el 6-7 juny. 2.000€ premi en metàl·lic i totes les categories. Inscriu-te: https://cbgrupbarna-3x3timechamber.com/inscripcion 🏀"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="wizard-social-btn wizard-social-btn--wa"
          >
            📲 Comparteix per WhatsApp
          </a>
          <a
            href="https://www.instagram.com/cbgrupbarna/"
            target="_blank"
            rel="noopener noreferrer"
            className="wizard-social-btn wizard-social-btn--ig"
          >
            📸 Segueix @cbgrupbarna a Instagram
          </a>
          <label className="wizard-social-confirm">
            <input
              type="checkbox"
              checked={socialShareDone}
              onChange={(e) => onSocialDone(e.target.checked)}
            />
            <span>He compartit amb 5 amics i segueixo @cbgrupbarna ✓</span>
          </label>
          {socialShareDone && (
            <p className="wizard-social-ok">✅ Descompte social del 5 % activat!</p>
          )}
        </div>
      </div>

      {/* Pack rival info */}
      <div className="wizard-info-banner wizard-info-banner--rival">
        <span className="wizard-info-banner-pct">🏀 −5 €</span>
        <div>
          <strong>Pack Rival (−5 €)</strong>
          <p>Si tens el codi d&apos;un equip rival que et convida, l&apos;introduiràs al pas de pagament.</p>
        </div>
      </div>

      <div className="wizard-nav">
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext}>
          {socialShareDone ? "Continuar amb el descompte →" : "Continuar sense descompte social →"}
        </button>
      </div>
    </div>
  );
}

// ── Step 2 — Paquet ────────────────────────────────────────────────────────

function Step2Package({
  selected,
  onSelect,
  onNext,
  onPrev,
  canAdvance,
  socialShareDone,
}: {
  selected: PackageKey | null;
  onSelect: (k: PackageKey) => void;
  onNext: () => void;
  onPrev: () => void;
  canAdvance: boolean;
  socialShareDone: boolean;
}) {
  const earlyBirdActive = isEarlyBirdActive();

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Tria el teu paquet</h2>
      <p className="wizard-step-desc">Selecciona com vols participar al 3×3 Westfield Glòries 2026.</p>

      {/* Badges descomptes actius */}
      <div className="wizard-active-discounts">
        {earlyBirdActive && (
          <span className="wizard-active-badge wizard-active-badge--eb">🔥 Early Bird −10 %</span>
        )}
        {socialShareDone && (
          <span className="wizard-active-badge wizard-active-badge--social">📲 Social −5 %</span>
        )}
        {(earlyBirdActive || socialShareDone) && (
          <span className="wizard-active-badge-note">Ja aplicat als preus</span>
        )}
      </div>

      <div className="wizard-pkg-grid">
        {PACKAGES.map((p) => {
          const isSelected = selected === p.key;
          const preview = calcDiscount(p.price, { earlyBird: earlyBirdActive, social: socialShareDone });
          const hasDiscount = preview.totalDiscount > 0;
          return (
            <button
              key={p.key}
              type="button"
              className={`wizard-pkg-card${isSelected ? " wizard-pkg-card--selected" : ""}`}
              onClick={() => onSelect(p.key)}
            >
              <span className="wizard-pkg-emoji">{p.emoji}</span>
              <div className="wizard-pkg-head">
                <strong>{p.title}</strong>
                <span className="wizard-pkg-subtitle">{p.subtitle}</span>
              </div>
              <div className="wizard-pkg-price-block">
                {hasDiscount ? (
                  <>
                    <span className="wizard-pkg-price-old">{p.price} €</span>
                    <span className="wizard-pkg-price wizard-pkg-price-final">
                      {preview.finalPrice.toFixed(2).replace(".00", "")} €
                    </span>
                  </>
                ) : (
                  <span className="wizard-pkg-price">{p.price} €</span>
                )}
              </div>
              <p className="wizard-pkg-desc">{p.description}</p>
            </button>
          );
        })}
      </div>

      <div className="wizard-nav">
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev}>
          ← Enrere
        </button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Continuar →
        </button>
      </div>
    </div>
  );
}

// ── Step 3 — Contactes ─────────────────────────────────────────────────────

function Step3Contacts({
  pkg,
  state,
  updateCaptain,
  updateTutor,
  setTeamName,
  setCategory,
  setNeedsTutor,
  onPrev,
  onNext,
  canAdvance,
}: {
  pkg: Package;
  state: WizardState;
  updateCaptain: <K extends keyof ContactPerson>(k: K, v: ContactPerson[K]) => void;
  updateTutor: <K extends keyof ContactPerson>(k: K, v: ContactPerson[K]) => void;
  setTeamName: (v: string) => void;
  setCategory: (v: string) => void;
  setNeedsTutor: (v: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  canAdvance: boolean;
}) {
  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">
        {pkg.isTeam ? "Equip i contactes" : "Les teves dades de contacte"}
      </h2>
      <p className="wizard-step-desc">
        {pkg.isTeam
          ? "Identifica l'equip, la categoria i el capità. Si el capità és menor d'edat, activa el bloc de tutor."
          : "Identifica't i, si ets menor d'edat, activa el bloc del tutor."}
      </p>

      {pkg.isTeam && (
        <div className="wizard-field wizard-field-full">
          <label htmlFor="team-name">Nom de l&apos;equip *</label>
          <input
            id="team-name"
            type="text"
            value={state.teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Ex: CB Grup Barna A"
            maxLength={60}
            required
          />
        </div>
      )}

      <div className="wizard-field wizard-field-full">
        <label htmlFor="category">Categoria *</label>
        <select id="category" value={state.category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Tria categoria…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <h3 className="wizard-section-title">
        {pkg.isTeam ? "Capità de l'equip" : "Persona inscrita"}
      </h3>
      <ContactFields prefix="captain" value={state.captain} onChange={updateCaptain} />

      <label className="wizard-toggle">
        <input
          type="checkbox"
          checked={state.needsTutor}
          onChange={(e) => setNeedsTutor(e.target.checked)}
        />
        <span>El {pkg.isTeam ? "capità" : "jugador"} és menor d&apos;edat — afegir tutor/a legal</span>
      </label>

      {state.needsTutor && (
        <>
          <h3 className="wizard-section-title">Tutor/a legal</h3>
          <ContactFields prefix="tutor" value={state.tutor} onChange={updateTutor} />
        </>
      )}

      <div className="wizard-nav">
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev}>← Enrere</button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Continuar al pagament →
        </button>
      </div>
    </div>
  );
}

function ContactFields({
  prefix,
  value,
  onChange,
}: {
  prefix: string;
  value: ContactPerson;
  onChange: <K extends keyof ContactPerson>(k: K, v: ContactPerson[K]) => void;
}) {
  return (
    <div className="wizard-grid-2">
      <div className="wizard-field">
        <label htmlFor={`${prefix}-name`}>Nom i cognoms *</label>
        <input id={`${prefix}-name`} type="text" value={value.fullName}
          onChange={(e) => onChange("fullName", e.target.value)} required maxLength={80} />
      </div>
      <div className="wizard-field">
        <label htmlFor={`${prefix}-dni`}>DNI/NIE <span style={{fontWeight:400,color:"#888"}}>(opcional)</span></label>
        <input id={`${prefix}-dni`} type="text" value={value.dni}
          onChange={(e) => onChange("dni", e.target.value.toUpperCase())}
          maxLength={20} placeholder="12345678A" />
      </div>
      <div className="wizard-field">
        <label htmlFor={`${prefix}-phone`}>Telèfon (WhatsApp) *</label>
        <input id={`${prefix}-phone`} type="tel" value={value.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          required maxLength={20} placeholder="+34 600 000 000" />
      </div>
      <div className="wizard-field">
        <label htmlFor={`${prefix}-email`}>Email *</label>
        <input id={`${prefix}-email`} type="email" value={value.email}
          onChange={(e) => onChange("email", e.target.value)} required maxLength={120} />
      </div>
    </div>
  );
}

// ── Step 4 — Pagament + Codi Rival ─────────────────────────────────────────

function Step4Payment({
  pkg,
  state,
  disc,
  onRefCode,
  onFile,
  onPrev,
  onNext,
  canAdvance,
}: {
  pkg: Package;
  state: WizardState;
  disc: DiscountResult;
  onRefCode: (v: string) => void;
  onFile: (f: File | null) => void;
  onPrev: () => void;
  onNext: () => void;
  canAdvance: boolean;
}) {
  const rivalValid = isRivalCodeValid(state.refCode);
  const finalPrice = disc.finalPrice > 0 ? disc.finalPrice : pkg.price;

  const concept = useMemo(() => {
    const cleaned = (state.teamName || state.captain.fullName || "")
      .replace(/[^A-Za-z0-9 ]/g, "")
      .slice(0, 30)
      .trim();
    return `3X3 ${finalPrice}€ ${cleaned}`;
  }, [finalPrice, state.teamName, state.captain.fullName]);

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Pagament</h2>
      <p className="wizard-step-desc">
        Primer aplica el codi rival si el tens, i després fes la transferència per l&apos;import final.
      </p>

      {/* ── Codi rival ── */}
      <div className="wizard-rival-block">
        <div className="wizard-rival-block-head">
          <span className="wizard-discount-pct wizard-discount-pct--red">−5 €</span>
          <div>
            <strong>Pack Rival</strong>
            <span className="wizard-discount-badge wizard-discount-badge--rival">🏀 Equip invitat</span>
          </div>
        </div>
        <p className="wizard-rival-block-desc">
          Si un equip rival t&apos;ha convidat al torneig, introdueix el seu codi i tots dos estalvieu 5 €.
        </p>
        <div className="wizard-discount-rival-input">
          <input
            type="text"
            value={state.refCode}
            onChange={(e) => onRefCode(e.target.value.toUpperCase())}
            placeholder="RIVAL-ABCDE"
            maxLength={20}
            className={`wizard-rival-code-input${rivalValid ? " wizard-rival-code-input--valid" : ""}`}
          />
          {rivalValid ? (
            <span className="wizard-rival-code-ok">✓ Codi vàlid — −5 € aplicats</span>
          ) : state.refCode.length > 0 ? (
            <span className="wizard-rival-code-hint">Format incorrecte. Ha de ser RIVAL-XXXXX</span>
          ) : (
            <span className="wizard-rival-code-hint">Deixa&apos;l en blanc si no tens codi rival</span>
          )}
        </div>
      </div>

      {/* ── Resum de descomptes ── */}
      <div className="wizard-payment-box">
        <div className="wizard-payment-row">
          <span className="wizard-payment-label">Preu base</span>
          {disc.totalDiscount > 0 ? (
            <s className="wizard-payment-value wizard-payment-base-old">{pkg.price} €</s>
          ) : (
            <strong className="wizard-payment-value">{pkg.price} €</strong>
          )}
        </div>

        {disc.earlyBirdAmt > 0 && (
          <div className="wizard-payment-row">
            <span className="wizard-payment-label wizard-payment-label-discount">🔥 Early Bird −10 %</span>
            <span className="wizard-payment-value wizard-payment-discount">
              −{disc.earlyBirdAmt.toFixed(2).replace(".00", "")} €
            </span>
          </div>
        )}

        {disc.socialAmt > 0 && (
          <div className="wizard-payment-row">
            <span className="wizard-payment-label wizard-payment-label-discount">📲 Social −5 %</span>
            <span className="wizard-payment-value wizard-payment-discount">
              −{disc.socialAmt.toFixed(2).replace(".00", "")} €
            </span>
          </div>
        )}

        {disc.rivalAmt > 0 && (
          <div className="wizard-payment-row">
            <span className="wizard-payment-label wizard-payment-label-discount">🏀 Pack Rival</span>
            <span className="wizard-payment-value wizard-payment-discount">−{disc.rivalAmt} €</span>
          </div>
        )}

        {disc.totalDiscount > 0 && (
          <div className="wizard-payment-row wizard-payment-row-total">
            <span className="wizard-payment-label">Import a transferir</span>
            <strong className="wizard-payment-value wizard-payment-final">
              {finalPrice.toFixed(2).replace(".00", "")} €
            </strong>
          </div>
        )}

        <div className="wizard-payment-row">
          <span className="wizard-payment-label">IBAN</span>
          <strong className="wizard-payment-value wizard-payment-mono">{IBAN_INFO.iban}</strong>
        </div>
        <div className="wizard-payment-row">
          <span className="wizard-payment-label">Beneficiari</span>
          <strong className="wizard-payment-value">{IBAN_INFO.beneficiary}</strong>
        </div>
        <div className="wizard-payment-row">
          <span className="wizard-payment-label">Concepte</span>
          <strong className="wizard-payment-value wizard-payment-mono">{concept}</strong>
        </div>
      </div>

      {/* ── Justificant ── */}
      <div className="wizard-field wizard-field-full">
        <label htmlFor="proof">Justificant de la transferència *</label>
        <input
          id="proof"
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => onFile(e.target.files?.[0] || null)}
        />
        {state.proofFileName && (
          <p className="wizard-help wizard-help-success">
            ✓ Fitxer carregat: <strong>{state.proofFileName}</strong>
          </p>
        )}
        <p className="wizard-help">JPG, PNG o PDF · màxim 5 MB</p>
      </div>

      <div className="wizard-nav">
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev}>← Enrere</button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Continuar amb els jugadors →
        </button>
      </div>
    </div>
  );
}

// ── Step 5 — Jugadors ─────────────────────────────────────────────────────

function Step5Players({
  pkg,
  players,
  updatePlayer,
  addPlayer,
  removePlayer,
  onPrev,
  onNext,
  canAdvance,
}: {
  pkg: Package;
  players: Player[];
  updatePlayer: (idx: number, patch: Partial<Player>) => void;
  addPlayer: () => void;
  removePlayer: (idx: number) => void;
  onPrev: () => void;
  onNext: () => void;
  canAdvance: boolean;
}) {
  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">
        {pkg.isTeam ? `Jugadors (${players.length}/${pkg.maxPlayers})` : "Les teves dades de jugador/a"}
      </h2>
      <p className="wizard-step-desc">
        {pkg.isTeam
          ? `Mínim ${pkg.minPlayers}, màxim ${pkg.maxPlayers} jugadors. Tots els camps amb * són obligatoris.`
          : "Omple totes les dades. Tots els camps amb * són obligatoris."}
      </p>

      {players.map((p, idx) => (
        <div key={idx} className="wizard-player-card">
          <div className="wizard-player-head">
            <strong>
              {pkg.isTeam ? `Jugador ${idx + 1}` : "Tu"}
              {idx === 0 && pkg.isTeam ? " (titular/capità)" : ""}
            </strong>
            {pkg.isTeam && players.length > pkg.minPlayers && (
              <button type="button" className="wizard-player-remove" onClick={() => removePlayer(idx)}>
                Eliminar
              </button>
            )}
          </div>

          <div className="wizard-grid-2">
            <div className="wizard-field wizard-field-full">
              <label>Nom i cognoms *</label>
              <input type="text" value={p.fullName}
                onChange={(e) => updatePlayer(idx, { fullName: e.target.value })} required maxLength={80} />
            </div>
            <div className="wizard-field">
              <label>Data de naixement *</label>
              <input type="date" value={p.birthDate}
                onChange={(e) => updatePlayer(idx, { birthDate: e.target.value })}
                max="2020-12-31" min="1940-01-01" required />
            </div>
            <div className="wizard-field">
              <label>Categoria/gènere *</label>
              <select value={p.gender} onChange={(e) => updatePlayer(idx, { gender: e.target.value })} required>
                <option value="">Tria…</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="wizard-field">
              <label>Posició *</label>
              <select value={p.position} onChange={(e) => updatePlayer(idx, { position: e.target.value })} required>
                <option value="">Tria…</option>
                {POSITIONS.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div className="wizard-field">
              <label>Nivell *</label>
              <select value={p.level} onChange={(e) => updatePlayer(idx, { level: e.target.value })} required>
                <option value="">Tria…</option>
                {LEVELS.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div className="wizard-field">
              <label>Talla samarreta *</label>
              <select value={p.shirtSize} onChange={(e) => updatePlayer(idx, { shirtSize: e.target.value })} required>
                <option value="">Tria…</option>
                {SHIRT_SIZES.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div className="wizard-field">
              <label>Dorsal preferit</label>
              <input type="text" value={p.dorsal}
                onChange={(e) => updatePlayer(idx, { dorsal: e.target.value })}
                placeholder="Ex: 23" maxLength={3} />
            </div>
            <div className="wizard-field wizard-field-full">
              <label className="wizard-toggle wizard-toggle-inline">
                <input type="checkbox" checked={p.federated}
                  onChange={(e) => updatePlayer(idx, { federated: e.target.checked })} />
                <span>Jugador federat</span>
              </label>
              {p.federated && (
                <input type="text" value={p.federationKey}
                  onChange={(e) => updatePlayer(idx, { federationKey: e.target.value })}
                  placeholder="Llicència federativa *" maxLength={30} />
              )}
            </div>
          </div>
        </div>
      ))}

      {pkg.isTeam && players.length < pkg.maxPlayers && (
        <button type="button" className="wizard-add-player" onClick={addPlayer}>
          + Afegir jugador ({players.length + 1}/{pkg.maxPlayers})
        </button>
      )}

      <div className="wizard-nav">
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev}>← Enrere</button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Revisar i enviar →
        </button>
      </div>
    </div>
  );
}

// ── Step 6 — Confirma ─────────────────────────────────────────────────────

function Step6Confirm({
  pkg,
  state,
  disc,
  setRgpd,
  setImageRights,
  onPrev,
  onSubmit,
  canSubmit,
  submitting,
  error,
}: {
  pkg: Package;
  state: WizardState;
  disc: DiscountResult;
  setRgpd: (v: boolean) => void;
  setImageRights: (v: boolean) => void;
  onPrev: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  submitting: boolean;
  error: string | null;
}) {
  const finalPrice = disc.finalPrice > 0 ? disc.finalPrice : pkg.price;

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Revisa i envia</h2>
      <p className="wizard-step-desc">
        Comprova que tot està correcte. Quan envïs, l&apos;organització rep totes les dades, valida el
        justificant i et confirma la plaça per email i WhatsApp en menys de 24h.
      </p>

      <div className="wizard-summary">
        <div className="wizard-summary-row">
          <span>Paquet</span>
          <strong>{pkg.emoji} {pkg.title}</strong>
        </div>
        {pkg.isTeam && (
          <div className="wizard-summary-row">
            <span>Equip</span>
            <strong>{state.teamName}</strong>
          </div>
        )}
        <div className="wizard-summary-row">
          <span>Categoria</span>
          <strong>{state.category}</strong>
        </div>
        <div className="wizard-summary-row">
          <span>{pkg.isTeam ? "Capità" : "Jugador/a"}</span>
          <strong>{state.captain.fullName} · {state.captain.phone}</strong>
        </div>
        {state.needsTutor && (
          <div className="wizard-summary-row">
            <span>Tutor/a</span>
            <strong>{state.tutor.fullName} · {state.tutor.phone}</strong>
          </div>
        )}
        <div className="wizard-summary-row">
          <span>Jugadors</span>
          <strong>{state.players.length}</strong>
        </div>
        <div className="wizard-summary-row">
          <span>Justificant</span>
          <strong>{state.proofFileName || "—"}</strong>
        </div>

        {/* Descomptes */}
        {disc.earlyBirdAmt > 0 && (
          <div className="wizard-summary-row wizard-summary-row-discount">
            <span>🔥 Early Bird −10 %</span>
            <strong>−{disc.earlyBirdAmt.toFixed(2).replace(".00", "")} €</strong>
          </div>
        )}
        {disc.socialAmt > 0 && (
          <div className="wizard-summary-row wizard-summary-row-discount">
            <span>📲 Social −5 %</span>
            <strong>−{disc.socialAmt.toFixed(2).replace(".00", "")} €</strong>
          </div>
        )}
        {disc.rivalAmt > 0 && (
          <div className="wizard-summary-row wizard-summary-row-discount">
            <span>🏀 Pack Rival · {state.refCode}</span>
            <strong>−{disc.rivalAmt} €</strong>
          </div>
        )}

        <div className="wizard-summary-row wizard-summary-row-total">
          <span>Total pagat</span>
          <strong className="wizard-summary-total">
            {disc.totalDiscount > 0
              ? <><s style={{ color: "rgba(255,247,239,.38)", fontWeight: 400 }}>{pkg.price} €</s> {finalPrice.toFixed(2).replace(".00", "")} €</>
              : <>{pkg.price} €</>
            }
          </strong>
        </div>
      </div>

      <label className="wizard-toggle">
        <input type="checkbox" checked={state.rgpdConsent} onChange={(e) => setRgpd(e.target.checked)} />
        <span>Accepto la política de privadesa i el tractament de les dades segons la RGPD. *</span>
      </label>

      <label className="wizard-toggle">
        <input type="checkbox" checked={state.imageRightsConsent} onChange={(e) => setImageRights(e.target.checked)} />
        <span>
          Autoritzo l&apos;organització a fer fotos/vídeos durant el torneig per a difusió del club
          (xarxes, web, premsa). *
        </span>
      </label>

      {error && <p className="wizard-error">⚠️ Error: {error}. Torna-ho a provar.</p>}

      <div className="wizard-nav">
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev} disabled={submitting}>
          ← Enrere
        </button>
        <button
          type="button"
          className="wizard-btn wizard-btn-primary"
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? "Enviant…" : "Enviar inscripció ✓"}
        </button>
      </div>
    </div>
  );
}

// ── Success ────────────────────────────────────────────────────────────────

function SuccessPanel({
  teamId,
  playerIds,
  disc,
  pkg,
}: {
  teamId: string;
  playerIds: string[];
  disc: DiscountResult;
  pkg: Package;
}) {
  const checkInUrl = `https://cbgrupbarna-3x3timechamber.com/check-in/${teamId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(checkInUrl)}`;
  const finalPrice = disc.finalPrice > 0 ? disc.finalPrice : pkg.price;

  return (
    <div className="wizard-success">
      <span className="wizard-success-emoji">🏀</span>
      <h2>Inscripció enviada!</h2>
      <p>
        Ja tenim totes les teves dades. L&apos;organització valida el justificant en menys de 24h i et
        confirmem la plaça per email i WhatsApp amb els QR d&apos;accés.
      </p>

      {disc.totalDiscount > 0 && (
        <div className="wizard-success-discount">
          <span>Estalvi total</span>
          <strong>−{disc.totalDiscount.toFixed(2).replace(".00", "")} € · Has pagat {finalPrice.toFixed(2).replace(".00", "")} €</strong>
        </div>
      )}

      <div className="wizard-success-codes">
        <span className="wizard-success-code-label">Codi d&apos;inscripció</span>
        <code className="wizard-success-code">{teamId}</code>
      </div>

      <div className="wizard-success-qr">
        <img
          src={qrUrl}
          alt={`QR check-in equip ${teamId}`}
          width={260}
          height={260}
          loading="eager"
          decoding="async"
        />
        <p>
          <strong>Guarda aquest QR.</strong> Escanejant-lo accedeixes a la teva pàgina de check-in
          amb l&apos;estat actualitzat de la inscripció. Si vols, fes captura ara — també te&apos;l
          enviarem per email.
        </p>
      </div>

      <a href={`/check-in/${teamId}`} className="wizard-btn wizard-btn-primary">
        Obrir la meva pàgina de check-in →
      </a>

      {playerIds.length > 1 && (
        <details className="wizard-success-details">
          <summary>Codis dels {playerIds.length} jugadors</summary>
          <ul className="wizard-success-player-ids">
            {playerIds.map((id) => (
              <li key={id}>
                <a href={`/jugador/${id}`}><code>{id}</code></a>
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="wizard-success-tip">
        El check-in del dia del torneig serà aquí mateix. Cada jugador també tindrà la seva fitxa
        accessible amb el seu propi QR.
      </p>

      <a href="/" className="wizard-btn wizard-btn-ghost">Tornar a l&apos;inici</a>
    </div>
  );
}
