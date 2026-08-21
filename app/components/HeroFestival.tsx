"use client";

import { useEffect, useState } from "react";
import SlideActionBar from "./SlideActionBar";

const ORGANIZERS = [
  { id: "westfield",    name: "Westfield Glòries", short: "Westfield",    logo: "/logos/westfield.svg" },
  { id: "grupbarna",   name: "CB Grup Barna",      short: "Grup Barna",   logo: "/cb-grup-barna-logo-192.png" },
  { id: "timechamber", name: "Time Chamber",        short: "TIME Chamber", logo: "/logos/timechamber.webp" },
  { id: "eixclot",     name: "Eix Clot",            short: "eix clot",     logo: "/logos/eix-clot.png" },
];

const STATS = [
  { value: "113", label: "Equips · rècord 2026" },
  { value: "508", label: "Jugadors/es la 3a edició" },
  { value: "2.000€", label: "Premi paritari repartit" },
  { value: "10", label: "Categories, d'Escoleta a Sènior" },
];

const GALLERY_URL = "https://cbgrupbarna.info/fotos-3x3/";

const HERO_SLIDES = [
  { src: "/hero-bg-1.webp", alt: "Públic i equips al Torneig 3×3 Barcelona 2026 a Westfield Glòries, Clot-Glòries" },
  { src: "/hero-bg-2.webp", alt: "Pista exterior del Torneig 3×3 FIBA al barri del Clot-Glòries de Barcelona" },
  { src: "/hero-bg-3.webp", alt: "Jugadora encistellant al Torneig 3×3 Westfield Glòries Barcelona 2026" },
];
const SLIDE_INTERVAL_MS = 5000;

const NAV_LINKS = [
  { href: "#torneig", label: "Torneig" },
  { href: "#ubicacions", label: "Ubicacions" },
  { href: "#premis", label: "Premis" },
  { href: "#categories", label: "Categories" },
  { href: "#galeria", label: "Galeria" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "/preguntes-frequents", label: "FAQs" },
  { href: "/patrocinar", label: "Patrocina" },
];

export default function HeroFestival() {
  const [scrolled, setScrolled] = useState(false);
  const [slide, setSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero-festival" aria-label="3×3 Westfield Glòries 2026">
      {/* Background slideshow + tint */}
      <div className="hero-festival-bg" aria-hidden="true">
        {HERO_SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={1920}
            height={1080}
            fetchPriority={i === 0 ? "high" : "low"}
            loading={i === 0 ? "eager" : "lazy"}
            className={`hero-festival-slide${i === slide ? " hero-festival-slide-active" : ""}`}
          />
        ))}
        <div className="hero-festival-tint" />
        <div className="hero-festival-slide-dots" aria-hidden="true">
          {HERO_SLIDES.map((_, i) => (
            <span key={i} className={`hero-festival-slide-dot${i === slide ? " hero-festival-slide-dot-active" : ""}`} />
          ))}
        </div>
      </div>

      {/* Top nav */}
      <header className={`hero-festival-nav${scrolled ? " hero-festival-nav-scrolled" : ""}`}>
        {/* Desktop links */}
        <nav className="hero-festival-links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hero-festival-link">
              {l.label}
            </a>
          ))}
          <a
            href={GALLERY_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hero-festival-nav-cta"
          >
            📸 Fotos i resultats
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="hero-festival-hamburger"
          aria-label={mobileMenuOpen ? "Tancar menú" : "Obrir menú"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <nav className="hero-festival-mobile-menu" onClick={() => setMobileMenuOpen(false)}>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hero-festival-mobile-link">
                {l.label}
              </a>
            ))}
            <a
              href={GALLERY_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="hero-festival-mobile-cta"
            >
              📸 Fotos i resultats
            </a>
          </nav>
        )}
      </header>

      {/* Left panel */}
      <div className="hero-festival-panel">
        <span className="hero-festival-chip">
          <span className="hero-festival-chip-dot" /> 3a edició · Celebrada — ens veiem el 2027
        </span>

        <h1 className="hero-festival-title">3×3 Westfield Glòries</h1>
        <p className="hero-festival-subtitle">
          El torneig 3×3 FIBA de referència a Barcelona
        </p>
        <p className="hero-festival-subtitle" style={{ opacity: 0.6, fontSize: "0.8em", marginTop: "-0.4em" }}>
          × <strong>Grup Barna</strong> · <strong>Time Chamber</strong> · <strong>Eix Clot</strong>
        </p>
        <p className="hero-festival-parity-line">
          ⚖️ <strong>1.000€ Femení · 1.000€ Masculí</strong> — premi paritari, únic a Barcelona
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
          <a
            href={GALLERY_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hero-festival-cta-primary"
          >
            📸 Veure fotos i resultats
          </a>
          <a href="#torneig" className="hero-festival-cta-secondary">
            Com va anar <span aria-hidden="true">▾</span>
          </a>
        </div>

        <SlideActionBar origin="share-hero" />

        <div className="hero-festival-stats">
          {STATS.map((s) => (
            <div key={s.label} className="hero-festival-stat">
              <span className="hero-festival-stat-value">{s.value}</span>
              <span className="hero-festival-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="hero-festival-progress">
          <span className="hero-festival-progress-icon">🏀</span> Gràcies als 113 equips que hi vau ser — <strong>ens veiem el 2027</strong>
        </div>
      </div>

      {/* Right card — Instagram reel embed */}
      <a
        href="https://www.instagram.com/reel/DJNKYiuMOGm/"
        target="_blank"
        rel="noreferrer"
        className="hero-festival-ig"
        aria-label="Veure el reel del 3×3 a @cbgrupbarna a Instagram"
      >
        <div className="hero-festival-ig-header">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
          <span>@cbgrupbarna</span>
        </div>
        <video
          className="hero-festival-ig-media"
          src="/videos/hero-ig.mp4"
          poster="/videos/hero-ig-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          width={420}
          height={520}
        />
        <div className="hero-festival-ig-tags">
          <span>#3×3</span>
          <span>#3x3time</span>
        </div>
      </a>

    </section>
  );
}
