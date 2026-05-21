import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { WA_REGISTER_URL } from "../lib/whatsapp";

export const metadata: Metadata = {
  title: "3×3 Júnior Barcelona 2026 | Torneig Bàsquet Juvenil — 17-18 anys",
  description:
    "Torneig 3×3 Júnior a Barcelona el 6-7 de juny de 2026. Categoria per a jugadors de 17-18 anys. Format FIBA, ambient esportiu al barri Clot-Glòries. Inscripció a 75€.",
  alternates: { canonical: "/3x3-junior-barcelona" },
  openGraph: {
    title: "3×3 Júnior Barcelona 2026 | Torneig Bàsquet Juvenil — 17-18 anys",
    description:
      "3×3 Júnior a Barcelona. Categoria per a jugadors de 17-18 anys al Torneig Westfield Glòries 2026. Format FIBA oficial. Inscripció oberta.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "3×3 Westfield Glòries 2026 — Categoria Júnior",
  description:
    "Torneig de bàsquet 3×3 categoria Júnior (17-18 anys) al Torneig Westfield Glòries 2026 de Barcelona. Organitzat per CB Grup Barna, Time Chamber i Eix Clot.",
  url: `${SITE_URL}/3x3-junior-barcelona`,
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
    audienceType: "Jugadors de bàsquet de 17-18 anys",
  },
  sport: "Basketball",
};

export default function Junior3x3BarcelonaPage() {
  return (
    <>
      <Script
        id="ld-junior-3x3"
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
                Categoria Júnior · 3×3 Westfield Glòries 2026
              </p>
              <h1 className="article-h1">
                3×3 Júnior Barcelona 2026 — Categoria Júnior (17-18 anys)
              </h1>
              <p style={{ color: "#c8b99a", fontSize: "clamp(15px, 2.5vw, 18px)", maxWidth: 600, margin: "0 auto 28px" }}>
                La categoria Júnior del Torneig 3×3 Westfield Glòries és la porta d&apos;entrada
                al bàsquet de competició adult. Partits intensos en format FIBA, rivalitat esportiva
                i l&apos;ambient de barri del Clot-Glòries.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/inscripcion" className="page-cta-btn">
                  Inscriu l&apos;equip Júnior →
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

            {/* Secció 1: Qui pot participar */}
            <section className="article-section">
              <h2 className="article-h2">Qui pot participar</h2>
              <p>
                La categoria Júnior del 3×3 Westfield Glòries és per a jugadors i jugadores
                que tinguin <strong>17 o 18 anys</strong> en el moment del torneig (6-7 de juny
                de 2026). Concretament:
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>
                  <strong>Nascuts l&apos;any 2007 o 2008</strong> (consulteu els requisits exactes
                  al formulari en funció de les dates de tall de la temporada).
                </li>
                <li>
                  Equips de <strong>3 a 5 jugadors</strong>. El mínim per disputar partits és 3.
                </li>
                <li>
                  No cal ser federat ni tenir llicència de la Federació Catalana de Bàsquet.
                  El torneig és obert a tots els jugadors que compleixin els requisits d&apos;edat.
                </li>
                <li>
                  En tractar-se d&apos;una categoria de menors (si el jugador és menor de 18 anys
                  el dia del torneig), cal el <strong>consentiment del tutor legal</strong> al
                  formulari d&apos;inscripció. Es demanarà el nom i dades de contacte del tutor.
                </li>
                <li>
                  Equips mixtos (nois i noies) permesos en aquesta categoria.
                </li>
              </ul>
              <p>
                La categoria Júnior és perfecta per a equips de clubs, coles d&apos;esports,
                grups d&apos;amics i jugadors que volen viure l&apos;experiència del 3×3 de
                competició per primera vegada en un entorn professional.
              </p>
            </section>

            {/* Secció 2: Format de joc Júnior */}
            <section className="article-section">
              <h2 className="article-h2">Format de joc Júnior</h2>
              <p>
                La categoria Júnior juga amb el reglament oficial FIBA 3×3, el mateix que
                s&apos;utilitza en competicions internacionals. No hi ha adaptació de regles
                respecte als adults: és l&apos;experiència completa del 3×3.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
                {[
                  { label: "Format", valor: "FIBA 3×3 oficial — mateixa regla que adults" },
                  { label: "Equip", valor: "3 jugadors en pista + 1 suplent (màxim 5 inscrits)" },
                  { label: "Durada del partit", valor: "10 min de temps efectiu o primer a 21 punts" },
                  { label: "Rellotge de possessió", valor: "12 segons" },
                  { label: "Puntuació", valor: "1 punt dins l'arc / 2 punts fora de l'arc / 1 punt TL" },
                  { label: "Temps mort", valor: "1 per equip i partit (30 seg.)" },
                  { label: "Seu", valor: "La Nau del Clot, C/ Llacuna 172, Barcelona" },
                ].map(({ label, valor }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      gap: 16,
                      background: "#1a1a1a",
                      borderRadius: 10,
                      padding: "14px 18px",
                      border: "1px solid #2a2a2a",
                    }}
                  >
                    <span style={{ color: "#888", fontSize: 13, fontWeight: 600, minWidth: 180, flexShrink: 0 }}>{label}</span>
                    <span style={{ color: "#d4c9b8", fontSize: 14 }}>{valor}</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 16 }}>
                Vols veure el reglament complet?{" "}
                <Link href="/regles-3x3" style={{ color: "#ff5b1f" }}>Consulta la guia de regles 3×3 FIBA →</Link>
              </p>
            </section>

            {/* Secció 3: Per què és especial */}
            <section className="article-section">
              <h2 className="article-h2">Per quin motiu és especial la categoria Júnior</h2>
              <p>
                La categoria Júnior del 3×3 Westfield Glòries és un dels torneigs juvenils de
                bàsquet 3×3 amb més trajectòria del districte de Sant Martí. Diverses raons que
                la fan especial:
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.9, paddingLeft: 24 }}>
                <li>
                  <strong>Competició real amb reglament FIBA.</strong> Molts jugadors Júnior
                  viuen aquí la seva primera experiència en un torneig 3×3 amb àrbitres, taula
                  de marcadors oficial i ambient de competició adult.
                </li>
                <li>
                  <strong>Visibilitat davant de tècnics i clubs.</strong> El torneig aplega
                  entrenadors i responsables tècnics de clubs de Barcelona i àrea metropolitana.
                  Una bona actuació pot obrir portes a fitxatges o contactes per a la temporada
                  següent.
                </li>
                <li>
                  <strong>Pont cap al Sènior.</strong> Molts jugadors que han passat per la
                  categoria Júnior del Westfield Glòries han donat el salt a la categoria Sènior
                  en edicions posteriors. El torneig ajuda a créixer com a jugador i com a persona.
                </li>
                <li>
                  <strong>Ambient de barri i inclusiu.</strong> La Nau del Clot és un espai
                  acollit pel barri. Famílies, amics i aficionats formen una graderia atípica i
                  cálida que fa que cada punt es visqui amb intensitat.
                </li>
                <li>
                  <strong>Dates perfectes.</strong> El torneig se celebra el primer cap de setmana
                  de juny, just quan acaben la majoria de temporades de bàsquet federat. És la
                  manera ideal de tancar curs i celebrar amb l&apos;equip.
                </li>
              </ul>
              <p>
                <strong>Premi de la categoria Júnior:</strong> la categoria Júnior no té premi
                en metàl·lic. Els tres primers equips classificats reben <strong>trofeus i
                medalles</strong> individuals. A més, tots els participants reben la samarreta
                oficial del torneig inclosa en la inscripció.
              </p>
            </section>

            {/* Secció 4: Preus i inscripció */}
            <section className="article-section">
              <h2 className="article-h2">Preus i inscripció</h2>
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
                  Preu únic per a la categoria Júnior. Inclou samarreta oficial del torneig
                  per a cada jugador inscrit (fins a 5). Equip de 3 a 5 jugadors.
                </p>
              </div>
              <p>La inscripció es fa en línia a través del formulari oficial. Passos:</p>
              <ol style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>Accedeix al formulari d&apos;inscripció.</li>
                <li>Selecciona la categoria <strong>Júnior</strong>.</li>
                <li>Introdueix les dades de l&apos;equip i dels jugadors (amb data de naixement i DNI).</li>
                <li>Indica el tutor legal dels jugadors menors d&apos;edat.</li>
                <li>Realitza el pagament i adjunta el comprovant. Confirmació en 24-48h.</li>
              </ol>
              <p>
                Dubtes sobre la inscripció?{" "}
                <Link href="/com-inscriure-equip-3x3" style={{ color: "#ff5b1f" }}>Consulta la guia d&apos;inscripció pas a pas →</Link>
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
                Categoria Júnior — 75 €
              </h2>
              <p style={{ color: "#c8b99a", fontSize: 15, marginBottom: 24 }}>
                Places limitades. Inscriu el teu equip avui.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/inscripcion" className="article-cta-btn">
                  Inscriu l&apos;equip Júnior →
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
