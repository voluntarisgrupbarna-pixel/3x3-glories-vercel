"use client";

import { useEffect, useState } from "react";
import { useShareGate } from "./ShareGate";

const SHARE_URL = "https://www.cbgrupbarna-3x3timechamber.com";
const DEADLINE = new Date("2026-05-21T00:00:00+02:00");
const REFERRAL_CODE = "AMIC5";

const SHARE_TEXT = "🏀 Juga el 3x3 a Westfield Glòries! CB Grup Barna organitza el torneig 6-7 de juny.";

export default function ReferralCard() {
  const [shareCount, setShareCount] = useState(0);
  const [isEarlyBird, setIsEarlyBird] = useState(false);

  // ShareGate captura el contacte abans de compartir → /api/lead → Sheet "Leads"
  const { trigger: openShareGate, modal: shareModal } = useShareGate({
    shareData: {
      title: "3×3 Westfield Glòries 2026",
      text: SHARE_TEXT,
      url: SHARE_URL,
    },
    origin: "share-referral",
  });

  useEffect(() => {
    const stored = parseInt(localStorage.getItem("share_count_3x3") ?? "0", 10);
    setShareCount(Math.min(stored, 5));
    setIsEarlyBird(Date.now() < DEADLINE.getTime());
  }, []);

  function handleShare() {
    const next = Math.min(shareCount + 1, 5);
    setShareCount(next);
    localStorage.setItem("share_count_3x3", String(next));
    openShareGate();
  }

  const referralUnlocked = shareCount >= 5;

  return (
    <div className="discount-card">
      {shareModal}
      <p className="discount-card-title">Descomptes disponibles</p>

      {isEarlyBird && (
        <div className="discount-block discount-block-green">
          <span className="discount-badge discount-badge-green">−10%</span>
          <div>
            <strong>Early Bird</strong>
            <p>
              Inscriu-te fins el <strong>20 de maig</strong> i obtindràs un 10% de descompte.
              Menciona&apos;l quan contactis per WhatsApp.
            </p>
          </div>
        </div>
      )}

      <div className="discount-block" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 20, marginBottom: 20 }}>
        <span className={`discount-badge${referralUnlocked ? " discount-badge-unlocked" : ""}`}>
          {referralUnlocked ? "−5%" : "+5%"}
        </span>
        <div>
          <strong>Referral extra</strong>
          {referralUnlocked ? (
            <>
              <p>Codi desbloquejat! Menciona&apos;l quan contactis per WhatsApp.</p>
              <div className="referral-code">{REFERRAL_CODE}</div>
            </>
          ) : (
            <>
              <p>Reenvia la pàgina a 5 amics per WhatsApp i obtén un 5% addicional.</p>
              <button className="referral-share-btn" type="button" onClick={handleShare}>
                📲 Comparteix ({shareCount}/5 amics)
              </button>
            </>
          )}
        </div>
      </div>

      {isEarlyBird && (
        <div className="discount-total-row">
          <span>Màxim acumulable:</span>
          <strong>{referralUnlocked ? "−15% ✅" : `−${10 + (referralUnlocked ? 5 : 0)}% ara · fins a −15%`}</strong>
        </div>
      )}

      <a
        className="referral-follow-btn"
        href="https://www.instagram.com/cbgrupbarna/"
        target="_blank"
        rel="noreferrer"
      >
        📸 Segueix @cbgrupbarna a Instagram
      </a>
    </div>
  );
}
