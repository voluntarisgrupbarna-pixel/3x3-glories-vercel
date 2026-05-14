import type { Metadata } from "next";
import Link from "next/link";
import PortaUnRivalForm from "./PortaUnRivalForm";

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

        <p>
          Omple els camps i et generem un <strong>codi únic</strong> i el missatge de repte per WhatsApp.
          L'envies tu mateix al capità rival des del teu telèfon — així li arriba de part teva, no nostra.
        </p>

        <PortaUnRivalForm />

        <h2>Com funciona el codi de descompte</h2>
        <ol style={{ paddingLeft: 20, marginBottom: 16, color: "rgba(255,247,239,0.78)", lineHeight: 1.7 }}>
          <li style={{ marginBottom: 10 }}>
            <strong>Genera el codi</strong> al formulari de dalt — tindrà el format{" "}
            <code style={{ background: "rgba(255,55,95,0.15)", padding: "2px 8px", borderRadius: 6, color: "#ff375f" }}>RIVAL-EL-TEU-EQUIP</code>.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Envia el repte</strong> al capità rival per WhatsApp. El missatge ja porta el codi i el
            link d'inscripció.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Quan parli amb nosaltres</strong>, el rival cita el codi i li apliquem{" "}
            <strong>−5 €</strong>. A tu te'l descomptem la propera vegada que parlis amb nosaltres citant el
            mateix codi.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Cada codi val per a un parell d'equips.</strong> Si vols portar dos rivals, genera dos
            codis amb el mateix nom del teu equip i envia un a cada un — així pots acumular fins a −15 € o més.
          </li>
        </ol>

        <p style={{ fontSize: 14, color: "rgba(255,247,239,0.6)" }}>
          El descompte és acumulable amb l'Early Bird (-10% fins el 20 de maig). El codi AMIC5 no s'aplica
          sobre aquest pack.
        </p>

        <div style={{ marginTop: 32 }}>
          <Link href="/inscripcion" className="page-cta">
            Inscriure el meu equip →
          </Link>
          <span style={{ display: "inline-block", width: 16 }} />
          <Link href="/preguntes-frequents" className="page-cta-secondary">
            Veure preguntes freqüents
          </Link>
        </div>
      </main>
    </div>
  );
}
