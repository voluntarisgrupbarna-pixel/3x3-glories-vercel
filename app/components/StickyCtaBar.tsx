"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Pàgines on els botons flotants NO han d'aparèixer (ja és dins del flow d'inscripció)
const HIDE_ON = [
  "/inscripcion",
  "/inscripcio-individual",
  "/porta-un-rival",
  "/check-in",
  "/jugador",
];

const SHARE_URL  = "https://www.cbgrupbarna-3x3timechamber.com/";
const SHARE_TEXT = "🏀 3×3 Westfield Glòries 2026 · Torneig FIBA a Barcelona · 6-7 Juny · 2.000€ premi en metàl·lic. Inscriu-te ja!";

/**
 * Accions flotants globals:
 *  - Inscripció directa
 *  - Contacte per WhatsApp passant abans per formulari lead
 *  - Compartir
 */
export default function StickyCtaBar() {
  const path = usePathname();
  const [shared, setShared] = useState(false);

  if (HIDE_ON.some((p) => path.startsWith(p))) return null;

  async function handleShare() {
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share({
          title: "3×3 Westfield Glòries 2026",
          text:  SHARE_TEXT,
          url:   SHARE_URL,
        });
      } else if (typeof navigator !== "undefined" && "clipboard" in navigator && (navigator as Navigator & { clipboard: Clipboard }).clipboard) {
        await (navigator as Navigator & { clipboard: Clipboard }).clipboard.writeText(SHARE_URL);
        setShared(true);
        setTimeout(() => setShared(false), 2200);
      }
    } catch { /* user cancelled share */ }
  }

  return (
    <div className="sticky-cta-bar" aria-label="Accions ràpides">
      <Link href="/inscripcion" className="sticky-cta-register">
        <span className="sticky-cta-icon">🏀</span>
        <span className="sticky-cta-text">
          <strong>Inscriu-te</strong>
          <em>equip · des de 75 €</em>
        </span>
      </Link>

      <Link href="/contacte?contacte=1" className="sticky-cta-contact">
        <span className="sticky-cta-icon">☎</span>
        <span className="sticky-cta-text">
          <strong>WhatsApp</strong>
          <em>deixa el mòbil</em>
        </span>
      </Link>

      <button
        type="button"
        className="sticky-cta-share"
        onClick={handleShare}
        aria-label="Compartir el torneig"
      >
        <span className="sticky-cta-icon">{shared ? "✓" : "↗"}</span>
        <span className="sticky-cta-text">
          <strong>{shared ? "Copiat!" : "Compartir"}</strong>
        </span>
      </button>
    </div>
  );
}
