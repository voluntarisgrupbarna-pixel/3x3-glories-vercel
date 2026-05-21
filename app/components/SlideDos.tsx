"use client";

import { useState } from "react";
import { useShareGate } from "./ShareGate";
import { WA_REGISTER_URL } from "../lib/whatsapp";

/* ── Programa per dia ─────────────────────────────────────── */
const PROGRAM = [
  {
    dia: "Dissabte 6 de Juny",
    dateShort: "6 Jun",
    categories: [
      { nom: "Sènior Masculí Pro", fiba: true },
      { nom: "Sènior Femení Pro",  fiba: true },
      { nom: "Veterans",          fiba: false },
    ],
  },
  {
    dia: "Diumenge 7 de Juny",
    dateShort: "7 Jun",
    categories: [
      { nom: "Màgics",      fiba: false },
      { nom: "Júnior",      fiba: false },
      { nom: "Cadet",       fiba: false },
      { nom: "Infantil",    fiba: false },
      { nom: "Preinfantil", fiba: false },
      { nom: "Mini",        fiba: false },
      { nom: "Premini",     fiba: false },
    ],
  },
];

/* ── Cards info ───────────────────────────────────────────── */
const INFO_CARDS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" />
      </svg>
    ),
    label: "DATES",
    value: "6-7 Juny 2026",
    href: null,           // obre modal
    action: "calendar",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 21s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    label: "SEUS",
    value: "3 ubicacions",
    href: "#ubicacions",
    action: null,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a7 7 0 0 1 13 0" />
      </svg>
    ),
    label: "EQUIP",
    value: "4+1 jugadors",
    href: "/inscripcion",
    action: null,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2l4 4V5L6 9z" />
        <path d="M18 9a3 3 0 0 1 0 6M15 8a5 5 0 0 1 0 8" />
      </svg>
    ),
    label: "INSCRIPCIÓ",
    value: "des de 75€",
    href: "/inscripcion",
    action: null,
  },
];

/* ── Modal calendari ──────────────────────────────────────── */
function CalendarModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="cal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Programa del torneig">
      <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cal-header">
          <span className="cal-title">Programa 2026</span>
          <button className="cal-close" onClick={onClose} aria-label="Tancar">×</button>
        </div>

        <div className="cal-days">
          {PROGRAM.map((day) => (
            <div key={day.dateShort} className="cal-day">
              <div className="cal-day-header">
                <span className="cal-day-num">{day.dateShort}</span>
                <span className="cal-day-name">{day.dia}</span>
              </div>
              <ul className="cal-cats">
                {day.categories.map((cat) => (
                  <li key={cat.nom} className="cal-cat">
                    <span className="cal-cat-dot" />
                    {cat.nom}
                    {cat.fiba && <span className="cal-fiba-badge">FIBA · Premi en Metàl·lic</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <a href="/inscripcion" className="cal-cta" onClick={onClose}>
          Inscriu el teu equip →
        </a>
      </div>
    </div>
  );
}

/* ── Component principal ──────────────────────────────────── */
export default function SlideDos() {
  const [calOpen, setCalOpen] = useState(false);

  const { trigger: handleShare, modal: shareModal } = useShareGate({
    shareData: {
      title: "3×3 Westfield Glòries 2026",
      text: "El torneig urbà més potent de Barcelona — 6 i 7 de juny 2026",
      url: typeof window !== "undefined" ? window.location.href : "https://www.cbgrupbarna-3x3timechamber.com/",
    },
    origin: "share-slidedos",
  });

  return (
    <section className="slide-dos" id="torneig" aria-label="El torneig 3×3 Westfield Glòries">
      {shareModal}
      {calOpen && <CalendarModal onClose={() => setCalOpen(false)} />}

      <div className="slide-dos-inner">
        {/* Columna esquerra */}
        <div className="slide-dos-left">
          <span className="slide-dos-kicker">El Torneig</span>
          <h2 className="slide-dos-title">
            El torneig urbà<br />
            <span className="slide-dos-title-accent">més potent</span><br />
            de Barcelona
          </h2>
          <p className="slide-dos-desc">
            El <strong>3×3 Westfield Glòries</strong> organitzat per <strong>CB Grup Barna</strong>, <strong>Time Chamber</strong> i <strong>Eix Clot</strong> torna amb més equips, més categories i més espectacle.
          </p>
          <p className="slide-dos-desc">
            Tres seus de competició oficial FIBA al barri del Clot-Glòries. Des de Premini fins a Sènior Pro amb Premi en Metàl·lic i punts per al rànquing mundial.
          </p>

          <div className="slide-dos-info-grid">
            {INFO_CARDS.map((card) =>
              card.action === "calendar" ? (
                <button
                  key={card.label}
                  type="button"
                  className="slide-dos-info-card slide-dos-info-card--link"
                  onClick={() => setCalOpen(true)}
                  aria-label="Veure el programa del torneig"
                >
                  <span className="slide-dos-info-icon">{card.icon}</span>
                  <span className="slide-dos-info-label">{card.label}</span>
                  <span className="slide-dos-info-value">{card.value}</span>
                  <span className="slide-dos-info-arrow">→</span>
                </button>
              ) : (
                <a
                  key={card.label}
                  href={card.href!}
                  className="slide-dos-info-card slide-dos-info-card--link"
                >
                  <span className="slide-dos-info-icon">{card.icon}</span>
                  <span className="slide-dos-info-label">{card.label}</span>
                  <span className="slide-dos-info-value">{card.value}</span>
                  <span className="slide-dos-info-arrow">→</span>
                </a>
              )
            )}
          </div>
        </div>

        {/* Columna dreta */}
        <div className="slide-dos-right">
          <div className="slide-dos-img-wrap">
            <img
              src="/hero-bg-3.jpg"
              alt="Jugadora encistellant en un partit del 3×3 Westfield Glòries"
              className="slide-dos-img"
              width={600}
              height={750}
              loading="lazy"
            />
            <span className="slide-dos-badge">4ª<br />EDICIÓ</span>
            <div className="slide-dos-overlay-card">
              <span className="slide-dos-overlay-tag">#1 Esport Urbà del Món</span>
              <p className="slide-dos-overlay-text">Olímpic des de Tòquio 2021</p>
            </div>
          </div>

          {/* Botons flotants */}
          <div className="slide-dos-float-btns">
            <button
              type="button"
              className="slide-dos-btn-share"
              onClick={handleShare}
              aria-label="Compartir el torneig"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.59 13.51 15.42 17.49M15.41 6.51 8.59 10.49" />
              </svg>
              Compartir
            </button>
            <a
              href={WA_REGISTER_URL}
              target="_blank" rel="noreferrer noopener"
              className="slide-dos-btn-wa"
              aria-label="Contactar per WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.116 1.533 5.847L.057 23.572a.5.5 0 0 0 .604.635l5.928-1.557A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.502-5.177-1.381l-.371-.218-3.847 1.009 1.022-3.742-.239-.384A9.958 9.958 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
