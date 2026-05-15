import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Torneig 3×3 Barcelona 2026 — Westfield Glòries · FIBA · 2.000€ premis",
  description:
    "Torneig 3×3 Barcelona 2026: bàsquet 3×3 FIBA al Clot-Glòries. 10 categories (Premini a Veterans), 2.000€ premi en metàl·lic Sèniors, punts FIBA. 6-7 Juny 2026. Inscriu-te des de 75€!",
  alternates: { canonical: "/torneig-3x3-barcelona" },
  openGraph: {
    title: "Torneig 3×3 Barcelona 2026 — Westfield Glòries · FIBA",
    description:
      "El torneig 3×3 FIBA de Barcelona: 10 categories, 2.000€ premi, 3 seus al Clot-Glòries. 6-7 juny 2026. Inscripció des de 75€.",
  },
};

const SITE_URL = "https://cbgrupbarna-3x3timechamber.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "Torneig 3×3 Barcelona 2026",
  alternateName: ["Torneig 3×3 Barcelona", "Torneig 3x3 Barna 2026", "3×3 Barcelona 2026", "3x3 Barna"],
  description:
    "Torneig de bàsquet 3×3 FIBA a Barcelona — 10 categories de Premini a Veterans, 3 seus al barri del Clot-Glòries, 2.000€ de premi Sèniors M/F, punts rànquing mundial FIBA. 4a edició, 6-7 juny 2026.",
  startDate: "2026-06-06T09:00:00+02:00",
  endDate: "2026-06-07T20:00:00+02:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  sport: "Basketball 3x3",
  url: `${SITE_URL}/torneig-3x3-barcelona`,
  location: {
    "@type": "Place",
    name: "Westfield Glòries — Clot-Glòries, Barcelona",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Diagonal 208",
      addressLocality: "Barcelona",
      postalCode: "08018",
      addressCountry: "ES",
    },
    geo: { "@type": "GeoCoordinates", latitude: 41.4048, longitude: 2.1896 },
  },
  organizer: { "@type": "SportsOrganization", name: "CB Grup Barna", url: "https://cbgrupbarna.com" },
  offers: { "@type": "AggregateOffer", lowPrice: "75", highPrice: "105", priceCurrency: "EUR", url: `${SITE_URL}/inscripcion`, availability: "https://schema.org/InStock" },
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inici", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Torneig 3×3 Barcelona 2026", item: `${SITE_URL}/torneig-3x3-barcelona` },
  ],
};

const WA = `https://wa.me/34698425153?text=${encodeURIComponent("Hola! Vull inscriure el meu equip al Torneig 3x3 Barcelona 2026. Podeu informar-me?")}`;

export default function TorneigPage() {
  return (
    <>
      <Script id="ld-torneig-bcn" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="ld-bc-torneig-bcn" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <div className="page-shell">
        <nav className="page-nav">
          <Link href="/" className="page-nav-back">← Inici</Link>
          <span className="page-nav-logo">3×3 Barcelona 2026</span>
        </nav>

        <div className="insc-hero">
          <img src="/hero-bg-2.webp"
            alt="Torneig 3×3 Barcelona 2026 — pista exterior Clot-Glòries"
            className="insc-hero-img" />
          <div className="insc-hero-overlay" />
          <div className="insc-hero-body">
            <span className="insc-hero-kicker">4a edició · 6-7 Juny 2026 · Clot-Glòries, Barcelona</span>
            <h1 className="insc-hero-title">Torneig 3×3 Barcelona 2026</h1>
            <p className="insc-hero-sub">
              El torneig de bàsquet 3×3 FIBA de Barcelona. 10 categories, 3 seus al Clot-Glòries i 2.000€ de premi en metàl·lic per als Sèniors.
            </p>
            <div className="insc-hero-chips">
              <span>🔥 Early Bird −10%</span>
              <span>🏀 Des de 75€</span>
              <span>🔴 FIBA · Punts rànquing</span>
              <span>📍 Clot-Glòries</span>
            </div>
          </div>
        </div>

        <main className="page-content">

          <h2>Sobre el Torneig 3×3 Barcelona</h2>
          <p>
            El <strong>Torneig 3×3 Barcelona</strong> és el nom amb el qual es coneix popularment el{" "}
            <strong>3×3 Westfield Glòries</strong>, l&apos;esdeveniment de bàsquet urbà organitzat anualment per{" "}
            <strong>CB Grup Barna</strong>, <strong>Time Chamber</strong> i <strong>Eix Clot</strong> al barri del
            Clot-Glòries. La 4a edició es celebra el <strong>6 i 7 de juny de 2026</strong>.
          </p>
          <p>
            És l&apos;únic torneig 3×3 amb punts FIBA oficials a la ciutat de Barcelona el 2026. Els jugadors Sèniors
            competeixen pel <strong>rànquing mundial individual FIBA 3×3</strong> i s&apos;enfronten per un{" "}
            <strong>premi en metàl·lic de 2.000€</strong> (1.000€ Sèniors Masculí + 1.000€ Sèniors Femení).
          </p>

          <hr className="page-divider" />

          <h2>Categories del Torneig 3×3 Barcelona</h2>
          <p>10 categories per edat i gènere, del Premini (8 anys) al Veterans (+38 anys):</p>

          <div className="insc-cat-grid">
            {[
              { emoji: "⭐", name: "Premini", any: "2016–2017", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
              { emoji: "⭐", name: "Mini", any: "2014–2015", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
              { emoji: "🏀", name: "Infantil", any: "2012–2013", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
              { emoji: "🏀", name: "Cadet", any: "2010–2011", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
              { emoji: "🏀", name: "Júnior", any: "2008–2009", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
              { emoji: "🏀", name: "Sub-23", any: "2003–2007", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
              { emoji: "🏆", name: "Sènior Masculí", any: "fins 2002", preu: "85–105 €", nota: "4 jug.: 85€ · 5 jug.: 105€", special: true },
              { emoji: "🏆", name: "Sènior Femení", any: "fins 2002", preu: "85–105 €", nota: "4 jug.: 85€ · 5 jug.: 105€", special: true },
              { emoji: "🎖️", name: "Veterans Masculí", any: "fins 1986", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
              { emoji: "🎖️", name: "Veterans Femení", any: "fins 1986", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
            ].map((cat) => (
              <div key={cat.name} className={`insc-cat-card${cat.special ? " insc-cat-card--pro" : ""}`}>
                <span className="insc-cat-emoji">{cat.emoji}</span>
                <span className="insc-cat-name">{cat.name}</span>
                <span className="insc-cat-year">{cat.any}</span>
                <span className="insc-cat-price">{cat.preu}</span>
                <span className="insc-cat-note">{cat.nota}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", padding: "1.5rem 0 2rem" }}>
            <Link href="/inscripcion" style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #ff5b1f, #ff2563)",
              color: "#fff", fontWeight: 800, fontSize: "1.05rem",
              padding: "0.9rem 2.5rem", borderRadius: "50px", textDecoration: "none",
            }}>
              🏀 Inscriu el teu equip al Torneig 3×3 Barcelona
            </Link>
            <br />
            <a href={WA} target="_blank" rel="noreferrer"
              style={{ fontSize: "0.9rem", color: "rgba(255,247,239,0.6)", textDecoration: "underline", marginTop: 8, display: "inline-block" }}>
              Pregunta per WhatsApp →
            </a>
          </div>

          <hr className="page-divider" />

          <h2>Com funciona el Torneig 3×3 Barcelona?</h2>
          <ul>
            <li><strong>Format FIBA 3×3</strong>: fases de grups + eliminatòria directa. 3 titulars + fins a 2 suplents per equip.</li>
            <li><strong>Durada dels partits</strong>: 10 minuts o primer equip que arriba a 21 punts.</li>
            <li><strong>Dissabte 6 de juny</strong>: Sèniors M/F (Nau del Clot + Finals Westfield), Veterans M/F i Barna Màgics (Rambleta del Clot).</li>
            <li><strong>Diumenge 7 de juny</strong>: Premini, Mini, Infantil, Cadet, Júnior, Sub-23 (Nau del Clot).</li>
            <li>Arbitratge oficial FIBA. No cal ser federat per participar.</li>
          </ul>

          <hr className="page-divider" />

          <h2>Pages relacionades</h2>
          <ul>
            <li><Link href="/3x3-barna" className="insc-link">3×3 Barna 2026</Link> — la pàgina del torneig per als barcelonins</li>
            <li><Link href="/inscripcion" className="insc-link">Inscripció d&apos;equip</Link> — formulari online en 5 passos</li>
            <li><Link href="/torneo-3x3-senior-fiba-barcelona" className="insc-link">3×3 Sènior FIBA Barcelona</Link></li>
            <li><Link href="/torneo-3x3-femenino-barcelona" className="insc-link">3×3 Femení Barcelona</Link></li>
            <li><Link href="/torneo-3x3-veteranos-barcelona" className="insc-link">3×3 Veterans Barcelona</Link></li>
            <li><Link href="/horarios-3x3-barcelona-2026" className="insc-link">Horaris Torneig 3×3 Barcelona 2026</Link></li>
            <li><Link href="/preguntes-frequents" className="insc-link">Preguntes freqüents</Link></li>
          </ul>

        </main>
      </div>
    </>
  );
}
