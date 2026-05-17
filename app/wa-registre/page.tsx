"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { WA_PHONE } from "../lib/whatsapp";
import { isEarlyBirdActive, EARLY_BIRD_PCT } from "../inscripcion/wizardData";

/* ── Dades de les categories ──────────────────────────────────────────── */
const CATEGORIES = [
  { label: "Escoleta (nascuts 2018–2019)", price: 75 },
  { label: "Premini (nascuts 2016–2017)", price: 75 },
  { label: "Mini (nascuts 2014–2015)", price: 75 },
  { label: "Infantil (nascuts 2012–2013)", price: 75 },
  { label: "Cadet (nascuts 2010–2011)", price: 75 },
  { label: "Júnior (nascuts 2008–2009)", price: 75 },
  { label: "Sub-23 (nascuts 2003–2007)", price: 75 },
  { label: "Sènior Masculí (fins 2002)", price: 85 },
  { label: "Sènior Femení (fins 2002)", price: 85 },
  { label: "Veterans Masculí (nascuts fins 1986)", price: 75 },
  { label: "Veterans Femení (nascuts fins 1986)", price: 75 },
  { label: "Màgics (esport inclusiu)", price: 75 },
];

const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

type Player = { name: string; year: string; size: string };

type Form = {
  teamName: string;
  category: string;
  captainName: string;
  captainPhone: string;
  captainEmail: string;
  captainSize: string;
  players: Player[];
  consent: boolean;
};

const emptyPlayer = (): Player => ({ name: "", year: "", size: "" });

const emptyForm = (): Form => ({
  teamName: "",
  category: "",
  captainName: "",
  captainPhone: "",
  captainEmail: "",
  captainSize: "",
  players: [emptyPlayer(), emptyPlayer(), emptyPlayer()],
  consent: false,
});

/* ── Construeix el missatge WhatsApp amb les dades del formulari ───────── */
function buildWaMessage(f: Form): string {
  const earlyBird = isEarlyBirdActive();
  const catPrice = CATEGORIES.find((c) => c.label === f.category)?.price ?? 75;
  const finalPrice = earlyBird
    ? Math.round(catPrice * (1 - EARLY_BIRD_PCT) * 100) / 100
    : catPrice;
  const playerLines = f.players
    .map((p, i) =>
      p.name.trim()
        ? `${i + 1}. ${p.name.trim()}${p.year ? ` · ${p.year}` : ""}${p.size ? ` · Talla ${p.size}` : ""}`
        : null
    )
    .filter(Boolean)
    .join("\n");

  return [
    "Hola Ana! 👋 He omplert el formulari d'inscripció al 3×3 Westfield Glòries 2026 (6-7 juny).",
    "",
    `🏀 NOM EQUIP: ${f.teamName}`,
    `📂 CATEGORIA: ${f.category}`,
    "",
    "👤 CAPITÀ/ANA:",
    `   Nom: ${f.captainName}`,
    `   Telèfon: ${f.captainPhone}`,
    f.captainEmail ? `   Email: ${f.captainEmail}` : "",
    f.captainSize ? `   Talla samarreta: ${f.captainSize}` : "",
    "",
    playerLines ? `👥 JUGADORS:\n${playerLines}` : "👥 JUGADORS: (afegiré jugadors a continuació)",
    "",
    earlyBird
      ? `💳 PAGAMENT (${finalPrice} € · Early Bird −10%, preu original ${catPrice} €):`
      : `💳 PAGAMENT (${catPrice} €):`,
    `He fet la transferència a:`,
    "IBAN: ES25 0182 1797 3002 0387 8558",
    "Titular: CB GRUP BARNA",
    `Concepte: ${f.teamName.toUpperCase().replace(/\s+/g, "-")} 3X3`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

/* ── Component principal ──────────────────────────────────────────────── */
export default function WaRegistrePage() {
  const [form, setForm] = useState<Form>(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  /* Validació bàsica */
  function validate(): string {
    if (!form.teamName.trim()) return "Cal el nom de l'equip.";
    if (!form.category) return "Tria una categoria.";
    if (!form.captainName.trim()) return "Cal el nom del capità.";
    if (!form.captainPhone.trim()) return "Cal el telèfon del capità.";
    if (!form.consent) return "Cal acceptar la política de privadesa.";
    return "";
  }

  function updateField<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setError("");
  }

  function updatePlayer(idx: number, patch: Partial<Player>) {
    setForm((f) => {
      const players = [...f.players];
      players[idx] = { ...players[idx], ...patch };
      return { ...f, players };
    });
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    if (submitting) return;

    /* Construeix el missatge WA ABANS del fetch (iOS no permet window.open() async) */
    const waText = buildWaMessage(form);
    const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waText)}`;

    setSubmitting(true);

    /* Guarda a Sheets com a lead en background */
    const leadPayload = {
      name: form.captainName,
      phone: form.captainPhone,
      email: form.captainEmail || "",
      interest: form.category,
      question: "Inscripció via formulari WhatsApp",
      message: [
        `Equip: ${form.teamName}`,
        `Categoria: ${form.category}`,
        `Capità: ${form.captainName} · ${form.captainPhone}`,
        form.captainEmail ? `Email: ${form.captainEmail}` : "",
        form.captainSize ? `Talla capità: ${form.captainSize}` : "",
        ...form.players
          .filter((p) => p.name.trim())
          .map((p, i) => `Jugador ${i + 1}: ${p.name}${p.year ? ` (${p.year})` : ""}${p.size ? ` T${p.size}` : ""}`),
      ]
        .filter(Boolean)
        .join(" | "),
      consent: true,
      origin: "wa-registre-form",
    };

    /* Envia a Sheets (fire-and-forget, no bloqueja l'apertura de WA) */
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadPayload),
    }).catch(() => {});

    /* Obre WhatsApp i mostra confirmació */
    window.open(waUrl, "_blank", "noreferrer");
    setDone(true);
    setSubmitting(false);
  }

  /* ── Pantalla de confirmació ──────────────────────────────────────────── */
  if (done) {
    const waText = buildWaMessage(form);
    const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waText)}`;

    return (
      <div className="wa-reg-shell">
        <header className="wa-reg-header">
          <Link href="/" className="wa-reg-back">←</Link>
          <div className="wa-reg-header-info">
            <div className="wa-reg-avatar" />
            <div>
              <p className="wa-reg-header-name">Ana · CB Grup Barna</p>
              <p className="wa-reg-header-status">en línia</p>
            </div>
          </div>
        </header>

        <main className="wa-reg-body wa-reg-body--done">
          <div className="wa-reg-success-bubble">
            <span className="wa-reg-success-check">✓</span>
            <h2>Dades guardades!</h2>
            <p>
              Hem guardat la pre-inscripció de <strong>{form.teamName}</strong> a Sheets.<br />
              Ara obre WhatsApp, revisa el missatge i envia&apos;l a l&apos;Ana.
            </p>
            <a href={waUrl} target="_blank" rel="noreferrer noopener" className="wa-reg-btn-wa">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Obrir WhatsApp →
            </a>
            <Link href="/inscripcion" className="wa-reg-btn-secondary">
              O inscriu-te pel formulari web →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  /* ── Formulari principal ─────────────────────────────────────────────── */
  return (
    <div className="wa-reg-shell">
      {/* Header estil WhatsApp */}
      <header className="wa-reg-header">
        <Link href="/" className="wa-reg-back">←</Link>
        <div className="wa-reg-header-info">
          <div className="wa-reg-avatar" />
          <div>
            <p className="wa-reg-header-name">Ana · CB Grup Barna</p>
            <p className="wa-reg-header-status">Inscripcions 3×3 · en línia</p>
          </div>
        </div>
        <div className="wa-reg-header-icons">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
      </header>

      {/* Cos del xat */}
      <main className="wa-reg-body">

        {/* Bombolla info inicial — "missatge" de l'Ana */}
        <div className="wa-reg-bubble wa-reg-bubble--in">
          <p className="wa-reg-bubble-text">
            👋 Hola! Omple les dades del teu equip i les guardarem a la llista d&apos;inscrits.
            A continuació t&apos;obriré WhatsApp amb el missatge ja omplert perquè
            només hagis d&apos;enviar-lo. 🏀
          </p>
          <span className="wa-reg-bubble-time">ara</span>
        </div>

        {/* Formulari com a "bombolla de resposta" */}
        <form className="wa-reg-form-bubble" onSubmit={handleSubmit} noValidate>

          {/* ── Equip ── */}
          <div className="wa-reg-section">
            <p className="wa-reg-section-label">🏀 Dades de l&apos;equip</p>

            <label className="wa-reg-field">
              <span>Nom de l&apos;equip *</span>
              <input
                type="text"
                value={form.teamName}
                onChange={(e) => updateField("teamName", e.target.value)}
                placeholder="Ex: Barna Wolves"
                autoComplete="organization"
                required
              />
            </label>

            <label className="wa-reg-field">
              <span>Categoria *</span>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                required
              >
                <option value="">Tria la teva categoria…</option>
                {CATEGORIES.map((c) => (
                  <option key={c.label} value={c.label}>{c.label}</option>
                ))}
              </select>
            </label>
          </div>

          {/* ── Capità ── */}
          <div className="wa-reg-section">
            <p className="wa-reg-section-label">👤 Capità / contacte principal</p>

            <label className="wa-reg-field">
              <span>Nom i cognoms *</span>
              <input
                type="text"
                value={form.captainName}
                onChange={(e) => updateField("captainName", e.target.value)}
                placeholder="Ex: Joan García López"
                autoComplete="name"
                required
              />
            </label>

            <div className="wa-reg-row">
              <label className="wa-reg-field">
                <span>Telèfon / WhatsApp *</span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={form.captainPhone}
                  onChange={(e) => updateField("captainPhone", e.target.value)}
                  placeholder="600 000 000"
                  autoComplete="tel"
                  required
                />
              </label>
              <label className="wa-reg-field">
                <span>Talla samarreta</span>
                <select
                  value={form.captainSize}
                  onChange={(e) => updateField("captainSize", e.target.value)}
                >
                  <option value="">—</option>
                  {SHIRT_SIZES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
            </div>

            <label className="wa-reg-field">
              <span>Email (opcional)</span>
              <input
                type="email"
                inputMode="email"
                value={form.captainEmail}
                onChange={(e) => updateField("captainEmail", e.target.value)}
                placeholder="el-teu@email.com"
                autoComplete="email"
              />
            </label>
          </div>

          {/* ── Jugadors ── */}
          <div className="wa-reg-section">
            <p className="wa-reg-section-label">👥 Jugadors (mínim 3)</p>

            {form.players.map((p, i) => (
              <div key={i} className="wa-reg-player">
                <span className="wa-reg-player-num">{i + 1}</span>
                <input
                  className="wa-reg-player-name"
                  type="text"
                  value={p.name}
                  onChange={(e) => updatePlayer(i, { name: e.target.value })}
                  placeholder={i < 3 ? `Jugador ${i + 1} *` : "Jugador 4 (opcional)"}
                />
                <input
                  className="wa-reg-player-year"
                  type="number"
                  inputMode="numeric"
                  value={p.year}
                  onChange={(e) => updatePlayer(i, { year: e.target.value })}
                  placeholder="Any"
                  min={1950}
                  max={2022}
                />
                <select
                  className="wa-reg-player-size"
                  value={p.size}
                  onChange={(e) => updatePlayer(i, { size: e.target.value })}
                >
                  <option value="">Talla</option>
                  {SHIRT_SIZES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            ))}

            {/* Botó afegir jugador 4 */}
            {form.players.length === 3 && (
              <button
                type="button"
                className="wa-reg-add-player"
                onClick={() => setForm((f) => ({ ...f, players: [...f.players, emptyPlayer()] }))}
              >
                + Afegir jugador 4
              </button>
            )}
          </div>

          {/* ── Pagament ── */}
          <div className="wa-reg-section wa-reg-section--payment">
            <p className="wa-reg-section-label">💳 Pagament per transferència</p>
            <div className="wa-reg-bank">
              <p><strong>IBAN:</strong> ES25 0182 1797 3002 0387 8558</p>
              <p><strong>Titular:</strong> CB GRUP BARNA</p>
              <p><strong>Concepte:</strong> {form.teamName ? form.teamName.toUpperCase().replace(/\s+/g, "-") + " 3X3" : "[NOM EQUIP] 3X3"}</p>
              {(() => {
                const base = CATEGORIES.find((c) => c.label === form.category)?.price;
                const eb = isEarlyBirdActive();
                if (base === undefined) return <p><strong>Import:</strong> 75–90 €</p>;
                const discounted = eb ? Math.round(base * (1 - EARLY_BIRD_PCT) * 100) / 100 : base;
                return (
                  <p>
                    <strong>Import:</strong>{" "}
                    {eb ? (
                      <>
                        <s style={{ color: "#999" }}>{base} €</s>
                        {" → "}
                        <strong style={{ color: "#25d366" }}>{discounted} €</strong>
                        {" "}
                        <span style={{ background: "#e8f5e9", color: "#2e7d32", borderRadius: "4px", padding: "1px 6px", fontSize: "0.82em", fontWeight: 600 }}>
                          Early Bird −10%
                        </span>
                      </>
                    ) : `${base} €`}
                  </p>
                );
              })()}
            </div>
          </div>

          {/* ── Consentiment ── */}
          <label className="wa-reg-consent">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => updateField("consent", e.target.checked)}
              required
            />
            <span>
              Accepto que CB Grup Barna guardi les meves dades per gestionar la inscripció
              al 3×3 Westfield Glòries 2026, d&apos;acord amb la política de privadesa.
            </span>
          </label>

          {error && <p className="wa-reg-error">{error}</p>}

          <button type="submit" className="wa-reg-submit" disabled={submitting}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {submitting ? "Guardant…" : "Guardar i obrir WhatsApp →"}
          </button>

          <p className="wa-reg-alt">
            Prefereixes el formulari web complet?{" "}
            <Link href="/inscripcion">Inscripció online →</Link>
          </p>

        </form>
      </main>
    </div>
  );
}
