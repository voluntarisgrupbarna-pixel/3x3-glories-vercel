"use client";

import { useEffect, useState } from "react";

const WA_URL =
  "https://wa.me/34698425153?text=Hola!%20Vull%20informació%20sobre%20el%203x3%20Westfield%20Glòries%202026%20abans%20que%20s'acabin%20les%20places";

export default function ExitIntentModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mostrar només 1 cop per sessió
    if (sessionStorage.getItem("exit_intent_shown")) return;

    let active = false;

    // ── Desktop: ratolí surt per la part superior ─────────────────
    const onMouseLeave = (e: MouseEvent) => {
      if (active) return;
      if (e.clientY <= 0) {
        active = true;
        sessionStorage.setItem("exit_intent_shown", "1");
        setVisible(true);
      }
    };

    // ── Mobile: scroll amunt ràpid suggereix anar-se'n ───────────
    let lastY = 0;
    let maxScrolled = 0;
    const onScroll = () => {
      if (active) return;
      const y = window.scrollY;
      if (y > maxScrolled) maxScrolled = y;
      // Detectar scroll cap amunt de > 200px havent baixat > 300px
      if (maxScrolled > 300 && lastY - y > 200) {
        active = true;
        sessionStorage.setItem("exit_intent_shown", "1");
        setVisible(true);
      }
      lastY = y;
    };

    // Activar als 8 seg (permet que l'usuari explori una mica)
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", onMouseLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
    }, 8_000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="exit-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Oferta Early Bird"
      onClick={() => setVisible(false)}
    >
      <div className="exit-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="exit-close"
          onClick={() => setVisible(false)}
          aria-label="Tancar"
        >
          ×
        </button>

        <div className="exit-icon" aria-hidden="true">🏀</div>

        <h2 className="exit-title">
          Espera! Queden<br />
          <span className="exit-title-accent">poques places</span>
        </h2>

        <p className="exit-body">
          L'Early Bird <strong>−10%</strong> acaba aviat i els equips s'estan
          apuntant ràpid. No et quedis sense lloc.
        </p>

        <div className="exit-actions">
          <a
            href={WA_URL}
            target="_blank"
            rel="noreferrer"
            className="exit-btn-wa"
            onClick={() => setVisible(false)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.116 1.533 5.847L.057 23.572a.5.5 0 0 0 .604.635l5.928-1.557A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.502-5.177-1.381l-.371-.218-3.847 1.009 1.022-3.742-.239-.384A9.958 9.958 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Inscriu l'equip per WA
          </a>

          <a
            href="/inscripcion"
            className="exit-btn-secondary"
            onClick={() => setVisible(false)}
          >
            Veure preus i categories →
          </a>
        </div>

        <p className="exit-disclaimer">
          Sense compromís · Resposta en menys d'1h
        </p>
      </div>
    </div>
  );
}
