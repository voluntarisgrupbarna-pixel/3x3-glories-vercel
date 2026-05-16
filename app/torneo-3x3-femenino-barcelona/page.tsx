import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  title: "3×3 Femení Barcelona 2026 | Sènior Femení FIBA · 1.000€ premi",
  description:
    "Torneig 3×3 femení a Barcelona 2026. Sènior Femení FIBA: 1.000€ de premi en metàl·lic + punts rànquing mundial. Categories Mini, Infantil, Cadet, Júnior, Veterans i Sènior Femení. 6-7 juny.",
  alternates: { canonical: "/torneo-3x3-femenino-barcelona" },
  openGraph: {
    title: "3×3 Femení Barcelona 2026 — Sènior F FIBA + 1.000€ · Totes les categories",
    description:
      "Bàsquet 3×3 femení a Barcelona: des de Mini fins a Veterans i Sènior Pro. Premi equiparat 1.000€ Sènior Femení. 6-7 juny 2026 al Clot-Glòries.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inici", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "3×3 Femení Barcelona 2026", item: `${SITE_URL}/torneo-3x3-femenino-barcelona` },
  ],
};

const CONTACT_LINK = "/contacte?contacte=1";

const CATS_FEMENINES = [
  { name: "Sènior Femení", any: "fins 2002", preu: "85–90€", fiba: true },
  { name: "Veterans Femení", any: "fins 1986 (+38 anys)", preu: "75–90€", fiba: false },
  { name: "Màgics · Inclusiva", any: "Mixta, tots els nivells", preu: "75€", fiba: false },
];

export default function FemeniPage() {
  return (
    <>
      <Script
        id="ld-breadcrumb-femeni"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="page-shell">
        <nav className="page-nav">
          <Link href="/" className="page-nav-back">← Inici</Link>
          <span className="page-nav-logo">3×3 Glòries 2026</span>
        </nav>

        <div className="insc-hero">
          <img
            src="/hero-bg-3.webp"
            alt="Jugadora encistellant al Torneig 3×3 Femení Barcelona 2026 a Westfield Glòries"
            className="insc-hero-img"
          />
          <div className="insc-hero-overlay" />
          <div className="insc-hero-body">
            <span className="insc-hero-kicker">6-7 Juny 2026 · Clot-Glòries, Barcelona</span>
            <h1 className="insc-hero-title">3×3 Femení Barcelona 2026</h1>
            <p className="insc-hero-sub">
              Premi equiparat, FIBA oficial i totes les categories — del torneig 3×3 de bàsquet
              femení de referència a Barcelona.
            </p>
            <div className="insc-hero-chips">
              <span>🏆 1.000€ Sènior Femení</span>
              <span>🔴 FIBA Oficial</span>
              <span>♀ Categories M/F equiparades</span>
            </div>
          </div>
        </div>

        <main className="page-content">

          <p style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
            El 3×3 Westfield Glòries és un dels pocs torneigs de bàsquet 3×3 d&apos;Espanya amb{" "}
            <strong>premi en metàl·lic equiparat</strong> entre Sèniors Masculí i Sèniors Femení.{" "}
            <strong>1.000€ per a les Sèniors Femení</strong> i punts FIBA per al rànquing mundial
            individual — perquè el bàsquet femení mereix el mateix reconeixement.
          </p>

          <hr className="page-divider" />

          <h2>Categories femenines</h2>
          <p>
            Hi ha categories femenines a tots els nivells: des de les Sèniores Pro fins a Veterans
            i la categoria inclusiva Màgics (mixta). Les categories formatives (Mini, Infantil,
            Cadet, Júnior, Sub-23) juguen de forma mixta o en funció de l&apos;equip inscrit.
          </p>

          <div className="insc-cat-grid">
            {CATS_FEMENINES.map((c) => (
              <div key={c.name} className={`insc-cat-card${c.fiba ? " insc-cat-card--pro" : ""}`}>
                <span className="insc-cat-emoji">{c.fiba ? "🏆" : "🏀"}</span>
                <span className="insc-cat-name">{c.name}</span>
                <span className="insc-cat-year">{c.any}</span>
                <span className="insc-cat-price">{c.preu}</span>
                <span className="insc-cat-note">{c.fiba ? "FIBA · 1.000€ premi" : "Trofeus i medalles"}</span>
              </div>
            ))}
          </div>

          <hr className="page-divider" />

          <h2>Horari categories femenines</h2>
          <div style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "12px", padding: "1.25rem", margin: "1rem 0" }}>
            <p style={{ fontWeight: 700, color: "#f97316", marginBottom: "0.5rem" }}>
              🟠 Dissabte 6 de juny — Sèniores i Veterans
            </p>
            <ul style={{ margin: 0, padding: "0 0 0 1.1rem", listStyle: "disc" }}>
              <li>Sènior Femení Pro: 09:00–18:00 (Nau del Clot + Finals WG)</li>
              <li>Veterans Femení: 10:00–14:00 (Rambleta del Clot)</li>
              <li>Màgics Inclusiva: 11:00–13:00 (Rambleta del Clot)</li>
            </ul>
          </div>
          <div style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "12px", padding: "1.25rem", margin: "1rem 0" }}>
            <p style={{ fontWeight: 700, color: "#60a5fa", marginBottom: "0.5rem" }}>
              🔵 Diumenge 7 de juny — Categories formatives mixtes
            </p>
            <ul style={{ margin: 0, padding: "0 0 0 1.1rem", listStyle: "disc" }}>
              <li>Premini · Mini · Infantil · Cadet · Júnior · Sub-23</li>
              <li>09:00–18:00 (La Nau del Clot)</li>
            </ul>
          </div>

          <hr className="page-divider" />

          <div style={{ textAlign: "center", padding: "1rem 0 2rem" }}>
            <a
              href="/inscripcion"
              style={{
                display: "inline-block",
                background: "#f97316",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.05rem",
                padding: "0.9rem 2.5rem",
                borderRadius: "50px",
                textDecoration: "none",
                marginBottom: "1rem",
              }}
            >
              🏀 Inscriu el teu equip femení
            </a>
            <br />
            <a href={CONTACT_LINK} style={{ fontSize: "0.9rem", color: "rgba(255,247,239,0.6)", textDecoration: "underline" }}>
              Pregunta per WhatsApp →
            </a>
          </div>

          <hr className="page-divider" />

          <h2>Tens dubtes?</h2>
          <p>
            Consulta les{" "}
            <Link href="/preguntes-frequents" className="insc-link">preguntes freqüents</Link>
            {" "}o{" "}
            <Link href="/contacte" className="insc-link">contacta&apos;ns per WhatsApp</Link>.
            Resposta en menys de 24h.
          </p>
        </main>
      </div>
    </>
  );
}
