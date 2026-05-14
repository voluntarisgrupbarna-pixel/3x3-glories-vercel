"use client";

import { useMemo, useState } from "react";

const POSITIONS = ["Base", "Aler", "Pivot", "Indiferent"];
const LEVELS = ["Iniciació", "Mig", "Avançat", "Federat"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const GENDERS = ["Masculí", "Femení", "Altre"];

type FormState = {
  fullName: string;
  birthDate: string;
  gender: string;
  position: string;
  level: string;
  shirtSize: string;
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
      s.phone.trim() &&
      s.email.trim() &&
      s.consent,
  );
}

export default function IndividualSignupForm() {
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

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
    <form className="solo-form" onSubmit={handleSubmit}>
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
          <label htmlFor="phone">Telèfon (WhatsApp) *</label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
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

        <label className="solo-consent solo-field-full">
          <input
            type="checkbox"
            checked={state.consent}
            onChange={(e) => update("consent", e.target.checked)}
            required
          />
          <span>
            Accepto rebre comunicacions del club via WhatsApp i email sobre la meva inscripció, i la política
            de tractament de dades (RGPD).
          </span>
        </label>
      </div>

      {!submitted ? (
        <button type="submit" className="solo-submit" disabled={!isValid(state)}>
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
