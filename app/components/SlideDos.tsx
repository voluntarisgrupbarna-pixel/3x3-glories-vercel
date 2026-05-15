"use client";

import { useShareGate } from "./ShareGate";

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
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a7 7 0 0 1 13 0" />
      </svg>
    ),
    label: "EQUIP",
    value: "3+1 jugadors",
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
  },
];

export default function SlideDos() {
  const { trigger: handleShare, modal: shareModal } = useShareGate({
    shareData: {
      title: "3×3 Westfield Glòries 2026",
      text: "El torneig urbà més potent de Barcelona — 6 i 7 de juny 2026",
      url: typeof window !== "undefined" ? window.location.href : "https://cbgrupbarna-3x3timechamber.com/",
    },
    origin: "share-slidedos",
  });

  return (
    <section className="slide-dos" id="torneig" aria-label="El torneig 3×3 Westfield Glòries">
      {shareModal}
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
            Tres seus de competició oficial FIBA al barri del Clot-Glòries. Des de Premini fins a Sènior Pro amb Prize Money i punts per al rànquing mundial.
          </p>
          <div className="slide-dos-info-grid">
            {INFO_CARDS.map((card) => (
              <div key={card.label} className="slide-dos-info-card">
                <span className="slide-dos-info-icon">{card.icon}</span>
                <span className="slide-dos-info-label">{card.label}</span>
                <span className="slide-dos-info-value">{card.value}</span>
              </div>
            ))}
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
              href="https://wa.me/34698425153?text=Hola!%20Vull%20informació%20sobre%20el%203x3%20Westfield%20Glòries%202026"
              target="_blank"
              rel="noreferrer"
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
