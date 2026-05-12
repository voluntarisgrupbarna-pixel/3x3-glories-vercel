import type { Metadata } from "next";
import WhatsAppLeadWidget from "../components/WhatsAppLeadWidget";

export const metadata: Metadata = {
  title: "Contacte | 3×3 Westfield Glòries 2026",
  description:
    "Contacta amb l'organització del torneig 3×3 Westfield Glòries de Barcelona. Respon les teves preguntes sobre inscripció, categories, seus i dates per WhatsApp o formulari.",
  alternates: {
    canonical: "/contacte",
  },
  openGraph: {
    title: "Contacte — 3×3 Westfield Glòries 2026",
    description:
      "Contacta amb l'organització del torneig 3×3 de Barcelona. Preguntes sobre inscripció, categories i dates. Resposta en menys de 24h.",
  },
};

export default function ContactePage() {
  return (
    <main className="lead-page">
      <div className="lead-page-backdrop" aria-hidden="true" />
      <WhatsAppLeadWidget mode="page" />
    </main>
  );
}
