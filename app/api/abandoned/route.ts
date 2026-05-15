import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    if (!payload.captainEmail && !payload.captainPhone) {
      return NextResponse.json({ ok: false, error: "No contact data" }, { status: 400 });
    }

    const scriptUrl = process.env.APPSCRIPT_INSCRIPCIO_URL;
    const scriptSecret = process.env.APPSCRIPT_SECRET;

    if (scriptUrl) {
      // Fire and forget — no bloquejem l'usuari esperant Apps Script
      fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, secret: scriptSecret || "" }),
        redirect: "follow",
      }).catch((err) => console.error("[abandoned] Apps Script fetch failed", err));
    } else {
      console.log("[abandoned] PENDING (no APPSCRIPT_INSCRIPCIO_URL):", JSON.stringify(payload));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[abandoned] handler error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
