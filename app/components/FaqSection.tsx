"use client";

import { useState } from "react";
import Link from "next/link";
import { faqs } from "../data/faqs";
import { WA_REGISTER_URL } from "../lib/whatsapp";
import SlideActionBar from "./SlideActionBar";

/**
 * Secció FAQ integrada al home page — accordion compacte.
 * Mostra les 6 primeres preguntes + link "Veure totes" → /preguntes-frequents
 */
export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const visible = faqs.slice(0, 6);

  return (
    <section id="faqs" className="faq-section">
      <div className="faq-section-inner">
        <header className="faq-header">
          <span className="faq-kicker">Preguntes freqüents</span>
          <h2 className="faq-title">
            Tot el que has de <span className="faq-accent">saber</span>
          </h2>
          <p className="faq-subtitle">
            Com va anar la 3a edició i com t&apos;avisem quan obrim la propera.
          </p>
        </header>

        <div className="faq-list">
          {visible.map((faq, i) => {
            const open = openIdx === i;
            return (
              <div key={faq.q} className={`faq-item${open ? " faq-item--open" : ""}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIdx(open ? null : i)}
                  aria-expanded={open}
                >
                  <span>{faq.q}</span>
                  <span className="faq-chevron" aria-hidden="true">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="faq-footer">
          <p className="faq-more-text">No has trobat la teva resposta?</p>
          <div className="faq-actions">
            <Link href="/preguntes-frequents" className="faq-btn faq-btn--outline">
              Veure totes les preguntes freqüents →
            </Link>
            <a
              href={WA_REGISTER_URL}
              target="_blank" rel="noreferrer noopener"
              className="faq-btn faq-btn--wa"
            >
              📱 Pregunta per WhatsApp
            </a>
          </div>
        </div>

        <SlideActionBar origin="share-faq" />
      </div>
    </section>
  );
}
