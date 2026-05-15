"use client";

import { useState } from "react";
import Link from "next/link";
import EarlyBirdBanner from "./components/EarlyBirdBanner";
import HeroFestival from "./components/HeroFestival";
import WhatsAppLeadWidget from "./components/WhatsAppLeadWidget";
import SlideDos from "./components/SlideDos";
import UbicacionsSection from "./components/UbicacionsSection";
import PremisSection from "./components/PremisSection";
import CategoriesSection from "./components/CategoriesSection";
import { faqs } from "./data/faqs";

export default function Home() {
  return (
    <>
      <EarlyBirdBanner />
      <main className="experience-shell">
        {/* === HERO FESTIVAL — primer impacte amb foto + nav + stats + IG === */}
        <HeroFestival />

        {/* === SLIDE DOS — rèplica del disseny original: el torneig === */}
        <SlideDos />
      </main>

      {/* === Ubicacions — 3 seus amb mapa === */}
      <UbicacionsSection />

      {/* === Premis & Trofeus === */}
      <PremisSection />

      {/* === Categories — dia 6 + dia 7 === */}
      <CategoriesSection />

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


      <WhatsAppLeadWidget />
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
