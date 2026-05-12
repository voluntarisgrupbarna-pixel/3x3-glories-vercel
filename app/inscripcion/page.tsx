import type { Metadata } from "next";
import Link from "next/link";
import ReferralCard from "../components/ReferralCard";

export const metadata: Metadata = {
  title: "Inscripció d'equip | 3×3 Westfield Glòries 2026",
  description:
    "Inscriu el teu equip al 3×3 Westfield Glòries 2026. Torneig FIBA a Barcelona, 6-7 juny. Des de 70 € per equip. Categories Premini, Mini, Infantil, Cadet, Júnior, Sènior i Veterans.",
  alternates: {
    canonical: "/inscripcion",
  },
  openGraph: {
    title: "Inscripció al 3×3 Barcelona — Westfield Glòries 2026",
    description:
      "Apunta el teu equip al torneig 3×3 FIBA de Barcelona. 6-7 juny 2026 al Clot-Glòries. Des de 75 €. 2.000 € prize money Sèniors. Places limitades.",
  },
};

const categories = [
  { name: "Premini", any: "2016–2017", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { name: "Mini", any: "2014–2015", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { name: "Infantil", any: "2012–2013", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { name: "Cadet", any: "2010–2011", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { name: "Júnior", any: "2008–2009", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { name: "Sub-23", any: "2003–2007", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€" },
  { name: "Sènior Masculí", any: "fins 2002", preu: "85–90 €", nota: "4 jug.: 85€ · 5 jug.: 90€ · Punts FIBA · Prize money" },
  { name: "Sènior Femení", any: "fins 2002", preu: "85–90 €", nota: "4 jug.: 85€ · 5 jug.: 90€ · Punts FIBA · Prize money" },
  { name: "Veterans Masculí", any: "nascuts fins 1986", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€ · Trofeus i medalles" },
  { name: "Veterans Femení", any: "nascut fins 1986", preu: "75–90 €", nota: "4 jug.: 75€ · 5 jug.: 90€ · Trofeus i medalles" },
];

export default function InscripcionPage() {
  return (
    <div className="page-shell">
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">
          ← Inici
        </Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      <main className="page-content">
        <span className="page-kicker">Inscripció d'equip</span>
        <h1>Inscriu-te al 3×3 Barcelona 2026</h1>

        <p>
          El <strong>3×3 Westfield Glòries</strong> és el torneig de bàsquet 3×3 FIBA més important de
          Barcelona. La 4a edició se celebra els dies <strong>6 i 7 de juny de 2026</strong> al barri del
          Clot-Glòries. Les places són limitades — inscriu l'equip ara.
        </p>

        <h2>Com funciona la inscripció</h2>
        <p>
          El procés és online i té 5 passos: dades de l'equip, capità, jugadors (3-5), samarretes i
          pagament. La transferència bancària es fa amb un codi QR pre-omplert. Confirmem la plaça en menys
          de 24h per email i WhatsApp.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 40,
            marginTop: 8,
          }}
        >
          <a
            href="https://wa.me/34698425153?text=Hola!+Vull+inscriure+el+meu+equip+al+3x3+Westfield+Gl%C3%B2ries+2026"
            target="_blank"
            rel="noreferrer"
            className="page-cta"
          >
            Inscriu l'equip →
          </a>
          <Link href="/inscripcio-individual" className="page-cta-secondary">
            Vull jugar sense equip
          </Link>
        </div>

        <hr className="page-divider" />

        <h2>Categories i preus</h2>
        <p>
          Hi ha <strong>10 categories</strong> per edat i gènere. El preu depèn del nombre de jugadors i la
          categoria. Tots els equips reben samarreta oficial i dorsal.
        </p>

        <div className="page-card-grid">
          {categories.map((cat) => (
            <div key={cat.name} className="page-card">
              <span className="page-card-label">{cat.name}</span>
              <strong>{cat.preu}</strong>
              <p>
                {cat.any}
                <br />
                {cat.nota}
              </p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 14, color: "rgba(255,247,239,0.5)", marginTop: 8 }}>
          Samarreta addicional (acompanyant o recanvi): 25 €/u.
        </p>

        <ReferralCard />

        <hr className="page-divider" />

        <h2>Prize money i punts FIBA</h2>
        <p>
          Les categories Sènior Masculí i Sènior Femení opten a <strong>1.000 € cadascuna</strong> (2.000 €
          en total). A més, el torneig és oficial de FIBA 3×3, de manera que els jugadors Sèniors sumen
          punts pel rànquing mundial individual de FIBA que serveixen per accedir a competicions
          internacionals. La resta de categories reben trofeus i medalles.
        </p>

        <hr className="page-divider" />

        <h2>Seus del torneig</h2>
        <p>
          El torneig es juga a tres punts del barri del Clot-Glòries, a menys de 10 minuts a peu entre ells:
        </p>
        <ul>
          <li>
            <strong>Westfield Glòries</strong> — Av. Diagonal 208. Seu principal, pàrquing gratis 2h.
          </li>
          <li>
            <strong>La Nau del Clot</strong> — Carrer de la Llacuna 172. Pavelló cobert oficial.
          </li>
          <li>
            <strong>Rambleta del Clot</strong> — Pista exterior amb ambient de carrer.
          </li>
        </ul>

        <hr className="page-divider" />

        <h2>Tens dubtes?</h2>
        <p>
          Consulta les <Link href="/preguntes-frequents" style={{ color: "#ff375f" }}>preguntes freqüents</Link> o{" "}
          <Link href="/contacte" style={{ color: "#ff375f" }}>contacta'ns per WhatsApp</Link>. Resposta en menys de 24h.
        </p>
      </main>
    </div>
  );
}
