"use client";

import { useEffect, useState } from "react";

const DEADLINE = new Date("2026-05-21T00:00:00+02:00");

export default function EarlyBirdBanner() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("eb_dismissed") === "1") {
      setDismissed(true);
      return;
    }
    const diff = DEADLINE.getTime() - Date.now();
    const days = Math.ceil(diff / 86_400_000);
    setDaysLeft(days > 0 ? days : 0);
  }, []);

  useEffect(() => {
    if (daysLeft !== null && daysLeft > 0 && !dismissed) {
      document.documentElement.classList.add("has-eb-banner");
    } else {
      document.documentElement.classList.remove("has-eb-banner");
    }
    return () => {
      document.documentElement.classList.remove("has-eb-banner");
    };
  }, [daysLeft, dismissed]);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem("eb_dismissed", "1");
  }

  if (daysLeft === null || daysLeft <= 0 || dismissed) return null;

  const countdownLabel = daysLeft === 1 ? "Últim dia! 🔥" : `Queden ${daysLeft} dies`;

  return (
    <div className="early-bird-bar" role="banner">
      <span className="eb-tag">Early Bird</span>
      <span className="eb-text">
        <strong>fins a −15%</strong>
        <span className="eb-subtext"> de descompte · −10% Early Bird fins el 20 de maig + −5% si comparteixes</span>
      </span>
      <span className="eb-countdown">{countdownLabel}</span>
      <a href="/inscripcion" className="eb-cta">
        Inscriu-te ara →
      </a>
      <button className="eb-dismiss" type="button" onClick={dismiss} aria-label="Tancar banner">
        ×
      </button>
    </div>
  );
}
