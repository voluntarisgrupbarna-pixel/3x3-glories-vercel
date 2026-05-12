import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seu Westfield Glòries | 3×3 Barcelona 2026",
  description:
    "Westfield Glòries és la seu principal del torneig 3×3 de Barcelona 2026. Av. Diagonal 208, Barcelona. Pàrquing gratis 2h. Metro L1 estació Glòries.",
  alternates: {
    canonical: "/seu/westfield-glories",
  },
  openGraph: {
    title: "Seu Westfield Glòries — 3×3 Barcelona 2026",
    description:
      "Seu principal del 3×3 Westfield Glòries 2026. Av. Diagonal 208, Barcelona. Pàrquing gratis 2h. Metro L1.",
  },
};

export default function WestfieldGloriesPage() {
  return (
    <div className="page-shell">
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">
          ← Inici
        </Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      <main className="page-content">
        <span className="page-kicker">Seu principal</span>
        <h1>Westfield Glòries</h1>

        <p>
          <strong>Westfield Glòries</strong> és la seu principal del torneig{" "}
          <strong>3×3 Westfield Glòries 2026</strong>. Ubicat a l'Avinguda Diagonal 208 de Barcelona, és el
          punt d'arribada, la zona de trobada i d'on surt la ruta cap a les altres seus del barri del
          Clot-Glòries.
        </p>

        <div className="page-address-block" style={{ marginBottom: 32 }}>
          <strong>Westfield Glòries</strong>
          <p>Av. Diagonal 208, 08018 Barcelona</p>
          <p>Metro: L1 — estació Glòries</p>
          <p>Pàrquing gratuït 2h per als participants del torneig</p>
        </div>

        <h2>Com arribar-hi</h2>

        <div className="page-card-grid">
          <div className="page-card">
            <span className="page-card-label">A peu</span>
            <strong>10 min</strong>
            <p>Circuit de 786 m per carrers reals fins a La Nau del Clot</p>
          </div>
          <div className="page-card">
            <span className="page-card-label">Metro</span>
            <strong>L1</strong>
            <p>Estació Glòries, entrada directa al centre comercial</p>
          </div>
          <div className="page-card">
            <span className="page-card-label">Bus</span>
            <strong>Diagonal</strong>
            <p>Diverses línies per l'Av. Diagonal, parada davant Glòries</p>
          </div>
          <div className="page-card">
            <span className="page-card-label">Pàrquing</span>
            <strong>2h gratis</strong>
            <p>Pàrquing del centre comercial, gratuït durant el torneig</p>
          </div>
        </div>

        <h2>Sobre Westfield Glòries</h2>
        <p>
          Westfield Glòries és el centre comercial de referència del barri del Clot-Glòries i del Districte
          de Sant Martí de Barcelona. Acull la seu principal del torneig 3×3, la zona de registre d'equips,
          la cerimònia d'inauguració i les finals de les categories Sènior.
        </p>

        <hr className="page-divider" />

        <h2>Altres seus del torneig</h2>
        <ul>
          <li>
            <Link href="/seu/nau-del-clot" style={{ color: "#ff375f" }}>
              La Nau del Clot
            </Link>{" "}
            — Carrer de la Llacuna 172. Pavelló cobert oficial.
          </li>
          <li>
            <Link href="/seu/rambleta-del-clot" style={{ color: "#ff375f" }}>
              Rambleta del Clot
            </Link>{" "}
            — Pista exterior amb ambient de carrer.
          </li>
        </ul>

        <Link href="/inscripcion" className="page-cta">
          Inscriu-te al 3×3 Barcelona →
        </Link>
      </main>
    </div>
  );
}
