/**
 * Email helpers — Brevo (opcional, alternativa a MailApp)
 *
 * Per defecte QR.gs envia el correu amb MailApp.sendEmail (quota gratuïta 100/dia).
 * Si vols enviar des de domini propi (no-reply@cbgrupbarna.info) cal Brevo.
 *
 * --- PROPIETATS NECESSÀRIES (opcionals) ---
 *   BREVO_API_KEY      → clau API de Brevo
 *   BREVO_FROM_EMAIL   → ex: no-reply@cbgrupbarna.info
 *   BREVO_FROM_NAME    → ex: CB Grup Barna · 3×3 Glòries
 */

function sendBrevoEmail(to, toName, subject, htmlBody, attachments) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty("BREVO_API_KEY");
  const fromEmail = props.getProperty("BREVO_FROM_EMAIL");
  const fromName = props.getProperty("BREVO_FROM_NAME") || "CB Grup Barna";

  if (!apiKey || !fromEmail) {
    console.log("Brevo not configured, skipping");
    return null;
  }

  const payload = {
    sender: { email: fromEmail, name: fromName },
    to: [{ email: to, name: toName || "" }],
    subject: subject,
    htmlContent: htmlBody,
  };

  if (attachments && attachments.length) {
    payload.attachment = attachments.map(function (a) {
      return {
        name: a.name,
        content: Utilities.base64Encode(a.bytes),
      };
    });
  }

  const response = UrlFetchApp.fetch("https://api.brevo.com/v3/smtp/email", {
    method: "post",
    contentType: "application/json",
    headers: { "api-key": apiKey, accept: "application/json" },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  if (response.getResponseCode() >= 300) {
    throw new Error("Brevo " + response.getResponseCode() + ": " + response.getContentText());
  }
  return JSON.parse(response.getContentText());
}

/**
 * Email de confirmació immediat (sense QR) quan arriba una inscripció.
 * Es pot cridar des de handleInscripcio() al Code.gs si vols feedback instant.
 */
function sendImmediateConfirmation(payload) {
  const captain = payload.captain;
  if (!captain || !captain.email) return;

  const subject = "3×3 Glòries 2026 · Hem rebut la teva inscripció";
  const body =
    "Hola " +
    captain.fullName +
    "!<br><br>" +
    "Hem rebut la teva inscripció al <strong>3×3 Westfield Glòries 2026</strong>:<br><br>" +
    "• Codi d'equip: <strong>" +
    payload.teamId +
    "</strong><br>" +
    "• Paquet: " +
    payload.packageTitle +
    "<br>" +
    "• Import: " +
    payload.packagePrice +
    " €<br>" +
    (payload.teamName ? "• Equip: " + payload.teamName + "<br>" : "") +
    "• Jugadors: " +
    payload.players.length +
    "<br><br>" +
    "Validem el justificant en menys de 24h i et confirmem la plaça amb els teus QRs (1 per l'equip + 1 per cada jugador).<br><br>" +
    "Si tens dubtes, escriu-nos per WhatsApp al +34 698 425 153.<br><br>" +
    "— CB Grup Barna · Time Chamber · Eix Clot";

  return sendBrevoEmail(captain.email, captain.fullName, subject, body);
}
