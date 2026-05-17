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

// ── Brevo notification to admin ────────────────────────────────────────────

function cleanPhone(raw: string): string {
  return raw.replace(/[\s\-().+]/g, "").replace(/^0034/, "34").replace(/^0/, "34");
}

function buildWaLink(phone: string, name: string, category: string): string {
  const clean = cleanPhone(phone);
  const firstName = name.split(" ")[0] || name;
  const msg = encodeURIComponent(
    `Hola ${firstName}! 👋 Hem vist que estaves inscrivint el teu equip al 3×3 Westfield Glòries 2026 (${category || "categoria pendent"}). Et podem ajudar a completar la inscripció? 🏀`
  );
  return `https://wa.me/${clean}?text=${msg}`;
}

function buildNotifEmail(lead: {
  captainName: string;
  captainPhone: string;
  captainEmail: string;
  teamName: string;
  category: string;
  packageTitle: string;
  finalPrice: number;
  step: number;
  stepLabel: string;
  reason: string;
  abandonedAt: string;
  proofUploaded: boolean;
}): string {
  const waLink = lead.captainPhone ? buildWaLink(lead.captainPhone, lead.captainName, lead.category) : "";
  const emailLink = lead.captainEmail ? `mailto:${lead.captainEmail}` : "";
  const stepPct = Math.round((lead.step / 5) * 100);
  const hora = new Date(lead.abandonedAt).toLocaleString("ca-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" });

  return `<!DOCTYPE html>
<html lang="ca">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:24px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">

  <!-- Header -->
  <tr><td style="background:#1a1a1a;padding:20px 28px;text-align:left">
    <span style="color:#e85d26;font-size:22px;font-weight:700">🏀 3×3 Westfield Glòries 2026</span><br>
    <span style="color:#aaa;font-size:13px">Lead abandonat · ${hora}</span>
  </td></tr>

  <!-- Alert banner -->
  <tr><td style="background:#fff8f0;border-left:4px solid #e85d26;padding:14px 28px">
    <strong style="color:#e85d26;font-size:15px">⚡ Nou lead abandonat al pas "${lead.stepLabel}"</strong>
    <p style="margin:4px 0 0;color:#555;font-size:13px">Ha sortit al ${stepPct}% del procés — contacta ara per recuperar la inscripció.</p>
    <div style="background:#f0f0f0;border-radius:6px;height:8px;margin-top:10px;overflow:hidden">
      <div style="background:#e85d26;width:${stepPct}%;height:8px;border-radius:6px"></div>
    </div>
    <p style="margin:4px 0 0;color:#999;font-size:11px">Pas ${lead.step} de 5</p>
  </td></tr>

  <!-- Lead data -->
  <tr><td style="padding:24px 28px">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden">
      <tr style="background:#f9f9f9"><td colspan="2" style="padding:10px 16px;font-weight:700;font-size:13px;color:#333;border-bottom:1px solid #eee">DADES DEL LEAD</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;color:#888;border-bottom:1px solid #eee;width:140px">Capità / Contact</td><td style="padding:10px 16px;font-size:14px;font-weight:600;color:#222;border-bottom:1px solid #eee">${lead.captainName || "—"}</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;color:#888;border-bottom:1px solid #eee">Telèfon</td><td style="padding:10px 16px;font-size:14px;font-weight:600;color:#222;border-bottom:1px solid #eee">${lead.captainPhone || "—"}</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;color:#888;border-bottom:1px solid #eee">Email</td><td style="padding:10px 16px;font-size:14px;color:#222;border-bottom:1px solid #eee">${lead.captainEmail || "—"}</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;color:#888;border-bottom:1px solid #eee">Equip</td><td style="padding:10px 16px;font-size:14px;color:#222;border-bottom:1px solid #eee">${lead.teamName || "—"}</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;color:#888;border-bottom:1px solid #eee">Categoria</td><td style="padding:10px 16px;font-size:14px;color:#222;border-bottom:1px solid #eee">${lead.category || "—"}</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;color:#888;border-bottom:1px solid #eee">Paquet</td><td style="padding:10px 16px;font-size:14px;color:#222;border-bottom:1px solid #eee">${lead.packageTitle || "—"} ${lead.finalPrice ? `· ${lead.finalPrice} €` : ""}</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;color:#888">Justificant pujat</td><td style="padding:10px 16px;font-size:14px;color:#222">${lead.proofUploaded ? "✅ Sí" : "❌ No"}</td></tr>
    </table>
  </td></tr>

  <!-- CTA buttons -->
  <tr><td style="padding:4px 28px 28px;text-align:center">
    ${waLink ? `<a href="${waLink}" style="display:inline-block;background:#25d366;color:#fff;font-size:16px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;margin:6px">💬 Contactar per WhatsApp</a>` : ""}
    ${emailLink ? `<a href="${emailLink}" style="display:inline-block;background:#f5f5f5;color:#333;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;margin:6px;border:1px solid #ddd">✉️ Enviar email</a>` : ""}
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f9f9f9;padding:14px 28px;border-top:1px solid #eee;text-align:center">
    <span style="color:#999;font-size:11px">CB Grup Barna · 3×3 Westfield Glòries 2026 · Notificació automàtica</span>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

async function notifyAdminBrevo(lead: Parameters<typeof buildNotifEmail>[0]): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const notifEmail = process.env.NOTIF_EMAIL || "voluntarisgrupbarna@gmail.com";

  if (!apiKey) {
    console.log("[abandoned] Brevo notification skipped — BREVO_API_KEY not set");
    return;
  }

  const firstName = lead.captainName.split(" ")[0] || lead.captainName || "lead";
  const subject = `🏀 Lead abandonat — ${firstName || "?"}${lead.category ? " · " + lead.category : ""} · Pas ${lead.step}/5`;

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "inscripcions@cbgrupbarna.com";
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "3×3 Glòries 2026", email: senderEmail },
      to: [{ email: notifEmail, name: "CB Grup Barna" }],
      subject,
      htmlContent: buildNotifEmail(lead),
    }),
  });
}

// ── Handler ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Requereix almenys nom O algun mètode de contacte per guardar el lead
    if (!payload.captainName && !payload.captainEmail && !payload.captainPhone) {
      return NextResponse.json({ ok: false, error: "No contact data" }, { status: 400 });
    }

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

    // Fire and forget — Apps Script (full log to Sheets)
    const scriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
    const scriptSecret = process.env.APPSCRIPT_SECRET;
    if (scriptUrl) {
      fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...normalized, secret: scriptSecret || "" }),
        redirect: "follow",
      }).catch((err) => console.error("[abandoned] Apps Script fetch failed", err));
    }

    // Fire and forget — Brevo email alert to admin with WhatsApp CTA
    notifyAdminBrevo(normalized).catch((err) =>
      console.error("[abandoned] Brevo notify failed", err)
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[abandoned] handler error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
