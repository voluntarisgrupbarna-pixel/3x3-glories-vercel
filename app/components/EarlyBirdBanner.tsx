"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Banner d'urgència: tancament d'inscripcions 3 juny 2026 a les 24h
const CLOSE_DATE = new Date("2026-06-03T23:59:59+02:00");

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

  useEffect(() => {
    setCountdown(getCountdown(CLOSE_DATE));
    const id = setInterval(() => setCountdown(getCountdown(CLOSE_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (countdown && countdown.diff > 0) {
      document.documentElement.classList.add("has-eb-banner");
    } else {
      document.documentElement.classList.remove("has-eb-banner");
    }
    return () => {
      document.documentElement.classList.remove("has-eb-banner");
    };
  }, [countdown]);

  if (!countdown || countdown.diff <= 0) return null;

  const { days, hours, minutes, seconds } = countdown;

  return (
    <div
      className="early-bird-bar"
      role="banner"
      style={{
        background: "linear-gradient(90deg, #7f1d1d 0%, #991b1b 50%, #7f1d1d 100%)",
        borderBottom: "2px solid #f87171",
      }}
    >
      {/* Missatge urgència — esquerra */}
      <div className="eb-promo" style={{ gap: 6 }}>
        <span className="eb-flame" aria-hidden="true">🚨</span>
        <span className="eb-text" style={{ fontSize: "0.78rem", lineHeight: 1.3 }}>
          <strong style={{ color: "#fbbf24", fontSize: "0.85rem" }}>TANQUEM EL 3 DE JUNY · 24H</strong>
          <span style={{ color: "#fecaca", marginLeft: 6 }}>
            100+ equips inscrits · Hem ampliat i s&apos;han tornat a omplir
          </span>
        </span>
      </div>

      <span className="eb-sep" aria-hidden="true" />

      {/* Compte enrere */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <span style={{ color: "#fecaca", fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap" }}>
          TANCA EN
        </span>
        <span className="eb-timer" style={{ fontSize: "0.78rem" }}>
          <span>{String(days).padStart(1, "0")}D</span>
          <span>{String(hours).padStart(2, "0")}H</span>
          <span>{String(minutes).padStart(2, "0")}M</span>
          <span>{String(seconds).padStart(2, "0")}S</span>
        </span>
      </div>

      <span className="eb-sep" aria-hidden="true" />

      {/* CTA */}
      <Link
        href="/inscripcion"
        className="eb-cta"
        style={{
          background: "#f87171",
          color: "#fff",
          padding: "4px 12px",
          borderRadius: 6,
          fontWeight: 700,
          fontSize: "0.78rem",
          whiteSpace: "nowrap",
          textDecoration: "none",
        }}
      >
        Inscriu-te →
      </Link>
    </div>
  );
}
