import type { Metadata } from "next";
import Link from "next/link";
import BuscaElBalloForm from "./BuscaElBalloForm";

export const metadata: Metadata = {
  title: "Busca el Balló Wilson — Sorteig 3×3 Westfield Glòries 2026",
  description:
    "Registra't al sorteig Busca el Balló de CB Grup Barna. Segueix @cbgrupbarna, troba el balló amagat al cartell i comenta WILSON per participar. Sorteig en directe al 3×3 Westfield Glòries, 6 juny 2026.",
  alternates: {
    canonical: "/busca-el-ballo",
  },
  openGraph: {
    title: "Busca el Balló Wilson — Sorteig 3×3 Westfield Glòries 2026",
    description:
      "Troba el balló amagat al cartell, comenta WILSON i guanya entrades al 3×3 Glòries 2026. Registra't aquí.",
  },
};

export default function BuscaElBalloPage() {
  return (
    <div className="page-shell">
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">
          ← Inici
        </Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      <main className="page-content">
        <span className="page-kicker">CB Grup Barna · Sant Martí · Barcelona</span>
        <h1>🔍 Busca el Balló!</h1>
        <p className="beb-hero-sub">3×3 Westfield Glòries · 6 &amp; 7 Juny 2026</p>

        <p>
          Registra&apos;t per participar en el sorteig. Troba el balló al cartell i comenta{" "}
          <strong style={{ color: "#FFD700" }}>WILSON</strong> a Instagram.
          Etiqueta amics per multiplicar les teves opcions.
        </p>

        <BuscaElBalloForm />

        <h2 style={{ marginTop: 40 }}>Com funciona el sorteig</h2>
        <ol
          style={{
            paddingLeft: 20,
            marginBottom: 16,
            color: "rgba(255,247,239,0.78)",
            lineHeight: 1.7,
          }}
        >
          <li style={{ marginBottom: 10 }}>
            <strong>Segueix</strong>{" "}
            <a
              href="https://www.instagram.com/cbgrupbarna"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#FF5A00" }}
            >
              @cbgrupbarna
            </a>{" "}
            a Instagram — és obligatori per participar.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Registra&apos;t</strong> al formulari de dalt amb les teves dades.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Troba el balló</strong> amagat al cartell del torneig i comenta{" "}
            <strong style={{ color: "#FFD700" }}>WILSON</strong> a la publicació d&apos;Instagram.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Etiqueta amics</strong> al comentari — cada amic etiquetat és una
            participació extra (màxim 3 amics = ×3 participació).
          </li>
        </ol>

        <div
          style={{
            background: "rgba(255,90,0,0.1)",
            border: "1px solid rgba(255,90,0,0.3)",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 32,
          }}
        >
          <p style={{ margin: 0, color: "rgba(255,247,239,0.9)", fontSize: 14, lineHeight: 1.6 }}>
            🏆 <strong style={{ color: "#FF5A00" }}>Premi:</strong> Entrades VIP al 3×3 Westfield
            Glòries 2026 i merchandising oficial de CB Grup Barna.
            <br />
            📅 <strong style={{ color: "#FF5A00" }}>Sorteig en directe:</strong> divendres 6 de juny
            a les 20:00 h a la pista del torneig.
          </p>
        </div>

        <div style={{ marginTop: 24 }}>
          <Link href="/inscripcion" className="page-cta">
            Inscriu el teu equip al 3×3 →
          </Link>
          <span style={{ display: "inline-block", width: 16 }} />
          <Link href="/" className="page-cta-secondary">
            Torna a l&apos;inici
          </Link>
        </div>
      </main>

      <style>{`
        .beb-hero-sub {
          font-size: clamp(13px, 3.5vw, 17px);
          color: #FFD700;
          margin-top: -8px;
          margin-bottom: 16px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        /* Steps */
        .beb-steps {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }
        .beb-step {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 14px;
        }
        .beb-step-num {
          background: #FF5A00;
          color: #080B14;
          font-weight: 900;
          font-size: 13px;
          border-radius: 6px;
          min-width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .beb-step-text {
          font-size: 13px;
          color: rgba(255,247,239,0.85);
          line-height: 1.3;
        }
        .beb-step-text strong { color: #FFD700; }

        /* Form */
        .beb-form { width: 100%; }
        .beb-row { display: flex; gap: 12px; }
        .beb-row .beb-field { flex: 1; }
        .beb-field { margin-bottom: 16px; }
        .beb-field label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,247,239,0.6);
          margin-bottom: 6px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .beb-req { color: #FF5A00; margin-left: 2px; }
        .beb-field input[type="text"],
        .beb-field input[type="email"],
        .beb-field input[type="tel"] {
          width: 100%;
          background: rgba(0,0,0,0.3);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 15px;
          color: rgba(255,247,239,0.95);
          outline: none;
          transition: border-color .2s;
          -webkit-appearance: none;
          box-sizing: border-box;
        }
        .beb-field input::placeholder { color: rgba(255,247,239,0.25); }
        .beb-field input:focus { border-color: #FF5A00; }

        .beb-ig-wrap { position: relative; }
        .beb-ig-at {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #FF5A00;
          font-size: 16px;
          font-weight: 700;
          pointer-events: none;
        }
        .beb-ig-wrap input { padding-left: 26px !important; }

        /* Checkboxes */
        .beb-checks {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .beb-check-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          font-size: 13px;
          color: rgba(255,247,239,0.7);
          line-height: 1.4;
        }
        .beb-check-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          min-width: 18px;
          accent-color: #FF5A00;
          cursor: pointer;
          margin-top: 1px;
        }

        /* Error */
        .beb-error {
          background: rgba(224,48,48,0.15);
          color: #E05050;
          border: 1px solid rgba(224,48,48,0.3);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 14px;
          margin-bottom: 14px;
        }

        /* Submit button */
        .beb-submit {
          width: 100%;
          background: #FF5A00;
          color: #080B14;
          border: none;
          border-radius: 10px;
          padding: 15px;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background .15s, transform .1s;
        }
        .beb-submit:hover { background: #FF7A30; }
        .beb-submit:active { transform: scale(.98); }
        .beb-submit:disabled {
          background: rgba(255,90,0,0.3);
          color: rgba(255,247,239,0.3);
          cursor: not-allowed;
        }

        /* Success */
        .beb-success {
          text-align: center;
          padding: 32px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          margin-bottom: 24px;
        }
        .beb-success-icon { font-size: 56px; margin-bottom: 16px; }
        .beb-success-title { font-size: 26px; font-weight: 900; color: #FF5A00; margin-bottom: 8px; }
        .beb-success-sub { font-size: 16px; color: #FFD700; margin-bottom: 12px; }
        .beb-success-desc { font-size: 14px; color: rgba(255,247,239,0.7); line-height: 1.6; margin: 0 0 12px; }
        .beb-wilson {
          display: inline-block;
          background: #FF5A00;
          color: #080B14;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 4px;
          border-radius: 8px;
          padding: 10px 28px;
          margin: 12px 0;
        }

        @media (max-width: 400px) {
          .beb-row { flex-direction: column; gap: 0; }
        }
      `}</style>
    </div>
  );
}
