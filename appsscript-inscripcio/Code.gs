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

// ===== ABANDONED LEADS =====

const ABANDONED_HEADERS = [
  "Timestamp",
  "Reason",
  "Step",
  "Package",
  "Price (€)",
  "Team Name",
  "Category",
  "Captain Name",
  "Captain Phone",
  "Captain Email",
  "Status",
  "Notes",
];

function handleAbandoned(payload) {
  verifySecret(payload);
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty("SHEET_ID");
  if (!sheetId) throw new Error("SHEET_ID not configured");
  writeAbandonedToSheet(payload, sheetId);
  return { ok: true };
}

function writeAbandonedToSheet(payload, sheetId) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ensureSheet(ss, "Abandonaments", ABANDONED_HEADERS);
  sheet.appendRow([
    new Date(payload.abandonedAt || new Date()),
    payload.reason || "",
    payload.step || "",
    payload.packageTitle || payload.packageKey || "",
    payload.packagePrice || "",
    payload.teamName || "",
    payload.category || "",
    payload.captainName || "",
    payload.captainPhone || "",
    payload.captainEmail || "",
    "Pendent",
    "",
  ]);
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
    { name: "Abandonaments", col: 11 },
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
    ["Total abandons",     "=COUNTA(Abandonaments!A2:A)",                                                "Pendents", "=COUNTIF(Abandonaments!K2:K,\"Pendent\")", ""],
    ["Recuperats (Inscrits)", "=COUNTIF(Abandonaments!K2:K,\"Inscrit\")",                                "% recup.", "=IFERROR(COUNTIF(Abandonaments!K2:K,\"Inscrit\")/COUNTA(Abandonaments!A2:A),0)", ""],
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
