export const CATEGORIES = [
  { name: "SÈNIORS",              gender: "♂ ♀", desc: "Prize Money 1.000€ · Punts Rànquing FIBA",        badge: "FIBA OFFICIAL", badgeColor: "#ef4444", price: "90€ (5 jug.)", day: 6, dayColor: "#f97316" },
  { name: "VETERANS",             gender: "♂ ♀", desc: "Trofeus i medalles · Esport intergeneracional +35", badge: "+35 ANYS",     badgeColor: "#06b6d4", price: "85€ (4 jug.)", day: 6, dayColor: "#f97316" },
  { name: "MÀGICS · INCLUSIVA",   gender: "♂ ♀", desc: "Categoria inclusiva Barna Màgics · Novetat 2026.", badge: "INCLUSIVA",    badgeColor: "#ec4899", price: "75€ (4 jug.)", day: 6, dayColor: "#f97316" },
  { name: "U18 JUNIOR",           gender: "♂ ♀", desc: "Categoria juvenil d'alt nivell",                   badge: "JUVENIL",      badgeColor: "#3b82f6", price: "75€ (4 jug.)", day: 7, dayColor: "#60a5fa" },
  { name: "U16 CADET",            gender: "♂",   desc: "Competició formativa d'elit",                      badge: "FORMACIÓ",     badgeColor: "#10b981", price: "75€ (4 jug.)", day: 7, dayColor: "#60a5fa" },
  { name: "U14 INFANTIL",         gender: "♂",   desc: "Primer pas cap a la competició",                   badge: "FORMACIÓ",     badgeColor: "#8b5cf6", price: "75€ (4 jug.)", day: 7, dayColor: "#60a5fa" },
  { name: "U12 PREINFANTIL",      gender: "♂",   desc: "Iniciació a la competició organitzada",            badge: "FORMACIÓ",     badgeColor: "#f59e0b", price: "75€ (4 jug.)", day: 7, dayColor: "#60a5fa" },
  { name: "PREMINI · BENJ · ALEV",gender: "♂",   desc: "Iniciació i diversió garantida",                   badge: "INICIACIÓ",    badgeColor: "#94a3b8", price: "75€ (4 jug.)", day: 7, dayColor: "#60a5fa" },
] as const;

export const PRIZES = [
  { cat: "Sèniors · Femení",   amount: "1.000€",            featured: true  },
  { cat: "Sèniors · Masculí",  amount: "1.000€",            featured: true  },
  { cat: "Veterans · Femení",  amount: "Trofeu + medalles", featured: false },
  { cat: "Veterans · Masculí", amount: "Trofeu + medalles", featured: false },
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
  { id: "NC", name: "La Nau del Clot",   type: "Pavelló Oficial", addr: "Carrer de la Llacuna 172, Barcelona",   color: "#E31E24", lat: 41.4063, lng: 2.1921, emoji: "🏟️" },
  { id: "WG", name: "Westfield Glòries", type: "Seu Principal",   addr: "Av. Diagonal 208, Barcelona",           color: "#F97316", lat: 41.4034, lng: 2.1896, emoji: "🏬" },
  { id: "RC", name: "Rambleta del Clot", type: "Pista Exterior",  addr: "Rambla del Poblenou / Clot, Barcelona", color: "#EAB308", lat: 41.4074, lng: 2.1876, emoji: "🌳" },
] as const;
