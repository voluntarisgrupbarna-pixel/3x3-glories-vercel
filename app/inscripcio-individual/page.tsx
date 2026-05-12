import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inscripció individual | 3×3 Westfield Glòries 2026",
  description:
    "Juga al 3×3 Barcelona sense equip. Inscripció individual per 20 €. El club t'assigna a un equip una setmana abans del torneig. 6-7 juny 2026, Westfield Glòries.",
  alternates: {
    canonical: "/inscripcio-individual",
  },
  openGraph: {
    title: "Inscripció individual — 3×3 Barcelona 2026",
    description:
      "No tens equip? Juga igualment al 3×3 Westfield Glòries Barcelona per 20 €. T'assignem a un equip. Inclou samarreta oficial i dorsal.",
  },
};

export default function InscripcioIndividualPage() {
  return (
    <div className="page-shell">
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">
          ← Inici
        </Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      <main className="page-content">
        <span className="page-kicker">Inscripció individual</span>
        <h1>Juga al 3×3 sense equip</h1>

        <p>
          No tens equip? No hi ha problema. La inscripció individual del{" "}
          <strong>3×3 Westfield Glòries 2026</strong> et permet participar al torneig de bàsquet 3×3 de
          Barcelona per <strong>20 €</strong>. L'organització t'assigna a un equip una setmana abans del
          torneig en funció de la teva edat, posició i nivell.
        </p>

        <div className="page-card-grid" style={{ marginTop: 32 }}>
          <div className="page-card">
            <span className="page-card-label">Preu</span>
            <strong>20 €</strong>
            <p>Samarreta oficial + dorsal + accés als 2 dies inclosos</p>
          </div>
          <div className="page-card">
            <span className="page-card-label">Assignació</span>
            <strong>1 setmana abans</strong>
            <p>Et confirmem equip i horaris per email i WhatsApp</p>
          </div>
          <div className="page-card">
            <span className="page-card-label">Data</span>
            <strong>6-7 juny 2026</strong>
            <p>Westfield Glòries · La Nau del Clot · Rambleta del Clot</p>
          </div>
          <div className="page-card">
            <span className="page-card-label">Categories</span>
            <strong>Totes les edats</strong>
            <p>De Premini a Veterans Masculí/Femení</p>
          </div>
        </div>

        <h2>Com funciona</h2>
        <ol style={{ paddingLeft: 20, color: "rgba(255,247,239,0.78)", lineHeight: 1.7 }}>
          <li style={{ marginBottom: 10, fontSize: 16 }}>
            Omplenes el formulari amb les teves dades, talla de samarreta i posició preferida.
          </li>
          <li style={{ marginBottom: 10, fontSize: 16 }}>
            Fas el pagament de 20 € per transferència (QR pre-omplert, 2 minuts).
          </li>
          <li style={{ marginBottom: 10, fontSize: 16 }}>
            L'organització et confirma la plaça en menys de 24h.
          </li>
          <li style={{ marginBottom: 10, fontSize: 16 }}>
            Una setmana abans del torneig et diem a quin equip vas, els horaris i les seus on jugaràs.
          </li>
          <li style={{ marginBottom: 10, fontSize: 16 }}>
            El dia del torneig, et presentes amb la samarreta oficial i gaudeixes del 3×3 de Barcelona.
          </li>
        </ol>

        <a
          href="https://wa.me/34698425153?text=Hola!+Vull+fer+una+inscripci%C3%B3+individual+al+3x3+Westfield+Gl%C3%B2ries+2026"
          target="_blank"
          rel="noreferrer"
          className="page-cta"
        >
          Inscripció individual →
        </a>

        <hr className="page-divider" />

        <h2>Tens equip? Inscriu-vos com a equip</h2>
        <p>
          Si teniu 3 o més jugadors, és millor inscriure-us com a equip. L'equip té més control sobre
          horaris, categories i companya de joc.
        </p>
        <Link href="/inscripcion" className="page-cta-secondary">
          Inscripció d'equip →
        </Link>
      </main>
    </div>
  );
}
