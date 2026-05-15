"use client";

import { useEffect, useState } from "react";

const ORGANIZERS = [
  { id: "westfield", name: "Westfield Glòries", short: "Westfield" },
  { id: "grupbarna", name: "CB Grup Barna", short: "Grup Barna" },
  { id: "timechamber", name: "Time Chamber", short: "TIME Chamber" },
  { id: "eixclot", name: "Eix Clot", short: "eix clot" },
];

const STATS = [
  { value: "1000M+", label: "Impressions digitals" },
  { value: "10M+", label: "Seguidors FIBA 3×3" },
  { value: "37%", label: "Creixement anual" },
  { value: "2021", label: "Debut olímpic Tòquio" },
];

const NAV_LINKS = [
  { href: "#torneig", label: "Torneig" },
  { href: "#ubicacions", label: "Ubicacions" },
  { href: "#premis", label: "Premis" },
  { href: "#categories", label: "Categories" },
  { href: "#galeria", label: "Galeria" },
  { href: "#sponsors", label: "Sponsors" },
];

export default function HeroFestival() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero-festival" aria-label="3×3 Westfield Glòries 2026">
      {/* Background image + tint */}
      <div className="hero-festival-bg" aria-hidden="true">
        <img
          src="/hero-bg.jpg"
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          loading="eager"
        />
        <div className="hero-festival-tint" />
      </div>

      {/* Top nav */}
      <header className={`hero-festival-nav${scrolled ? " hero-festival-nav-scrolled" : ""}`}>
        <div className="hero-festival-logos">
          {ORGANIZERS.map((o) => (
            <div key={o.id} className={`hero-festival-logo hero-festival-logo-${o.id}`} title={o.name}>
              <span>{o.short}</span>
            </div>
          ))}
        </div>
        <nav className="hero-festival-links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hero-festival-link">
              {l.label}
            </a>
          ))}
          <a href="/inscripcion" className="hero-festival-nav-cta">
            Inscriu-te
          </a>
        </nav>
      </header>

      {/* Left panel */}
      <div className="hero-festival-panel">
        <span className="hero-festival-chip">
          <span className="hero-festival-chip-dot" /> 4a edició · Inscripcions obertes
        </span>

        <h1 className="hero-festival-title">3×3 Westfield Glòries</h1>
        <p className="hero-festival-subtitle">
          × <strong>Grup Barna</strong> · <strong>Time Chamber</strong> · <strong>Eix Clot</strong>
        </p>

        <div className="hero-festival-meta">
          <span className="hero-festival-meta-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 3v4M16 3v4" />
            </svg>
            6 i 7 de Juny 2026
          </span>
          <span className="hero-festival-meta-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            3 seus · Barri del Clot, Barcelona
          </span>
        </div>

        <div className="hero-festival-actions">
          <a href="/inscripcion" className="hero-festival-cta-primary">
            <span aria-hidden="true">🏀</span> Inscriu el teu equip — des de 75 €
          </a>
          <a href="#torneig" className="hero-festival-cta-secondary">
            Saber més <span aria-hidden="true">▾</span>
          </a>
        </div>

        <div className="hero-festival-stats">
          {STATS.map((s) => (
            <div key={s.label} className="hero-festival-stat">
              <span className="hero-festival-stat-value">{s.value}</span>
              <span className="hero-festival-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="hero-festival-progress">
          <span className="hero-festival-progress-icon">⚡</span> 75% de places ocupades
        </div>
      </div>

      {/* Right card — Instagram embed */}
      <a
        href="https://www.instagram.com/cbgrupbarna/"
        target="_blank"
        rel="noreferrer"
        className="hero-festival-ig"
        aria-label="Veure @cbgrupbarna a Instagram"
      >
        <div className="hero-festival-ig-header">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
          <span>@cbgrupbarna</span>
        </div>
        <img
          src="/hero-bg.jpg"
          alt="3×3 Westfield Glòries · moment del torneig"
          className="hero-festival-ig-media"
          width={420}
          height={520}
          loading="eager"
          decoding="async"
        />
        <div className="hero-festival-ig-tags">
          <span>#3×3</span>
          <span>#3x3time</span>
        </div>
      </a>

      {/* Bottom banner */}
      <div className="hero-festival-bottom" aria-hidden="true">
        <span>EDICIÓ 2026 · PROPERAMENT!</span>
      </div>
    </section>
  );
}
