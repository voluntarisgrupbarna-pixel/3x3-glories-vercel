import type { Metadata } from "next";
import Link from "next/link";
import RegistrationClosedNotice from "../components/RegistrationClosedNotice";

export const metadata: Metadata = {
  title: "Porta un rival al 3×3 | Westfield Glòries 2026",
  description:
    "Ja tens equip inscrit al 3×3 Westfield Glòries? Convida un equip rival i estalvieu 5 € cada un amb un codi únic. Genera el repte i envia'l per WhatsApp en un clic.",
  alternates: {
    canonical: "/porta-un-rival",
  },
  openGraph: {
    title: "Porta un rival al 3×3 Barcelona — Westfield Glòries 2026",
    description:
      "Convida un equip rival al 3×3 i estalvieu 5 € cada un. Repte oficial del torneig FIBA del 6-7 juny a Barcelona.",
  },
};

export default function PortaUnRivalPage() {
  return (
    <div className="page-shell">
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">
          ← Inici
        </Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      <main className="page-content">
        <span className="page-kicker">Pack rival · −5 € cada un</span>
        <h1>Porta un rival al 3×3</h1>

        <p>
          Ja tens equip inscrit al <strong>3×3 Westfield Glòries 2026</strong>? Convida un equip rival a
          venir-hi i estalvieu <strong>5 € cada equip</strong>. Sense límit d'equips convidats.
        </p>

        <RegistrationClosedNotice
          title="Pack rival tancat"
          body="El 3×3 Westfield Glòries 2026 (6-7 juny) ja s'ha celebrat, així que el pack rival ja no està disponible per a aquesta edició."
        />

        <div style={{ marginTop: 32 }}>
          <Link href="/preguntes-frequents" className="page-cta-secondary">
            Veure preguntes freqüents
          </Link>
        </div>
      </main>
    </div>
  );
}
