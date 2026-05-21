import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { WA_REGISTER_URL } from "../lib/whatsapp";

export const metadata: Metadata = {
  title: "3×3 Cadet Barcelona 2026 | Torneig Bàsquet — 15-16 anys",
  description:
    "Torneig 3×3 Cadet a Barcelona el 6-7 de juny de 2026. Categoria per a jugadors de 15-16 anys al 3×3 Westfield Glòries. Format FIBA, ambient familiar. Inscripció 75€.",
  alternates: { canonical: "/3x3-cadet-barcelona" },
  openGraph: {
    title: "3×3 Cadet Barcelona 2026 | Torneig Bàsquet — 15-16 anys",
    description:
      "3×3 Cadet a Barcelona. Jugadors de 15-16 anys al Torneig Westfield Glòries 2026. Ambient de barri, famílies i competició FIBA. Inscripció oberta des de 75€.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "3×3 Westfield Glòries 2026 — Categoria Cadet",
  description:
    "Torneig de bàsquet 3×3 categoria Cadet (15-16 anys) al Torneig Westfield Glòries 2026 de Barcelona. Organitzat per CB Grup Barna, Time Chamber i Eix Clot.",
  url: `${SITE_URL}/3x3-cadet-barcelona`,
  startDate: "2026-06-06",
  endDate: "2026-06-07",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "La Nau del Clot",
    address: {
      "@type": "PostalAddress",
      streetAddress: "C/ Llacuna 172",
      addressLocality: "Barcelona",
      postalCode: "08018",
      addressCountry: "ES",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "CB Grup Barna",
    url: "https://cbgrupbarna.com",
  },
  offers: {
    "@type": "Offer",
    price: "75",
    priceCurrency: "EUR",
    url: `${SITE_URL}/inscripcion`,
    availability: "https://schema.org/InStock",
    validFrom: "2026-01-01",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Jugadors de bàsquet de 15-16 anys",
  },
  sport: "Basketball",
};

export default function Cadet3x3BarcelonaPage() {
  return (
    <>
      <Script
        id="ld-cadet-3x3"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="page-shell">
        <nav className="page-nav">
          <Link href="/" className="page-nav-back">← Inici</Link>
          <span className="page-nav-logo">3×3 Glòries 2026</span>
        </nav>

        <main className="article-page">
          <div className="article-inner">

            {/* Hero */}
            <div className="article-hero">
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#ff5b1f", textTransform: "uppercase", marginBottom: 12 }}>
                Categoria Cadet · 3×3 Westfield Glòries 2026
              </p>
              <h1 className="article-h1">
                3×3 Cadet Barcelona 2026 — Categoria Cadet (15-16 anys)
              </h1>
              <p style={{ color: "#c8b99a", fontSize: "clamp(15px, 2.5vw, 18px)", maxWidth: 600, margin: "0 auto 28px" }}>
                La categoria Cadet del Torneig 3×3 Westfield Glòries aplega els millors equips
                juvenils de 15-16 anys de Barcelona i àrea metropolitana. Competició FIBA en
                un ambient de barri que viu el bàsquet amb passió.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/inscripcion" className="page-cta-btn">
                  Inscriu l&apos;equip Cadet →
                </Link>
                <a
                  href={WA_REGISTER_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="page-cta-btn-ghost"
                >
                  Preguntar per WhatsApp
                </a>
              </div>
            </div>

            {/* Secció 1: Edats i requisits */}
            <section className="article-section">
              <h2 className="article-h2">Edats i requisits Cadet</h2>
              <p>
                La categoria Cadet és per a jugadors i jugadores de <strong>15 i 16 anys</strong>
                {" "}en el moment de la celebració del torneig (6-7 de juny de 2026):
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>
                  <strong>Nascuts els anys 2009 o 2010</strong> (verificació d&apos;edat al formulari
                  en funció de la data exacta de tall de la categoria).
                </li>
                <li>
                  Equips de <strong>3 a 5 jugadors</strong>. Mínim 3 jugadors per poder disputar
                  els partits.
                </li>
                <li>
                  <strong>Consentiment del tutor legal obligatori</strong> per a tots els jugadors
                  de la categoria, ja que tots els participants són menors d&apos;edat. Es recull
                  al formulari d&apos;inscripció.
                </li>
                <li>
                  No cal llicència federativa. Obert a clubs, escoles i grups d&apos;amics.
                </li>
                <li>
                  Equips mixtos (nois i noies) permesos en aquesta categoria.
                </li>
              </ul>
              <div
                style={{
                  background: "rgba(255, 91, 31, 0.06)",
                  border: "1px solid rgba(255, 91, 31, 0.2)",
                  borderRadius: 10,
                  padding: "14px 18px",
                  marginTop: 16,
                  fontSize: 14,
                  color: "#c8b99a",
                }}
              >
                <strong style={{ color: "#ff5b1f" }}>Important per a menors:</strong> el formulari
                inclou un apartat específic per als tutors legals (nom, cognoms, telèfon de contacte
                i DNI). Tots els jugadors menors d&apos;edat han d&apos;estar identificats amb el
                consentiment del seu tutor legal. Sense aquest consentiment, el jugador no podrà
                participar el dia del torneig.
              </div>
            </section>

            {/* Secció 2: Format i regles */}
            <section className="article-section">
              <h2 className="article-h2">Format i regles</h2>
              <p>
                La categoria Cadet juga amb el reglament oficial <strong>FIBA 3×3</strong>,
                el mateix que s&apos;aplica en totes les competicions internacionals de la modalitat.
                No hi ha regles adaptades: es juga com els adults.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                {[
                  { icon: "🏀", titol: "Format de joc", desc: "10 minuts de temps efectiu o primer equip a arribar a 21 punts. Un sol període sense descans." },
                  { icon: "⏱️", titol: "Rellotge de possessió", desc: "12 segons per llançar. Molt menys que en el bàsquet 5×5 (24 seg.). Requereix decisions ràpides." },
                  { icon: "🔢", titol: "Puntuació", desc: "1 punt des de dins l'arc. 2 punts des de fora de l'arc. 1 punt per tir lliure." },
                  { icon: "👥", titol: "Equip", desc: "3 jugadors en pista + 1 suplent. Substitucions lliures en pilota morta." },
                  { icon: "📍", titol: "Seu", desc: "La Nau del Clot, C/ Llacuna 172, Barcelona. Pavelló cobert." },
                ].map(({ icon, titol, desc }) => (
                  <div
                    key={titol}
                    style={{
                      display: "flex",
                      gap: 16,
                      background: "#1a1a1a",
                      borderRadius: 10,
                      padding: "14px 18px",
                      border: "1px solid #2a2a2a",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, color: "#fff7ef", margin: "0 0 4px", fontSize: 14 }}>{titol}</p>
                      <p style={{ color: "#c8b99a", margin: 0, fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 16 }}>
                <Link href="/regles-3x3" style={{ color: "#ff5b1f" }}>Veure el reglament complet FIBA 3×3 →</Link>
              </p>
            </section>

            {/* Secció 3: Ambient familiar */}
            <section className="article-section">
              <h2 className="article-h2">Un torneig amb famílies i ambient de barri</h2>
              <p>
                Una de les grans fortaleses del Torneig 3×3 Westfield Glòries és l&apos;ambient
                familiar i de comunitat que es viu a les grades. Les famílies dels jugadors
                Cadet s&apos;impliquen molt i fan de cada partit una petita festa.
              </p>
              <p>
                El torneig se celebra el primer cap de setmana de juny, quan el barri del
                Clot-Glòries viu un dels moments més animats de l&apos;any. La seva ubicació
                a <strong>La Nau del Clot</strong> (C/ Llacuna 172) converteix l&apos;event en
                una cita de barri a la qual s&apos;afegeixen veïns, famílies i aficionats al
                bàsquet de tot Barcelona.
              </p>
              <p>
                El CB Grup Barna organitza el torneig des de la convicció que el bàsquet
                base és un motor de cohesió social. Per això, les categories formatives com
                la Cadet tenen un tracte especial: àrbitres formats en bàsquet juvenil,
                comunicació clara amb les famílies i un entorn segur i inclusiu per a tots
                els participants.
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>Zona de famílies habilitada a La Nau del Clot.</li>
                <li>Transmissió d&apos;informació i resultats en temps real via WhatsApp i web.</li>
                <li>Personal del club present durant tot el torneig per resoldre dubtes.</li>
                <li>Protocol de seguretat i tutela per a menors d&apos;edat actiu durant tot l&apos;event.</li>
              </ul>
            </section>

            {/* Secció 4: Com inscriure */}
            <section className="article-section">
              <h2 className="article-h2">Com inscriure el teu equip</h2>
              <div
                style={{
                  background: "rgba(255, 91, 31, 0.08)",
                  border: "1px solid rgba(255, 91, 31, 0.3)",
                  borderRadius: 12,
                  padding: "20px 24px",
                  marginBottom: 20,
                }}
              >
                <p style={{ fontWeight: 900, fontSize: 22, color: "#ff5b1f", margin: "0 0 6px" }}>75 € per equip</p>
                <p style={{ color: "#c8b99a", margin: 0, fontSize: 14 }}>
                  Preu únic per a la categoria Cadet. Samarreta oficial inclosa per a cada
                  jugador (fins a 5). Equip de 3 a 5 jugadors.
                </p>
              </div>
              <p>
                La inscripció es fa completament en línia en menys de 5 minuts. Assegura&apos;t
                de tenir a mà:
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>Nom complet, data de naixement i DNI/NIE de cada jugador.</li>
                <li>Nom i telèfon del <strong>tutor legal</strong> de cada jugador menor.</li>
                <li>Comprovant de pagament (transferència o Bizum) per adjuntar al formulari.</li>
              </ul>
              <p>
                Vols saber tots els passos?{" "}
                <Link href="/com-inscriure-equip-3x3" style={{ color: "#ff5b1f" }}>
                  Guia d&apos;inscripció pas a pas →
                </Link>
              </p>
            </section>

            {/* CTA final */}
            <div
              style={{
                background: "linear-gradient(135deg, #1a0a00 0%, #2a1000 100%)",
                borderRadius: 16,
                padding: "36px 28px",
                textAlign: "center",
                border: "1px solid #3a1800",
                marginTop: 48,
                marginBottom: 48,
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#ff5b1f", textTransform: "uppercase", marginBottom: 8 }}>
                6-7 juny 2026 · La Nau del Clot, Barcelona
              </p>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff7ef", margin: "0 0 12px" }}>
                Categoria Cadet — 75 €
              </h2>
              <p style={{ color: "#c8b99a", fontSize: 15, marginBottom: 24 }}>
                Places limitades. Inscriu el teu equip avui.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/inscripcion" className="article-cta-btn">
                  Inscriu l&apos;equip Cadet →
                </Link>
                <a
                  href={WA_REGISTER_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{
                    display: "inline-block",
                    background: "#25d366",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1rem",
                    padding: "0.85rem 2rem",
                    borderRadius: "50px",
                    textDecoration: "none",
                  }}
                >
                  Preguntar per WhatsApp
                </a>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
