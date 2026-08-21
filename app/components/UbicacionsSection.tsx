"use client";

import { useState } from "react";
import { VENUES, PROGRAM } from "../data/seccions3x3";
import SlideActionBar from "./SlideActionBar";

export default function UbicacionsSection() {
  const [active, setActive] = useState(1); // WG per defecte (seu principal)
  const v = VENUES[active];

  return (
    <section id="ubicacions" className="ubic-section">
      <div className="ubic-inner">

        {/* ── Header ── */}
        <header className="ubic-header">
          <span className="ubic-kicker">On juguem</span>
          <h2 className="ubic-title">
            3 seus · <span className="ubic-title-accent">1 barri</span>
          </h2>
          <p className="ubic-subtitle">
            Tots els recintes al barri del Clot-Glòries, menys de 15 min a peu entre ells.
          </p>
        </header>

        {/* ── Tab selector ── */}
        <div className="ubic-tabs" role="tablist">
          {VENUES.map((venue, i) => (
            <button
              key={venue.id}
              role="tab"
              aria-selected={active === i}
              type="button"
              onClick={() => setActive(i)}
              className={`ubic-tab${active === i ? " ubic-tab--active" : ""}`}
              style={{ "--tab-color": venue.color } as React.CSSProperties}
            >
              <span className="ubic-tab-emoji">{venue.emoji}</span>
              <span className="ubic-tab-name">{venue.name}</span>
              <span className="ubic-tab-type">{venue.type}</span>
            </button>
          ))}
        </div>

        {/* ── Panel principal ── */}
        <div className="ubic-panel">

          {/* Columna esquerra: foto + info */}
          <div className="ubic-panel-left">
            <div className="ubic-photo-wrap">
              <img
                key={v.id}
                src={v.photo}
                alt={`${v.name} — seu del 3×3 Westfield Glòries 2026`}
                className="ubic-photo"
              />
              <div className="ubic-photo-overlay" />
              <div className="ubic-photo-info">
                <span
                  className="ubic-photo-badge"
                  style={{ background: `${v.color}22`, color: v.color, borderColor: `${v.color}44` }}
                >
                  {v.type}
                </span>
                <h3 className="ubic-photo-name">{v.name}</h3>
                <p className="ubic-photo-addr">📍 {v.addr}</p>
              </div>
            </div>

            {/* Descripció */}
            <p className="ubic-desc">{v.desc}</p>

            {/* Transport */}
            <div className="ubic-transport">
              <p className="ubic-transport-title">Com arribar-hi</p>
              <div className="ubic-transport-rows">
                {(v.transport as readonly { icon: string; label: string; value: string }[]).map((t) => (
                  <div key={t.label} className="ubic-transport-row">
                    <span className="ubic-transport-icon">{t.icon}</span>
                    <span className="ubic-transport-label">{t.label}</span>
                    <span className="ubic-transport-value">{t.value}</span>
                  </div>
                ))}
              </div>
              <a
                href={v.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ubic-maps-btn"
                style={{ "--btn-color": v.color } as React.CSSProperties}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                Obrir en Google Maps
              </a>
            </div>

            {/* Categories */}
            <div className="ubic-cats">
              <p className="ubic-cats-title">Competicions aquí</p>
              <ul className="ubic-cats-list">
                {(v.categories as readonly string[]).map((cat) => (
                  <li key={cat} className="ubic-cat-item">
                    <span className="ubic-cat-dot" style={{ background: v.color }} />
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Columna dreta: mapa */}
          <div className="ubic-panel-right">
            <div className="ubic-map-wrap">
              <iframe
                key={active}
                title={`Mapa ${v.name}`}
                src={`https://maps.google.com/maps?q=${v.lat},${v.lng}&hl=ca&z=16&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://cbgrupbarna.info/fotos-3x3/"
              target="_blank"
              rel="noreferrer noopener"
              className="ubic-inscriu-btn"
              style={{ "--btn-color": v.color } as React.CSSProperties}
            >
              📸 Veure fotos i resultats →
            </a>
          </div>
        </div>

        {/* ── Circuit strip ── */}
        <div className="ubic-circuit">
          <div className="ubic-circuit-nodes">
            {VENUES.map((venue, i) => (
              <div key={venue.id} className="ubic-circuit-node">
                <span
                  className="ubic-circuit-dot"
                  style={{ background: venue.color, boxShadow: `0 0 8px ${venue.color}66` }}
                />
                <span className="ubic-circuit-id" style={{ color: venue.color }}>{venue.id}</span>
                <span className="ubic-circuit-name">{venue.name}</span>
                {i < VENUES.length - 1 && (
                  <span className="ubic-circuit-line" />
                )}
              </div>
            ))}
          </div>
          <p className="ubic-circuit-time">🚶 ~15 min a peu entre les tres seus · tot al barri del Clot-Glòries</p>
        </div>

        {/* ── Programa per dies ── */}
        <div className="ubic-program">
          <p className="ubic-program-title">Programa del torneig</p>
          <div className="ubic-program-grid">
            {PROGRAM.map((day) => (
              <div key={day.dateShort} className="ubic-program-day">
                <div className="ubic-program-day-header" style={{ borderColor: day.dayColor }}>
                  <span className="ubic-program-date" style={{ color: day.dayColor }}>{day.dateShort}</span>
                  <span className="ubic-program-dia">{day.dia}</span>
                </div>
                <ul className="ubic-program-cats">
                  {day.categories.map((cat) => (
                    <li key={cat.nom} className="ubic-program-cat">
                      <span className="ubic-program-hora">{cat.hora}</span>
                      <span className="ubic-program-nom">
                        {cat.nom}
                        {cat.fiba && (
                          <span className="ubic-fiba-badge">FIBA</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <SlideActionBar origin="share-ubicacions" />

      </div>
    </section>
  );
}
