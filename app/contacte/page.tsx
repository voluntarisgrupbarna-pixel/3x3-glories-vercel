import WhatsAppLeadWidget from "../components/WhatsAppLeadWidget";

export default function ContactePage() {
  return (
    <main className="lead-page">
      <div className="lead-page-backdrop" aria-hidden="true" />
      <WhatsAppLeadWidget mode="page" />
    </main>
  );
}
