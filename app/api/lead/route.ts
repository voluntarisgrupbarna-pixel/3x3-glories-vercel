import { NextRequest, NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  question?: string;
  message?: string;
  consent?: boolean;
  origin?: string;
};

const WEBHOOK_URL = process.env.APPS_SCRIPT_WEBHOOK_URL ?? "";

export async function POST(request: NextRequest) {
  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: "Servei no configurat." }, { status: 503 });
  }

  const payload = (await request.json().catch(() => ({}))) as LeadPayload;

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const phone = (payload.phone ?? "").trim();
  const consent = Boolean(payload.consent);

  if (!name || !email || !phone || !consent) {
    return NextResponse.json({ error: "Falten dades obligatòries." }, { status: 400 });
  }

  const body = JSON.stringify({
    action: "whatsapp_lead",
    nom: name,
    telefon: phone,
    email,
    dubte: (payload.question ?? "Vull rebre informació").trim(),
    tipusInteres: (payload.interest ?? "3×3 Westfield Glòries").trim(),
    source: (payload.origin ?? "Web 3x3").trim(),
    event: "3x3 Westfield Glòries 2026",
    acceptaRgpd: true,
  });

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    redirect: "follow",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "No s'ha pogut guardar el contacte." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
