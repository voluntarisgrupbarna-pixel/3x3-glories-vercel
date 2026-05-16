/**
 * QR generation — Phase 3
 *
 * Quan validis manualment una inscripció (status: pending_payment → confirmed)
 * al Sheet "Inscripcions", crida `generateAndEmailQrs(teamId)` per:
 *  1. Generar un QR per a l'equip
 *  2. Generar un QR per a cada jugador
 *  3. Guardar-los a la carpeta Drive (en una subcarpeta per equip)
 *  4. Enviar email al capità amb els QRs adjunts (via Apps Script MailApp)
 *
 * Pots executar-ho manualment per a un equip concret, o configurar un trigger
 * onEdit per fer-ho automàticament quan canviï la cel·la Status.
 */

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

function generateQrUrl(content) {
  // QR API gratuïta sense límit fort (qrserver.com)
  return (
    "https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=" +
    encodeURIComponent(content)
  );
}

function generateAndEmailQrs(teamId) {
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty("SHEET_ID");
  const folderId = props.getProperty("DRIVE_FOLDER_ID");
  if (!sheetId || !folderId) throw new Error("SHEET_ID / DRIVE_FOLDER_ID not configured");

  const ss = SpreadsheetApp.openById(sheetId);
  const team = findTeamRow(ss, teamId);
  if (!team) throw new Error("Team not found: " + teamId);

  const players = findPlayersForTeam(ss, teamId);

  // Crear subcarpeta per a l'equip
  const rootFolder = DriveApp.getFolderById(folderId);
  const teamFolderName = teamId + " · " + (team["Team Name"] || "");
  const teamFolder = rootFolder.createFolder(teamFolderName);

  // QR de l'equip
  const teamQrUrl = SITE_URL + "/check-in/" + teamId;
  const teamQrBlob = UrlFetchApp.fetch(generateQrUrl(teamQrUrl))
    .getBlob()
    .setName(teamId + "_QR_equip.png");
  const teamQrFile = teamFolder.createFile(teamQrBlob);

  // QR de cada jugador
  const playerQrFiles = [];
  players.forEach(function (p) {
    const playerQrUrl = SITE_URL + "/jugador/" + p.PlayerID;
    const blob = UrlFetchApp.fetch(generateQrUrl(playerQrUrl))
      .getBlob()
      .setName(p.PlayerID + "_QR.png");
    const file = teamFolder.createFile(blob);
    playerQrFiles.push({ playerId: p.PlayerID, file: file, name: p["Full Name"] });
  });

  // Email al capità amb tot adjunt
  const captainEmail = team["Captain Email"];
  if (!captainEmail) {
    console.warn("No captain email for team " + teamId);
    return { ok: true, teamQrFile: teamQrFile.getUrl(), playerCount: playerQrFiles.length };
  }

  const subject = "3×3 Glòries 2026 · Inscripció confirmada · " + (team["Team Name"] || teamId);
  const playersList = playerQrFiles
    .map(function (p) {
      return "• " + p.name + " (" + p.playerId + ")";
    })
    .join("\n");

  const body =
    "Hola " +
    team["Captain Name"] +
    "!\n\n" +
    "Ja tenim la teva inscripció al 3×3 Westfield Glòries 2026 confirmada.\n\n" +
    "Codi d'equip: " +
    teamId +
    "\n" +
    "Equip: " +
    (team["Team Name"] || "") +
    "\n" +
    "Categoria: " +
    team.Category +
    "\n" +
    "Jugadors: " +
    players.length +
    "\n\n" +
    "Adjuntem:\n" +
    "• 1 QR de l'equip (per al check-in del dia)\n" +
    "• 1 QR per cada jugador\n\n" +
    playersList +
    "\n\n" +
    "Imprimeix-los o porta'ls al mòbil el 6-7 de juny.\n\n" +
    "Ens veiem a Glòries 🏀\n\n" +
    "— CB Grup Barna · Time Chamber · Eix Clot\n" +
    SITE_URL;

  const attachments = [teamQrBlob].concat(
    playerQrFiles.map(function (p) {
      return p.file.getBlob();
    }),
  );

  MailApp.sendEmail({
    to: captainEmail,
    subject: subject,
    body: body,
    attachments: attachments,
    name: "CB Grup Barna · 3×3 Glòries",
  });

  // Marca al sheet que els QRs s'han enviat
  markQrsSent(ss, team._row);

  return {
    ok: true,
    teamQrFile: teamQrFile.getUrl(),
    folderUrl: teamFolder.getUrl(),
    playerCount: playerQrFiles.length,
  };
}

function findTeamRow(ss, teamId) {
  const sheet = ss.getSheetByName("Inscripcions");
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf("TeamID");
  if (idCol === -1) return null;
  for (let r = 1; r < data.length; r++) {
    if (data[r][idCol] === teamId) {
      const obj = { _row: r + 1 };
      headers.forEach(function (h, c) {
        obj[h] = data[r][c];
      });
      return obj;
    }
  }
  return null;
}

function findPlayersForTeam(ss, teamId) {
  const sheet = ss.getSheetByName("Jugadors");
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf("TeamID");
  const result = [];
  for (let r = 1; r < data.length; r++) {
    if (data[r][idCol] === teamId) {
      const obj = {};
      headers.forEach(function (h, c) {
        obj[h] = data[r][c];
      });
      result.push(obj);
    }
  }
  return result;
}

function markQrsSent(ss, rowNum) {
  const sheet = ss.getSheetByName("Inscripcions");
  if (!sheet) return;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const col = headers.indexOf("QRs Sent") + 1;
  if (col > 0) sheet.getRange(rowNum, col).setValue(true);
}

// ===== Manual entry points =====

function generateQrsForTeam_runMe() {
  // Edita el teamId i executa aquesta funció per generar els QRs d'un equip concret.
  generateAndEmailQrs("T3X3-2026-XXXXX");
}

/**
 * (Opcional) Trigger automàtic onEdit: si canvies la cel·la Status d'un equip a "confirmed",
 * dispara la generació de QRs automàticament.
 *
 * Per activar-ho:
 *  1. A l'editor Apps Script: Triggers > Add Trigger
 *  2. Function: onEditTrigger
 *  3. Event source: From spreadsheet · Event type: On edit
 */
function onEditTrigger(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  if (sheet.getName() !== "Inscripcions") return;

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const statusCol = headers.indexOf("Status") + 1;
  const teamIdCol = headers.indexOf("TeamID") + 1;
  const qrsSentCol = headers.indexOf("QRs Sent") + 1;
  if (e.range.getColumn() !== statusCol) return;

  const newValue = String(e.value || "").toLowerCase();
  if (newValue !== "confirmed") return;

  const row = e.range.getRow();
  const alreadySent = sheet.getRange(row, qrsSentCol).getValue();
  if (alreadySent) return;

  const teamId = sheet.getRange(row, teamIdCol).getValue();
  if (!teamId) return;

  try {
    generateAndEmailQrs(teamId);
  } catch (err) {
    console.error("onEditTrigger error for " + teamId + ": " + err);
  }
}
