"use client";

import SlideActionBar from "./SlideActionBar";

const CATEGORIES = [
  { id: "escola",      name: "Escola",      emoji: "🌱", color: "#22C55E", pct: 63,  age: "fins 7 anys", full: false },
  { id: "premini",     name: "Premini",     emoji: "✏️", color: "#06B6D4", pct: 65,  age: "8-9 anys",    full: false },
  { id: "mini",        name: "Mini",        emoji: "⭐", color: "#818CF8", pct: 100, age: "10-11 anys",  full: true  },
  { id: "preinfantil", name: "Preinfantil", emoji: "🚀", color: "#A855F7", pct: 70,  age: "12 anys",     full: false },
  { id: "infantil",    name: "Infantil",    emoji: "🔥", color: "#D946EF", pct: 68,  age: "13-14 anys",  full: false },
  { id: "cadet",       name: "Cadet",       emoji: "⚡", color: "#EC4899", pct: 67,  age: "15-16 anys",  full: false },
  { id: "junior",      name: "Junior",      emoji: "🏀", color: "#FB7185", pct: 72,  age: "17-18 anys",  full: false },
  { id: "seniors",     name: "Sèniors",     emoji: "🏆", color: "#EF4444", pct: 75,  age: "18+ FIBA",    full: false },
  { id: "veterans",    name: "Veterans",    emoji: "💪", color: "#F97316", pct: 63,  age: "+35 anys",    full: false },
  { id: "magics",      name: "Màgics",      emoji: "✨", color: "#FBBF24", pct: 60,  age: "Inclusiva",   full: false },
];

export default function CategoryBars() {
  return (
    <section className="catbars-section" aria-label="Places per categoria">
      <div className="catbars-inner">
        <div className="catbars-header">
          <div>
            <p className="catbars-kicker">PLACES PER CATEGORIA</p>
            <h2 className="catbars-title">70% ocupat</h2>
            <p className="catbars-subtitle">Queden places a la majoria de categories</p>
          </div>
          <a href="/inscripcion" className="catbars-cta">🏀 INSCRIU EL TEU EQUIP</a>
        </div>

        <div className="catbars-list">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="catbars-row">
              <div className="catbars-label">
                <span className="catbars-emoji" aria-hidden="true">{cat.emoji}</span>
                <span className="catbars-name-wrap">
                  <strong className="catbars-name">{cat.name}</strong>
                  <span className="catbars-age">{cat.age}</span>
                </span>
              </div>

              {cat.full ? (
                <div className="catbars-bar-wrap">
                  <div
                    className="catbars-bar-full"
                    style={{ backgroundColor: cat.color }}
                  >
                    <span className="catbars-ple-label">PLE</span>
                  </div>
                </div>
              ) : (
                <div className="catbars-bar-wrap">
                  <div className="catbars-bar-track">
                    <div
                      className="catbars-bar-fill"
                      style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              )}

              {cat.full ? (
                <a href="/inscripcion" className="catbars-llista">Llista</a>
              ) : (
                <span className="catbars-pct">{cat.pct}%</span>
              )}
            </div>
          ))}
        </div>

        <p className="catbars-footer">
          Actualització cada 30s · Només <strong>Sèniors Masculí</strong> i{" "}
          <strong>Sèniors Femení</strong> reben premi en metàl·lic (1.000€ cadascun) i atorguen punts
          FIBA. La resta de categories: trofeus i medalles.
        </p>

        <SlideActionBar origin="share-category-bars" />
      </div>
    </section>
  );
}
