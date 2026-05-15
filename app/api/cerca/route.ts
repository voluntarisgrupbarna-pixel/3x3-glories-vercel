import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CercaPayload = {
  query: string;
  name?: string | null;
  email?: string | null;
  page?: string;
  timestamp?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CercaPayload;

    if (!body.query || body.query.trim().length < 2) {
      return NextResponse.json({ ok: false, error: "Query too short" }, { status: 400 });
    }

    const forwardPayload = {
      action: "cerca",
      query: body.query.trim().slice(0, 200),
      name: body.name || null,
      email: body.email || null,
      page: body.page || "unknown",
      timestamp: body.timestamp || new Date().toISOString(),
      receivedAt: new Date().toISOString(),
    };

    const scriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;

    if (scriptUrl) {
      try {
        const upstream = await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(forwardPayload),
          redirect: "follow",
        });
        if (!upstream.ok) {
          console.error("[cerca] Apps Script error", upstream.status, await upstream.text());
        }
      } catch (err) {
        console.error("[cerca] Apps Script fetch failed", err);
      }
    } else {
      // Fallback — log to Vercel when no webhook configured
      console.log("[cerca] PENDING (no APPS_SCRIPT_WEBHOOK_URL):", JSON.stringify(forwardPayload));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[cerca] handler error", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
