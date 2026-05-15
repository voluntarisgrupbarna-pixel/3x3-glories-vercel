import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STEP_LABELS: Record<number, string> = {
  1: "Descompte",
  2: "Equip",
  3: "Pagament",
  4: "Jugadors",
  5: "Confirma",
};

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    if (!payload.captainEmail && !payload.captainPhone) {
      return NextResponse.json({ ok: false, error: "No contact data" }, { status: 400 });
    }

    // Normalitzem el payload per a Apps Script
    const normalized = {
      action: "abandoned",
      abandonedAt: payload.abandonedAt || new Date().toISOString(),
      reason: payload.reason || "unknown",
      step: payload.step || 0,
      stepLabel: STEP_LABELS[payload.step] || "Desconegut",
      packageKey: payload.packageKey || "",
      packageTitle: payload.packageTitle || "",
      packagePrice: payload.packagePrice || 0,
      teamName: payload.teamName || "",
      category: payload.category || "",
      captainName: payload.captainName || "",
      captainPhone: payload.captainPhone || "",
      captainEmail: payload.captainEmail || "",
      finalPrice: payload.finalPrice || 0,
      proofUploaded: payload.proofUploaded || false,
      earlyBirdApplied: payload.earlyBirdApplied || false,
      socialShareDone: payload.socialShareDone || false,
    };

    // Mateixa URL que inscripcions (Apps Script diferencia per action === "abandoned")
    const scriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
    const scriptSecret = process.env.APPSCRIPT_SECRET;

    if (scriptUrl) {
      // Fire and forget — no bloquejem l'usuari
      fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...normalized, secret: scriptSecret || "" }),
        redirect: "follow",
      }).catch((err) => console.error("[abandoned] Apps Script fetch failed", err));
    } else {
      console.log("[abandoned] PENDING (no APPS_SCRIPT_WEBHOOK_URL):", JSON.stringify(normalized));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[abandoned] handler error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
