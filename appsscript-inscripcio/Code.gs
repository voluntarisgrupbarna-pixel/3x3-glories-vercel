/**
 * Apps Script Web App — 3×3 Westfield Glòries 2026 · Inscripcions
 *
 * Rep POST des de /api/inscripcio de Next.js (www.cbgrupbarna-3x3timechamber.com),
 * desa al Google Sheet, puja el justificant a Drive i (opcional) envia a JotForm.
 *
 * --- PROPIETATS NECESSÀRIES ---
 * Posa-les a Project Settings > Script Properties (o crida setupProperties() un cop):
 *   SHEET_ID            → ID del Google Sheet "Inscripcions 3x3 2026"
 *   DRIVE_FOLDER_ID     → ID de la carpeta Drive on van els justificants
 *   APPSCRIPT_SECRET    → string aleatori; ha de coincidir amb la env var de Vercel
 *   JOTFORM_API_KEY     → (opcional) clau API JotForm
 *   JOTFORM_FORM_ID     → (opcional) ID del formulari JotForm
 */

// ===== ENTRY POINT =====

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "No body" });
    }
    const payload = JSON.parse(e.postData.contents);

    if (payload.action === "cerca") {
      const result = guardarCerca(payload);
      return jsonResponse(result);
    }

    if (payload.action === "abandoned") {
      const result = handleAbandoned(payload);
      return jsonResponse(result);
    }

    if (payload.action === "lead") {
      const result = handleLead(payload);
      return jsonResponse(result);
    }

    const result = handleInscripcio(payload);
    return jsonResponse(result);
  } catch (err) {
    console.error("doPost error", err);
    return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || "";

    if (action === "team") {
      const teamId = sanitizeId(e.parameter.teamId);
      if (!teamId) return jsonResponse({ ok: false, error: "Missing teamId" });
      const data = getTeamPublic(teamId);
      if (!data) return jsonResponse({ ok: false, error: "Not found" });
      return jsonResponse({ ok: true, team: data });
    }

    if (action === "player") {
      const playerId = sanitizeId(e.parameter.playerId);
      if (!playerId) return jsonResponse({ ok: false, error: "Missing playerId" });
      const data = getPlayerPublic(playerId);
      if (!data) return jsonResponse({ ok: false, error: "Not found" });
      return jsonResponse({ ok: true, player: data });
    }

    // Health check
    return jsonResponse({
      ok: true,
      service: "3x3 Inscripcions 2026",
      time: new Date().toISOString(),
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function sanitizeId(raw) {
  if (!raw) return "";
  return String(raw).replace(/[^A-Z0-9\-]/gi, "").slice(0, 40).toUpperCase();
}

// Public team data — only check-in relevant fields, no contacts/DNI
function getTeamPublic(teamId) {
  const sheetId = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!sheetId) throw new Error("SHEET_ID not configured");
  const ss = SpreadsheetApp.openById(sheetId);
  const team = findTeamRow(ss, teamId);
  if (!team) return null;

  const players = findPlayersForTeam(ss, teamId).map(function (p) {
    return {
      playerId: p.PlayerID,
      fullName: p["Full Name"],
      dorsal: p.Dorsal || "",
      position: p.Position || "",
      shirtSize: p["Shirt Size"] || "",
    };
  });

  return {
    teamId: team.TeamID,
    teamName: team["Team Name"] || "",
    category: team.Category || "",
    package: team.Package || "",
    status: team.Status || "",
    numPlayers: players.length,
    players: players,
  };
}

// Public player data — for player QR scan day-of
function getPlayerPublic(playerId) {
  const sheetId = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!sheetId) throw new Error("SHEET_ID not configured");
  const ss = SpreadsheetApp.openById(sheetId);

  const playerSheet = ss.getSheetByName("Jugadors");
  if (!playerSheet) return null;
  const data = playerSheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf("PlayerID");
  if (idCol === -1) return null;

  for (let r = 1; r < data.length; r++) {
    if (data[r][idCol] === playerId) {
      const obj = {};
      headers.forEach(function (h, c) {
        obj[h] = data[r][c];
      });

      // Look up the team for context
      const team = findTeamRow(ss, obj.TeamID);

      return {
        playerId: obj.PlayerID,
        teamId: obj.TeamID,
        teamName: team ? team["Team Name"] || "" : "",
        category: team ? team.Category || "" : "",
        status: team ? team.Status || "" : "",
        fullName: obj["Full Name"],
        gender: obj.Gender || "",
        position: obj.Position || "",
        level: obj.Level || "",
        shirtSize: obj["Shirt Size"] || "",
        dorsal: obj.Dorsal || "",
        federated: obj.Federated === true || obj.Federated === "TRUE",
        imageRights: obj["Image Rights"] === true || obj["Image Rights"] === "TRUE",
      };
    }
  }
  return null;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

// ===== CORE LOGIC =====

function handleInscripcio(payload) {
  validatePayload(payload);
  verifySecret(payload);

  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty("SHEET_ID");
  const folderId = props.getProperty("DRIVE_FOLDER_ID");
  if (!sheetId) throw new Error("SHEET_ID not configured");
  if (!folderId) throw new Error("DRIVE_FOLDER_ID not configured");

  // 1. Justificant a Drive
  const proofUrl = (payload.proof && payload.proof.base64)
    ? saveProofFile(payload, folderId)
    : "";

  // 2. Sheet (equip + jugadors)
  const teamSheetRowNum = writeTeamToSheet(payload, proofUrl, sheetId);
  writePlayersToSheet(payload, sheetId);

  // 3. JotForm (best effort)
  let jotformId = null;
  try {
    jotformId = sendToJotForm(payload);
    if (jotformId && teamSheetRowNum) {
      updateJotformIdInSheet(sheetId, teamSheetRowNum, jotformId);
    }
  } catch (err) {
    console.warn("JotForm sync error: " + err);
  }

  // 4. Emails (best effort — no bloqueja la inscripció si fallen)
  try {
    sendEmails(payload, proofUrl, sheetId);
  } catch (err) {
    console.warn("Email send error: " + err);
  }

  // 5. WhatsApp al capità (best effort — mai bloca la inscripció)
  try {
    sendWhatsAppConfirmation(payload, payload.teamId);
  } catch (err) {
    console.warn("WhatsApp send error: " + err);
  }

  // 6. Marca els abandonaments previs d'aquest capità com a "Inscrit"
  markAbandonedAsInscrit(payload, sheetId);

  return { ok: true, teamId: payload.teamId, proofUrl: proofUrl, jotformId: jotformId };
}

function validatePayload(p) {
  if (!p) throw new Error("Empty payload");
  if (!p.teamId) throw new Error("Missing teamId");
  if (!p.captain || !p.captain.fullName) throw new Error("Missing captain");
  if (!Array.isArray(p.players) || p.players.length === 0) throw new Error("Missing players");
  // proof.base64 és OPCIONAL — l'usuari pot enviar-lo per WA
}

function verifySecret(payload) {
  const expected = PropertiesService.getScriptProperties().getProperty("APPSCRIPT_SECRET");
  if (!expected) {
    console.warn("APPSCRIPT_SECRET not set — accepting all requests (unsafe)");
    return;
  }
  if (payload.secret !== expected) {
    throw new Error("Unauthorized: bad secret");
  }
}

// ===== DRIVE =====

function saveProofFile(payload, folderId) {
  const decoded = Utilities.base64Decode(payload.proof.base64);
  const mime = payload.proof.mime || "application/octet-stream";
  const safeName = (payload.proof.fileName || "justificant").replace(/[^A-Za-z0-9._-]/g, "_");
  const fileName = payload.teamId + "_" + safeName;
  const blob = Utilities.newBlob(decoded, mime, fileName);

  const folder = DriveApp.getFolderById(folderId);
  const file = folder.createFile(blob);
  // Visible amb link per a tu (sense haver de canviar permisos manualment)
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) {
    console.warn("Could not set file sharing: " + err);
  }
  return file.getUrl();
}

// ===== SHEETS =====

const TEAM_HEADERS = [
  "Timestamp",        // A — data d'inscripció
  "TeamID",           // B — T3X3-2026-XXXXX
  "Status",           // C — pending_payment / confirmed / cancelled
  "Package",          // D — Equip 4 jugadors / Equip 5 jugadors / Sènior Pro / Individual
  "Category",         // E — Premini Masculí, Cadet Femení, Sènior Masculí…
  "Team Name",        // F — nom de l'equip
  "Preu Base (€)",    // G — preu sense descomptes
  "Descompte (€)",    // H — total descompte aplicat
  "Preu Final (€)",   // I — el que han de pagar
  "Tipus Descompte",  // J — earlybird / social / rival / earlybird+social…
  "Early Bird",       // K — Sí / No
  "Social Share",     // L — Sí / No (han compartit WA + IG)
  "Codi Rival",       // M — RIVAL-XXXXXX o buit
  "Captain Name",     // N
  "Captain Phone",    // O
  "Captain Email",    // P
  "Captain Shirt",    // Q — talla samarreta capità
  "Has Tutor",        // R — TRUE si categoria formativa (menor)
  "Tutor Name",       // S — adult responsable (si menor)
  "Tutor Phone",      // T
  "Tutor Email",      // U
  "Num Players",      // V
  "RGPD Consent",     // W
  "Image Rights",     // X
  "Proof File",       // Y — nom del fitxer justificant (buit si no s'ha pujat)
  "Proof URL",        // Z — URL Drive (buit si no hi ha justificant)
  "JotForm ID",       // AA
  "QRs Sent",         // AB
  "Notes",            // AC
];

const PLAYER_HEADERS = [
  "Timestamp",     // A
  "PlayerID",      // B — T3X3-2026-XXXXX-J01
  "TeamID",        // C
  "Full Name",     // D — nom i cognoms
  "Club",          // E — club d'origen (opcional)
  "Category",      // F — categoria individual del jugador
  "Birth Year",    // G — any de naixement (4 dígits)
  "Gender",        // H — Masculí / Femení / Altre
  "Phone",         // I — telèfon del jugador
  "Email",         // J — email (opcional per a menors)
  "Shirt Size",    // K — talla samarreta (opcional)
  "Image Rights",  // L — TRUE / FALSE
];

function ensureSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet
      .getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#1a1a1a")
      .setFontColor("#ff375f");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

function writeTeamToSheet(payload, proofUrl, sheetId) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ensureSheet(ss, "Inscripcions", TEAM_HEADERS);

  const row = [
    new Date(payload.submittedAt || new Date()),              // Timestamp
    payload.teamId,                                            // TeamID
    "pending_payment",                                         // Status
    payload.packageTitle || payload.packageKey || "",          // Package
    payload.category || "",                                    // Category
    payload.teamName || "",                                    // Team Name
    payload.packagePrice || 0,                                 // Preu Base (€)
    payload.discountAmount || 0,                               // Descompte (€)
    payload.finalPrice || payload.packagePrice || 0,           // Preu Final (€)
    payload.discountType || "",                                // Tipus Descompte
    payload.earlyBirdApplied ? "Sí" : "No",                   // Early Bird
    payload.socialShareDone  ? "Sí" : "No",                   // Social Share
    payload.refCode || payload.rivalCode || "",                // Codi Rival
    payload.captain.fullName || "",                            // Captain Name
    payload.captain.phone    || "",                            // Captain Phone
    payload.captain.email    || "",                            // Captain Email
    payload.captain.shirtSize || "",                           // Captain Shirt
    !!payload.tutor,                                           // Has Tutor
    payload.tutor ? payload.tutor.fullName || "" : "",         // Tutor Name
    payload.tutor ? payload.tutor.phone    || "" : "",         // Tutor Phone
    payload.tutor ? payload.tutor.email    || "" : "",         // Tutor Email
    payload.players.length,                                    // Num Players
    !!payload.rgpdConsent,                                     // RGPD Consent
    !!payload.imageRightsConsent,                              // Image Rights
    (payload.proof && payload.proof.fileName) || "",           // Proof File
    proofUrl,                                                  // Proof URL
    "",                                                        // JotForm ID
    false,                                                     // QRs Sent
    "",                                                        // Notes
  ];

  sheet.appendRow(row);
  return sheet.getLastRow();
}

function writePlayersToSheet(payload, sheetId) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ensureSheet(ss, "Jugadors", PLAYER_HEADERS);

  payload.players.forEach(function (p, idx) {
    const playerId =
      (payload.playerIds && payload.playerIds[idx]) ||
      payload.teamId + "-J" + String(idx + 1).padStart(2, "0");
    // birthYear pot venir directament o es deriva de birthDate (YYYY-01-01)
    const birthYear = p.birthYear || (p.birthDate ? String(p.birthDate).slice(0, 4) : "");
    const row = [
      new Date(payload.submittedAt || new Date()),  // Timestamp
      playerId,                                      // PlayerID
      payload.teamId,                                // TeamID
      p.fullName   || "",                            // Full Name
      p.club       || "",                            // Club (opcional)
      p.category   || payload.category || "",        // Category
      birthYear,                                     // Birth Year
      p.gender     || "",                            // Gender
      p.phone      || "",                            // Phone
      p.email      || "",                            // Email (opcional)
      p.shirtSize  || "",                            // Shirt Size (opcional)
      !!p.imageRights,                               // Image Rights
    ];
    sheet.appendRow(row);
  });
}

function updateJotformIdInSheet(sheetId, rowNum, jotformId) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getSheetByName("Inscripcions");
  if (!sheet) return;
  const col = TEAM_HEADERS.indexOf("JotForm ID") + 1;
  if (col > 0) sheet.getRange(rowNum, col).setValue(jotformId);
}

// ===== JOTFORM =====
//
// Notes:
//  - Si JOTFORM_API_KEY o JOTFORM_FORM_ID no estan configurats, es salta JotForm.
//  - Mapping de question IDs: en crear el formulari JotForm, hauràs de saber quins IDs
//    tenen les preguntes. Per defecte JotForm els numera 1..N. Si has creat el form amb
//    l'ordre suggerit a la documentació (vegeu README de l'instalació), aquest mapping
//    funciona out-of-the-box.

const JOTFORM_QUESTION_MAP = {
  teamId: 3,
  packageTitle: 4,
  packagePrice: 5,
  finalPrice: 6,
  discountType: 7,
  teamName: 8,
  category: 9,
  captainFullName: 10,
  captainPhone: 11,
  captainEmail: 12,
  captainShirt: 13,
  tutorFullName: 14,
  tutorPhone: 15,
  numPlayers: 16,
  proofUrl: 17,
  playersJson: 18,
  refCode: 19,
  submittedAt: 20,
};

function sendToJotForm(payload) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty("JOTFORM_API_KEY");
  const formId = props.getProperty("JOTFORM_FORM_ID");
  if (!apiKey || !formId) {
    console.log("JotForm not configured, skipping");
    return null;
  }

  const submission = {};
  function s(key, val) {
    const qid = JOTFORM_QUESTION_MAP[key];
    if (!qid) return;
    submission["submission[" + qid + "]"] = String(val == null ? "" : val);
  }

  s("teamId",        payload.teamId);
  s("packageTitle",  payload.packageTitle);
  s("packagePrice",  payload.packagePrice);
  s("finalPrice",    payload.finalPrice || payload.packagePrice);
  s("discountType",  payload.discountType || "");
  s("teamName",      payload.teamName);
  s("category",      payload.category);
  s("captainFullName", payload.captain.fullName);
  s("captainPhone",  payload.captain.phone);
  s("captainEmail",  payload.captain.email);
  s("captainShirt",  payload.captain.shirtSize || "");
  s("tutorFullName", payload.tutor ? payload.tutor.fullName : "");
  s("tutorPhone",    payload.tutor ? payload.tutor.phone    : "");
  s("numPlayers",    payload.players.length);
  s("proofUrl",      payload.proofUrl || "");
  s("playersJson",   JSON.stringify(payload.players));
  s("refCode",       payload.refCode || "");
  s("submittedAt",   payload.submittedAt);

  const url = "https://api.jotform.com/form/" + formId + "/submissions?apiKey=" + apiKey;
  const response = UrlFetchApp.fetch(url, {
    method: "post",
    payload: submission,
    muteHttpExceptions: true,
  });

  const code = response.getResponseCode();
  if (code !== 200 && code !== 201) {
    throw new Error("JotForm " + code + ": " + response.getContentText());
  }
  const json = JSON.parse(response.getContentText());
  return (json.content && json.content.submissionID) || null;
}

// ===== ABANDONED LEADS =====

const ABANDONED_HEADERS = [
  "Timestamp",       // A
  "Reason",          // B — step2_done / step3_done / step4_done / beforeunload / hidden
  "Step #",          // C — número de pas (1–5)
  "Step Label",      // D — Descompte / Equip / Pagament / Jugadors / Confirma
  "Package",         // E
  "Preu Base (€)",   // F
  "Preu Final (€)",  // G — amb descomptes aplicats
  "Team Name",       // H
  "Category",        // I
  "Captain Name",    // J
  "Captain Phone",   // K
  "Captain Email",   // L
  "Justificant",     // M — Sí / No
  "Early Bird",      // N — Sí / No
  "Social Done",     // O — Sí / No
  "Status",          // P — Pendent / Contactat / Inscrit / Descartat
  "Notes",           // Q — espai follow-up manual
];

function handleAbandoned(payload) {
  verifySecret(payload);
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty("SHEET_ID");
  if (!sheetId) throw new Error("SHEET_ID not configured");
  writeAbandonedToSheet(payload, sheetId);

  // Notificació per email a Ana (best effort)
  try {
    sendAbandonedEmail(payload, props);
  } catch (err) {
    console.warn("sendAbandonedEmail error: " + err);
  }

  return { ok: true };
}

function sendAbandonedEmail(payload, props) {
  const adminEmail = props.getProperty("ADMIN_EMAIL") || "";
  if (!adminEmail) return; // No configurat → silenci

  // Ignora events sense cap contacte (impossible per validació, però per seguretat)
  const hasContact = payload.captainEmail || payload.captainPhone;
  if (!hasContact) return;

  // Evita spam per events de tancament duplicats sense dades útils
  const reason = payload.reason || "";
  const noisyReasons = ["beforeunload", "hidden"];
  // Si ja tenim step2_done o email_entered, beforeunload és redundant
  // → filtrem beforeunload/hidden si no aporten informació nova
  if (noisyReasons.indexOf(reason) !== -1 && !payload.captainEmail && !payload.captainPhone) return;

  const reasonLabels = {
    "step1_email":   "📬 Email donat al Step 1 (sense continuar)",
    "email_entered": "✍️ Email escrit al Step 2 (formulari abandonat)",
    "step2_done":    "✅ Ha completat l'Equip — pendent pagament",
    "step3_done":    "✅ Ha pujat el justificant — pendent jugadors",
    "step4_done":    "✅ Ha introduït jugadors — pendent confirmar",
    "beforeunload":  "🚪 Ha tancat la pàgina",
    "hidden":        "📴 Ha canviat de pestanya/app",
  };
  const reasonLabel = reasonLabels[reason] || reason;

  const contact = [
    payload.captainName  ? "<strong>Nom:</strong> " + payload.captainName : "",
    payload.captainEmail ? "<strong>Email:</strong> <a href='mailto:" + payload.captainEmail + "'>" + payload.captainEmail + "</a>" : "",
    payload.captainPhone ? "<strong>Telèfon:</strong> <a href='tel:" + payload.captainPhone + "'>" + payload.captainPhone + "</a>" : "",
  ].filter(Boolean).join("<br>");

  const details = [
    payload.packageTitle || payload.packageKey ? "<strong>Modalitat:</strong> " + (payload.packageTitle || payload.packageKey) : "",
    payload.category ? "<strong>Categoria:</strong> " + payload.category : "",
    payload.teamName ? "<strong>Equip:</strong> " + payload.teamName : "",
    payload.finalPrice ? "<strong>Preu final:</strong> " + payload.finalPrice + " €" : "",
  ].filter(Boolean).join("<br>");

  const sheetUrl = "https://docs.google.com/spreadsheets/d/" + (props.getProperty("SHEET_ID") || "") + "/edit#gid=0";

  const html = [
    "<div style='font-family:sans-serif;max-width:560px'>",
    "<h2 style='color:#cc2244;margin:0 0 4px'>🏀 Lead abandonat — 3×3 Westfield Glòries</h2>",
    "<p style='color:#555;margin:0 0 16px;font-size:0.95em'>" + reasonLabel + "</p>",
    "<table style='border-collapse:collapse;width:100%'>",
    "<tr><td style='padding:10px 14px;background:#f9f9f9;border-radius:8px 8px 0 0'>",
    "<strong style='font-size:1em'>Contacte</strong><br><br>" + (contact || "—"),
    "</td></tr>",
    details ? "<tr><td style='padding:10px 14px;border-top:1px solid #eee'>" + details + "</td></tr>" : "",
    "</table>",
    "<p style='margin:16px 0 4px'>",
    "<a href='" + sheetUrl + "' style='background:#cc2244;color:#fff;padding:8px 18px;border-radius:6px;text-decoration:none;font-weight:bold'>",
    "Veure a l'Sheet →</a>",
    "</p>",
    "<p style='font-size:0.8em;color:#999;margin-top:20px'>",
    "Enviat automàticament pel wizard d'inscripció · " + new Date().toLocaleString("ca-ES"),
    "</p>",
    "</div>",
  ].join("");

  const subject = "🏀 Lead abandonat" + (payload.captainName ? " — " + payload.captainName : "") + " · " + reasonLabel.replace(/[^\w\s·àèéíïòóúüçÀÈÉÍÏÒÓÚÜÇ—]/g, "").trim();

  sendToAdmins(adminEmail, subject, html);
}

function writeAbandonedToSheet(payload, sheetId) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ensureSheet(ss, "Abandonaments", ABANDONED_HEADERS);
  const lastRow = sheet.appendRow([
    new Date(payload.abandonedAt || new Date()),
    payload.reason     || "",
    payload.step       || "",
    payload.stepLabel  || "",
    payload.packageTitle || payload.packageKey || "",
    payload.packagePrice || "",
    payload.finalPrice   || payload.packagePrice || "",
    payload.teamName   || "",
    payload.category   || "",
    payload.captainName  || "",
    payload.captainPhone || "",
    payload.captainEmail || "",
    payload.proofUploaded    ? "Sí" : "No",
    payload.earlyBirdApplied ? "Sí" : "No",
    payload.socialShareDone  ? "Sí" : "No",
    "Pendent",
    "",
  ]);
  // Format data + preus
  const row = sheet.getLastRow();
  sheet.getRange(row, 1).setNumberFormat("dd/mm/yyyy hh:mm");
  sheet.getRange(row, 6).setNumberFormat("0.00");
  sheet.getRange(row, 7).setNumberFormat("0.00");
  return lastRow;
}

/**
 * Quan una inscripció es completa, busca files a "Abandonaments" que tinguin
 * el mateix email o telèfon del capità i actualitza el seu Status a "Inscrit".
 * Permet a Ana filtrar/ocultar facilment els leads que ja s'han convertit.
 */
function markAbandonedAsInscrit(payload, sheetId) {
  try {
    var email = (payload.captain && payload.captain.email) ? payload.captain.email.trim().toLowerCase() : "";
    var phone = (payload.captain && payload.captain.phone) ? payload.captain.phone.trim() : "";
    if (!email && !phone) return;

    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheetByName("Abandonaments");
    if (!sheet) return;

    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return; // Sense files de dades

    // Col L (12) = Captain Email, Col K (11) = Captain Phone, Col P (16) = Status
    var emailCol  = sheet.getRange(2, 12, lastRow - 1, 1).getValues(); // L
    var phoneCol  = sheet.getRange(2, 11, lastRow - 1, 1).getValues(); // K
    var statusCol = sheet.getRange(2, 16, lastRow - 1, 1).getValues(); // P

    for (var i = 0; i < emailCol.length; i++) {
      var rowEmail = String(emailCol[i][0]).trim().toLowerCase();
      var rowPhone = String(phoneCol[i][0]).trim();
      var status   = String(statusCol[i][0]).trim();
      if (status === "Inscrit" || status === "Descartat") continue; // Ja processat
      var match = (email && rowEmail === email) || (phone && rowPhone === phone);
      if (match) {
        sheet.getRange(i + 2, 16).setValue("Inscrit"); // Col P
      }
    }
  } catch (err) {
    console.warn("markAbandonedAsInscrit error: " + err);
  }
}

// ===== LEADS (Share Gate / WhatsApp widget / qualsevol captura) =====
// Tots els leads que NO són una inscripció completa: gent que ha compartit,
// gent que ha demanat info per WhatsApp, gent que ha donat el seu contacte
// per veure descomptes, etc.

const LEAD_HEADERS = [
  "Timestamp",
  "Origin",       // ex: share-slidedos, share-rival, wa-widget, footer-form
  "Nom",
  "Email",
  "Telèfon",
  "Interès",      // ex: "Comparteix el 3×3", "Vol info inscripció"
  "Pregunta",
  "Missatge",
  "Consent",      // TRUE/FALSE
  "Status",       // Pendent / Contactat / Inscrit / Descartat
  "Notes",        // espai per al follow-up manual d'Ana
  "UTM Source",
  "UTM Medium",
  "UTM Campaign",
];

function handleLead(payload) {
  verifySecret(payload);
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty("SHEET_ID");
  if (!sheetId) throw new Error("SHEET_ID not configured");
  writeLeadToSheet(payload, sheetId);
  return { ok: true };
}

/**
 * Sincronitza el SHEET_ID amb el Sheet centralitzat d'Ana
 * (1MG5_8cmeKOe5Jz8BWiJ2e1K669EcIdNNHN1gFGI2uPA).
 * Executar UN COP des de l'editor d'Apps Script. També crea les pestanyes
 * Inscripcions/Jugadors/Abandonaments/Leads si encara no existeixen.
 */
function syncSheetIdToCentralized() {
  var TARGET_SHEET_ID = "1MG5_8cmeKOe5Jz8BWiJ2e1K669EcIdNNHN1gFGI2uPA";
  PropertiesService.getScriptProperties().setProperty("SHEET_ID", TARGET_SHEET_ID);
  Logger.log("SHEET_ID actualitzat a: " + TARGET_SHEET_ID);

  // Assegura les 4 pestanyes amb capçaleres
  var ss = SpreadsheetApp.openById(TARGET_SHEET_ID);
  ensureSheet(ss, "Inscripcions",    TEAM_HEADERS);
  ensureSheet(ss, "Jugadors",        PLAYER_HEADERS);
  ensureSheet(ss, "Abandonaments",   ABANDONED_HEADERS);
  ensureSheet(ss, "Leads",           LEAD_HEADERS);

  Logger.log("Pestanyes assegurades: Inscripcions, Jugadors, Abandonaments, Leads");
  return {
    ok: true,
    sheetId: TARGET_SHEET_ID,
    sheetUrl: ss.getUrl(),
  };
}

/**
 * Afegeix validació + format condicional a la columna Status de Leads i
 * Abandonaments, i crea (o refresca) una pestanya "Dashboard" amb resums.
 * Executar UN COP després de syncSheetIdToCentralized.
 */
function setupLeadsDashboard() {
  var sheetId = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!sheetId) throw new Error("SHEET_ID not configured — exec syncSheetIdToCentralized abans");
  var ss = SpreadsheetApp.openById(sheetId);

  var STATUS_OPTIONS = ["Pendent", "Contactat", "Inscrit", "Descartat", "Spam"];

  // ── Configura Status a Leads (columna J = 10) i Abandonaments (col K = 11) ─
  [
    { name: "Leads",         col: 10 },
    { name: "Abandonaments", col: 16 },  // columna P = Status
  ].forEach(function (cfg) {
    var sheet = ss.getSheetByName(cfg.name);
    if (!sheet) return;

    var range = sheet.getRange(2, cfg.col, 1000, 1); // 1000 files de marge

    // Validació: dropdown amb les 5 opcions
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(STATUS_OPTIONS, true)
      .setAllowInvalid(false)
      .build();
    range.setDataValidation(rule);

    // Format condicional per color
    var rules = sheet.getConditionalFormatRules();
    var newRules = rules.filter(function (r) {
      return r.getRanges().every(function (rg) {
        return rg.getColumn() !== cfg.col;
      });
    });

    var colorMap = [
      { val: "Pendent",   bg: "#fff3bf", fg: "#7a5c00" },
      { val: "Contactat", bg: "#cfe2ff", fg: "#003a8c" },
      { val: "Inscrit",   bg: "#d3f9d8", fg: "#2b8a3e" },
      { val: "Descartat", bg: "#e9ecef", fg: "#495057" },
      { val: "Spam",      bg: "#f8d7da", fg: "#842029" },
    ];

    colorMap.forEach(function (c) {
      newRules.push(
        SpreadsheetApp.newConditionalFormatRule()
          .whenTextEqualTo(c.val)
          .setBackground(c.bg)
          .setFontColor(c.fg)
          .setBold(true)
          .setRanges([range])
          .build()
      );
    });

    sheet.setConditionalFormatRules(newRules);
  });

  // ── Crea/refresca la pestanya Dashboard ─────────────────────────────────
  var dash = ss.getSheetByName("Dashboard");
  if (!dash) {
    dash = ss.insertSheet("Dashboard", 0); // primera pestanya
  } else {
    dash.clear();
  }

  dash.getRange("A1").setValue("📊 Dashboard 3×3 Westfield Glòries 2026").setFontWeight("bold").setFontSize(16).setFontColor("#ff375f");
  dash.getRange("A1:E1").merge();

  var rows = [
    ["", "", "", "", ""],
    ["RESUM LEADS", "", "", "", ""],
    ["Total leads",        "=COUNTA(Leads!A2:A)",                            "Pendents",  "=COUNTIF(Leads!J2:J,\"Pendent\")",  ""],
    ["Contactats",         "=COUNTIF(Leads!J2:J,\"Contactat\")",             "Inscrits",  "=COUNTIF(Leads!J2:J,\"Inscrit\")",  ""],
    ["Descartats",         "=COUNTIF(Leads!J2:J,\"Descartat\")",             "Spam",      "=COUNTIF(Leads!J2:J,\"Spam\")",     ""],
    ["% conversió",        "=IFERROR(COUNTIF(Leads!J2:J,\"Inscrit\")/COUNTA(Leads!A2:A),0)", "", "", ""],
    ["", "", "", "", ""],
    ["RESUM ABANDONAMENTS", "", "", "", ""],
    ["Total abandons",     "=COUNTA(Abandonaments!A2:A)",                                                "Pendents", "=COUNTIF(Abandonaments!P2:P,\"Pendent\")", ""],
    ["Recuperats (Inscrits)", "=COUNTIF(Abandonaments!P2:P,\"Inscrit\")",                                "% recup.", "=IFERROR(COUNTIF(Abandonaments!P2:P,\"Inscrit\")/COUNTA(Abandonaments!A2:A),0)", ""],
    ["", "", "", "", ""],
    ["RESUM INSCRIPCIONS", "", "", "", ""],
    ["Total equips",       "=COUNTA(Inscripcions!A2:A)",                     "Total jugadors", "=COUNTA(Jugadors!A2:A)", ""],
    ["", "", "", "", ""],
    ["LEADS PER ORIGIN (top 10)", "", "", "", ""],
    ["Origin", "Total", "", "", ""],
    ["=QUERY(Leads!B2:B,\"select B, count(B) where B is not null group by B order by count(B) desc limit 10 label B 'Origin', count(B) 'Total'\",0)", "", "", "", ""],
  ];

  dash.getRange(2, 1, rows.length, 5).setValues(rows);

  // Format
  dash.getRange("A3").setFontWeight("bold").setBackground("#1a1a1a").setFontColor("#ff375f");
  dash.getRange("A9").setFontWeight("bold").setBackground("#1a1a1a").setFontColor("#ff375f");
  dash.getRange("A13").setFontWeight("bold").setBackground("#1a1a1a").setFontColor("#ff375f");
  dash.getRange("A16").setFontWeight("bold").setBackground("#1a1a1a").setFontColor("#ff375f");
  dash.getRange("A17:B17").setFontWeight("bold");

  // % conversió i % recup. com a percentatge
  dash.getRange("B7").setNumberFormat("0.0%");
  dash.getRange("D10").setNumberFormat("0.0%");

  dash.setColumnWidth(1, 220);
  dash.setColumnWidth(2, 140);
  dash.setColumnWidth(3, 180);
  dash.setColumnWidth(4, 140);

  Logger.log("Dashboard creat. Status amb validació + format condicional aplicat.");
  return { ok: true, dashboardUrl: ss.getUrl() + "#gid=" + dash.getSheetId() };
}

function writeLeadToSheet(payload, sheetId) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ensureSheet(ss, "Leads", LEAD_HEADERS);
  sheet.appendRow([
    new Date(payload.timestamp || new Date()),
    payload.origin || "",
    payload.name || "",
    payload.email || "",
    payload.phone || "",
    payload.interest || "",
    payload.question || "",
    payload.message || "",
    payload.consent === true ? "TRUE" : "FALSE",
    "Pendent",
    "",
    payload.utm_source || "",
    payload.utm_medium || "",
    payload.utm_campaign || "",
  ]);
}

// ===== MIGRACIÓ COLUMNES =====

/**
 * MIGRA les pestanyes Inscripcions i Jugadors afegint les columnes noves
 * que falten al final (sense tocar dades existents).
 * Executa UNA VEGADA des de l'editor si el Sheet ja existia amb capçaleres antigues.
 */
function migrateSheetColumns() {
  var sheetId = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!sheetId) throw new Error("SHEET_ID not configured — executa syncSheetIdToCentralized primer");
  var ss = SpreadsheetApp.openById(sheetId);

  function addMissingCols(sheetName, allHeaders) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      Logger.log(sheetName + " no existeix — es crearà automàticament a la propera inscripció");
      return;
    }
    var lastCol = sheet.getLastColumn();
    var existing = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) { return String(h).trim(); });
    allHeaders.forEach(function(h) {
      var cleanH = h.replace(/\/\/.*/, "").trim(); // elimina comentaris inline
      if (!existing.includes(cleanH)) {
        var nextCol = sheet.getLastColumn() + 1;
        var cell = sheet.getRange(1, nextCol);
        cell.setValue(cleanH).setFontWeight("bold").setBackground("#1a1a1a").setFontColor("#ff375f");
        existing.push(cleanH);
        Logger.log(sheetName + ": Columna nova '" + cleanH + "' afegida a col " + nextCol);
      }
    });
  }

  // Strip comments from header strings
  var cleanTeam = TEAM_HEADERS.map(function(h) { return h.replace(/\/\/.*/, "").trim(); });
  var cleanPlayer = PLAYER_HEADERS.map(function(h) { return h.replace(/\/\/.*/, "").trim(); });
  var cleanAbandoned = ABANDONED_HEADERS.map(function(h) { return h.replace(/\/\/.*/, "").trim(); });

  addMissingCols("Inscripcions", cleanTeam);
  addMissingCols("Jugadors",     cleanPlayer);
  addMissingCols("Abandonaments",cleanAbandoned);

  Logger.log("✅ Migració completada. Comprova el Sheet:");
  Logger.log(ss.getUrl());
  return { ok: true, sheetUrl: ss.getUrl() };
}

// ===== SETUP & TEST HELPERS =====

/**
 * BOOTSTRAP — Executa aquesta funció UNA SOLA VEGADA des de l'editor d'Apps Script.
 *
 * Crearà automàticament:
 *  1. Google Sheet "Inscripcions 3x3 2026" amb les 2 pestanyes (Inscripcions + Jugadors)
 *  2. Carpeta Drive "3x3 Glòries 2026 · Justificants"
 *  3. Totes les Script Properties (SHEET_ID, DRIVE_FOLDER_ID, APPSCRIPT_SECRET)
 *
 * Després només cal:
 *  · Deploy > New deployment > Web app > Anyone
 *  · Copiar la URL i posar-la a Vercel com APPSCRIPT_INSCRIPCIO_URL
 *
 * El secret ja està pre-omplert per garantir que coincideixi amb Vercel.
 */
function bootstrap() {
  const props = PropertiesService.getScriptProperties();

  // 1. Sheet
  let sheetId = props.getProperty("SHEET_ID");
  if (!sheetId) {
    const ss = SpreadsheetApp.create("Inscripcions 3x3 2026");
    sheetId = ss.getId();
    // Inicialitza les 2 pestanyes amb capçaleres
    ensureSheet(ss, "Inscripcions", TEAM_HEADERS);
    ensureSheet(ss, "Jugadors", PLAYER_HEADERS);
    // Esborra la pestanya "Sheet1" per defecte si està buida
    const defaultSheet = ss.getSheetByName("Sheet1") || ss.getSheetByName("Full 1");
    if (defaultSheet && ss.getSheets().length > 1) {
      try {
        ss.deleteSheet(defaultSheet);
      } catch (_e) {
        // ignore
      }
    }
    Logger.log("Sheet creat: " + sheetId);
  } else {
    Logger.log("Sheet ja existeix: " + sheetId);
  }

  // 2. Drive folder
  let folderId = props.getProperty("DRIVE_FOLDER_ID");
  if (!folderId) {
    const folder = DriveApp.createFolder("3x3 Glòries 2026 · Justificants");
    folderId = folder.getId();
    Logger.log("Drive folder creat: " + folderId);
  } else {
    Logger.log("Drive folder ja existeix: " + folderId);
  }

  // 3. Set properties (incloent el secret pre-generat que coincideix amb Vercel)
  props.setProperties({
    SHEET_ID: sheetId,
    DRIVE_FOLDER_ID: folderId,
    APPSCRIPT_SECRET: "2482bb392e577c6d57efe693d5237caf5b7fcf73a356aa810541bae84e7e2b93",
  });

  Logger.log("====================================================");
  Logger.log("BOOTSTRAP COMPLET ✓");
  Logger.log("Sheet URL: " + SpreadsheetApp.openById(sheetId).getUrl());
  Logger.log("Drive folder URL: " + DriveApp.getFolderById(folderId).getUrl());
  Logger.log("====================================================");
  Logger.log("Següent pas: Deploy > New deployment > Web app > Anyone");
  return {
    sheetUrl: SpreadsheetApp.openById(sheetId).getUrl(),
    folderUrl: DriveApp.getFolderById(folderId).getUrl(),
  };
}

/**
 * (Compatibilitat) Si vols afegir manualment JotForm despres del bootstrap, edita aquí
 * i executa només aquesta funció.
 */
function setAdminEmail() {
  PropertiesService.getScriptProperties().setProperty(
    "ADMIN_EMAIL",
    "voluntarisgrupbarna@gmail.com,anafernandezduran78@gmail.com"
  );
  Logger.log("ADMIN_EMAIL configurat ✓ → voluntarisgrupbarna@gmail.com, anafernandezduran78@gmail.com");
}

/**
 * Envia un email a tots els destinataris de la llista ADMIN_EMAIL (separats per comes).
 */
function sendToAdmins(adminEmail, subject, html) {
  var emails = adminEmail.split(",").map(function(e) { return e.trim(); }).filter(Boolean);
  emails.forEach(function(email) {
    GmailApp.sendEmail(email, subject, "", { htmlBody: html, name: "3×3 Inscripcions" });
  });
}

function setJotformProperties() {
  PropertiesService.getScriptProperties().setProperties({
    JOTFORM_API_KEY: "", // pega aquí
    JOTFORM_FORM_ID: "", // pega aquí
  });
}

/**
 * Executa aquesta funció des de l'editor d'Apps Script per fer un test end-to-end
 * sense necessitar el frontend. Comprova que Sheet, Drive i (opcional) JotForm funcionen.
 */
function testHandleInscripcio() {
  const props = PropertiesService.getScriptProperties();
  const fake = {
    secret: props.getProperty("APPSCRIPT_SECRET"),
    teamId: "T3X3-2026-TEST" + Math.floor(Math.random() * 1000),
    packageKey: "team-4",
    packageTitle: "Equip 4 jugadors",
    packagePrice: 75,
    teamName: "Equip Test " + new Date().toISOString().slice(0, 10),
    category: "Cadet (2010-2011)",
    captain: {
      fullName: "Test Capità",
      dni: "12345678A",
      phone: "+34666123456",
      email: "test@example.com",
    },
    tutor: null,
    players: [
      {
        fullName: "Jugador Test 1",
        birthDate: "2010-01-01",
        gender: "Masculí",
        position: "Base",
        level: "Mig",
        shirtSize: "M",
        dorsal: "23",
        federated: false,
        federationKey: "",
        imageRights: true,
      },
    ],
    proof: {
      fileName: "test.png",
      mime: "image/png",
      base64:
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    },
    rgpdConsent: true,
    imageRightsConsent: true,
    refCode: "RIVAL-CB-GRUP-BARNA-A",
    submittedAt: new Date().toISOString(),
  };
  const result = handleInscripcio(fake);
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

// ===== EMAILS + QR =====

/**
 * Envia dos emails en paral·lel (best-effort):
 *   1. Confirmació al capità (i al tutor si n'hi ha)
 *   2. Notificació a Ana (ADMIN_EMAIL a Script Properties)
 *
 * Script Properties necessàries:
 *   ADMIN_EMAIL  → email d'Ana per rebre notificacions
 *   SITE_URL     → URL base del microsite (ex: https://www.cbgrupbarna-3x3timechamber.com)
 *                  Opcional; si no hi és, el QR mostra directament el TeamID.
 */
function sendEmails(payload, proofUrl, sheetId) {
  const props = PropertiesService.getScriptProperties();
  const adminEmail = props.getProperty("ADMIN_EMAIL") || "";
  const siteUrl = (props.getProperty("SITE_URL") || "https://www.cbgrupbarna-3x3timechamber.com").replace(/\/$/, "");

  const qrData = siteUrl + "/equip?id=" + payload.teamId;
  const qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(qrData) + "&color=1a1a1a&bgcolor=ffffff&margin=10";

  const captainEmail = payload.captain && payload.captain.email;
  const tutorEmail   = payload.tutor   && payload.tutor.email;
  const teamName     = payload.teamName || payload.captain.fullName;
  const category     = payload.category || "";
  const finalPrice   = (payload.finalPrice || payload.packagePrice || 0).toFixed(2).replace(".00", "");

  const subjectConfirm = "✅ Inscripció rebuda — 3×3 Westfield Glòries 2026 · " + teamName;
  const htmlConfirm    = buildCaptainEmailHtml(payload, proofUrl, qrImageUrl, qrData, siteUrl);

  // Email al capità
  if (captainEmail) {
    GmailApp.sendEmail(captainEmail, subjectConfirm, "", { htmlBody: htmlConfirm, name: "3×3 Westfield Glòries" });
  }
  // Email al tutor (si diferent del capità)
  if (tutorEmail && tutorEmail !== captainEmail) {
    GmailApp.sendEmail(tutorEmail, subjectConfirm, "", { htmlBody: htmlConfirm, name: "3×3 Westfield Glòries" });
  }

  // Notificació a Ana (i a tots els emails de ADMIN_EMAIL, separats per coma)
  if (adminEmail) {
    const ssUrl = sheetId ? SpreadsheetApp.openById(sheetId).getUrl() : "";
    const subjectAdmin = "🏀 Nova inscripció — " + teamName + " · " + category;
    const htmlAdmin    = buildAdminEmailHtml(payload, proofUrl, qrImageUrl, ssUrl, finalPrice);
    sendToAdmins(adminEmail, subjectAdmin, htmlAdmin);
  }
}

function buildCaptainEmailHtml(payload, proofUrl, qrImageUrl, qrData, siteUrl) {
  var teamName   = payload.teamName || payload.captain.fullName;
  var captainName = payload.captain.fullName;
  var category   = payload.category || "";
  var packageTitle = payload.packageTitle || payload.packageKey || "";
  var finalPrice = (payload.finalPrice || payload.packagePrice || 0).toFixed(2).replace(".00", "");
  var numPlayers = payload.players ? payload.players.length : 0;

  var playerRows = (payload.players || []).map(function(p) {
    return '<tr style="border-bottom:1px solid #f0f0f0">' +
      '<td style="padding:7px 8px;font-size:14px">' + esc(p.fullName) + '</td>' +
      '<td style="padding:7px 8px;font-size:14px;color:#555">' + esc(p.club || "—") + '</td>' +
      '<td style="padding:7px 8px;font-size:14px;color:#555">' + esc(p.birthYear || "") + '</td>' +
      '<td style="padding:7px 8px;font-size:14px;color:#555">' + esc(p.shirtSize || "—") + '</td>' +
    '</tr>';
  }).join("");

  var discountNote = "";
  if (payload.discountAmount && payload.discountAmount > 0) {
    discountNote = '<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Descompte</td>' +
      '<td style="padding:8px;border-bottom:1px solid #eee;color:#2b8a3e">−' + Number(payload.discountAmount).toFixed(2).replace(".00","") + ' €' +
      (payload.discountType ? ' (' + esc(payload.discountType) + ')' : '') + '</td></tr>';
  }

  return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">' +
  '<div style="max-width:600px;margin:24px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)">' +
    // Header
    '<div style="background:#1a1a1a;padding:32px 40px;text-align:center">' +
      '<p style="color:#ff375f;font-size:13px;margin:0 0 6px;letter-spacing:2px;text-transform:uppercase">CB Grup Barna</p>' +
      '<h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">3×3 Westfield Glòries 2026</h1>' +
      '<p style="color:#aaa;margin:8px 0 0;font-size:14px">6–7 de juny · Westfield Glòries, Barcelona</p>' +
    '</div>' +
    // Body
    '<div style="padding:36px 40px">' +
      '<p style="font-size:16px;margin:0 0 8px">Hola <strong>' + esc(captainName) + '</strong>,</p>' +
      '<p style="color:#444;margin:0 0 24px">Hem rebut la teva inscripció per al <strong>3×3 Westfield Glòries 2026</strong>. La validarem en menys de 24h un cop verifiquem el pagament.</p>' +

      // Resum
      '<table style="width:100%;border-collapse:collapse;margin-bottom:28px">' +
        '<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;width:40%">Equip</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:700">' + esc(teamName) + '</td></tr>' +
        '<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Categoria</td><td style="padding:8px;border-bottom:1px solid #eee">' + esc(category) + '</td></tr>' +
        '<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Pack</td><td style="padding:8px;border-bottom:1px solid #eee">' + esc(packageTitle) + '</td></tr>' +
        discountNote +
        '<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Import</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:700;color:#ff375f">' + finalPrice + ' €</td></tr>' +
        '<tr><td style="padding:8px;color:#666">ID Equip</td><td style="padding:8px;font-family:monospace;font-size:13px;color:#333">' + esc(payload.teamId) + '</td></tr>' +
      '</table>' +

      // QR
      '<div style="text-align:center;margin:28px 0;padding:24px;background:#f9f9f9;border-radius:8px">' +
        '<p style="color:#555;font-size:14px;margin:0 0 14px;font-weight:600">Codi QR de l\'equip</p>' +
        '<img src="' + qrImageUrl + '" alt="QR ' + esc(payload.teamId) + '" width="180" height="180" style="display:block;margin:0 auto;border:1px solid #ddd;border-radius:6px" />' +
        '<p style="color:#999;font-size:12px;margin:10px 0 0;font-family:monospace">' + esc(payload.teamId) + '</p>' +
        '<p style="color:#aaa;font-size:11px;margin:6px 0 0">Porta\'l al check-in el dia del torneig</p>' +
      '</div>' +

      // Jugadors
      '<h3 style="color:#1a1a1a;border-bottom:2px solid #ff375f;padding-bottom:8px;margin:28px 0 14px">Jugadors inscrits (' + numPlayers + ')</h3>' +
      '<table style="width:100%;border-collapse:collapse">' +
        '<tr style="background:#f5f5f5">' +
          '<th style="padding:8px;text-align:left;font-size:13px;color:#666">Nom</th>' +
          '<th style="padding:8px;text-align:left;font-size:13px;color:#666">Club</th>' +
          '<th style="padding:8px;text-align:left;font-size:13px;color:#666">Any naix.</th>' +
          '<th style="padding:8px;text-align:left;font-size:13px;color:#666">Talla</th>' +
        '</tr>' +
        playerRows +
      '</table>' +

      // Avís pagament
      '<div style="background:#fff8e1;border-left:4px solid #ff9800;padding:14px 16px;margin:28px 0;border-radius:0 6px 6px 0">' +
        '<p style="margin:0;font-size:14px;color:#5f4000">⏳ La inscripció estarà <strong>pendent de confirmació</strong> fins que verifiquem el justificant. Rebràs un segon email quan estigui validada.</p>' +
      '</div>' +

      '<p style="font-size:14px;color:#444">Qualsevol dubte: <a href="https://wa.me/34698425153" style="color:#25d366;font-weight:600">WhatsApp +34 698 425 153</a></p>' +
      '<p style="font-size:14px;color:#444;margin-top:4px">Ens veiem al Westfield Glòries el <strong>6–7 de juny de 2026</strong>! 🏀</p>' +
      '<hr style="border:none;border-top:1px solid #eee;margin:28px 0">' +
      '<p style="font-size:12px;color:#aaa;text-align:center">CB Grup Barna · <a href="' + siteUrl + '" style="color:#ff375f">' + siteUrl.replace("https://","") + '</a></p>' +
    '</div>' +
  '</div>' +
  '</body></html>';
}

function buildAdminEmailHtml(payload, proofUrl, qrImageUrl, ssUrl, finalPrice) {
  var teamName    = payload.teamName || payload.captain.fullName;
  var category    = payload.category || "";
  var captainName = payload.captain.fullName;
  var captainPhone = payload.captain.phone || "";
  var captainEmail = payload.captain.email || "";
  var numPlayers  = payload.players ? payload.players.length : 0;
  var packageTitle = payload.packageTitle || payload.packageKey || "";
  var discountInfo = payload.discountType ? " (" + payload.discountType + " −" + (payload.discountAmount||0) + " €)" : "";

  var playerRows = (payload.players || []).map(function(p) {
    return '<tr style="border-bottom:1px solid #f0f0f0">' +
      '<td style="padding:6px 8px;font-size:13px">' + esc(p.fullName) + '</td>' +
      '<td style="padding:6px 8px;font-size:13px;color:#555">' + esc(p.club||"—") + '</td>' +
      '<td style="padding:6px 8px;font-size:13px;color:#555">' + esc(p.gender||"—") + '</td>' +
      '<td style="padding:6px 8px;font-size:13px;color:#555">' + esc(p.birthYear||"—") + '</td>' +
      '<td style="padding:6px 8px;font-size:13px;color:#555">' + esc(p.shirtSize||"—") + '</td>' +
    '</tr>';
  }).join("");

  var proofLink = proofUrl ? '<a href="' + proofUrl + '" style="color:#1a73e8">Veure justificant ↗</a>' : '<span style="color:#e53935">Sense justificant</span>';
  var ssLink    = ssUrl    ? '<a href="' + ssUrl + '" style="color:#1a73e8">Obrir Sheets ↗</a>' : "—";
  var tutorHtml = "";
  if (payload.tutor && payload.tutor.fullName) {
    tutorHtml = '<tr><td style="padding:7px 8px;color:#666;font-size:13px">Tutor/a</td>' +
      '<td style="padding:7px 8px;font-size:13px">' + esc(payload.tutor.fullName) + ' · ' + esc(payload.tutor.phone||"") + ' · ' + esc(payload.tutor.email||"") + '</td></tr>';
  }

  return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">' +
  '<div style="max-width:620px;margin:24px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)">' +
    '<div style="background:#1a1a1a;padding:20px 32px;display:flex;justify-content:space-between;align-items:center">' +
      '<div>' +
        '<p style="color:#ff375f;font-size:12px;margin:0 0 4px;letter-spacing:1px;text-transform:uppercase">Nova inscripció</p>' +
        '<h2 style="color:#fff;margin:0;font-size:18px">' + esc(teamName) + '</h2>' +
        '<p style="color:#aaa;margin:4px 0 0;font-size:13px">' + esc(category) + ' · ' + esc(packageTitle) + '</p>' +
      '</div>' +
      '<div style="text-align:right">' +
        '<p style="color:#ff375f;font-size:22px;font-weight:700;margin:0">' + finalPrice + ' €</p>' +
        discountInfo ? '<p style="color:#aaa;font-size:11px;margin:2px 0 0">' + esc(discountInfo) + '</p>' : '' +
      '</div>' +
    '</div>' +
    '<div style="padding:28px 32px">' +
      // Resum equip
      '<table style="width:100%;border-collapse:collapse;margin-bottom:20px">' +
        '<tr style="background:#f9f9f9"><td style="padding:7px 8px;color:#666;font-size:13px;width:130px">ID Equip</td><td style="padding:7px 8px;font-family:monospace;font-size:12px">' + esc(payload.teamId) + '</td></tr>' +
        '<tr><td style="padding:7px 8px;color:#666;font-size:13px">Capità/a</td><td style="padding:7px 8px;font-size:13px"><strong>' + esc(captainName) + '</strong> · ' + esc(captainPhone) + ' · ' + esc(captainEmail) + '</td></tr>' +
        tutorHtml +
        '<tr style="background:#f9f9f9"><td style="padding:7px 8px;color:#666;font-size:13px">Jugadors</td><td style="padding:7px 8px;font-size:13px">' + numPlayers + '</td></tr>' +
        '<tr><td style="padding:7px 8px;color:#666;font-size:13px">Justificant</td><td style="padding:7px 8px;font-size:13px">' + proofLink + '</td></tr>' +
        '<tr style="background:#f9f9f9"><td style="padding:7px 8px;color:#666;font-size:13px">Sheets</td><td style="padding:7px 8px;font-size:13px">' + ssLink + '</td></tr>' +
      '</table>' +

      // Jugadors
      '<h4 style="margin:0 0 10px;font-size:14px;color:#333">Jugadors</h4>' +
      '<table style="width:100%;border-collapse:collapse;font-size:13px">' +
        '<tr style="background:#f5f5f5">' +
          '<th style="padding:6px 8px;text-align:left;color:#666">Nom</th>' +
          '<th style="padding:6px 8px;text-align:left;color:#666">Club</th>' +
          '<th style="padding:6px 8px;text-align:left;color:#666">Gènere</th>' +
          '<th style="padding:6px 8px;text-align:left;color:#666">Any naix.</th>' +
          '<th style="padding:6px 8px;text-align:left;color:#666">Talla</th>' +
        '</tr>' +
        playerRows +
      '</table>' +

      // QR petit
      '<div style="margin-top:24px;display:flex;align-items:center;gap:16px">' +
        '<img src="' + qrImageUrl + '" alt="QR" width="80" height="80" style="border:1px solid #ddd;border-radius:4px;flex-shrink:0" />' +
        '<p style="font-size:12px;color:#888;margin:0">QR de l\'equip per al check-in del dia del torneig.</p>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '</body></html>';
}

function esc(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ===== CERCA — FAQ search tracking =====

/**
 * Guarda una cerca del buscador de FAQ al tab "Cerques" del Google Sheet.
 * Columnes: Timestamp | Pàgina | Consulta | Nom | Email | ConsentimentRGPD
 */
function guardarCerca(payload) {
  try {
    const sheetId = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
    if (!sheetId) {
      console.warn("guardarCerca: SHEET_ID not configured, skipping");
      return { ok: true, saved: false, reason: "no SHEET_ID" };
    }

    const ss = SpreadsheetApp.openById(sheetId);
    let sheet = ss.getSheetByName("Cerques");

    // Crea el tab si no existeix
    if (!sheet) {
      sheet = ss.insertSheet("Cerques");
      sheet.getRange(1, 1, 1, 6).setValues([[
        "Timestamp", "Pàgina", "Consulta", "Nom", "Email", "ConsentimentRGPD"
      ]]);
      sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    const hasConsent = !!(payload.name || payload.email);
    sheet.appendRow([
      payload.receivedAt || new Date().toISOString(),
      payload.page || "unknown",
      payload.query || "",
      payload.name || "",
      payload.email || "",
      hasConsent ? "Sí" : "No",
    ]);

    return { ok: true, saved: true };
  } catch (err) {
    console.error("guardarCerca error", err);
    return { ok: false, error: String(err && err.message ? err.message : err) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// setupPendentsSheet — crea la pestanya "Pendents recuperació" al Sheet
// Executa manualment des de l'editor d'Apps Script → Run > setupPendentsSheet
// ─────────────────────────────────────────────────────────────────────────────
function setupPendentsSheet() {
  var ss = SpreadsheetApp.openById("1jrjjMWOGEVGCkyCEd-x8DPVoYTqDLrUuehdZDT-q9OQ");

  // 1. Eliminar pestanyes malformades (conté "Pendents" o "Sheet2")
  var allSheets = ss.getSheets();
  allSheets.forEach(function(s) {
    var name = s.getName();
    if (name.indexOf("Pendents") !== -1 || name === "Sheet2" || name === "Hoja 1") {
      // Assegurem que no deixem el sheet sense cap pestanya
      if (ss.getSheets().length > 1) {
        ss.deleteSheet(s);
        Logger.log("Eliminada pestanya: " + name);
      }
    }
  });

  // 2. Crear pestanya "Pendents recuperació" si no existeix
  var targetName = "Pendents recuperació";
  var existing = ss.getSheetByName(targetName);
  var sheet;
  if (existing) {
    sheet = existing;
    sheet.clearContents();
    Logger.log("Pestanya ja existeix, contingut esborrat: " + targetName);
  } else {
    sheet = ss.insertSheet(targetName);
    Logger.log("Pestanya creada: " + targetName);
  }

  // 3. Capçaleres
  var headers = [
    "Data contacte", "Nom equip", "Categoria", "Paquet",
    "Preu (€)", "Capità nom", "Capità telèfon", "Capità email",
    "Justificant rebut", "Estat", "Notes"
  ];
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground("#c0392b");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  sheet.setFrozenRows(1);
  sheet.setColumnWidths(1, headers.length, 140);
  sheet.setColumnWidth(2, 160); // Nom equip
  sheet.setColumnWidth(6, 180); // Capità nom
  sheet.setColumnWidth(8, 200); // Capità email
  sheet.setColumnWidth(11, 250); // Notes

  // 4. Pre-poblar fila 2: equip Fade away (abandonament step3, 15 maig)
  var fadeAway = [
    "2026-05-15",         // Data contacte
    "Fade away",          // Nom equip
    "Mini (2014)",        // Categoria
    "Equip 5j",           // Paquet
    90,                   // Preu (€)
    "Pau Filella Go...",  // Capità nom (dades parcials de l'abandonament)
    "636519326",          // Capità telèfon
    "miriamgn@ho...",     // Capità email (parcial)
    "Pendent",            // Justificant rebut
    "Pendent contactar",  // Estat
    "Abandonament step3 — dades recollides del tab Abandonaments"  // Notes
  ];
  sheet.getRange(2, 1, 1, fadeAway.length).setValues([fadeAway]);

  // 5. Format zebra per a les files de dades
  sheet.getRange(2, 1, 1, headers.length).setBackground("#fde8e6");

  Logger.log("setupPendentsSheet completat ✓ — pestanya llesta amb capçaleres i Fade away pre-populat");
  return "OK";
}
