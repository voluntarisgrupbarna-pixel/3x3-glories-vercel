import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "3×3 Barna 2026 — Torneig de Bàsquet al Clot-Glòries | FIBA · 113 equips",
  description:
    "3×3 Barna 2026 ja s'ha celebrat: 113 equips (rècord), 6-7 juny al Clot-Glòries, 10 categories, 2.000€ de premi paritari. CB Grup Barna × Westfield Glòries × Time Chamber. Veure fotos i resultats.",
  alternates: {
    canonical: "/3x3-barna",
  },
  openGraph: {
    title: "3×3 Barna 2026 — Torneig FIBA al Clot-Glòries, ja celebrat",
    description:
      "El torneig 3×3 de carrer referent de Barna. FIBA oficial, 113 equips (rècord), 2.000€ de premi en metàl·lic paritari. 6-7 juny 2026 al Clot-Glòries, Barcelona. Fotos i resultats disponibles.",
  },
};

const CATEGORIES = [
  { name: "Premini", any: "2016-17", preu: "75€" },
  { name: "Mini", any: "2014-15", preu: "75€" },
  { name: "Infantil", any: "2012-13", preu: "75€" },
  { name: "Cadet", any: "2010-11", preu: "75€" },
  { name: "Júnior", any: "2008-09", preu: "75€" },
  { name: "Sub-23", any: "2003-07", preu: "75€" },
  { name: "Sènior Masculí", any: "fins 2002", preu: "85€", special: true },
  { name: "Sènior Femení", any: "fins 2002", preu: "85€", special: true },
  { name: "Sènior Amateur Masculí", any: "fins 1986", preu: "75€" },
  { name: "Sènior Amateur Femení", any: "fins 1986", preu: "75€" },
];

// JSON-LD FAQ per a la pàgina 3x3-barna
const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Què és el 3×3 Barna?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El 3×3 Barna és el torneig de bàsquet 3×3 FIBA anual organitzat per CB Grup Barna, Time Chamber i Eix Clot al barri del Clot-Glòries de Barcelona. És la cita 3×3 de carrer més important de Barna, amb 10 categories, 2.000€ de premi i punts FIBA per al rànquing mundial.",
      },
    },
    {
      "@type": "Question",
      name: "Quan es va celebrar el 3×3 Barna 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El 3×3 Barna 2026 es va disputar els dies 6 i 7 de juny de 2026 (dissabte i diumenge) al barri del Clot-Glòries de Barcelona, amb un rècord de 113 equips inscrits.",
      },
    },
    {
      "@type": "Question",
      name: "On es va jugar el 3×3 Barna 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El 3×3 Barna 2026 va tenir tres seus al barri del Clot-Glòries: Westfield Glòries (seu principal, finals), La Nau del Clot (pavelló cobert, semifinals) i la Rambleta del Clot (pista de carrer). Totes tres a menys de 10 minuts a peu.",
      },
    },
    {
      "@type": "Question",
      name: "Quant va costar inscriure's al 3×3 Barna 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La inscripció a l'edició 2026 va costar des de 75€ per equip (categories base) fins a 105€ (Sèniors amb 5 jugadors), amb samarreta oficial i dorsal inclosos. Les inscripcions ja estan tancades; el preu de la propera edició es confirmarà quan s'obrin.",
      },
    },
    {
      "@type": "Question",
      name: "El 3×3 Barna dóna punts FIBA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. El 3×3 Barna és un torneig homologat per FIBA 3×3. Els jugadors de les categories Sènior Masculí i Sènior Femení sumen punts al rànquing mundial individual FIBA, que serveix per accedir a competicions internacionals oficials.",
      },
    },
  ],
};

// JSON-LD específic per a la query "3x3 barna"
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "3×3 Barna 2026",
  alternateName: ["3x3 Barna", "Torneig 3×3 Barcelona 2026", "Torneig 3×3 Westfield Glòries", "3x3 Barna Westfield Glories"],
  description:
    "3×3 Barna 2026 — el torneig de bàsquet 3×3 FIBA de referència a Barcelona, ja celebrat. Organitzat per CB Grup Barna, Time Chamber i Eix Clot. 6-7 de juny de 2026 al barri del Clot-Glòries: rècord de 113 equips, 10 categories, 2.000€ de premi en metàl·lic paritari Sèniors, punts FIBA ranking mundial.",
  startDate: "2026-06-06T09:00:00+02:00",
  endDate: "2026-06-07T20:00:00+02:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  sport: "Basketball 3x3",
  url: "https://www.cbgrupbarna-3x3timechamber.com/3x3-barna",
  location: {
    "@type": "Place",
    name: "Westfield Glòries — Clot-Glòries, Barcelona",
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
    url: "https://www.cbgrupbarna-3x3timechamber.com/inscripcion",
    availability: "https://schema.org/SoldOut",
    validFrom: "2026-04-01T00:00:00+02:00",
    validThrough: "2026-06-05T23:59:59+02:00",
  },
};

export default function Page3x3Barna() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <div className="page-shell">
        <nav className="page-nav">
          <Link href="/" className="page-nav-back">← Inici</Link>
          <span className="page-nav-logo">3×3 Barna 2026</span>
        </nav>

        <main className="page-content" style={{ paddingTop: "40px" }}>

          {/* Hero text — dens en paraules clau */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#ff5b1f", textTransform: "uppercase", marginBottom: 12 }}>
              3a edició · Celebrada 6-7 Juny 2026 · Clot-Glòries, Barcelona
            </p>
            <h1 style={{ fontSize: "clamp(36px, 8vw, 64px)", fontWeight: 900, color: "#fff7ef", lineHeight: 1.1, margin: "0 0 16px" }}>
              3×3 Barna 2026
            </h1>
            <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "rgba(255,247,239,0.7)", maxWidth: 540, margin: "0 auto 32px" }}>
              El torneig de bàsquet 3×3 FIBA de referència a <strong style={{ color: "#fff7ef" }}>Barna</strong>. Rècord de <strong style={{ color: "#fff7ef" }}>113 equips</strong>, 10 categories, 3 seus al Clot-Glòries i <strong style={{ color: "#ff5b1f" }}>2.000€ de premi en metàl·lic paritari</strong>.
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

          {/* Blocs informatius */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 40 }}>
            {[
              { icon: "📍", title: "On", text: "Westfield Glòries, La Nau del Clot i Rambleta del Clot — tres seus a menys de 10 minuts a peu en el barri del Clot-Glòries de Barcelona." },
              { icon: "📅", title: "Quan", text: "Es va disputar dissabte 6 i diumenge 7 de juny de 2026. El torneig 3×3 Barna més important de l'any al calendari FIBA — la propera edició encara no té data." },
              { icon: "🏆", title: "Premis", text: "2.000€ en metàl·lic repartits: 1.000€ Sènior Masculí · 1.000€ Sènior Femení, per primer cop paritaris. + Punts FIBA ranking mundial individual. Trofeus i medalles per a totes les categories." },
              { icon: "🏀", title: "FIBA oficial", text: "Torneig homologat per FIBA 3×3. Els jugadors Sèniors van sumar punts al rànquing mundial per accedir a competicions internacionals." },
            ].map((b) => (
              <div key={b.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 20px" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</div>
                <h2 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800, color: "#fff7ef" }}>{b.title}</h2>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,247,239,0.65)", lineHeight: 1.6 }}>{b.text}</p>
              </div>
            ))}
          </div>

          <hr className="page-divider" />

          {/* Categories */}
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff7ef", marginBottom: 16 }}>Categories del 3×3 Barna 2026</h2>
          <p style={{ color: "rgba(255,247,239,0.65)", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            El 3×3 Barna 2026 va tenir <strong style={{ color: "#fff7ef" }}>10 categories</strong> per edat i gènere, de Premini a Sènior Amateur, amb equips de tot Catalunya i Espanya. Tots els equips van rebre samarreta oficial i dorsal. Preus de referència de l&apos;edició 2026 — es confirmaran de nou quan s&apos;obrin les inscripcions del 2027.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 40 }}>
            {CATEGORIES.map((c) => (
              <div key={c.name} style={{
                background: c.special ? "rgba(255,87,31,0.12)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${c.special ? "rgba(255,87,31,0.3)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 12, padding: "16px 14px",
                display: "flex", flexDirection: "column", gap: 4,
              }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: "#fff7ef" }}>{c.name}</span>
                <span style={{ fontSize: 12, color: "rgba(255,247,239,0.5)" }}>{c.any}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#ff5b1f" }}>{c.preu}</span>
              </div>
            ))}
          </div>

          <hr className="page-divider" />

          {/* Text SEO dens */}
          <div style={{ maxWidth: 680, margin: "0 auto 40px" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff7ef", marginBottom: 12 }}>
              El 3×3 Barna de referència
            </h2>
            <p style={{ color: "rgba(255,247,239,0.7)", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
              El <strong style={{ color: "#fff7ef" }}>3×3 Barna</strong> és el nom amb el qual la comunitat bàsquetbolística de Barcelona coneix el torneig anual organitzat per <strong style={{ color: "#fff7ef" }}>CB Grup Barna</strong>, <strong style={{ color: "#fff7ef" }}>Time Chamber</strong> i <strong style={{ color: "#fff7ef" }}>Eix Clot</strong> al barri del Clot-Glòries. Des de la seva primera edició el 2023, el torneig ha crescut fins a convertir-se en la cita 3×3 FIBA més important de <strong style={{ color: "#fff7ef" }}>Barna</strong> per calendari, premis i participants.
            </p>
            <p style={{ color: "rgba(255,247,239,0.7)", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
              La 3a edició del <strong style={{ color: "#fff7ef" }}>3×3 Barna 2026</strong> va reunir un rècord de <strong style={{ color: "#fff7ef" }}>113 equips</strong> i uns 508 jugadors i jugadores en 10 categories, del Premini (8-9 anys) al Sènior Amateur (+35 anys), en tres seus emblemàtiques del Clot: Westfield Glòries com a seu principal, La Nau del Clot com a pavelló oficial i la Rambleta del Clot per als partits de carrer en ambient festiu.
            </p>
            <p style={{ color: "rgba(255,247,239,0.7)", fontSize: 15, lineHeight: 1.7 }}>
              Si busques el <strong style={{ color: "#fff7ef" }}>millor torneig 3×3 de Barna</strong>, has arribat al lloc correcte. L&apos;edició 2026 ja s&apos;ha tancat — descobreix com va anar a les fotos i resultats, o deixa&apos;ns el teu contacte i t&apos;avisem quan obrim les inscripcions del 2027.
            </p>
          </div>

          <hr className="page-divider" />

          {/* FAQ */}
          <div style={{ maxWidth: 680, margin: "0 auto 40px" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff7ef", marginBottom: 20 }}>
              Preguntes freqüents sobre el 3×3 Barna
            </h2>
            {[
              { q: "Què és el 3×3 Barna?", a: "El 3×3 Barna és el torneig de bàsquet 3×3 FIBA anual del barri del Clot-Glòries. Organitzat per CB Grup Barna, Time Chamber i Eix Clot, és la cita 3×3 de carrer més important de Barna: 10 categories, 2.000€ de premi i punts FIBA." },
              { q: "Quan es va celebrar el 3×3 Barna 2026?", a: "Dissabte 6 i diumenge 7 de juny de 2026, amb un rècord de 113 equips inscrits." },
              { q: "On es va jugar el 3×3 Barna?", a: "Tres seus al Clot-Glòries: Westfield Glòries (finals), La Nau del Clot (semifinals) i Rambleta del Clot (carrer). Tot a menys de 10 minuts a peu." },
              { q: "Quant va costar inscriure's?", a: "Des de 75€ per equip (categories base) fins a 105€ (Sèniors 5 jugadors). Samarreta oficial i dorsal inclosos. Les inscripcions ja estan tancades; el preu del 2027 es confirmarà més endavant." },
              { q: "El 3×3 Barna dóna punts FIBA?", a: "Sí. Torneig homologat FIBA 3×3. Els Sèniors van sumar punts al rànquing mundial individual per accedir a competicions internacionals." },
            ].map((faq, i) => (
              <details key={i} style={{ marginBottom: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 20px" }}>
                <summary style={{ fontWeight: 700, fontSize: 15, color: "#fff7ef", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {faq.q} <span style={{ color: "#ff5b1f", fontSize: 18, marginLeft: 8 }}>+</span>
                </summary>
                <p style={{ margin: "12px 0 0", fontSize: 14, color: "rgba(255,247,239,0.7)", lineHeight: 1.7 }}>{faq.a}</p>
              </details>
            ))}
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
              📸 Veure fotos i resultats del 3×3 Barna 2026
            </a>
            <p style={{ marginTop: 12, fontSize: 13, color: "rgba(255,247,239,0.4)" }}>
              113 equips · 508 jugadors/es · Edició tancada — ens veiem el 2027
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
