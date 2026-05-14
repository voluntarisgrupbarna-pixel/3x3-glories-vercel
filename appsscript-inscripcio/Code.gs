/**
 * Apps Script Web App — 3×3 Westfield Glòries 2026 · Inscripcions
 *
 * Rep POST des de /api/inscripcio de Next.js (cbgrupbarna-3x3timechamber.com),
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
  const proofUrl = saveProofFile(payload, folderId);

  // 2. Sheet (equip + jugadors)
  const teamSheetRowNum = writeTeamToSheet(payload, proofUrl, sheetId);
  writePlayersToSheet(payload, sheetId);

  // 3. JotForm (best effort, no falla si no està configurat)
  let jotformId = null;
  try {
    jotformId = sendToJotForm(payload);
    if (jotformId && teamSheetRowNum) {
      updateJotformIdInSheet(sheetId, teamSheetRowNum, jotformId);
    }
  } catch (err) {
    console.warn("JotForm sync error: " + err);
  }

  return { ok: true, teamId: payload.teamId, proofUrl: proofUrl, jotformId: jotformId };
}

function validatePayload(p) {
  if (!p) throw new Error("Empty payload");
  if (!p.teamId) throw new Error("Missing teamId");
  if (!p.captain || !p.captain.fullName) throw new Error("Missing captain");
  if (!Array.isArray(p.players) || p.players.length === 0) throw new Error("Missing players");
  if (!p.proof || !p.proof.base64) throw new Error("Missing proof");
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
  "Timestamp",
  "TeamID",
  "Status",
  "Package",
  "Price (€)",
  "Team Name",
  "Category",
  "Captain Name",
  "Captain DNI",
  "Captain Phone",
  "Captain Email",
  "Has Tutor",
  "Tutor Name",
  "Tutor DNI",
  "Tutor Phone",
  "Tutor Email",
  "Num Players",
  "RGPD Consent",
  "Image Rights",
  "Ref Code",
  "Proof File",
  "Proof URL",
  "JotForm ID",
  "QRs Sent",
  "Notes",
];

const PLAYER_HEADERS = [
  "Timestamp",
  "PlayerID",
  "TeamID",
  "Full Name",
  "Birth Date",
  "Gender",
  "Position",
  "Level",
  "Shirt Size",
  "Dorsal",
  "Federated",
  "Federation Key",
  "Image Rights",
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
    new Date(payload.submittedAt || new Date()),
    payload.teamId,
    "pending_payment",
    payload.packageTitle || payload.packageKey || "",
    payload.packagePrice || "",
    payload.teamName || "",
    payload.category || "",
    payload.captain.fullName || "",
    payload.captain.dni || "",
    payload.captain.phone || "",
    payload.captain.email || "",
    !!payload.tutor,
    payload.tutor ? payload.tutor.fullName || "" : "",
    payload.tutor ? payload.tutor.dni || "" : "",
    payload.tutor ? payload.tutor.phone || "" : "",
    payload.tutor ? payload.tutor.email || "" : "",
    payload.players.length,
    !!payload.rgpdConsent,
    !!payload.imageRightsConsent,
    payload.refCode || "",
    (payload.proof && payload.proof.fileName) || "",
    proofUrl,
    "",
    false,
    "",
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
    const row = [
      new Date(payload.submittedAt || new Date()),
      playerId,
      payload.teamId,
      p.fullName || "",
      p.birthDate || "",
      p.gender || "",
      p.position || "",
      p.level || "",
      p.shirtSize || "",
      p.dorsal || "",
      !!p.federated,
      p.federationKey || "",
      !!p.imageRights,
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
  teamName: 6,
  category: 7,
  captainFullName: 8,
  captainDNI: 9,
  captainPhone: 10,
  captainEmail: 11,
  tutorFullName: 12,
  tutorPhone: 13,
  numPlayers: 14,
  proofUrl: 15,
  playersJson: 16,
  refCode: 17,
  submittedAt: 18,
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

  s("teamId", payload.teamId);
  s("packageTitle", payload.packageTitle);
  s("packagePrice", payload.packagePrice);
  s("teamName", payload.teamName);
  s("category", payload.category);
  s("captainFullName", payload.captain.fullName);
  s("captainDNI", payload.captain.dni);
  s("captainPhone", payload.captain.phone);
  s("captainEmail", payload.captain.email);
  s("tutorFullName", payload.tutor ? payload.tutor.fullName : "");
  s("tutorPhone", payload.tutor ? payload.tutor.phone : "");
  s("numPlayers", payload.players.length);
  s("proofUrl", payload.proofUrl || ""); // proofUrl s'afegeix abans de cridar aquesta funció si cal
  s("playersJson", JSON.stringify(payload.players));
  s("refCode", payload.refCode || "");
  s("submittedAt", payload.submittedAt);

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

// ===== SETUP & TEST HELPERS =====

/**
 * Edita els valors aquí i executa aquesta funció una sola vegada des de l'editor
 * d'Apps Script per inicialitzar les propietats.
 */
function setupProperties() {
  PropertiesService.getScriptProperties().setProperties({
    SHEET_ID: "PEGA_AQUI_ID_DEL_SHEET",
    DRIVE_FOLDER_ID: "PEGA_AQUI_ID_DE_LA_CARPETA_DRIVE",
    APPSCRIPT_SECRET: "PEGA_AQUI_UN_STRING_LLARG_I_ALEATORI",
    JOTFORM_API_KEY: "", // opcional
    JOTFORM_FORM_ID: "", // opcional
  });
  Logger.log("Properties set. Verifica a Project Settings > Script Properties.");
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
