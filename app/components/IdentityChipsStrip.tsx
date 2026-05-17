const CHIPS = [
  { emoji: "🏀", label: "3a edició" },
  { emoji: "⚖️", label: "Premi paritari" },
  { emoji: "👩‍🏀", label: "50% equips femenins" },
  { emoji: "♿", label: "Màgics a la competició" },
  { emoji: "🏳️‍🌈", label: "Mes de l'Orgull" },
];

export default function IdentityChipsStrip() {
  return (
    <div className="identity-chips-strip" aria-label="Valors i identitat del torneig">
      {CHIPS.map((c) => (
        <span key={c.label} className="identity-chip">
          <span aria-hidden="true">{c.emoji}</span>
          {c.label}
        </span>
      ))}
    </div>
  );
}
