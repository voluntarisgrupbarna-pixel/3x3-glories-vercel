import type { Metadata } from "next";
import Link from "next/link";
import { faqs } from "../data/faqs";

export const metadata: Metadata = {
  title: "Preguntes freqüents | 3×3 Westfield Glòries 2026",
  description:
    "Totes les respostes sobre el torneig 3×3 Westfield Glòries de Barcelona: inscripció, categories, prize money, punts FIBA, seus, dates i format. Edició 2026.",
  alternates: {
    canonical: "/preguntes-frequents",
  },
  openGraph: {
    title: "Preguntes freqüents — 3×3 Barcelona 2026",
    description:
      "Respostes a totes les preguntes sobre el 3×3 Westfield Glòries Barcelona 2026: inscripció, preus, categories, FIBA, seus i més.",
  },
};


export default function PreguntesFrequentsPage() {
  return (
    <div className="page-shell">
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">
          ← Inici
        </Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      <main className="page-content">
        <span className="page-kicker">FAQ</span>
        <h1>Preguntes freqüents sobre el 3×3 Barcelona</h1>

        <p>
          Totes les respostes sobre el <strong>3×3 Westfield Glòries 2026</strong>. Si no trobes el que
          busques, <Link href="/contacte" style={{ color: "#ff375f" }}>escriu-nos</Link> i et responem en
          menys de 24h.
        </p>

        <div style={{ marginTop: 32 }}>
          {faqs.map((faq) => (
            <div key={faq.q} className="page-faq-item">
              <h2>{faq.q}</h2>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <Link href="/inscripcion" className="page-cta">
            Inscriu l'equip →
          </Link>
          <span style={{ display: "inline-block", width: 16 }} />
          <Link href="/contacte" className="page-cta-secondary">
            Contacta'ns
          </Link>
        </div>
      </main>
    </div>
  );
}
