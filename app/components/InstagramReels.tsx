"use client";

const REELS = [
  {
    id: "DJND83Ush_P",
    url: "https://www.instagram.com/reel/DJND83Ush_P/embed/",
  },
  {
    id: "DJR-4_RsR9O",
    url: "https://www.instagram.com/reel/DJR-4_RsR9O/embed/",
  },
  {
    id: "DIzMiM4Mfbh",
    url: "https://www.instagram.com/reel/DIzMiM4Mfbh/embed/",
  },
];

export default function InstagramReels() {
  return (
    <section id="galeria" className="ig-reels-section" aria-label="Galeria de vídeos">
      <div className="ig-reels-inner">
        <div className="ig-reels-header">
          <p className="ig-reels-kicker">GALERIA · @CBGRUPBARNA</p>
          <h2 className="ig-reels-title">El 3×3 en moviment</h2>
          <a
            href="https://www.instagram.com/cbgrupbarna/"
            target="_blank"
            rel="noreferrer"
            className="ig-reels-link"
          >
            Veure tots els vídeos →
          </a>
        </div>

        <div className="ig-reels-grid">
          {REELS.map((reel) => (
            <div key={reel.id} className="ig-reel-wrap">
              <iframe
                src={reel.url}
                className="ig-reel-iframe"
                frameBorder="0"
                scrolling="no"
                allow="encrypted-media; autoplay; clipboard-write"
                loading="lazy"
                title={`Reel Instagram 3×3 Westfield Glòries ${reel.id}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
