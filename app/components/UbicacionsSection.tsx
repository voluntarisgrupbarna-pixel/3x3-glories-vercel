"use client";

import { useState } from "react";
import { VENUES } from "../data/seccions3x3";

export default function UbicacionsSection() {
  const [activeVenue, setActiveVenue] = useState(0);
  const v = VENUES[activeVenue];

  return (
    <section id="ubicacions" className="ubicacions-section">
      <div className="section-inner">
        <header className="section-header">
          <span className="section-kicker">On juguem</span>
          <h2 className="section-title">
            3 SEUS · <span className="accent">1 BARRI</span>
          </h2>
          <p className="section-desc">
            La Nau del Clot, Westfield Glòries i la Rambleta del Clot formen el circuit
            del torneig al barri del Clot-Glòries.
          </p>
        </header>

        <div className="ubicacions-grid">
          {/* Columna esquerra */}
          <div className="ubicacions-col">
            {VENUES.map((venue, i) => (
              <button
                key={venue.id}
                type="button"
                onClick={() => setActiveVenue(i)}
                className={`venue-sel-card ${activeVenue === i ? "venue-sel-card--active" : ""}`}
                style={{ "--card-color": venue.color } as React.CSSProperties}
              >
                <span className="venue-sel-emoji">{venue.emoji}</span>
                <span className="venue-sel-info">
                  <span className="venue-sel-name">
                    {venue.name}
                    <span className="venue-sel-badge" style={{ color: venue.color, background: `${venue.color}22` }}>
                      {venue.id}
                    </span>
                  </span>
                  <span className="venue-sel-type" style={{ color: venue.color }}>{venue.type}</span>
                  <span className="venue-sel-addr">{venue.addr}</span>
                </span>
              </button>
            ))}

            <div className="circuit-bar">
              <p className="circuit-label">Circuit</p>
              <div className="circuit-line">
                <span style={{ color: "#E31E24", fontWeight: 800 }}>NC</span>
                <span className="circuit-dash" />
                <span style={{ color: "#F97316", fontWeight: 800 }}>WG</span>
                <span className="circuit-dash" />
                <span style={{ color: "#EAB308", fontWeight: 800 }}>RC</span>
              </div>
              <p className="circuit-time">🚶 ~15 min a peu entre les tres seus</p>
            </div>

            <div className="venue-links">
              <p className="venue-links-label">Tota la info per seu</p>
              <a href="/seu/westfield-glories" className="venue-link">
                <span>🏬 Westfield Glòries · Seu Principal</span>
                <span className="venue-link-arrow">›</span>
              </a>
              <a href="/seu/nau-del-clot" className="venue-link">
                <span>🏟️ La Nau del Clot · Pavelló Oficial</span>
                <span className="venue-link-arrow">›</span>
              </a>
              <a href="/seu/rambleta-del-clot" className="venue-link">
                <span>🌳 Rambleta del Clot · Streetball</span>
                <span className="venue-link-arrow">›</span>
              </a>
            </div>
          </div>

          {/* Columna dreta — Google Maps */}
          <div className="ubicacions-map-col">
            <div className="map-embed-wrap">
              <iframe
                key={activeVenue}
                title={`Mapa ${v.name} · 3x3 Westfield Glòries`}
                src={`https://maps.google.com/maps?q=${v.lat},${v.lng}&hl=ca&z=16&output=embed`}
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="map-info-bar">
              <span className="map-info-emoji">{v.emoji}</span>
              <span className="map-info-text">
                <strong>{v.name}</strong>
                <small>{v.addr}</small>
              </span>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(v.addr)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-info-link"
              >
                📍 Com arribar-hi
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
