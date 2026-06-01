import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { WA_REGISTER_URL } from "../lib/whatsapp";

export const metadata: Metadata = {
  title: "3×3 Barcelona 2026 — Torneig FIBA · Westfield Glòries · 2.000€",
  description: "3×3 Barcelona 2026: el torneig de bàsquet 3×3 FIBA de Barcelona. 10 categories (Premini a Sènior Amateur), 3 seus al Clot-Glòries, 2.000€ premi en metàl·lic. 6-7 Juny 2026. Inscriu-te des de 75€!",
  alternates: { canonical: "/3x3-barcelona" },
  openGraph: {
    title: "3×3 Barcelona 2026 — Torneig Westfield Glòries · FIBA · 2.000€",
    description: "El torneig 3×3 FIBA de Barcelona. 10 categories, 2.000€ premi, 3 seus al Clot. 6-7 Juny 2026. Inscriu el teu equip des de 75€.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "3×3 Barcelona 2026",
  alternateName: ["3x3 Barcelona", "3x3 Barna", "Torneig 3×3 Barcelona 2026", "Torneo 3x3 Barcelona 2026", "3×3 Westfield Glòries 2026"],
  description: "Torneig de bàsquet 3×3 FIBA a Barcelona. 10 categories de Premini a Sènior Amateur, 3 seus al barri del Clot-Glòries, 2.000€ de premi en metàl·lic Sèniors M/F, punts FIBA rànquing mundial. 3a edició, 6-7 juny 2026.",
  startDate: "2026-06-06T09:00:00+02:00",
  endDate: "2026-06-07T20:00:00+02:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  sport: "Basketball 3x3",
  url: `${SITE_URL}/3x3-barcelona`,
  location: {
    "@type": "Place",
    name: "Westfield Glòries — Clot-Glòries, Barcelona",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Diagonal 208",
      addressLocality: "Barcelona",
      postalCode: "08018",
      addressRegion: "Catalunya",
      addressCountry: "ES",
    },
    geo: { "@type": "GeoCoordinates", latitude: 41.4048, longitude: 2.1896 },
  },
  organizer: {
    "@type": "SportsOrganization",
    name: "CB Grup Barna",
    url: "https://cbgrupbarna.com",
    sameAs: ["https://www.instagram.com/cbgrupbarna/"],
  },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "75",
    highPrice: "105",
    priceCurrency: "EUR",
    url: `${SITE_URL}/inscripcion`,
    availability: "https://schema.org/InStock",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quin és el millor torneig 3×3 de Barcelona el 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El 3×3 Westfield Glòries 2026, organitzat per CB Grup Barna, Time Chamber i Eix Clot al barri del Clot-Glòries. És l'únic torneig 3×3 FIBA oficial de Barcelona el 2026, amb 2.000€ de premi en metàl·lic i punts pel rànquing mundial individual FIBA 3×3.",
      },
    },
    {
      "@type": "Question",
      name: "On és el torneig 3×3 Barcelona 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Al barri del Clot-Glòries (Districte de Sant Martí, Barcelona), en tres seus: Westfield Glòries (Av. Diagonal 208, seu principal), La Nau del Clot (Carrer de la Llacuna 172) i la Rambleta del Clot (pista exterior). Totes a menys de 10 minuts a peu entre elles. Metro L1 estació Glòries.",
      },
    },
    {
      "@type": "Question",
      name: "Quant costa inscriure un equip al 3×3 Barcelona?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entre 75€ i 105€ per equip. Categories formatives (Premini, Mini, Infantil, Cadet, Júnior, Sub-23): 75€ (4 jugadors) o 90€ (5 jugadors). Sèniors i Sènior Amateur: 85€ (4 jugadors) o 90–105€ (5 jugadors). La inscripció inclou samarreta oficial i dorsal.",
      },
    },
    {
      "@type": "Question",
      name: "Hi ha torneig 3×3 Barcelona per a nens?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. El 3×3 Barcelona 2026 inclou categories Premini (2016-17, 8-9 anys), Mini (2014-15, 10-11 anys), Infantil (2012-13, 12-13 anys), Cadet (2010-11, 14-15 anys) i Júnior (2008-09, 16-17 anys). Les categories formatives es disputen el diumenge 7 de juny a La Nau del Clot.",
      },
    },
    {
      "@type": "Question",
      name: "El torneig 3×3 Barcelona és FIBA oficial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. El 3×3 Westfield Glòries és reconegut per FIBA 3×3. Els jugadors de les categories Sènior Masculí i Sènior Femení acumulen punts pel rànquing mundial individual FIBA 3×3, que permet accedir a competicions internacionals oficials.",
      },
    },
  ],
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inici", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "3×3 Barcelona 2026", item: `${SITE_URL}/3x3-barcelona` },
  ],
};

const CONTACT_LINK = WA_REGISTER_URL;

const CATEGORIES = [
  { emoji: "⭐", name: "Premini", any: "2016–2017", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { emoji: "⭐", name: "Mini", any: "2014–2015", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { emoji: "🏀", name: "Infantil", any: "2012–2013", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { emoji: "🏀", name: "Cadet", any: "2010–2011", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { emoji: "🏀", name: "Júnior", any: "2008–2009", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { emoji: "🏀", name: "Sub-23", any: "2003–2007", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { emoji: "🏆", name: "Sènior Masculí", any: "fins 2002", preu: "85–105 €", nota: "4 jug.: 85€ · 5 jug.: 105€", special: true },
  { emoji: "🏆", name: "Sènior Femení", any: "fins 2002", preu: "85–105 €", nota: "4 jug.: 85€ · 5 jug.: 105€", special: true },
  { emoji: "🎖️", name: "Sènior Amateur Masculí", any: "fins 1986", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { emoji: "🎖️", name: "Sènior Amateur Femení", any: "fins 1986", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
];

export default function Page3x3Barcelona() {
  return (
    <>
      <Script id="ld-3x3-bcn" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="ld-faq-3x3-bcn" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <Script id="ld-bc-3x3-bcn" type="application/ld+json" strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <div className="page-shell">
        <nav className="page-nav">
          <Link href="/" className="page-nav-back">← Inici</Link>
          <span className="page-nav-logo">3×3 Barcelona 2026</span>
        </nav>

        {/* Hero */}
        <div className="insc-hero">
          <Image src="/hero-bg-1.webp" fill priority sizes="100vw"
            alt="Torneig 3×3 Barcelona 2026 al Westfield Glòries — Clot-Glòries"
            className="insc-hero-img" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
          <div className="insc-hero-overlay" />
          <div className="insc-hero-body">
            <span className="insc-hero-kicker">6-7 Juny 2026 · Clot-Glòries, Barcelona · FIBA Oficial</span>
            <h1 className="insc-hero-title">3×3 Barcelona 2026</h1>
            <p className="insc-hero-sub">
              El torneig de bàsquet 3×3 FIBA de referència a Barcelona —
              10 categories, 3 seus, 2.000€ de premi en metàl·lic.
            </p>
            <div className="insc-hero-chips">
              <span>🏀 10 categories</span>
              <span>🏆 2.000€ premi</span>
              <span>🔴 FIBA Oficial</span>
              <span>📍 3 seus Clot-Glòries</span>
            </div>
          </div>
        </div>

        <main className="page-content">

          {/* Prize block */}
          <div className="insc-prize">
            <div className="insc-prize-img-wrap">
              <Image src="/hero-bg-3.webp" fill sizes="(max-width: 768px) 100vw, 50vw"
                alt="Jugadors al 3×3 Barcelona 2026 Westfield Glòries"
                className="insc-prize-img" style={{ objectFit: "cover" }} />
              <div className="insc-prize-img-overlay" />
              <span className="insc-prize-fiba">FIBA Official</span>
            </div>
            <div className="insc-prize-body">
              <span className="insc-prize-kicker">Sènior Masculí &amp; Femení</span>
              <p className="insc-prize-amount">2.000€</p>
              <p className="insc-prize-label">Premi en Metàl·lic</p>
              <p className="insc-prize-desc">
                <strong>1.000€ Sèniors Masculí</strong> + <strong>1.000€ Sèniors Femení</strong>.
                Premi equiparat — compromís amb la igualtat de gènere en el 3×3 Barcelona.
              </p>
              <p className="insc-prize-rest">
                + <strong>Punts FIBA</strong> pel rànquing mundial individual. La resta de categories reben trofeus i medalles.
              </p>
            </div>
          </div>

          <hr className="page-divider" />

          {/* Categories */}
          <h2>10 Categories del 3×3 Barcelona 2026</h2>
          <p>
            El 3×3 Barcelona 2026 és obert a jugadors de totes les edats: des dels
            <strong> Premini</strong> (8-9 anys) fins als <strong>Sènior Amateur</strong> (+38 anys).
            Tots els equips reben <strong>samarreta oficial i dorsal</strong>. No cal ser federat.
          </p>
          <div className="insc-cat-grid">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className={`insc-cat-card${cat.special ? " insc-cat-card--pro" : ""}`}>
                <span className="insc-cat-emoji">{cat.emoji}</span>
                <span className="insc-cat-name">{cat.name}</span>
                <span className="insc-cat-year">{cat.any}</span>
                <span className="insc-cat-price">{cat.preu}</span>
                <span className="insc-cat-note">{cat.nota}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", padding: "1.5rem 0 2rem" }}>
            <Link href="/inscripcion" style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #ff5b1f, #ff2563)",
              color: "#fff", fontWeight: 800, fontSize: "1.05rem",
              padding: "0.9rem 2.5rem", borderRadius: "50px", textDecoration: "none",
            }}>
              🏀 Inscriu el teu equip al 3×3 Barcelona
            </Link>
            <br />
            <a href={CONTACT_LINK} target="_blank" rel="noreferrer noopener"
              style={{ fontSize: "0.9rem", color: "rgba(255,247,239,0.6)", textDecoration: "underline", marginTop: 8, display: "inline-block" }}>
              Pregunta per WhatsApp →
            </a>
          </div>

          <hr className="page-divider" />

          {/* 3 seus */}
          <h2>3 Seus del 3×3 Barcelona 2026</h2>
          <p>Tots els recintes estan al barri del <strong>Clot-Glòries</strong> (Districte de Sant Martí, Barcelona), a menys de 10 minuts a peu entre ells. Metro L1, estació Glòries.</p>
          <ul>
            <li><strong>Westfield Glòries</strong> — Av. Diagonal 208, 08018 Barcelona · Seu principal, pàrquing gratuït 2h, finals Sèniors</li>
            <li><strong>La Nau del Clot</strong> — Carrer de la Llacuna 172 · Pavelló cobert oficial, categories formatives i Sèniors</li>
            <li><strong>Rambleta del Clot</strong> · Pista exterior, Sènior Amateur i Barna Màgics (inclusiva)</li>
          </ul>

          <hr className="page-divider" />

          {/* Why best 3x3 Barcelona */}
          <h2>Per què és el millor 3×3 de Barcelona?</h2>
          <ul>
            <li><strong>Únic torneig 3×3 FIBA oficial</strong> de Barcelona el 2026 — punts pel rànquing mundial individual.</li>
            <li><strong>3a edició consecutiva</strong> (2023–2026) — historial demostrat. Més de 180 equips en 2 edicions.</li>
            <li><strong>2.000€ de premi en metàl·lic</strong> equiparat entre Sèniors M i F (1.000€ cadascun).</li>
            <li><strong>10 categories</strong> per a totes les edats, des de Premini (8 anys) fins a Sènior Amateur (+38).</li>
            <li><strong>Entrada gratuïta</strong> per a espectadors. Ambient de festa i bàsquet de carrer.</li>
            <li>Organitzat per <strong>CB Grup Barna</strong> (club fundat el 1965), <strong>Time Chamber</strong> i <strong>Eix Clot</strong>.</li>
          </ul>

          <hr className="page-divider" />

          {/* FAQ */}
          <h2>Preguntes freqüents sobre el 3×3 Barcelona 2026</h2>

          <h3>Quin és el millor torneig 3×3 de Barcelona el 2026?</h3>
          <p>
            El <strong>3×3 Westfield Glòries</strong>, organitzat per CB Grup Barna, Time Chamber i Eix Clot.
            És l&apos;únic torneig 3×3 FIBA oficial de Barcelona el 2026, amb 2.000€ de premi
            i punts per al rànquing mundial individual. Popularment conegut com el{" "}
            <Link href="/3x3-barna" className="insc-link">3×3 Barna</Link>.
          </p>

          <h3>Hi ha torneig 3×3 Barcelona per a nens i joves?</h3>
          <p>
            Sí. El diumenge 7 de juny a La Nau del Clot es disputen les categories
            Premini (2016-17), Mini (2014-15), Infantil (2012-13), Cadet (2010-11),
            Júnior (2008-09) i Sub-23 (2003-07). Des de 75€ per equip.
          </p>

          <h3>Hi ha 3×3 femení a Barcelona?</h3>
          <p>
            Sí. El <Link href="/torneo-3x3-femenino-barcelona" className="insc-link">3×3 femení Barcelona</Link>{" "}
            inclou Sènior Femení Pro (1.000€ + FIBA), Sènior Amateur Femení i Barna Màgics (inclusiva).
            El premi Sènior Femení és exactament igual al Masculí.
          </p>

          <h3>Hi ha 3×3 FIBA Barcelona el 2026?</h3>
          <p>
            Sí. El <Link href="/torneo-3x3-senior-fiba-barcelona" className="insc-link">3×3 Sènior FIBA Barcelona</Link>{" "}
            és oficial FIBA — els jugadors sumen punts al rànquing mundial individual per accedir
            a competicions internacionals. Dissabte 6 de juny a Westfield Glòries.
          </p>

          <h3>Hi ha 3×3 de sènior amateur a Barcelona?</h3>
          <p>
            Sí. El <Link href="/torneo-3x3-veteranos-barcelona" className="insc-link">3×3 Sènior Amateur Barcelona</Link>{" "}
            és per a jugadors nascuts fins al 1986 (+38 anys el 2026). Dissabte 6 de juny,
            pista exterior de la Rambleta del Clot. Des de 75€.
          </p>

          <hr className="page-divider" />

          {/* Cross-links */}
          <h2>Més informació del torneig</h2>
          <ul>
            <li><Link href="/3x3-barna" className="insc-link">3×3 Barna 2026</Link> — pàgina principal del torneig amb categories i inscripció</li>
            <li><Link href="/inscripcion" className="insc-link">Inscripció d&apos;equip</Link> — formulari online en 5 passos</li>
            <li><Link href="/inscripcio-individual" className="insc-link">Inscripció individual</Link> — sense equip, 20€, t&apos;assignem un equip</li>
            <li><Link href="/horarios-3x3-barcelona-2026" className="insc-link">Horaris 3×3 Barcelona 2026</Link> — programa complet 6-7 juny</li>
            <li><Link href="/torneo-3x3-senior-fiba-barcelona" className="insc-link">3×3 Sènior FIBA Barcelona</Link> — punts rànquing mundial</li>
            <li><Link href="/torneo-3x3-femenino-barcelona" className="insc-link">3×3 Femení Barcelona</Link> — totes les categories femenines</li>
            <li><Link href="/torneo-3x3-veteranos-barcelona" className="insc-link">3×3 Sènior Amateur Barcelona</Link> — +38 anys</li>
            <li><Link href="/preguntes-frequents" className="insc-link">Preguntes freqüents</Link></li>
            <li><Link href="/contacte" className="insc-link">Contacte</Link> — WhatsApp en menys de 24h</li>
          </ul>

        </main>
      </div>
    </>
  );
}
