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

/**
 * Assegura que WR-031/032/033/034 estiguin ben visibles a "Inscripcions 2026":
 * - WR-031 Croqueta: omple columnes format antic (cols 1-20 buides)
 * - WR-032 Walking Dead: afegeix fila completa (va ser eliminada per la neteja)
 * - WR-033 The Microwaves + WR-034 Ice Barna: ja estan, comprova Verificat
 */
function fixInsc2026Tab() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty("SHEET_ID");
  var siteUrl = (props.getProperty("SITE_URL") || "https://www.cbgrupbarna-3x3timechamber.com").replace(/\/$/, "");
  if (!sheetId) return "ERROR: no SHEET_ID";
  var ss = SpreadsheetApp.openById(sheetId);
  var sh = ss.getSheetByName("Inscripcions 2026");
  if (!sh) return "ERROR: no existeix la pestanya 'Inscripcions 2026'";

  var data = sh.getDataRange().getValues();
  var H = data[0]; // headers row

  // --- Helper: find column index by exact header text ---
  function ci(name) {
    for (var i = 0; i < H.length; i++) if (String(H[i]).trim() === name) return i;
    return -1;
  }

  // Known column indices (0-based) from header analysis:
  // Old-format cols 0-20
  var C = {
    nomEquip:    ci("Nom Equip"),       // col 1
    mida:        ci("Mida (4/5)"),      // col 2
    categoria:   ci("Categoria"),       // col 3
    capitaNom:   ci("Capità Nom"),      // col 4
    capitaCognom:ci("Capità Cognom"),   // col 5
    capitaEmail: ci("Capità Email"),    // col 6
    capitaTel:   ci("Capità Telèfon"),  // col 7
    capitaTalla: ci("Capità Talla"),    // col 9
    jugExtra:    ci("Jugadors Extra"),  // col 13
    total:       ci("Total (€)"),       // col 17
    notesEstat:  ci("Notes / Estat"),   // col 19
    genere:      ci("Gènere"),          // col 20
    // New-format cols 21+
    data2:       ci("Data"),            // col 21
    teamId:      ci("Team ID"),         // col 22
    concepte:    ci("Concepte"),        // col 23
    nomEquip2:   ci("Nom equip"),       // col 24 (lowercase e)
    capita2:     ci("Capità"),          // col 25
    email2:      ci("Email"),           // col 27
    telefon2:    ci("Telèfon"),         // col 28
    jugadors2:   ci("Jugadors"),        // col 29
    midaSam:     ci("Mida samarretes"), // col 30
    descAplicat: ci("Desc. aplicat?"),  // col 32
    descInvit:   ci("Desc. invitacions?"), // col 33
    justDrive:   ci("Justificant Drive URL"), // col 34
    checkInUrl:  ci("Check-in URL"),    // col 35
    pagament:    ci("Pagament estat"),  // col 38
    codi:        ci("Codi WR")          // col 44
  };

  var results = [];

  // --- Find row by WR code or keyword in any cell ---
  function findRow(wr, keyword) {
    for (var r = 1; r < data.length; r++) {
      var row = data[r].join("|");
      if ((wr && row.indexOf(wr) !== -1) || (keyword && row.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)) return r;
    }
    return -1;
  }

  // ── WR-031 Croqueta Mentality — omple columnes format antic ──
  var r031 = findRow("WR-031", "Croqueta");
  if (r031 >= 0) {
    function sv(col, val) { if (col >= 0) sh.getRange(r031+1, col+1).setValue(val); }
    sv(C.nomEquip,    "Croqueta Mentality");
    sv(C.mida,        4);
    sv(C.categoria,   "Cadet Femení");
    sv(C.capitaNom,   "Pilar");
    sv(C.capitaCognom,"Franco Salcedo");
    sv(C.capitaEmail, "pilufranco@gmail.com");
    sv(C.capitaTel,   "34608522753");
    sv(C.jugExtra,    "Nora Jornet Franco · Mar Montaner Garcia · Irene Rocamora Martinez");
    sv(C.total,       67.5);
    sv(C.notesEstat,  "Verificat");
    sv(C.genere,      "Femení");
    sv(C.pagament,    "Verificat");
    results.push("WR-031 fila " + (r031+1) + " completa");
  } else {
    results.push("WR-031 NO TROBADA");
  }

  // ── WR-033 + WR-034 — comprova pagament estat ──
  ["WR-033","WR-034"].forEach(function(wr) {
    var rr = findRow(wr, null);
    if (rr >= 0) {
      if (C.pagament >= 0) sh.getRange(rr+1, C.pagament+1).setValue("Verificat");
      results.push(wr + " fila " + (rr+1) + " pagament=Verificat");
    } else {
      results.push(wr + " NO TROBADA");
    }
  });

  // ── WR-032 Walking Dead — afegir fila completa si no existeix ──
  var r032 = findRow("WR-032", "Walking Dead");
  if (r032 >= 0) {
    if (C.pagament >= 0) sh.getRange(r032+1, C.pagament+1).setValue("Verificat (BBVA transfer)");
    if (C.codi >= 0) sh.getRange(r032+1, C.codi+1).setValue("WR-032");
    results.push("WR-032 ja existia fila " + (r032+1) + " actualitzada");
  } else {
    var ciUrl032 = siteUrl + "/check-in/WR-032";
    var newRow = new Array(H.length).fill("");
    function nv(col, val) { if (col >= 0) newRow[col] = val; }
    // Old-format
    nv(C.nomEquip,    "The Walking Dead");
    nv(C.mida,        4);
    nv(C.categoria,   "Veterans Masculí");
    nv(C.capitaNom,   "Alberto");
    nv(C.capitaCognom,"Marí");
    nv(C.capitaEmail, "almari_21@hotmail.com");
    nv(C.capitaTalla, "L");
    nv(C.jugExtra,    "Andreu Puig · Ignacio Goñi · Dífac Puig");
    nv(C.total,       67.5);
    nv(C.notesEstat,  "Verificat");
    nv(C.genere,      "Masculí");
    // New-format
    nv(C.data2,       "17/05/2026 14:10");
    nv(C.teamId,      "WR-032");
    nv(C.concepte,    "Equip 4 jugadors");
    nv(C.nomEquip2,   "The Walking Dead");
    nv(C.capita2,     "Alberto Marí");
    nv(C.email2,      "almari_21@hotmail.com");
    nv(C.jugadors2,   "Alberto Marí · Andreu Puig · Ignacio Goñi · Dífac Puig");
    nv(C.midaSam,     "L · XL · XXL · L");
    nv(C.descAplicat, "No");
    nv(C.descInvit,   "No");
    nv(C.checkInUrl,  ciUrl032);
    nv(C.pagament,    "Verificat (BBVA transfer)");
    nv(C.codi,        "WR-032");
    sh.appendRow(newRow);
    results.push("WR-032 fila nova afegida");
  }

  var summary = "fixInsc2026Tab OK: " + results.join(" | ");
  Logger.log(summary);
  return summary;
}

/**
 * Confirma WR-031 (Croqueta Mentality), WR-033 (The Microwaves), WR-034 (Ice Barna)
 * sense justificant. Afegeix a Inscripcions + Jugadors, actualitza Inscripcions 2026,
 * envia email de confirmació amb QR a cada capità.
 * Executar UNA SOLA VEGADA.
 */
function confirmThreeTeamsManual() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty("SHEET_ID");
  var siteUrl = (props.getProperty("SITE_URL") || "https://www.cbgrupbarna-3x3timechamber.com").replace(/\/$/, "");
  if (!sheetId) return "ERROR: no SHEET_ID";
  var ss = SpreadsheetApp.openById(sheetId);
  var now = new Date();
  var nowStr = Utilities.formatDate(now, "Europe/Madrid", "dd/MM/yyyy HH:mm");
  var results = [];

  var teams = [
    {
      wr: "WR-031", teamName: "Croqueta Mentality", category: "Cadet Femení",
      pkg: "Equip 4 jugadors", price: 67.5,
      captainName: "Pilar Franco Salcedo", captainPhone: "34608522753",
      captainEmail: "pilufranco@gmail.com", captainShirt: "",
      oldTeamId: "T3X3-2026-QNQX4",
      players: [
        { name: "Pilar Franco Salcedo",     shirt: "", gender: "Femení" },
        { name: "Nora Jornet Franco",        shirt: "", gender: "Femení" },
        { name: "Mar Montaner Garcia",       shirt: "", gender: "Femení" },
        { name: "Irene Rocamora Martinez",   shirt: "", gender: "Femení" }
      ]
    },
    {
      wr: "WR-033", teamName: "The Microwaves", category: "Infantil",
      pkg: "Equip 4 jugadors", price: 67.5,
      captainName: "Eric García Lopez", captainPhone: "656167822",
      captainEmail: "oscgarvid@gmail.com", captainShirt: "16",
      oldTeamId: "the-microwaves-teshqk",
      players: [
        { name: "Eric García Lopez", shirt: "16", gender: "Masculí" },
        { name: "Bruno",             shirt: "16", gender: "Masculí" },
        { name: "Adrián",            shirt: "S",  gender: "Masculí" },
        { name: "Gerard",            shirt: "L",  gender: "Masculí" }
      ]
    },
    {
      wr: "WR-034", teamName: "Ice Barna", category: "Cadet",
      pkg: "Equip 4 jugadors", price: 67.5,
      captainName: "Lluc Seseras Perez", captainPhone: "639304918",
      captainEmail: "llucsepe@gmail.com", captainShirt: "S",
      oldTeamId: "ice-barna-tetvny",
      players: [
        { name: "Lluc Seseras Perez", shirt: "S", gender: "Masculí" },
        { name: "Ivan",               shirt: "M", gender: "Masculí" },
        { name: "Alex",               shirt: "M", gender: "Masculí" },
        { name: "Martí",              shirt: "M", gender: "Masculí" }
      ]
    }
  ];

  var inscSheet     = ss.getSheetByName("Inscripcions");
  var jugSheet      = ss.getSheetByName("Jugadors");
  var insc2026Sheet = ss.getSheetByName("Inscripcions 2026");

  var inscHeaders   = inscSheet     ? inscSheet.getDataRange().getValues()[0]     : [];
  var jugHeaders    = jugSheet      ? jugSheet.getDataRange().getValues()[0]      : [];
  var insc2026Data  = insc2026Sheet ? insc2026Sheet.getDataRange().getValues()    : [];
  var insc2026Headers = insc2026Data.length > 0 ? insc2026Data[0] : [];

  function colIdx(headers, name) {
    for (var i = 0; i < headers.length; i++) {
      if (String(headers[i]).trim() === name) return i;
    }
    return -1;
  }

  teams.forEach(function(team) {
    // ── 1. Inscripcions tab ──────────────────────────────────────
    if (inscSheet) {
      var inscData = inscSheet.getDataRange().getValues();
      var tiCol = colIdx(inscHeaders, "TeamID");
      var existsRow = -1;
      for (var r = 1; r < inscData.length; r++) {
        if (String(inscData[r][tiCol] || "").trim().toUpperCase() === team.wr) { existsRow = r; break; }
      }
      if (existsRow >= 0) {
        var stCol = colIdx(inscHeaders, "Status");
        if (stCol >= 0) inscSheet.getRange(existsRow + 1, stCol + 1).setValue("confirmed");
        results.push("Inscripcions: actualitzat status " + team.wr);
      } else {
        var newRow = new Array(inscHeaders.length).fill("");
        var vals = {
          "Timestamp": nowStr, "TeamID": team.wr, "Status": "confirmed",
          "Package": team.pkg, "Category": team.category, "Team Name": team.teamName,
          "Preu Base (€)": team.price, "Descompte (€)": 0, "Preu Final (€)": team.price,
          "Tipus Descompte": "", "Early Bird": "No", "Social Share": "No",
          "Captain Name": team.captainName, "Captain Phone": team.captainPhone,
          "Captain Email": team.captainEmail, "Captain Shirt": team.captainShirt,
          "Has Tutor": "FALSE", "Num Players": team.players.length,
          "RGPD Consent": "TRUE", "Image Rights": "TRUE", "QRs Sent": "TRUE",
          "Notes": "Confirmat sense justificant per CB Grup Barna " + nowStr
        };
        for (var k in vals) { var ci = colIdx(inscHeaders, k); if (ci >= 0) newRow[ci] = vals[k]; }
        inscSheet.appendRow(newRow);
        results.push("Inscripcions: afegida fila " + team.wr);
      }
    }

    // ── 2. Jugadors tab ──────────────────────────────────────────
    if (jugSheet) {
      var jugData = jugSheet.getDataRange().getValues();
      var tjCol = colIdx(jugHeaders, "TeamID");
      var hasPlayers = jugData.some(function(row, ri) {
        return ri > 0 && String(row[tjCol] || "").trim().toUpperCase() === team.wr;
      });
      if (!hasPlayers) {
        team.players.forEach(function(player, idx) {
          var jugRow = new Array(jugHeaders.length).fill("");
          var jv = {
            "Timestamp": nowStr, "PlayerID": team.wr + "-P" + (idx + 1),
            "TeamID": team.wr, "Full Name": player.name, "Club": "",
            "Category": team.category, "Birth Year": "", "Gender": player.gender,
            "Phone": idx === 0 ? team.captainPhone : "",
            "Email": idx === 0 ? team.captainEmail : "",
            "Shirt Size": player.shirt, "Image Rights": "TRUE"
          };
          for (var k in jv) { var ji = colIdx(jugHeaders, k); if (ji >= 0) jugRow[ji] = jv[k]; }
          jugSheet.appendRow(jugRow);
        });
        results.push("Jugadors: " + team.players.length + " jugadors afegits per " + team.wr);
      }
    }

    // ── 3. Inscripcions 2026 tab — actualitzar pagament estat ────
    if (insc2026Sheet && insc2026Data.length > 0) {
      var wrColI = -1, pagColI = -1;
      for (var c = 0; c < insc2026Headers.length; c++) {
        var h = String(insc2026Headers[c]).toLowerCase();
        if (h === "codi wr" || h.includes("codi wr")) wrColI = c;
        if (h.includes("pagament estat")) pagColI = c;
      }
      for (var r = 1; r < insc2026Data.length; r++) {
        var rowWr  = String(insc2026Data[r][wrColI] || "").trim().toUpperCase();
        var rowStr = insc2026Data[r].join("|").toLowerCase();
        if (rowWr === team.wr || rowStr.indexOf(team.oldTeamId.toLowerCase()) !== -1) {
          if (pagColI >= 0) insc2026Sheet.getRange(r + 1, pagColI + 1).setValue("Verificat");
          if (wrColI  >= 0) insc2026Sheet.getRange(r + 1, wrColI  + 1).setValue(team.wr);
          results.push("Inscripcions 2026: actualitzat " + team.wr + " fila " + (r + 1));
          break;
        }
      }
    }

    // ── 4. Email de confirmació al capità ────────────────────────
    var ciUrl  = siteUrl + "/check-in/" + team.wr;
    var qrUrl  = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=" + encodeURIComponent(ciUrl);
    var jugHtml = team.players.map(function(p) {
      return "<li>" + p.name + (p.shirt ? " — talla " + p.shirt : "") + "</li>";
    }).join("");

    var htmlCap =
      "<div style='font-family:Arial,sans-serif;max-width:600px;color:#111;'>" +
      "<div style='background:#111b21;padding:20px 24px;border-radius:10px 10px 0 0;'>" +
        "<h2 style='color:#25d366;margin:0 0 4px;'>✅ Inscripció confirmada!</h2>" +
        "<p style='color:#8696a0;margin:0;font-size:13px;'>3×3 Westfield Glòries 2026 · 6-7 juny · Clot, Barcelona</p>" +
      "</div>" +
      "<div style='border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 10px 10px;'>" +
        "<p>Hola <strong>" + team.captainName.split(" ")[0] + "</strong>! 🏀</p>" +
        "<p>La inscripció de <strong>" + team.teamName + "</strong> al <strong>3×3 Westfield Glòries 2026</strong> ha quedat <strong style='color:#16a34a;'>confirmada</strong>. Ens veiem al Clot-Glòries el 6-7 de juny!</p>" +
        "<table style='border-collapse:collapse;width:100%;margin:16px 0;font-size:14px;'>" +
          "<tr style='background:#f9fafb;'><th style='padding:8px 12px;text-align:left;border:1px solid #e5e7eb;'>Camp</th><th style='padding:8px 12px;text-align:left;border:1px solid #e5e7eb;'>Detall</th></tr>" +
          "<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;'><b>Codi equip</b></td><td style='padding:8px 12px;border:1px solid #e5e7eb;'><b style='color:#16a34a;font-size:16px;'>" + team.wr + "</b></td></tr>" +
          "<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Equip</td><td style='padding:8px 12px;border:1px solid #e5e7eb;'>" + team.teamName + "</td></tr>" +
          "<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Categoria</td><td style='padding:8px 12px;border:1px solid #e5e7eb;'>" + team.category + "</td></tr>" +
          "<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Pack</td><td style='padding:8px 12px;border:1px solid #e5e7eb;'>" + team.pkg + " · " + String(team.price).replace(".","€ / ").replace("67.5","67,50€") + "</td></tr>" +
          "<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Jugadors</td><td style='padding:8px 12px;border:1px solid #e5e7eb;'><ul style='margin:0;padding-left:18px;'>" + jugHtml + "</ul></td></tr>" +
          "<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Torneig</td><td style='padding:8px 12px;border:1px solid #e5e7eb;'>6-7 juny 2026 · Clot-Glòries, Barcelona</td></tr>" +
        "</table>" +
        "<p><strong>📱 Guarda aquest QR — el necessitaràs per al check-in el dia del torneig:</strong></p>" +
        "<div style='text-align:center;margin:20px 0;'>" +
          "<img src='" + qrUrl + "' alt='QR Check-in " + team.wr + "' style='width:200px;height:200px;border:4px solid #25d366;border-radius:12px;'/><br/>" +
          "<a href='" + ciUrl + "' style='font-size:12px;color:#888;'>" + ciUrl + "</a>" +
        "</div>" +
        "<p style='font-size:13px;color:#555;'>Qualsevol dubte, escriu-nos per WhatsApp: <a href='https://wa.me/34698425153'>+34 698 425 153</a></p>" +
        "<hr style='border:none;border-top:1px solid #e5e7eb;margin:20px 0;'/>" +
        "<p style='font-size:12px;color:#888;'>CB Grup Barna · 3×3 Westfield Glòries 2026</p>" +
      "</div></div>";

    GmailApp.sendEmail(
      team.captainEmail,
      "✅ Inscripció confirmada · " + team.teamName + " · 3×3 Westfield Glòries 2026",
      "Inscripció confirmada! " + team.teamName + " (" + team.wr + " · " + team.category + "). Torneig: 6-7 juny 2026. Check-in: " + ciUrl,
      { htmlBody: htmlCap, cc: "voluntarisgrupbarna@gmail.com" }
    );
    results.push("Email enviat a " + team.captainEmail + " (" + team.wr + ")");
  });

  var summary = "confirmThreeTeamsManual OK — " + results.join(" | ");
  Logger.log(summary);
  return summary;
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

  // Dedup: si el teamId ja existeix, no duplicar
  var existingTeams = sheet.getDataRange().getValues();
  for (var di = 1; di < existingTeams.length; di++) {
    if (String(existingTeams[di][1]).trim() === payload.teamId) {
      Logger.log("writeTeamToSheet: teamId ja existeix, skip: " + payload.teamId);
      return sheet.getLastRow();
    }
  }

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
    "phone_entered": "📱 Telèfon escrit al Step 2 — nom + telèfon capturats",
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

  const subject = "[3x3] Lead abandonat" + (payload.captainName ? " — " + payload.captainName : "") + " · " + reasonLabel.replace(/[^\w\s·àèéíïòóúüçÀÈÉÍÏÒÓÚÜÇ—]/g, "").trim();

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
  try { sendLeadNotificationToAdmin(payload); } catch(e) { Logger.log("sendLeadNotificationToAdmin error: " + e); }
  return { ok: true };
}

/**
 * Envia notificació per email a l'admin cada cop que arriba un lead del formulari de contacte.
 */
function sendLeadNotificationToAdmin(payload) {
  var adminEmail = "voluntarisgrupbarna@gmail.com";
  var nom      = payload.name     || "(sense nom)";
  var mobil    = payload.phone    || "(sense mòbil)";
  var email    = payload.email    || "(no facilitat)";
  var interes  = payload.interest || "";
  var pregunta = payload.question || "";
  var missatge = payload.message  || "";
  var origen   = payload.origin   || "";
  var data     = new Date(payload.timestamp || new Date()).toLocaleString("ca-ES", {timeZone:"Europe/Madrid"});

  var subject = "[3x3] Nou contacte — " + nom;

  var html = "<div style='font-family:Arial,sans-serif;max-width:600px;'>" +
    "<h2 style='background:#16a34a;color:#fff;padding:12px 16px;border-radius:6px;margin:0 0 16px;'>📋 Nou contacte — 3×3 Westfield Glòries 2026</h2>" +
    "<table border='1' cellpadding='8' cellspacing='0' style='border-collapse:collapse;width:100%;font-size:14px;'>" +
    "<tr style='background:#f3f4f6'><th style='text-align:left;width:35%'>Camp</th><th style='text-align:left'>Valor</th></tr>" +
    "<tr><td><b>Nom</b></td><td><b>" + nom + "</b></td></tr>" +
    "<tr><td>Mòbil / WhatsApp</td><td><a href='https://wa.me/34" + mobil.replace(/\D/g,'') + "'>" + mobil + "</a></td></tr>" +
    "<tr><td>Email</td><td>" + (payload.email ? "<a href='mailto:" + email + "'>" + email + "</a>" : "<i>no facilitat</i>") + "</td></tr>" +
    "<tr><td>Tipus d'interès</td><td>" + interes + "</td></tr>" +
    "<tr><td>Pregunta</td><td>" + pregunta + "</td></tr>" +
    (missatge ? "<tr><td>Missatge</td><td>" + missatge + "</td></tr>" : "") +
    "<tr><td>Origen</td><td>" + origen + "</td></tr>" +
    "<tr><td>Data</td><td>" + data + "</td></tr>" +
    "</table>" +
    "<p style='margin-top:16px;'><a href='https://docs.google.com/spreadsheets/d/1MG5_8cmeKOe5Jz8BWiJ2e1K669EcIdNNHN1gFGI2uPA/edit#gid=0' style='background:#2563eb;color:#fff;padding:8px 16px;border-radius:4px;text-decoration:none;'>Veure Leads al Sheet →</a></p>" +
    "<p style='font-size:11px;color:#9ca3af;margin-top:24px;'>Formulari de contacte web · cbgrupbarna-3x3timechamber.com</p>" +
    "</div>";

  var plain = "Nou contacte 3x3:\nNom: " + nom + "\nMobil: " + mobil + "\nEmail: " + email + "\nInteres: " + interes + "\nPregunta: " + pregunta + "\nMissatge: " + missatge;

  GmailApp.sendEmail(adminEmail, subject, plain, { htmlBody: html });
  Logger.log("sendLeadNotificationToAdmin: email enviat a " + adminEmail + " per lead de " + nom);
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

  // Dedup: si el mateix email en < 60s, no duplicar (evita doble-click)
  var existingLeads = sheet.getDataRange().getValues();
  var now = new Date();
  for (var li = 1; li < existingLeads.length; li++) {
    var rowEmail = String(existingLeads[li][3]).trim().toLowerCase();
    var rowTime  = new Date(existingLeads[li][0]);
    var sameEmail = rowEmail === String(payload.email || "").trim().toLowerCase();
    var within60s = (now - rowTime) < 60000;
    if (sameEmail && within60s) {
      Logger.log("writeLeadToSheet: duplicate dins 60s, skip: " + payload.email);
      return;
    }
  }

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
    const subjectAdmin = "[3x3] Nova inscripcio — " + teamName + " · " + category;
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
        (discountInfo ? '<p style="color:#aaa;font-size:11px;margin:2px 0 0">' + esc(discountInfo) + '</p>' : '') +
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
  var sheetId = PropertiesService.getScriptProperties().getProperty("SHEET_ID") || "1MG5_8cmeKOe5Jz8BWiJ2e1K669EcIdNNHN1gFGI2uPA";
  var ss = SpreadsheetApp.openById(sheetId);

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

// ═══════════════════════════════════════════════════════════════════════════
// BACKUP DIARI DE SHEETS
// Crea cada nit una còpia completa del Google Sheet a Drive.
// La còpia inclou TOTES les pestanyes (Inscripcions, Jugadors,
// Abandonaments, Leads, Dashboard...).
//
// Configuració (una sola vegada):
//   1. Obrir l'editor: https://script.google.com
//   2. Executar la funció: setupDailyBackupTrigger
//   3. Acceptar els permisos (Drive + Spreadsheets)
//   → A partir d'aquí corre cada nit a les 02:00 (hora Catalunya)
//
// Recuperar una versió:
//   1. Obrir Drive → carpeta "Backups 3x3 Glòries"
//   2. Trobar "3x3 Glòries Backup YYYY-MM-DD"
//   3. Obrir directament o descarregar com Excel (.xlsx)
// ═══════════════════════════════════════════════════════════════════════════

var BACKUP_FOLDER_NAME = "Backups 3x3 Glòries";
var BACKUP_DAYS_KEEP   = 30; // dies de retenció

/**
 * Còpia diària del Sheet principal a Drive.
 * S'executa via time trigger (creat per setupDailyBackupTrigger).
 */
function dailySheetBackup() {
  var props   = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty("SHEET_ID");
  if (!sheetId) {
    Logger.log("dailySheetBackup: SHEET_ID no configurat — executar syncSheetIdToCentralized primer");
    return;
  }

  // Data d'avui a Europa/Madrid
  var today = Utilities.formatDate(new Date(), "Europe/Madrid", "yyyy-MM-dd");
  var fileName = "3x3 Glòries Backup " + today;

  // Carpeta de backups (es crea si no existeix)
  var folder = getOrCreateBackupFolder_();

  // Evitar duplicats: si ja existeix el backup d'avui, sortir
  var existing = folder.getFilesByName(fileName);
  if (existing.hasNext()) {
    Logger.log("dailySheetBackup: backup " + fileName + " ja existia, saltant");
    return;
  }

  // Fer la còpia completa (totes les pestanyes)
  var ss   = SpreadsheetApp.openById(sheetId);
  var copy = ss.copy(fileName);

  // Moure la còpia a la carpeta de backups
  var copyFile = DriveApp.getFileById(copy.getId());
  folder.addFile(copyFile);
  DriveApp.getRootFolder().removeFile(copyFile); // treure de "My Drive" arrel

  Logger.log("dailySheetBackup: creat " + fileName + " a la carpeta '" + BACKUP_FOLDER_NAME + "'");

  // Netejar còpies antigues (> BACKUP_DAYS_KEEP dies)
  pruneOldBackups_(folder);
}

function getOrCreateBackupFolder_() {
  var it = DriveApp.getFoldersByName(BACKUP_FOLDER_NAME);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(BACKUP_FOLDER_NAME);
}

function pruneOldBackups_(folder) {
  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - BACKUP_DAYS_KEEP);

  var files = folder.getFiles();
  var deleted = 0;
  while (files.hasNext()) {
    var f = files.next();
    if (f.getName().startsWith("3x3 Glòries Backup ") && f.getDateCreated() < cutoff) {
      f.setTrashed(true);
      deleted++;
      Logger.log("pruneOldBackups: eliminat " + f.getName());
    }
  }
  if (deleted > 0) Logger.log("pruneOldBackups: " + deleted + " còpies antigues eliminades");
}

/**
 * Configura el trigger diari.
 * Executar UNA SOLA VEGADA des de l'editor d'Apps Script:
 *   Editor → selecciona "setupDailyBackupTrigger" → ▶ Executar
 */
function setupDailyBackupTrigger() {
  // Esborra triggers anteriors del mateix nom per evitar duplicats
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === "dailySheetBackup") {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Nou trigger: cada dia a les 02:00 hora Catalunya (UTC+1/+2)
  ScriptApp.newTrigger("dailySheetBackup")
    .timeBased()
    .everyDays(1)
    .atHour(2)   // 02:00 AM — fora d'horari d'ús
    .inTimezone("Europe/Madrid")
    .create();

  Logger.log("setupDailyBackupTrigger: trigger creat → dailySheetBackup cada dia a les 02:00 (Europe/Madrid)");
  return "Trigger creat ✓";
}

// ═══════════════════════════════════════════════════════════════════════════
// MIGRACIÓ — copia dades del sheet secundari al TARGET central
// Executar UNA SOLA VEGADA des de l'editor: Run > migrateToTarget
// ═══════════════════════════════════════════════════════════════════════════

function migrateToTarget() {
  var SOURCE_ID     = "1jrjjMWOGEVGCkyCEd-x8DPVoYTqDLrUuehdZDT-q9OQ"; // "Inscripcions 3x3 2026"
  var TARGET_ID     = "1MG5_8cmeKOe5Jz8BWiJ2e1K669EcIdNNHN1gFGI2uPA"; // Sheet central
  var TEST_PREFIXES = ["T3X3-2026-AUTO", "T3X3-2026-TEST"];

  var src = SpreadsheetApp.openById(SOURCE_ID);
  var tgt = SpreadsheetApp.openById(TARGET_ID);

  // ── Inscripcions ─────────────────────────────────────────────────────────
  var srcSheet = src.getSheetByName("Inscripcions");
  var tgtSheet = tgt.getSheetByName("Inscripcions"); // creat per syncSheetIdToCentralized
  if (srcSheet && tgtSheet) {
    var srcData    = srcSheet.getDataRange().getValues();
    var tgtData    = tgtSheet.getDataRange().getValues();
    var existingIds = tgtData.slice(1).map(function(r) { return String(r[1]).trim(); });
    var added = 0;
    srcData.slice(1).forEach(function(row) {
      var teamId = String(row[1]).trim();
      if (!teamId) return;
      var isTest = TEST_PREFIXES.some(function(p) { return teamId.startsWith(p); });
      if (isTest || existingIds.indexOf(teamId) !== -1) return;
      tgtSheet.appendRow(row);
      existingIds.push(teamId);
      added++;
    });
    Logger.log("Inscripcions migrades: " + added);
  } else {
    Logger.log("WARN: no s'ha trobat Inscripcions al source o target (executa syncSheetIdToCentralized primer)");
  }

  // ── Jugadors ─────────────────────────────────────────────────────────────
  var srcJug = src.getSheetByName("Jugadors");
  var tgtJug = tgt.getSheetByName("Jugadors");
  if (srcJug && tgtJug) {
    var srcJugData        = srcJug.getDataRange().getValues();
    var tgtJugData        = tgtJug.getDataRange().getValues();
    var existingPlayerIds = tgtJugData.slice(1).map(function(r) { return String(r[1]).trim(); });
    var addedJug = 0;
    srcJugData.slice(1).forEach(function(row) {
      var playerId = String(row[1]).trim();
      var teamId   = String(row[2]).trim();
      if (!playerId) return;
      var isTest = TEST_PREFIXES.some(function(p) { return teamId.startsWith(p); });
      if (isTest || existingPlayerIds.indexOf(playerId) !== -1) return;
      tgtJug.appendRow(row);
      existingPlayerIds.push(playerId);
      addedJug++;
    });
    Logger.log("Jugadors migrats: " + addedJug);
  }

  // ── Abandonaments ────────────────────────────────────────────────────────
  var srcAb = src.getSheetByName("Abandonaments");
  var tgtAb = tgt.getSheetByName("Abandonaments");
  if (srcAb && tgtAb) {
    var srcAbData = srcAb.getDataRange().getValues();
    var addedAb = 0;
    srcAbData.slice(1).forEach(function(row) {
      if (!row[0]) return; // fila buida
      tgtAb.appendRow(row);
      addedAb++;
    });
    Logger.log("Abandonaments migrats: " + addedAb);
  }

  Logger.log("✅ Migració completada. Comprova: " + tgt.getUrl());
  return "OK — comprova el log per al recompte de files migrades";
}

// ═══════════════════════════════════════════════════════════════════════════
// DEDUPLICACIÓ — elimina files repetides al TARGET
// Executar UNA SOLA VEGADA des de l'editor: Run > deduplicateSheet
// ═══════════════════════════════════════════════════════════════════════════

function deduplicateSheet() {
  var TARGET_ID = "1MG5_8cmeKOe5Jz8BWiJ2e1K669EcIdNNHN1gFGI2uPA";
  var ss        = SpreadsheetApp.openById(TARGET_ID);

  // ── Contactes_WhatsApp — dedup per email o telèfon (col D=3 email, col C=2 tel) ──
  var contactSheet = ss.getSheetByName("Contactes_WhatsApp");
  if (contactSheet) {
    var cData        = contactSheet.getDataRange().getValues();
    var seenContact  = {};
    var rowsToDelete = [];
    for (var ci = cData.length - 1; ci >= 1; ci--) {
      var cEmail = String(cData[ci][3]).trim().toLowerCase();
      var cPhone = String(cData[ci][2]).trim();
      var cKey   = cEmail || cPhone;
      if (!cKey) continue;
      if (seenContact[cKey]) {
        rowsToDelete.push(ci + 1);
      } else {
        seenContact[cKey] = true;
      }
    }
    rowsToDelete.forEach(function(r) { contactSheet.deleteRow(r); });
    Logger.log("Contactes_WhatsApp: " + rowsToDelete.length + " duplicats eliminats");
  }

  // ── Inscripcions — dedup per TeamID (col B=1) ────────────────────────────
  var inscSheet = ss.getSheetByName("Inscripcions");
  if (inscSheet) {
    var iData        = inscSheet.getDataRange().getValues();
    var seenTeams    = {};
    var teamsToDelete = [];
    for (var ii = iData.length - 1; ii >= 1; ii--) {
      var tid = String(iData[ii][1]).trim();
      if (!tid) { teamsToDelete.push(ii + 1); continue; }
      if (seenTeams[tid]) {
        teamsToDelete.push(ii + 1);
      } else {
        seenTeams[tid] = true;
      }
    }
    teamsToDelete.forEach(function(r) { inscSheet.deleteRow(r); });
    Logger.log("Inscripcions: " + teamsToDelete.length + " duplicats eliminats");
  }

  Logger.log("✅ Deduplicació completada");
  return "OK";
}

// ═══════════════════════════════════════════════════════════════════════════
// NETEJA — elimina pestanyes buides del TARGET
// Executar UNA SOLA VEGADA: Run > cleanEmptyTabs
// ═══════════════════════════════════════════════════════════════════════════

function cleanEmptyTabs() {
  var ss = SpreadsheetApp.openById("1MG5_8cmeKOe5Jz8BWiJ2e1K669EcIdNNHN1gFGI2uPA");
  var tabsToClean = ["Contactes_WhatsApp_3x3", "Contactes_WhatsApp_Campus", "Hoja 1"];
  tabsToClean.forEach(function(name) {
    var s = ss.getSheetByName(name);
    if (s && s.getLastRow() <= 1) { // buida o només capçalera
      ss.deleteSheet(s);
      Logger.log("Eliminada pestanya buida: " + name);
    } else if (s) {
      Logger.log("Conservada (té dades): " + name + " — " + s.getLastRow() + " files");
    }
  });
  return "OK";
}

// ===== HELPER MANUAL: afegir WR-032 The Walking Dead (esborrar després) =====
function addWR032Manual() {
  const ss = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty("SHEET_ID")
  );

  // — Inscripcions tab —
  const teamSheet = ensureSheet(ss, "Inscripcions", TEAM_HEADERS);
  const ts = "17/05/2026 14:10";
  const teamRow = [
    ts,                                          // A Timestamp
    "WR-032",                                    // B TeamID
    "confirmed",                                 // C Status
    "Equip 4 jugadors",                          // D Package
    "Veterans Masculí",                          // E Category
    "The Walking Dead",                          // F Team Name
    67.5,                                        // G Preu Base (€)
    0,                                           // H Descompte (€)
    67.5,                                        // I Preu Final (€)
    "",                                          // J Tipus Descompte
    "No",                                        // K Early Bird
    "No",                                        // L Social Share
    "",                                          // M Codi Rival
    "Alberto Marí",                              // N Captain Name
    "",                                          // O Captain Phone
    "almari_21@hotmail.com",                     // P Captain Email
    "L",                                         // Q Captain Shirt
    "FALSE",                                     // R Has Tutor
    "",                                          // S Tutor Name
    "",                                          // T Tutor Phone
    "",                                          // U Tutor Email
    4,                                           // V Num Players
    "TRUE",                                      // W RGPD Consent
    "TRUE",                                      // X Image Rights
    "",                                          // Y Proof File
    "",                                          // Z Proof URL
    "MANUAL",                                    // AA JotForm ID
    "FALSE",                                     // AB QRs Sent
    "Inscripció manual via WhatsApp 17/05/2026", // AC Notes
  ];
  teamSheet.appendRow(teamRow);
  Logger.log("addWR032Manual: team row appended ✓");

  // — Jugadors tab —
  const playerSheet = ensureSheet(ss, "Jugadors", PLAYER_HEADERS);
  const players = [
    [ts, "WR-032-P1", "WR-032", "Alberto Marí",  "", "Veterans Masculí", 1978, "Masculí", "", "almari_21@hotmail.com", "L",   "TRUE"],
    [ts, "WR-032-P2", "WR-032", "Andreu Puig",   "", "Veterans Masculí", 1984, "Masculí", "", "",                      "XL",  "TRUE"],
    [ts, "WR-032-P3", "WR-032", "Ignacio Goñi",  "", "Veterans Masculí", 1979, "Masculí", "", "",                      "XXL", "TRUE"],
    [ts, "WR-032-P4", "WR-032", "Dífac Puig",    "", "Veterans Masculí", 1978, "Masculí", "", "",                      "L",   "TRUE"],
  ];
  players.forEach(function(p) { playerSheet.appendRow(p); });
  Logger.log("addWR032Manual: 4 player rows appended ✓");

  // — Enviar emails (confirmació al capità + notificació a Ana) —
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty("SHEET_ID");
  const siteUrl = (props.getProperty("SITE_URL") || "https://www.cbgrupbarna-3x3timechamber.com").replace(/\/$/, "");
  const teamId = "WR-032";
  const qrData = siteUrl + "/equip?id=" + teamId;
  const qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(qrData) + "&color=1a1a1a&bgcolor=ffffff&margin=10";

  const payload = {
    teamId: "WR-032",
    teamName: "The Walking Dead",
    category: "Veterans Masculí",
    packageTitle: "Equip 4 jugadors",
    packageKey: "team4",
    packagePrice: 67.5,
    finalPrice: 67.5,
    discountAmount: 0,
    discountType: "",
    earlyBirdApplied: false,
    socialShareDone: false,
    rgpdConsent: true,
    captain: {
      fullName: "Alberto Marí",
      email: "almari_21@hotmail.com",
      phone: "",
      shirtSize: "L"
    },
    tutor: null,
    players: [
      { fullName: "Alberto Marí",  club: "", birthYear: 1978, shirtSize: "L",   gender: "Masculí" },
      { fullName: "Andreu Puig",   club: "", birthYear: 1984, shirtSize: "XL",  gender: "Masculí" },
      { fullName: "Ignacio Goñi",  club: "", birthYear: 1979, shirtSize: "XXL", gender: "Masculí" },
      { fullName: "Dífac Puig",    club: "", birthYear: 1978, shirtSize: "L",   gender: "Masculí" }
    ]
  };

  try {
    sendEmails(payload, "", sheetId);
    Logger.log("addWR032Manual: emails enviats ✓ → " + payload.captain.email);
  } catch(err) {
    Logger.log("addWR032Manual: error emails → " + err);
  }

  return "WR-032 The Walking Dead afegit ✓ (1 equip + 4 jugadors + emails enviats)";
}

// ===== HELPER: enviar emails WR-032 (sense re-inserir al sheet) =====
function sendEmailsWR032() {
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty("SHEET_ID");
  const siteUrl = (props.getProperty("SITE_URL") || "https://www.cbgrupbarna-3x3timechamber.com").replace(/\/$/, "");
  const teamId = "WR-032";
  const qrData = siteUrl + "/equip?id=" + teamId;
  const qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(qrData) + "&color=1a1a1a&bgcolor=ffffff&margin=10";

  const payload = {
    teamId: "WR-032",
    teamName: "The Walking Dead",
    category: "Veterans Masculí",
    packageTitle: "Equip 4 jugadors",
    packageKey: "team4",
    packagePrice: 67.5,
    finalPrice: 67.5,
    discountAmount: 0,
    discountType: "",
    earlyBirdApplied: false,
    socialShareDone: false,
    rgpdConsent: true,
    captain: {
      fullName: "Alberto Marí",
      email: "almari_21@hotmail.com",
      phone: "",
      shirtSize: "L"
    },
    tutor: null,
    players: [
      { fullName: "Alberto Marí",  club: "", birthYear: 1978, shirtSize: "L",   gender: "Masculí" },
      { fullName: "Andreu Puig",   club: "", birthYear: 1984, shirtSize: "XL",  gender: "Masculí" },
      { fullName: "Ignacio Goñi",  club: "", birthYear: 1979, shirtSize: "XXL", gender: "Masculí" },
      { fullName: "Dífac Puig",    club: "", birthYear: 1978, shirtSize: "L",   gender: "Masculí" }
    ]
  };

  sendEmails(payload, "", sheetId);
  Logger.log("sendEmailsWR032: emails enviats ✓ → " + payload.captain.email);
  return "Emails WR-032 enviats ✓";
}

/**
 * Confirma WR-031 Croqueta Mentality al sheet i envia email QR al capità.
 * Executar UNA SOLA VEGADA des de l'editor.
 */
function sendConfirmEmailWR031() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty("SHEET_ID");
  var siteUrl = (props.getProperty("SITE_URL") || "https://www.cbgrupbarna-3x3timechamber.com").replace(/\/$/, "");
  if (!sheetId) return "ERROR: no SHEET_ID";
  var ss = SpreadsheetApp.openById(sheetId);
  var now = new Date();
  var nowStr = Utilities.formatDate(now, "Europe/Madrid", "dd/MM/yyyy HH:mm");

  // 1. Actualitzar sheet: status confirmed + nota
  var inscSheet = ss.getSheetByName("Inscripcions");
  if (inscSheet) {
    var data = inscSheet.getDataRange().getValues();
    var headers = data[0];
    function colIdx(name) {
      for (var i = 0; i < headers.length; i++) if (String(headers[i]).trim() === name) return i;
      return -1;
    }
    var tiCol = colIdx("TeamID");
    for (var r = 1; r < data.length; r++) {
      if (String(data[r][tiCol] || "").trim().toUpperCase() === "WR-031") {
        var stCol   = colIdx("Status");
        var notesCol = colIdx("Notes");
        var qrsCol   = colIdx("QRs Sent");
        if (stCol    >= 0) inscSheet.getRange(r+1, stCol+1).setValue("confirmed");
        if (notesCol >= 0) inscSheet.getRange(r+1, notesCol+1).setValue("Confirmat sense justificant per CB Grup Barna " + nowStr);
        if (qrsCol   >= 0) inscSheet.getRange(r+1, qrsCol+1).setValue("TRUE");
        Logger.log("WR-031 sheet actualitzat fila " + (r+1));
        break;
      }
    }
  }

  // 2. Enviar email de confirmació amb QR
  var ciUrl  = siteUrl + "/check-in/WR-031";
  var qrUrl  = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=" + encodeURIComponent(ciUrl);
  var jugHtml = "<li>Pilar Franco Salcedo</li><li>Nora Jornet Franco</li><li>Mar Montaner Garcia</li><li>Irene Rocamora Martinez</li>";

  var htmlCap =
    "<div style='font-family:Arial,sans-serif;max-width:600px;color:#111;'>" +
    "<div style='background:#111b21;padding:20px 24px;border-radius:10px 10px 0 0;'>" +
      "<h2 style='color:#25d366;margin:0 0 4px;'>✅ Inscripció confirmada!</h2>" +
      "<p style='color:#8696a0;margin:0;font-size:13px;'>3×3 Westfield Glòries 2026 · 6-7 juny · Clot, Barcelona</p>" +
    "</div>" +
    "<div style='border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 10px 10px;'>" +
      "<p>Hola <strong>Pilar</strong>! 🏀</p>" +
      "<p>La inscripció de <strong>Croqueta Mentality</strong> al <strong>3×3 Westfield Glòries 2026</strong> ha quedat <strong style='color:#16a34a;'>confirmada</strong>. Ens veiem al Clot-Glòries el 6-7 de juny!</p>" +
      "<table style='border-collapse:collapse;width:100%;margin:16px 0;font-size:14px;'>" +
        "<tr style='background:#f9fafb;'><th style='padding:8px 12px;text-align:left;border:1px solid #e5e7eb;'>Camp</th><th style='padding:8px 12px;text-align:left;border:1px solid #e5e7eb;'>Detall</th></tr>" +
        "<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;'><b>Codi equip</b></td><td style='padding:8px 12px;border:1px solid #e5e7eb;'><b style='color:#16a34a;font-size:16px;'>WR-031</b></td></tr>" +
        "<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Equip</td><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Croqueta Mentality</td></tr>" +
        "<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Categoria</td><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Cadet Femení</td></tr>" +
        "<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Pack</td><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Equip 4 jugadors · 67,50€</td></tr>" +
        "<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Jugadors</td><td style='padding:8px 12px;border:1px solid #e5e7eb;'><ul style='margin:0;padding-left:18px;'>" + jugHtml + "</ul></td></tr>" +
        "<tr><td style='padding:8px 12px;border:1px solid #e5e7eb;'>Torneig</td><td style='padding:8px 12px;border:1px solid #e5e7eb;'>6-7 juny 2026 · Clot-Glòries, Barcelona</td></tr>" +
      "</table>" +
      "<p><strong>📱 Guarda aquest QR — el necessitaràs per al check-in el dia del torneig:</strong></p>" +
      "<div style='text-align:center;margin:20px 0;'>" +
        "<img src='" + qrUrl + "' alt='QR Check-in WR-031' style='width:200px;height:200px;border:4px solid #25d366;border-radius:12px;'/><br/>" +
        "<a href='" + ciUrl + "' style='font-size:12px;color:#888;'>" + ciUrl + "</a>" +
      "</div>" +
      "<p style='font-size:13px;color:#555;'>Qualsevol dubte, escriu-nos per WhatsApp: <a href='https://wa.me/34698425153'>+34 698 425 153</a></p>" +
      "<hr style='border:none;border-top:1px solid #e5e7eb;margin:20px 0;'/>" +
      "<p style='font-size:12px;color:#888;'>CB Grup Barna · 3×3 Westfield Glòries 2026</p>" +
    "</div></div>";

  GmailApp.sendEmail(
    "pilufranco@gmail.com",
    "✅ Inscripció confirmada · Croqueta Mentality · 3×3 Westfield Glòries 2026",
    "Inscripció confirmada! Croqueta Mentality (WR-031 · Cadet Femení). Torneig: 6-7 juny 2026. Check-in: " + ciUrl,
    { htmlBody: htmlCap, cc: "voluntarisgrupbarna@gmail.com" }
  );

  Logger.log("sendConfirmEmailWR031: email enviat a pilufranco@gmail.com ✓");
  return "WR-031 Croqueta Mentality — status OK + QR enviat a pilufranco@gmail.com ✓";
}

/**
 * Reenviar NOMÉS la notificació admin per a WR-032 (cos en blanc corregit).
 * El mail al capità (almari_21@hotmail.com) va arribar correcte.
 * Executar UNA SOLA VEGADA des de l'editor.
 */
function resendAdminEmailWR032() {
  var props = PropertiesService.getScriptProperties();
  var adminEmail = props.getProperty("ADMIN_EMAIL") || "";
  var sheetId = props.getProperty("SHEET_ID");
  var siteUrl = (props.getProperty("SITE_URL") || "https://www.cbgrupbarna-3x3timechamber.com").replace(/\/$/, "");

  if (!adminEmail) { Logger.log("ERROR: ADMIN_EMAIL no configurat"); return; }

  var payload = {
    teamId: "WR-032",
    teamName: "The Walking Dead",
    category: "Veterans Masculí",
    packageTitle: "Equip 4 jugadors",
    packageKey: "team4",
    packagePrice: 67.5,
    finalPrice: 67.5,
    discountAmount: 0,
    discountType: "",
    captain: {
      fullName: "Alberto Marí",
      email: "almari_21@hotmail.com",
      phone: "",
      shirtSize: "L"
    },
    tutor: null,
    players: [
      { fullName: "Alberto Marí",  club: "", birthYear: 1978, shirtSize: "L",   gender: "Masculí" },
      { fullName: "Andreu Puig",   club: "", birthYear: 1984, shirtSize: "XL",  gender: "Masculí" },
      { fullName: "Ignacio Goñi",  club: "", birthYear: 1979, shirtSize: "XXL", gender: "Masculí" },
      { fullName: "Dífac Puig",    club: "", birthYear: 1978, shirtSize: "L",   gender: "Masculí" }
    ]
  };

  var qrData = siteUrl + "/equip?id=" + payload.teamId;
  var qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(qrData) + "&color=1a1a1a&bgcolor=ffffff&margin=10";
  var ssUrl = sheetId ? SpreadsheetApp.openById(sheetId).getUrl() : "";
  var finalPrice = payload.finalPrice.toFixed(2).replace(".00", "");

  var htmlAdmin = buildAdminEmailHtml(payload, "", qrImageUrl, ssUrl, finalPrice);
  var subject = "[3x3] Nova inscripcio - " + payload.teamName + " - " + payload.category;

  sendToAdmins(adminEmail, subject, htmlAdmin);
  Logger.log("resendAdminEmailWR032: notificacio admin reenviada a " + adminEmail);
  return "Admin email WR-032 reenviat OK";
}

// ===== HELPER: notificació directa a Ana (cos buit corregit) =====
function notifyAnaWR032() {
  var adminEmail = "voluntarisgrupbarna@gmail.com";
  var subject = "🏀 Nova inscripció confirmada — The Walking Dead · WR-032";
  var html = "<h2 style='font-family:Arial;color:#111;'>Nova inscripció confirmada ✅</h2>" +
    "<table border='1' cellpadding='8' cellspacing='0' style='border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;'>" +
    "<tr style='background:#f0f0f0'><th>Camp</th><th>Valor</th></tr>" +
    "<tr><td><b>Codi equip</b></td><td><b style='color:#d00;'>WR-032</b></td></tr>" +
    "<tr><td>Nom equip</td><td>The Walking Dead</td></tr>" +
    "<tr><td>Categoria</td><td>Veterans Masculí</td></tr>" +
    "<tr><td>Pack</td><td>Equip 4 jugadors</td></tr>" +
    "<tr><td>Capità</td><td>Alberto Marí</td></tr>" +
    "<tr><td>Email capità</td><td>almari_21@hotmail.com</td></tr>" +
    "<tr><td>Jugadors</td><td>Alberto Marí · Andreu Puig · Ignacio Goñi · Dífac Puig</td></tr>" +
    "<tr><td>Talles</td><td>L · XL · XXL · L</td></tr>" +
    "<tr><td><b>Import</b></td><td><b>67,50 €</b></td></tr>" +
    "<tr><td>Pagament</td><td>✅ Verificat (BBVA transfer)</td></tr>" +
    "<tr><td>Data</td><td>17/05/2026 14:10</td></tr>" +
    "<tr><td>Check-in</td><td><a href='https://www.cbgrupbarna-3x3timechamber.com/check-in/WR-032'>check-in/WR-032</a></td></tr>" +
    "</table>" +
    "<p style='font-size:12px;color:#888;font-family:Arial;margin-top:16px;'>Inscripció manual via WhatsApp. Registrada per Claude Code el 17/05/2026.</p>";

  GmailApp.sendEmail(adminEmail, subject, "Nova inscripcio WR-032 The Walking Dead confirmada. Import: 67,50 EUR. Capita: Alberto Mari (almari_21@hotmail.com).", { htmlBody: html });
  Logger.log("notifyAnaWR032: email enviat a " + adminEmail + " OK");
  return "Notificacio Ana enviada OK";
}

/**
 * Neteja de duplicats WR-032 al Sheet.
 * Executar UNA SOLA VEGADA des de l'editor o via clasp run.
 * - Esborra fila duplicada de "Inscripcions"
 * - Esborra 4 files duplicades de "Jugadors"
 * - Esborra fila mal alineada de "Inscripcions 2026"
 * - Esborra fila TEST Claude de "Leads"
 */
function fixSheetDuplicates() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty("SHEET_ID");
  if (!sheetId) { Logger.log("SHEET_ID not set"); return "ERROR: no SHEET_ID"; }
  var ss = SpreadsheetApp.openById(sheetId);
  var results = [];

  // --- 1. "Inscripcions" tab: eliminar fila duplicada WR-032 ---
  var inscSheet = ss.getSheetByName("Inscripcions");
  if (inscSheet) {
    var inscData = inscSheet.getDataRange().getValues();
    var inscHeaders = inscData[0];
    var teamIdCol = -1;
    for (var c = 0; c < inscHeaders.length; c++) {
      if (String(inscHeaders[c]).replace(/\s/g,"").toUpperCase().indexOf("TEAMID") !== -1) { teamIdCol = c; break; }
    }
    var wr032Rows = [];
    for (var r = 1; r < inscData.length; r++) {
      if (String(inscData[r][teamIdCol] || "").trim().toUpperCase() === "WR-032") {
        wr032Rows.push(r + 1);
      }
    }
    Logger.log("Inscripcions WR-032 rows: " + JSON.stringify(wr032Rows));
    // Eliminar duplicats (guardar el primer, esborrar la resta) — de baix a dalt
    for (var i = wr032Rows.length - 1; i >= 1; i--) {
      inscSheet.deleteRow(wr032Rows[i]);
      results.push("Inscripcions: eliminada fila " + wr032Rows[i]);
    }
  }

  // --- 2. "Jugadors" tab: eliminar les 4 files duplicades WR-032 ---
  var jugSheet = ss.getSheetByName("Jugadors");
  if (jugSheet) {
    var jugData = jugSheet.getDataRange().getValues();
    var jugHeaders = jugData[0];
    var teamIdColJ = -1;
    for (var c = 0; c < jugHeaders.length; c++) {
      if (String(jugHeaders[c]).replace(/\s/g,"").toUpperCase().indexOf("TEAMID") !== -1) { teamIdColJ = c; break; }
    }
    var wr032PlayerRows = [];
    for (var r = 1; r < jugData.length; r++) {
      if (String(jugData[r][teamIdColJ] || "").trim().toUpperCase() === "WR-032") {
        wr032PlayerRows.push(r + 1);
      }
    }
    Logger.log("Jugadors WR-032 rows: " + JSON.stringify(wr032PlayerRows));
    // Guardar els 4 primers, eliminar la resta (de baix a dalt)
    for (var i = wr032PlayerRows.length - 1; i >= 4; i--) {
      jugSheet.deleteRow(wr032PlayerRows[i]);
      results.push("Jugadors: eliminada fila " + wr032PlayerRows[i]);
    }
  }

  // --- 3. "Inscripcions 2026" tab: eliminar fila WR-032 mal alineada ---
  var insc2026Sheet = ss.getSheetByName("Inscripcions 2026");
  if (insc2026Sheet) {
    var insc2026Data = insc2026Sheet.getDataRange().getValues();
    var oldRows = [];
    for (var r = 1; r < insc2026Data.length; r++) {
      var rowStr = insc2026Data[r].join("|");
      if (rowStr.indexOf("WR-032") !== -1 || rowStr.indexOf("Walking Dead") !== -1) {
        oldRows.push(r + 1);
      }
    }
    Logger.log("Inscripcions 2026 WR-032 rows: " + JSON.stringify(oldRows));
    for (var i = oldRows.length - 1; i >= 0; i--) {
      insc2026Sheet.deleteRow(oldRows[i]);
      results.push("Inscripcions 2026: eliminada fila " + oldRows[i]);
    }
  }

  // --- 4. "Leads" tab: eliminar fila TEST Claude ---
  var leadsSheet = ss.getSheetByName("Leads");
  if (leadsSheet) {
    var leadsData = leadsSheet.getDataRange().getValues();
    var testRows = [];
    for (var r = 1; r < leadsData.length; r++) {
      var rowAll = leadsData[r].join("|").toLowerCase();
      if (rowAll.indexOf("test claude") !== -1 || rowAll.indexOf("600000001") !== -1 || rowAll.indexOf("test lead") !== -1) {
        testRows.push(r + 1);
      }
    }
    Logger.log("Leads TEST rows: " + JSON.stringify(testRows));
    for (var i = testRows.length - 1; i >= 0; i--) {
      leadsSheet.deleteRow(testRows[i]);
      results.push("Leads: eliminada fila " + testRows[i]);
    }
  }

  // --- 5. "Inscripcions" tab: eliminar files de test (TV67C, TEST PROVA CLAUDE, Equip Test) ---
  var TEST_IDS = ["T3X3-2026-TV67C", "TEST PROVA CLAUDE", "Equip Test Automatitzat", "T3X3-2026-AUTO"];
  if (inscSheet) {
    var inscData2 = inscSheet.getDataRange().getValues();
    var testInscRows = [];
    for (var r = 1; r < inscData2.length; r++) {
      var rowStr2 = inscData2[r].join("|");
      var isTest = TEST_IDS.some(function(id) { return rowStr2.indexOf(id) !== -1; });
      if (isTest) testInscRows.push(r + 1);
    }
    Logger.log("Inscripcions TEST rows: " + JSON.stringify(testInscRows));
    for (var i = testInscRows.length - 1; i >= 0; i--) {
      inscSheet.deleteRow(testInscRows[i]);
      results.push("Inscripcions: eliminada fila test " + testInscRows[i]);
    }
  }

  // --- 6. "Jugadors" tab: eliminar jugadors de test ---
  if (jugSheet) {
    var jugData2 = jugSheet.getDataRange().getValues();
    var testJugRows = [];
    for (var r = 1; r < jugData2.length; r++) {
      var rowStr3 = jugData2[r].join("|");
      var isTestJug = TEST_IDS.some(function(id) { return rowStr3.indexOf(id) !== -1; });
      if (isTestJug || rowStr3.indexOf("TV67C") !== -1 || rowStr3.indexOf("Jugador Un Test") !== -1
          || rowStr3.indexOf("Jugador Dos Test") !== -1 || rowStr3.indexOf("Jugador Tres Test") !== -1) {
        testJugRows.push(r + 1);
      }
    }
    Logger.log("Jugadors TEST rows: " + JSON.stringify(testJugRows));
    for (var i = testJugRows.length - 1; i >= 0; i--) {
      jugSheet.deleteRow(testJugRows[i]);
      results.push("Jugadors: eliminada fila test " + testJugRows[i]);
    }
  }

  // --- 7. "Abandonaments" tab: eliminar files de test ---
  var abSheet = ss.getSheetByName("Abandonaments");
  if (abSheet) {
    var abData = abSheet.getDataRange().getValues();
    var testAbRows = [];
    for (var r = 1; r < abData.length; r++) {
      var rowStr4 = abData[r].join("|").toLowerCase();
      if (rowStr4.indexOf("test prova") !== -1 || rowStr4.indexOf("tv67c") !== -1
          || rowStr4.indexOf("test automatitzat") !== -1 || rowStr4.indexOf("test+inscripcio") !== -1) {
        testAbRows.push(r + 1);
      }
    }
    Logger.log("Abandonaments TEST rows: " + JSON.stringify(testAbRows));
    for (var i = testAbRows.length - 1; i >= 0; i--) {
      abSheet.deleteRow(testAbRows[i]);
      results.push("Abandonaments: eliminada fila test " + testAbRows[i]);
    }
  }

  var summary = "fixSheetDuplicates OK: " + (results.length ? results.join(" | ") : "res a fer");
  Logger.log(summary);
  return summary;
}

// ============================================================
// MIGRACIÓ JUGADORS D'EQUIP → COLUMNES J1-J5 a INSCRIPCIONS
// (executada 2026-05-18 — funció conservada per referència)
// ============================================================
function runMigrateJugadorsToInscripcions() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty("SHEET_ID");
  if (!sheetId) return { ok: false, error: "No SHEET_ID" };

  var ss = SpreadsheetApp.openById(sheetId);
  var sheetInsc = ss.getSheetByName("Inscripcions");
  var sheetJug  = ss.getSheetByName("Jugadors");
  if (!sheetInsc) return { ok: false, error: "No s'ha trobat pestanya Inscripcions" };
  if (!sheetJug)  return { ok: false, error: "No s'ha trobat pestanya Jugadors" };

  var log = [];
  var t0 = new Date();

  // Llegir dades
  var inscData = sheetInsc.getDataRange().getValues();
  var jugData  = sheetJug.getDataRange().getValues();
  if (inscData.length < 2) return { ok: false, error: "Inscripcions buida" };
  if (jugData.length < 2)  return { ok: false, error: "Jugadors buida" };

  var inscHeader = inscData[0];
  var jugHeader  = jugData[0];

  // Helper: trobar columna
  function ci(header, name) {
    for (var i = 0; i < header.length; i++) {
      if (String(header[i]).trim().toLowerCase() === name.toLowerCase()) return i;
    }
    return -1;
  }

  // Helper: garantir columna (afegir si no existeix)
  function ensureCol(sheet, header, name) {
    var idx = ci(header, name);
    if (idx !== -1) return idx;
    var newCol = header.length + 1;
    sheet.getRange(1, newCol).setValue(name);
    sheet.getRange(1, newCol).setFontWeight("bold");
    header.push(name);
    return newCol - 1;
  }

  var colInscTeamId = ci(inscHeader, "TeamID");
  var colInscPkg    = ci(inscHeader, "Package");
  if (colInscPkg === -1) colInscPkg = ci(inscHeader, "Concepte");
  if (colInscPkg === -1) colInscPkg = ci(inscHeader, "Tipus");

  var colJugTeamId = ci(jugHeader, "TeamID");
  var colJugName   = ci(jugHeader, "Full Name");
  var colJugYear   = ci(jugHeader, "Birth Year");
  var colJugShirt  = ci(jugHeader, "Shirt Size");

  if (colInscTeamId === -1) return { ok: false, error: "Columna TeamID no trobada a Inscripcions" };
  if (colJugTeamId === -1)  return { ok: false, error: "Columna TeamID no trobada a Jugadors" };
  if (colJugName === -1)    return { ok: false, error: "Columna 'Full Name' no trobada a Jugadors" };

  log.push("Columnes localitzades OK");

  // Afegir columnes J1-J5 a Inscripcions
  var MAX_PLAYERS = 5;
  var playerCols = [];
  for (var i = 1; i <= MAX_PLAYERS; i++) {
    var cNom   = ensureCol(sheetInsc, inscHeader, "J" + i + " Nom");
    var cAny   = ensureCol(sheetInsc, inscHeader, "J" + i + " Any");
    var cTalla = ensureCol(sheetInsc, inscHeader, "J" + i + " Talla");
    playerCols.push({ nom: cNom, any: cAny, talla: cTalla });
  }
  log.push("Columnes J1-J5 preparades");

  // Obtenir TeamIDs vàlids d'equips
  var teamIds = {};
  for (var r = 1; r < inscData.length; r++) {
    var tid = String(inscData[r][colInscTeamId] || "").trim();
    if (!tid) continue;
    var pkg = colInscPkg !== -1 ? String(inscData[r][colInscPkg] || "").toLowerCase() : "";
    var isIndividual = pkg.indexOf("individual") !== -1;
    teamIds[tid] = { row: r + 1, isIndividual: isIndividual };
  }

  // Agrupar jugadors per equip
  var playersByTeam = {};
  var teamPlayerRows = []; // rows a moure a backup (1-indexed)

  for (var r = 1; r < jugData.length; r++) {
    var row = jugData[r];
    var teamId = String(row[colJugTeamId] || "").trim();
    if (!teamId) continue;

    var teamInfo = teamIds[teamId];
    if (!teamInfo) {
      log.push("SKIP jugador fila " + (r+1) + ": TeamID '" + teamId + "' no existeix a Inscripcions");
      continue;
    }
    if (teamInfo.isIndividual) continue; // És individual, no migrem

    if (!playersByTeam[teamId]) playersByTeam[teamId] = [];
    playersByTeam[teamId].push({
      nom:   String(row[colJugName]  || ""),
      any:   String(row[colJugYear]  || ""),
      talla: colJugShirt !== -1 ? String(row[colJugShirt] || "") : "",
      rowIdx: r + 1,
    });
    teamPlayerRows.push(r + 1);
  }

  var numTeams = Object.keys(playersByTeam).length;
  log.push(numTeams + " equips amb jugadors a migrar, " + teamPlayerRows.length + " files de jugadors");

  // Escriure J1-J5 a Inscripcions
  var teamsWritten = 0;
  for (var teamId in playersByTeam) {
    var players = playersByTeam[teamId];
    var teamRow = teamIds[teamId].row;
    for (var j = 0; j < Math.min(players.length, MAX_PLAYERS); j++) {
      var p = players[j];
      var cols = playerCols[j];
      sheetInsc.getRange(teamRow, cols.nom   + 1).setValue(p.nom);
      sheetInsc.getRange(teamRow, cols.any   + 1).setValue(p.any);
      sheetInsc.getRange(teamRow, cols.talla + 1).setValue(p.talla);
    }
    teamsWritten++;
    log.push("  " + teamId + ": " + players.length + " jugadors → fila " + teamRow);
  }
  log.push(teamsWritten + " equips actualitzats a Inscripcions");

  // Crear pestanya backup i moure files (de baix a dalt)
  if (teamPlayerRows.length > 0) {
    var sheetBackup = ss.getSheetByName("Jugadors_BACKUP");
    if (!sheetBackup) {
      sheetBackup = ss.insertSheet("Jugadors_BACKUP");
      var backupHeader = jugHeader.slice();
      backupHeader.push("Migrat_Timestamp");
      sheetBackup.getRange(1, 1, 1, backupHeader.length).setValues([backupHeader]);
      log.push("Pestanya Jugadors_BACKUP creada");
    }

    // Copiar files al backup
    var rowsToBackup = teamPlayerRows.map(function(r) {
      var rowData = jugData[r - 1].slice();
      rowData.push(new Date().toISOString());
      return rowData;
    });
    var lastRow = sheetBackup.getLastRow();
    sheetBackup.getRange(lastRow + 1, 1, rowsToBackup.length, rowsToBackup[0].length)
               .setValues(rowsToBackup);
    log.push(rowsToBackup.length + " files copiades a Jugadors_BACKUP");

    // Eliminar de Jugadors (de baix a dalt)
    var sortedRows = teamPlayerRows.slice().sort(function(a, b) { return b - a; });
    for (var k = 0; k < sortedRows.length; k++) {
      sheetJug.deleteRow(sortedRows[k]);
    }
    log.push(sortedRows.length + " files eliminades de Jugadors");
  }

  var elapsed = ((new Date() - t0) / 1000).toFixed(1);
  log.push("Finalitzat en " + elapsed + "s");

  return {
    ok: true,
    teamsWritten: teamsWritten,
    jugadorsBackup: teamPlayerRows.length,
    elapsed: elapsed + "s",
    log: log.join(" | "),
  };
}
