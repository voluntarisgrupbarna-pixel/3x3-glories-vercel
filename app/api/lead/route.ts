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

const WEBHOOK_URL    = process.env.APPS_SCRIPT_WEBHOOK_URL ?? "";
const SUPABASE_URL   = process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// ── Escriu el lead a Supabase (MailingBarna v4) ──────────────────────────────
// No bloqueja la resposta principal si falla (fire-and-forget amb log d'error).
async function saveLeadToSupabase(
  name: string,
  email: string,
  phone: string,
  origin: string,
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return; // No configurat — silenci

  const row = {
    nom:             name,
    email:           email,
    telefon:         phone,
    etiquetes:       "3x3",
    consent_whatsapp: true,
    consent_email:   true,
    consent_sms:     false,
    consent_source:  `Web 3×3 Westfield Glòries 2026 (${origin || "formulari"})`,
    consent_date:    new Date().toISOString().split("T")[0],
    unsubscribed:    false,
    updated_at:      new Date().toISOString(),
  };

  // Upsert per email: si el contacte ja existeix, actualitza
  const res = await fetch(`${SUPABASE_URL}/rest/v1/contacts?on_conflict=email`, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "apikey":        SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer":        "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("[lead/supabase] Error guardant a Supabase:", res.status, err);
  } else {
    console.log("[lead/supabase] Contacte desat a MailingBarna:", email);
  }
}

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => ({}))) as LeadPayload;

  const name    = (payload.name    ?? "").trim();
  const email   = (payload.email   ?? "").trim();
  const phone   = (payload.phone   ?? "").trim();
  const consent = Boolean(payload.consent);
  const origin  = (payload.origin ?? "Web 3x3").trim();

  if (!name || !email || !phone || !consent) {
    return NextResponse.json({ error: "Falten dades obligatòries." }, { status: 400 });
  }

  // ── 1. Apps Script (canal principal, ja existent) ─────────────────────────
  if (WEBHOOK_URL) {
    const body = JSON.stringify({
      action:       "whatsapp_lead",
      nom:          name,
      telefon:      phone,
      email,
      dubte:        (payload.question ?? "Vull rebre informació").trim(),
      tipusInteres: (payload.interest ?? "3×3 Westfield Glòries").trim(),
      source:       origin,
      event:        "3x3 Westfield Glòries 2026",
      acceptaRgpd:  true,
    });

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      redirect: "follow",
    });

    if (!response.ok) {
      // Si Apps Script falla, intentem igualment Supabase però retornem error
      saveLeadToSupabase(name, email, phone, origin).catch(console.error);
      return NextResponse.json({ error: "No s'ha pogut guardar el contacte." }, { status: 502 });
    }
  }

  // ── 2. Supabase / MailingBarna v4 (dual-write, no bloquejant) ─────────────
  saveLeadToSupabase(name, email, phone, origin).catch(console.error);

  return NextResponse.json({ ok: true });
}
