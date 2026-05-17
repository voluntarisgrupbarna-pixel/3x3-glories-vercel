/**
 * WhatsApp utilities — 3×3 Westfield Glòries 2026
 * Número oficial: +34 698 425 153
 */

export const WA_PHONE = "34698425153";

/**
 * Missatge pre-omplert per a inscripció directa via WhatsApp.
 * L'usuari obre WhatsApp, veu la plantilla i l'omple.
 * En enviar-la, Ana rep el número + totes les dades de l'equip.
 */
const REGISTER_TEMPLATE = `Hola Ana! 👋 Vull inscriure el meu equip al 3×3 Westfield Glòries 2026 (6-7 juny).

🏀 NOM EQUIP:
📂 CATEGORIA: (Veteranos / Sènior Masc / Sènior Fem / Cadet Masc / Cadet Fem / Mini / Magics)
👤 CAPITÀ/ANA:
   Nom i cognoms:
   Telèfon:
   Email:
   Talla samarreta: (XS/S/M/L/XL/XXL)

👥 JUGADORS (nom + any naix. + talla):
1.
2.
3.
4. (opcional)

💳 PAGAMENT:
He fet transferència de ___ € a:
IBAN: ES25 0182 1797 3002 0387 8558
Titular: CB GRUP BARNA
Concepte: [NOM EQUIP] 3X3`;

/** URL wa.me per obrir WhatsApp amb la plantilla d'inscripció pre-omplerta */
export const WA_REGISTER_URL =
  `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(REGISTER_TEMPLATE)}`;

/** URL wa.me per compartir el torneig (sense destí — broadcast) */
export function buildShareWaUrl() {
  const text = [
    "🏀 Juga el 3x3 a Westfield Glòries!",
    "CB Grup Barna organitza el torneig de bàsquet 3x3 urbà el 6-7 de juny.",
    "Inscriu el teu equip 👉 https://www.cbgrupbarna-3x3timechamber.com",
  ].join("\n");
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
