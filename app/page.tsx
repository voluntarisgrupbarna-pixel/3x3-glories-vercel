"use client";

import { useState } from "react";
import Link from "next/link";
import EarlyBirdBanner from "./components/EarlyBirdBanner";
import HeroFestival from "./components/HeroFestival";
import OccupancyGrid from "./components/OccupancyGrid";
import CategoryBars from "./components/CategoryBars";
import WhatsAppLeadWidget from "./components/WhatsAppLeadWidget";
import { faqs } from "./data/faqs";

export default function Home() {
  return (
    <>
      <EarlyBirdBanner />
      <main className="experience-shell">
        {/* === HERO FESTIVAL — primer impacte amb foto + nav + stats + IG === */}
        <HeroFestival />

        {/* === Secció informativa indexable (SEO) === */}
        <section className="event-info-section" aria-label="Sobre el torneig 3×3">
          <div className="event-info-inner">
            <h2>El torneig 3×3 més potent de Barcelona</h2>
            <p>
              El <strong>3×3 Westfield Glòries</strong> és el torneig oficial de bàsquet 3×3 amb punts FIBA
              del barri del Clot-Glòries de Barcelona. La <strong>4a edició</strong> se celebra els dies{" "}
              <strong>6 i 7 de juny de 2026</strong> amb <strong>2.000 € de prize money</strong> per als
              equips Sèniors Masculí i Sèniors Femení, i punts pel rànquing mundial de FIBA 3×3.
            </p>
            <div className="event-info-grid">
              <div>
                <strong>Categories</strong>
                <span>
                  Premini · Mini · Infantil · Cadet · Júnior · Sub-23 · Sènior Pro · Veterans M/F
                </span>
              </div>
              <div>
                <strong>Prize money</strong>
                <span>2.000 € Sèniors M/F · Trofeus i medalles per a totes les categories</span>
              </div>
              <div>
                <strong>Seus</strong>
                <span>Westfield Glòries · La Nau del Clot · Rambleta del Clot</span>
              </div>
              <div>
                <strong>Inscripció</strong>
                <span>Equips: 75–90 € · Sènior Pro: 85–90 € · Individual: 20 €</span>
              </div>
            </div>
            <a href="/inscripcion" className="event-info-cta">
              Inscriu el teu equip al 3×3 Barcelona →
            </a>
          </div>
        </section>

        {/* === Occupancy Grid — categories fill === */}
        <OccupancyGrid />

        {/* === Category Bars — places per categoria === */}
        <CategoryBars />

        {/* === Secció seus === */}
        <section className="venues-section" aria-label="Seus del torneig">
          <div className="venues-inner">
            <h2 className="venues-title">3 seus · 1 barri</h2>
            <div className="venues-grid">
              <a href="/seu/westfield-glories" className="venue-card">
                <span className="venue-card-tag">Seu principal</span>
                <strong>Westfield Glòries</strong>
                <span className="venue-card-addr">Av. Diagonal 208</span>
                <p>Zona de trobada, inscripcions, cerimònia i finals Sènior. Pàrquing gratis 2h.</p>
              </a>
              <a href="/seu/nau-del-clot" className="venue-card">
                <span className="venue-card-tag">Pavelló oficial</span>
                <strong>La Nau del Clot</strong>
                <span className="venue-card-addr">C/ de la Llacuna 172</span>
                <p>Pista coberta. Categories formatives (Premini–Sub-23) i semifinals Sènior.</p>
              </a>
              <a href="/seu/rambleta-del-clot" className="venue-card">
                <span className="venue-card-tag">Pista exterior</span>
                <strong>Rambleta del Clot</strong>
                <span className="venue-card-addr">Barri del Clot-Glòries</span>
                <p>Bàsquet de carrer: ambient, música i competició a l'aire lliure.</p>
              </a>
            </div>
          </div>
        </section>

        {/* === FAQ === */}
        <section className="faq-section" aria-label="Preguntes freqüents">
          <div className="faq-inner">
            <h2 className="faq-title">Preguntes freqüents</h2>
            <FaqAccordion />
            <div className="faq-footer">
              <Link href="/preguntes-frequents" className="faq-all-link">
                Veure totes les preguntes freqüents →
              </Link>
            </div>
          </div>
        </section>

        {/* === Porta un rival === */}
        <section className="rival-cta-section" aria-label="Porta un rival">
          <div className="rival-cta-inner">
            <span className="rival-cta-tag">Pack rival · −5 € cada un</span>
            <h2>Ja tens equip? Porta'n un de rival</h2>
            <p>
              Convida un altre equip a venir al 3×3 i estalvieu <strong>5 € cada un</strong>. Sense límit
              d'equips. Genera un codi únic i envia'l per WhatsApp en un clic.
            </p>
            <Link href="/porta-un-rival" className="rival-cta-btn">
              Generar repte WhatsApp →
            </Link>
          </div>
        </section>

        {/* === Inscripció individual === */}
        <section className="solo-cta-section" aria-label="Inscripció individual">
          <div className="solo-cta-inner">
            <span className="solo-cta-tag">Inscripció individual · 20 €</span>
            <h2>Vens sense equip? Apunta't sol</h2>
            <p>
              No tens equip? Apunta't individualment per <strong>20 €</strong> i et col·loquem en un equip
              una setmana abans del torneig. Inclou samarreta oficial, dorsal i accés als 2 dies.
            </p>
            <Link href="/inscripcio-individual" className="solo-cta-btn">
              Inscriure'm sol →
            </Link>
          </div>
        </section>

        <WhatsAppLeadWidget />
      </main>
    </>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  function toggle(i: number) {
    setOpen(open === i ? null : i);
  }

  return (
    <div className="faq-list">
      {faqs.map((faq, i) => (
        <div key={i} className={`faq-item${open === i ? " faq-item--open" : ""}`}>
          <button
            type="button"
            className="faq-question"
            aria-expanded={open === i}
            onClick={() => toggle(i)}
          >
            <span>{faq.q}</span>
            <span className="faq-icon" aria-hidden="true">
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && (
            <div className="faq-answer">
              <p>{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
