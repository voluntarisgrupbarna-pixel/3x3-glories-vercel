/**
 * WA.gs — Confirmació WhatsApp via Meta Cloud API
 * 3×3 Westfield Glòries 2026 · CB Grup Barna
 *
 * Script Properties necessàries:
 *   META_PHONE_NUMBER_ID  — ID del número WA Business (Meta Business Manager > WhatsApp > Phone Numbers)
 *   META_ACCESS_TOKEN     — Token permanent de System User (mai un page token — expira als 60 dies)
 *   META_API_VERSION      — (opcional) per defecte "v21.0"
 *   WA_TEMPLATE_LANGUAGE  — (opcional) "ca" o "es", per defecte "ca"
 *
 * IMPORTANT: Mai hardcodejar tokens aquí. Sempre Script Properties.
 */

var WA_TEMPLATE_NAME    = "3x3_inscripcio_confirmacio";
var WA_META_API_VERSION = "v21.0";

/**
 * Punt d'entrada principal — cridat des de handleInscripcio() a Code.gs.
 * Best-effort: si falla, fa console.warn i retorna { ok: false }.
 * MAI llança excepció ni bloca la inscripció.
 *
 * @param {Object} payload  payload complet de la inscripció
 * @param {string} teamId   ID de l'equip (ex: T3X3-2026-ABCDE)
 * @return {Object} { ok, phone?, msgId?, reason?, error? }
 */
function sendWhatsAppConfirmation(payload, teamId) {
  var props         = PropertiesService.getScriptProperties();
  var phoneNumberId = props.getProperty("META_PHONE_NUMBER_ID");
  var accessToken   = props.getProperty("META_ACCESS_TOKEN");

  if (!phoneNumberId || !accessToken) {
    console.log("WA: META credentials not configured, skipping");
    return { ok: false, reason: "no_credentials" };
  }

  var rawPhone = payload.captain && payload.captain.phone;
  if (!rawPhone) {
    console.warn("WA: no captain phone in payload, skipping");
    return { ok: false, reason: "no_phone" };
  }

  var phone = normalizePhone(rawPhone);
  if (!phone) {
    console.warn("WA: invalid phone after normalization: " + rawPhone);
    return { ok: false, reason: "invalid_phone" };
  }

  // Variables de la plantilla: {{1}} nom · {{2}} equip · {{3}} teamId · {{4}} categoria · {{5}} preu
  var captainFirstName = ((payload.captain.fullName || "").split(" ")[0]) || payload.captain.fullName || "";
  var teamName         = payload.teamName || "";
  var category         = payload.category || "";
  var finalPrice       = String(payload.finalPrice || payload.packagePrice || 0);
  var templateParams   = [captainFirstName, teamName, teamId, category, finalPrice];

  var language = props.getProperty("WA_TEMPLATE_LANGUAGE") || "ca";

  try {
    var result = callMetaCloudAPI(phone, phoneNumberId, accessToken, templateParams, language);
    var msgId  = result.messages && result.messages[0] && result.messages[0].id;
    console.log("WA sent OK to " + phone + " · msgId: " + msgId);
    return { ok: true, phone: phone, msgId: msgId };
  } catch (err) {
    console.error("WA send error (non-blocking): " + err);
    return { ok: false, error: String(err) };
  }
}

/**
 * Crida directa a la Meta Cloud API.
 * Llança Error si l'HTTP response no és 2xx.
 */
/**
 * templateNameOverride és opcional — si no s'indica, usa WA_TEMPLATE_NAME per defecte.
 * Permet usar la mateixa funció per a templates de confirmació i recovery.
 */
function callMetaCloudAPI(phone, phoneNumberId, accessToken, templateParams, language, templateNameOverride) {
  var props   = PropertiesService.getScriptProperties();
  var version = props.getProperty("META_API_VERSION") || WA_META_API_VERSION;
  var url     = "https://graph.facebook.com/" + version + "/" + phoneNumberId + "/messages";

  var body = {
    messaging_product: "whatsapp",
    to:   phone,
    type: "template",
    template: {
      name:     templateNameOverride || WA_TEMPLATE_NAME,
      language: { code: language },
      components: [
        {
          type: "body",
          parameters: templateParams.map(function(p) {
            return { type: "text", text: String(p) };
          }),
        },
      ],
    },
  };

  var response = UrlFetchApp.fetch(url, {
    method:             "post",
    contentType:        "application/json",
    headers:            { Authorization: "Bearer " + accessToken },
    payload:            JSON.stringify(body),
    muteHttpExceptions: true,
  });

  var code = response.getResponseCode();
  var text = response.getContentText();

  if (code < 200 || code >= 300) {
    throw new Error("Meta API HTTP " + code + ": " + text);
  }

  return JSON.parse(text);
}

/**
 * Normalitza un telèfon a format E.164 sense "+" (requisit de Meta).
 * Accepta: "+34 666 12 34 56", "0034666123456", "666123456", "34666123456"
 * Retorna "" si el format és invàlid.
 */
function normalizePhone(raw) {
  if (!raw) return "";
  var digits = String(raw).replace(/\D/g, "");

  if (digits.indexOf("0034") === 0) digits = digits.slice(2);
  if (digits.indexOf("34") === 0 && digits.length === 11) return digits;
  if (digits.length === 9) return "34" + digits;
  if (digits.length >= 11 && digits.indexOf("34") === 0) return digits;
  return "";
}

// ===== EINES DE TEST =====

/**
 * Test manual des de l'editor Apps Script.
 * Substitueix el telèfon per un número real teu abans d'executar.
 */
function testSendWhatsApp() {
  var fakePayload = {
    teamId:       "T3X3-2026-TEST01",
    teamName:     "Equip Prova",
    category:     "Sènior Masculí",
    packagePrice: 75,
    finalPrice:   60,
    captain: {
      fullName: "Ana Test",
      phone:    "+34600000000", // CANVIA per un telèfon real teu
      email:    "test@cbgrupbarna.com",
    },
    players: [],
  };
  var result = sendWhatsAppConfirmation(fakePayload, fakePayload.teamId);
  Logger.log(JSON.stringify(result, null, 2));
}

/**
 * Verifica que les Script Properties de Meta estan configurades.
 * No fa cap crida a l'API.
 */
function checkWaConfig() {
  var props  = PropertiesService.getScriptProperties();
  var checks = {
    META_PHONE_NUMBER_ID:  !!props.getProperty("META_PHONE_NUMBER_ID"),
    META_ACCESS_TOKEN:     !!props.getProperty("META_ACCESS_TOKEN"),
    META_API_VERSION:       props.getProperty("META_API_VERSION") || "(default " + WA_META_API_VERSION + ")",
    WA_TEMPLATE_LANGUAGE:   props.getProperty("WA_TEMPLATE_LANGUAGE") || "(default ca)",
  };
  Logger.log(JSON.stringify(checks, null, 2));
  return checks;
}
