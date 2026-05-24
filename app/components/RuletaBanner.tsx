"use client";

import Link from "next/link";

/**
 * Banner promocional de la Ruleta 3×3.
 * Convida als visitants de la web a jugar a la ruleta per guanyar premis
 * i inscriure's al 3×3 amb descompte.
 */
export default function RuletaBanner() {
  return (
    <section
      aria-labelledby="ruleta-banner-title"
      style={{
        position: "relative",
        background:
          "linear-gradient(135deg,#0d1528 0%,#1a2a50 45%,#2a4fa8 100%)",
        borderTop: "1px solid #2a4fa8",
        borderBottom: "1px solid #2a4fa8",
        padding: "44px 18px",
        overflow: "hidden",
      }}
    >
      {/* Decorative blur lights */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-60px",
          left: "10%",
          width: "260px",
          height: "260px",
          background: "radial-gradient(circle,#ff1f4f 0%,transparent 70%)",
          opacity: 0.35,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-80px",
          right: "8%",
          width: "320px",
          height: "320px",
          background: "radial-gradient(circle,#ffcc66 0%,transparent 70%)",
          opacity: 0.22,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
          flexWrap: "wrap",
        }}
      >
        {/* Esquerra: wheel emoji + text */}
        <div style={{ display: "flex", gap: 22, alignItems: "center", flex: "1 1 380px" }}>
          <div
            aria-hidden
            style={{
              fontSize: 76,
              filter: "drop-shadow(0 4px 18px rgba(255,31,79,0.6))",
              animation: "spin 7s linear infinite",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            🎰
          </div>
          <div>
            <div
              style={{
                display: "inline-block",
                background: "#ff1f4f",
                color: "#fff",
                fontSize: 11,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 2,
                padding: "4px 12px",
                borderRadius: 50,
                marginBottom: 10,
              }}
            >
              🎁 NOU · Sorteig diari
            </div>
            <h2
              id="ruleta-banner-title"
              style={{
                fontSize: 30,
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: 1.1,
                margin: 0,
                color: "#fff",
                letterSpacing: -0.5,
              }}
            >
              Gira la <span style={{ color: "#ff1f4f" }}>ruleta</span> i
              guanya premis!
            </h2>
            <p
              style={{
                margin: "10px 0 0",
                color: "#c0c8d8",
                fontSize: 14,
                lineHeight: 1.55,
                maxWidth: 500,
              }}
            >
              Inscripcions gratis, samarretes, regals i descomptes per al{" "}
              <strong style={{ color: "#ffcc66" }}>3×3 Westfield Glòries</strong>.
              Tens 3 tirades — tries el premi que vols!
              <br />
              <span style={{ color: "#7a8a9e", fontSize: 12 }}>
                <em>Inscripciones gratis, camisetas, regalos y descuentos. 3 tiradas — eliges tu premio.</em>
              </span>
            </p>
          </div>
        </div>

        {/* Dreta: CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "stretch",
            minWidth: 220,
          }}
        >
          <Link
            href="/ruleta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "linear-gradient(135deg,#ff1f4f 0%,#ff6b35 100%)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 2,
              textDecoration: "none",
              padding: "16px 32px",
              borderRadius: 50,
              boxShadow: "0 10px 32px rgba(255,31,79,0.45)",
              transition: "transform .15s, box-shadow .15s",
            }}
          >
            🎰 JUGAR ARA
          </Link>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: "#7a8a9e",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Gratis · 30 segons · 3 tirades garantides
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @media (max-width: 640px) {
          section h2 {
            font-size: 24px !important;
          }
          section [aria-hidden]:first-child {
            font-size: 56px !important;
          }
        }
      `}</style>
    </section>
  );
}
