"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const WHATSAPP_PHONE = "34698425153";

const HIDE_ON = [
  "/inscripcion",
  "/inscripcio-individual",
  "/porta-un-rival",
  "/check-in",
  "/jugador",
  "/contacte",
];

type ModalMode = "choice" | "contact" | "success";

type LeadForm = {
  name: string;
  phone: string;
  email: string;
  consent: boolean;
};

const emptyForm: LeadForm = {
  name: "",
  phone: "",
  email: "",
  consent: false,
};

function buildWhatsappUrl(form: LeadForm) {
  const text = [
    "Hola Ana, he deixat les meves dades al popup del 3x3 i vull que em contacteu.",
    "",
    `Nom: ${form.name}`,
    `Mòbil: ${form.phone}`,
    form.email ? `Email: ${form.email}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export default function ExitIntentModal() {
  const path = usePathname();
  const shouldHide = HIDE_ON.some((prefix) => path.startsWith(prefix));
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<ModalMode>("choice");
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const whatsappUrl = useMemo(() => buildWhatsappUrl(form), [form]);

  useEffect(() => {
    if (shouldHide) return;
    if (sessionStorage.getItem("exit_intent_shown")) return;

    let active = false;

    const showModal = () => {
      if (active) return;
      active = true;
      sessionStorage.setItem("exit_intent_shown", "1");
      setVisible(true);
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) showModal();
    };

    let lastY = 0;
    let maxScrolled = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > maxScrolled) maxScrolled = y;
      if (maxScrolled > 300 && lastY - y > 200) showModal();
      lastY = y;
    };

    const listenerTimer = setTimeout(() => {
      document.addEventListener("mouseleave", onMouseLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
    }, 8_000);

    const browseTimer = setTimeout(showModal, 35_000);

    return () => {
      clearTimeout(listenerTimer);
      clearTimeout(browseTimer);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [shouldHide]);

  function close() {
    setVisible(false);
  }

  function updateField<K extends keyof LeadForm>(field: K, value: LeadForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Falten el nom i el mòbil.");
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
          name: form.name,
          phone: form.phone,
          email: form.email,
          interest: "3×3 Westfield Glòries",
          question: "Vull que em contacteu",
          message: "Lead capturat des del popup de retenció",
          consent: true,
          origin: "popup-retencio-3x3",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "No s'ha pogut guardar el contacte.");
      }

      setMode("success");
    } catch (leadError) {
      setError(leadError instanceof Error ? leadError.message : "No s'ha pogut guardar el contacte.");
    } finally {
      setSubmitting(false);
    }
  }

  if (shouldHide || !visible) return null;

  return (
    <div
      className="exit-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Contacte 3×3 Westfield Glòries"
      onClick={close}
    >
      <div className="exit-modal" onClick={(e) => e.stopPropagation()}>
        <button className="exit-close" onClick={close} aria-label="Tancar">
          ×
        </button>

        <div className="exit-icon" aria-hidden="true">🏀</div>

        {mode === "choice" && (
          <>
            <h2 className="exit-title">
              Vols que et<br />
              <span className="exit-title-accent">contactem?</span>
            </h2>

            <p className="exit-body">
              Si encara tens dubtes, deixa nom i mòbil i Ana et contactarà per WhatsApp.
              Si ja ho tens clar, pots anar al registre directe.
            </p>

            <div className="exit-actions">
              <button type="button" className="exit-btn-wa" onClick={() => setMode("contact")}>
                Deixar les meves dades
              </button>

              <a href="/inscripcion" className="exit-btn-secondary" onClick={close}>
                Anar al registre directe →
              </a>

              <button type="button" className="exit-btn-skip" onClick={close}>
                Saltar
              </button>
            </div>

            <p className="exit-disclaimer">Nom + mòbil · email opcional · guardat a Sheets</p>
          </>
        )}

        {mode === "contact" && (
          <form className="exit-form" onSubmit={submitLead}>
            <h2 className="exit-title">
              Et contactem<br />
              <span className="exit-title-accent">per WhatsApp</span>
            </h2>

            <label className="exit-field">
              <span>Nom i cognoms *</span>
              <input
                autoComplete="name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="El teu nom"
                required
              />
            </label>

            <label className="exit-field">
              <span>Mòbil / WhatsApp *</span>
              <input
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="600 000 000"
                required
              />
            </label>

            <label className="exit-field">
              <span>Email opcional</span>
              <input
                autoComplete="email"
                inputMode="email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="el-teu@email.com"
              />
            </label>

            <label className="exit-consent">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) => updateField("consent", event.target.checked)}
                required
              />
              <span>Accepto que CB Grup Barna em contacti sobre el 3×3.</span>
            </label>

            {error && <p className="exit-error">{error}</p>}

            <button className="exit-btn-wa" type="submit" disabled={submitting}>
              {submitting ? "Guardant..." : "Guardar contacte"}
            </button>

            <button type="button" className="exit-btn-skip" onClick={() => setMode("choice")}>
              Tornar
            </button>
          </form>
        )}

        {mode === "success" && (
          <>
            <h2 className="exit-title">
              Contacte<br />
              <span className="exit-title-accent">guardat</span>
            </h2>

            <p className="exit-body">
              Ja queda a Sheets com a lead. Ara pots obrir WhatsApp si vols escriure&apos;ns o anar
              directament al registre.
            </p>

            <div className="exit-actions">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="exit-btn-wa" onClick={close}>
                Contactar per WhatsApp →
              </a>

              <a href="/inscripcion" className="exit-btn-secondary" onClick={close}>
                Registre directe →
              </a>

              <button type="button" className="exit-btn-skip" onClick={close}>
                Tancar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
