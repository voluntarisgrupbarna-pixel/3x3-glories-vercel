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

const SHARE_URL  = "https://cbgrupbarna-3x3timechamber.com/";
const SHARE_TEXT = "🏀 3×3 Westfield Glòries 2026 · Torneig FIBA a Barcelona · 6-7 Juny · 2.000€ premi en metàl·lic. Inscriu-te ja!";

/**
 * Tres botons flotants a la dreta (sota el botó WhatsApp):
 *  - 🏀 Pack Rival (−5 €)
 *  - 🙋 Inscriure'm sol (20 €)
 *  - ↗ Compartir (Native Share API o clipboard)
 *
 * Apareixen a totes les pàgines excepte les de flow d'inscripció.
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
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(SHARE_URL);
        setShared(true);
        setTimeout(() => setShared(false), 2200);
      }
    } catch { /* user cancelled share */ }
  }

  return (
    <div className="sticky-cta-bar" aria-label="Accions ràpides">
      <Link href="/porta-un-rival" className="sticky-cta-rival">
        <span className="sticky-cta-icon">🏀</span>
        <span className="sticky-cta-text">
          <strong>Pack Rival</strong>
          <em>−5 € cada equip</em>
        </span>
      </Link>

      <Link href="/inscripcio-individual" className="sticky-cta-solo">
        <span className="sticky-cta-icon">🙋</span>
        <span className="sticky-cta-text">
          <strong>Inscriure&apos;m sol</strong>
          <em>20 € · sense equip</em>
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
