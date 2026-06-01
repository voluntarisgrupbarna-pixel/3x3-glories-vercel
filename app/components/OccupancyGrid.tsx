"use client";

import SlideActionBar from "./SlideActionBar";

// Actualitzat: 31 maig 2026 · font: mailing "Últimes places"
const CATEGORIES = [
  { id: "escola",      name: "Escoleta",    emoji: "🌱", color: "#22C55E", remaining: 1,  closed: false },
  { id: "premini",     name: "Premini",     emoji: "✏️", color: "#06B6D4", remaining: 6,  closed: false }, // 1 masc + 5 fem
  { id: "mini",        name: "Mini",        emoji: "⭐", color: "#818CF8", remaining: 2,  closed: false },
  { id: "preinfantil", name: "Preinfantil", emoji: "🚀", color: "#A855F7", remaining: 4,  closed: false },
  { id: "infantil",    name: "Infantil",    emoji: "🔥", color: "#D946EF", remaining: 3,  closed: false },
  { id: "cadet",       name: "Cadet",       emoji: "⚡", color: "#EC4899", remaining: 3,  closed: false }, // 1 masc + 2 fem
  { id: "junior",      name: "Júnior",      emoji: "🏀", color: "#FB7185", remaining: 5,  closed: false },
  { id: "seniors",     name: "Sèniors",     emoji: "🏆", color: "#EF4444", remaining: 4,  closed: false }, // 1 masc + 3 fem
  { id: "veterans",    name: "Sènior Amateur",    emoji: "💪", color: "#F97316", remaining: 4,  closed: false },
  { id: "magics",      name: "Màgics",      emoji: "✨", color: "#6B7280", remaining: 0,  closed: true  },
];

const GRID_ROWS = [
  [CATEGORIES[0], CATEGORIES[1]],
  [CATEGORIES[2], CATEGORIES[3]],
  [CATEGORIES[4], CATEGORIES[5]],
  [CATEGORIES[6], CATEGORIES[7]],
  [CATEGORIES[8], CATEGORIES[9]],
];

export default function OccupancyGrid() {
  return (
    <section id="categories" className="occupancy-section" aria-label="Ocupació del torneig">
      <div className="occupancy-inner">
        <div className="occupancy-header">
          <div>
            <p className="occupancy-kicker">100 EQUIPS INSCRITS · DATA MÀX. 3 JUNY A LES 24H</p>
            <h2 className="occupancy-title">Estat actual de places per categoria</h2>
            <p className="occupancy-warning">⚠️ Quan s&apos;ompli, tanquem. No hi ha llista d&apos;espera.</p>
          </div>
          <span className="occupancy-badge">🔴 ÚLTIMES PLACES</span>
        </div>

        <div className="occupancy-grid" role="img" aria-label="Graella d'ocupació per categories">
          {GRID_ROWS.map((row, rowIdx) =>
            row.map((cat) =>
              Array.from({ length: 10 }, (_, i) => (
                <div
                  key={`${rowIdx}-${cat.id}-${i}`}
                  className="occupancy-square"
                  style={{ backgroundColor: cat.color }}
                />
              ))
            )
          )}
        </div>

        <div className="occupancy-legend">
          {CATEGORIES.map((cat) => (
            <span key={cat.id} className={`occupancy-legend-item${cat.closed ? " occupancy-legend-closed" : ""}`}>
              <span
                className="occupancy-legend-dot"
                style={{ backgroundColor: cat.color }}
                aria-hidden="true"
              />
              {cat.emoji} {cat.name}{" "}
              {cat.closed
                ? <strong style={{ color: "#EF4444" }}>TANCADA</strong>
                : <strong>{cat.remaining === 1 ? "1 plaça" : `${cat.remaining} places`}</strong>
              }
            </span>
          ))}
        </div>

        <SlideActionBar origin="share-occupancy" />
      </div>
    </section>
  );
}
