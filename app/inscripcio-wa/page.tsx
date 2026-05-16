import type { Metadata } from "next";
import Link from "next/link";
import InscripcioWizard from "../inscripcion/InscripcioWizard";

export const metadata: Metadata = {
  title: "Inscripció ràpida per WhatsApp — 3×3 Westfield Glòries 2026",
  description: "Registra el teu equip en 3 passos. Envia el justificant de pagament per WhatsApp un cop completis el formulari.",
  robots: { index: false, follow: false },
};

export default function InscripcioWaPage() {
  return (
    <div className="page-shell">
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">← Inici</Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      <main className="page-content" style={{ paddingTop: 24 }}>
        <div style={{
          background: "rgba(34,197,94,0.12)",
          border: "1px solid rgba(34,197,94,0.35)",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 24,
        }}>
          <strong style={{ color: "#4ade80" }}>Inscripció via WhatsApp</strong>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "rgba(255,247,239,0.8)" }}>
            Omple el formulari (sense pujada de justificant) i un cop enviat, fes clic al botó verd per enviar-nos la foto del pagament per WhatsApp. Confirmem la plaça en menys de 24h.
          </p>
        </div>

        <InscripcioWizard waFlow={true} />
      </main>
    </div>
  );
}
