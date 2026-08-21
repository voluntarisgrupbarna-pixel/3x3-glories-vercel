import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { WA_REGISTER_URL } from "../lib/whatsapp";
import RegistrationClosedNotice from "../components/RegistrationClosedNotice";

export const metadata: Metadata = {
  title: "Cómo se inscribían los equipos en el Torneo 3x3 Barcelona | Guia de referència",
  description:
    "Les inscripcions del 3×3 Westfield Glòries 2026 ja estan tancades (torneig celebrat el 6-7 de juny, amb 113 equips). Aquí tens com funcionava el procés, de referència per a la propera edició.",
  alternates: { canonical: "/com-inscriure-equip-3x3" },
  openGraph: {
    title: "Cómo se inscribían los equipos en el Torneo 3x3 Barcelona",
    description:
      "Inscripcions tancades — la 3a edició ja es va celebrar. Guia de referència del procés d'inscripció i com apuntar-te a la llista d'avís del 2027.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Com funcionava la inscripció d'equips al Torneig 3x3 Westfield Glòries Barcelona (edició 2026)",
  description:
    "Guia de referència en 5 passos de com es van inscriure els equips de bàsquet 3x3 a la 3a edició (juny 2026) del Torneig Westfield Glòries de Barcelona. Les inscripcions d'aquesta edició ja estan tancades.",
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
      text: "S'accedia al formulari d'inscripció i s'hi introduïen el nom de l'equip, la categoria i les dades de contacte del capità o responsable.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Triar el paquet d'inscripció",
      text: "Es triava la mida de l'equip (4 o 5 jugadors) i el paquet corresponent. Categories formatives: 75€. Sènior early bird: 85€. Sènior regular: 90€.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Realitzar el pagament i pujar el comprovant",
      text: "Es feia la transferència o pagament per Bizum i es pujava el comprovant al formulari. La plaça es reservava quan es confirmava el pagament.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Introduir les dades dels jugadors",
      text: "S'afegien el nom, cognoms, DNI/NIE i data de naixement de cada jugador. En categories formatives, calia indicar el tutor legal dels menors.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Confirmació i acreditació",
      text: "S'enviava un email de confirmació amb tots els detalls. El dia del torneig, cada equip es presentava al punt d'acreditació 30 minuts abans del seu primer partit.",
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
                Inscripcions tancades · 3a edició ja celebrada
              </p>
              <h1 className="article-h1">
                Com es van inscriure els equips al 3×3 Westfield Glòries 2026
              </h1>
              <p style={{ color: "#c8b99a", fontSize: "clamp(15px, 2.5vw, 18px)", maxWidth: 600, margin: "0 auto 28px" }}>
                Les inscripcions del <strong>3×3 Westfield Glòries 2026</strong> ja estan tancades:
                el torneig es va celebrar el 6 i 7 de juny de 2026 amb un rècord de{" "}
                <strong>113 equips</strong>. Aquí tens, de referència, com funcionava el procés —
                probablement s&apos;assemblarà al de la propera edició.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="https://cbgrupbarna.info/fotos-3x3/" target="_blank" rel="noreferrer noopener" className="page-cta-btn">
                  📸 Veure fotos i resultats
                </a>
                <Link href="/que-es-basquet-3x3" className="page-cta-btn-ghost">
                  Saber més sobre el 3×3
                </Link>
              </div>
            </div>

            <RegistrationClosedNotice
              title="Inscripcions tancades"
              body="El 3×3 Westfield Glòries 2026 (6-7 juny), amb 113 equips i 508 jugadors/es, ja s'ha celebrat. Deixa'ns el teu contacte o escriu-nos per WhatsApp i t'avisem quan obrim les inscripcions del 2027."
            />

            {/* Secció 1: Requisits */}
            <section className="article-section">
              <h2 className="article-h2">Així eren els requisits per inscriure&apos;s (edició 2026)</h2>
              <p>
                Qualsevol persona podia participar al Torneig 3×3 Westfield Glòries 2026, tant si
                era jugador federat com si jugava a bàsquet de forma recreativa. Els requisits
                bàsics eren:
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>
                  <strong>Equip de mínim 3 jugadors</strong> (màxim 5). Cada equip havia de tenir
                  almenys 3 jugadors per poder disputar partits.
                </li>
                <li>
                  <strong>Edat corresponent a la categoria.</strong> La taula de categories servia
                  per verificar que tots els jugadors complien els requisits d&apos;edat.
                </li>
                <li>
                  <strong>DNI/NIE o passaport vigent</strong> per a tots els jugadors, verificable
                  el dia del torneig.
                </li>
                <li>
                  <strong>En categories formatives (fins a Júnior):</strong> calia el
                  consentiment del tutor legal per als jugadors menors d&apos;edat.
                </li>
                <li>
                  <strong>Pagament complet</strong> de la inscripció abans de la data límit. La
                  plaça es confirmava quan es verificava el pagament.
                </li>
              </ul>
              <p>
                No calia ser soci ni federat del CB Grup Barna: el torneig era obert a tothom,
                amb equips d&apos;altres clubs, grups d&apos;amics i equips mixtos.
              </p>
            </section>

            {/* Secció 2: Passos del formulari */}
            <section className="article-section">
              <h2 className="article-h2">Així funcionava el procés d&apos;inscripció (5 minuts)</h2>
              <p>
                El formulari d&apos;inscripció era completament en línia. Aquí tens el detall de
                cada pas, de referència per a la propera edició:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
                {[
                  {
                    num: "01",
                    titol: "Dades de l'equip",
                    desc: "Es demanava el nom de l'equip, la categoria i les dades de contacte del capità o responsable de l'equip, ja que tota la informació s'enviava a aquest email.",
                  },
                  {
                    num: "02",
                    titol: "Tria del paquet",
                    desc: "Es triava si l'equip era de 4 o 5 jugadors. El preu variava en funció de la mida i la categoria. Les categories sènior tenien un descompte early bird per a qui s'inscrivia abans de la data límit.",
                  },
                  {
                    num: "03",
                    titol: "Pagament i comprovant",
                    desc: "Es feia la transferència o pagament per Bizum i s'adjuntava el comprovant al formulari. La plaça quedava reservada però no confirmada fins que l'organització verificava el pagament.",
                  },
                  {
                    num: "04",
                    titol: "Dades dels jugadors",
                    desc: "S'afegien el nom complet, la data de naixement i el DNI/NIE de cada jugador. En categories formatives, calia indicar el nom del tutor legal dels jugadors menors d'edat.",
                  },
                  {
                    num: "05",
                    titol: "Confirmació i acreditació",
                    desc: "Un cop revisat el formulari, s'enviava un email de confirmació amb tots els detalls del torneig: hora, seu, horaris dels partits i punt d'acreditació.",
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
              <h2 className="article-h2">Preus de l&apos;edició 2026 (referència)</h2>
              <p>
                El preu de la inscripció depenia de la categoria i del moment del registre. Aquí
                tens la taula de preus de la 3a edició, de referència per a la propera:
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
                * Preus de la 3a edició, ja tancada. Eren per equip (no per jugador) i incloïen la
                samarreta oficial del torneig per a cada jugador. El preu de la propera edició es
                confirmarà quan s&apos;obrin les inscripcions.
              </p>
            </section>

            {/* Secció 4: FAQ inscripció */}
            <section className="article-section">
              <h2 className="article-h2">Preguntes freqüents sobre la inscripció (edició 2026)</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  {
                    q: "Es podia inscriure un equip mixt (nois i noies junts)?",
                    a: "Depenia de la categoria. Les categories formatives admetien equips mixtos. Les categories Sènior anaven separades per gènere (Sènior Masculí i Sènior Femení).",
                  },
                  {
                    q: "Es podien canviar jugadors després de la inscripció?",
                    a: "Sí, es podien fer canvis a la llista de jugadors fins a 48 hores abans del torneig, sempre que els nous jugadors complissin els requisits d'edat de la categoria, comunicant-ho per WhatsApp o email.",
                  },
                  {
                    q: "Quin era el termini màxim d'inscripció?",
                    a: "Les places eren limitades i s'assignaven per ordre d'arribada; el formulari es tancava quan s'omplia el límit de cada categoria. Va acabar amb un rècord de 113 equips inscrits.",
                  },
                  {
                    q: "Es podia demanar la devolució de la inscripció?",
                    a: "Les inscripcions no eren reemborsables un cop confirmades, tret de força major (lesió documentada del capità o impossibilitat de l'equip), que es valorava cas per cas.",
                  },
                  {
                    q: "Calia portar llicència esportiva o estar federat?",
                    a: "No. El Torneig 3×3 Westfield Glòries és obert a tothom, federat o no. No calia llicència de la Federació Catalana de Bàsquet per participar.",
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
                6-7 juny 2026 · Ja celebrat · Westfield Glòries, Barcelona
              </p>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff7ef", margin: "0 0 12px" }}>
                Vols ser dels primers a saber-ho el 2027?
              </h2>
              <p style={{ color: "#c8b99a", fontSize: 15, marginBottom: 24 }}>
                Encara no hi ha data confirmada per a la propera edició. Deixa el teu contacte o
                escriu-nos i t&apos;avisem en obrir les inscripcions.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/#torneig" className="article-cta-btn">
                  🔔 Avisa&apos;m pel 2027 →
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
              <p style={{ marginTop: 20 }}>
                <a
                  href="https://cbgrupbarna.info/fotos-3x3/"
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{ color: "#ff5b1f", fontWeight: 600, textDecoration: "none" }}
                >
                  📸 Veure fotos i resultats de la 3a edició →
                </a>
              </p>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
