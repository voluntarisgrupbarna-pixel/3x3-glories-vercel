"use client";

import { useState } from "react";

const STATS = [
  { value: "113", label: "Equips inscrits · rècord" },
  { value: "508", label: "Jugadors i jugadores" },
  { value: "2.000€", label: "Premi paritari repartit" },
  { value: "10", label: "Categories · Escoleta a Sènior" },
];

const PHOTOS = [
  "1UHH008wxY6sBXvG7t6qSEAnKmMODY1Lt",
  "1ODYtxv9iIAMkAZSGqagkbgQ2MlyO8X7z",
  "1ypt8F7oVjVCeXEmxfq8Re2wehq4HAf2C",
  "1kEWVGS5iEMPBaVlV38O4kiv1rHg3CoxF",
  "1ncKZeiKp2czJ_syPKQD3xkpdOo2-hSE5",
  "1gNZOL8vyhQI04fnvatX87_Lkm-sFM33_",
].map((id) => `https://drive.google.com/thumbnail?id=${id}&sz=w400`);

const GALLERY_URL = "https://cbgrupbarna.info/fotos-3x3/";

export default function PostEventRecap() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setStatus("loading");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          interest: "propera-edicio-2027",
          question: "avisar-2027",
          origin: "post-event-recap",
          consent: true,
        }),
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="torneig"
      aria-labelledby="recap-title"
      style={{
        background: "#050505",
        padding: "56px 18px",
        color: "#fff7ef",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#EF4444",
            margin: "0 0 8px",
          }}
        >
          3a edició · 6-7 juny 2026 · Ja celebrada
        </p>
        <h2 id="recap-title" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", margin: "0 0 14px" }}>
          Com va anar la 3a edició
        </h2>
        <p style={{ maxWidth: 640, lineHeight: 1.6, color: "rgba(255,247,239,0.8)", margin: "0 0 28px" }}>
          El 3×3 Westfield Glòries va créixer fins a <strong>113 equips inscrits</strong>, rècord
          històric del torneig, repartits en <strong>10 categories</strong> i 3 seus del barri del
          Clot-Glòries. Per primera vegada amb <strong>premi paritari</strong> —1.000€ per a la
          campiona Sènior Femení i 1.000€ per al campió Sènior Masculí— i oficialitat{" "}
          <strong>FIBA</strong> amb punts per al rànquing mundial. La categoria inclusiva{" "}
          <strong>Barna Màgics</strong> hi va competir amb trofeu propi i regles adaptades.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 16,
            margin: "0 0 32px",
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                border: "1px solid rgba(255,247,239,0.15)",
                borderRadius: 12,
                padding: "14px 12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,247,239,0.65)", marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
            gap: 8,
            margin: "0 0 24px",
          }}
        >
          {PHOTOS.map((src) => (
            <a key={src} href={GALLERY_URL} target="_blank" rel="noreferrer noopener">
              <img
                src={src}
                alt="3×3 Westfield Glòries 2026"
                loading="lazy"
                style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 8 }}
              />
            </a>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "0 0 40px" }}>
          <a
            href={GALLERY_URL}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              background: "#EF4444",
              color: "#fff",
              fontWeight: 800,
              padding: "12px 22px",
              borderRadius: 50,
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Veure les 377 fotos →
          </a>
          <a
            href="https://cbgrupbarna.info/3x3/"
            target="_blank"
            rel="noreferrer noopener"
            style={{
              border: "1px solid rgba(255,247,239,0.3)",
              color: "#fff7ef",
              fontWeight: 700,
              padding: "12px 22px",
              borderRadius: 50,
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Resum complet de l'edició
          </a>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, rgba(37,211,102,0.12), rgba(37,211,102,0.04))",
            border: "2px solid rgba(37,211,102,0.35)",
            borderRadius: 16,
            padding: "1.75rem",
          }}
        >
          {status === "done" ? (
            <p style={{ margin: 0, fontWeight: 700 }}>
              ✅ Fet! T&apos;avisarem quan obrim les inscripcions del 3×3 Barna 2027.
            </p>
          ) : (
            <>
              <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "1.1rem" }}>
                🔔 Vols saber-ho de primer quan obrim el 2027?
              </p>
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nom"
                  required
                  aria-label="Nom per avisar-te del 3x3 2027"
                  disabled={status === "loading"}
                  style={{
                    flex: "1 1 140px",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,247,239,0.25)",
                    background: "rgba(255,247,239,0.06)",
                    color: "#fff7ef",
                    fontSize: 16,
                  }}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mòbil"
                  required
                  aria-label="Mòbil per avisar-te del 3x3 2027"
                  disabled={status === "loading"}
                  style={{
                    flex: "1 1 140px",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,247,239,0.25)",
                    background: "rgba(255,247,239,0.06)",
                    color: "#fff7ef",
                    fontSize: 16,
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email opcional"
                  aria-label="Email opcional per avisar-te del 3x3 2027"
                  disabled={status === "loading"}
                  style={{
                    flex: "1 1 140px",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,247,239,0.25)",
                    background: "rgba(255,247,239,0.06)",
                    color: "#fff7ef",
                    fontSize: 16,
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    background: "#25d366",
                    color: "#fff",
                    fontWeight: 800,
                    padding: "10px 22px",
                    borderRadius: 8,
                    border: "none",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  {status === "loading" ? "…" : "Avisa'm"}
                </button>
              </form>
              {status === "error" && (
                <p style={{ marginTop: 10, fontSize: "0.85rem", color: "#EF4444" }}>
                  Error. Prova des de Contacte.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
