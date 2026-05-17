import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { WA_REGISTER_URL } from "../lib/whatsapp";

export const metadata: Metadata = {
  title: "3×3 Sènior FIBA Barcelona 2026 | 1.000€ premi + punts rànquing mundial",
  description:
    "Competeix al torneig 3×3 Sènior FIBA de Barcelona. 1.000€ de premi en metàl·lic per Sèniors Masculí i Femení + punts FIBA rànquing mundial. 6 de juny 2026 al Westfield Glòries.",
  alternates: { canonical: "/torneo-3x3-senior-fiba-barcelona" },
  openGraph: {
    title: "3×3 Sènior FIBA Barcelona 2026 — 1.000€ premis + ranking mundial",
    description:
      "L'única competició 3×3 FIBA oficial de Barcelona el 2026. Sèniors M i F: 1.000€ cadascuna + punts pel rànquing mundial FIBA. Dissabte 6 de juny, Finals a Westfield Glòries.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inici", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "3×3 Sènior FIBA Barcelona 2026", item: `${SITE_URL}/torneo-3x3-senior-fiba-barcelona` },
  ],
};

const CONTACT_LINK = WA_REGISTER_URL;

export default function SeniorFibaPage() {
  return (
    <>
      <Script
        id="ld-breadcrumb-senior"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="page-shell">
        <nav className="page-nav">
          <Link href="/" className="page-nav-back">← Inici</Link>
          <span className="page-nav-logo">3×3 Glòries 2026</span>
        </nav>

        <div className="insc-hero">
          <Image src="/hero-bg-3.webp" fill priority sizes="100vw"
            alt="Jugadors Sènior competint al Torneig 3×3 FIBA Barcelona 2026 a Westfield Glòries"
            className="insc-hero-img" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
          <div className="insc-hero-overlay" />
          <div className="insc-hero-body">
            <span className="insc-hero-kicker">Dissabte 6 de Juny 2026 · Westfield Glòries, Barcelona</span>
            <h1 className="insc-hero-title">3×3 Sènior FIBA Barcelona</h1>
            <p className="insc-hero-sub">
              L&apos;única competició 3×3 oficial FIBA de la ciutat — 1.000€ de premi en metàl·lic
              per a Sèniors Masculí i Femení + punts pel rànquing mundial individual FIBA 3×3.
            </p>
            <div className="insc-hero-chips">
              <span>🔴 FIBA Oficial</span>
              <span>💰 1.000€ Sèniors M · 1.000€ Sèniors F</span>
              <span>🌍 Punts rànquing mundial</span>
            </div>
          </div>
        </div>

        <main className="page-content">

          <div className="insc-prize">
            <div className="insc-prize-img-wrap">
              <Image src="/hero-bg-1.webp" fill sizes="(max-width: 768px) 100vw, 50vw"
                alt="Finals Sènior al Westfield Glòries Barcelona" className="insc-prize-img" style={{ objectFit: "cover" }} />
              <div className="insc-prize-img-overlay" />
              <span className="insc-prize-fiba">FIBA Official</span>
            </div>
            <div className="insc-prize-body">
              <span className="insc-prize-kicker">Sènior Masculí &amp; Sènior Femení</span>
              <p className="insc-prize-amount">2.000€</p>
              <p className="insc-prize-label">Prize money total</p>
              <p className="insc-prize-desc">
                <strong>1.000€ per a Sèniors Masculí</strong> i <strong>1.000€ per a Sèniors Femení</strong> — premi equiparat, compromís amb la igualtat de gènere en l&apos;esport.
              </p>
              <p className="insc-prize-rest">
                A més, els jugadors sumen <strong>punts FIBA 3×3</strong> per al rànquing mundial individual, que serveix per accedir a competicions internacionals oficials.
              </p>
            </div>
          </div>

          <hr className="page-divider" />

          <h2>Com funciona la categoria Sènior</h2>
          <ul>
            <li><strong>Categoria Sènior Masculí</strong>: jugadors nascuts fins al 2002 (qualsevol edat).</li>
            <li><strong>Categoria Sènior Femení</strong>: jugadores nascudes fins al 2002 (qualsevol edat).</li>
            <li>Format oficial FIBA 3×3: fases de grups + eliminatòria directa.</li>
            <li>Finals a la pista principal de <strong>Westfield Glòries</strong> (Av. Diagonal 208).</li>
            <li>Semifinals a La Nau del Clot (pavelló cobert oficial).</li>
            <li>Horari: <strong>dissabte 6 de juny, 09:00–18:00h</strong>.</li>
          </ul>

          <hr className="page-divider" />

          <h2>Inscripció equip Sènior</h2>
          <div className="insc-cat-grid">
            <div className="insc-cat-card insc-cat-card--pro">
              <span className="insc-cat-emoji">🏆</span>
              <span className="insc-cat-name">Sènior Masculí</span>
              <span className="insc-cat-year">Nascuts fins 2002</span>
              <span className="insc-cat-price">85–90 €</span>
              <span className="insc-cat-note">4 jug.: 85€ · 5 jug.: 90€</span>
            </div>
            <div className="insc-cat-card insc-cat-card--pro">
              <span className="insc-cat-emoji">🏆</span>
              <span className="insc-cat-name">Sènior Femení</span>
              <span className="insc-cat-year">Nascudes fins 2002</span>
              <span className="insc-cat-price">85–90 €</span>
              <span className="insc-cat-note">4 jug.: 85€ · 5 jug.: 90€</span>
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,247,239,0.5)", marginTop: 8 }}>
            Cada equip inclou samarreta oficial i dorsal. Samarreta addicional (recanvi): 25€/u.
          </p>

          <div style={{ textAlign: "center", padding: "1.5rem 0 2rem" }}>
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
              🏀 Inscriu el teu equip Sènior
            </a>
            <br />
            <a href={CONTACT_LINK} target="_blank" rel="noreferrer noopener" style={{ fontSize: "0.9rem", color: "rgba(255,247,239,0.6)", textDecoration: "underline" }}>
              Pregunta per WhatsApp →
            </a>
          </div>

          <hr className="page-divider" />

          <h2>Per què és el millor 3×3 Sènior de Barcelona?</h2>
          <ul>
            <li>Únic torneig 3×3 amb <strong>punts FIBA oficials</strong> a Barcelona el 2026.</li>
            <li>3a edició consecutiva (2023–2026) — historial de creixement i continuïtat.</li>
            <li>Finals a la pista del <strong>Westfield Glòries</strong> — ambient i visibilitat únics.</li>
            <li>Arbitratge oficial seguint les regles FIBA 3×3.</li>
            <li>Premi equiparat M/F — <strong>1.000€ cadascun</strong>.</li>
          </ul>

          <hr className="page-divider" />

          <h2>Tens dubtes?</h2>
          <p>
            Consulta les{" "}
            <Link href="/preguntes-frequents" className="insc-link">preguntes freqüents</Link>{" "}
            o{" "}
            <a href={WA_REGISTER_URL} target="_blank" rel="noreferrer noopener" className="insc-link">contacta&apos;ns per WhatsApp</a>.
            Resposta en menys de 24h.
          </p>
        </main>
      </div>
    </>
  );
}
