import type { Metadata } from "next";
import Link from "next/link";

const jsonLdVenue = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Rambleta del Clot — Pista exterior 3×3 Barcelona 2026",
  description: "Pista exterior del torneig 3×3 Westfield Glòries 2026. Bàsquet de carrer al barri del Clot-Glòries, Barcelona.",
  url: "https://www.cbgrupbarna-3x3timechamber.com/seu/rambleta-del-clot",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Barcelona",
    postalCode: "08018",
    addressRegion: "Catalunya",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.4074,
    longitude: 2.1972,
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
  title: "Rambleta del Clot | 3×3 Barcelona 2026",
  description:
    "La Rambleta del Clot és la pista exterior del torneig 3×3 Westfield Glòries 2026. Ambient de bàsquet de carrer al barri del Clot-Glòries de Barcelona.",
  alternates: {
    canonical: "/seu/rambleta-del-clot",
  },
  openGraph: {
    title: "Rambleta del Clot — Seu 3×3 Barcelona 2026",
    description:
      "Pista exterior del 3×3 Westfield Glòries 2026. Bàsquet de carrer al barri del Clot-Glòries, Barcelona.",
  },
};

export default function RambletaDelClotPage() {
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
        <span className="page-kicker">Pista exterior</span>
        <h1>Rambleta del Clot</h1>

        <p>
          La <strong>Rambleta del Clot</strong> és la pista exterior del torneig{" "}
          <strong>3×3 Westfield Glòries 2026</strong>, ubicada al barri del Clot-Glòries de Barcelona. Amb
          un ambient de bàsquet de carrer autèntic, és la seu que millor captura l'esperit urbà del 3×3.
        </p>

        <div className="page-address-block" style={{ marginBottom: 32 }}>
          <strong>Rambleta del Clot</strong>
          <p>Barri del Clot-Glòries, Barcelona</p>
          <p>Districte de Sant Martí</p>
          <p>Connexió directa amb La Nau del Clot i Westfield Glòries</p>
        </div>

        <h2>L'esperit del 3×3 de carrer</h2>
        <p>
          El bàsquet 3×3 va néixer als carrers i la Rambleta del Clot ho reflecteix. Pista exterior,
          música ambient, públic proper i la intensitat del joc urbà. És la seu perfecta per a qui vol
          viure el 3×3 en el seu format més autèntic.
        </p>
        <p>
          La pista exterior acull els partits de <strong>Sènior Amateur</strong> i <strong>Màgics</strong>, i és punt de pas de la ruta que
          connecta les tres seus del torneig.
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
            <Link href="/seu/nau-del-clot" style={{ color: "#ff375f" }}>
              La Nau del Clot
            </Link>{" "}
            — Carrer de la Llacuna 172. Pavelló cobert oficial.
          </li>
        </ul>

        <Link href="/inscripcion" className="page-cta">
          Inscriu-te al 3×3 Barcelona →
        </Link>
      </main>
    </div>
  );
}
