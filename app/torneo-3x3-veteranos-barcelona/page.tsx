import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  title: "3×3 Veterans Barcelona 2026 | +35 anys · Torna a la pista al Clot-Glòries",
  description:
    "Torneig 3×3 veterans a Barcelona. Categories Veterans Masculí i Femení (nascuts fins 1986, +38 anys el 2026). Dissabte 6 de juny a la Rambleta del Clot. Trofeus, medalles i festa esportiva.",
  alternates: { canonical: "/torneo-3x3-veteranos-barcelona" },
  openGraph: {
    title: "3×3 Veterans Barcelona 2026 — +35 anys · Clot-Glòries · 6 de juny",
    description:
      "Torna a competir. Munta el teu equip de veterans i viu el 3×3 a l&apos;aire lliure. Categories Veterans M/F al 3×3 Westfield Glòries 2026 de Barcelona.",
  },
};

const SITE_URL = "https://cbgrupbarna-3x3timechamber.com";

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inici", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "3×3 Veterans Barcelona 2026", item: `${SITE_URL}/torneo-3x3-veteranos-barcelona` },
  ],
};

const WA = `https://wa.me/34698425153?text=${encodeURIComponent("Hola! Vull inscriure el meu equip de veterans al 3x3 Westfield Glòries 2026. Nascuts fins 1986.")}`;

export default function VeteransPage() {
  return (
    <>
      <Script
        id="ld-breadcrumb-veterans"
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
            src="/hero-bg-2.webp"
            alt="Jugadors veterans competint a la pista exterior del 3×3 Barcelona a la Rambleta del Clot"
            className="insc-hero-img"
          />
          <div className="insc-hero-overlay" />
          <div className="insc-hero-body">
            <span className="insc-hero-kicker">Dissabte 6 de Juny 2026 · Rambleta del Clot, Barcelona</span>
            <h1 className="insc-hero-title">3×3 Veterans Barcelona</h1>
            <p className="insc-hero-sub">
              Torna a la pista. La categoria Veterans del 3×3 Westfield Glòries és per a jugadors
              i jugadores nascuts fins al 1986 — perquè l&apos;esport no té edat de jubilació.
            </p>
            <div className="insc-hero-chips">
              <span>🎖️ +35 anys (nascuts fins 1986)</span>
              <span>🌳 Pista exterior</span>
              <span>🏀 Veterans M i F</span>
            </div>
          </div>
        </div>

        <main className="page-content">

          <p style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
            El 3×3 Westfield Glòries és un dels pocs torneigs de la zona que manté una{" "}
            <strong>categoria veterans activa i creixent</strong>. Si ets pare o mare d&apos;un
            jugador del club, exjugador, o simplement tens les ganes de competir de nou — és el teu
            moment. L&apos;ambient és de festa esportiva, la pista és a l&apos;aire lliure i el
            barri sencer et veu jugar.
          </p>

          <hr className="page-divider" />

          <h2>Categories i condicions</h2>
          <div className="insc-cat-grid">
            <div className="insc-cat-card">
              <span className="insc-cat-emoji">🎖️</span>
              <span className="insc-cat-name">Veterans Masculí</span>
              <span className="insc-cat-year">Nascuts fins 1986</span>
              <span className="insc-cat-price">75–90 €</span>
              <span className="insc-cat-note">4 jug.: 75€ · 5 jug.: 90€</span>
            </div>
            <div className="insc-cat-card">
              <span className="insc-cat-emoji">🎖️</span>
              <span className="insc-cat-name">Veterans Femení</span>
              <span className="insc-cat-year">Nascudes fins 1986</span>
              <span className="insc-cat-price">75–90 €</span>
              <span className="insc-cat-note">4 jug.: 75€ · 5 jug.: 90€</span>
            </div>
          </div>
          <ul>
            <li>Mínim 3 jugadors per equip (màxim 5).</li>
            <li>No cal ser federat ni pertànyer al CB Grup Barna.</li>
            <li>Tots els jugadors han de tenir nascuda fins al <strong>1986</strong> inclòs.</li>
            <li>Samarreta oficial del torneig inclosa en la inscripció.</li>
          </ul>

          <hr className="page-divider" />

          <h2>On i quan</h2>
          <div style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "12px", padding: "1.25rem", margin: "1rem 0" }}>
            <p style={{ fontWeight: 700, marginBottom: "0.5rem" }}>🟠 Dissabte 6 de juny · 10:00–14:00h</p>
            <p style={{ margin: 0 }}>
              <strong>Rambleta del Clot</strong> — Pista exterior, ambient de carrer, música i
              públic. Rambla del Poblenou / Clot, Barcelona.
            </p>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,247,239,0.55)", marginTop: "0.5rem" }}>
              Metro L1 Glòries o L1 Clot · Tram T4/T5/T6 parada Pallars
            </p>
          </div>

          <hr className="page-divider" />

          <h2>Premis</h2>
          <p>
            Les categories Veterans reben <strong>trofeus i medalles</strong> per als 3 primers
            classificats. A més, tots els equips participants opten als{" "}
            <strong>premis dels comerços col·laboradors de l&apos;Eix Clot</strong> (sortejos,
            lots de productes i experiències del barri).
          </p>

          <div style={{ textAlign: "center", padding: "1.5rem 0 2rem" }}>
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
              🎖️ Inscriu el teu equip Veterans
            </a>
            <br />
            <a href={WA} target="_blank" rel="noreferrer" style={{ fontSize: "0.9rem", color: "rgba(255,247,239,0.6)", textDecoration: "underline" }}>
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
