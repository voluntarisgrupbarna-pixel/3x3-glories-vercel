import type { Metadata } from "next";
import WaRegistreClient from "./WaRegistreClient";

// Formulari intern d'inscripció per WhatsApp — no ha d'aparèixer als resultats de cerca
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function WaRegistrePage() {
  return <WaRegistreClient />;
}
