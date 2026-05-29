/**
 * Completar Dades — handler quan els equips ompliren completar.html
 * + Mail Merge per enviar formularis a tots els equips
 *
 * Per fer servir:
 * 1. doPost ja redirigeix accions a aquests handlers
 * 2. Per a mail merge: executar crearEsborranysCompletar() des del editor
 *
 * @version 1.0 (29/05/2026)
 */

const NOTIFICATION_EMAIL_AC = 'voluntarisgrupbarna@gmail.com';
const BASE_URL_AC = 'https://www.cbgrupbarna-3x3timechamber.com/completar';
const COMPLETAR_SHEET = 'completar_dades';
const TEST_MODE_AC = false;
const TEST_EMAIL_AC = 'voluntarisgrupbarna@gmail.com';

/**
 * Handler que es crida des de doPost quan action === 'completar' o 'completar_dades'.
 * Guarda les dades al Sheet i envia notificació a Ana.
 */
function handleCompletar(payload) {
  try {
    guardarSubmissioCompletar_(payload);
    enviarNotificacioAna_(payload);
    return {
      ok: true,
      message: 'Dades guardades. Gràcies!',
      id: payload.id || payload.team_id || ''
    };
  } catch (err) {
    console.error('handleCompletar error', err);
    return { ok: false, error: String(err && err.message ? err.message : err) };
  }
}

function guardarSubmissioCompletar_(d) {
  const sheetId = getSheetId_();
  const ss = SpreadsheetApp.openById(sheetId);
  let sh = ss.getSheetByName(COMPLETAR_SHEET);

  if (!sh) {
    sh = ss.insertSheet(COMPLETAR_SHEET);
    sh.appendRow([
      'timestamp','id','nom_equip','categoria',
      'capita_nom','capita_genere','capita_email','capita_telefon',
      'tutor_nom','tutor_telefon',
      'j1_nom','j1_any','j1_gen','j1_club','j1_talla',
      'j2_nom','j2_any','j2_gen','j2_club','j2_talla',
      'j3_nom','j3_any','j3_gen','j3_club','j3_talla',
      'j4_nom','j4_any','j4_gen','j4_club','j4_talla',
      'j5_nom','j5_any','j5_gen','j5_club','j5_talla',
      'notes','rgpd','imatge','tipus'
    ]);
    sh.setFrozenRows(1);
    sh.getRange(1,1,1,39).setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff');
  }

  const jugs = d.jugadors || [];
  const row = [
    new Date(),
    d.id || d.team_id || '',
    d.team || d.nom_equip || '',
    d.cat || d.categoria || '',
    d.cap_nom || d.capita_nom || d.cap || '',
    d.cap_gen || d.capita_genere || '',
    d.email || d.capita_email || '',
    d.phone || d.capita_telefon || '',
    d.tutor_nom || '',
    d.tutor_telefon || ''
  ];
  for (let i = 0; i < 5; i++) {
    const j = jugs[i] || {};
    row.push(j.nom || '', j.any || '', j.gen || j.genere || '', j.club || '', j.talla || '');
  }
  row.push(
    d.notes || '',
    d.rgpd ? 'SI' : 'NO',
    d.imatge ? 'SI' : 'NO',
    (d.individual || d.tipus === 'individual') ? 'individual' : 'equip'
  );
  sh.appendRow(row);
}

function enviarNotificacioAna_(d) {
  const jugs = d.jugadors || [];
  const esIndiv = d.individual || d.tipus === 'individual';
  const team = d.team || d.nom_equip || '(sense nom)';
  const tipus = esIndiv ? 'INDIVIDUAL' : 'EQUIP';
  const camps = comptarCampsOmplits_(d);
  const subject = '[3x3] ' + tipus + ' ha completat dades: ' + team + ' (' + camps.omplits + '/' + camps.total + ' camps)';

  let jugadorsHtml = '';
  const maxJ = esIndiv ? 1 : 5;
  for (let i = 0; i < maxJ; i++) {
    const j = jugs[i] || {};
    const isEmpty = !j.nom && !j.any && !j.talla;
    if (isEmpty && i >= 3) continue;
    const bg = isEmpty ? '#fef2f2' : (i % 2 === 0 ? '#f9fafb' : '#ffffff');
    const numColor = isEmpty ? '#9ca3af' : '#c8102e';
    jugadorsHtml += '<tr>' +
      '<td style="padding:8px 12px;background:' + bg + ';border-bottom:1px solid #e5e7eb;font-weight:700;color:' + numColor + ';width:30px;text-align:center;">' + (i + 1) + '</td>' +
      '<td style="padding:8px 12px;background:' + bg + ';border-bottom:1px solid #e5e7eb;">' + (escapar__(j.nom) || '<span style="color:#b91c1c;font-style:italic;">— buit —</span>') + '</td>' +
      '<td style="padding:8px 12px;background:' + bg + ';border-bottom:1px solid #e5e7eb;color:#6b7280;text-align:center;">' + (escapar__(j.any) || '—') + '</td>' +
      '<td style="padding:8px 12px;background:' + bg + ';border-bottom:1px solid #e5e7eb;color:#6b7280;text-align:center;">' + (escapar__(j.gen || j.genere) || '—') + '</td>' +
      '<td style="padding:8px 12px;background:' + bg + ';border-bottom:1px solid #e5e7eb;color:#6b7280;">' + (escapar__(j.club) || '<span style="color:#b91c1c;">—</span>') + '</td>' +
      '<td style="padding:8px 12px;background:' + bg + ';border-bottom:1px solid #e5e7eb;text-align:center;">' +
      (j.talla ? '<span style="background:#fed7aa;color:#7c2d12;padding:2px 8px;border-radius:10px;font-weight:700;font-size:11px;">' + escapar__(j.talla) + '</span>' : '<span style="color:#b91c1c;">—</span>') +
      '</td></tr>';
  }

  const okColor = camps.pendents === 0 ? '#16a34a' : '#f59e0b';
  const okBg = camps.pendents === 0 ? '#dcfce7' : '#fef3c7';
  const okText = camps.pendents === 0 ? '#166534' : '#92400e';

  const html = '<!DOCTYPE html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#111827;line-height:1.5;max-width:760px;margin:0 auto;padding:20px;">' +
    '<div style="background:linear-gradient(135deg,#c8102e,#8b0a1f);color:white;padding:20px 24px;border-radius:10px 10px 0 0;">' +
      '<div style="font-size:13px;opacity:.85;letter-spacing:1px;text-transform:uppercase;">📥 NOTIFICACIÓ AUTOMÀTICA · 3x3 Westfield Glòries 2026</div>' +
      '<div style="font-size:22px;font-weight:800;margin-top:6px;">' + escapar__(team) + ' ha completat dades</div>' +
      '<div style="font-size:13px;opacity:.9;margin-top:4px;">' + tipus + ' · ' + camps.omplits + '/' + camps.total + ' camps · ' + (camps.pendents > 0 ? '⚠ ' + camps.pendents + ' pendents' : '✅ tot complet') + '</div>' +
    '</div>' +
    '<div style="background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;padding:24px;">' +
      '<div style="background:' + okBg + ';border-left:4px solid ' + okColor + ';padding:12px 14px;border-radius:4px;font-size:13px;color:' + okText + ';margin-bottom:18px;">' +
        (camps.pendents === 0 ? '✅ <strong>Totes les dades estan completes.</strong>' : '⚠ <strong>Encara falten ' + camps.pendents + ' camps.</strong> Pots fer recordatori per WA.') +
      '</div>' +
      '<div style="background:#f9fafb;border-radius:8px;padding:16px;margin:18px 0;border:1px solid #e5e7eb;">' +
        '<div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">DADES GENERALS</div>' +
        '<table style="width:100%;font-size:14px;">' +
          '<tr><td style="color:#6b7280;width:140px;padding:3px 0;">Equip</td><td><strong>' + escapar__(team) + '</strong></td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">Categoria</td><td>' + (escapar__(d.cat || d.categoria) || '<span style="color:#b91c1c;">— buit —</span>') + '</td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">Codi</td><td style="font-family:monospace;">' + escapar__(d.id || d.team_id) + '</td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">Tipus</td><td>' + tipus + '</td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">Submissió</td><td>' + new Date().toLocaleString('ca-ES') + '</td></tr>' +
        '</table>' +
      '</div>' +
      '<div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:18px 0;border:1px solid #bfdbfe;">' +
        '<div style="font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">CAPITÀ / TUTOR</div>' +
        '<table style="width:100%;font-size:14px;">' +
          '<tr><td style="color:#6b7280;width:140px;padding:3px 0;">Nom</td><td><strong>' + escapar__(d.cap_nom || d.capita_nom || d.cap) + '</strong></td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">Gènere</td><td>' + (escapar__(d.cap_gen || d.capita_genere) || '—') + '</td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">Email</td><td><a href="mailto:' + escapar__(d.email || d.capita_email) + '" style="color:#c8102e;">' + escapar__(d.email || d.capita_email) + '</a></td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">Mòbil</td><td><a href="https://wa.me/34' + String(d.phone || d.capita_telefon || '').replace(/[^0-9]/g,'') + '" style="color:#16a34a;">' + escapar__(d.phone || d.capita_telefon) + '</a></td></tr>' +
          (d.tutor_nom ? '<tr><td style="color:#6b7280;padding:3px 0;">Tutor</td><td>' + escapar__(d.tutor_nom) + ' · ' + escapar__(d.tutor_telefon) + '</td></tr>' : '') +
        '</table>' +
      '</div>' +
      (!esIndiv ?
        '<div style="margin:18px 0;">' +
          '<div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">PLANTILLA</div>' +
          '<table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;font-size:13px;">' +
            '<thead><tr style="background:#1f2937;color:white;">' +
              '<th style="padding:10px;text-align:center;width:30px;">#</th>' +
              '<th style="padding:10px;text-align:left;">Nom i cognoms</th>' +
              '<th style="padding:10px;text-align:center;width:60px;">Any</th>' +
              '<th style="padding:10px;text-align:center;width:50px;">Gen</th>' +
              '<th style="padding:10px;text-align:left;">Club</th>' +
              '<th style="padding:10px;text-align:center;width:60px;">Talla</th>' +
            '</tr></thead>' +
            '<tbody>' + jugadorsHtml + '</tbody>' +
          '</table>' +
        '</div>' :
        '<div style="background:#fef9c3;border-radius:8px;padding:16px;margin:18px 0;border:1px solid #fde047;">' +
          '<div style="font-size:11px;font-weight:700;color:#854d0e;text-transform:uppercase;margin-bottom:10px;">DADES INDIVIDUAL</div>' +
          '<table style="width:100%;font-size:14px;">' +
            '<tr><td style="color:#6b7280;width:140px;padding:3px 0;">Any naixement</td><td>' + escapar__(jugs[0] && jugs[0].any) + '</td></tr>' +
            '<tr><td style="color:#6b7280;padding:3px 0;">Gènere</td><td>' + escapar__(jugs[0] && (jugs[0].gen || jugs[0].genere)) + '</td></tr>' +
            '<tr><td style="color:#6b7280;padding:3px 0;">Club origen</td><td>' + escapar__(jugs[0] && jugs[0].club) + '</td></tr>' +
            '<tr><td style="color:#6b7280;padding:3px 0;">Talla samarreta</td><td><span style="background:#fed7aa;color:#7c2d12;padding:2px 10px;border-radius:10px;font-weight:700;">' + escapar__(jugs[0] && jugs[0].talla) + '</span></td></tr>' +
          '</table>' +
        '</div>'
      ) +
      '<div style="background:#f9fafb;border-radius:8px;padding:12px 16px;margin:18px 0;border:1px solid #e5e7eb;font-size:13px;">' +
        '<span style="color:#6b7280;">RGPD:</span> <strong style="color:' + (d.rgpd ? '#166534' : '#b91c1c') + ';">' + (d.rgpd ? '✅ SÍ' : '❌ NO') + '</strong> &nbsp; · &nbsp;' +
        '<span style="color:#6b7280;">Drets imatge:</span> <strong style="color:' + (d.imatge ? '#166534' : '#9ca3af') + ';">' + (d.imatge ? '✅ SÍ' : '⚪ no') + '</strong>' +
      '</div>' +
      (d.notes ? '<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 14px;border-radius:4px;margin:18px 0;"><div style="font-size:11px;font-weight:700;color:#92400e;margin-bottom:4px;">COMENTARIS:</div><div style="color:#92400e;font-size:14px;">' + escapar__(d.notes) + '</div></div>' : '') +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:24px;">' +
        '<a href="https://www.cbgrupbarna-3x3timechamber.com/dashboard.html" style="background:#c8102e;color:white;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">📊 Dashboard</a>' +
        '<a href="mailto:' + escapar__(d.email || d.capita_email) + '" style="background:#1e40af;color:white;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">📧 Respondre</a>' +
        '<a href="https://wa.me/34' + String(d.phone || d.capita_telefon || '').replace(/[^0-9]/g,'') + '" style="background:#16a34a;color:white;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">💬 WhatsApp</a>' +
      '</div>' +
    '</div>' +
    '<div style="text-align:center;color:#9ca3af;font-size:11px;margin-top:14px;">Notif. automàtica · CB Grup Barna · ' + new Date().toLocaleString('ca-ES') + '</div>' +
  '</body></html>';

  GmailApp.sendEmail(NOTIFICATION_EMAIL_AC, subject, generarTextNotifAC_(d, camps), {
    htmlBody: html,
    name: '3x3 Bot — CB Grup Barna'
  });
}

function generarTextNotifAC_(d, camps) {
  const jugs = d.jugadors || [];
  const esIndiv = d.individual || d.tipus === 'individual';
  let t = '=== ' + (esIndiv ? 'INDIVIDUAL' : 'EQUIP') + ' COMPLETAT ===\n\n';
  t += 'Equip: ' + (d.team || d.nom_equip) + '\n';
  t += 'ID: ' + (d.id || d.team_id) + '\n';
  t += 'Categoria: ' + (d.cat || d.categoria) + '\n';
  t += 'Omplerts: ' + camps.omplits + '/' + camps.total + (camps.pendents > 0 ? ' (FALTEN ' + camps.pendents + ')' : ' OK') + '\n\n';
  t += 'Capità: ' + (d.cap_nom || d.cap) + '\n';
  t += 'Email: ' + (d.email || d.capita_email) + '\n';
  t += 'Mòbil: ' + (d.phone || d.capita_telefon) + '\n\n';
  if (!esIndiv) {
    t += '--- JUGADORS ---\n';
    jugs.forEach((j, i) => {
      t += (i + 1) + '. ' + (j.nom || '—') + ' | ' + (j.any || '—') + ' | ' + (j.gen || j.genere || '—') + ' | ' + (j.club || '—') + ' | t: ' + (j.talla || '—') + '\n';
    });
  } else {
    const j = jugs[0] || {};
    t += 'Any: ' + (j.any || '—') + ' | Gen: ' + (j.gen || j.genere || '—') + ' | Club: ' + (j.club || '—') + ' | Talla: ' + (j.talla || '—') + '\n';
  }
  t += '\nRGPD: ' + (d.rgpd ? 'SI' : 'NO') + ' | Imatge: ' + (d.imatge ? 'SI' : 'no') + '\n';
  if (d.notes) t += 'Comentaris: ' + d.notes + '\n';
  t += '\nDashboard: https://www.cbgrupbarna-3x3timechamber.com/dashboard.html';
  return t;
}

function comptarCampsOmplits_(d) {
  const esIndiv = d.individual || d.tipus === 'individual';
  let omplits = 0, total = 0;
  [d.team || d.nom_equip, d.cat || d.categoria, d.cap_nom || d.cap, d.email || d.capita_email, d.phone || d.capita_telefon].forEach(c => { total++; if (c) omplits++; });
  total++; if (d.rgpd) omplits++;
  const jugs = d.jugadors || [];
  const max = esIndiv ? 1 : 4;
  for (let i = 0; i < max; i++) {
    const j = jugs[i] || {};
    ['nom','any','club','talla'].forEach(c => { total++; if (j[c]) omplits++; });
  }
  return { omplits, total, pendents: total - omplits };
}

function escapar__(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

function getSheetId_() {
  try {
    const sid = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    if (sid) return sid;
  } catch(e) {}
  return '1MG5_8cmeKOe5Jz8BWiJ2e1K669EcIdNNHN1gFGI2uPA';
}

// =========================================================================
// MAIL MERGE — Crear esborranys per a tots els equips
// =========================================================================

/**
 * Crea 60+ esborranys de Gmail (un per equip) amb link personalitzat al completar.html
 * EXECUTAR MANUALMENT des de l'editor del script.
 */
function crearEsborranysCompletar() {
  const equips = llegirEquipsPerMailMerge_();
  let creats = 0, saltats = 0;
  const log = [];

  equips.forEach(e => {
    if (!e.email || e.email.indexOf('@') < 0) {
      saltats++;
      log.push('SALTAT: ' + e.team);
      return;
    }
    const destinatari = TEST_MODE_AC ? TEST_EMAIL_AC : e.email;
    GmailApp.createDraft(
      destinatari,
      '3x3 Westfield Glòries 2026 — Confirma o completa les dades de ' + e.team,
      generarTextMailMerge_(e),
      {
        bcc: NOTIFICATION_EMAIL_AC,
        htmlBody: generarHTMLMailMerge_(e),
        name: 'Ana Fernández — CB Grup Barna'
      }
    );
    creats++;
    log.push('✓ ' + e.team + ' → ' + destinatari);
  });

  Logger.log('=== ESBORRANYS CREATS ===');
  Logger.log('Total: ' + creats + ' creats, ' + saltats + ' saltats');
  log.forEach(l => Logger.log(l));
  return { creats, saltats };
}

function llegirEquipsPerMailMerge_() {
  const sheetId = getSheetId_();
  const ss = SpreadsheetApp.openById(sheetId);
  const result = [];

  // Buscar pestanya inscripcions (pot ser que es digui diferent)
  const possibleNames = ['inscripcions', 'inscripcion', 'equips', 'teams', 'Sheet1'];
  let sh = null;
  for (const name of possibleNames) {
    sh = ss.getSheetByName(name);
    if (sh) break;
  }
  if (!sh) sh = ss.getSheets()[0]; // primer Sheet com a fallback

  if (sh) {
    const data = sh.getDataRange().getValues();
    const headers = data[0].map(h => String(h).toLowerCase().trim());
    const idx = (n) => headers.indexOf(n);
    const colId = idx('codi_wr') >= 0 ? idx('codi_wr') : idx('id') >= 0 ? idx('id') : idx('team_id');
    const colTeam = idx('nom_equip') >= 0 ? idx('nom_equip') : idx('equip') >= 0 ? idx('equip') : idx('team');
    const colCat = idx('categoria') >= 0 ? idx('categoria') : idx('cat');
    const colDia = idx('dia');
    const colCap = idx('capita') >= 0 ? idx('capita') : idx('cap');
    const colEmail = idx('email');
    const colPhone = idx('telefon') >= 0 ? idx('telefon') : idx('phone');
    const colTipus = idx('tipus');

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (colId < 0 || !row[colId] || colTeam < 0 || !row[colTeam]) continue;
      result.push({
        id: String(row[colId]).trim(),
        team: String(row[colTeam]).trim(),
        cat: colCat >= 0 ? String(row[colCat]).trim() : '',
        dia: colDia >= 0 ? String(row[colDia]).trim() : '',
        cap: colCap >= 0 ? String(row[colCap]).trim() : '',
        email: colEmail >= 0 ? String(row[colEmail]).trim() : '',
        phone: colPhone >= 0 ? String(row[colPhone]).trim() : '',
        individual: colTipus >= 0 ? String(row[colTipus]).toLowerCase() === 'individual' : false
      });
    }
  }

  return result;
}

function generarHTMLMailMerge_(e) {
  const link = BASE_URL_AC + '?id=' + encodeURIComponent(e.id);
  const nom = (e.cap || '').split(' ')[0] || 'amic/amiga';
  const isIndiv = e.individual;
  const tipus = isIndiv ? 'Inscripció individual' : 'Equip';

  return '<!DOCTYPE html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#111827;line-height:1.5;max-width:640px;margin:0 auto;padding:20px;">' +
    '<div style="background:linear-gradient(135deg,#c8102e,#8b0a1f);color:white;padding:20px 24px;border-radius:10px 10px 0 0;text-align:center;">' +
      '<div style="font-size:13px;opacity:.85;letter-spacing:1px;">CB GRUP BARNA</div>' +
      '<div style="font-size:22px;font-weight:800;margin-top:4px;">3x3 Westfield Glòries 2026</div>' +
      '<div style="font-size:13px;opacity:.85;margin-top:4px;">6 i 7 de juny · Westfield Glòries, Barcelona</div>' +
    '</div>' +
    '<div style="background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;padding:24px;">' +
      '<p><strong>Hola ' + escapar__(nom) + '!</strong></p>' +
      '<p>Estem ultimant l\'organització del 3x3. Et demanem que <strong>confirmis o completis les dades</strong> de ' + (isIndiv ? 'la teva inscripció' : 'el teu equip') + ' <strong>' + escapar__(e.team) + '</strong>.</p>' +
      '<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 14px;border-radius:4px;font-size:13px;color:#92400e;margin:18px 0;">⏱️ <strong>Triga menys d\'1 minut.</strong></div>' +
      '<div style="text-align:center;margin:24px 0;">' +
        '<a href="' + link + '" style="display:inline-block;background:linear-gradient(135deg,#c8102e,#8b0a1f);color:white;padding:16px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">➡️ COMPLETAR / CONFIRMAR DADES</a>' +
        '<div style="font-size:11px;color:#6b7280;margin-top:8px;">Si el botó no va: <a href="' + link + '" style="color:#c8102e;">' + link + '</a></div>' +
      '</div>' +
      '<div style="background:#f9fafb;border-radius:8px;padding:16px;margin:18px 0;border:1px solid #e5e7eb;">' +
        '<div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;margin-bottom:10px;">QUÈ ET DEMANEM</div>' +
        '<ul style="margin:0;padding-left:22px;font-size:14px;">' +
          '<li>Dades del ' + (isIndiv ? 'jugador' : 'capità/tutor') + ': nom, gènere, email, mòbil</li>' +
          (!isIndiv ? '<li>Si algun jugador és menor: nom del tutor/a responsable</li>' : '') +
          '<li>De cada jugador: nom, any naixement, gènere, club, talla samarreta</li>' +
          '<li>Consentiment RGPD i drets d\'imatge</li>' +
        '</ul>' +
      '</div>' +
      '<div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:18px 0;border:1px solid #bfdbfe;">' +
        '<div style="font-size:11px;font-weight:700;color:#1e40af;letter-spacing:1px;margin-bottom:10px;">DADES ACTUALS</div>' +
        '<table style="width:100%;font-size:14px;">' +
          '<tr><td style="color:#6b7280;width:130px;padding:3px 0;">' + tipus + '</td><td><strong>' + escapar__(e.team) + '</strong></td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">Categoria</td><td>' + (escapar__(e.cat) || '⚠ pendent') + '</td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">Data</td><td>' + (escapar__(e.dia) || '⚠ pendent') + '</td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">' + (isIndiv ? 'Jugador' : 'Capità') + '</td><td>' + (escapar__(e.cap) || '⚠ pendent') + '</td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">Email</td><td>' + escapar__(e.email) + '</td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">Mòbil</td><td>' + (escapar__(e.phone) || '⚠ pendent') + '</td></tr>' +
          '<tr><td style="color:#6b7280;padding:3px 0;">Codi</td><td style="font-family:monospace;">' + escapar__(e.id) + '</td></tr>' +
        '</table>' +
      '</div>' +
      '<p>Si tens dubtes, em truques al <strong>698 425 153</strong> o respons a aquest correu.</p>' +
      '<p><strong>Ana Fernández</strong><br><span style="color:#6b7280;font-size:13px;">Coordinadora — CB Grup Barna</span></p>' +
      '<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">' +
      '<div style="color:#6b7280;font-size:13px;">' +
        '<p><strong>[ES]</strong> Hola ' + escapar__(nom) + ', ultimando el 3x3. Confirma/completa los datos de tu ' + (isIndiv ? 'inscripción' : 'equipo') + ' <strong>' + escapar__(e.team) + '</strong>. Link: <a href="' + link + '" style="color:#c8102e;">' + link + '</a> — Te pediremos datos del ' + (isIndiv ? 'jugador' : 'capitán/tutor') + ' y de cada jugador (nombre, año, género, club, talla). RGPD + imagen. Menos de 1 minuto. ¡Cualquier duda me dices! — Ana</p>' +
      '</div>' +
    '</div>' +
    '<div style="text-align:center;color:#9ca3af;font-size:11px;margin-top:14px;">CB Grup Barna · Sant Martí, Barcelona</div>' +
  '</body></html>';
}

function generarTextMailMerge_(e) {
  const link = BASE_URL_AC + '?id=' + encodeURIComponent(e.id);
  const nom = (e.cap || '').split(' ')[0] || 'amic';
  const isIndiv = e.individual;
  return 'Hola ' + nom + '!\n\n' +
    'Estem ultimant el 3x3 Westfield Glòries 2026 (6-7 de juny). Et demanem que confirmis o completis les dades de ' + (isIndiv ? 'la teva inscripció' : 'el teu equip') + ' ' + e.team + '.\n\n' +
    '➡️ COMPLETAR DADES (menys d\'1 minut):\n' + link + '\n\n' +
    'Et demanem: dades del ' + (isIndiv ? 'jugador' : 'capità/tutor') + ', i de cada jugador (nom, any, gènere, club, talla samarreta) + RGPD.\n\n' +
    'Codi: ' + e.id + '\nCategoria: ' + (e.cat || 'pendent') + '\n\n' +
    'Dubtes: 698 425 153 o respon aquest correu.\n\nAna Fernández — CB Grup Barna\n\n' +
    '[ES] Hola ' + nom + ', confirma/completa los datos de ' + e.team + ' en: ' + link + ' (datos del ' + (isIndiv ? 'jugador' : 'capitán/tutor') + ' + de cada jugador). RGPD obligatorio. Menos de 1 minuto. Cualquier duda: 698 425 153 — Ana';
}

function testNotificacioCompletar() {
  enviarNotificacioAna_({
    id: 'TEST-001',
    team: 'EQUIP PROVA',
    cat: 'Cadet M',
    cap_nom: 'Ana Test',
    cap_gen: 'F',
    email: 'test@example.com',
    phone: '698425153',
    jugadors: [
      { nom: 'Jugador 1', any: 2010, gen: 'M', club: 'CB Test', talla: 'M' },
      { nom: 'Jugador 2', any: 2010, gen: 'M', club: 'CB Test', talla: 'L' },
      { nom: '', any: '', gen: '', club: '', talla: '' },
      { nom: '', any: '', gen: '', club: '', talla: '' }
    ],
    rgpd: true,
    imatge: true,
    notes: 'Test OK'
  });
  Logger.log('Notif test enviada a ' + NOTIFICATION_EMAIL_AC);
}
