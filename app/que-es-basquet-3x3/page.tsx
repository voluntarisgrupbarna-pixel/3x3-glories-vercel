import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { WA_REGISTER_URL } from "../lib/whatsapp";

export const metadata: Metadata = {
  title: "Qué es el Baloncesto 3x3 FIBA | Regles i format — 3×3 Barcelona 2026",
  description:
    "Descobreix com funciona el bàsquet 3x3 FIBA: format de joc, regles oficials, categories i per què el Torneig 3×3 Westfield Glòries 2026 és la cita imprescindible de Barcelona.",
  alternates: { canonical: "/que-es-basquet-3x3" },
  openGraph: {
    title: "Qué es el Baloncesto 3x3 FIBA | Regles i format — 3×3 Barcelona 2026",
    description:
      "Format, regles FIBA i categories del bàsquet 3x3. Tot el que necessites saber abans d'inscriure el teu equip al Torneig Westfield Glòries 2026.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Qué es el baloncesto 3x3 FIBA: regles, format i estratègia",
    description:
      "Guia completa sobre el bàsquet 3x3 FIBA: format de joc, regles oficials, categories i estratègia. Orientada al Torneig 3×3 Westfield Glòries Barcelona 2026.",
    url: `${SITE_URL}/que-es-basquet-3x3`,
    author: {
      "@type": "Organization",
      name: "CB Grup Barna",
      url: "https://cbgrupbarna.com",
    },
    publisher: {
      "@type": "Organization",
      name: "CB Grup Barna",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    about: {
      "@type": "SportsEvent",
      name: "3×3 Westfield Glòries 2026",
      url: `${SITE_URL}/`,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quants jugadors té un equip 3x3?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Un equip de bàsquet 3x3 FIBA té 4 jugadors: 3 jugadors en pista i 1 suplent. No hi ha entrenador a la pista — els jugadors s'autogestionen.",
        },
      },
      {
        "@type": "Question",
        name: "Quants punts es necessiten per guanyar un partit de 3x3?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Un equip guanya el partit de 3x3 FIBA quan arriba a 21 punts o bé quan s'acaben els 10 minuts de temps de joc efectiu. En cas d'empat al final del temps reglamentari, es juga pròrroga fins que un equip anota 2 punts.",
        },
      },
      {
        "@type": "Question",
        name: "Quin és el temps de joc al bàsquet 3x3?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El temps de joc és de 10 minuts de temps efectiu en un sol període. El rellotge s'atura cada cop que la pilota és morta. El rellotge de possessió és de 12 segons (davant els 24 del bàsquet 5x5).",
        },
      },
    ],
  },
];

export default function QueEsBasquet3x3Page() {
  return (
    <>
      <Script
        id="ld-que-es-3x3"
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
                3×3 Westfield Glòries · Barcelona 2026
              </p>
              <h1 className="article-h1">
                Qué es el baloncesto 3x3 FIBA: regles, format i estratègia
              </h1>
              <p style={{ color: "#c8b99a", fontSize: "clamp(15px, 2.5vw, 18px)", maxWidth: 600, margin: "0 auto 28px" }}>
                El 3x3 és la modalitat de bàsquet olímpica més jove i una de les que creix
                més ràpid al món. Mitja pista, una sola cistella, equips de 4 jugadors i
                partits intensos de 10 minuts. Aquí t&apos;ho expliquem tot.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/inscripcion" className="page-cta-btn">
                  Inscriu el teu equip →
                </Link>
                <Link href="/regles-3x3" className="page-cta-btn-ghost">
                  Veure reglament complet
                </Link>
              </div>
            </div>

            {/* Secció 1: Format de joc */}
            <section className="article-section">
              <h2 className="article-h2">Format de joc</h2>
              <p>
                El bàsquet 3x3 FIBA es juga en <strong>mitja pista</strong> amb una sola cistella.
                Cada equip té 3 jugadors en pista i 1 suplent. No hi ha entrenador a la pista:
                els jugadors s&apos;autogestionen, la qual cosa dóna molta autonomia i responsabilitat
                a cada jugador.
              </p>
              <p>
                Els partits duren <strong>10 minuts de temps efectiu</strong> (el rellotge s&apos;atura
                en pilota morta) o fins que un equip arriba a <strong>21 punts</strong>, el que
                passi primer. En cas d&apos;empat al final del temps reglamentari es juga una pròrroga:
                guanya el primer equip que anota 2 punts.
              </p>
              <p>
                El <strong>rellotge de possessió</strong> és de 12 segons, la meitat que en el
                bàsquet 5×5 (24 seg.). Això obliga a decisions ràpides i fa que els partits
                siguin molt dinàmics i espectaculars.
              </p>
              <p>
                La puntuació és diferent a la del bàsquet convencional: un tir des de dins
                l&apos;arc val <strong>1 punt</strong>, mentre que un tir des de fora de l&apos;arc
                (equivalent al triple del 5×5) val <strong>2 punts</strong>. Els tirs lliures
                valen 1 punt cadascun.
              </p>
            </section>

            {/* Secció 2: Regles bàsiques */}
            <section className="article-section">
              <h2 className="article-h2">Regles bàsiques del 3x3 FIBA</h2>
              <p>
                El bàsquet 3x3 segueix el reglament oficial FIBA 3×3. Algunes de les regles
                més importants que el diferencien del bàsquet 5×5 convencional són:
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>
                  <strong>Check-ball:</strong> al principi de cada possessió, el defensor entrega
                  la pilota a l&apos;atacant darrera de l&apos;arc. El joc no comença fins que el
                  defensor toca la pilota.
                </li>
                <li>
                  <strong>Treure la pilota de l&apos;arc:</strong> després de cada rebot, la pilota
                  ha de ser treta clarament fora de l&apos;arc abans d&apos;atacar.
                </li>
                <li>
                  <strong>Faltes d&apos;equip:</strong> a partir de la 7a falta d&apos;equip, l&apos;equip
                  atacant sempre té dret a 2 tirs lliures. A partir de la 10a, a més, es conserva
                  la possessió.
                </li>
                <li>
                  <strong>Sense eliminació personal:</strong> a diferència del 5×5, no hi ha
                  eliminació per acumulació de 5 faltes personals. Un jugador és expulsat únicament
                  per falta antiesportiva o descalificadora.
                </li>
                <li>
                  <strong>1 temps mort per equip:</strong> cada equip té un sol temps mort de
                  30 segons per tot el partit.
                </li>
                <li>
                  <strong>Substitucions lliures:</strong> qualsevol vegada que la pilota és morta,
                  des de darrere la línia de fons, sense avisar l&apos;àrbitre.
                </li>
              </ul>
              <p>
                Vols veure totes les regles amb detall? Consulta la nostra{" "}
                <Link href="/regles-3x3" style={{ color: "#ff5b1f" }}>guia completa del reglament 3×3 FIBA</Link>.
              </p>
            </section>

            {/* Secció 3: Categories i edats */}
            <section className="article-section">
              <h2 className="article-h2">Categories i edats</h2>
              <p>
                El 3×3 Westfield Glòries 2026 compta amb <strong>10 categories</strong> per garantir
                que tothom pugui competir al seu nivell:
              </p>
              <div style={{ overflowX: "auto", marginTop: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#1a1a1a" }}>
                      <th style={{ padding: "10px 14px", textAlign: "left", color: "#888", fontWeight: 600, borderBottom: "1px solid #2a2a2a" }}>Categoria</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", color: "#888", fontWeight: 600, borderBottom: "1px solid #2a2a2a" }}>Edats</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", color: "#ff5b1f", fontWeight: 600, borderBottom: "1px solid #2a2a2a" }}>Preu inscripció</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Escola", "8-10 anys", "75 €"],
                      ["Premini", "10-12 anys", "75 €"],
                      ["Mini", "11-12 anys", "75 €"],
                      ["Preinfantil", "12-14 anys", "75 €"],
                      ["Infantil", "13-14 anys", "75 €"],
                      ["Cadet", "15-16 anys", "75 €"],
                      ["Júnior", "17-18 anys", "75 €"],
                      ["Sènior Masculí", "+18 anys", "85–90 €"],
                      ["Sènior Femení", "+18 anys", "85–90 €"],
                      ["Veterans / Màgics", "+35 anys", "75–90 €"],
                    ].map(([cat, edat, preu], i) => (
                      <tr key={cat} style={{ background: i % 2 === 0 ? "transparent" : "#141414" }}>
                        <td style={{ padding: "10px 14px", color: "#fff7ef", fontWeight: 600, borderBottom: "1px solid #1e1e1e" }}>{cat}</td>
                        <td style={{ padding: "10px 14px", color: "#c8b99a", borderBottom: "1px solid #1e1e1e" }}>{edat}</td>
                        <td style={{ padding: "10px 14px", color: "#ff5b1f", borderBottom: "1px solid #1e1e1e", fontWeight: 700 }}>{preu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ color: "#888", fontSize: 13, marginTop: 12 }}>
                * Les categories formatives (Escola, Premini, Mini, Preinfantil, Infantil, Cadet, Júnior) inscriuen a 75€.
                La categoria Sènior té early bird a 85€ i preu regular a 90€.
              </p>
            </section>

            {/* Secció 4: Per què jugar al 3x3 Westfield Glòries 2026 */}
            <section className="article-section">
              <h2 className="article-h2">Per què jugar al 3×3 Westfield Glòries 2026</h2>
              <p>
                El <strong>Torneig 3×3 Westfield Glòries</strong> és la cita de bàsquet urbà
                de referència a Barcelona. Organitzat per CB Grup Barna, Time Chamber i l&apos;Eix
                Clot, arriba a la seva 4a edició el <strong>6 i 7 de juny de 2026</strong> amb
                més de 10 categories i premi en metàl·lic per a la categoria Sènior.
              </p>
              <p>
                Tres seus en plena Barcelona: <strong>Westfield Glòries</strong> (Av. Diagonal 208),
                <strong> La Nau del Clot</strong> (C/ Llacuna 172) i la <strong>Rambleta del Clot</strong>.
                Una experiència de bàsquet urbà amb ambient de barri, música, públic i el millor
                3×3 de la temporada.
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>
                  <strong>Premi de 2.000 €</strong> repartits entre Sènior Masculí (1.000 €) i Sènior
                  Femení (1.000 €) + <strong>punts FIBA</strong> oficials.
                </li>
                <li>Trofeus i medalles per a totes les categories.</li>
                <li>Samarreta oficial del torneig inclosa en la inscripció.</li>
                <li>Accessible en transport públic: metro L1 Glòries, L1 Clot, tramvia i múltiples
                  línies de bus.</li>
                <li>Places limitades — les inscripcions s&apos;obren per ordre d&apos;arribada.</li>
              </ul>
              <p>
                Tant si ets un equip federat com si jugues entre amics, el 3×3 Westfield Glòries
                és l&apos;oportunitat perfecta per viure el bàsquet d&apos;una altra manera. El format
                és ràpid, espectacular i accessible per a tothom que vulgui competir.
              </p>
            </section>

            {/* Preguntes freqüents */}
            <section className="article-section">
              <h2 className="article-h2">Preguntes freqüents sobre el 3x3</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ background: "#1a1a1a", borderRadius: 12, padding: "20px 24px", border: "1px solid #2a2a2a" }}>
                  <p style={{ fontWeight: 700, color: "#fff7ef", marginBottom: 8 }}>
                    Quants jugadors té un equip 3x3?
                  </p>
                  <p style={{ color: "#c8b99a", margin: 0 }}>
                    Un equip té <strong>4 jugadors</strong>: 3 en pista i 1 suplent. El suplent pot
                    entrar en qualsevol pilota morta, des de darrere la línia de fons, sense avisar
                    l&apos;àrbitre i sense límit de substitucions.
                  </p>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: 12, padding: "20px 24px", border: "1px solid #2a2a2a" }}>
                  <p style={{ fontWeight: 700, color: "#fff7ef", marginBottom: 8 }}>
                    Quants punts es necessiten per guanyar?
                  </p>
                  <p style={{ color: "#c8b99a", margin: 0 }}>
                    <strong>21 punts</strong> o bé acabar el temps de joc (10 minuts efectius) amb
                    més punts que l&apos;adversari. Si hi ha empat s&apos;entra en pròrroga fins al
                    primer equip que anota 2 punts.
                  </p>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: 12, padding: "20px 24px", border: "1px solid #2a2a2a" }}>
                  <p style={{ fontWeight: 700, color: "#fff7ef", marginBottom: 8 }}>
                    Quin és el temps de joc al 3x3?
                  </p>
                  <p style={{ color: "#c8b99a", margin: 0 }}>
                    <strong>10 minuts de temps efectiu</strong> en un sol període. El rellotge
                    s&apos;atura en totes les pilotes mortes. El rellotge de possessió és de
                    <strong> 12 segons</strong> (la meitat que en el bàsquet 5×5).
                  </p>
                </div>
              </div>
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
                Ja saps com funciona el 3×3.<br />Ara inscriu el teu equip.
              </h2>
              <p style={{ color: "#c8b99a", fontSize: 15, marginBottom: 24 }}>
                Des de 75 € · 10 categories · Premi 2.000 € Sènior · Places limitades
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
