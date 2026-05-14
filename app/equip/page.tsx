import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Equip organitzador | 3×3 Westfield Glòries 2026",
  description:
    "CB Grup Barna, Time Chamber i Eix Clot organitzen el 3×3 Westfield Glòries 2026, el torneig de bàsquet 3×3 FIBA de Barcelona. Fundat el 1965 al Districte de Sant Martí.",
  alternates: {
    canonical: "/equip",
  },
  openGraph: {
    title: "Equip organitzador — 3×3 Westfield Glòries 2026",
    description:
      "CB Grup Barna, Time Chamber i Eix Clot. Organitzadors del torneig 3×3 de Barcelona des de 2023.",
  },
};

export default function EquipPage() {
  return (
    <div className="page-shell">
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">
          ← Inici
        </Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      <main className="page-content">
        <span className="page-kicker">Organitzadors</span>
        <h1>L'equip darrere del 3×3 Barcelona</h1>

        <p>
          El <strong>3×3 Westfield Glòries</strong> és una iniciativa conjunta de tres entitats del barri
          del Clot-Glòries de Barcelona: <strong>CB Grup Barna</strong>, <strong>Time Chamber</strong> i{" "}
          <strong>Eix Clot</strong>. La 4a edició del torneig oficial de bàsquet 3×3 FIBA se celebra el 6 i
          7 de juny de 2026.
        </p>

        <div className="page-card-grid" style={{ marginTop: 32 }}>
          <div className="page-card">
            <span className="page-card-label">Club organitzador</span>
            <strong>CB Grup Barna</strong>
            <p>
              Club de bàsquet base del Districte de Sant Martí de Barcelona, fundat el 1965. Més de 60 anys
              promovent el bàsquet al barri del Clot-Glòries.
            </p>
          </div>
          <div className="page-card">
            <span className="page-card-label">Producció esportiva</span>
            <strong>Time Chamber</strong>
            <p>
              Empresa especialitzada en la producció d'esdeveniments de bàsquet 3×3. Responsable de la
              gestió esportiva, el rànquing FIBA i la coordinació de pistes.
            </p>
          </div>
          <div className="page-card">
            <span className="page-card-label">Col·laborador local</span>
            <strong>Eix Clot</strong>
            <p>
              Eix comercial del barri del Clot-Glòries. Col·labora en la promoció del torneig i la
              vinculació amb el comerç i la comunitat local.
            </p>
          </div>
        </div>

        <h2>CB Grup Barna</h2>
        <p>
          El <strong>Club Bàsquet Grup Barna</strong> és el club de bàsquet de base de referència del
          Districte de Sant Martí de Barcelona. Fundat el 1965, el club forma jugadors i jugadores de totes
          les edats al barri del Clot-Glòries, amb seu a La Nau del Clot (Carrer de la Llacuna 172).
        </p>
        <p>
          El CB Grup Barna és l'organitzador principal del 3×3 Westfield Glòries, que ja va per la seva 4a
          edició amb més de 100 equips participants i jugadors de tot Catalunya i la península.
        </p>

        <h2>Historia del torneig</h2>
        <div className="page-card-grid">
          {[
            { any: "2023", ed: "1a edició", nota: "Torneig pilot al barri del Clot" },
            { any: "2024", ed: "2a edició", nota: "Incorporació de punts FIBA" },
            { any: "2025", ed: "3a edició", nota: "3 seus · 2.000 € prize money" },
            { any: "2026", ed: "4a edició", nota: "6-7 juny · Westfield Glòries" },
          ].map((item) => (
            <div key={item.any} className="page-card">
              <span className="page-card-label">{item.any}</span>
              <strong>{item.ed}</strong>
              <p>{item.nota}</p>
            </div>
          ))}
        </div>

        <h2>Contacte</h2>
        <p>
          Per a qualsevol consulta sobre el torneig, pots contactar amb l'equip organitzador a través del
          formulari de contacte o per WhatsApp. Resposta en menys de 24 hores.
        </p>

        <Link href="/contacte" className="page-cta">
          Contacta amb nosaltres →
        </Link>
        <span style={{ display: "inline-block", width: 16 }} />
        <Link href="/inscripcion" className="page-cta-secondary">
          Inscriu l'equip
        </Link>

        <div style={{ marginTop: 48, padding: "28px", border: "1px solid rgba(255,55,95,0.22)", borderRadius: 10, background: "rgba(255,55,95,0.05)" }}>
          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ff375f" }}>
            Repte obert
          </p>
          <strong style={{ display: "block", fontSize: 20, color: "#fff7ef", marginBottom: 8 }}>
            Creus que pots guanyar-nos?
          </strong>
          <p style={{ margin: "0 0 20px", fontSize: 15, color: "rgba(255,247,239,0.7)", lineHeight: 1.6 }}>
            Inscriu el teu equip al 3×3 Westfield Glòries 2026 i demostra-ho a la pista.
          </p>
          <Link href="/inscripcion" className="page-cta" style={{ marginTop: 0 }}>
            Desafia'ns al 3×3 →
          </Link>
        </div>
      </main>
    </div>
  );
}
