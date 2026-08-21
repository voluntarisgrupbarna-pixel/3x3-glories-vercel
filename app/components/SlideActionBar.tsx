"use client";

import { useShareGate } from "./ShareGate";
import { WA_REGISTER_URL } from "../lib/whatsapp";

type SlideActionBarProps = {
  origin: string;
  title?: string;
  text?: string;
};

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com/";
const GALLERY_URL = "https://cbgrupbarna.info/fotos-3x3/";

export default function SlideActionBar({
  origin,
  title = "3×3 Westfield Glòries 2026",
  text = "Torneig 3×3 FIBA a Barcelona · 3a edició ja celebrada · 113 equips rècord",
}: SlideActionBarProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : SITE_URL;
  const { trigger: openShare, modal: shareModal } = useShareGate({
    shareData: { title, text, url: shareUrl },
    origin,
  });

  return (
    <div className="slide-action-bar" aria-label="Accions del 3×3">
      {shareModal}
      <a
        href={GALLERY_URL}
        target="_blank"
        rel="noreferrer noopener"
        className="slide-action slide-action--register"
      >
        <span aria-hidden="true">📸</span>
        Fotos i resultats
      </a>
      <a
        href={WA_REGISTER_URL}
        target="_blank"
        rel="noreferrer noopener"
        className="slide-action slide-action--contact"
      >
        <span aria-hidden="true">💬</span>
        WhatsApp
      </a>
      <button type="button" className="slide-action slide-action--share" onClick={openShare}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51 15.42 17.49M15.41 6.51 8.59 10.49" />
        </svg>
        Compartir
      </button>
    </div>
  );
}
