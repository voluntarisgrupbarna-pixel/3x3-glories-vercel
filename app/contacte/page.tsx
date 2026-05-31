import type { Metadata } from "next";
import WhatsAppLeadWidget from "../components/WhatsAppLeadWidget";

export const metadata: Metadata = {
  title: "Contacte | 3×3 Westfield Glòries 2026",
  description:
    "Contacta amb l'organització del 3×3 Westfield Glòries. Preguntes sobre inscripció, categories i dates. Resposta per WhatsApp o correu en menys de 24h.",
  alternates: { canonical: "/contacte" },
  openGraph: {
    title: "Contacte — 3×3 Westfield Glòries 2026",
    description:
      "Contacta amb l'organització del torneig 3×3 de Barcelona. Resposta en menys de 24h.",
  },
};

export default function ContactePage() {
  return (
    <main className="lead-page">
      <div className="lead-page-backdrop" aria-hidden="true" />
      <h1 className="sr-only">Contacte — 3×3 Westfield Glòries 2026</h1>

      {/* Contact info cards */}
      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: 520,
        margin: "0 auto",
        padding: "32px 20px 0",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}>
        <h2 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 800, margin: "0 0 4px", textAlign: "center" }}>
          Parla amb nosaltres 🏀
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", textAlign: "center", margin: "0 0 12px" }}>
          Resposta en menys de 24h · Dilluns a divendres 9–20h
        </p>

        {/* WhatsApp */}
        <a
          href="https://wa.me/34698425153"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: 14,
            background: "rgba(37,211,102,0.12)",
            border: "1px solid rgba(37,211,102,0.35)",
            borderRadius: 12, padding: "14px 18px", textDecoration: "none",
          }}
        >
          <span style={{ fontSize: "1.6rem" }}>💬</span>
          <div>
            <div style={{ color: "#25d366", fontWeight: 800, fontSize: "0.95rem" }}>WhatsApp</div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.82rem" }}>+34 698 425 153 · Resposta ràpida</div>
          </div>
        </a>

        {/* Email */}
        <a
          href="mailto:voluntarisgrupbarna@gmail.com?subject=3x3%20Westfield%20Gl%C3%B2ries%202026"
          style={{
            display: "flex", alignItems: "center", gap: 14,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 12, padding: "14px 18px", textDecoration: "none",
          }}
        >
          <span style={{ fontSize: "1.6rem" }}>✉️</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: "0.95rem" }}>Email</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem" }}>voluntarisgrupbarna@gmail.com</div>
          </div>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com/cbgrupbarna"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: 14,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 12, padding: "14px 18px", textDecoration: "none",
          }}
        >
          <span style={{ fontSize: "1.6rem" }}>📸</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: "0.95rem" }}>Instagram</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem" }}>@cbgrupbarna</div>
          </div>
        </a>

        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", textAlign: "center", margin: "8px 0 0" }}>
          O envia&apos;ns un missatge al formulari de sota ↓
        </p>
      </div>

      <WhatsAppLeadWidget mode="page" />
    </main>
  );
}
