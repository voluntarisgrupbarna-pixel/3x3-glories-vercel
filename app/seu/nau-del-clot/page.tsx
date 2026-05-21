import type { Metadata } from "next";
import Link from "next/link";

const jsonLdVenue = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "La Nau del Clot — Pavelló oficial 3×3 Barcelona 2026",
  description: "Pavelló cobert oficial del torneig 3×3 Westfield Glòries 2026. Seu de les categories formatives i semifinals.",
  url: "https://www.cbgrupbarna-3x3timechamber.com/seu/nau-del-clot",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Carrer de la Llacuna, 172",
    addressLocality: "Barcelona",
    postalCode: "08018",
    addressRegion: "Catalunya",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.4068,
    longitude: 2.1958,
  },
  publicAccess: true,
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "21:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "09:00", closes: "21:00" },
  ],
  event: {
    "@type": "SportsEvent",
    name: "3×3 Westfield Glòries 2026",
    startDate: "2026-06-06",
    endDate: "2026-06-07",
  },
};

export const metadata: Metadata = {
  title: "La Nau del Clot | 3×3 Barcelona 2026",
  description:
    "La Nau del Clot és el pavelló cobert oficial del torneig 3×3 Westfield Glòries 2026. Carrer de la Llacuna 172, Barcelona. Seu de les categories formatives i semifinals.",
  alternates: {
    canonical: "/seu/nau-del-clot",
  },
  openGraph: {
    title: "La Nau del Clot — Seu 3×3 Barcelona 2026",
    description:
      "Pavelló cobert oficial del 3×3 Westfield Glòries 2026. Carrer de la Llacuna 172, Barcelona. Categories formatives i semifinals.",
  },
};

export default function NauDelClotPage() {
  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdVenue) }} />
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">
          ← Inici
        </Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      <main className="page-content">
        <span className="page-kicker">Seu oficial</span>
        <h1>La Nau del Clot</h1>

        <p>
          <strong>La Nau del Clot</strong> és el pavelló cobert oficial del torneig{" "}
          <strong>3×3 Westfield Glòries 2026</strong>. Ubicat al Carrer de la Llacuna 172 de Barcelona, és
          la seu on s'hi juguen les categories formatives (Premini, Mini, Infantil, Cadet, Júnior) i les
          semifinals de les categories Sènior.
        </p>

        <div className="page-address-block" style={{ marginBottom: 32 }}>
          <strong>La Nau del Clot — CB Grup Barna</strong>
          <p>Carrer de la Llacuna 172, 08018 Barcelona</p>
          <p>Barri del Clot-Glòries, Districte de Sant Martí</p>
          <p>A 10 minuts a peu de Westfield Glòries</p>
        </div>

        <h2>Categories que s'hi juguen</h2>
        <div className="page-card-grid">
          <div className="page-card">
            <span className="page-card-label">Categories formatives</span>
            <strong>Premini · Mini · Infantil</strong>
            <p>Cadet · Júnior · Sub-23</p>
          </div>
          <div className="page-card">
            <span className="page-card-label">Categories adultes</span>
            <strong>Semifinals Sènior</strong>
            <p>Veterans Masculí · Veterans Femení</p>
          </div>
        </div>

        <h2>Sobre La Nau del Clot</h2>
        <p>
          La Nau del Clot és la instal·lació esportiva del CB Grup Barna al barri del Clot-Glòries. El club
          hi fa els entrenaments de les seves categories de base des de fa més de 60 anys. Durant el torneig
          3×3, el pavelló es transforma en una arena urbana amb música, ambient i competició de bàsquet 3×3.
        </p>

        <hr className="page-divider" />

        <h2>Altres seus del torneig</h2>
        <ul>
          <li>
            <Link href="/seu/westfield-glories" style={{ color: "#ff375f" }}>
              Westfield Glòries
            </Link>{" "}
            — Av. Diagonal 208. Seu principal, pàrquing gratis 2h.
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
