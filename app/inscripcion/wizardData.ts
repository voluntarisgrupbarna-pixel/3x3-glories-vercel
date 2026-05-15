// Catàleg de paquets i opcions per al wizard d'inscripció 3×3 Westfield Glòries 2026
// Mantingueu sincronitzat amb les FAQ i la pàgina d'inscripció.

export type PackageKey = "individual" | "team-4" | "team-5" | "senior";

export type DiscountType = "earlybird" | "social" | "rival" | null;

export type Package = {
  key: PackageKey;
  emoji: string;
  title: string;
  subtitle: string;
  price: number; // €
  minPlayers: number;
  maxPlayers: number;
  isTeam: boolean;
  description: string;
};

export const PACKAGES: Package[] = [
  {
    key: "individual",
    emoji: "🙋",
    title: "Inscripció individual",
    subtitle: "Sense equip",
    price: 20,
    minPlayers: 1,
    maxPlayers: 1,
    isTeam: false,
    description:
      "Apuntes les teves dades, talla i posició preferida. El club t'assigna a un equip una setmana abans del torneig.",
  },
  {
    key: "team-4",
    emoji: "🏀",
    title: "Equip 4 jugadors",
    subtitle: "Categoria formativa / Veterans",
    price: 75,
    minPlayers: 3,
    maxPlayers: 4,
    isTeam: true,
    description:
      "Equip de 3 a 4 jugadors. Premini, Mini, Infantil, Cadet, Júnior, Sub-23 i Veterans M/F.",
  },
  {
    key: "team-5",
    emoji: "🏀",
    title: "Equip 5 jugadors",
    subtitle: "Categoria general",
    price: 90,
    minPlayers: 4,
    maxPlayers: 5,
    isTeam: true,
    description:
      "Equip de 4-5 jugadors (3 titulars + 2 suplents). Totes les categories formatives i Veterans.",
  },
  {
    key: "senior",
    emoji: "🏆",
    title: "Equip Sènior Pro",
    subtitle: "Punts FIBA · Prize money 2.000 €",
    price: 85,
    minPlayers: 3,
    maxPlayers: 4,
    isTeam: true,
    description:
      "Sènior Masculí o Femení. 4 jugadors. Punts FIBA 3×3 + prize money. (5 jugadors: 90 €, contacta amb nosaltres.)",
  },
];

export const CATEGORIES = [
  "Premini (2016-2017)",
  "Mini (2014-2015)",
  "Infantil (2012-2013)",
  "Cadet (2010-2011)",
  "Júnior (2008-2009)",
  "Sub-23 (2003-2007)",
  "Sènior Masculí",
  "Sènior Femení",
  "Veterans Masculí (fins 1986)",
  "Veterans Femení (fins 1986)",
];

export const POSITIONS = ["Base", "Aler", "Pivot", "Indiferent"];
export const LEVELS = ["Iniciació", "Mig", "Avançat", "Federat"];
export const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const GENDERS = ["Masculí", "Femení", "Altre"];

export const IBAN_INFO = {
  iban: "ES98 0049 1500 0826 1097 0382",
  beneficiary: "CB Grup Barna",
};

// ── Descomptes (acumulables) ───────────────────────────────────────────────
export const EARLY_BIRD_DEADLINE = new Date("2026-05-20T23:59:59+02:00");
export const EARLY_BIRD_PCT      = 0.10; // 10 % sobre el preu base
export const SOCIAL_PCT          = 0.05; // 5 %  sobre el preu base
export const RIVAL_FLAT          = 5;    // −5 € fixos

export function isEarlyBirdActive(): boolean {
  return new Date() < EARLY_BIRD_DEADLINE;
}

export type DiscountResult = {
  earlyBirdAmt : number;
  socialAmt    : number;
  rivalAmt     : number;
  totalDiscount: number;
  finalPrice   : number;
};

/**
 * Calcula tots els descomptes actius sobre `basePrice`.
 * Els tres descomptes s'apliquen sobre el preu base (no en cascada)
 * per simplicitat i transparència.
 */
export function calcDiscount(
  basePrice: number,
  opts: { earlyBird?: boolean; social?: boolean; rivalValid?: boolean },
): DiscountResult {
  const earlyBirdAmt = opts.earlyBird
    ? Math.round(basePrice * EARLY_BIRD_PCT * 100) / 100
    : 0;
  const socialAmt = opts.social
    ? Math.round(basePrice * SOCIAL_PCT * 100) / 100
    : 0;
  const rivalAmt = opts.rivalValid ? RIVAL_FLAT : 0;
  const totalDiscount = earlyBirdAmt + socialAmt + rivalAmt;
  const finalPrice = Math.max(0, Math.round((basePrice - totalDiscount) * 100) / 100);
  return { earlyBirdAmt, socialAmt, rivalAmt, totalDiscount, finalPrice };
}
