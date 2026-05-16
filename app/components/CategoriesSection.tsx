import { CATEGORIES } from "../data/seccions3x3";
import SlideActionBar from "./SlideActionBar";

export default function CategoriesSection() {
  return (
    <section id="categories" className="categories-section">
      <div className="section-inner">
        <header className="section-header">
          <span className="section-kicker">Competició</span>
          <h2 className="section-title">CATEGORIES</h2>
        </header>

        {/* Calendari per dia */}
        <div className="day-grid">
          <div className="day-card day-card--saturday">
            <p className="day-label">Dissabte 6 de Juny</p>
            <p className="day-cats">Sèniors · Veterans · Màgics</p>
            <p className="day-note">Masculí i Femení · Premi en Metàl·lic + Punts FIBA</p>
          </div>
          <div className="day-card day-card--sunday">
            <p className="day-label">Diumenge 7 de Juny</p>
            <p className="day-cats">Júnior · Cadet · Infantil · Preinfantil · Mini · Premini</p>
            <p className="day-note">Categories formatives · Trofeus i medalles</p>
          </div>
        </div>

        {/* FIBA Play link */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <a
            href="https://play.fiba3x3.com/events/4a4773cb-79be-4777-b164-220b36aacbe6"
            target="_blank"
            rel="noopener noreferrer"
            className="fiba-link"
          >
            🏀 Seguiment oficial a FIBA Play ↗
          </a>
        </div>

        {/* Grid categories */}
        <div className="cat-grid">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="cat-card">
              <div className="cat-card-top">
                <div className="cat-badges">
                  <span className="cat-badge" style={{ color: cat.badgeColor, background: `${cat.badgeColor}22` }}>
                    {cat.badge}
                  </span>
                  <span className="cat-badge" style={{ color: cat.dayColor, background: `${cat.dayColor}22` }}>
                    Dia {cat.day}
                  </span>
                </div>
                <span className="cat-gender">{cat.gender}</span>
              </div>
              <h3 className="cat-name">{cat.name}</h3>
              <p className="cat-desc">{cat.desc}</p>
              <div className="cat-footer">
                <span className="cat-price">{cat.price} · inclou samarreta oficial</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Urgency strip — fil de la xarxa ── */}
        <div className="urgency-strip">
          <span className="urgency-strip-icon" aria-hidden="true">🔥</span>
          <span className="urgency-strip-text">
            <strong>Early Bird −10%</strong> actiu ara · acaba aviat
          </span>
          <a href="/inscripcion" className="urgency-strip-cta">
            Inscriu l'equip →
          </a>
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <a href="/inscripcion" className="cta-btn">
            Inscriu el teu Equip Ara
          </a>
        </div>

        <SlideActionBar origin="share-categories" />
      </div>
    </section>
  );
}
