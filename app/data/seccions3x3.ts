export const CATEGORIES = [
  { name: "SÈNIORS",              gender: "♂ ♀", desc: "Premi en Metàl·lic 1.000€ · Punts Rànquing FIBA",        badge: "FIBA OFFICIAL", badgeColor: "#ef4444", price: "90€ (5 jug.)", day: 6, dayColor: "#f97316" },
  { name: "SÈNIOR AMATEUR",             gender: "♂ ♀", desc: "Trofeus i medalles · Esport intergeneracional +35", badge: "+35 ANYS",     badgeColor: "#06b6d4", price: "85€ (4 jug.)", day: 6, dayColor: "#f97316" },
  { name: "ESCOLETA",                   gender: "♂ ♀", desc: "Els més petits · Iniciació al bàsquet 3×3",          badge: "U8",           badgeColor: "#22c55e", price: "75€ (4 jug.)", day: 6, dayColor: "#f97316" },
  { name: "MÀGICS · INCLUSIVA",   gender: "♂ ♀", desc: "Categoria inclusiva Barna Màgics · Novetat 2026.", badge: "INCLUSIVA",    badgeColor: "#ec4899", price: "75€ (4 jug.)", day: 7, dayColor: "#60a5fa" },
  { name: "U18 JUNIOR",           gender: "♂ ♀", desc: "Categoria juvenil d'alt nivell",                   badge: "JUVENIL",      badgeColor: "#3b82f6", price: "75€ (4 jug.)", day: 7, dayColor: "#60a5fa" },
  { name: "U16 CADET",            gender: "♂",   desc: "Competició formativa d'elit",                      badge: "FORMACIÓ",     badgeColor: "#10b981", price: "75€ (4 jug.)", day: 7, dayColor: "#60a5fa" },
  { name: "U14 INFANTIL",         gender: "♂",   desc: "Primer pas cap a la competició",                   badge: "FORMACIÓ",     badgeColor: "#8b5cf6", price: "75€ (4 jug.)", day: 7, dayColor: "#60a5fa" },
  { name: "U12 PREINFANTIL",      gender: "♂",   desc: "Iniciació a la competició organitzada",            badge: "FORMACIÓ",     badgeColor: "#f59e0b", price: "75€ (4 jug.)", day: 7, dayColor: "#60a5fa" },
  { name: "PREMINI · BENJ · ALEV",gender: "♂",   desc: "Iniciació i diversió garantida",                   badge: "INICIACIÓ",    badgeColor: "#94a3b8", price: "75€ (4 jug.)", day: 7, dayColor: "#60a5fa" },
] as const;

export const PRIZES = [
  { cat: "Sèniors · Femení",   amount: "1.000€",            featured: true  },
  { cat: "Sèniors · Masculí",  amount: "1.000€",            featured: true  },
  { cat: "Sènior Amateur · Femení",  amount: "Trofeu + medalles", featured: false },
  { cat: "Sènior Amateur · Masculí", amount: "Trofeu + medalles", featured: false },
] as const;

export const SECONDARY_PRIZES = [
  { icon: "🥈", title: "2n classificat",     desc: "Copa oficial" },
  { icon: "🥉", title: "3r classificat",     desc: "Medalles" },
  { icon: "🎁", title: "Bonus comerços",     desc: "Sortejos i regals dels patrocinadors locals" },
  { icon: "⭐", title: "Punts FIBA 3×3",    desc: "Rànquing mundial oficial" },
  { icon: "🏅", title: "Trofeus i medalles", desc: "Per als 3 primers de totes les categories" },
  { icon: "⚡", title: "Material esportiu",  desc: "Lots per als equips participants" },
] as const;

export const VENUES = [
  {
    id: "NC",
    name: "La Nau del Clot",
    type: "Pavelló Oficial",
    addr: "Carrer de la Llacuna 172, Barcelona",
    color: "#E31E24",
    lat: 41.4063,
    lng: 2.1921,
    emoji: "🏟️",
    photo: "/seus/nau-del-clot.jpg",
    slug: "nau-del-clot",
    desc: "Pavelló cobert amb pista de parquet oficial. Seu de les categories formatives i semifinals Sènior.",
    categories: ["Premini · Benjamí · Aleví", "U12 Preinfantil", "U14 Infantil", "U16 Cadet", "U18 Júnior", "Semifinals Sènior M/F"],
    transport: [
      { icon: "🚇", label: "Metro", value: "L1 Clot · L2 Bac de Roda" },
      { icon: "🚌", label: "Bus", value: "Línia 7 · 192" },
      { icon: "🚶", label: "A peu des de WG", value: "~8 min" },
    ],
    parking: null,
    mapsLink: "https://maps.google.com/?q=Carrer+de+la+Llacuna+172+Barcelona",
  },
  {
    id: "WG",
    name: "Westfield Glòries",
    type: "Seu Principal",
    addr: "Av. Diagonal 208, Barcelona",
    color: "#F97316",
    lat: 41.4034,
    lng: 2.1896,
    emoji: "🏬",
    photo: "/seus/westfield-glories.jpg",
    slug: "westfield-glories",
    desc: "Seu central del torneig: inscripcions, cerimònia d'obertura, Finals Sènior i zona de patrocinadors.",
    categories: ["Finals Sènior Masculí Pro", "Finals Sènior Femení Pro", "Cerimònia d'obertura i cloenda", "Zona inscripcions i info"],
    transport: [
      { icon: "🚇", label: "Metro", value: "L1 Glòries · Tram T4/T5/T6" },
      { icon: "🚌", label: "Bus", value: "7 · 56 · H12 · V21" },
      { icon: "🚗", label: "Pàrquing", value: "Glòries — 2h gratis per a participants" },
    ],
    parking: "Pàrquing Glòries — 2h gratis",
    mapsLink: "https://maps.google.com/?q=Av+Diagonal+208+Barcelona",
  },
  {
    id: "RC",
    name: "Rambleta del Clot",
    type: "Pista Exterior",
    addr: "Rambla del Poblenou / Clot, Barcelona",
    color: "#EAB308",
    lat: 41.4074,
    lng: 2.1876,
    emoji: "🌳",
    photo: "/seus/rambleta-del-clot.jpg",
    slug: "rambleta-del-clot",
    desc: "Pista exterior amb l'ambient del bàsquet de carrer. Música, públic i competició a l'aire lliure.",
    categories: ["Sènior Amateur Masculí", "Sènior Amateur Femení", "Màgics · Categoria Inclusiva", "Exhibicions streetball"],
    transport: [
      { icon: "🚇", label: "Metro", value: "L1 Glòries · L1 Clot" },
      { icon: "🚋", label: "Tram", value: "T4 · T5 · T6 parada Pallars" },
      { icon: "🚌", label: "Bus", value: "H12 · 7" },
    ],
    parking: null,
    mapsLink: "https://maps.google.com/?q=Rambla+del+Poblenou+Barcelona",
  },
] as const;

export const PROGRAM = [
  {
    dia: "Dissabte 6 de Juny",
    dateShort: "Dis 6",
    dayColor: "#f97316",
    categories: [
      { nom: "Sènior Masculí Pro", fiba: true, hora: "09:00–18:00" },
      { nom: "Sènior Femení Pro",  fiba: true, hora: "09:00–18:00" },
      { nom: "Sènior Amateur M/F",       fiba: false, hora: "10:00–14:00" },
    ],
  },
  {
    dia: "Diumenge 7 de Juny",
    dateShort: "Diu 7",
    dayColor: "#60a5fa",
    categories: [
      { nom: "Màgics · Inclusiva", fiba: false, hora: "11:00–13:00" },
      { nom: "Premini · Benjamí · Aleví", fiba: false, hora: "09:00–12:00" },
      { nom: "U12 Preinfantil",            fiba: false, hora: "09:00–12:00" },
      { nom: "U14 Infantil",               fiba: false, hora: "10:00–14:00" },
      { nom: "U16 Cadet",                  fiba: false, hora: "10:00–14:00" },
      { nom: "U18 Júnior",                 fiba: false, hora: "12:00–18:00" },
      { nom: "Sub-23",                     fiba: false, hora: "12:00–18:00" },
    ],
  },
] as const;
