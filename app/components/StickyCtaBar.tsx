"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WA_REGISTRE_URL } from "../lib/whatsapp";

// Pàgines on la barra NO ha d'aparèixer (ja és dins del flow d'inscripció)
const HIDE_ON = [
  "/inscripcion",
  "/inscripcio-individual",
  "/inscripcio-wa",
  "/wa-registre",
  "/porta-un-rival",
  "/check-in",
  "/jugador",
];

const SHARE_URL  = "https://www.cbgrupbarna-3x3timechamber.com/";
const SHARE_TEXT = "🏀 3×3 Westfield Glòries 2026 · Torneig FIBA a Barcelona · 6-7 Juny · 2.000€ premi en metàl·lic. Inscriu-te ja!";

export default function StickyCtaBar() {
  const path = usePathname();
  const [visible, setVisible] = useState(false);
  const [shared, setShared] = useState(false);

  // Apareix quan l'usuari ha fet scroll 380px — no tapa el CTA del hero
  useEffect(() => {
    const check = () => setVisible(window.scrollY > 380);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Tanca el drawer i torna a dalt en canviar de pàgina
  useEffect(() => { setVisible(false); }, [path]);

  async function handleShare() {
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share({ title: "3×3 Westfield Glòries 2026", text: SHARE_TEXT, url: SHARE_URL });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(SHARE_URL);
        setShared(true);
        setTimeout(() => setShared(false), 2200);
      }
    } catch { /* user cancelled */ }
  }

  if (!visible || HIDE_ON.some((p) => path.startsWith(p))) return null;

  return (
    <div className="sticky-cta-bar" role="region" aria-label="Inscripció ràpida">
      {/* Botó principal — inscripció */}
      <Link href="/inscripcion" className="sticky-cta-register">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
        </svg>
        <span className="sticky-cta-text">
          <strong>Inscriu el teu equip</strong>
          <em>des de 75 € · places limitades</em>
        </span>
        <span className="sticky-cta-arrow" aria-hidden="true">→</span>
      </Link>

      <div className="sticky-cta-side">
        {/* WhatsApp */}
        <a
          href={WA_REGISTRE_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="sticky-cta-wa"
          aria-label="Contactar per WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.116 1.533 5.847L.057 23.572a.5.5 0 0 0 .604.635l5.928-1.557A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.502-5.177-1.381l-.371-.218-3.847 1.009 1.022-3.742-.239-.384A9.958 9.958 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
        </a>

        {/* Compartir */}
        <button
          type="button"
          className="sticky-cta-share"
          onClick={handleShare}
          aria-label="Compartir el torneig"
        >
          {shared ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#25d366" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <path d="M8.59 13.51 15.42 17.49M15.41 6.51 8.59 10.49"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
