import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { WA_REGISTER_URL } from "../lib/whatsapp";

export const metadata: Metadata = {
  title: "3×3 Inclusiu Barcelona — Barna Màgics | Categoria inclusiva Westfield Glòries 2026",
  description:
    "Barna Màgics: la categoria inclusiva del 3×3 Westfield Glòries 2026. Esport adaptat i inclusiu a Barcelona, dissabte 6 de juny a la Rambleta del Clot. Oberta a tothom.",
  alternates: { canonical: "/3x3-inclusivo-barcelona-magics" },
  openGraph: {
    title: "Barna Màgics — 3×3 Inclusiu Barcelona 2026 · Westfield Glòries",
    description:
      "La categoria inclusiva del torneig 3×3 de Barcelona. Barna Màgics: esport, inclusió i comunitat. Dissabte 6 de juny 2026 a la Rambleta del Clot.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inici", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Barna Màgics — 3×3 Inclusiu Barcelona", item: `${SITE_URL}/3x3-inclusivo-barcelona-magics` },
  ],
};

const CONTACT_LINK = WA_REGISTER_URL;

export default function MagicsPage() {
  return (
    <>
      <Script
        id="ld-breadcrumb-magics"
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
            src="/hero-bg-1.webp"
            alt="Categoria inclusiva Barna Màgics al Torneig 3×3 Westfield Glòries Barcelona 2026"
            className="insc-hero-img"
          />
          <div className="insc-hero-overlay" />
          <div className="insc-hero-body">
            <span className="insc-hero-kicker">Dissabte 6 de Juny 2026 · Rambleta del Clot, Barcelona</span>
            <h1 className="insc-hero-title">Barna Màgics</h1>
            <p className="insc-hero-sub">
              La categoria inclusiva del 3×3 Westfield Glòries. Esport, diversitat i comunitat —
              perquè el bàsquet és per a tothom. Novetat 2026.
            </p>
            <div className="insc-hero-chips">
              <span>💙 Categoria inclusiva</span>
              <span>✨ Novetat 2026</span>
              <span>🌳 Rambleta del Clot</span>
              <span>♂ ♀ Mixta</span>
            </div>
          </div>
        </div>

        <main className="page-content">

          <div
            style={{
              background: "linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(139,92,246,0.08) 100%)",
              border: "1.5px solid rgba(236,72,153,0.3)",
              borderRadius: "16px",
              padding: "1.5rem",
              margin: "1rem 0 2rem",
            }}
          >
            <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              💙 Barna Màgics — Categoria INCLUSIVA
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              El 3×3 Westfield Glòries 2026 incorpora per primera vegada una{" "}
              <strong>categoria inclusiva</strong> anomenada <strong>Barna Màgics</strong>. És una
              competició adaptada, oberta a jugadors de totes les capacitats, gèneres i nivells.
              L&apos;objectiu és que ningú quedi fora del 3×3.
            </p>
          </div>

          <h2>Com funciona la categoria Màgics</h2>
          <ul>
            <li>Categoria <strong>mixta</strong>: poden jugar persones de qualsevol gènere.</li>
            <li>Format adaptat a les capacitats de cada equip — les regles s&apos;ajusten.</li>
            <li>No cal experiència prèvia en competició.</li>
            <li>Preu d&apos;inscripció: <strong>75€ per equip de 4 jugadors</strong>.</li>
            <li>Inclou samarreta oficial i dorsal del torneig.</li>
          </ul>

          <hr className="page-divider" />

          <h2>On i quan</h2>
          <div
            style={{
              background: "rgba(249,115,22,0.08)",
              border: "1px solid rgba(249,115,22,0.2)",
              borderRadius: "12px",
              padding: "1.25rem",
              margin: "1rem 0",
            }}
          >
            <p style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
              🟠 Dissabte 6 de juny · 11:00–13:00h
            </p>
            <p style={{ margin: 0 }}>
              <strong>Rambleta del Clot</strong> — Pista exterior, ambient festiu, música i públic
              del barri. Rambla del Poblenou / Clot, Barcelona.
            </p>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,247,239,0.55)", marginTop: "0.5rem" }}>
              Metro L1 Glòries o L1 Clot · Tram T4/T5/T6 parada Pallars
            </p>
          </div>

          <hr className="page-divider" />

          <h2>Premis</h2>
          <p>
            Tots els equips participants a Barna Màgics reben{" "}
            <strong>trofeus, medalles i premis dels comerços col·laboradors de l&apos;Eix Clot</strong>.
            L&apos;objectiu és que tothom marxi amb un reconeixement del dia.
          </p>
          <p>
            Si ets una empresa o entitat que vol donar suport específic a la categoria Màgics, consulta
            el nostre paquet{" "}
            <Link href="/patrocinar" className="insc-link">Partner impacte social</Link>.
          </p>

          <hr className="page-divider" />

          <div style={{ textAlign: "center", padding: "1rem 0 2rem" }}>
            <a
              href="/inscripcion"
              style={{
                display: "inline-block",
                background: "#ec4899",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.05rem",
                padding: "0.9rem 2.5rem",
                borderRadius: "50px",
                textDecoration: "none",
                marginBottom: "1rem",
              }}
            >
              💙 Inscriure&apos;s a la categoria Màgics
            </a>
            <br />
            <a href={CONTACT_LINK} target="_blank" rel="noreferrer noopener" style={{ fontSize: "0.9rem", color: "rgba(255,247,239,0.6)", textDecoration: "underline" }}>
              Pregunta per WhatsApp →
            </a>
          </div>

          <hr className="page-divider" />

          <h2>Tens dubtes?</h2>
          <p>
            Contacta&apos;ns per{" "}
            <a href={WA_REGISTER_URL} target="_blank" rel="noreferrer noopener" className="insc-link">WhatsApp</a>{" "}
            i t&apos;expliquem com funciona la categoria Màgics i com inscriure el teu equip.
            Resposta en menys de 24h.
          </p>
        </main>
      </div>
    </>
  );
}
