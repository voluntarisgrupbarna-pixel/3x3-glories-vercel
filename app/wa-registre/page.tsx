import type { Metadata } from "next";
import RegistrationClosedNotice from "../components/RegistrationClosedNotice";

// Formulari intern d'inscripció per WhatsApp — no ha d'aparèixer als resultats de cerca
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function WaRegistrePage() {
  return (
    <div className="page-shell">
      <main className="page-content" style={{ paddingTop: 24 }}>
        <RegistrationClosedNotice />
      </main>
    </div>
  );
}
