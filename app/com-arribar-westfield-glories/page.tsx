import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { WA_REGISTER_URL } from "../lib/whatsapp";

export const metadata: Metadata = {
  title: "Com arribar a Westfield Glòries | Metro, Bus i Parking Barcelona · 3×3 Glòries",
  description:
    "Com arribar a Westfield Glòries i al barri del Clot-Glòries de Barcelona: metro L1 i L2, autobús, Bicing i parking. Guia de transport, útil per a properes visites i edicions del 3×3.",
  alternates: { canonical: "/com-arribar-westfield-glories" },
  openGraph: {
    title: "Com arribar a Westfield Glòries | Metro, Bus i Parking Barcelona",
    description:
      "Metro, bus, bici i parking per arribar a Westfield Glòries i al barri del Clot-Glòries de Barcelona.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const SEUS = [
  {
    nom: "Westfield Glòries",
    adreca: "Av. Diagonal 208, 08013 Barcelona",
    mapsUrl: "https://maps.google.com/?q=Westfield+Gl%C3%B2ries+Av.+Diagonal+208+Barcelona",
    desc: "Seu principal del torneig. Pista central i categories Sènior.",
    categories: "Sènior Masculí, Sènior Femení, Màgics",
  },
  {
    nom: "La Nau del Clot",
    adreca: "C/ Llacuna 172, 08018 Barcelona",
    mapsUrl: "https://maps.google.com/?q=Nau+del+Clot+Llacuna+172+Barcelona",
    desc: "Pavelló cobert al barri del Clot. Categories formatives i Júnior.",
    categories: "Escola, Premini, Mini, Preinfantil, Infantil, Cadet, Júnior",
  },
  {
    nom: "Rambleta del Clot",
    adreca: "Rambla del Poblenou / Clot, 08018 Barcelona",
    mapsUrl: "https://maps.google.com/?q=Rambleta+del+Clot+Barcelona",
    desc: "Pista exterior a l'aire lliure. Ambient de carrer i categories Sènior Amateur.",
    categories: "Sènior Amateur Masculí, Sènior Amateur Femení",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "TravelAction",
    name: "Com arribar al Torneig 3×3 Westfield Glòries 2026",
    description:
      "Indicacions de transport públic, bici i cotxe per arribar al Torneig 3×3 Westfield Glòries 2026 de Barcelona.",
    url: `${SITE_URL}/com-arribar-westfield-glories`,
    object: {
      "@type": "SportsEvent",
      name: "3×3 Westfield Glòries 2026",
      url: `${SITE_URL}/`,
      startDate: "2026-06-06",
      endDate: "2026-06-07",
      location: {
        "@type": "Place",
        name: "Westfield Glòries",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Av. Diagonal 208",
          addressLocality: "Barcelona",
          postalCode: "08013",
          addressCountry: "ES",
        },
      },
    },
  },
  ...SEUS.map((seu) => ({
    "@context": "https://schema.org",
    "@type": "Place",
    name: seu.nom,
    address: {
      "@type": "PostalAddress",
      streetAddress: seu.adreca.split(",")[0],
      addressLocality: "Barcelona",
      addressCountry: "ES",
    },
    url: seu.mapsUrl,
    description: seu.desc,
  })),
];

export default function ComArribarWestfieldGloriesPage() {
  return (
    <>
      <Script
        id="ld-com-arribar"
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
                Barri Clot-Glòries, Barcelona
              </p>
              <h1 className="article-h1">
                Com arribar a Westfield Glòries
              </h1>
              <p style={{ color: "#c8b99a", fontSize: "clamp(15px, 2.5vw, 18px)", maxWidth: 600, margin: "0 auto 28px" }}>
                El 3×3 Westfield Glòries es va celebrar al barri del Clot-Glòries de Barcelona,
                molt ben connectat en transport públic. Les 3 seus es troben a menys de 10 minuts
                a peu des de les estacions de metro i tramvia — informació útil per a properes
                visites a la zona i per a la propera edició del torneig.
              </p>
            </div>

            {/* Les 3 seus */}
            <section className="article-section">
              <h2 className="article-h2">Les 3 seus del torneig</h2>
              <p>
                El 3×3 Westfield Glòries va repartir les categories entre tres espais
                emblemàtics del barri:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
                {SEUS.map((seu) => (
                  <div
                    key={seu.nom}
                    style={{
                      background: "#1a1a1a",
                      borderRadius: 14,
                      padding: "22px 26px",
                      border: "1px solid #2a2a2a",
                    }}
                  >
                    <p style={{ fontWeight: 800, color: "#ff5b1f", fontSize: 17, marginTop: 0, marginBottom: 6 }}>
                      {seu.nom}
                    </p>
                    <p style={{ color: "#c8b99a", margin: "0 0 8px", fontSize: 14 }}>
                      {seu.adreca}
                    </p>
                    <p style={{ color: "#888", margin: "0 0 10px", fontSize: 14, lineHeight: 1.6 }}>
                      {seu.desc}
                    </p>
                    <p style={{ color: "#666", fontSize: 13, margin: "0 0 12px" }}>
                      <strong style={{ color: "#999" }}>Categories:</strong> {seu.categories}
                    </p>
                    <a
                      href={seu.mapsUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{ color: "#ff5b1f", fontSize: 13, textDecoration: "none" }}
                    >
                      Obrir a Google Maps →
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Metro */}
            <section className="article-section">
              <h2 className="article-h2">En metro (L1 i L2 — Clot / Glòries)</h2>
              <p>
                El metro és l&apos;opció més ràpida i còmoda per arribar a les 3 seus del torneig.
                Dues línies de metro et deixen a menys de 5-10 minuts a peu:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                <div style={{ background: "#1a1a1a", borderRadius: 10, padding: "16px 20px", border: "1px solid #2a2a2a", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ background: "#e3000f", color: "#fff", fontWeight: 900, fontSize: 14, padding: "4px 10px", borderRadius: 6, flexShrink: 0 }}>L1</div>
                  <div>
                    <p style={{ fontWeight: 700, color: "#fff7ef", margin: "0 0 4px" }}>Estació Clot</p>
                    <p style={{ color: "#c8b99a", margin: 0, fontSize: 14 }}>
                      La més propera a La Nau del Clot i a la Rambleta del Clot. Sortida per Carrer Clot, 5 minuts a peu.
                    </p>
                  </div>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: 10, padding: "16px 20px", border: "1px solid #2a2a2a", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ background: "#e3000f", color: "#fff", fontWeight: 900, fontSize: 14, padding: "4px 10px", borderRadius: 6, flexShrink: 0 }}>L1</div>
                  <div>
                    <p style={{ fontWeight: 700, color: "#fff7ef", margin: "0 0 4px" }}>Estació Glòries</p>
                    <p style={{ color: "#c8b99a", margin: 0, fontSize: 14 }}>
                      La més propera a la seu principal Westfield Glòries. Sortida per Avinguda Diagonal, 3 minuts a peu fins a l&apos;entrada del centre.
                    </p>
                  </div>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: 10, padding: "16px 20px", border: "1px solid #2a2a2a", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ background: "#7a0073", color: "#fff", fontWeight: 900, fontSize: 14, padding: "4px 10px", borderRadius: 6, flexShrink: 0 }}>L2</div>
                  <div>
                    <p style={{ fontWeight: 700, color: "#fff7ef", margin: "0 0 4px" }}>Estació Clot</p>
                    <p style={{ color: "#c8b99a", margin: 0, fontSize: 14 }}>
                      Connexió directa amb L1 a l&apos;estació Clot. Pots intercanviar i arribar ràpidament a qualsevol de les 3 seus.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Autobús */}
            <section className="article-section">
              <h2 className="article-h2">En autobús</h2>
              <p>
                Diverses línies d&apos;autobús de TMB i Nitbus (servei nocturn) paren als voltants
                de les 3 seus del torneig:
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li><strong>H12</strong> — Horizontal per l&apos;Av. Diagonal, parada Glòries. Ideal per arribar al Westfield Glòries.</li>
                <li><strong>7</strong> — Circula pel Carrer Clot i parades properes a La Nau del Clot.</li>
                <li><strong>56</strong> — Connecta el Clot amb el Centre i Gràcia. Parada a Clot/Aragó.</li>
                <li><strong>192</strong> — Bus de barri que recorre el districte de Sant Martí.</li>
                <li><strong>Tramvia T4/T5/T6</strong> — Parada Pallars, a 7 minuts a peu de la Rambleta del Clot.</li>
              </ul>
              <p>
                Consulta els horaris en temps real a l&apos;aplicació de <strong>TMB</strong> o
                a <strong>Google Maps</strong> introduint la teva adreça d&apos;origen.
              </p>
            </section>

            {/* Bici / Bicing */}
            <section className="article-section">
              <h2 className="article-h2">En bici / Bicing</h2>
              <p>
                Barcelona té una xarxa ciclista molt completa al voltant del barri Clot-Glòries.
                Pots arribar còmodament en bici pròpia o amb Bicing:
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li>
                  Hi ha estacions de <strong>Bicing</strong> a Av. Diagonal (davant Westfield
                  Glòries), C/ Clot i Rambla del Poblenou.
                </li>
                <li>
                  El carril bici de l&apos;Av. Diagonal connecta directament amb el Westfield Glòries
                  des del centre de Barcelona.
                </li>
                <li>
                  Hi ha aparcament de bicicletes a les immediacions de les 3 seus. El dia del
                  torneig s&apos;habilitaran ancoratges addicionals.
                </li>
              </ul>
            </section>

            {/* Cotxe */}
            <section className="article-section">
              <h2 className="article-h2">En cotxe — Parking Glòries (2h gratuïtes Westfield)</h2>
              <p>
                Si vens en cotxe, la millor opció és el parking del centre comercial{" "}
                <strong>Westfield Glòries</strong>:
              </p>
              <div
                style={{
                  background: "rgba(255, 91, 31, 0.08)",
                  border: "1px solid rgba(255, 91, 31, 0.2)",
                  borderRadius: 12,
                  padding: "18px 22px",
                  margin: "16px 0",
                }}
              >
                <p style={{ fontWeight: 700, color: "#ff5b1f", marginBottom: 8, marginTop: 0 }}>
                  Parking Westfield Glòries — 2h gratuïtes
                </p>
                <p style={{ color: "#c8b99a", margin: 0, fontSize: 14, lineHeight: 1.7 }}>
                  El parking del Westfield Glòries ofereix 2 hores gratuïtes de pàrquing als clients
                  del centre comercial. Accés per Av. Diagonal 208. Capacitat per a més de 2.500 vehicles.
                  En dies d&apos;alta afluència (com durant el torneig) es recomana arribar
                  en transport públic per comoditat.
                </p>
              </div>
              <p>
                Altres opcions de parking properes:
              </p>
              <ul style={{ color: "#d4c9b8", lineHeight: 1.8, paddingLeft: 24 }}>
                <li><strong>SABA Parking Glòries</strong> — Av. Meridiana, molt proper a totes les seus.</li>
                <li><strong>BSM Parking Clot</strong> — Carrer Clot, ideal per a La Nau del Clot i Rambleta.</li>
                <li>Zona d&apos;aparcament en calçada (zona blava i verda) als carrers del barri.</li>
              </ul>
              <p style={{ color: "#888", fontSize: 13 }}>
                Nota: l&apos;aparcament és responsabilitat de cada participant. L&apos;organització
                no garanteix places de pàrquing gratuïtes més allà de l&apos;oferta del Westfield.
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
                3a edició · 6-7 juny 2026 · Westfield Glòries, Barcelona
              </p>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff7ef", margin: "0 0 12px" }}>
                Ja saps com arribar-hi.<br />Descobreix com va anar la 3a edició.
              </h2>
              <p style={{ color: "#c8b99a", fontSize: 15, marginBottom: 24 }}>
                113 equips · 10 categories · 2.000 € de premi paritari
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href="https://cbgrupbarna.info/fotos-3x3/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="article-cta-btn"
                >
                  📸 Veure fotos i resultats
                </a>
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
