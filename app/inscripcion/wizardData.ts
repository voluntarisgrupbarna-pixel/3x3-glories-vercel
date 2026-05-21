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
      "Sènior Masculí o Femení. 4 jugadors. Punts FIBA 3×3 + premi en metàl·lic. (5 jugadors: 90 €, contacta amb nosaltres.)",
  },
];

export const CATEGORIES = [
  "Escoleta Masculí",
  "Escoleta Femení",
  "Premini Masculí",
  "Premini Femení",
  "Mini Masculí",
  "Mini Femení",
  "Preinfantil Masculí",
  "Preinfantil Femení",
  "Infantil Masculí",
  "Infantil Femení",
  "Cadet Masculí",
  "Cadet Femení",
  "Júnior Masculí",
  "Júnior Femení",
  "Sub-23 Masculí",
  "Sub-23 Femení",
  "Sènior Masculí",
  "Sènior Femení",
  "Veterans Masculí",
  "Veterans Femení",
];

export const POSITIONS = ["Base", "Aler", "Pivot", "Indiferent"];
export const LEVELS = ["Iniciació", "Mig", "Avançat", "Federat"];
export const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const GENDERS = ["Masculí", "Femení", "Altre"];

export const IBAN_INFO = {
  iban: "ES25 0182 1797 3002 0387 8558",
  beneficiary: "CB Grup Barna",
};

// ── Descomptes ────────────────────────────────────────────────────────────
export const EARLY_BIRD_DEADLINE = new Date("2026-05-20T23:59:59+02:00");
export const EARLY_BIRD_PCT      = 0.10; // 10 % sobre el preu base
export const SOCIAL_PCT          = 0.05; // 5 %  sobre el preu base
export const RIVAL_FLAT          = 5;    // −5 € fixos

// Codi de fidelitat per a equips participants el 2025
export const PROMO_2025_CODE = "EQUIPS2025";
export const PROMO_2025_PCT  = 0.10; // 10 % — NO acumulable amb Early Bird (s'aplica el més gran)

export function isEarlyBirdActive(): boolean {
  return new Date() < EARLY_BIRD_DEADLINE;
}

export type DiscountResult = {
  earlyBirdAmt : number;
  socialAmt    : number;
  rivalAmt     : number;
  promoAmt     : number;  // EQUIP2025 — exclou earlyBird si ambdós actius
  totalDiscount: number;
  finalPrice   : number;
};

// ── Anys de naixement per categoria (torneig juny 2026) ───────────────────
// [mínim, màxim] — nascut dins aquest rang per competir a la categoria
export const CATEGORY_BIRTH_YEARS: Record<string, [number, number]> = {
  "Escoleta":    [2018, 2020],   // U8
  "Premini":     [2016, 2017],   // U10
  "Mini":        [2014, 2015],   // U12
  "Preinfantil": [2013, 2015],   // intermedi Mini-Infantil
  "Infantil":    [2012, 2013],   // U14
  "Cadet":       [2010, 2011],   // U16
  "Júnior":      [2008, 2009],   // U18
  "Sub-23":      [2003, 2007],   // U23
  "Sènior":      [1960, 2002],   // fins 2002
  "Veterans":    [1900, 1986],   // nascut fins 1986
};

/** Retorna el rang [minAny, maxAny] de la categoria, o null si no es reconeix. */
export function getCategoryBirthRange(cat: string): [number, number] | null {
  for (const [key, range] of Object.entries(CATEGORY_BIRTH_YEARS)) {
    if (cat.startsWith(key)) return range;
  }
  return null;
}

/** Text llegible del rang d'anys per mostrar com a hint. */
export function getCategoryBirthHint(cat: string): string {
  const r = getCategoryBirthRange(cat);
  if (!r) return "";
  if (r[0] === 1900) return `nascut/da fins ${r[1]}`;
  if (r[0] === 1960) return `nascut/da fins ${r[1]}`;
  return `nascut/da entre ${r[0]} i ${r[1]}`;
}

// ── Categories disponibles per paquet ────────────────────────────────────
export const PACKAGE_ALLOWED_CATEGORIES: Record<PackageKey, string[]> = {
  individual: CATEGORIES,
  "team-4":   CATEGORIES.filter((c) => !c.startsWith("Sènior")),
  "team-5":   CATEGORIES.filter((c) => !c.startsWith("Sènior")),
  senior:     CATEGORIES.filter((c) => c.startsWith("Sènior")),
};

/**
 * Calcula tots els descomptes actius sobre `basePrice`.
 * Els tres descomptes s'apliquen sobre el preu base (no en cascada)
 * per simplicitat i transparència.
 */
export function calcDiscount(
  basePrice: number,
  opts: { earlyBird?: boolean; social?: boolean; rivalValid?: boolean; promoValid?: boolean },
): DiscountResult {
  const earlyBirdFull = opts.earlyBird
    ? Math.round(basePrice * EARLY_BIRD_PCT * 100) / 100
    : 0;
  const promoFull = opts.promoValid
    ? Math.round(basePrice * PROMO_2025_PCT * 100) / 100
    : 0;

  // EQUIP2025 i Early Bird NO s'acumulen — s'aplica el més gran dels dos
  const earlyBirdAmt = earlyBirdFull >= promoFull ? earlyBirdFull : 0;
  const promoAmt     = promoFull > earlyBirdFull   ? promoFull     : 0;

  const socialAmt = opts.social
    ? Math.round(basePrice * SOCIAL_PCT * 100) / 100
    : 0;
  const rivalAmt = opts.rivalValid ? RIVAL_FLAT : 0;
  const totalDiscount = earlyBirdAmt + socialAmt + rivalAmt + promoAmt;
  const finalPrice = Math.max(0, Math.round((basePrice - totalDiscount) * 100) / 100);
  return { earlyBirdAmt, socialAmt, rivalAmt, promoAmt, totalDiscount, finalPrice };
}
