"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const POSITIONS = ["Base", "Aler", "Pivot", "Indiferent"];
const LEVELS = ["Iniciació", "Mig", "Avançat", "Federat"];
const SIZES = ["12-14", "XS", "S", "M", "L", "XL", "XXL"];
const GENDERS = ["Masculí", "Femení", "Altre"];

type FormState = {
  fullName: string;
  birthDate: string;
  gender: string;
  position: string;
  level: string;
  shirtSize: string;
  club: string;
  phone: string;
  email: string;
  comments: string;
  consent: boolean;
};

const INITIAL: FormState = {
  fullName: "",
  birthDate: "",
  gender: "",
  position: "",
  level: "",
  shirtSize: "",
  club: "",
  phone: "",
  email: "",
  comments: "",
  consent: false,
};

function isValid(s: FormState): boolean {
  return Boolean(
    s.fullName.trim() &&
      s.birthDate &&
      s.gender &&
      s.position &&
      s.level &&
      s.shirtSize &&
      s.club.trim() &&
      s.phone.trim() &&
      s.email.trim() &&
      s.consent,
  );
}

function getMissing(s: FormState): string[] {
  const m: string[] = [];
  if (!s.fullName.trim()) m.push("Nom i cognoms");
  if (!s.birthDate) m.push("Data de naixement");
  if (!s.gender) m.push("Categoria");
  if (!s.position) m.push("Posició preferida");
  if (!s.level) m.push("Nivell");
  if (!s.shirtSize) m.push("Talla samarreta");
  if (!s.club.trim()) m.push("Club d'origen (escriu 'Sense club' si no en tens)");
  if (!s.phone.trim()) m.push("Telèfon");
  if (!s.email.trim()) m.push("Email");
  if (!s.consent) m.push("Casella de consentiment (✓ al final)");
  return m;
}

export default function IndividualSignupForm() {
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Marca el formulari com a hidritat (es executa sols client-side)
  useEffect(() => {
    formRef.current?.setAttribute("data-individual-ready", "true");
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
    setSubmitted(false);
  }

  const message = useMemo(() => {
    if (!isValid(state)) return "";
    return [
      `🏀 *Inscripció individual 3×3 Westfield Glòries 2026*`,
      ``,
      `*Nom:* ${state.fullName}`,
      `*Naixement:* ${state.birthDate}`,
      `*Categoria/gènere:* ${state.gender}`,
      `*Posició:* ${state.position}`,
      `*Nivell:* ${state.level}`,
      `*Talla samarreta:* ${state.shirtSize}`,
      `*Club d'origen:* ${state.club}`,
      `*Telèfon:* ${state.phone}`,
      `*Email:* ${state.email}`,
      state.comments ? `*Comentaris:* ${state.comments}` : null,
      ``,
      `Confirmo el pagament de 20 € i accepto rebre confirmació al meu equip 1 setmana abans del torneig.`,
    ]
      .filter((line) => line !== null)
      .join("\n");
  }, [state]);

  const waLink = useMemo(() => {
    if (!message) return "";
    return `https://wa.me/34698425153?text=${encodeURIComponent(message)}`;
  }, [message]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid(state)) return;
    setSubmitted(true);
  }

  return (
    <form className="solo-form" ref={formRef} onSubmit={handleSubmit}>
      <div className="solo-form-grid">
        <div className="solo-field solo-field-full">
          <label htmlFor="full-name">Nom i cognoms *</label>
          <input
            id="full-name"
            type="text"
            value={state.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Ex: Marta Puig Roca"
            required
            maxLength={80}
          />
        </div>

        <div className="solo-field">
          <label htmlFor="birth-date">Data de naixement *</label>
          <input
            id="birth-date"
            type="date"
            value={state.birthDate}
            onChange={(e) => update("birthDate", e.target.value)}
            required
            max="2020-12-31"
            min="1940-01-01"
          />
        </div>

        <div className="solo-field">
          <label htmlFor="gender">Categoria *</label>
          <select
            id="gender"
            value={state.gender}
            onChange={(e) => update("gender", e.target.value)}
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

        <div className="solo-field">
          <label htmlFor="position">Posició preferida *</label>
          <select
            id="position"
            value={state.position}
            onChange={(e) => update("position", e.target.value)}
            required
          >
            <option value="">Tria…</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="solo-field">
          <label htmlFor="level">Nivell *</label>
          <select id="level" value={state.level} onChange={(e) => update("level", e.target.value)} required>
            <option value="">Tria…</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="solo-field">
          <label htmlFor="shirt">Talla samarreta *</label>
          <select
            id="shirt"
            value={state.shirtSize}
            onChange={(e) => update("shirtSize", e.target.value)}
            required
          >
            <option value="">Tria…</option>
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="solo-field">
          <label htmlFor="club">Club d&apos;origen * <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,247,239,0.5)" }}>(escriu "Sense club" si no en tens)</span></label>
          <input
            id="club"
            type="text"
            value={state.club}
            onChange={(e) => update("club", e.target.value)}
            placeholder="CB Grup Barna · Sense club · Escola…"
            required
            maxLength={60}
          />
        </div>

        <div className="solo-field">
          <label htmlFor="phone">Telèfon (WhatsApp) *</label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={state.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+34 600 000 000"
            required
            maxLength={20}
          />
        </div>

        <div className="solo-field">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={state.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="tu@email.com"
            required
            maxLength={120}
          />
        </div>

        <div className="solo-field solo-field-full">
          <label htmlFor="comments">Comentaris (opcional)</label>
          <textarea
            id="comments"
            value={state.comments}
            onChange={(e) => update("comments", e.target.value)}
            placeholder="Lesions, preferències de companys, restriccions alimentàries…"
            rows={3}
            maxLength={400}
          />
        </div>

        <label className="solo-consent solo-field-full" style={{
          background: !state.consent ? "rgba(240,140,0,0.07)" : "rgba(37,211,102,0.07)",
          border: `1.5px solid ${!state.consent ? "rgba(240,140,0,0.35)" : "rgba(37,211,102,0.3)"}`,
          borderRadius: 10,
          padding: "12px 14px",
        }}>
          <input
            type="checkbox"
            checked={state.consent}
            onChange={(e) => update("consent", e.target.checked)}
            required
          />
          <span>
            Accepto rebre comunicacions del club via WhatsApp i email sobre la meva inscripció, i la{" "}
            <a href="/avis-legal" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
              política de tractament de dades (RGPD)
            </a>
            . *
          </span>
        </label>
      </div>

      {/* Missatge d'ajuda: mostra quins camps falten */}
      {!isValid(state) && (() => {
        const missing = getMissing(state);
        return missing.length > 0 ? (
          <div style={{
            background: "rgba(240,140,0,0.08)",
            border: "1px solid rgba(240,140,0,0.3)",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 12,
            fontSize: 13,
            color: "#f08c00",
            lineHeight: 1.6,
          }}>
            <strong>⚠️ Completa aquests camps per continuar:</strong>
            <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
              {missing.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ) : null;
      })()}

      {!submitted ? (
        <button type="submit" className="solo-submit" disabled={!isValid(state)}
          title={!isValid(state) ? "Completa tots els camps obligatoris (*)" : undefined}>
          Generar inscripció per WhatsApp →
        </button>
      ) : (
        <div className="solo-preview">
          <span className="solo-preview-label">Dades preparades · revisa abans d'enviar</span>
          <pre className="solo-preview-msg">{message}</pre>
          <div className="solo-preview-actions">
            <a href={waLink} target="_blank" rel="noreferrer" className="solo-wa-btn">
              Enviar per WhatsApp a l'organització →
            </a>
            <button type="button" className="solo-edit-btn" onClick={() => setSubmitted(false)}>
              Editar
            </button>
          </div>
          <p className="solo-tip">
            S'obrirà el WhatsApp de l'organització (+34 698 425 153) amb totes les teves dades ja escrites.
            Només cal que cliquis enviar. Confirmem la plaça en menys de 24h.
          </p>
        </div>
      )}
    </form>
  );
}
