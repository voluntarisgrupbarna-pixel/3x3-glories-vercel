import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import InscripcioWizard from "./InscripcioWizard";
import { WA_REGISTER_URL } from "../lib/whatsapp";

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

export const metadata: Metadata = {
  title: "Inscriu el teu equip — 3×3 Westfield Glòries 2026 · Des de 75€",
  description:
    "Places limitades. Des de 75€/equip. 11 categories de Escoleta a Sènior FIBA. Confirma en menys de 24h. 6-7 juny 2026 · Westfield Glòries, Barcelona.",
  alternates: {
    canonical: "/inscripcion",
  },
  openGraph: {
    title: "Inscripció — 3×3 Westfield Glòries 2026 · Des de 75€",
    description:
      "Places al 64%. Des de 75€ per equip. 11 categories, punts FIBA Sèniors, 2.000€ de premi. Inscripció en 10 min · Confirmació en 24h.",
  },
};

// JSON-LD: HowTo — procés d'inscripció en 5 passos (rich result a Google SERP)
const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Com inscriure un equip al 3×3 Westfield Glòries 2026",
  description:
    "Procés d'inscripció online en 5 passos. Temps estimat: 10 minuts. Cost: des de 75€ per equip (3–5 jugadors). Confirmació en menys de 24h per email i WhatsApp.",
  image: `${SITE_URL}/og-image.png`,
  totalTime: "PT10M",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "EUR",
    minValue: "75",
    maxValue: "90",
  },
  supply: [
    { "@type": "HowToSupply", name: "Dades dels 3–5 jugadors (nom, cognoms, any de naixement)" },
    { "@type": "HowToSupply", name: "Email i telèfon del capità de l'equip" },
    { "@type": "HowToSupply", name: "App bancària per al pagament per transferència" },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Escull la categoria",
      text: "Selecciona la categoria del teu equip: Escoleta, Premini, Mini, Infantil, Cadet, Júnior, Sub-23, Sènior M/F (FIBA) o Sènior Amateur M/F. Comprova els anys de naixement requerits per a cada categoria.",
      url: `${SITE_URL}/inscripcion`,
      image: `${SITE_URL}/hero-bg-1.webp`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Dades de l'equip i el capità",
      text: "Introdueix el nom de l'equip i les dades del capità: nom complet, email i telèfon de contacte. El capità rebrà tota la comunicació del torneig.",
      url: `${SITE_URL}/inscripcion`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Afegeix els jugadors (3–5)",
      text: "Afegeix de 3 a 5 jugadors: nom, cognoms i any de naixement. El mínim per jugar és 3 jugadors; el màxim 5 (3 titulars + fins a 2 suplents).",
      url: `${SITE_URL}/inscripcion`,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Dades dels jugadors (3–5)",
      text: "Afegeix de 3 a 5 jugadors: nom, cognoms, any de naixement, gènere, club i talla de samarreta. El mínim per jugar és 3 jugadors; el màxim 5 (3 titulars + fins a 2 suplents).",
      url: `${SITE_URL}/inscripcion`,
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Confirmació i enviament",
      text: "Revisa el resum de la inscripció, accepta la política de privadesa i envia. Confirmem la plaça en menys de 24h per WhatsApp i email. Si no has adjuntat el justificant de la transferència, envia'l per WhatsApp quan facis el pagament.",
      url: `${SITE_URL}/inscripcion`,
    },
  ],
};

const categories = [
  { name: "Escoleta", any: "2018–2019", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€", emoji: "⭐" },
  { name: "Premini", any: "2016–2017", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€", emoji: "⭐" },
  { name: "Mini", any: "2014–2015", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€", emoji: "⭐" },
  { name: "Infantil", any: "2012–2013", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€", emoji: "🏀" },
  { name: "Cadet", any: "2010–2011", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€", emoji: "🏀" },
  { name: "Júnior", any: "2008–2009", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€", emoji: "🏀" },
  { name: "Sub-23", any: "2003–2007", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€", emoji: "🏀" },
  { name: "Sènior Masculí", any: "fins 2002", preu: "85–90 €", nota: "4 jug.: 85€ · 5 jug.: 90€", special: true, emoji: "🏆" },
  { name: "Sènior Femení", any: "fins 2002", preu: "85–90 €", nota: "4 jug.: 85€ · 5 jug.: 90€", special: true, emoji: "🏆" },
  { name: "Sènior Amateur Masculí", any: "nascuts fins 1986", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€", emoji: "🎖️" },
  { name: "Sènior Amateur Femení", any: "nascut fins 1986", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€", emoji: "🎖️" },
];

type InscripcionPageProps = {
  searchParams?: Promise<{ ref?: string | string[] }>;
};

function sanitizeRef(raw: string | string[] | undefined): string {
  if (!raw) return "";
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value.replace(/[^a-zA-Z0-9\-]/g, "").slice(0, 40);
}

function formatTeamName(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export default async function InscripcionPage({ searchParams }: InscripcionPageProps) {
  const params = (await searchParams) ?? {};
  const ref = sanitizeRef(params.ref);
  const fromTeam = ref ? formatTeamName(ref) : "";
  const rivalCode = ref ? `RIVAL-${ref.toUpperCase()}` : "";
  return (
    <>
      <Script
        id="ld-howto-inscripcio"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
    <div className="page-shell">
      {/* Nav */}
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">
          ← Inici
        </Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      {/* ── Hero amb foto ── */}
      <div className="insc-hero">
        <img
          src="/hero-bg-1.jpg"
          alt="Públic gaudint del 3×3 Westfield Glòries"
          className="insc-hero-img"
        />
        <div className="insc-hero-overlay" />
        <div className="insc-hero-body">
          <span className="insc-hero-kicker">3a edició · 6-7 Juny 2026 · Clot-Glòries, Barcelona</span>
          <h1 className="insc-hero-title">Inscriu el teu equip</h1>
          <p className="insc-hero-sub">
            El torneig 3×3 FIBA més potent de Barcelona — 11 categories, 3 seus, 2.000€ premi en metàl·lic
          </p>
          <div className="insc-hero-chips">
            <span>🔥 Early Bird −10%</span>
            <span>🏀 Des de 75€</span>
            <span>🏆 FIBA · Premi en Metàl·lic</span>
            <span>📍 3 seus al Clot</span>
          </div>
        </div>
        <a href="#form" className="insc-hero-scroll" aria-label="Anar al formulari d'inscripció">
          <span className="insc-hero-scroll-text">Comença la inscripció</span>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </div>

      {/* ── Contingut principal ── */}
      <main className="page-content" id="form">

        {ref && (
          <div className="rival-banner">
            <span className="rival-banner-tag">Pack rival actiu</span>
            <strong>T&apos;ha desafiat el {fromTeam} 🏀</strong>
            <p>
              Aplicarem <strong>−5 €</strong> a la teva inscripció i <strong>−5 €</strong> a la del{" "}
              {fromTeam}. Cita aquest codi quan ens escriguis:
            </p>
            <div className="rival-banner-code">
              <code>{rivalCode}</code>
            </div>
            <p className="rival-banner-hint">
              Guarda aquest codi i completa el formulari d&apos;inscripció. Si tens dubtes, deixa el teu
              contacte i et respondrem per WhatsApp.
            </p>
          </div>
        )}

        <p className="insc-intro-text">
          5 passos: tria el paquet, registra els contactes, fes la transferència i puja el justificant,
          omple les dades dels jugadors i envia. <strong>El justificant no et bloqueja</strong> — pots
          continuar de seguida i nosaltres validem el pagament en menys de 24h.
        </p>

        {/* ── WhatsApp-style chat wrapper ── */}
        <div className="wa-form-shell">
          <div className="wa-form-header">
            <div className="wa-form-header-avatar">🏀</div>
            <div className="wa-form-header-info">
              <span className="wa-form-header-name">3×3 Westfield Glòries 2026</span>
              <span className="wa-form-header-status">CB Grup Barna · 6-7 juny · Clot, Barcelona</span>
            </div>
          </div>
          <InscripcioWizard initialRefCode={rivalCode} />
        </div>

        {/* insc-wa-hint removed — leads capturats via formulari d'abandó */}

        <hr className="page-divider" />

        {/* ── Prize money amb foto ── */}
        <div className="insc-prize">
          <div className="insc-prize-img-wrap">
            <img
              src="/hero-bg-3.jpg"
              alt="Jugadors competint al 3×3 Westfield Glòries"
              className="insc-prize-img"
            />
            <div className="insc-prize-img-overlay" />
            <span className="insc-prize-fiba">FIBA Official</span>
          </div>
          <div className="insc-prize-body">
            <span className="insc-prize-kicker">Sènior Masculí &amp; Femení</span>
            <p className="insc-prize-amount">2.000€</p>
            <p className="insc-prize-label">Premi en Metàl·lic</p>
            <p className="insc-prize-desc">
              Les categories Sènior M/F opten a <strong>1.000 € cadascuna</strong>. A més, el torneig és
              oficial de FIBA 3×3 — els jugadors sumen punts al rànquing mundial individual per accedir a
              competicions internacionals.
            </p>
            <p className="insc-prize-rest">
              La resta de categories reben <strong>trofeus i medalles</strong>.
            </p>
          </div>
        </div>

        <hr className="page-divider" />

        {/* ── Categories i preus ── */}
        <h2>Categories i preus</h2>
        <p>
          Hi ha <strong>11 categories</strong> per edat i gènere. Tots els equips reben samarreta oficial
          i dorsal.
        </p>

        <div className="insc-cat-grid">
          {categories.map((cat) => (
            <div key={cat.name} className={`insc-cat-card${cat.special ? " insc-cat-card--pro" : ""}`}>
              <span className="insc-cat-emoji">{cat.emoji}</span>
              <span className="insc-cat-name">{cat.name}</span>
              <span className="insc-cat-year">{cat.any}</span>
              <span className="insc-cat-price">{cat.preu}</span>
              <span className="insc-cat-note">{cat.nota}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 14, color: "rgba(255,247,239,0.5)", marginTop: 8 }}>
          Samarreta addicional (acompanyant o recanvi): 25 €/u.
        </p>

        <hr className="page-divider" />

        {/* ── Seus amb foto ── */}
        <div className="insc-venues">
          <div className="insc-venues-text">
            <h2>3 seus · 1 barri</h2>
            <p>
              Tots els recintes estan al barri del Clot-Glòries, a menys de 10 minuts a peu entre ells:
            </p>
            <ul className="insc-venues-list">
              <li>
                <strong>Westfield Glòries</strong>
                <span>Av. Diagonal 208 · Seu principal, pàrquing gratis 2h</span>
              </li>
              <li>
                <strong>La Nau del Clot</strong>
                <span>Carrer de la Llacuna 172 · Pavelló cobert oficial</span>
              </li>
              <li>
                <strong>Rambleta del Clot</strong>
                <span>Pista exterior · ambient de carrer</span>
              </li>
            </ul>
          </div>
          <div className="insc-venues-img-wrap">
            <img
              src="/hero-bg-2.jpg"
              alt="Vista aèria de la pista 3×3 al Clot-Glòries"
              className="insc-venues-img"
            />
          </div>
        </div>

        <hr className="page-divider" />

        <h2>Tens dubtes?</h2>
        <p>
          Consulta les{" "}
          <Link href="/preguntes-frequents" className="insc-link">
            preguntes freqüents
          </Link>
          , les{" "}
          <Link href="/regles-3x3" className="insc-link">
            normes oficials FIBA 3×3
          </Link>
          {" "}o{" "}
          <a href={WA_REGISTER_URL} target="_blank" rel="noreferrer noopener" className="insc-link">
            contacta&apos;ns per WhatsApp
          </a>
          . Resposta en menys de 24h.
        </p>
      </main>
    </div>
    </>
  );
}
