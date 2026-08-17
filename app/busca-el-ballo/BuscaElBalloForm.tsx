"use client";

import { useState } from "react";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyHnW1sC5wPmajjbTO2Nr9yksKmft3es4boulb8hWPI1FBc-JAmpEL7s3zZ7oQJ_kGw/exec";

type FormState = "idle" | "sending" | "success" | "error";

export default function BuscaElBalloForm() {
  const [nom, setNom] = useState("");
  const [cognom, setCognom] = useState("");
  const [instagram, setInstagram] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [cbSegueix, setCbSegueix] = useState(false);
  const [cbBases, setCbBases] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const igClean = instagram.trim().replace(/^@/, "");

    if (!nom.trim()) return setErrorMsg("El nom és obligatori.");
    if (!igClean) return setErrorMsg("El compte d'Instagram és obligatori.");
    if (!cbSegueix) return setErrorMsg("Has de seguir @cbgrupbarna per participar.");
    if (!cbBases) return setErrorMsg("Has d'acceptar les bases del sorteig.");

    setState("sending");

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          nom: nom.trim(),
          cognom: cognom.trim(),
          instagram: igClean,
          email: email.trim(),
          telefon: telefon.trim(),
          accepta_segueix: cbSegueix,
          accepta_bases: cbBases,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.ok) {
        setState("success");
      } else {
        setErrorMsg(data.error || "Error desconegut. Torna-ho a intentar.");
        setState("error");
      }
    } catch {
      setErrorMsg("Error de connexió. Comprova internet i torna-ho a intentar.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="beb-success">
        <div className="beb-success-icon">🏀</div>
        <h2 className="beb-success-title">Estàs dins!</h2>
        <p className="beb-success-sub">Registre completat correctament</p>
        <p className="beb-success-desc">
          Ara ves a Instagram, troba el balló al cartell i comenta:
        </p>
        <div className="beb-wilson">WILSON</div>
        <p className="beb-success-desc">
          Etiqueta un amic al comentari per multiplicar les teves opcions.<br />
          <br />
          Sorteig en directe el <strong style={{ color: "#FFD700" }}>6 de juny</strong>
          <br />al 3×3 Westfield Glòries, Barcelona.
        </p>
      </div>
    );
  }

  return (
    <form className="beb-form" onSubmit={handleSubmit} noValidate>
      {/* Passos */}
      <div className="beb-steps">
        {[
          { n: 1, text: <><strong>Segueix</strong> @cbgrupbarna a Instagram</> },
          { n: 2, text: <><strong>Registra&apos;t</strong> aquí baix amb les teves dades</> },
          { n: 3, text: <>Troba el balló al cartell i comenta <strong>WILSON</strong> a la publicació</> },
          { n: 4, text: <><strong>Etiqueta un amic</strong> al comentari (×3 amics = ×3 participació)</> },
        ].map(({ n, text }) => (
          <div key={n} className="beb-step">
            <span className="beb-step-num">{n}</span>
            <span className="beb-step-text">{text}</span>
          </div>
        ))}
      </div>

      {/* Nom + Cognom */}
      <div className="beb-row">
        <div className="beb-field">
          <label htmlFor="beb-nom">
            Nom <span className="beb-req">*</span>
          </label>
          <input
            id="beb-nom"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Marc"
            maxLength={60}
            autoComplete="given-name"
            required
          />
        </div>
        <div className="beb-field">
          <label htmlFor="beb-cognom">Cognom</label>
          <input
            id="beb-cognom"
            type="text"
            value={cognom}
            onChange={(e) => setCognom(e.target.value)}
            placeholder="Garcia"
            maxLength={80}
            autoComplete="family-name"
          />
        </div>
      </div>

      {/* Instagram */}
      <div className="beb-field">
        <label htmlFor="beb-ig">
          Instagram <span className="beb-req">*</span>
        </label>
        <div className="beb-ig-wrap">
          <span className="beb-ig-at">@</span>
          <input
            id="beb-ig"
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value.replace(/^@/, ""))}
            placeholder="el_teu_compte"
            maxLength={40}
            autoComplete="off"
            autoCapitalize="none"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="beb-field">
        <label htmlFor="beb-email">Email</label>
        <input
          id="beb-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correu@exemple.com"
          maxLength={120}
          autoComplete="email"
        />
      </div>

      {/* Telèfon */}
      <div className="beb-field">
        <label htmlFor="beb-tel">Telèfon</label>
        <input
          id="beb-tel"
          type="tel"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          placeholder="600 000 000"
          maxLength={20}
          autoComplete="tel"
        />
      </div>

      {/* Checkboxes */}
      <div className="beb-checks">
        <label className="beb-check-item">
          <input
            type="checkbox"
            checked={cbSegueix}
            onChange={(e) => setCbSegueix(e.target.checked)}
          />
          <span>
            Segueixo <strong>@cbgrupbarna</strong> a Instagram{" "}
            <span className="beb-req">*</span>
          </span>
        </label>
        <label className="beb-check-item">
          <input
            type="checkbox"
            checked={cbBases}
            onChange={(e) => setCbBases(e.target.checked)}
          />
          <span>
            Accepto les <strong>bases del sorteig</strong> i la{" "}
            <a href="/avis-legal" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
              política de privacitat (RGPD)
            </a>{" "}
            <span className="beb-req">*</span>
          </span>
        </label>
      </div>

      {/* Error */}
      {(state === "error" || errorMsg) && (
        <p className="beb-error">⚠️ {errorMsg}</p>
      )}

      {/* Botó */}
      <button
        type="submit"
        className="beb-submit"
        disabled={state === "sending"}
      >
        {state === "sending" ? "Enviant…" : "Participar ara →"}
      </button>
    </form>
  );
}
