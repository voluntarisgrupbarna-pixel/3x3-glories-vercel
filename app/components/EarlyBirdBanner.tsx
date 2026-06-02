"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Banner d'urgència: tancament d'inscripcions ampliat fins 5 juny 2026 a les 24h
const CLOSE_DATE = new Date("2026-06-05T23:59:59+02:00");

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
        background: "#ccff00",
        borderBottom: "2px solid #aadd00",
        padding: "5px 12px",
        height: "auto",
        minHeight: 0,
        flexWrap: "nowrap",
        gap: 8,
      }}
    >
      {/* Emoji + text compacte */}
      <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#111", whiteSpace: "nowrap", flexShrink: 0 }}>
        🔥 INSCRIPCIONS AMPLIADES · FINS 5 JUNY
      </span>

      <span style={{ fontSize: "0.72rem", color: "#222", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        100 equips · Ampliat i ple · Poques places!
      </span>

      {/* Compte enrere compacte */}
      <span style={{
        display: "inline-flex", gap: 3, alignItems: "center",
        fontFamily: "monospace", fontWeight: 800, fontSize: "0.78rem",
        color: "#111", flexShrink: 0,
      }}>
        {String(days).padStart(2,"0")}d {String(hours).padStart(2,"0")}h {String(minutes).padStart(2,"0")}m {String(seconds).padStart(2,"0")}s
      </span>

      {/* CTA */}
      <Link
        href="/inscripcion"
        style={{
          background: "#111",
          color: "#ccff00",
          padding: "3px 10px",
          borderRadius: 5,
          fontWeight: 800,
          fontSize: "0.75rem",
          whiteSpace: "nowrap",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        Inscriu-te →
      </Link>
    </div>
  );
}
