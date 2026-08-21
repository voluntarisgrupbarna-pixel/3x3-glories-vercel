import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { WA_REGISTER_URL } from "../lib/whatsapp";

export const metadata: Metadata = {
  title: "3×3 Inclusiu Barcelona — Barna Màgics | Categoria inclusiva 3×3 Westfield Glòries",
  description:
    "Barna Màgics: la categoria inclusiva del 3×3 Westfield Glòries. Esport adaptat a Barcelona — a la 3a edició (6-7 juny 2026) hi va competir amb trofeu propi a la Rambleta del Clot.",
  alternates: { canonical: "/3x3-inclusivo-barcelona-magics" },
  openGraph: {
    title: "Barna Màgics — 3×3 Inclusiu Barcelona · Westfield Glòries",
    description:
      "La categoria inclusiva del torneig 3×3 de Barcelona. Barna Màgics: esport, inclusió i comunitat. Va competir el 7 de juny de 2026 a la Rambleta del Clot.",
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
            <span className="insc-hero-kicker">3a edició · 7 de Juny 2026 · Rambleta del Clot, Barcelona</span>
            <h1 className="insc-hero-title">Barna Màgics</h1>
            <p className="insc-hero-sub">
              La categoria inclusiva del 3×3 Westfield Glòries. Esport, diversitat i comunitat —
              perquè el bàsquet és per a tothom. Estrena a la 3a edició, 2026.
            </p>
            <div className="insc-hero-chips">
              <span>💙 Categoria inclusiva</span>
              <span>✨ Estrena 2026</span>
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
              El 3×3 Westfield Glòries va incorporar per primera vegada, a la 3a edició de 2026, una{" "}
              <strong>categoria inclusiva</strong> anomenada <strong>Barna Màgics</strong>. Va ser una
              competició adaptada, oberta a jugadors de totes les capacitats, gèneres i nivells.
              L&apos;objectiu: que ningú quedi fora del 3×3.
            </p>
          </div>

          <h2>Com va funcionar la categoria Màgics</h2>
          <ul>
            <li>Categoria <strong>mixta</strong>: hi van poder jugar persones de qualsevol gènere.</li>
            <li>Format adaptat a les capacitats de cada equip — les regles es van ajustar.</li>
            <li>No calia experiència prèvia en competició.</li>
            <li>Preu d&apos;inscripció de referència (2026): <strong>75€ per equip de 4 jugadors</strong>.</li>
            <li>Incloïa samarreta oficial i dorsal del torneig.</li>
          </ul>

          <hr className="page-divider" />

          <h2>On i quan es va jugar</h2>
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
              🔵 Diumenge 7 de juny · 11:00–13:00h
            </p>
            <p style={{ margin: 0 }}>
              <strong>Rambleta del Clot</strong> — pista exterior, ambient festiu, música i públic
              del barri. Rambla del Poblenou / Clot, Barcelona.
            </p>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,247,239,0.55)", marginTop: "0.5rem" }}>
              Metro L1 Glòries o L1 Clot · Tram T4/T5/T6 parada Pallars
            </p>
          </div>

          <hr className="page-divider" />

          <h2>Qui hi va competir ✨</h2>
          <div
            style={{
              background: "linear-gradient(135deg, rgba(96,165,250,0.10) 0%, rgba(236,72,153,0.08) 100%)",
              border: "1.5px solid rgba(96,165,250,0.25)",
              borderRadius: "14px",
              padding: "1.25rem 1.5rem",
              margin: "1rem 0",
            }}
          >
            <p style={{ marginBottom: "0.75rem", color: "rgba(255,247,239,0.7)", fontSize: "0.9rem" }}>
              Equips i entitats que van participar a la primera edició de la categoria Màgics:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.4rem" }}>✅</span>
                <div>
                  <p style={{ fontWeight: 700, margin: 0 }}>Sesé</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.4rem" }}>✅</span>
                <div>
                  <p style={{ fontWeight: 700, margin: 0 }}>Lluïsos</p>
                </div>
              </div>
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "rgba(255,247,239,0.5)", margin: "1rem 0 0" }}>
              Vols que el teu equip hi sigui a la propera edició? Escriu-nos per WhatsApp i t&apos;avisem quan obrim el 2027.
            </p>
          </div>

          <hr className="page-divider" />

          <h2>Premis</h2>
          <p>
            Tots els equips participants a Barna Màgics van rebre{" "}
            <strong>trofeus, medalles i premis dels comerços col·laboradors de l&apos;Eix Clot</strong>.
            L&apos;objectiu va ser que tothom marxés amb un reconeixement del dia.
          </p>
          <p>
            Si ets una empresa o entitat que vol donar suport específic a la categoria Màgics, consulta
            el nostre paquet{" "}
            <Link href="/patrocinar" className="insc-link">Partner impacte social</Link>.
          </p>

          <hr className="page-divider" />

          <div style={{ textAlign: "center", padding: "1rem 0 2rem" }}>
            <a
              href="https://cbgrupbarna.info/fotos-3x3/"
              target="_blank"
              rel="noreferrer noopener"
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
              📸 Veure fotos i resultats
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
            i t&apos;expliquem com va funcionar la categoria Màgics i quan obrirem la propera edició.
            Resposta en menys de 24h.
          </p>
        </main>
      </div>
    </>
  );
}
