"use client";

import SlideActionBar from "./SlideActionBar";

// Color semàfor per places restants
// 🔴 1-2 places → vermell   🟠 3-4 → taronja   🟡 5-6 → groc   🟢 7+ → verd   ⚫ TANCADA → gris
function semaforColor(remaining: number, closed: boolean): string {
  if (closed || remaining === 0) return "#6B7280"; // gris — TANCADA
  if (remaining <= 2) return "#EF4444";            // vermell
  if (remaining <= 4) return "#F97316";            // taronja
  if (remaining <= 6) return "#EAB308";            // groc
  return "#22C55E";                                // verd
}

// Actualitzat: 1 juny 2026 · font: imatge estat places
const CATEGORIES_RAW = [
  { id: "escola",      name: "Escoleta",       emoji: "🌱", remaining: 1,  closed: false }, // 1 plaça
  { id: "premini",     name: "Premini",        emoji: "✏️", remaining: 6,  closed: false }, // 1 masc + 5 fem
  { id: "mini",        name: "Mini",           emoji: "⭐", remaining: 2,  closed: false }, // 2
  { id: "preinfantil", name: "Preinfantil",    emoji: "🚀", remaining: 3,  closed: false }, // 3
  { id: "infantil",    name: "Infantil",       emoji: "🔥", remaining: 3,  closed: false }, // 3
  { id: "cadet",       name: "Cadet",          emoji: "⚡", remaining: 3,  closed: false }, // 1 masc + 2 fem
  { id: "junior",      name: "Júnior",         emoji: "🏀", remaining: 5,  closed: false }, // 5
  { id: "seniors",     name: "Sèniors Pro",    emoji: "🏆", remaining: 4,  closed: false }, // 1 masc + 3 fem
  { id: "veterans",    name: "Sènior Amateur", emoji: "💪", remaining: 3,  closed: false },
  { id: "magics",      name: "Màgics",         emoji: "✨", remaining: 0,  closed: true  },
];

const CATEGORIES = CATEGORIES_RAW.map((c) => ({
  ...c,
  color: semaforColor(c.remaining, c.closed),
}));

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
            <p className="occupancy-kicker">100 EQUIPS INSCRITS · INSCRIPCIONS AMPLIADES · FINS 5 JUNY</p>
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
