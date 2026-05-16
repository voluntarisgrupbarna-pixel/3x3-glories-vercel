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

const WEBHOOK_URL     = process.env.APPS_SCRIPT_WEBHOOK_URL ?? "";
const INSCRIPCIO_URL  = process.env.APPSCRIPT_INSCRIPCIO_URL ?? "";
const APPSCRIPT_SECRET = process.env.APPSCRIPT_SECRET ?? "";
const SUPABASE_URL    = process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// ── Escriu al Sheet d'Inscripcions (pestanya "Leads") via Apps Script ─────────
// Aquest és el Sheet centralitzat d'Ana on hi va tot el seguiment de venda.
async function saveLeadToInscripcioSheet(
  payload: Record<string, unknown>,
): Promise<void> {
  if (!INSCRIPCIO_URL) return;

  try {
    // No bloquejant: fire-and-forget amb log si falla
    fetch(INSCRIPCIO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "lead",
        secret: APPSCRIPT_SECRET,
        timestamp: new Date().toISOString(),
        ...payload,
      }),
      redirect: "follow",
    }).catch((err) => console.error("[lead/sheet] Apps Script fetch failed", err));
  } catch (err) {
    console.error("[lead/sheet] error", err);
  }
}

// ── Escriu el lead a Supabase (MailingBarna v4) ──────────────────────────────
// No bloqueja la resposta principal si falla (fire-and-forget amb log d'error).
async function saveLeadToSupabase(
  name: string,
  email: string,
  phone: string,
  origin: string,
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY || !email) return; // Sheets és la font principal dels leads sense email

  const row = {
    nom:             name,
    email:           email,
    telefon:         phone,
    etiquetes:       "3x3",
    consent_whatsapp: true,
    consent_email:   Boolean(email),
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

  // Nom + consent + (email O telèfon) — no cal tenir-los tots dos
  if (!name || (!email && !phone) || !consent) {
    return NextResponse.json({ error: "Falten dades obligatòries (nom, consent, email o telèfon)." }, { status: 400 });
  }

  // ── 0. Sheet centralitzat (pestanya "Leads") — captura sempre, fire-and-forget ─
  saveLeadToInscripcioSheet({
    name,
    email,
    phone,
    interest: (payload.interest ?? "").trim(),
    question: (payload.question ?? "").trim(),
    message:  (payload.message  ?? "").trim(),
    consent,
    origin,
  });

  // ── 1. Apps Script MailingBarna (canal secundari) ─ fire-and-forget ──────
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

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      redirect: "follow",
    }).catch((err) => console.error("[lead/mailingbarna] fetch failed", err));
  }

  // ── 2. Supabase / MailingBarna v4 (dual-write, no bloquejant) ─────────────
  saveLeadToSupabase(name, email, phone, origin).catch(console.error);

  return NextResponse.json({ ok: true });
}
