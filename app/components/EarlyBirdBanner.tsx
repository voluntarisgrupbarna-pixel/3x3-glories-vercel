"use client";

import { useEffect, useState } from "react";

const DEADLINE = new Date("2026-05-21T00:00:00+02:00");

const EB_LOGOS: Array<{
  src: string | null;
  alt: string;
  dark: boolean;
  featured?: boolean;
  instagram: string;
}> = [
  { src: "/logos/westfield.svg",        alt: "Westfield Glòries", dark: false,           instagram: "https://www.instagram.com/westfieldglories/" },
  { src: "/cb-grup-barna-logo-192.png", alt: "CB Grup Barna",     dark: false, featured: true, instagram: "https://www.instagram.com/cbgrupbarna/" },
  { src: "/logos/timechamber.webp",     alt: "Time Chamber",      dark: true,            instagram: "https://www.instagram.com/timechamber_es/" },
  { src: null,                           alt: "Eix Clot",          dark: false,           instagram: "https://www.instagram.com/eixclot/" },
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

  useEffect(() => {
    setCountdown(getCountdown(DEADLINE));
    const id = setInterval(() => setCountdown(getCountdown(DEADLINE)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Sempre afegim la classe perquè el banner és permanent (mentre l'oferta sigui vigent)
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
    <div className="early-bird-bar" role="banner">
      {/* Co-organizer logos — esquerra, clicar → Instagram */}
      <div className="eb-logos">
        {EB_LOGOS.map((l) => (
          <a
            key={l.alt}
            href={l.instagram}
            target="_blank"
            rel="noreferrer"
            className="eb-logo-link"
            aria-label={`Instagram de ${l.alt}`}
          >
            {l.src ? (
              <img
                src={l.src}
                alt={l.alt}
                className={[
                  "eb-logo",
                  l.dark     ? "eb-logo--dark"     : "",
                  l.featured ? "eb-logo--featured" : "",
                ].filter(Boolean).join(" ")}
              />
            ) : (
              <span className="eb-logo-text">{l.alt}</span>
            )}
          </a>
        ))}
      </div>

      <span className="eb-sep" aria-hidden="true" />

      {/* Promo Early Bird — centre, descompte MOLT més gran */}
      <div className="eb-promo">
        <span className="eb-flame" aria-hidden="true">🔥</span>
        <span className="eb-discount-big" aria-label="Descompte del 10 per cent">−10%</span>
        <span className="eb-text"><strong>EARLY BIRD</strong> · ACABA EN</span>
        <span className="eb-timer">
          <span>{String(days).padStart(1, "0")}D</span>
          <span>{String(hours).padStart(2, "0")}H</span>
          <span>{String(minutes).padStart(2, "0")}M</span>
          <span>{String(seconds).padStart(2, "0")}S</span>
        </span>
      </div>

      {/* No es pot tancar — banner permanent fins el deadline */}
    </div>
  );
}
