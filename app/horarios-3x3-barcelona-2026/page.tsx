import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Com va anar el programa del 3×3 Westfield Glòries 2026 | 6 i 7 de Juny · Barcelona",
  description:
    "Recull del programa del Torneig 3×3 Barcelona 2026, ja celebrat: dissabte 6 de juny, Sèniors FIBA i Sènior Amateur; diumenge 7 de juny, Màgics Inclusiva i categories formatives. 3 seus al Clot-Glòries.",
  alternates: { canonical: "/horarios-3x3-barcelona-2026" },
  openGraph: {
    title: "Com va anar el programa del 3×3 Westfield Glòries 2026 · Barcelona",
    description:
      "Recull del programa del torneig 3×3 FIBA de Barcelona 2026: Sèniors, Sènior Amateur, Màgics i categories formatives, en 3 seus al barri del Clot-Glòries.",
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
      { nom: "Sènior Masculí Pro", hora: "10:00–21:00", seu: "Pista A · Westfield Glòries", fiba: true },
      { nom: "Sènior Femení Pro", hora: "15:00–21:00", seu: "Pista A · Westfield Glòries", fiba: true },
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
            <span className="insc-hero-kicker">3a edició · 6-7 Juny 2026 · Ja celebrada · 3 seus al Clot-Glòries, Barcelona</span>
            <h1 className="insc-hero-title">Com va anar el programa del 3×3 Barcelona 2026</h1>
            <p className="insc-hero-sub">
              Recull del programa del Torneig 3×3 Westfield Glòries — com es van repartir totes
              les categories, seus i franges horàries a la 3a edició.
            </p>
            <div className="insc-hero-chips">
              <span>📅 Dis 6 Juny · Sèniors + Sènior Amateur + Escoleta</span>
              <span>📅 Diu 7 Juny · Màgics + Formatives</span>
            </div>
          </div>
        </div>

        <main className="page-content">

          {/* ── Recap: l'edició ja s'ha celebrat ── */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))",
              border: "2px solid rgba(239,68,68,0.35)",
              borderRadius: 14,
              padding: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: 16, color: "#fff7ef" }}>
              🏀 La 3a edició ja s&apos;ha celebrat — així va anar el programa
            </p>
            <p style={{ margin: "0 0 14px", fontSize: 14, color: "rgba(255,247,239,0.75)", lineHeight: 1.6 }}>
              El 3×3 Westfield Glòries es va disputar el 6 i 7 de juny de 2026 amb{" "}
              <strong>113 equips inscrits</strong> (rècord) i uns <strong>508 jugadors i jugadores</strong>{" "}
              repartits en 10 categories i 3 seus del Clot-Glòries. A sota trobaràs com es va
              repartir el programa dia a dia. La propera edició encara no té data confirmada.
            </p>
            <a
              href="https://cbgrupbarna.info/fotos-3x3/"
              target="_blank"
              rel="noreferrer noopener"
              style={{
                display: "inline-block",
                background: "#EF4444",
                color: "#fff",
                fontWeight: 800,
                padding: "10px 22px",
                borderRadius: 50,
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              📸 Veure fotos i resultats
            </a>
          </div>

          {/* ── Programa detallat Dissabte ── */}
          <div style={{
            background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)",
            borderRadius: 14, padding: "16px 20px", marginBottom: "2rem",
          }}>
            <h3 style={{ margin: "0 0 14px", color: "#f97316", fontSize: 16, fontWeight: 800 }}>
              🟠 Dissabte 6 de juny · Com es va jugar la fase Sènior (quadre a FIBA Play)
            </h3>
            <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Sènior Masculí Pro (Pool A + Pool B) i Sènior Femení Pro, 10:00–21:00, Pista A Westfield Glòries.{" "}
              <a
                href="https://play.fiba3x3.com/events/4a4773cb-79be-4777-b164-220b36aacbe6/schedule"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b82f6", fontWeight: 700, textDecoration: "none" }}
              >
                Veure el quadre complet a FIBA Play →
              </a>
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(249,115,22,0.3)" }}>
                    <th style={{ textAlign: "left", padding: "6px 10px", color: "#f97316" }}>Hora</th>
                    <th style={{ textAlign: "left", padding: "6px 10px", color: "#f97316" }}>Equips</th>
                    <th style={{ textAlign: "left", padding: "6px 10px", color: "#f97316" }}>Categoria</th>
                    <th style={{ textAlign: "left", padding: "6px 10px", color: "#f97316" }}>Fase</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["10:00","Time Shoko vs mascherano14","Sènior Masc Pro","Pool A"],
                    ["10:20","PANTERAS vs Los Tlatolanis","Sènior Masc Pro","Pool B"],
                    ["10:40","rober3x3 vs Tax 3x3","Sènior Masc Pro","Pool A"],
                    ["11:00","Los Ángeles de Dani vs Chosen Ones","Sènior Masc Pro","Pool B"],
                    ["11:20","mascherano14 vs rober3x3","Sènior Masc Pro","Pool A"],
                    ["11:40","Los Tlatolanis vs Los Ángeles de Dani","Sènior Masc Pro","Pool B"],
                    ["12:00","PANTHERS 3x3 vs Time Shoko","Sènior Masc Pro","Pool A"],
                    ["12:20","CENTREMÈDICMARTORELLES vs PANTERAS","Sènior Masc Pro","Pool B"],
                    ["12:40","rober3x3 vs PANTHERS 3x3","Sènior Masc Pro","Pool A"],
                    ["13:00","Los Ángeles de Dani vs CENTREMÈDICMARTORELLES","Sènior Masc Pro","Pool B"],
                    ["13:20","Tax 3x3 vs mascherano14","Sènior Masc Pro","Pool A"],
                    ["13:40","Chosen Ones vs Los Tlatolanis","Sènior Masc Pro","Pool B"],
                    ["14:40","PANTHERS 3x3 vs Tax 3x3","Sènior Masc Pro","Pool A"],
                    ["15:00","PANTHERS 3x3 vs ProSport 3x3","Sènior Fem Pro","Pool A"],
                    ["15:20","CENTREMÈDICMARTORELLES vs Chosen Ones","Sènior Masc Pro","Pool B"],
                    ["15:40","Streetball Sants vs Team Work","Sènior Fem Pro","Pool A"],
                    ["16:00","Time Shoko vs rober3x3","Sènior Masc Pro","Pool A"],
                    ["16:20","ProSport 3x3 vs Team Work","Sènior Fem Pro","Pool A"],
                    ["16:40","PANTERAS vs Los Ángeles de Dani","Sènior Masc Pro","Pool B"],
                    ["17:00","PANTHERS 3x3 vs Streetball Sants","Sènior Fem Pro","Pool A"],
                    ["17:20","Tax 3x3 vs Time Shoko","Sènior Masc Pro","Pool A"],
                    ["17:40","Chosen Ones vs PANTERAS","Sènior Masc Pro","Pool B"],
                    ["18:00","Streetball Sants vs ProSport 3x3","Sènior Fem Pro","Pool A"],
                    ["18:20","mascherano14 vs PANTHERS 3x3","Sènior Masc Pro","Pool A"],
                    ["18:40","Team Work vs PANTHERS 3x3","Sènior Fem Pro","Pool A"],
                    ["19:00","Los Tlatolanis vs CENTREMÈDICMARTORELLES","Sènior Masc Pro","Pool B"],
                    ["19:20","Semi-finals A/I vs B/II","Sènior Masc Pro","Semifinals"],
                    ["19:40","Semi-finals B/I vs A/II","Sènior Masc Pro","Semifinals"],
                    ["20:00","Final Femenina","Sènior Fem Pro","Final 🏆"],
                    ["20:40","Final Masculina","Sènior Masc Pro","Final 🏆"],
                  ].map(([hora, equips, cat, fase], i) => (
                    <tr key={i} style={{
                      background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                      borderBottom: hora === "20:00" || hora === "19:20" ? "1px solid rgba(249,115,22,0.3)" : "none",
                    }}>
                      <td style={{ padding: "5px 10px", color: "#f97316", fontWeight: 700, whiteSpace: "nowrap" }}>{hora}</td>
                      <td style={{ padding: "5px 10px", color: "#e5e7eb", fontSize: 12 }}>{equips}</td>
                      <td style={{ padding: "5px 10px", color: "#9ca3af", fontSize: 12, whiteSpace: "nowrap" }}>{cat}</td>
                      <td style={{ padding: "5px 10px" }}>
                        <span style={{
                          background: fase.includes("Final") ? "rgba(255,78,138,0.2)" : fase.includes("Semi") ? "rgba(249,115,22,0.2)" : "rgba(96,165,250,0.15)",
                          color: fase.includes("Final") ? "#ff4e8a" : fase.includes("Semi") ? "#f97316" : "#93c5fd",
                          fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                        }}>{fase}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h2 style={{ marginTop: "1.5rem" }}>Com es va repartir cada categoria</h2>
          {PROGRAMA.map((d) => (
            <div key={d.dia}>
              <h3 style={{ color: d.color }}>{d.dia}</h3>
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
            * Horaris tal com es van comunicar als equips inscrits abans del torneig. Els horaris definitius de cada grup es van confirmar per email i WhatsApp la setmana prèvia.
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
              href="https://cbgrupbarna.info/fotos-3x3/"
              target="_blank"
              rel="noreferrer noopener"
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
              📸 Veure fotos i resultats
            </a>
          </div>

          <hr className="page-divider" />

          <h2>Tens dubtes?</h2>
          <p>
            Consulta les{" "}
            <Link href="/preguntes-frequents" className="insc-link">preguntes freqüents</Link>
            {" "}o{" "}
            <Link href="/contacte" className="insc-link">contacta&apos;ns per WhatsApp</Link>{" "}
            per saber-ne més o quan obrim la propera edició. Resposta en menys de 24h.
          </p>
        </main>
      </div>
    </>
  );
}
