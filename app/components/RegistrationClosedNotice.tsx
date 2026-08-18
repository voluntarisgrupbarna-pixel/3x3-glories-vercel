import { WA_REGISTER_URL } from "../lib/whatsapp";

type Props = {
  title?: string;
  body?: string;
};

export default function RegistrationClosedNotice({
  title = "Inscripcions tancades",
  body = "El torneig 3×3 Westfield Glòries 2026 (6-7 juny) ja s'ha celebrat. Gràcies a tots els equips que hi vau participar!",
}: Props) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.05))",
        border: "2px solid rgba(239,68,68,0.4)",
        borderRadius: "16px",
        padding: "2rem",
        textAlign: "center",
        margin: "1.5rem 0",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🔴</div>
      <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.6rem", color: "#fff7ef" }}>{title}</h2>
      <p style={{ margin: "0 0 1rem", color: "rgba(255,247,239,0.7)", fontSize: "1rem" }}>{body}</p>
      <a
        href={WA_REGISTER_URL}
        target="_blank"
        rel="noreferrer noopener"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "#25d366",
          color: "#fff",
          fontWeight: 800,
          fontSize: "1rem",
          padding: "0.85rem 2rem",
          borderRadius: "50px",
          textDecoration: "none",
        }}
      >
        💬 Contacta&apos;ns per WhatsApp
      </a>
    </div>
  );
}
