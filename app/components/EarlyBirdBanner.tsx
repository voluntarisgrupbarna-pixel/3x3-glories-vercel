"use client";

import { useEffect, useState } from "react";

const DEADLINE = new Date("2026-05-21T00:00:00+02:00");

const EB_LOGOS = [
  { src: "/logos/westfield.svg",         alt: "Westfield Glòries", dark: false },
  { src: "/cb-grup-barna-logo-192.png",  alt: "CB Grup Barna",     dark: false },
  { src: "/logos/timechamber.webp",      alt: "Time Chamber",      dark: true  },
];

function getCountdown(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { diff, days, hours, minutes, seconds };
}

export default function EarlyBirdBanner() {
  const [countdown, setCountdown] = useState<ReturnType<typeof getCountdown> | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("eb_dismissed") === "1") {
      setDismissed(true);
      return;
    }
    setCountdown(getCountdown(DEADLINE));
    const id = setInterval(() => setCountdown(getCountdown(DEADLINE)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (countdown && countdown.diff > 0 && !dismissed) {
      document.documentElement.classList.add("has-eb-banner");
    } else {
      document.documentElement.classList.remove("has-eb-banner");
    }
    return () => {
      document.documentElement.classList.remove("has-eb-banner");
    };
  }, [countdown, dismissed]);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem("eb_dismissed", "1");
  }

  if (!countdown || countdown.diff <= 0 || dismissed) return null;

  const { days, hours, minutes, seconds } = countdown;

  return (
    <div className="early-bird-bar" role="banner">
      {/* Co-organizer logos — esquerra */}
      <div className="eb-logos">
        {EB_LOGOS.map((l) => (
          <img
            key={l.alt}
            src={l.src}
            alt={l.alt}
            className={`eb-logo${l.dark ? " eb-logo--dark" : ""}`}
          />
        ))}
        <span className="eb-logo-label">eix clot</span>
      </div>

      <span className="eb-sep" aria-hidden="true" />

      {/* Promo Early Bird — centre */}
      <div className="eb-promo">
        <span className="eb-dot" aria-hidden="true">●</span>
        <span className="eb-flame" aria-hidden="true">🔥</span>
        <span className="eb-text"><strong>EARLY BIRD</strong> · <strong>−10%</strong> · ACABA EN</span>
        <span className="eb-timer">
          <span>{String(days).padStart(1, "0")}D</span>
          <span>{String(hours).padStart(2, "0")}H</span>
          <span>{String(minutes).padStart(2, "0")}M</span>
          <span>{String(seconds).padStart(2, "0")}S</span>
        </span>
      </div>

      {/* Tanca — dreta */}
      <button className="eb-dismiss" type="button" onClick={dismiss} aria-label="Tancar banner">
        ×
      </button>
    </div>
  );
}
