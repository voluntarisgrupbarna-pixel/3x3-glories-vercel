"use client";

import SlideActionBar from "./SlideActionBar";

const CATEGORIES = [
  { id: "escola",      name: "Escola",      emoji: "🌱", color: "#22C55E", pct: 63  },
  { id: "premini",     name: "Premini",     emoji: "✏️", color: "#06B6D4", pct: 65  },
  { id: "mini",        name: "Mini",        emoji: "⭐", color: "#818CF8", pct: 100 },
  { id: "preinfantil", name: "Preinfantil", emoji: "🚀", color: "#A855F7", pct: 70  },
  { id: "infantil",    name: "Infantil",    emoji: "🔥", color: "#D946EF", pct: 68  },
  { id: "cadet",       name: "Cadet",       emoji: "⚡", color: "#EC4899", pct: 67  },
  { id: "junior",      name: "Junior",      emoji: "🏀", color: "#FB7185", pct: 72  },
  { id: "seniors",     name: "Sèniors",     emoji: "🏆", color: "#EF4444", pct: 75  },
  { id: "veterans",    name: "Veterans",    emoji: "💪", color: "#F97316", pct: 63  },
  { id: "magics",      name: "Màgics",      emoji: "✨", color: "#FBBF24", pct: 60  },
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
            <p className="occupancy-kicker">100 PLACES · 1 QUADRAT = 1 EQUIP</p>
            <h2 className="occupancy-title">Mira com s&apos;omple el torneig en directe</h2>
          </div>
          <span className="occupancy-badge">🔄 UPDATE 30S</span>
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
            <span key={cat.id} className="occupancy-legend-item">
              <span
                className="occupancy-legend-dot"
                style={{ backgroundColor: cat.color }}
                aria-hidden="true"
              />
              {cat.emoji} {cat.name} {cat.pct}%
            </span>
          ))}
        </div>

        <SlideActionBar origin="share-occupancy" />
      </div>
    </section>
  );
}
