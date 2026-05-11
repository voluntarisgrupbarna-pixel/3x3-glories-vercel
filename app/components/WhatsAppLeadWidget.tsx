"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type LeadMode = "floating" | "page";

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  question: string;
  message: string;
  consent: boolean;
};

const WHATSAPP_PHONE = "34698425153";

const SHARE_URL = "https://cbgrupbarna-3x3timechamber.com";

function buildShareUrl() {
  const text = [
    "🏀 Juga el 3x3 a Westfield Glòries!",
    "CB Grup Barna organitza el torneig de bàsquet 3x3 urbà el 6-7 de juny.",
    `Inscriu el teu equip 👉 ${SHARE_URL}`,
  ].join("\n");

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

const interestOptions = [
  "3×3 Westfield Glòries",
  "Campus d'Estiu",
  "Portes Obertes club",
  "Patrocinador / col·laboració",
  "Premsa",
  "Altre",
];

const questionOptions = [
  "Vull inscriure el meu equip",
  "Tinc dubtes sobre categories o preus",
  "Vull rebre informació del campus",
  "Vull col·laborar o patrocinar",
  "Vull ser voluntari/a",
  "Altres consultes",
];

const emptyForm: LeadForm = {
  name: "",
  email: "",
  phone: "",
  interest: "3x3 Westfield Glòries",
  question: "Vull inscriure el meu equip",
  message: "",
  consent: false,
};

function buildWhatsappUrl(form: LeadForm) {
  const text = [
    "Hola Ana, acabo de registrar-me des del QR del 3x3 i vull més informació.",
    "",
    `Nom: ${form.name}`,
    `Interès: ${form.interest}`,
    `Consulta: ${form.question}`,
    form.message ? `Missatge: ${form.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export default function WhatsAppLeadWidget({ mode = "floating" }: { mode?: LeadMode }) {
  const [open, setOpen] = useState(mode === "page");
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sharedWA, setSharedWA] = useState(false);
  const [followedIG, setFollowedIG] = useState(false);
  const [error, setError] = useState("");
  const discountUnlocked = sharedWA && followedIG;
  const whatsappUrl = useMemo(() => buildWhatsappUrl(form), [form]);

  useEffect(() => {
    if (mode !== "floating") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("contacte") === "1" || params.get("qr") === "contacte") {
      setOpen(true);
    }
  }, [mode]);

  function updateField<K extends keyof LeadForm>(field: K, value: LeadForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Falten nom, email o telèfon.");
      return;
    }

    if (!form.consent) {
      setError("Cal acceptar el contacte per poder continuar.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          origin: mode === "page" ? "QR contacte 3x3" : "Web 3x3",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "No s'ha pogut guardar el contacte.");
      }

      setSubmitted(true);
    } catch (leadError) {
      setError(leadError instanceof Error ? leadError.message : "No s'ha pogut guardar el contacte.");
    } finally {
      setSubmitting(false);
    }
  }

  const successPanel = (
    <div className="wa-lead-panel wa-success-panel">
      <div className="wa-lead-header">
        <div className="wa-lead-avatar" aria-hidden="true">
          <span />
        </div>
        <div>
          <h2>{discountUnlocked ? "10% activat! 🎉" : "Tot llest! ✅"}</h2>
          <p>{discountUnlocked ? "Descompte aplicat a la teva inscripció" : "Fes les 2 accions i obtén un 10% off"}</p>
        </div>
        {mode === "floating" && (
          <button
            className="wa-lead-close"
            type="button"
            aria-label="Tancar"
            onClick={() => { setOpen(false); setSubmitted(false); setSharedWA(false); setFollowedIG(false); }}
          >
            ×
          </button>
        )}
      </div>

      <div className="wa-lead-body">
        {discountUnlocked ? (
          <div className="wa-discount-badge">
            <span className="wa-discount-pct">−10%</span>
            <span className="wa-discount-txt">Presenta aquesta pantalla el dia del torneig per aplicar el descompte a la teva inscripció.</span>
          </div>
        ) : (
          <p className="wa-success-msg">
            Hem guardat el teu contacte. Fes les 2 accions per desbloquejar el <strong>10% de descompte</strong> a la inscripció.
          </p>
        )}

        <a
          className={`wa-share-btn${sharedWA ? " wa-action-done" : ""}`}
          href={buildShareUrl()}
          target="_blank"
          rel="noreferrer"
          onClick={() => setSharedWA(true)}
        >
          <span aria-hidden="true">{sharedWA ? "✅" : "📲"}</span>
          {sharedWA ? "Compartit!" : "Comparteix el 3x3 amb 5 amics"}
        </a>

        <a
          className={`wa-insta-btn${followedIG ? " wa-action-done" : ""}`}
          href="https://www.instagram.com/cbgrupbarna/"
          target="_blank"
          rel="noreferrer"
          onClick={() => setFollowedIG(true)}
        >
          <span aria-hidden="true">{followedIG ? "✅" : "📸"}</span>
          {followedIG ? "Seguit!" : "Segueix @cbgrupbarna a Instagram"}
        </a>

        <a
          className="wa-whatsapp-link"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
        >
          Parla ara amb Ana per WhatsApp →
        </a>
      </div>
    </div>
  );

  const panel = (
    <form className="wa-lead-panel" onSubmit={submitLead}>
      <div className="wa-lead-header">
        <div className="wa-lead-avatar" aria-hidden="true">
          <span />
        </div>
        <div>
          <h2>Pregunta&apos;ns per WhatsApp</h2>
          <p>T&apos;enviem novetats quan hi hagi</p>
        </div>
        {mode === "floating" && (
          <button
            className="wa-lead-close"
            type="button"
            aria-label="Tancar formulari"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        )}
      </div>

      <div className="wa-lead-body">
        <label className="wa-field wa-field-full">
          <span className="wa-field-label">Nom i cognoms *</span>
          <input
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Ex: Maria García López"
            required
          />
        </label>

        <label className="wa-field">
          <span className="wa-field-label">Email *</span>
          <input
            autoComplete="email"
            inputMode="email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="el-teu@email.com"
            required
          />
        </label>

        <label className="wa-field">
          <span className="wa-field-label">El teu telèfon *</span>
          <input
            autoComplete="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="600 000 000"
            required
          />
        </label>

        <fieldset className="wa-choice-group wa-field-full">
          <legend>Tipus d&apos;interès *</legend>
          <div className="wa-choice-grid">
            {interestOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={form.interest === option ? "active" : ""}
                onClick={() => updateField("interest", option)}
              >
                {form.interest === option && <span aria-hidden="true">✓</span>}
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="wa-choice-group wa-field-full">
          <legend>Sobre què preguntes? *</legend>
          <div className="wa-question-list">
            {questionOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={form.question === option ? "active" : ""}
                onClick={() => updateField("question", option)}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="wa-field wa-field-full">
          <span className="wa-field-label">Missatge opcional</span>
          <textarea
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Explica'ns breument què necessites"
            rows={3}
          />
        </label>

        <label className="wa-consent wa-field-full">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(event) => updateField("consent", event.target.checked)}
            required
          />
          <span>
            Accepto que CB Grup Barna em contacti per WhatsApp, telèfon o email per informar-me sobre
            activitats i esdeveniments del club.
          </span>
        </label>

        {error && <p className="wa-lead-error">{error}</p>}

        <button className="wa-submit wa-field-full" type="submit" disabled={submitting}>
          {submitting ? "Guardant contacte..." : "Continuar per WhatsApp"}
        </button>
      </div>
    </form>
  );

  if (mode === "page") {
    return <div className="wa-lead-page-wrap">{submitted ? successPanel : panel}</div>;
  }

  return (
    <>
      <button className="wa-floating-button" type="button" onClick={() => setOpen(true)}>
        <span aria-hidden="true" />
        Pregunta&apos;ns
      </button>
      {open && (
        <div className="wa-lead-overlay" role="dialog" aria-modal="true" aria-label="Formulari de contacte WhatsApp">
          {submitted ? successPanel : panel}
        </div>
      )}
    </>
  );
}
