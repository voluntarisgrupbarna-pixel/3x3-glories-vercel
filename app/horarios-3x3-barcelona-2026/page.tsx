import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Horaris 3×3 Westfield Glòries 2026 | Dissabte 6 i Diumenge 7 de Juny · Barcelona",
  description:
    "Horaris complets del Torneig 3×3 Barcelona 2026. Dissabte 6 de juny: Sèniors FIBA i Sènior Amateur. Diumenge 7 de juny: Màgics Inclusiva i categories formatives. 3 seus al Clot-Glòries.",
  alternates: { canonical: "/horarios-3x3-barcelona-2026" },
  openGraph: {
    title: "Horaris 3×3 Westfield Glòries 2026 — 6 i 7 de Juny · Barcelona",
    description:
      "Tots els horaris del torneig 3×3 FIBA de Barcelona 2026. Sèniors, Sènior Amateur, Màgics i categories formatives. 3 seus al barri del Clot-Glòries.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inici", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Horaris 3×3 Barcelona 2026", item: `${SITE_URL}/horarios-3x3-barcelona-2026` },
  ],
};

const PROGRAMA = [
  {
    dia: "Dissabte 6 de Juny",
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.08)",
    borderColor: "rgba(249,115,22,0.25)",
    categories: [
      { nom: "Sènior Masculí Pro", hora: "09:00–18:00", seu: "Nau del Clot + Finals Westfield", fiba: true },
      { nom: "Sènior Femení Pro", hora: "09:00–18:00", seu: "Nau del Clot + Finals Westfield", fiba: true },
      { nom: "Sènior Amateur Masculí", hora: "10:00–14:00", seu: "Rambleta del Clot", fiba: false },
      { nom: "Sènior Amateur Femení", hora: "10:00–14:00", seu: "Rambleta del Clot", fiba: false },
      { nom: "Escoleta", hora: "10:00–13:00", seu: "La Nau del Clot", fiba: false },
    ],
  },
  {
    dia: "Diumenge 7 de Juny",
    color: "#60a5fa",
    bgColor: "rgba(96,165,250,0.08)",
    borderColor: "rgba(96,165,250,0.25)",
    categories: [
      { nom: "Màgics · Inclusiva", hora: "11:00–13:00", seu: "Rambleta del Clot", fiba: false },
      { nom: "Premini · Benjamí · Aleví", hora: "09:00–12:00", seu: "La Nau del Clot", fiba: false },
      { nom: "U12 Preinfantil", hora: "09:00–12:00", seu: "La Nau del Clot", fiba: false },
      { nom: "U14 Infantil", hora: "10:00–14:00", seu: "La Nau del Clot", fiba: false },
      { nom: "U16 Cadet", hora: "10:00–14:00", seu: "La Nau del Clot", fiba: false },
      { nom: "U18 Júnior", hora: "12:00–18:00", seu: "La Nau del Clot", fiba: false },
      { nom: "Sub-23", hora: "12:00–18:00", seu: "La Nau del Clot", fiba: false },
    ],
  },
];

const SEUS = [
  {
    id: "WG",
    nom: "Westfield Glòries",
    tipus: "Seu principal · Finals Sènior",
    addr: "Av. Diagonal 208, Barcelona",
    transport: "Metro L1 Glòries · Tram T4/T5/T6 · Pàrquing 2h gratis",
    color: "#f97316",
    emoji: "🏬",
  },
  {
    id: "NC",
    nom: "La Nau del Clot",
    tipus: "Pavelló cobert oficial",
    addr: "Carrer de la Llacuna 172, Barcelona",
    transport: "Metro L1 Clot · L2 Bac de Roda · Bus 7",
    color: "#E31E24",
    emoji: "🏟️",
  },
  {
    id: "RC",
    nom: "Rambleta del Clot",
    tipus: "Pista exterior",
    addr: "Rambla del Poblenou / Clot, Barcelona",
    transport: "Metro L1 Glòries · Tram T4/T5 parada Pallars",
    color: "#EAB308",
    emoji: "🌳",
  },
];

export default function HorarisPage() {
  return (
    <>
      <Script
        id="ld-breadcrumb-horaris"
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
            alt="Programa i horaris del Torneig 3×3 Barcelona 2026 al barri del Clot-Glòries"
            className="insc-hero-img"
          />
          <div className="insc-hero-overlay" />
          <div className="insc-hero-body">
            <span className="insc-hero-kicker">6-7 Juny 2026 · 3 seus · Clot-Glòries, Barcelona</span>
            <h1 className="insc-hero-title">Horaris 3×3 Barcelona 2026</h1>
            <p className="insc-hero-sub">
              Programa complet del Torneig 3×3 Westfield Glòries — totes les categories,
              seus i franges horàries.
            </p>
            <div className="insc-hero-chips">
              <span>📅 Dis 6 Juny · Sèniors + Sènior Amateur + Escoleta</span>
              <span>📅 Diu 7 Juny · Màgics + Formatives</span>
            </div>
          </div>
        </div>

        <main className="page-content">

          {PROGRAMA.map((d) => (
            <div key={d.dia}>
              <h2 style={{ color: d.color }}>{d.dia}</h2>
              <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ background: d.bgColor, borderBottom: `2px solid ${d.borderColor}` }}>
                      <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: d.color }}>Categoria</th>
                      <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: d.color }}>Horari</th>
                      <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: d.color }}>Seu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.categories.map((c, i) => (
                      <tr
                        key={c.nom}
                        style={{
                          background: i % 2 === 0 ? "rgba(255,247,239,0.03)" : "transparent",
                          borderBottom: "1px solid rgba(255,247,239,0.07)",
                        }}
                      >
                        <td style={{ padding: "0.65rem 0.75rem", fontWeight: 600 }}>
                          {c.nom}
                          {c.fiba && (
                            <span
                              style={{
                                marginLeft: "0.5rem",
                                background: "#ef4444",
                                color: "#fff",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                padding: "1px 6px",
                                borderRadius: "4px",
                                letterSpacing: "0.04em",
                                verticalAlign: "middle",
                              }}
                            >
                              FIBA
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "0.65rem 0.75rem", color: "rgba(255,247,239,0.7)", fontFamily: "monospace" }}>
                          {c.hora}
                        </td>
                        <td style={{ padding: "0.65rem 0.75rem", color: "rgba(255,247,239,0.6)", fontSize: "0.82rem" }}>
                          {c.seu}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <p style={{ fontSize: "0.8rem", color: "rgba(255,247,239,0.4)", marginTop: "-1rem", marginBottom: "2rem" }}>
            * Horaris orientatius. Els horaris definitius de cada grup es comuniquen per email i WhatsApp als equips inscrits una setmana abans del torneig.
          </p>

          <hr className="page-divider" />

          <h2>Les 3 seus</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", margin: "1.5rem 0" }}>
            {SEUS.map((s) => (
              <div
                key={s.id}
                style={{
                  background: "rgba(255,247,239,0.04)",
                  border: `1px solid ${s.color}40`,
                  borderRadius: "12px",
                  padding: "1.25rem",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.emoji}</div>
                <div style={{ fontWeight: 700, color: s.color, marginBottom: "0.25rem" }}>{s.nom}</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,247,239,0.5)", marginBottom: "0.5rem" }}>{s.tipus}</div>
                <div style={{ fontSize: "0.82rem", marginBottom: "0.25rem" }}>{s.addr}</div>
                <div style={{ fontSize: "0.77rem", color: "rgba(255,247,239,0.45)" }}>🚇 {s.transport}</div>
              </div>
            ))}
          </div>

          <hr className="page-divider" />

          <div style={{ textAlign: "center", padding: "0.5rem 0 2rem" }}>
            <a
              href="/inscripcion"
              style={{
                display: "inline-block",
                background: "#f97316",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "0.85rem 2.5rem",
                borderRadius: "50px",
                textDecoration: "none",
              }}
            >
              🏀 Inscriu el teu equip — des de 75€
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
