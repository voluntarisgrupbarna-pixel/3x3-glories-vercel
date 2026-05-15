"use client";

import { useEffect, useRef, useState } from "react";
import { heroVideos } from "../data/heroVideos";

export default function HeroVideoBanner() {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const slides = heroVideos.length ? heroVideos : [];
  const video = slides[current];

  // Auto-rotate slides cada 12s (només si hi ha més d'un)
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!video) return null;

  return (
    <section className="hero-video-banner" aria-label="3×3 Westfield Glòries 2026">
      <div className="hero-video-stage">
        {video.type === "mp4" ? (
          <video
            ref={videoRef}
            key={video.source}
            poster={video.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={video.title}
          >
            {video.sourceMobile && (
              <source src={video.sourceMobile} type="video/mp4" media="(max-width: 768px)" />
            )}
            <source src={video.source} type="video/mp4" />
          </video>
        ) : (
          <InstagramReelPoster reelId={video.source} poster={video.poster} title={video.title} />
        )}
        <div className="hero-video-tint" aria-hidden="true" />
      </div>

      <div className="hero-video-overlay">
        <div className="hero-video-kicker">CB GRUP BARNA × TIME CHAMBER × EIX CLOT</div>
        <h1 className="hero-video-headline">
          3×3 <em>Westfield Glòries</em> 2026
        </h1>
        <p className="hero-video-sub">
          6 i 7 de juny · 3 seus al Clot-Glòries · Punts FIBA · <strong>2.000 € prize money</strong>
        </p>
        <div className="hero-video-actions">
          <a href="/inscripcion" className="hero-video-cta-primary">
            Inscriu el teu equip →
          </a>
          <a
            href="https://wa.me/34698425153?text=Hola!+Tinc+dubtes+sobre+el+3x3+Westfield+Gl%C3%B2ries+2026"
            target="_blank"
            rel="noreferrer"
            className="hero-video-cta-secondary"
          >
            Pregunta'ns
          </a>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="hero-video-dots" role="tablist" aria-label="Selector de vídeo">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Vídeo ${i + 1} de ${slides.length}`}
              className={`hero-video-dot${i === current ? " hero-video-dot-active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ===== Instagram Reel poster =====
// Mostra un poster (Instagram CDN o gradient) + botó play que obre el Reel a IG en nova pestanya.
// Aquest patró cumpleix els TOS d'Instagram i no requereix descarregar el vídeo.
function InstagramReelPoster({
  reelId,
  poster,
  title,
}: {
  reelId: string;
  poster?: string;
  title: string;
}) {
  const reelUrl = `https://www.instagram.com/reel/${reelId}/`;
  return (
    <a
      href={reelUrl}
      target="_blank"
      rel="noreferrer"
      className="hero-video-ig-link"
      aria-label={`Obrir Reel d'Instagram: ${title}`}
    >
      {poster ? (
        <img
          src={poster}
          alt={title}
          className="hero-video-ig-poster"
          width={1200}
          height={1500}
          loading="eager"
          decoding="async"
        />
      ) : (
        <div className="hero-video-ig-fallback" aria-hidden="true" />
      )}
      <div className="hero-video-ig-play" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="80" height="80">
          <circle cx="32" cy="32" r="32" fill="rgba(255,55,95,0.9)" />
          <polygon points="26,20 26,44 46,32" fill="#fff" />
        </svg>
        <span className="hero-video-ig-label">Veure a Instagram</span>
      </div>
    </a>
  );
}
