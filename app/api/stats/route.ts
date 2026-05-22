import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/stats
 * Retorna el nombre d'equips inscrits i places disponibles.
 * Proxy cap a Apps Script action=stats.
 * El client refresca cada 60s per mostrar urgència real.
 */
export async function GET() {
  const scriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;

  if (!scriptUrl) {
    // Dev / preview sense env var → retornem valors neutres
    return NextResponse.json({ ok: true, teamsCount: 0, maxTeams: 48, spotsLeft: 48 });
  }

  try {
    const res = await fetch(`${scriptUrl}?action=stats`, {
      headers: { Accept: "application/json" },
      // Apps Script pot tardar fins a 5s en fred
      signal: AbortSignal.timeout(8_000),
    });

    if (!res.ok) throw new Error(`Apps Script HTTP ${res.status}`);

    const data = await res.json() as {
      ok: boolean;
      teamsCount?: number;
      maxTeams?: number;
      spotsLeft?: number;
      updatedAt?: string;
    };

    return NextResponse.json(data, {
      headers: {
        // Cache CDN 60s, browser 30s
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (err) {
    console.error("[stats] error:", err);
    // Silenci: el UI mostra el banner però sense números
    return NextResponse.json({ ok: false, teamsCount: 0, maxTeams: 48, spotsLeft: 48 });
  }
}
