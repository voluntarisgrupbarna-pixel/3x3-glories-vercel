import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Player = {
  playerId: string;
  fullName: string;
  dorsal: string;
  position: string;
  shirtSize: string;
};

type TeamData = {
  teamId: string;
  teamName: string;
  category: string;
  package: string;
  status: string;
  numPlayers: number;
  players: Player[];
};

export const metadata: Metadata = {
  title: "Check-in equip · 3×3 Westfield Glòries 2026",
  description: "Pàgina de check-in de l'equip al torneig 3×3 Westfield Glòries 2026.",
  robots: { index: false, follow: false }, // privat: només accessible via QR
};

async function fetchTeam(teamId: string): Promise<TeamData | null> {
  const baseUrl = process.env.APPSCRIPT_INSCRIPCIO_URL;
  if (!baseUrl) {
    console.error("APPSCRIPT_INSCRIPCIO_URL not set");
    return null;
  }

  const url = `${baseUrl}?action=team&teamId=${encodeURIComponent(teamId)}`;
  try {
    const res = await fetch(url, { cache: "no-store", redirect: "follow" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ok || !data.team) return null;
    return data.team as TeamData;
  } catch (err) {
    console.error("fetchTeam error", err);
    return null;
  }
}

function statusBadge(status: string): { label: string; cls: string } {
  switch (status) {
    case "confirmed":
      return { label: "Inscripció confirmada ✓", cls: "checkin-status-confirmed" };
    case "pending_payment":
      return { label: "Pagament en validació", cls: "checkin-status-pending" };
    case "cancelled":
      return { label: "Cancel·lada", cls: "checkin-status-cancelled" };
    default:
      return { label: status || "—", cls: "checkin-status-pending" };
  }
}

export default async function CheckInPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const cleanId = teamId.toUpperCase().replace(/[^A-Z0-9\-]/g, "").slice(0, 40);

  const team = await fetchTeam(cleanId);
  if (!team) notFound();

  const status = statusBadge(team.status);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    `https://cbgrupbarna-3x3timechamber.com/check-in/${team.teamId}`,
  )}`;

  return (
    <div className="page-shell">
      <nav className="page-nav">
        <Link href="/" className="page-nav-back">
          ← Inici
        </Link>
        <span className="page-nav-logo">3×3 Glòries 2026</span>
      </nav>

      <main className="checkin-shell">
        <div className="checkin-card">
          <span className="page-kicker">Check-in equip</span>
          <h1 className="checkin-team-name">{team.teamName || team.teamId}</h1>
          <p className="checkin-team-meta">
            <strong>{team.category}</strong> · {team.package} · {team.numPlayers} jugadors
          </p>

          <div className={`checkin-status ${status.cls}`}>{status.label}</div>

          <div className="checkin-id-row">
            <div>
              <span className="checkin-id-label">Codi de l'equip</span>
              <code className="checkin-id">{team.teamId}</code>
            </div>
            <img src={qrUrl} alt={`QR equip ${team.teamId}`} className="checkin-qr" />
          </div>
        </div>

        <section className="checkin-players">
          <h2>Jugadors de l'equip</h2>
          <ol className="checkin-players-list">
            {team.players.map((p) => (
              <li key={p.playerId} className="checkin-player">
                <span className="checkin-player-dorsal">{p.dorsal || "—"}</span>
                <div className="checkin-player-info">
                  <strong>{p.fullName}</strong>
                  <span>
                    {p.position}
                    {p.shirtSize ? ` · talla ${p.shirtSize}` : ""}
                  </span>
                </div>
                <Link
                  href={`/jugador/${p.playerId}`}
                  className="checkin-player-link"
                  aria-label={`Veure fitxa de ${p.fullName}`}
                >
                  →
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <p className="checkin-footer">
          Mostra aquesta pàgina o el QR a l'organització el dia del torneig. Si el pagament encara està en
          validació, et confirmem en menys de 24h.
        </p>

        <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/" className="page-cta-secondary" style={{ marginTop: 0 }}>
            Tornar a l'inici
          </Link>
          <a
            href={`https://wa.me/34698425153?text=${encodeURIComponent(
              `Hola! Tinc dubtes sobre l'equip ${team.teamId} (${team.teamName})`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="page-cta-secondary"
            style={{ marginTop: 0 }}
          >
            WhatsApp organització
          </a>
        </div>
      </main>
    </div>
  );
}
