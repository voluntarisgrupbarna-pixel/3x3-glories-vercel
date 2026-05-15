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

      {/* === Porta un rival === */}
      <section className="rival-cta-section" aria-label="Porta un rival">
        <div className="rival-cta-inner">
          <span className="rival-cta-tag">Pack rival · −5 € cada un</span>
          <h2>Ja tens equip? Porta&apos;n un de rival</h2>
          <p>
            Convida un altre equip a venir al 3×3 i estalvieu <strong>5 € cada un</strong>. Sense límit
            d&apos;equips. Genera un codi únic i envia&apos;l per WhatsApp en un clic.
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
          <h2>Vens sense equip? Apunta&apos;t sol</h2>
          <p>
            No tens equip? Apunta&apos;t individualment per <strong>20 €</strong> i et col·loquem en un equip
            una setmana abans del torneig. Inclou samarreta oficial, dorsal i accés als 2 dies.
          </p>
          <Link href="/inscripcio-individual" className="solo-cta-btn">
            Inscriure&apos;m sol →
          </Link>
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
