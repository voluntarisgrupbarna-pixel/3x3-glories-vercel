"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PACKAGES,
  CATEGORIES,
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

// ── Types ──────────────────────────────────────────────────────────────────

type Player = {
  fullName: string;
  club: string;
  category: string;
  birthYear: string;
  gender: string;
  phone: string;
  shirtSize: string;
  email: string;
};

type Captain = {
  fullName: string;
  phone: string;
  email: string;
  shirtSize: string;
};

type Tutor = {
  fullName: string;
  phone: string;
  email: string;
};

type WizardState = {
  step: number;
  // Step 1 — descomptes (pre-form)
  socialShareDone: boolean;
  rivalCode: string;
  // Step 2 — equip + capità
  packageKey: PackageKey | null;
  teamName: string;
  category: string;
  captain: Captain;
  needsTutor: boolean;
  tutor: Tutor;
  // Step 3 — pagament
  proofFileName: string;
  proofBase64: string;
  proofMime: string;
  // Step 4 — jugadors
  players: Player[];
  // Step 5 — confirmació
  rgpdConsent: boolean;
  imageRightsConsent: boolean;
};

// ── Helpers ────────────────────────────────────────────────────────────────

const FORMATIVE_CATS = ["Premini", "Mini", "Preinfantil", "Infantil", "Cadet", "Júnior"];

function isFormative(cat: string): boolean {
  return FORMATIVE_CATS.some((f) => cat.startsWith(f));
}

function isRivalCodeValid(code: string): boolean {
  return /^RIVAL-[A-Z0-9]{3,}$/i.test(code.trim());
}

function emptyPlayer(defaultCategory = ""): Player {
  return { fullName: "", club: "", category: defaultCategory, birthYear: "", gender: "", phone: "", shirtSize: "", email: "" };
}

const STEPS = [
  { id: 1, label: "Descompte" },
  { id: 2, label: "Equip" },
  { id: 3, label: "Pagament" },
  { id: 4, label: "Jugadors" },
  { id: 5, label: "Confirma" },
];

// ── Copy button ────────────────────────────────────────────────────────────

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  function doCopy() {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button type="button" className="wizard-copy-btn" onClick={doCopy} title={`Copiar ${label}`}>
      {copied ? "✓ Copiat" : "Copiar"}
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

type Props = { initialRefCode?: string };

export default function InscripcioWizard({ initialRefCode = "" }: Props) {
  const [state, setState] = useState<WizardState>({
    step: 1,
    socialShareDone: false,
    rivalCode: initialRefCode,
    packageKey: null,
    teamName: "",
    category: "",
    captain: { fullName: "", phone: "", email: "", shirtSize: "" },
    needsTutor: false,
    tutor: { fullName: "", phone: "", email: "" },
    proofFileName: "",
    proofBase64: "",
    proofMime: "",
    players: [emptyPlayer()],
    rgpdConsent: false,
    imageRightsConsent: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<null | { ok: boolean; teamId?: string; playerIds?: string[]; error?: string }>(null);

  const stateRef = useRef(state);
  const submitResultRef = useRef(submitResult);
  const abandonedSentRef = useRef(false);
  useEffect(() => { stateRef.current = state; });
  useEffect(() => { submitResultRef.current = submitResult; });

  // ── Abandoned lead capture ─────────────────────────────────────────────
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

  // ── Derived ────────────────────────────────────────────────────────────
  const pkg: Package | null = useMemo(
    () => PACKAGES.find((p) => p.key === state.packageKey) || null,
    [state.packageKey],
  );

  const disc: DiscountResult = useMemo(() => {
    if (!pkg) return { earlyBirdAmt: 0, socialAmt: 0, rivalAmt: 0, totalDiscount: 0, finalPrice: 0 };
    return calcDiscount(pkg.price, {
      earlyBird: isEarlyBirdActive(),
      social: state.socialShareDone,
      rivalValid: isRivalCodeValid(state.rivalCode),
    });
  }, [pkg, state.socialShareDone, state.rivalCode]);

  // ── State helpers ──────────────────────────────────────────────────────
  function update<K extends keyof WizardState>(k: K, v: WizardState[K]) {
    setState((prev) => ({ ...prev, [k]: v }));
  }

  function updateCaptain<K extends keyof Captain>(k: K, v: Captain[K]) {
    setState((prev) => ({ ...prev, captain: { ...prev.captain, [k]: v } }));
  }

  function updateTutor<K extends keyof Tutor>(k: K, v: Tutor[K]) {
    setState((prev) => ({ ...prev, tutor: { ...prev.tutor, [k]: v } }));
  }

  function updatePlayer(idx: number, patch: Partial<Player>) {
    setState((prev) => {
      const players = [...prev.players];
      players[idx] = { ...players[idx], ...patch };
      return { ...prev, players };
    });
  }

  function addPlayer() {
    setState((prev) => {
      if (!pkg || prev.players.length >= pkg.maxPlayers) return prev;
      return { ...prev, players: [...prev.players, emptyPlayer(prev.category)] };
    });
  }

  function removePlayer(idx: number) {
    setState((prev) => {
      if (prev.players.length <= (pkg?.minPlayers ?? 1)) return prev;
      return { ...prev, players: prev.players.filter((_, i) => i !== idx) };
    });
  }

  function selectPackage(key: PackageKey) {
    const p = PACKAGES.find((x) => x.key === key);
    if (!p) return;
    setState((prev) => {
      let players = prev.players;
      if (players.length < p.minPlayers) {
        players = [...players, ...Array.from({ length: p.minPlayers - players.length }, () => emptyPlayer(prev.category))];
      } else if (players.length > p.maxPlayers) {
        players = players.slice(0, p.maxPlayers);
      }
      return { ...prev, packageKey: key, players };
    });
  }

  function handleCategoryChange(cat: string) {
    setState((prev) => ({
      ...prev,
      category: cat,
      needsTutor: isFormative(cat),
      // Pre-fill category on existing players that haven't set one
      players: prev.players.map((p) => p.category ? p : { ...p, category: cat }),
    }));
  }

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) {
      setState((prev) => ({ ...prev, proofFileName: "", proofBase64: "", proofMime: "" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("El fitxer és massa gran (màxim 5 MB). Comprimeix la imatge i torna-la a adjuntar.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setState((prev) => ({
        ...prev,
        proofFileName: file.name,
        proofBase64: result.split(",")[1] || "",
        proofMime: file.type,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────────
  function next() {
    setState((prev) => {
      let nextStep = prev.step + 1;
      if (prev.packageKey === "individual" && nextStep === 4) nextStep = 5;
      return { ...prev, step: Math.min(nextStep, 5) };
    });
  }

  function prev() {
    setState((prev) => {
      let prevStep = prev.step - 1;
      if (prev.packageKey === "individual" && prevStep === 4) prevStep = 3;
      return { ...prev, step: Math.max(prevStep, 1) };
    });
  }

  // ── Validation ─────────────────────────────────────────────────────────
  // Step 1: social + rival → always optional, always can advance
  const canAdvanceStep1 = true;

  const canAdvanceStep2 = useMemo(() => {
    if (!state.packageKey || !state.category) return false;
    if (!pkg) return false;
    if (pkg.isTeam && !state.teamName.trim()) return false;
    const c = state.captain;
    if (!c.fullName.trim() || !c.phone.trim() || !c.email.trim() || !c.shirtSize) return false;
    if (state.needsTutor) {
      const t = state.tutor;
      if (!t.fullName.trim() || !t.phone.trim() || !t.email.trim()) return false;
    }
    return true;
  }, [pkg, state.packageKey, state.category, state.teamName, state.captain, state.tutor, state.needsTutor]);

  const canAdvanceStep3 = state.proofBase64.length > 0;

  const canAdvanceStep4 = useMemo(() => {
    if (!state.players.length) return false;
    return state.players.every(
      (p) => p.fullName.trim() && p.club.trim() && p.category && p.birthYear.trim() && p.gender && p.phone.trim() && p.shirtSize,
    );
  }, [state.players]);

  const canSubmit = state.rgpdConsent && state.imageRightsConsent;

  // ── Submit ─────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (submitting || !canSubmit || !pkg) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const players =
        pkg.isTeam
          ? state.players
          : [{ fullName: state.captain.fullName, club: "", category: state.category, birthYear: "", gender: "", phone: state.captain.phone, shirtSize: state.captain.shirtSize, email: state.captain.email }];

      const payload = {
        packageKey: state.packageKey,
        packageTitle: pkg.title,
        packagePrice: pkg.price,
        teamName: state.teamName || state.captain.fullName,
        category: state.category,
        captain: { fullName: state.captain.fullName, phone: state.captain.phone, email: state.captain.email, shirtSize: state.captain.shirtSize, dni: "" },
        tutor: state.needsTutor
          ? { fullName: state.tutor.fullName, phone: state.tutor.phone, email: state.tutor.email, shirtSize: "", dni: "" }
          : null,
        players: players.map((p) => ({
          fullName: p.fullName,
          club: p.club,
          category: p.category,
          birthYear: p.birthYear,
          gender: p.gender,
          phone: p.phone,
          shirtSize: p.shirtSize,
          email: p.email,
          birthDate: p.birthYear ? `${p.birthYear}-01-01` : "",
          position: "",
          level: "",
          dorsal: "",
          federated: false,
          federationKey: "",
          imageRights: true,
        })),
        proof: { fileName: state.proofFileName, mime: state.proofMime, base64: state.proofBase64 },
        rgpdConsent: state.rgpdConsent,
        imageRightsConsent: state.imageRightsConsent,
        refCode: isRivalCodeValid(state.rivalCode) ? state.rivalCode : null,
        submittedAt: new Date().toISOString(),
        discountType: [disc.earlyBirdAmt > 0 && "earlybird", disc.socialAmt > 0 && "social", disc.rivalAmt > 0 && "rival"].filter(Boolean).join("+") || null,
        discountAmount: disc.totalDiscount,
        finalPrice: disc.finalPrice > 0 ? disc.finalPrice : pkg.price,
        earlyBirdApplied: isEarlyBirdActive(),
        socialShareDone: state.socialShareDone,
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
      setSubmitting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  if (submitResult?.ok) {
    return (
      <SuccessPanel
        teamId={submitResult.teamId!}
        playerIds={submitResult.playerIds || []}
        disc={disc}
        pkg={pkg!}
        teamName={state.teamName || state.captain.fullName}
      />
    );
  }

  return (
    <div className="wizard">
      <Stepper currentStep={state.step} isIndividual={state.packageKey === "individual"} />

      {state.step === 1 && (
        <Step1Discounts
          socialShareDone={state.socialShareDone}
          rivalCode={state.rivalCode}
          onSocialDone={(v) => update("socialShareDone", v)}
          onRivalCode={(v) => update("rivalCode", v.toUpperCase())}
          onNext={next}
        />
      )}

      {state.step === 2 && (
        <Step2Team
          state={state}
          pkg={pkg}
          disc={disc}
          selectPackage={selectPackage}
          updateCaptain={updateCaptain}
          updateTutor={updateTutor}
          setTeamName={(v) => update("teamName", v)}
          setCategory={handleCategoryChange}
          onPrev={prev}
          onNext={() => { sendAbandonedLead("step2_advance"); next(); }}
          canAdvance={canAdvanceStep2}
        />
      )}

      {state.step === 3 && pkg && (
        <Step3Payment
          pkg={pkg}
          disc={disc}
          teamName={state.teamName || state.captain.fullName}
          proofFileName={state.proofFileName}
          onFile={handleFileChange}
          onPrev={prev}
          onNext={next}
          canAdvance={canAdvanceStep3}
        />
      )}

      {state.step === 4 && pkg && pkg.isTeam && (
        <Step4Players
          pkg={pkg}
          players={state.players}
          teamCategory={state.category}
          updatePlayer={updatePlayer}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
          onPrev={prev}
          onNext={next}
          canAdvance={canAdvanceStep4}
        />
      )}

      {state.step === 5 && pkg && (
        <Step5Confirm
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

function Stepper({ currentStep, isIndividual }: { currentStep: number; isIndividual: boolean }) {
  const steps = isIndividual
    ? [{ id: 1, label: "Descompte" }, { id: 2, label: "Equip" }, { id: 3, label: "Pagament" }, { id: 5, label: "Confirma" }]
    : STEPS;

  // Map actual step to visual position
  const visualStep = isIndividual && currentStep >= 4 ? currentStep - 1 : currentStep;

  return (
    <ol className="wizard-stepper">
      {steps.map((s, idx) => {
        const pos = idx + 1;
        const status = pos < visualStep ? "done" : pos === visualStep ? "active" : "pending";
        return (
          <li key={s.id} className={`wizard-stepper-item wizard-stepper-item--${status}`}>
            <span className="wizard-stepper-dot">{status === "done" ? "✓" : pos}</span>
            <span className="wizard-stepper-label">{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

// ── Step 1 — Descomptes (pre-form) ────────────────────────────────────────

function Step1Discounts({
  socialShareDone,
  rivalCode,
  onSocialDone,
  onRivalCode,
  onNext,
}: {
  socialShareDone: boolean;
  rivalCode: string;
  onSocialDone: (v: boolean) => void;
  onRivalCode: (v: string) => void;
  onNext: () => void;
}) {
  const earlyBirdActive = isEarlyBirdActive();
  const daysLeft = Math.max(0, Math.ceil((EARLY_BIRD_DEADLINE.getTime() - Date.now()) / 86_400_000));
  const rivalValid = isRivalCodeValid(rivalCode);

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Descomptes disponibles</h2>
      <p className="wizard-step-desc">
        Pots combinar fins a 3 descomptes. S&apos;apliquen automàticament al preu final.
      </p>

      {/* Early Bird */}
      <div className={`wizard-discount-block${earlyBirdActive ? " wizard-discount-block--active" : " wizard-discount-block--expired"}`}>
        <div className="wizard-discount-head">
          <span className="wizard-discount-pct wizard-discount-pct--fire">🔥 −10 %</span>
          <div>
            <strong>Early Bird</strong>
            {earlyBirdActive
              ? <span className="wizard-discount-status wizard-discount-status--on">Actiu · {daysLeft} {daysLeft === 1 ? "dia" : "dies"} restants</span>
              : <span className="wizard-discount-status wizard-discount-status--off">Caducat</span>
            }
          </div>
        </div>
        <p className="wizard-discount-desc">S&apos;aplica automàticament a tots els paquets. No cal fer res.</p>
      </div>

      {/* Social share */}
      <div className={`wizard-discount-block${socialShareDone ? " wizard-discount-block--active" : ""}`}>
        <div className="wizard-discount-head">
          <span className="wizard-discount-pct wizard-discount-pct--blue">📲 −5 %</span>
          <div>
            <strong>Descompte social</strong>
            {socialShareDone && <span className="wizard-discount-status wizard-discount-status--on">Activat ✓</span>}
          </div>
        </div>
        <p className="wizard-discount-desc">
          Comparteix el torneig amb 5 amics per WhatsApp i segueix <strong>@cbgrupbarna</strong> a Instagram.
        </p>
        <div className="wizard-social-actions">
          <a
            href={`https://wa.me/?text=${encodeURIComponent("Vine al 3×3 Westfield Glòries 2026! Torneig FIBA a Barcelona el 6-7 juny. 2.000€ premi en metàl·lic. Inscriu-te: https://cbgrupbarna-3x3timechamber.com/inscripcion 🏀")}`}
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
            📸 Segueix @cbgrupbarna
          </a>
          <label className="wizard-social-confirm">
            <input type="checkbox" checked={socialShareDone} onChange={(e) => onSocialDone(e.target.checked)} />
            <span>Ho he fet — activa el −5 % ✓</span>
          </label>
          {socialShareDone && <p className="wizard-social-ok">✅ Descompte social del 5 % activat!</p>}
        </div>
      </div>

      {/* Rival code */}
      <div className={`wizard-discount-block${rivalValid ? " wizard-discount-block--active" : ""}`}>
        <div className="wizard-discount-head">
          <span className="wizard-discount-pct wizard-discount-pct--rival">🏀 −5 €</span>
          <div>
            <strong>Codi rival</strong>
            {rivalValid && <span className="wizard-discount-status wizard-discount-status--on">Codi vàlid ✓</span>}
          </div>
        </div>
        <p className="wizard-discount-desc">
          Si un equip rival t&apos;ha convidat, introdueix el seu codi per obtenir −5 €.
        </p>
        <input
          type="text"
          value={rivalCode}
          onChange={(e) => onRivalCode(e.target.value)}
          placeholder="RIVAL-ABCDE (deixa en blanc si no en tens)"
          maxLength={20}
          className={`wizard-rival-code-input${rivalValid ? " wizard-rival-code-input--valid" : ""}`}
        />
        {rivalValid
          ? <span className="wizard-rival-code-ok">✓ Codi vàlid — −5 € aplicats</span>
          : rivalCode.length > 0
            ? <span className="wizard-rival-code-hint">Format incorrecte. Ha de ser RIVAL-XXXXX</span>
            : null
        }
      </div>

      <div className="wizard-nav" style={{ marginTop: 28 }}>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext}>
          Continuar al formulari →
        </button>
      </div>
    </div>
  );
}

// ── Step 2 — Equip + Capità ────────────────────────────────────────────────

function Step2Team({
  state,
  pkg,
  disc,
  selectPackage,
  updateCaptain,
  updateTutor,
  setTeamName,
  setCategory,
  onPrev,
  onNext,
  canAdvance,
}: {
  state: WizardState;
  pkg: Package | null;
  disc: DiscountResult;
  selectPackage: (k: PackageKey) => void;
  updateCaptain: <K extends keyof Captain>(k: K, v: Captain[K]) => void;
  updateTutor: <K extends keyof Tutor>(k: K, v: Tutor[K]) => void;
  setTeamName: (v: string) => void;
  setCategory: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
  canAdvance: boolean;
}) {
  const earlyBirdActive = isEarlyBirdActive();

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Dades de l&apos;equip</h2>

      {/* Active discounts badge */}
      {(disc.totalDiscount > 0) && (
        <div className="wizard-active-discounts">
          {disc.earlyBirdAmt > 0 && <span className="wizard-active-badge wizard-active-badge--eb">🔥 Early Bird −10 %</span>}
          {disc.socialAmt > 0 && <span className="wizard-active-badge wizard-active-badge--social">📲 Social −5 %</span>}
          {disc.rivalAmt > 0 && <span className="wizard-active-badge wizard-active-badge--rival">🏀 Rival −5 €</span>}
          <span className="wizard-active-badge-note">ja aplicat als preus</span>
        </div>
      )}

      {/* Paquet */}
      <h3 className="wizard-section-title">Modalitat *</h3>
      <div className="wizard-pkg-grid">
        {PACKAGES.map((p) => {
          const isSelected = state.packageKey === p.key;
          const preview = calcDiscount(p.price, { earlyBird: earlyBirdActive, social: state.socialShareDone, rivalValid: isRivalCodeValid(state.rivalCode) });
          const hasDiscount = preview.totalDiscount > 0;
          return (
            <button
              key={p.key}
              type="button"
              className={`wizard-pkg-card${isSelected ? " wizard-pkg-card--selected" : ""}`}
              onClick={() => selectPackage(p.key)}
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

      {/* Categoria */}
      <div className="wizard-field wizard-field-full" style={{ marginTop: 8 }}>
        <label>Categoria *</label>
        <select value={state.category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Tria la categoria…</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Nom equip */}
      {state.packageKey && state.packageKey !== "individual" && (
        <div className="wizard-field wizard-field-full">
          <label>Nom de l&apos;equip *</label>
          <input
            type="text"
            value={state.teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Ex: Lakers BCN, Fire Girls, Street Ballers…"
            maxLength={60}
            required
          />
        </div>
      )}

      {/* Capità / Tutor */}
      <h3 className="wizard-section-title" style={{ marginTop: 28 }}>
        {state.needsTutor ? "Tutor/a (responsable adult)" : "Capità / Capitana"}
      </h3>
      {state.needsTutor && (
        <p style={{ marginBottom: 12, color: "#aaa", fontSize: 14 }}>
          Per a categories formatives cal el contacte d&apos;un adult responsable.
        </p>
      )}

      <div className="wizard-grid-2">
        <div className="wizard-field wizard-field-full">
          <label>Nom i cognoms *</label>
          <input type="text" value={state.captain.fullName} onChange={(e) => updateCaptain("fullName", e.target.value)} placeholder="Anna García López" required maxLength={80} />
        </div>
        <div className="wizard-field">
          <label>Telèfon (WhatsApp) *</label>
          <input type="tel" value={state.captain.phone} onChange={(e) => updateCaptain("phone", e.target.value)} placeholder="+34 600 000 000" required maxLength={20} />
        </div>
        <div className="wizard-field">
          <label>Email *</label>
          <input type="email" value={state.captain.email} onChange={(e) => updateCaptain("email", e.target.value)} placeholder="capitana@email.com" required maxLength={100} />
        </div>
        <div className="wizard-field">
          <label>Talla samarreta *</label>
          <select value={state.captain.shirtSize} onChange={(e) => updateCaptain("shirtSize", e.target.value)} required>
            <option value="">Talla…</option>
            {SHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Capità menor (si formativa) */}
      {state.needsTutor && (
        <>
          <h3 className="wizard-section-title" style={{ marginTop: 28 }}>Capità/a de l&apos;equip (menor)</h3>
          <div className="wizard-grid-2">
            <div className="wizard-field wizard-field-full">
              <label>Nom i cognoms</label>
              <input type="text" value={state.tutor.fullName} onChange={(e) => updateTutor("fullName", e.target.value)} placeholder="Marc Puig Torres" maxLength={80} />
            </div>
            <div className="wizard-field">
              <label>Telèfon</label>
              <input type="tel" value={state.tutor.phone} onChange={(e) => updateTutor("phone", e.target.value)} placeholder="+34 600 000 000" maxLength={20} />
            </div>
            <div className="wizard-field">
              <label>Email <span style={{ fontWeight: 400, color: "#888" }}>(opcional per a menors)</span></label>
              <input type="email" value={state.tutor.email} onChange={(e) => updateTutor("email", e.target.value)} placeholder="capitan@email.com" maxLength={100} />
            </div>
          </div>
        </>
      )}

      <div className="wizard-nav" style={{ marginTop: 32 }}>
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev}>← Enrere</button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Continuar al pagament →
        </button>
      </div>
    </div>
  );
}

// ── Step 3 — Pagament ──────────────────────────────────────────────────────

function Step3Payment({
  pkg,
  disc,
  teamName,
  proofFileName,
  onFile,
  onPrev,
  onNext,
  canAdvance,
}: {
  pkg: Package;
  disc: DiscountResult;
  teamName: string;
  proofFileName: string;
  onFile: (f: File | null) => void;
  onPrev: () => void;
  onNext: () => void;
  canAdvance: boolean;
}) {
  const finalPrice = disc.finalPrice > 0 ? disc.finalPrice : pkg.price;
  const concept = `${(teamName || "EQUIP").toUpperCase().replace(/\s+/g, " ")} 3X3`;

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Fes la transferència</h2>
      <p className="wizard-step-desc">
        Transfereix l&apos;import al compte del club i adjunta el justificant aquí sota. Validem en menys de 24h.
      </p>

      <div className="wizard-iban-box">
        <div className="wizard-iban-row">
          <span className="wizard-iban-label">Import</span>
          <div className="wizard-iban-value-wrap">
            <strong className="wizard-iban-amount">
              {disc.totalDiscount > 0
                ? <><s style={{ color: "rgba(255,255,255,.3)", fontWeight: 400 }}>{pkg.price} €</s>{" "}{finalPrice.toFixed(2).replace(".00", "")} €</>
                : <>{pkg.price} €</>
              }
            </strong>
            {disc.earlyBirdAmt > 0 && <span className="wizard-iban-discount-badge">🔥 −{disc.earlyBirdAmt.toFixed(2).replace(".00", "")} €</span>}
            {disc.socialAmt > 0 && <span className="wizard-iban-discount-badge">📲 −{disc.socialAmt.toFixed(2).replace(".00", "")} €</span>}
            {disc.rivalAmt > 0 && <span className="wizard-iban-discount-badge">🏀 −{disc.rivalAmt} €</span>}
          </div>
        </div>
        <div className="wizard-iban-row">
          <span className="wizard-iban-label">IBAN</span>
          <div className="wizard-iban-value-wrap">
            <strong className="wizard-iban-mono">{IBAN_INFO.iban}</strong>
            <CopyBtn text={IBAN_INFO.iban.replace(/\s/g, "")} label="IBAN" />
          </div>
        </div>
        <div className="wizard-iban-row">
          <span className="wizard-iban-label">Beneficiari</span>
          <strong>{IBAN_INFO.beneficiary}</strong>
        </div>
        <div className="wizard-iban-row">
          <span className="wizard-iban-label">Concepte</span>
          <div className="wizard-iban-value-wrap">
            <strong className="wizard-iban-mono">{concept}</strong>
            <CopyBtn text={concept} label="concepte" />
          </div>
        </div>
      </div>

      <p className="wizard-help" style={{ marginTop: 6, marginBottom: 24 }}>
        ⚠️ Posa exactament aquest concepte perquè puguem identificar el teu equip.
      </p>

      <div className="wizard-field wizard-field-full">
        <label htmlFor="proof">
          Justificant de la transferència *{" "}
          <span style={{ fontWeight: 400, color: "#888" }}>JPG, PNG o PDF · màx. 5 MB</span>
        </label>
        <input
          id="proof"
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => onFile(e.target.files?.[0] || null)}
        />
        {proofFileName
          ? <p className="wizard-help wizard-help-success">✓ Fitxer adjuntat: <strong>{proofFileName}</strong></p>
          : <p className="wizard-help">Si encara no has fet la transferència, fes-la ara i adjunta el rebut.</p>
        }
      </div>

      <div className="wizard-nav">
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev}>← Enrere</button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Continuar →
        </button>
      </div>
    </div>
  );
}

// ── Step 4 — Jugadors ──────────────────────────────────────────────────────

function Step4Players({
  pkg,
  players,
  teamCategory,
  updatePlayer,
  addPlayer,
  removePlayer,
  onPrev,
  onNext,
  canAdvance,
}: {
  pkg: Package;
  players: Player[];
  teamCategory: string;
  updatePlayer: (idx: number, patch: Partial<Player>) => void;
  addPlayer: () => void;
  removePlayer: (idx: number) => void;
  onPrev: () => void;
  onNext: () => void;
  canAdvance: boolean;
}) {
  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Jugadors ({players.length}/{pkg.maxPlayers})</h2>
      <p className="wizard-step-desc">
        Mínim {pkg.minPlayers}, màxim {pkg.maxPlayers}. El mail és opcional per a menors.
      </p>

      {players.map((p, idx) => (
        <div key={idx} className="wizard-player-card">
          <div className="wizard-player-head">
            <strong>Jugador/a {idx + 1}</strong>
            {players.length > pkg.minPlayers && (
              <button type="button" className="wizard-player-remove" onClick={() => removePlayer(idx)}>Eliminar</button>
            )}
          </div>

          <div className="wizard-grid-2">
            <div className="wizard-field wizard-field-full">
              <label>Nom i cognoms *</label>
              <input type="text" value={p.fullName} onChange={(e) => updatePlayer(idx, { fullName: e.target.value })} required maxLength={80} />
            </div>
            <div className="wizard-field">
              <label>Club d&apos;origen *</label>
              <input type="text" value={p.club} onChange={(e) => updatePlayer(idx, { club: e.target.value })} placeholder="CB Grup Barna, Sense club…" required maxLength={60} />
            </div>
            <div className="wizard-field">
              <label>Categoria *</label>
              <select value={p.category} onChange={(e) => updatePlayer(idx, { category: e.target.value })} required>
                <option value="">Tria…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="wizard-field">
              <label>Any de naixement *</label>
              <input
                type="text"
                value={p.birthYear}
                onChange={(e) => updatePlayer(idx, { birthYear: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                placeholder="2005"
                maxLength={4}
                inputMode="numeric"
                required
              />
            </div>
            <div className="wizard-field">
              <label>Gènere *</label>
              <select value={p.gender} onChange={(e) => updatePlayer(idx, { gender: e.target.value })} required>
                <option value="">Tria…</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="wizard-field">
              <label>Telèfon *</label>
              <input type="tel" value={p.phone} onChange={(e) => updatePlayer(idx, { phone: e.target.value })} placeholder="+34 600 000 000" required maxLength={20} />
            </div>
            <div className="wizard-field">
              <label>Talla samarreta *</label>
              <select value={p.shirtSize} onChange={(e) => updatePlayer(idx, { shirtSize: e.target.value })} required>
                <option value="">Talla…</option>
                {SHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="wizard-field">
              <label>Email <span style={{ fontWeight: 400, color: "#888" }}>(opcional per a menors)</span></label>
              <input type="email" value={p.email} onChange={(e) => updatePlayer(idx, { email: e.target.value })} placeholder="jugador@email.com" maxLength={100} />
            </div>
          </div>
        </div>
      ))}

      {players.length < pkg.maxPlayers && (
        <button type="button" className="wizard-add-player" onClick={addPlayer}>
          + Afegir jugador/a ({players.length + 1}/{pkg.maxPlayers})
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

// ── Step 5 — Confirmació ───────────────────────────────────────────────────

function Step5Confirm({
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
        En menys de 24h et confirmem la plaça per WhatsApp i email.
      </p>

      <div className="wizard-summary">
        <div className="wizard-summary-row"><span>Paquet</span><strong>{pkg.emoji} {pkg.title}</strong></div>
        {pkg.isTeam && state.teamName && <div className="wizard-summary-row"><span>Equip</span><strong>{state.teamName}</strong></div>}
        <div className="wizard-summary-row"><span>Categoria</span><strong>{state.category}</strong></div>
        <div className="wizard-summary-row"><span>{state.needsTutor ? "Tutor/a" : "Capità/a"}</span><strong>{state.captain.fullName} · {state.captain.phone}</strong></div>
        {state.needsTutor && state.tutor.fullName && <div className="wizard-summary-row"><span>Capità/a equip</span><strong>{state.tutor.fullName}</strong></div>}
        {pkg.isTeam && <div className="wizard-summary-row"><span>Jugadors</span><strong>{state.players.length}</strong></div>}
        <div className="wizard-summary-row"><span>Justificant</span><strong>{state.proofFileName || "—"}</strong></div>
        {disc.earlyBirdAmt > 0 && <div className="wizard-summary-row wizard-summary-row-discount"><span>🔥 Early Bird −10 %</span><strong>−{disc.earlyBirdAmt.toFixed(2).replace(".00", "")} €</strong></div>}
        {disc.socialAmt > 0 && <div className="wizard-summary-row wizard-summary-row-discount"><span>📲 Social −5 %</span><strong>−{disc.socialAmt.toFixed(2).replace(".00", "")} €</strong></div>}
        {disc.rivalAmt > 0 && <div className="wizard-summary-row wizard-summary-row-discount"><span>🏀 Pack Rival</span><strong>−{disc.rivalAmt} €</strong></div>}
        <div className="wizard-summary-row wizard-summary-row-total">
          <span>Total pagat</span>
          <strong className="wizard-summary-total">
            {disc.totalDiscount > 0
              ? <><s style={{ color: "rgba(255,247,239,.38)", fontWeight: 400 }}>{pkg.price} €</s>{" "}{finalPrice.toFixed(2).replace(".00", "")} €</>
              : <>{pkg.price} €</>
            }
          </strong>
        </div>
      </div>

      <label className="wizard-toggle">
        <input type="checkbox" checked={state.rgpdConsent} onChange={(e) => setRgpd(e.target.checked)} />
        <span>Accepto la política de privadesa i el tractament de les dades (RGPD). *</span>
      </label>
      <label className="wizard-toggle">
        <input type="checkbox" checked={state.imageRightsConsent} onChange={(e) => setImageRights(e.target.checked)} />
        <span>Autoritzo l&apos;organització a fer fotos/vídeos durant el torneig per a difusió del club. *</span>
      </label>

      {error && <p className="wizard-error">⚠️ Error: {error}. Torna-ho a provar o escriu-nos per WA.</p>}

      <div className="wizard-nav">
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev} disabled={submitting}>← Enrere</button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onSubmit} disabled={!canSubmit || submitting}>
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
  teamName,
}: {
  teamId: string;
  playerIds: string[];
  disc: DiscountResult;
  pkg: Package;
  teamName: string;
}) {
  const checkInUrl = `https://cbgrupbarna-3x3timechamber.com/check-in/${teamId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(checkInUrl)}`;
  const finalPrice = disc.finalPrice > 0 ? disc.finalPrice : pkg.price;

  return (
    <div className="wizard-success">
      <span className="wizard-success-emoji">🏀</span>
      <h2>Inscripció enviada!</h2>
      <p>
        {teamName && <><strong>{teamName}</strong> — </>}
        Ja tenim totes les vostres dades. Validem el justificant en menys de 24h i us confirmem la plaça per WhatsApp i email.
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
        <img src={qrUrl} alt={`QR check-in equip ${teamId}`} width={260} height={260} loading="eager" decoding="async" />
        <p><strong>Guarda aquest QR.</strong> Escanejant-lo accedeixes a la teva pàgina de check-in. Fes captura — també t&apos;ho enviarem per email.</p>
      </div>
      <a href={`/check-in/${teamId}`} className="wizard-btn wizard-btn-primary">Obrir pàgina de check-in →</a>
      {playerIds.length > 1 && (
        <details className="wizard-success-details">
          <summary>Codis dels {playerIds.length} jugadors</summary>
          <ul className="wizard-success-player-ids">
            {playerIds.map((id) => <li key={id}><a href={`/jugador/${id}`}><code>{id}</code></a></li>)}
          </ul>
        </details>
      )}
      <p className="wizard-success-tip">El check-in del dia del torneig serà aquí mateix.</p>
      <a href="/" className="wizard-btn wizard-btn-ghost">Tornar a l&apos;inici</a>
    </div>
  );
}
