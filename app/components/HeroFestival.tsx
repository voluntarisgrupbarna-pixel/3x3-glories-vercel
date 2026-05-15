"use client";

import { useEffect, useState } from "react";

const ORGANIZERS = [
  { id: "westfield",    name: "Westfield Glòries", short: "Westfield",    logo: "/logos/westfield.svg" },
  { id: "grupbarna",   name: "CB Grup Barna",      short: "Grup Barna",   logo: "/cb-grup-barna-logo-192.png" },
  { id: "timechamber", name: "Time Chamber",        short: "TIME Chamber", logo: "/logos/timechamber.webp" },
  { id: "eixclot",     name: "Eix Clot",            short: "eix clot",     logo: "/logos/eix-clot.png" },
];

const STATS = [
  { value: "180+", label: "Equips a 2 edicions" },
  { value: "800+", label: "Jugadors/es totals" },
  { value: "2.4M+", label: "Impressions potencials" },
  { value: "25%", label: "Creixement 2024→2025" },
];

const EVENT_DATE = new Date("2026-06-06T09:00:00+02:00");

const HERO_SLIDES = [
  { src: "/hero-bg-1.jpg", alt: "Públic gaudint del torneig al Westfield Glòries" },
  { src: "/hero-bg-2.jpg", alt: "Vista aèria de la pista del 3×3 al Clot-Glòries" },
  { src: "/hero-bg-3.jpg", alt: "Jugadora encistellant en un partit del 3×3" },
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
];

function getCountdown(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { days, hours, minutes, seconds };
}

export default function HeroFestival() {
  const [scrolled, setScrolled] = useState(false);
  const [countdown, setCountdown] = useState<ReturnType<typeof getCountdown> | null>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setCountdown(getCountdown(EVENT_DATE));
    const id = setInterval(() => setCountdown(getCountdown(EVENT_DATE)), 1000);
    return () => clearInterval(id);
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
          <span className="hero-festival-chip-dot" /> 3a edició · Inscripcions obertes
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

        <a href="/inscripcion/solo" className="hero-festival-solo-cta">
          <span aria-hidden="true">👤</span> No tens equip? Apunta&apos;t sol per <strong>20€</strong> · t&apos;assignem un equip <span aria-hidden="true">→</span>
        </a>

        <div className="hero-festival-stats">
          {STATS.map((s) => (
            <div key={s.label} className="hero-festival-stat">
              <span className="hero-festival-stat-value">{s.value}</span>
              <span className="hero-festival-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="hero-festival-progress">
          <span className="hero-festival-progress-icon">🔥</span> <strong>64%</strong> ocupat · <strong>64</strong> places lliures
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

      {/* Bottom countdown */}
      {countdown && (
        <div className="hero-festival-countdown" aria-label="Compte enrere fins al torneig">
          <div className="hero-festival-countdown-box">
            <span className="hero-festival-countdown-value">{String(countdown.days).padStart(2, "0")}</span>
            <span className="hero-festival-countdown-label">DIES</span>
          </div>
          <span className="hero-festival-countdown-sep">:</span>
          <div className="hero-festival-countdown-box">
            <span className="hero-festival-countdown-value">{String(countdown.hours).padStart(2, "0")}</span>
            <span className="hero-festival-countdown-label">HORES</span>
          </div>
          <span className="hero-festival-countdown-sep">:</span>
          <div className="hero-festival-countdown-box">
            <span className="hero-festival-countdown-value">{String(countdown.minutes).padStart(2, "0")}</span>
            <span className="hero-festival-countdown-label">MIN</span>
          </div>
          <span className="hero-festival-countdown-sep">:</span>
          <div className="hero-festival-countdown-box">
            <span className="hero-festival-countdown-value">{String(countdown.seconds).padStart(2, "0")}</span>
            <span className="hero-festival-countdown-label">SEG</span>
          </div>
        </div>
      )}
    </section>
  );
}
