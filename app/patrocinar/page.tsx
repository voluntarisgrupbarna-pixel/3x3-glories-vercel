import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { WA_REGISTER_URL } from "../lib/whatsapp";

export const metadata: Metadata = {
  title: "Patrocina el 3×3 Westfield Glòries 2026 | Visibilitat local Barcelona",
  description:
    "Posa la teva marca davant de 800+ jugadors i famílies del Clot-Glòries. 4 paquets de patrocini per a comerços i marques. Resposta en 24h per WhatsApp.",
  alternates: {
    canonical: "/patrocinar",
  },
  openGraph: {
    title: "Patrocina el 3×3 Westfield Glòries 2026 — Visibilitat real al barri",
    description:
      "No patrocines un torneig. Entres en l'esdeveniment urbà de bàsquet de referència del Clot-Glòries: 800+ jugadors, 3 seus, 3a edició FIBA. 4 paquets disponibles.",
  },
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inici", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Patrocina el 3×3 Westfield Glòries",
      item: `${SITE_URL}/patrocinar`,
    },
  ],
};

const CONTACT_LINK = WA_REGISTER_URL;

const PAQUETS = [
  {
    icon: "🏪",
    nom: "Comerç col·laborador",
    aportacio: "Producte, descomptes, menús o sorteig",
    rep: [
      "Logo a la web del torneig",
      "Menció a les stories del torneig",
      "Inclusió al sorteig de premi",
      "Visibilitat local al barri del Clot",
    ],
    per: "Restaurants, tendes, serveis de barri",
    pro: false,
  },
  {
    icon: "🏀",
    nom: "Sponsor de categoria",
    aportacio: "Aportació econòmica o producte de valor",
    rep: [
      "Naming de la teva categoria (ex: «Sènior Masculí by [marca]»)",
      "Post propi a Instagram del torneig",
      "Presència a l'entrega de premis",
      "Logo a la cartelleria de la seu",
    ],
    per: "Clíniques esportives, acadèmies, tendes de material, marques locals",
    pro: false,
  },
  {
    icon: "🏆",
    nom: "Partner principal",
    aportacio: "Aportació econòmica major o activació completa",
    rep: [
      "Logo principal a tota la comunicació",
      "Stand durant els 2 dies del torneig",
      "Nota de premsa conjunta",
      "Presència institucional a l'acte d'obertura",
      "Peça de contingut conjunta (reel / vídeo)",
    ],
    per: "Marques amb estratègia de comunitat, joventut i esport urbà",
    pro: true,
  },
  {
    icon: "💙",
    nom: "Partner impacte social",
    aportacio: "Suport a la categoria Màgics, inclusió, salut o ESG",
    rep: [
      "Visibilitat exclusiva a la categoria inclusiva Màgics",
      "Storytelling social i peça audiovisual pròpia",
      "Associació de marca a valors d'inclusió i esport",
    ],
    per: "Fundacions, entitats socials, empreses amb política ESG, salut",
    pro: false,
  },
];

const STATS = [
  { value: "800+", label: "Jugadors i jugadores" },
  { value: "180+", label: "Equips (2 edicions)" },
  { value: "3", label: "Seus simultànies" },
  { value: "4a", label: "Edició consecutiva" },
];

export default function PatrocinarPage() {
  return (
    <>
      <Script
        id="ld-breadcrumb-patrocinar"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="page-shell">
        {/* Nav */}
        <nav className="page-nav">
          <Link href="/" className="page-nav-back">
            ← Inici
          </Link>
          <span className="page-nav-logo">3×3 Glòries 2026</span>
        </nav>

        {/* Hero */}
        <div className="insc-hero">
          <img
            src="/hero-bg-2.webp"
            alt="Pista del Torneig 3×3 Westfield Glòries al barri del Clot-Glòries de Barcelona"
            className="insc-hero-img"
          />
          <div className="insc-hero-overlay" />
          <div className="insc-hero-body">
            <span className="insc-hero-kicker">
              3a edició · 6-7 Juny 2026 · Clot-Glòries, Barcelona
            </span>
            <h1 className="insc-hero-title">Patrocina el 3×3</h1>
            <p className="insc-hero-sub">
              No patrocines un torneig. Entres en l&apos;ecosistema de bàsquet urbà de referència
              del Clot-Glòries: famílies, jugadors, barri i visibilitat real.
            </p>
            <div className="insc-hero-chips">
              <span>🏀 800+ jugadors i famílies</span>
              <span>📍 3 seus al Clot</span>
              <span>🏆 FIBA oficial</span>
              <span>3a edició consecutiva</span>
            </div>
          </div>
        </div>

        {/* Contingut principal */}
        <main className="page-content">
          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,247,239,0.06)",
                  border: "1px solid rgba(255,247,239,0.12)",
                  borderRadius: "12px",
                  padding: "1.25rem 1rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                    fontWeight: 800,
                    color: "#f97316",
                    lineHeight: 1,
                    marginBottom: "0.4rem",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,247,239,0.6)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "0.5rem" }}>
            El 3×3 Westfield Glòries no és una activitat aïllada. És una plataforma anual de
            comunitat, esport, inclusió i visibilitat de barri. Cada edició creiem en presència,
            marca i impacte real: les famílies i jugadors et veuen, et recorden i et connecten amb
            el club.
          </p>
          <p
            style={{
              fontSize: "0.92rem",
              color: "rgba(255,247,239,0.55)",
              marginBottom: "2.5rem",
            }}
          >
            Organitzat per CB Grup Barna (club amb 60 anys d&apos;història al barri), Time Chamber i
            Eix Clot.
          </p>

          <hr className="page-divider" />

          {/* Paquets */}
          <h2>Paquets de patrocini</h2>
          <p>
            Cada paquet s&apos;adapta a comerços de barri, marques locals i empreses amb estratègia
            de comunitat. Parlem per WhatsApp i fem el que millor t&apos;encaixi.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
              margin: "1.5rem 0 2.5rem",
            }}
          >
            {PAQUETS.map((p) => (
              <div
                key={p.nom}
                style={{
                  background: p.pro
                    ? "linear-gradient(135deg, rgba(249,115,22,0.18) 0%, rgba(249,115,22,0.06) 100%)"
                    : "rgba(255,247,239,0.05)",
                  border: p.pro
                    ? "1.5px solid rgba(249,115,22,0.5)"
                    : "1px solid rgba(255,247,239,0.12)",
                  borderRadius: "14px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  position: "relative",
                }}
              >
                {p.pro && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-11px",
                      left: "1rem",
                      background: "#f97316",
                      color: "#fff",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: "20px",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Màxima visibilitat
                  </span>
                )}
                <div style={{ fontSize: "2rem" }}>{p.icon}</div>
                <div>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "rgba(255,247,239,0.95)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {p.nom}
                  </div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "rgba(255,247,239,0.55)",
                      fontStyle: "italic",
                    }}
                  >
                    Aportació: {p.aportacio}
                  </div>
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 1.1rem", listStyle: "disc" }}>
                  {p.rep.map((r) => (
                    <li
                      key={r}
                      style={{
                        fontSize: "0.84rem",
                        color: "rgba(255,247,239,0.78)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {r}
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    fontSize: "0.77rem",
                    color: "rgba(255,247,239,0.4)",
                    borderTop: "1px solid rgba(255,247,239,0.08)",
                    paddingTop: "0.6rem",
                    marginTop: "auto",
                  }}
                >
                  Per a: {p.per}
                </div>
              </div>
            ))}
          </div>

          {/* CTA principal */}
          <div
            style={{
              background: "rgba(249,115,22,0.12)",
              border: "1.5px solid rgba(249,115,22,0.35)",
              borderRadius: "16px",
              padding: "2rem 1.5rem",
              textAlign: "center",
              margin: "2rem 0",
            }}
          >
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
                color: "rgba(255,247,239,0.95)",
              }}
            >
              Parlem sense compromís
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                color: "rgba(255,247,239,0.65)",
                marginBottom: "1.5rem",
              }}
            >
              Deixa&apos;ns nom i mòbil i t&apos;expliquem per WhatsApp el paquet que millor s&apos;adapta
              al teu comerç o marca. Resposta en menys de 24h.
            </p>
            <a
              href={CONTACT_LINK}
              target="_blank" rel="noreferrer noopener"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#25D366",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "0.85rem 2rem",
                borderRadius: "50px",
                textDecoration: "none",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Vull col·laborar amb el 3×3
            </a>
          </div>

          <hr className="page-divider" />

          {/* Autoritat / per què */}
          <h2>Per què el 3×3 Westfield Glòries?</h2>
          <ul>
            <li>
              <strong>Únic torneig FIBA 3×3 oficial</strong> de la ciutat de Barcelona el 2026.
            </li>
            <li>
              <strong>3a edició consecutiva</strong> (2023–2026): historial demostrat de creixement.
            </li>
            <li>
              <strong>Premi equiparat</strong> Sèniors M i F (1.000€ cadascun): compromís amb la
              igualtat.
            </li>
            <li>
              <strong>3 seus simultànies</strong> al barri: Westfield Glòries, La Nau del Clot i
              Rambleta del Clot.
            </li>
            <li>
              <strong>Format familiar i inclusiu</strong>: des de Premini (8-9 anys) fins a Sènior Amateur
              (+40) i categoria Màgics.
            </li>
            <li>
              <strong>Club amb 60 anys al barri</strong> (CB Grup Barna, 1965–2026): confiança i
              arrelament real.
            </li>
          </ul>

          <hr className="page-divider" />

          <h2>Tens dubtes?</h2>
          <p>
            Consulta les{" "}
            <Link href="/preguntes-frequents" className="insc-link">
              preguntes freqüents
            </Link>{" "}
            o{" "}
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
