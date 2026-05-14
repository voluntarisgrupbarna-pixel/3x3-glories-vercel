import type { Metadata } from "next";
import Link from "next/link";
import ReferralCard from "../components/ReferralCard";
import InscripcioWizard from "./InscripcioWizard";

export const metadata: Metadata = {
  title: "Inscripció d'equip | 3×3 Westfield Glòries 2026",
  description:
    "Inscriu el teu equip al 3×3 Westfield Glòries 2026. Torneig FIBA a Barcelona, 6-7 juny. Des de 75 € per equip. Categories Premini, Mini, Infantil, Cadet, Júnior, Sènior i Veterans.",
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

  const waBaseMsg = ref
    ? `Hola! Vull inscriure el meu equip al 3x3 Westfield Glòries 2026. Vinc de part de ${fromTeam}. CODI: ${rivalCode} (pack rival -5€ a cada equip).`
    : `Hola! Vull inscriure el meu equip al 3x3 Westfield Glòries 2026`;
  const waLink = `https://wa.me/34698425153?text=${encodeURIComponent(waBaseMsg)}`;

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

        {ref && (
          <div className="rival-banner">
            <span className="rival-banner-tag">Pack rival actiu</span>
            <strong>T'ha desafiat el {fromTeam} 🏀</strong>
            <p>
              Aplicarem <strong>−5 €</strong> a la teva inscripció i <strong>−5 €</strong> a la del{" "}
              {fromTeam}. Cita aquest codi quan ens escriguis:
            </p>
            <div className="rival-banner-code">
              <code>{rivalCode}</code>
            </div>
            <p className="rival-banner-hint">
              El botó "Inscriu l'equip" ja porta el codi al missatge de WhatsApp — només cal que cliquis i
              enviïs.
            </p>
          </div>
        )}

        <p>
          El <strong>3×3 Westfield Glòries</strong> és el torneig de bàsquet 3×3 FIBA més important de
          Barcelona. La 4a edició se celebra els dies <strong>6 i 7 de juny de 2026</strong> al barri del
          Clot-Glòries. Les places són limitades — inscriu l'equip ara.
        </p>

        <h2>Inscripció online</h2>
        <p>
          5 passos: tria el paquet, registra els contactes, fes la transferència i puja el justificant,
          omple les dades dels jugadors i envia. <strong>El justificant no et bloqueja</strong> — pots
          continuar de seguida i nosaltres validem el pagament en menys de 24h.
        </p>

        <InscripcioWizard initialRefCode={rivalCode} />

        <p style={{ fontSize: 14, color: "rgba(255,247,239,0.55)", marginTop: 8 }}>
          Prefereixes parlar per WhatsApp?{" "}
          <a href={waLink} target="_blank" rel="noreferrer" style={{ color: "#ff375f" }}>
            Inscripció via WhatsApp
          </a>{" "}
          (et responem en menys de 24h).
        </p>

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
