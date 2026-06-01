import type { Metadata } from "next";
import Link from "next/link";
import FaqSearch from "../components/FaqSearch";

// JSON-LD FAQPage — aquí i no al layout: evita warning Search Console "FAQPage fora de context"
const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Què és el 3×3 Westfield Glòries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "És el torneig oficial de bàsquet 3×3 amb punts FIBA del barri del Clot-Glòries de Barcelona, organitzat per CB Grup Barna, Time Chamber i Eix Clot. La 3a edició es disputa el 6 i 7 de juny de 2026 amb 2.000 € de premi en metàl·lic per a les categories Sènior Masculí i Sènior Femení (1.000 € cadascuna), i trofeus i medalles per a la resta de categories.",
      },
    },
    {
      "@type": "Question",
      name: "Quan i on es juga el torneig 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es disputa el dissabte 6 i el diumenge 7 de juny de 2026 a tres seus del barri del Clot-Glòries de Barcelona: Westfield Glòries (Av. Diagonal 208, seu principal), La Nau del Clot (Carrer de la Llacuna 172, pavelló oficial) i la Rambleta del Clot (pista exterior).",
      },
    },
    {
      "@type": "Question",
      name: "Com m'inscric al 3×3 Westfield Glòries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pel formulari online a www.cbgrupbarna-3x3timechamber.com/inscripcion. El procés té 5 passos: dades de l'equip, capità, jugadors (3-5), samarretes i pagament. La transferència bancària es fa amb un codi QR pre-omplert que escaneges amb l'app del banc. Confirmem la plaça en menys de 24h per email i WhatsApp.",
      },
    },
    {
      "@type": "Question",
      name: "Quant costa la inscripció per equip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entre 75 € i 90 €. 75 € per equip de 3-4 jugadors (categories formatives i Sènior Amateur), 85 € per equip de 3-4 jugadors Sèniors, 90 € per equip de 5 jugadors (qualsevol categoria). Les samarretes addicionals costen 25 €/u. Hi ha un descompte del 10% per compartir el torneig a xarxes socials (Early Bird).",
      },
    },
    {
      "@type": "Question",
      name: "Quantes categories hi ha?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hi ha 10 categories: Premini (2016-17), Mini (2014-15), Infantil (2012-13), Cadet (2010-11), Júnior (2008-09), Sub-23 (2003-07), Sènior Masculí, Sènior Femení, Sènior Amateur Masculí (fins 1986) i Sènior Amateur Femení (fins 1986).",
      },
    },
    {
      "@type": "Question",
      name: "El torneig dóna punts FIBA 3×3?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. És un torneig oficial reconegut per FIBA 3×3. Els jugadors de les categories Sènior Masculí i Sènior Femení obtenen punts pel rànquing mundial individual de FIBA 3×3, que serveixen per accedir a competicions internacionals.",
      },
    },
    {
      "@type": "Question",
      name: "Puc inscriure'm sense equip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. La inscripció individual costa 20 € i es fa a www.cbgrupbarna-3x3timechamber.com/inscripcio-individual. Apuntes les teves dades, talla i posició preferida; el club t'assigna a un equip una setmana abans del torneig. El preu inclou samarreta oficial, dorsal i accés als 2 dies.",
      },
    },
    {
      "@type": "Question",
      name: "Quants jugadors pot tenir un equip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un equip pot tenir entre 3 i 5 jugadors (3 titulars + fins a 2 suplents). El mínim per jugar és 3 jugadors.",
      },
    },
    {
      "@type": "Question",
      name: "Hi ha pàrquing a la zona?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Westfield Glòries ofereix pàrquing gratuït durant 2 hores per als assistents al torneig. A més, es pot arribar fàcilment en metro (L1, estació Glòries) o en bus (línies de la Diagonal).",
      },
    },
    {
      "@type": "Question",
      name: "Com contacto amb l'organització?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pots contactar-nos a través del formulari a www.cbgrupbarna-3x3timechamber.com/contacte o per WhatsApp al +34 698 425 153. Resposta en menys de 24 hores en dies laborables.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Preguntes freqüents | 3×3 Westfield Glòries 2026",
  description:
    "Totes les respostes sobre el torneig 3×3 Westfield Glòries de Barcelona: inscripció, categories, premi en metàl·lic, punts FIBA, seus, dates i format. Edició 2026.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">
          ← Inici
        </Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      <main className="page-content">
        {/* ── Urgency strip — fil de la xarxa (la mosca que llegeix les FAQs ja sap que vol apuntar-se) ── */}
        <div className="urgency-strip urgency-strip--top">
          <span className="urgency-strip-icon" aria-hidden="true">🏀</span>
          <span className="urgency-strip-text">
            <strong>Places limitades · Early Bird −10%</strong> actiu ara
          </span>
          <Link href="/inscripcion" className="urgency-strip-cta">
            Inscriu l'equip →
          </Link>
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
