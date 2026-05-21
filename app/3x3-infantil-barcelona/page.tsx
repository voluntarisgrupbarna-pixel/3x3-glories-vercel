import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { WA_REGISTER_URL } from "../lib/whatsapp";

export const metadata: Metadata = {
  title: "3×3 Infantil Barcelona 2026 | Torneig Bàsquet Formació — 13-14 anys",
  description:
    "Torneig 3×3 Infantil a Barcelona el 6-7 de juny de 2026. Categoria per a nens i nenes de 13-14 anys. Format FIBA adaptat per a formació, ambient familiar al Clot-Glòries. Inscripció 75€.",
  alternates: { canonical: "/3x3-infantil-barcelona" },
  openGraph: {
    title: "3×3 Infantil Barcelona 2026 | Torneig Bàsquet Formació — 13-14 anys",
    description:
      "3×3 Infantil a Barcelona. Nens i nenes de 13-14 anys al Torneig Westfield Glòries 2026. Bàsquet formatiu, ambient familiar i competició sana al barri Clot-Glòries.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "3×3 Westfield Glòries 2026 — Categoria Infantil",
  description:
    "Torneig de bàsquet 3×3 categoria Infantil (13-14 anys) al Torneig Westfield Glòries 2026 de Barcelona. Organitzat per CB Grup Barna, Time Chamber i Eix Clot. Ambient familiar i formatiu.",
  url: `${SITE_URL}/3x3-infantil-barcelona`,
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
    audienceType: "Nens i nenes de 13-14 anys, bàsquet infantil Barcelona",
  },
  sport: "Basketball",
};

export default function Infantil3x3BarcelonaPage() {
  return (
    <>
      <Script
        id="ld-infantil-3x3"
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
                Categoria Infantil · 3×3 Westfield Glòries 2026
              </p>
              <h1 className="article-h1">
                3×3 Infantil Barcelona 2026 — Categoria Infantil (13-14 anys)
              </h1>
              <p style={{ color: "#c8b99a", fontSize: "clamp(15px, 2.5vw, 18px)", maxWidth: 600, margin: "0 auto 28px" }}>
                El Torneig 3×3 Westfield Glòries 2026 ofereix la categoria Infantil com un
                espai de competició sana, formació esportiva i ambient familiar per a nens
                i nenes de 13-14 anys del barri i de tota Barcelona.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/inscripcion" className="page-cta-btn">
                  Inscriu l&apos;equip Infantil →
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

            {/* Secció 1: Descripció categoria */}
            <section className="article-section">
              <h2 className="article-h2">Descripció de la categoria Infantil</h2>
              <p>
                La categoria Infantil és una de les més emocionants del Torneig 3×3 Westfield
                Glòries. Aplega equips de nens i nenes de <strong>13 i 14 anys</strong> en una
                competició que premia el joc col·lectiu, la tàctica i la millora personal per
                sobre del resultat.
              </p>
              <p>
                La categoria Infantil del 3×3 és ideal per a:
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>
                  Equips de clubs de bàsquet federats que volen una experiència de competició
                  diferent al final de temporada.
                </li>
                <li>
                  Grups d&apos;amics o companys d&apos;escola que juguen junts i volen fer-ho en
                  un entorn organitzat i segur.
                </li>
                <li>
                  Famílies que busquen una activitat esportiva de qualitat per als seus fills
                  en un entorn de barri i comunitat.
                </li>
                <li>
                  Jugadors que volen descobrir el format 3×3 FIBA per primera vegada en un
                  torneig real amb àrbitres i taula de marcadors.
                </li>
              </ul>
              <div
                style={{
                  background: "rgba(255, 91, 31, 0.06)",
                  border: "1px solid rgba(255, 91, 31, 0.2)",
                  borderRadius: 10,
                  padding: "14px 18px",
                  marginTop: 16,
                }}
              >
                <p style={{ color: "#c8b99a", margin: 0, fontSize: 14, lineHeight: 1.7 }}>
                  <strong style={{ color: "#ff5b1f" }}>Edats:</strong> jugadors i jugadores nascuts
                  els anys <strong>2011 o 2012</strong>. Verificació d&apos;edat amb DNI/NIE obligatòria
                  al formulari. En cas de dubte sobre elegibilitat, consulteu per WhatsApp.
                </p>
              </div>
            </section>

            {/* Secció 2: Regles adaptades per a formació */}
            <section className="article-section">
              <h2 className="article-h2">Regles adaptades per a formació</h2>
              <p>
                Tot i que la categoria Infantil juga amb el <strong>reglament oficial FIBA 3×3</strong>,
                el torneig aplica un enfocament formatiu que posa l&apos;accent en l&apos;aprenentatge
                i el joc net:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                {[
                  {
                    titol: "Àrbitres formats en bàsquet formatiu",
                    desc: "Els àrbitres de la categoria Infantil estan formats específicament per a la gestió de partits juvenils. Primen l'explicació de les decisions davant la sanció automàtica.",
                  },
                  {
                    titol: "Check-ball amb suport d'àrbitre",
                    desc: "En partits de la categoria Infantil, l'àrbitre pot assistir en el procediment del check-ball si el jugador no l'ha executat correctament, en lloc d'aplicar directament la violació.",
                  },
                  {
                    titol: "Temps addicional per al check-ball",
                    desc: "Es tolerarà un marge lleugerament superior per iniciar el check-ball en partits Infantil, especialment en els primers rounds del torneig.",
                  },
                  {
                    titol: "Orientació dels àrbitres",
                    desc: "En situacions d'infracció per desconeixement (no per avantatge competitiu), l'àrbitre pot optar per l'advertència prèvia en lloc del canvi de possessió directe.",
                  },
                  {
                    titol: "Puntuació estàndard FIBA",
                    desc: "1 punt dins l'arc, 2 punts fora de l'arc i 1 punt per tir lliure. Sense adaptació. Cal que els jugadors aprenguin la puntuació correcta del 3×3.",
                  },
                ].map(({ titol, desc }) => (
                  <div
                    key={titol}
                    style={{
                      background: "#1a1a1a",
                      borderRadius: 10,
                      padding: "16px 20px",
                      border: "1px solid #2a2a2a",
                    }}
                  >
                    <p style={{ fontWeight: 700, color: "#fff7ef", margin: "0 0 6px", fontSize: 14 }}>{titol}</p>
                    <p style={{ color: "#c8b99a", margin: 0, fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 16 }}>
                <Link href="/regles-3x3" style={{ color: "#ff5b1f" }}>Consulta el reglament complet FIBA 3×3 →</Link>
              </p>
            </section>

            {/* Secció 3: Ambient familiar */}
            <section className="article-section">
              <h2 className="article-h2">Ambient familiar al Clot-Glòries</h2>
              <p>
                El Torneig 3×3 Westfield Glòries és un event de barri que es viu en família.
                La categoria Infantil és una de les que concentra més famílies, àvies, tiets
                i amics a les grades. L&apos;ambient és festiu, acollit i ple d&apos;energia positiva.
              </p>
              <p>
                La seu de La Nau del Clot (C/ Llacuna 172) disposa d&apos;espai per a les
                famílies, zona de descans i accés fàcil en transport públic:
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>Metro L1 estació Clot, a 5 minuts a peu.</li>
                <li>Zona habilitada per a famílies i públic dins el pavelló.</li>
                <li>Informació de resultats i horaris en temps real via WhatsApp del club.</li>
                <li>Personal del CB Grup Barna present durant tot el torneig.</li>
                <li>Entorn segur: protocol de tutela activa per a tots els menors participants.</li>
              </ul>
              <p>
                A més, el 3×3 Westfield Glòries se celebra en el marc del <strong>Mes Orgull
                (Juny)</strong> que promou el CB Grup Barna. L&apos;event és un espai inclusiu,
                obert i segur per a tothom, on la diversitat és un valor celebrat activament.
              </p>
              <div
                style={{
                  background: "rgba(255, 91, 31, 0.06)",
                  border: "1px solid rgba(255, 91, 31, 0.2)",
                  borderRadius: 10,
                  padding: "14px 18px",
                  marginTop: 4,
                  fontSize: 14,
                  color: "#c8b99a",
                }}
              >
                <strong style={{ color: "#ff5b1f" }}>Logística per a famílies:</strong> els horaris
                de la categoria Infantil s&apos;enviaran per email als responsables dels equips una
                setmana abans del torneig. Es recomana arribar 20 minuts abans del primer partit
                per realitzar l&apos;acreditació.
              </div>
            </section>

            {/* Secció 4: Inscripció */}
            <section className="article-section">
              <h2 className="article-h2">Inscripció equip Infantil</h2>
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
                  Preu únic per a la categoria Infantil. Inclou samarreta oficial del torneig per
                  a cada jugador inscrit (fins a 5). Equip de 3 a 5 jugadors.
                </p>
              </div>
              <p>
                Documentació necessària per a la inscripció:
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>Nom complet, data de naixement i DNI/NIE de cada jugador.</li>
                <li>
                  <strong>Nom, telèfon i DNI del tutor legal</strong> de cada jugador menor d&apos;edat
                  (obligatori per a tots els jugadors Infantil).
                </li>
                <li>Comprovant de pagament (transferència o Bizum).</li>
              </ul>
              <p>
                <Link href="/com-inscriure-equip-3x3" style={{ color: "#ff5b1f" }}>Veure la guia d&apos;inscripció pas a pas →</Link>
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
                Categoria Infantil — 75 €
              </h2>
              <p style={{ color: "#c8b99a", fontSize: 15, marginBottom: 24 }}>
                Places limitades. Ambient familiar. Competició FIBA.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/inscripcion" className="article-cta-btn">
                  Inscriu l&apos;equip Infantil →
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
