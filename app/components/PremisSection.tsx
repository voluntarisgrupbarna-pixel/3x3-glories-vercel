import { PRIZES, SECONDARY_PRIZES } from "../data/seccions3x3";
import SlideActionBar from "./SlideActionBar";

export default function PremisSection() {
  return (
    <section id="premis" className="premis-section">
      <div className="section-inner">
        <header className="section-header">
          <span className="section-kicker">Edició 2026 · Premi en Metàl·lic</span>
          <h2 className="section-title">
            PREMIS <span className="accent">&amp; TROFEUS</span>
          </h2>
          <div className="prize-total-badge">
            <span className="prize-total-label">Total Premi en Metàl·lic</span>
            <span className="prize-total-amount">2.000€</span>
          </div>
          <div className="parity-callout">
            <span className="parity-callout-icon" aria-hidden="true">⚖️</span>
            <div className="parity-callout-body">
              <strong>1.000€ Sènior Femení · 1.000€ Sènior Masculí</strong>
              <span className="parity-callout-sub"> — premi paritari, únic a Barcelona</span>
            </div>
          </div>
          <p className="section-desc">
            Premi econòmic per als <strong>1ers classificats de Sèniors Masculí i Sèniors
            Femení</strong> (1.000€ cadascun). Sènior Amateur M/F i la resta de categories: trofeus i medalles.
          </p>
        </header>

        {/* Premis principals */}
        <div className="prizes-grid">
          {PRIZES.map((p) => (
            <div
              key={p.cat}
              className={`prize-card ${p.featured ? "prize-card--featured" : "prize-card--standard"}`}
            >
              {p.featured && (
                <span className="prize-card-top-badge">Top Categoria</span>
              )}
              <span className="prize-medal">🥇</span>
              <p className="prize-cat">{p.cat}</p>
              <p className="prize-amount">{p.amount}</p>
              <p className="prize-sublabel">al 1r classificat</p>
            </div>
          ))}
        </div>

        {/* Premis secundaris */}
        <div className="secondary-prizes-grid">
          {SECONDARY_PRIZES.map((sp) => (
            <div key={sp.title} className="secondary-prize-card">
              <span className="secondary-prize-icon">{sp.icon}</span>
              <div className="secondary-prize-body">
                <strong className="secondary-prize-title">{sp.title}</strong>
                <span className="secondary-prize-desc">{sp.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Recap strip — 3a edició ja celebrada ── */}
        <div className="urgency-strip">
          <span className="urgency-strip-icon" aria-hidden="true">🏆</span>
          <span className="urgency-strip-text">
            <strong>113 equips</strong> hi van competir pels premis a la 3a edició
          </span>
          <a
            href="https://cbgrupbarna.info/fotos-3x3/"
            target="_blank"
            rel="noreferrer noopener"
            className="urgency-strip-cta"
          >
            Veure resultats i fotos →
          </a>
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <a
            href="https://cbgrupbarna.info/fotos-3x3/"
            target="_blank"
            rel="noreferrer noopener"
            className="cta-btn"
          >
            📸 Veure com va anar
          </a>
        </div>

        <SlideActionBar origin="share-premis" />
      </div>
    </section>
  );
}
