"use client";

import { useMemo, useState } from "react";
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
} from "./wizardData";

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
  packageKey: PackageKey | null;
  teamName: string;
  category: string;
  captain: ContactPerson;
  tutor: ContactPerson;
  needsTutor: boolean;
  proofFileName: string;
  proofBase64: string;
  proofMime: string;
  players: Player[];
  rgpdConsent: boolean;
  imageRightsConsent: boolean;
  refCode: string;
};

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

const STEPS = [
  { id: 1, label: "Paquet" },
  { id: 2, label: "Contactes" },
  { id: 3, label: "Pagament" },
  { id: 4, label: "Jugadors" },
  { id: 5, label: "Confirma" },
];

type Props = {
  initialRefCode?: string;
};

export default function InscripcioWizard({ initialRefCode }: Props) {
  const [state, setState] = useState<WizardState>(() => ({
    step: 1,
    packageKey: null,
    teamName: "",
    category: "",
    captain: emptyContact(),
    tutor: emptyContact(),
    needsTutor: false,
    proofFileName: "",
    proofBase64: "",
    proofMime: "",
    players: [],
    rgpdConsent: false,
    imageRightsConsent: false,
    refCode: initialRefCode || "",
  }));

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<null | {
    ok: boolean;
    teamId?: string;
    playerIds?: string[];
    error?: string;
  }>(null);

  const pkg: Package | null = useMemo(
    () => PACKAGES.find((p) => p.key === state.packageKey) || null,
    [state.packageKey],
  );

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
    const initial = p.minPlayers;
    for (let i = 0; i < initial; i++) players.push(emptyPlayer());
    setState((prev) => ({ ...prev, packageKey: key, players, teamName: p.isTeam ? prev.teamName : "" }));
  }

  function addPlayer() {
    if (!pkg || state.players.length >= pkg.maxPlayers) return;
    setState((prev) => ({ ...prev, players: [...prev.players, emptyPlayer()] }));
  }

  function removePlayer(idx: number) {
    if (!pkg || state.players.length <= pkg.minPlayers) return;
    setState((prev) => {
      const next = prev.players.filter((_, i) => i !== idx);
      return { ...prev, players: next };
    });
  }

  function next() {
    setState((prev) => ({ ...prev, step: Math.min(5, prev.step + 1) }));
  }

  function prev() {
    setState((prev) => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }

  async function handleFileChange(file: File | null) {
    if (!file) {
      setState((prev) => ({ ...prev, proofFileName: "", proofBase64: "", proofMime: "" }));
      return;
    }
    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("El fitxer és massa gran (màxim 5 MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] || "";
      setState((prev) => ({
        ...prev,
        proofFileName: file.name,
        proofBase64: base64,
        proofMime: file.type,
      }));
    };
    reader.readAsDataURL(file);
  }

  // === Validation per step ===
  const canAdvanceStep1 = state.packageKey !== null;

  const canAdvanceStep2 = useMemo(() => {
    if (!pkg) return false;
    if (pkg.isTeam && !state.teamName.trim()) return false;
    if (!state.category) return false;
    const c = state.captain;
    if (!c.fullName.trim() || !c.phone.trim() || !c.email.trim() || !c.dni.trim()) return false;
    if (state.needsTutor) {
      const t = state.tutor;
      if (!t.fullName.trim() || !t.phone.trim() || !t.email.trim() || !t.dni.trim()) return false;
    }
    return true;
  }, [pkg, state.teamName, state.category, state.captain, state.tutor, state.needsTutor]);

  const canAdvanceStep3 = state.proofBase64.length > 0;

  const canAdvanceStep4 = useMemo(() => {
    if (!state.players.length) return false;
    return state.players.every(
      (p) =>
        p.fullName.trim() &&
        p.birthDate &&
        p.gender &&
        p.position &&
        p.level &&
        p.shirtSize &&
        (!p.federated || p.federationKey.trim()),
    );
  }, [state.players]);

  const canSubmit = state.rgpdConsent && state.imageRightsConsent;

  // === Submission ===
  async function handleSubmit() {
    if (submitting || !canSubmit || !pkg) return;
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const payload = {
        packageKey: state.packageKey,
        packageTitle: pkg.title,
        packagePrice: pkg.price,
        teamName: state.teamName,
        category: state.category,
        captain: state.captain,
        tutor: state.needsTutor ? state.tutor : null,
        players: state.players,
        proof: {
          fileName: state.proofFileName,
          mime: state.proofMime,
          base64: state.proofBase64,
        },
        rgpdConsent: state.rgpdConsent,
        imageRightsConsent: state.imageRightsConsent,
        refCode: state.refCode || null,
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/inscripcio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setSubmitResult({ ok: true, teamId: data.teamId, playerIds: data.playerIds });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconegut";
      setSubmitResult({ ok: false, error: msg });
    } finally {
      setSubmitting(false);
    }
  }

  // === Auto-detect "needs tutor" by captain birth date is not available, so toggle manual ===
  // (Tutor decision is shown explicitly to the user)

  // === Render ===
  if (submitResult?.ok) {
    return <SuccessPanel teamId={submitResult.teamId!} playerIds={submitResult.playerIds || []} />;
  }

  return (
    <div className="wizard">
      <Stepper currentStep={state.step} />

      {state.step === 1 && (
        <Step1Package
          selected={state.packageKey}
          onSelect={selectPackage}
          onNext={next}
          canAdvance={canAdvanceStep1}
        />
      )}

      {state.step === 2 && pkg && (
        <Step2Contacts
          pkg={pkg}
          state={state}
          updateCaptain={updateCaptain}
          updateTutor={updateTutor}
          setTeamName={(v) => update("teamName", v)}
          setCategory={(v) => update("category", v)}
          setNeedsTutor={(v) => update("needsTutor", v)}
          onPrev={prev}
          onNext={next}
          canAdvance={canAdvanceStep2}
        />
      )}

      {state.step === 3 && pkg && (
        <Step3Payment
          pkg={pkg}
          state={state}
          onFile={handleFileChange}
          onPrev={prev}
          onNext={next}
          canAdvance={canAdvanceStep3}
        />
      )}

      {state.step === 4 && pkg && (
        <Step4Players
          pkg={pkg}
          players={state.players}
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

// ============== Stepper ==============
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

// ============== Step 1 ==============
function Step1Package({
  selected,
  onSelect,
  onNext,
  canAdvance,
}: {
  selected: PackageKey | null;
  onSelect: (k: PackageKey) => void;
  onNext: () => void;
  canAdvance: boolean;
}) {
  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Tria el teu paquet</h2>
      <p className="wizard-step-desc">Selecciona com vols participar al 3×3 Westfield Glòries 2026.</p>
      <div className="wizard-pkg-grid">
        {PACKAGES.map((p) => (
          <button
            key={p.key}
            type="button"
            className={`wizard-pkg-card${selected === p.key ? " wizard-pkg-card--selected" : ""}`}
            onClick={() => onSelect(p.key)}
          >
            <span className="wizard-pkg-emoji">{p.emoji}</span>
            <div className="wizard-pkg-head">
              <strong>{p.title}</strong>
              <span className="wizard-pkg-subtitle">{p.subtitle}</span>
            </div>
            <span className="wizard-pkg-price">{p.price} €</span>
            <p className="wizard-pkg-desc">{p.description}</p>
          </button>
        ))}
      </div>
      <div className="wizard-nav">
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Continuar →
        </button>
      </div>
    </div>
  );
}

// ============== Step 2 ==============
function Step2Contacts({
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
        <>
          <div className="wizard-field wizard-field-full">
            <label htmlFor="team-name">Nom de l'equip *</label>
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
        </>
      )}

      <div className="wizard-field wizard-field-full">
        <label htmlFor="category">Categoria *</label>
        <select id="category" value={state.category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Tria categoria…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <h3 className="wizard-section-title">
        {pkg.isTeam ? "Capità de l'equip" : "Persona inscrita"}
      </h3>
      <ContactFields
        prefix="captain"
        value={state.captain}
        onChange={updateCaptain}
      />

      <label className="wizard-toggle">
        <input
          type="checkbox"
          checked={state.needsTutor}
          onChange={(e) => setNeedsTutor(e.target.checked)}
        />
        <span>El {pkg.isTeam ? "capità" : "jugador"} és menor d'edat — afegir tutor/a legal</span>
      </label>

      {state.needsTutor && (
        <>
          <h3 className="wizard-section-title">Tutor/a legal</h3>
          <ContactFields prefix="tutor" value={state.tutor} onChange={updateTutor} />
        </>
      )}

      <div className="wizard-nav">
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev}>
          ← Enrere
        </button>
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
        <input
          id={`${prefix}-name`}
          type="text"
          value={value.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          required
          maxLength={80}
        />
      </div>
      <div className="wizard-field">
        <label htmlFor={`${prefix}-dni`}>DNI/NIE *</label>
        <input
          id={`${prefix}-dni`}
          type="text"
          value={value.dni}
          onChange={(e) => onChange("dni", e.target.value.toUpperCase())}
          required
          maxLength={20}
          placeholder="12345678A"
        />
      </div>
      <div className="wizard-field">
        <label htmlFor={`${prefix}-phone`}>Telèfon (WhatsApp) *</label>
        <input
          id={`${prefix}-phone`}
          type="tel"
          value={value.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          required
          maxLength={20}
          placeholder="+34 600 000 000"
        />
      </div>
      <div className="wizard-field">
        <label htmlFor={`${prefix}-email`}>Email *</label>
        <input
          id={`${prefix}-email`}
          type="email"
          value={value.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
          maxLength={120}
        />
      </div>
    </div>
  );
}

// ============== Step 3 ==============
function Step3Payment({
  pkg,
  state,
  onFile,
  onPrev,
  onNext,
  canAdvance,
}: {
  pkg: Package;
  state: WizardState;
  onFile: (f: File | null) => void;
  onPrev: () => void;
  onNext: () => void;
  canAdvance: boolean;
}) {
  const concept = useMemo(() => {
    const cleaned = (state.teamName || state.captain.fullName || "")
      .replace(/[^A-Za-z0-9 ]/g, "")
      .slice(0, 30)
      .trim();
    return `3X3 ${pkg.price}€ ${cleaned}`;
  }, [pkg.price, state.teamName, state.captain.fullName]);

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Pagament</h2>
      <p className="wizard-step-desc">
        Fes la transferència a l'IBAN i puja el justificant. Quan el pugis pots continuar amb les dades dels
        jugadors — l'organització valida el pagament en menys de 24h.
      </p>

      <div className="wizard-payment-box">
        <div className="wizard-payment-row">
          <span className="wizard-payment-label">Import</span>
          <strong className="wizard-payment-value">{pkg.price} €</strong>
        </div>
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
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev}>
          ← Enrere
        </button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Continuar amb els jugadors →
        </button>
      </div>
    </div>
  );
}

// ============== Step 4 ==============
function Step4Players({
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
              <input
                type="text"
                value={p.fullName}
                onChange={(e) => updatePlayer(idx, { fullName: e.target.value })}
                required
                maxLength={80}
              />
            </div>
            <div className="wizard-field">
              <label>Data de naixement *</label>
              <input
                type="date"
                value={p.birthDate}
                onChange={(e) => updatePlayer(idx, { birthDate: e.target.value })}
                max="2020-12-31"
                min="1940-01-01"
                required
              />
            </div>
            <div className="wizard-field">
              <label>Categoria/gènere *</label>
              <select
                value={p.gender}
                onChange={(e) => updatePlayer(idx, { gender: e.target.value })}
                required
              >
                <option value="">Tria…</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="wizard-field">
              <label>Posició *</label>
              <select
                value={p.position}
                onChange={(e) => updatePlayer(idx, { position: e.target.value })}
                required
              >
                <option value="">Tria…</option>
                {POSITIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="wizard-field">
              <label>Nivell *</label>
              <select
                value={p.level}
                onChange={(e) => updatePlayer(idx, { level: e.target.value })}
                required
              >
                <option value="">Tria…</option>
                {LEVELS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="wizard-field">
              <label>Talla samarreta *</label>
              <select
                value={p.shirtSize}
                onChange={(e) => updatePlayer(idx, { shirtSize: e.target.value })}
                required
              >
                <option value="">Tria…</option>
                {SHIRT_SIZES.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="wizard-field">
              <label>Dorsal preferit</label>
              <input
                type="text"
                value={p.dorsal}
                onChange={(e) => updatePlayer(idx, { dorsal: e.target.value })}
                placeholder="Ex: 23"
                maxLength={3}
              />
            </div>
            <div className="wizard-field wizard-field-full">
              <label className="wizard-toggle wizard-toggle-inline">
                <input
                  type="checkbox"
                  checked={p.federated}
                  onChange={(e) => updatePlayer(idx, { federated: e.target.checked })}
                />
                <span>Jugador federat</span>
              </label>
              {p.federated && (
                <input
                  type="text"
                  value={p.federationKey}
                  onChange={(e) => updatePlayer(idx, { federationKey: e.target.value })}
                  placeholder="Llicència federativa *"
                  maxLength={30}
                />
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
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev}>
          ← Enrere
        </button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Revisar i enviar →
        </button>
      </div>
    </div>
  );
}

// ============== Step 5 ==============
function Step5Confirm({
  pkg,
  state,
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
  setRgpd: (v: boolean) => void;
  setImageRights: (v: boolean) => void;
  onPrev: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Revisa i envia</h2>
      <p className="wizard-step-desc">
        Comprova que tot està correcte. Quan envïs, l'organització rep totes les dades, valida el justificant
        i et confirma la inscripció (email + WhatsApp) en menys de 24h.
      </p>

      <div className="wizard-summary">
        <div className="wizard-summary-row">
          <span>Paquet</span>
          <strong>
            {pkg.emoji} {pkg.title} · {pkg.price} €
          </strong>
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
          <strong>
            {state.captain.fullName} · {state.captain.phone}
          </strong>
        </div>
        {state.needsTutor && (
          <div className="wizard-summary-row">
            <span>Tutor/a</span>
            <strong>
              {state.tutor.fullName} · {state.tutor.phone}
            </strong>
          </div>
        )}
        <div className="wizard-summary-row">
          <span>Justificant</span>
          <strong>{state.proofFileName}</strong>
        </div>
        <div className="wizard-summary-row">
          <span>Jugadors</span>
          <strong>{state.players.length}</strong>
        </div>
        {state.refCode && (
          <div className="wizard-summary-row wizard-summary-row-highlight">
            <span>Codi rival</span>
            <strong>{state.refCode}</strong>
          </div>
        )}
      </div>

      <label className="wizard-toggle">
        <input
          type="checkbox"
          checked={state.rgpdConsent}
          onChange={(e) => setRgpd(e.target.checked)}
        />
        <span>
          Accepto la política de privadesa i el tractament de les dades segons la RGPD. *
        </span>
      </label>

      <label className="wizard-toggle">
        <input
          type="checkbox"
          checked={state.imageRightsConsent}
          onChange={(e) => setImageRights(e.target.checked)}
        />
        <span>
          Autoritzo l'organització a fer fotos/vídeos durant el torneig per a difusió del club (xarxes,
          web, premsa). *
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

// ============== Success ==============
function SuccessPanel({ teamId, playerIds }: { teamId: string; playerIds: string[] }) {
  const checkInUrl = `https://cbgrupbarna-3x3timechamber.com/check-in/${teamId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(checkInUrl)}`;

  return (
    <div className="wizard-success">
      <span className="wizard-success-emoji">🏀</span>
      <h2>Inscripció enviada!</h2>
      <p>
        Ja tenim totes les teves dades. L'organització valida el justificant en menys de 24h i et confirmem
        la plaça per email i WhatsApp amb els QR d'accés.
      </p>

      <div className="wizard-success-codes">
        <span className="wizard-success-code-label">Codi d'inscripció</span>
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
          <strong>Guarda aquest QR.</strong> Escanejant-lo accedeixes a la teva pàgina de check-in amb l'estat
          actualitzat de la inscripció. Si vols, fes captura ara — també te l'enviarem per email.
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
                <a href={`/jugador/${id}`}>
                  <code>{id}</code>
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="wizard-success-tip">
        El check-in del dia del torneig serà aquí mateix. Cada jugador també tindrà la seva fitxa
        accessible amb el seu propi QR.
      </p>

      <a href="/" className="wizard-btn wizard-btn-ghost">
        Tornar a l'inici
      </a>
    </div>
  );
}
