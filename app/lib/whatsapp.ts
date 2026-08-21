/**
 * WhatsApp utilities — 3×3 Westfield Glòries 2026
 * Número oficial: +34 698 425 153
 */

export const WA_PHONE = "34698425153";

/**
 * Missatge pre-omplert per al botó general de contacte per WhatsApp.
 * La 3a edició (6-7 juny 2026) ja s'ha celebrat i les inscripcions estan
 * tancades: aquest botó ja NO ha de demanar dades d'equip ni justificant
 * de pagament, només obrir la conversa perquè el club respongui.
 */
const CONTACT_TEMPLATE = `Hola! 👋 Us escric sobre el 3×3 Westfield Glòries.

La 3a edició (6-7 juny 2026) ja s'ha celebrat. Voldria saber:`;

/** URL wa.me per obrir WhatsApp amb el missatge de contacte pre-omplert */
export const WA_REGISTER_URL =
  `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(CONTACT_TEMPLATE)}`;

/**
 * Pàgina de pre-registre: recull dades de l'equip, guarda a Sheets
 * via /api/inscripcio i obre WhatsApp per enviar el justificant.
 * Usa el mateix wizard que /inscripcion però amb waFlow=true.
 */
export const WA_INSCRIPCIO_URL = "/inscripcio-wa";

/**
 * Pàgina de registre WhatsApp: formulari amb estètica WA,
 * guarda a Sheets i obre WhatsApp amb missatge pre-omplert.
 */
export const WA_REGISTRE_URL = "/wa-registre";

/** URL wa.me per compartir el torneig (sense destí — broadcast) */
export function buildShareWaUrl() {
  const text = [
    "🏀 3×3 Westfield Glòries — Barcelona",
    "CB Grup Barna, Time Chamber i Eix Clot van organitzar el torneig de bàsquet 3x3 urbà: 113 equips, rècord de l'edició 2026.",
    "Fotos i resultats 👉 https://www.cbgrupbarna-3x3timechamber.com",
  ].join("\n");
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
