"use client";

/**
 * ShareGate — Captura nom + contacte + consentiment abans de compartir.
 *
 * Flux:
 *  1. Usuari clica el botó "Compartir" exterior
 *  2. S'obre modal amb form (nom, mòbil, email opcional, consent RGPD)
 *  3. En enviar → POST /api/lead amb origin (ex: "share-home", "share-rival")
 *     que guarda a Apps Script (Sheets) + Supabase
 *  4. Després executem navigator.share o copy-to-clipboard
 *
 * Ús:
 *   const { trigger, modal } = useShareGate({ shareData: {...}, origin: "share-home" });
 *   return <><button onClick={trigger}>Compartir</button>{modal}</>;
 */

import { useState, useCallback, FormEvent } from "react";

export type ShareData = {
  title: string;
  text: string;
  url: string;
};

type Props = {
  shareData: ShareData;
  origin: string;        // ex: "share-home", "share-rival", "share-faq"
  open: boolean;
  onClose: () => void;
};

export function ShareGateModal({ shareData, origin, open, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  function isEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }
  function isPhone(v: string) {
    return /^[+\d\s()-]{7,}$/.test(v.trim());
  }

  async function executeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // usuari va cancel·lar — ok
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) return setError("Posa el teu nom complet, sisplau.");
    const phoneValue = phone.trim();
    const emailValue = email.trim();
    if (!isPhone(phoneValue)) return setError("Cal un mòbil vàlid (mín. 7 dígits).");
    if (emailValue && !isEmail(emailValue)) return setError("El correu no sembla vàlid.");
    if (!consent) return setError("Cal acceptar la política de privacitat.");

    setSubmitting(true);

    // 1. Enviar lead al backend (Apps Script + Supabase)
    try {
      const payload = {
        name: name.trim(),
        email: emailValue,
        phone: phoneValue,
        interest: "Comparteix el 3×3",
        question: shareData.title,
        message: `Origin: ${origin} · URL: ${shareData.url}`,
        consent: true,
        origin,
      };
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // Fire-and-forget — si falla el backend, deixem que comparteixi igualment
      console.error("[share-gate] /api/lead failed", err);
    }

    // 2. Disparar share natiu / clipboard
    await executeShare();

    setSubmitting(false);
    setSuccess(true);

    // Auto-tancar després d'1.2s
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  }

  return (
    <div className="share-gate-overlay" role="dialog" aria-modal="true" aria-label="Comparteix el 3×3">
      <div className="share-gate-panel">
        <button
          type="button"
          className="share-gate-close"
          onClick={onClose}
          aria-label="Tancar"
        >
          ×
        </button>

        {success ? (
          <div className="share-gate-success">
            <div className="share-gate-success-icon" aria-hidden="true">✓</div>
            <h3>Gràcies!</h3>
            <p>T&apos;hem enviat la informació. Comparteix-ho amb els teus contactes!</p>
          </div>
        ) : (
          <>
            <h3 className="share-gate-title">
              <span aria-hidden="true">🏀</span> Comparteix el 3×3 Westfield Glòries
            </h3>
            <p className="share-gate-sub">
              Deixa&apos;ns nom i mòbil, ho guardem com a lead, i després podràs compartir la pàgina.
            </p>

            <form className="share-gate-form" onSubmit={handleSubmit}>
              <label className="share-gate-field">
                <span>Nom</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="El teu nom"
                  required
                />
              </label>

              <label className="share-gate-field">
                <span>Mòbil / WhatsApp</span>
                <input
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  required
                />
              </label>

              <label className="share-gate-field">
                <span>Email opcional</span>
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                />
              </label>

              <label className="share-gate-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  Accepto la <a href="/privacitat" target="_blank">política de privacitat</a> i que
                  CB Grup Barna em pugui contactar amb informació del torneig 3×3.
                </span>
              </label>

              {error && <div className="share-gate-error" role="alert">{error}</div>}

              <button
                type="submit"
                className="share-gate-submit"
                disabled={submitting}
              >
                {submitting ? "Enviant…" : "Compartir i rebre info →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/** Hook helper: retorna {open, trigger, modal} per gestionar el flow */
export function useShareGate(opts: { shareData: ShareData; origin: string }) {
  const [open, setOpen] = useState(false);
  const trigger = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const modal = (
    <ShareGateModal
      shareData={opts.shareData}
      origin={opts.origin}
      open={open}
      onClose={close}
    />
  );
  return { open, trigger, modal };
}
