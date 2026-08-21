import type { Metadata } from "next";
import Link from "next/link";
import FaqSearch from "../components/FaqSearch";
import { faqs } from "../data/faqs";

// JSON-LD FAQPage — aquí i no al layout: evita warning Search Console "FAQPage fora de context"
// Generat a partir de la mateixa font que la llista visible (../data/faqs) perquè mai es desincronitzin.
const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export const metadata: Metadata = {
  title: "Preguntes freqüents | 3×3 Westfield Glòries",
  description:
    "Totes les respostes sobre el torneig 3×3 Westfield Glòries de Barcelona: com va anar la 3a edició (113 equips rècord), categories, premi en metàl·lic, punts FIBA, seus i quan és la propera edició.",
  alternates: {
    canonical: "/preguntes-frequents",
  },
  openGraph: {
    title: "Preguntes freqüents — 3×3 Barcelona",
    description:
      "Respostes a totes les preguntes sobre el 3×3 Westfield Glòries Barcelona: com va anar la 3a edició, categories, preus de referència, FIBA, seus i la propera edició.",
  },
};


export default function PreguntesFrequentsPage() {
  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">
          ← Inici
        </Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      <main className="page-content">
        {/* ── Recap strip — 3a edició ja celebrada ── */}
        <div className="urgency-strip urgency-strip--top">
          <span className="urgency-strip-icon" aria-hidden="true">🏀</span>
          <span className="urgency-strip-text">
            <strong>3a edició celebrada</strong> · 113 equips rècord
          </span>
          <a
            href="https://cbgrupbarna.info/fotos-3x3/"
            target="_blank"
            rel="noreferrer noopener"
            className="urgency-strip-cta"
          >
            Veure fotos i resultats →
          </a>
        </div>

        <span className="page-kicker">FAQ</span>
        <h1>Preguntes freqüents sobre el 3×3 Barcelona</h1>

        <p>
          Totes les respostes sobre el <strong>3×3 Westfield Glòries 2026</strong>. Utilitza el cercador
          o navega per totes les preguntes. Si no trobes el que busques,{" "}
          <Link href="/contacte" style={{ color: "#ff375f" }}>escriu-nos</Link> i et responem en menys de 24h.
        </p>

        <div style={{ marginTop: 32 }}>
          <FaqSearch page="frequents" />
        </div>

        <div style={{ marginTop: 48 }}>
          <a
            href="https://cbgrupbarna.info/fotos-3x3/"
            target="_blank"
            rel="noreferrer noopener"
            className="page-cta"
          >
            Veure fotos i resultats →
          </a>
          <span style={{ display: "inline-block", width: 16 }} />
          <Link href="/contacte" className="page-cta-secondary">
            Contacta'ns
          </Link>
        </div>
      </main>
    </div>
  );
}
