import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { WA_REGISTER_URL } from "../../lib/whatsapp";

export const metadata: Metadata = {
  title: "Torneo 3x3 Barcelona 2026 | Westfield Glòries · FIBA · 2.000€ premios",
  description:
    "Inscríbete al torneo 3x3 de Barcelona 2026 en Westfield Glòries. Categorías desde Premini hasta Sénior Pro, puntos FIBA, 2.000€ en premios y camiseta oficial. 6-7 junio.",
  alternates: {
    canonical: "/es/torneo-3x3-barcelona",
    languages: {
      ca: "https://www.cbgrupbarna-3x3timechamber.com/torneig-3x3-barcelona",
      es: "https://www.cbgrupbarna-3x3timechamber.com/es/torneo-3x3-barcelona",
      "x-default": "https://www.cbgrupbarna-3x3timechamber.com/",
    },
  },
  openGraph: {
    title: "Torneo 3x3 Barcelona 2026 — Westfield Glòries · FIBA · Premios",
    description:
      "El torneo 3x3 FIBA de referencia en Barcelona. Sábado 6 y domingo 7 de junio en el barrio del Clot-Glòries. 10 categorías, 3 sedes, 2.000€ en premios.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Torneo 3x3 Barcelona 2026", item: `${SITE_URL}/es/torneo-3x3-barcelona` },
  ],
};

const CONTACT_LINK = WA_REGISTER_URL;

const CATEGORIAS = [
  { name: "Premini", año: "2016–2017", precio: "75–90 €" },
  { name: "Mini", año: "2014–2015", precio: "75–90 €" },
  { name: "Infantil", año: "2012–2013", precio: "75–90 €" },
  { name: "Cadete", año: "2010–2011", precio: "75–90 €" },
  { name: "Júnior U18", año: "2008–2009", precio: "75–90 €" },
  { name: "Sub-23", año: "2003–2007", precio: "75–90 €" },
  { name: "Sénior Masculino", año: "hasta 2002", precio: "85–105 €", pro: true },
  { name: "Sénior Femenino", año: "hasta 2002", precio: "85–105 €", pro: true },
  { name: "Sènior Amateur Masculino", año: "hasta 1986", precio: "75–90 €" },
  { name: "Sènior Amateur Femenino", año: "hasta 1986", precio: "75–90 €" },
];

export default function TorneoESPage() {
  return (
    <>
      <Script
        id="ld-breadcrumb-es"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="page-shell">
        <nav className="page-nav">
          <Link href="/" className="page-nav-back">← Inicio</Link>
          <span className="page-nav-logo">3×3 Glòries 2026</span>
        </nav>

        <div className="insc-hero">
          <img
            src="/hero-bg-1.webp"
            alt="Equipos compitiendo en el Torneo 3x3 Barcelona 2026 en Westfield Glòries"
            className="insc-hero-img"
          />
          <div className="insc-hero-overlay" />
          <div className="insc-hero-body">
            <span className="insc-hero-kicker">3a edición · 6-7 Junio 2026 · Clot-Glòries, Barcelona</span>
            <h1 className="insc-hero-title">Torneo 3x3 Barcelona 2026</h1>
            <p className="insc-hero-sub">
              El torneo de baloncesto 3x3 FIBA de referencia en Barcelona — 10 categorías, 3 sedes,
              2.000€ en premios y ambiente urbano en el Clot-Glòries.
            </p>
            <div className="insc-hero-chips">
              <span>🏆 FIBA Oficial</span>
              <span>💰 2.000€ premios</span>
              <span>🏀 Desde 75€</span>
              <span>📍 3 sedes · Barrio Clot</span>
            </div>
          </div>
        </div>

        <main className="page-content">

          <p style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
            El <strong>3×3 Westfield Glòries</strong> es el único torneo de baloncesto 3x3 con
            puntos FIBA oficial en la ciudad de Barcelona en 2026. Organizado por{" "}
            <strong>CB Grup Barna</strong> (club con 60 años de historia en el barrio), Time Chamber
            y Eix Clot. El <strong>sábado 6 y domingo 7 de junio</strong> el barrio del
            Clot-Glòries se convierte en la capital del 3x3.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1rem",
              margin: "2rem 0",
            }}
          >
            {[
              { v: "180+", l: "Equipos en ediciones anteriores" },
              { v: "800+", l: "Jugadores y jugadoras" },
              { v: "10", l: "Categorías" },
              { v: "4ª", l: "Edición consecutiva" },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  background: "rgba(255,247,239,0.06)",
                  border: "1px solid rgba(255,247,239,0.12)",
                  borderRadius: "12px",
                  padding: "1.25rem 1rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800, color: "#f97316", lineHeight: 1, marginBottom: "0.4rem" }}>
                  {s.v}
                </div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,247,239,0.55)" }}>{s.l}</div>
              </div>
            ))}
          </div>

          <hr className="page-divider" />

          <h2>Programa — ¿Cuándo juega cada categoría?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", margin: "1.5rem 0" }}>
            <div style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#f97316", marginBottom: "0.75rem" }}>
                🟠 Sábado 6 de junio
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 1.1rem", listStyle: "disc" }}>
                <li style={{ marginBottom: "0.4rem" }}>Sénior Masculino Pro · 09:00–18:00 <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>FIBA</span></li>
                <li style={{ marginBottom: "0.4rem" }}>Sénior Femenino Pro · 09:00–18:00 <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>FIBA</span></li>
                <li>Sènior Amateur M/F (+35) · 10:00–14:00</li>
              </ul>
            </div>
            <div style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#60a5fa", marginBottom: "0.75rem" }}>
                🔵 Domingo 7 de junio
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 1.1rem", listStyle: "disc" }}>
                <li style={{ marginBottom: "0.4rem" }}>Màgics Inclusiva · 11:00–13:00</li>
                <li style={{ marginBottom: "0.4rem" }}>Premini · Benjamín · Alevín · 09:00–12:00</li>
                <li style={{ marginBottom: "0.4rem" }}>U12 Preinfantil · 09:00–12:00</li>
                <li style={{ marginBottom: "0.4rem" }}>U14 Infantil · 10:00–14:00</li>
                <li style={{ marginBottom: "0.4rem" }}>U16 Cadete · 10:00–14:00</li>
                <li style={{ marginBottom: "0.4rem" }}>U18 Júnior · 12:00–18:00</li>
                <li>Sub-23 · 12:00–18:00</li>
              </ul>
            </div>
          </div>

          <hr className="page-divider" />

          <h2>Categorías y precios de inscripción</h2>
          <p>10 categorías por edad y género. Todos los equipos reciben camiseta oficial y dorsal.</p>

          <div className="insc-cat-grid">
            {CATEGORIAS.map((c) => (
              <div key={c.name} className={`insc-cat-card${c.pro ? " insc-cat-card--pro" : ""}`}>
                <span className="insc-cat-emoji">{c.pro ? "🏆" : "🏀"}</span>
                <span className="insc-cat-name">{c.name}</span>
                <span className="insc-cat-year">{c.año}</span>
                <span className="insc-cat-price">{c.precio}</span>
                <span className="insc-cat-note">3–5 jugadores</span>
              </div>
            ))}
          </div>

          <hr className="page-divider" />

          <h2>3 sedes en el mismo barrio</h2>
          <ul>
            <li>
              <strong>Westfield Glòries</strong> — Av. Diagonal 208 · Sede principal, finales Sénior, aparcamiento 2h gratis
            </li>
            <li>
              <strong>La Nau del Clot</strong> — Carrer de la Llacuna 172 · Pabellón cubierto oficial, categorías formativas
            </li>
            <li>
              <strong>Rambleta del Clot</strong> — Pista exterior · Sènior Amateur, Màgics y ambiente de calle
            </li>
          </ul>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,247,239,0.5)" }}>
            Metro L1 estación Glòries. Menos de 10 min a pie entre las 3 sedes.
          </p>

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
              🏀 Inscribir equipo — desde 75€
            </a>
            <br />
            <a
              href={CONTACT_LINK}
              target="_blank" rel="noreferrer noopener"
              style={{ fontSize: "0.9rem", color: "rgba(255,247,239,0.6)", textDecoration: "underline" }}
            >
              ¿Prefieres WhatsApp? Escríbenos →
            </a>
          </div>

          <hr className="page-divider" />

          <h2>¿Tienes dudas?</h2>
          <p>
            Consulta las{" "}
            <Link href="/preguntes-frequents" style={{ color: "#f97316" }}>
              preguntas frecuentes
            </Link>{" "}
            o{" "}
            <a href={WA_REGISTER_URL} target="_blank" rel="noreferrer noopener" style={{ color: "#f97316" }}>
              contáctanos por WhatsApp
            </a>
            . Respuesta en menos de 24h.
          </p>
        </main>
      </div>
    </>
  );
}
