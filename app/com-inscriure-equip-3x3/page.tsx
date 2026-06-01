import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { WA_REGISTER_URL } from "../lib/whatsapp";

export const metadata: Metadata = {
  title: "Cómo inscribir un equipo en el Torneo 3x3 Barcelona 2026 | Guia pas a pas",
  description:
    "Guia pas a pas per inscriure el teu equip al Torneig 3×3 Westfield Glòries Barcelona 2026. Requisits, preus, formulari i preguntes freqüents de la inscripció.",
  alternates: { canonical: "/com-inscriure-equip-3x3" },
  openGraph: {
    title: "Cómo inscribir un equipo en el Torneo 3x3 Barcelona 2026",
    description:
      "Pas a pas per inscriure el teu equip al 3×3 Westfield Glòries 2026. Des de 75€. Formulari en 5 minuts.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo inscribir un equipo en el Torneo 3x3 Westfield Glòries Barcelona 2026",
  description:
    "Guia en 5 passos per inscriure el teu equip de bàsquet 3x3 al Torneig Westfield Glòries 2026 de Barcelona.",
  url: `${SITE_URL}/com-inscriure-equip-3x3`,
  totalTime: "PT5M",
  tool: [
    { "@type": "HowToTool", name: "Formulari d'inscripció en línia" },
    { "@type": "HowToTool", name: "Comprovant de pagament" },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Omplir les dades de l'equip",
      text: "Accedeix al formulari d'inscripció i introdueix el nom de l'equip, la categoria i les dades de contacte del capità o responsable.",
      url: `${SITE_URL}/inscripcion`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Triar el paquet d'inscripció",
      text: "Selecciona la mida de l'equip (4 o 5 jugadors) i el paquet corresponent. Categories formatives: 75€. Sènior early bird: 85€. Sènior regular: 90€.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Realitzar el pagament i pujar el comprovant",
      text: "Fes la transferència o pagament per Bizum i puja el comprovant directament al formulari. La plaça es reserva quan es confirma el pagament.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Introduir les dades dels jugadors",
      text: "Afegeix el nom, cognoms, DNI/NIE i data de naixement de cada jugador. En categories formatives, cal indicar el tutors legals dels menors.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Confirmació i acreditació",
      text: "Rebràs un email de confirmació amb tots els detalls. El dia del torneig, presenta't al punt d'acreditació 30 minuts abans del teu primer partit.",
    },
  ],
};

export default function ComInscriureEquip3x3Page() {
  return (
    <>
      <Script
        id="ld-com-inscriure"
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
                Inscripcions obertes · 3×3 Westfield Glòries 2026
              </p>
              <h1 className="article-h1">
                Cómo inscribir tu equipo en el 3×3 Westfield Glòries 2026
              </h1>
              <p style={{ color: "#c8b99a", fontSize: "clamp(15px, 2.5vw, 18px)", maxWidth: 600, margin: "0 auto 28px" }}>
                El procés d&apos;inscripció és senzill i es fa completament en línia. En menys de
                5 minuts podràs reservar la plaça del teu equip al Torneig 3×3 Westfield Glòries
                2026 de Barcelona.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/inscripcion" className="page-cta-btn">
                  Inscriu el teu equip ara →
                </Link>
                <Link href="/que-es-basquet-3x3" className="page-cta-btn-ghost">
                  Saber més sobre el 3×3
                </Link>
              </div>
            </div>

            {/* Secció 1: Requisits */}
            <section className="article-section">
              <h2 className="article-h2">Requisits per inscriure&apos;s</h2>
              <p>
                Qualsevol persona pot participar al Torneig 3×3 Westfield Glòries 2026, tant si
                ets jugador federat com si jugues a bàsquet de forma recreativa. Els requisits
                bàsics són:
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>
                  <strong>Equip de mínim 3 jugadors</strong> (màxim 5). Cada equip ha de tenir
                  almenys 3 jugadors per poder disputar partits.
                </li>
                <li>
                  <strong>Edat corresponent a la categoria.</strong> Consulta la taula de categories
                  per verificar que tots els jugadors compleixen els requisits d&apos;edat.
                </li>
                <li>
                  <strong>DNI/NIE o passaport vigent</strong> per a tots els jugadors. Es demanarà
                  en el formulari i es podrà verificar el dia del torneig.
                </li>
                <li>
                  <strong>En categories formatives (fins a Júnior):</strong> és necessari el
                  consentiment del tutor legal per a jugadors menors d&apos;edat.
                </li>
                <li>
                  <strong>Pagament complet</strong> de la inscripció abans de la data límit. La
                  plaça es confirma quan es verifica el pagament.
                </li>
              </ul>
              <p>
                No cal ser soci ni federat del CB Grup Barna. El torneig és obert a tothom.
                Equips d&apos;altres clubs, grups d&apos;amics i equips mixtos benvinguts.
              </p>
            </section>

            {/* Secció 2: Passos del formulari */}
            <section className="article-section">
              <h2 className="article-h2">Passos del formulari (5 minuts)</h2>
              <p>
                El formulari d&apos;inscripció és completament en línia. Aquí tens el detall de
                cada pas:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
                {[
                  {
                    num: "01",
                    titol: "Dades de l'equip",
                    desc: "Introdueix el nom de l'equip, la categoria i les dades de contacte del capità o responsable de l'equip. Guarda bé el teu email, ja que t'enviarem tota la informació aquí.",
                  },
                  {
                    num: "02",
                    titol: "Tria el paquet",
                    desc: "Selecciona si el teu equip és de 4 o 5 jugadors. El preu varia en funció de la mida i la categoria. Les categories sènior disposen d'un descompte early bird si t'inscrius abans de la data límit.",
                  },
                  {
                    num: "03",
                    titol: "Puja el comprovant de pagament",
                    desc: "Fes la transferència o pagament per Bizum i adjunta el comprovant al formulari. La plaça queda reservada però no confirmada fins que el pagament és verificat per l'organització.",
                  },
                  {
                    num: "04",
                    titol: "Dades dels jugadors",
                    desc: "Afegeix el nom complet, data de naixement i DNI/NIE de cada jugador. En categories formatives, indica el nom del tutor legal dels jugadors menors d'edat.",
                  },
                  {
                    num: "05",
                    titol: "Confirmació i acreditació",
                    desc: "Un cop revisat el formulari, rebràs un email de confirmació amb tots els detalls del torneig: hora, seu, horaris dels teus partits i punt d'acreditació.",
                  },
                ].map((pas) => (
                  <div
                    key={pas.num}
                    style={{
                      display: "flex",
                      gap: 20,
                      background: "#1a1a1a",
                      borderRadius: 12,
                      padding: "20px 24px",
                      border: "1px solid #2a2a2a",
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "#ff5b1f",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: 15,
                        color: "#fff",
                      }}
                    >
                      {pas.num}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "#fff7ef", marginBottom: 6, marginTop: 0 }}>{pas.titol}</p>
                      <p style={{ color: "#c8b99a", margin: 0, fontSize: 14, lineHeight: 1.7 }}>{pas.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Secció 3: Preus */}
            <section className="article-section">
              <h2 className="article-h2">Preus i descomptes</h2>
              <p>
                El preu de la inscripció depèn de la categoria i del moment en què et registris.
                Aquí tens la taula completa de preus:
              </p>
              <div style={{ overflowX: "auto", marginTop: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#1a1a1a" }}>
                      <th style={{ padding: "10px 14px", textAlign: "left", color: "#888", fontWeight: 600, borderBottom: "1px solid #2a2a2a" }}>Paquet</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", color: "#888", fontWeight: 600, borderBottom: "1px solid #2a2a2a" }}>Categories</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", color: "#ff5b1f", fontWeight: 600, borderBottom: "1px solid #2a2a2a" }}>Preu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Formatives (3-5 jug.)", "Escola, Premini, Mini, Preinfantil, Infantil, Cadet, Júnior", "75 €"],
                      ["Sènior Early Bird (3-5 jug.)", "Sènior Masculí, Sènior Femení, Sènior Amateur, Màgics", "85 €"],
                      ["Sènior Regular (3-5 jug.)", "Sènior Masculí, Sènior Femení, Sènior Amateur, Màgics", "90 €"],
                    ].map(([paquet, cats, preu], i) => (
                      <tr key={paquet} style={{ background: i % 2 === 0 ? "transparent" : "#141414" }}>
                        <td style={{ padding: "10px 14px", color: "#fff7ef", fontWeight: 600, borderBottom: "1px solid #1e1e1e" }}>{paquet}</td>
                        <td style={{ padding: "10px 14px", color: "#c8b99a", borderBottom: "1px solid #1e1e1e", fontSize: 13 }}>{cats}</td>
                        <td style={{ padding: "10px 14px", color: "#ff5b1f", borderBottom: "1px solid #1e1e1e", fontWeight: 700 }}>{preu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ color: "#888", fontSize: 13, marginTop: 12 }}>
                * El preu és per equip (no per jugador). Inclou samarreta oficial del torneig per a cada jugador.
                El nombre mínim de jugadors per inscriure un equip és 3. El màxim és 5.
              </p>
            </section>

            {/* Secció 4: FAQ inscripció */}
            <section className="article-section">
              <h2 className="article-h2">Preguntes freqüents de la inscripció</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  {
                    q: "Puc inscriure un equip mixt (nois i noies junts)?",
                    a: "Depèn de la categoria. Les categories formatives admeten equips mixtos. Les categories Sènior estan separades per gènere (Sènior Masculí i Sènior Femení). Consulta els detalls de cada categoria al formulari.",
                  },
                  {
                    q: "Puc canviar jugadors després de la inscripció?",
                    a: "Sí, es poden fer canvis a la llista de jugadors fins a 48 hores abans del torneig, sempre que els nous jugadors compleixin els requisits d'edat de la categoria. Cal comunicar-ho per WhatsApp o email.",
                  },
                  {
                    q: "Quin és el termini màxim d'inscripció?",
                    a: "Les places son limitades i s'assignen per ordre d'arribada. Es recomana inscriure's tan aviat com sigui possible per garantir la plaça. El formulari es tanca quan s'omple el límit de cada categoria.",
                  },
                  {
                    q: "Es pot demanar la devolució de la inscripció?",
                    a: "Les inscripcions no es poden devolució un cop confirmades. En cas de força major (lesió documentada del capità o impossibilitat de l'equip) es valorarà cas per cas. Contacta'ns per WhatsApp.",
                  },
                  {
                    q: "Cal portar llicència esportiva o estar federat?",
                    a: "No. El Torneig 3×3 Westfield Glòries és obert a tothom, federat o no. No cal llicència de la Federació Catalana de Bàsquet per participar.",
                  },
                ].map(({ q, a }) => (
                  <div
                    key={q}
                    style={{
                      background: "#1a1a1a",
                      borderRadius: 12,
                      padding: "18px 22px",
                      border: "1px solid #2a2a2a",
                    }}
                  >
                    <p style={{ fontWeight: 700, color: "#fff7ef", marginBottom: 8, marginTop: 0 }}>{q}</p>
                    <p style={{ color: "#c8b99a", margin: 0, fontSize: 14, lineHeight: 1.7 }}>{a}</p>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 20 }}>
                Tens més dubtes? Consulta la{" "}
                <Link href="/preguntes-frequents" style={{ color: "#ff5b1f" }}>pàgina de preguntes freqüents</Link>{" "}
                o contacta&apos;ns directament per WhatsApp.
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
                6-7 juny 2026 · Westfield Glòries, Barcelona
              </p>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff7ef", margin: "0 0 12px" }}>
                Inscriu el teu equip ara
              </h2>
              <p style={{ color: "#c8b99a", fontSize: 15, marginBottom: 24 }}>
                Places limitades. Formulari en línia en 5 minuts.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/inscripcion" className="article-cta-btn">
                  Inscriu el teu equip →
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
