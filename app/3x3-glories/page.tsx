import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "3×3 Glòries 2026 — Torneig Bàsquet Westfield Glòries · FIBA · 113 equips",
  description:
    "El 3×3 Glòries 2026 ja s'ha celebrat al Westfield Glòries de Barcelona: 113 equips (rècord), 10 categories, 2.000€ de premi paritari i punts FIBA. Veure fotos i resultats — ens veiem el 2027.",
  alternates: {
    canonical: "/3x3-glories",
  },
  openGraph: {
    title: "3×3 Glòries 2026 — Torneig FIBA al Westfield Glòries · Ja celebrat",
    description:
      "El 3×3 Glòries 2026 ja s'ha celebrat al Westfield Glòries de Barcelona: 113 equips (rècord), 10 categories, 2.000€ de premi paritari i punts FIBA. Veure fotos i resultats.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "3×3 Glòries 2026",
  alternateName: [
    "3x3 Glories",
    "3x3 Westfield Glories",
    "3x3 Barna",
    "Torneig 3×3 Glòries Barcelona",
    "3x3 Glories Barcelona 2026",
  ],
  description:
    "Torneig de bàsquet 3×3 FIBA al Westfield Glòries de Barcelona. 3a edició, celebrada el 6-7 juny 2026 amb un rècord de 113 equips. 10 categories de Premini a Sènior Amateur, 2.000€ de premi en metàl·lic paritari Sèniors, punts FIBA rànquing mundial. Organitzat per CB Grup Barna i Time Chamber.",
  startDate: "2026-06-06T09:00:00+02:00",
  endDate: "2026-06-07T20:00:00+02:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  sport: "Basketball 3x3",
  url: `${SITE_URL}/3x3-glories`,
  location: {
    "@type": "Place",
    name: "Westfield Glòries",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Diagonal 208",
      addressLocality: "Barcelona",
      postalCode: "08018",
      addressRegion: "Catalunya",
      addressCountry: "ES",
    },
    geo: { "@type": "GeoCoordinates", latitude: 41.4048, longitude: 2.1896 },
  },
  organizer: {
    "@type": "SportsOrganization",
    name: "CB Grup Barna",
    url: "https://cbgrupbarna.com",
    sameAs: ["https://www.instagram.com/cbgrupbarna/"],
  },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "75",
    highPrice: "105",
    priceCurrency: "EUR",
    url: `${SITE_URL}/inscripcion`,
    availability: "https://schema.org/SoldOut",
    validFrom: "2026-04-01T00:00:00+02:00",
    validThrough: "2026-06-05T23:59:59+02:00",
  },
};

export default function Page3x3Glories() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="page-shell">
        <nav className="page-nav">
          <Link href="/" className="page-nav-back">← Inici</Link>
          <span className="page-nav-logo">3×3 Glòries 2026</span>
        </nav>

        <main className="page-content" style={{ paddingTop: "40px" }}>

          {/* Hero text */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#ff5b1f", textTransform: "uppercase", marginBottom: 12 }}>
              3a edició · Celebrada el 6-7 Juny 2026 · Westfield Glòries, Barcelona
            </p>
            <h1 style={{ fontSize: "clamp(36px, 8vw, 64px)", fontWeight: 900, color: "#fff7ef", lineHeight: 1.1, margin: "0 0 16px" }}>
              3×3 Glòries 2026
            </h1>
            <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "rgba(255,247,239,0.7)", maxWidth: 540, margin: "0 auto 32px" }}>
              El torneig de bàsquet 3×3 FIBA al costat del <strong style={{ color: "#fff7ef" }}>Westfield Glòries</strong>. Rècord de <strong style={{ color: "#fff7ef" }}>113 equips</strong>, 10 categories, <strong style={{ color: "#ff5b1f" }}>2.000€ de premi en metàl·lic</strong> paritari.
            </p>
            <a
              href="https://cbgrupbarna.info/fotos-3x3/"
              target="_blank"
              rel="noreferrer noopener"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #ff5b1f, #ff2563)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 16,
                padding: "14px 32px",
                borderRadius: 999,
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              📸 Veure fotos i resultats
            </a>
          </div>

          <hr className="page-divider" />

          {/* Info cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 40 }}>
            {[
              { icon: "📍", title: "On", text: "Westfield Glòries, Av. Diagonal 208, Barcelona. Seu principal del torneig: pista exterior, finals Sèniors, cerimònia de cloenda." },
              { icon: "📅", title: "Quan", text: "Es va disputar el dissabte 6 i el diumenge 7 de juny de 2026. El torneig 3×3 Glòries és la cita anual de bàsquet de carrer al Clot-Glòries." },
              { icon: "🏆", title: "Premis", text: "2.000€ en metàl·lic: 1.000€ Sènior Masculí + 1.000€ Sènior Femení, per primer cop paritari. Punts FIBA rànquing mundial. Trofeus i medalles per a totes les categories." },
              { icon: "🏟️", title: "3 Seus", text: "Westfield Glòries (finals), La Nau del Clot (semifinals cobert) i Rambleta del Clot (pista carrer). Totes a menys de 15 minuts a peu." },
            ].map((b) => (
              <div key={b.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 20px" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</div>
                <h2 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800, color: "#fff7ef" }}>{b.title}</h2>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,247,239,0.65)", lineHeight: 1.6 }}>{b.text}</p>
              </div>
            ))}
          </div>

          <hr className="page-divider" />

          {/* Secció Westfield Glòries */}
          <div style={{ maxWidth: 680, margin: "0 auto 40px" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff7ef", marginBottom: 12 }}>
              El Westfield Glòries, escenari del 3×3
            </h2>
            <p style={{ color: "rgba(255,247,239,0.7)", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
              El <strong style={{ color: "#fff7ef" }}>Westfield Glòries</strong> (Av. Diagonal 208, Barcelona) és l&apos;escenari principal del <strong style={{ color: "#fff7ef" }}>3×3 Glòries</strong> des de la primera edició el 2023. L&apos;espai exterior del centre comercial es transforma cada any en una pista FIBA de competició, amb grades, pantalla gegant i DJ en directe. La seva ubicació estratègica al barri del Clot-Glòries, al cor del Districte de Sant Martí, el converteix en el punt de trobada perfecte per a la comunitat bàsquetbolística de Barcelona.
            </p>
            <p style={{ color: "rgba(255,247,239,0.7)", fontSize: 15, lineHeight: 1.7 }}>
              Les finals de les categories Sènior Masculí i Sènior Femení es van disputar al <strong style={{ color: "#fff7ef" }}>Westfield Glòries</strong>, davant del públic més nombrós del torneig. El centre comercial ofereix pàrquing gratuït les 2 primeres hores i es troba a 5 minuts a peu de la sortida de metro L1 estació Glòries. El <strong style={{ color: "#ff5b1f" }}>3×3 Glòries 2026</strong> ha estat l&apos;únic torneig 3×3 FIBA oficial de Barcelona amb un entorn tan icònic — la propera edició, el 2027, encara no té data confirmada.
            </p>
          </div>

          <hr className="page-divider" />

          {/* Cross-links */}
          <div style={{ maxWidth: 680, margin: "0 auto 40px" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff7ef", marginBottom: 16 }}>
              Més sobre el torneig
            </h2>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              <li>
                <Link href="/3x3-barna" className="insc-link">
                  3×3 Barna 2026
                </Link>
                {" "}— pàgina principal del torneig amb totes les categories i informació d&apos;inscripció
              </li>
              <li>
                <Link href="/3x3-barcelona" className="insc-link">
                  3×3 Barcelona 2026
                </Link>
                {" "}— informació completa: seus, horaris, preguntes freqüents i cross-links
              </li>
              <li>
                <a href="https://cbgrupbarna.info/fotos-3x3/" target="_blank" rel="noreferrer noopener" className="insc-link">
                  Fotos i resultats de l&apos;edició 2026
                </a>
                {" "}— les 377 fotos oficials del torneig
              </li>
              <li>
                <Link href="/preguntes-frequents" className="insc-link">
                  Preguntes freqüents
                </Link>
                {" "}— respostes a tots els dubtes sobre el 3×3 Glòries
              </li>
            </ul>
          </div>

          {/* CTA final */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <a
              href="https://cbgrupbarna.info/fotos-3x3/"
              target="_blank"
              rel="noreferrer noopener"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #ff5b1f, #ff2563)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 18,
                padding: "16px 40px",
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              📸 Veure fotos i resultats del 3×3 Glòries 2026
            </a>
            <p style={{ marginTop: 12, fontSize: 13, color: "rgba(255,247,239,0.4)" }}>
              113 equips inscrits · Rècord de participació · Ens veiem el 2027
            </p>
          </div>

          <hr className="page-divider" />

          <p style={{ fontSize: 13, color: "rgba(255,247,239,0.4)", textAlign: "center" }}>
            Tens dubtes?{" "}
            <Link href="/preguntes-frequents" className="insc-link">Preguntes freqüents</Link>
            {" "}·{" "}
            <Link href="/contacte" className="insc-link">Contacta&apos;ns</Link>
          </p>

        </main>
      </div>
    </>
  );
}
