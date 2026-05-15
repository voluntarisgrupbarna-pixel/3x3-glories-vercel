"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Pàgines on els botons flotants NO han d'aparèixer (ja és dins del flow d'inscripció)
const HIDE_ON = [
  "/inscripcion",
  "/inscripcio-individual",
  "/porta-un-rival",
  "/check-in",
  "/jugador",
];

/**
 * Dos botons flotants de baix accés ràpid:
 *  - Pack Rival (−5 €)
 *  - Inscriure'm sol (20 €)
 * Apareixen a totes les pàgines excepte les d'inscripció.
 */
export default function StickyCtaBar() {
  const path = usePathname();
  if (HIDE_ON.some((p) => path.startsWith(p))) return null;

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
    </div>
  );
}
