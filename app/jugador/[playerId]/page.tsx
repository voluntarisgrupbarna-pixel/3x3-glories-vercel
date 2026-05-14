import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PlayerData = {
  playerId: string;
  teamId: string;
  teamName: string;
  category: string;
  status: string;
  fullName: string;
  gender: string;
  position: string;
  level: string;
  shirtSize: string;
  dorsal: string;
  federated: boolean;
  imageRights: boolean;
};

export const metadata: Metadata = {
  title: "Fitxa jugador · 3×3 Westfield Glòries 2026",
  description: "Fitxa del jugador al torneig 3×3 Westfield Glòries 2026.",
  robots: { index: false, follow: false },
};

async function fetchPlayer(playerId: string): Promise<PlayerData | null> {
  const baseUrl = process.env.APPSCRIPT_INSCRIPCIO_URL;
  if (!baseUrl) return null;

  const url = `${baseUrl}?action=player&playerId=${encodeURIComponent(playerId)}`;
  try {
    const res = await fetch(url, { cache: "no-store", redirect: "follow" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ok || !data.player) return null;
    return data.player as PlayerData;
  } catch (err) {
    console.error("fetchPlayer error", err);
    return null;
  }
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const cleanId = playerId.toUpperCase().replace(/[^A-Z0-9\-]/g, "").slice(0, 40);
  const player = await fetchPlayer(cleanId);
  if (!player) notFound();

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    `https://cbgrupbarna-3x3timechamber.com/jugador/${player.playerId}`,
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
          <span className="page-kicker">Fitxa jugador</span>
          <h1 className="checkin-team-name">{player.fullName}</h1>
          <p className="checkin-team-meta">
            <strong>{player.position}</strong> · talla {player.shirtSize} · dorsal{" "}
            {player.dorsal || "—"}
          </p>

          <div className="checkin-id-row">
            <div>
              <span className="checkin-id-label">Codi de jugador</span>
              <code className="checkin-id">{player.playerId}</code>
            </div>
            <img src={qrUrl} alt={`QR jugador ${player.playerId}`} className="checkin-qr" />
          </div>
        </div>

        <section className="checkin-players">
          <h2>Detalls esportius</h2>
          <ul className="checkin-detail-list">
            <li>
              <span>Equip</span>
              <Link href={`/check-in/${player.teamId}`}>
                <strong>{player.teamName || player.teamId}</strong>
              </Link>
            </li>
            <li>
              <span>Categoria</span>
              <strong>{player.category}</strong>
            </li>
            <li>
              <span>Gènere</span>
              <strong>{player.gender}</strong>
            </li>
            <li>
              <span>Posició</span>
              <strong>{player.position}</strong>
            </li>
            <li>
              <span>Nivell</span>
              <strong>{player.level}</strong>
            </li>
            <li>
              <span>Talla samarreta</span>
              <strong>{player.shirtSize}</strong>
            </li>
            <li>
              <span>Dorsal</span>
              <strong>{player.dorsal || "—"}</strong>
            </li>
            <li>
              <span>Federat</span>
              <strong>{player.federated ? "Sí" : "No"}</strong>
            </li>
            <li>
              <span>Drets imatge</span>
              <strong>{player.imageRights ? "Autoritzats ✓" : "No autoritzats ✗"}</strong>
            </li>
          </ul>
        </section>

        <p className="checkin-footer">
          Mostra aquesta pàgina a l'organització per al check-in del dia del torneig.
        </p>

        <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href={`/check-in/${player.teamId}`}
            className="page-cta-secondary"
            style={{ marginTop: 0 }}
          >
            Veure l'equip sencer
          </Link>
        </div>
      </main>
    </div>
  );
}
