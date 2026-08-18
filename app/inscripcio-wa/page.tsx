import type { Metadata } from "next";
import Link from "next/link";
import RegistrationClosedNotice from "../components/RegistrationClosedNotice";

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
        <RegistrationClosedNotice />
      </main>
    </div>
  );
}
