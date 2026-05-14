import type { Metadata } from "next";
import Link from "next/link";
import IndividualSignupForm from "./IndividualSignupForm";

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

        <h2>Inscriu-te</h2>
        <p>
          Omple les dades a continuació. Quan acabis, generem un missatge de WhatsApp amb tota la informació
          ja preparada i només has de clicar enviar. L'organització et confirma la plaça en menys de 24h i
          t'envia les dades de pagament (20 € per transferència).
        </p>

        <IndividualSignupForm />

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
