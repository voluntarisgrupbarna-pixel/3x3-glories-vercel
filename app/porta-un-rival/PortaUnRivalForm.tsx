"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const SITE_URL = "https://www.cbgrupbarna-3x3timechamber.com";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

function toCode(slug: string): string {
  // Codi llegible: RIVAL- + slug en majúscules. Si el slug és buit, fallback.
  if (!slug) return "";
  return `RIVAL-${slug.toUpperCase()}`;
}

export default function PortaUnRivalForm() {
  const [myTeam, setMyTeam] = useState("");
  const [rivalTeam, setRivalTeam] = useState("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Marca el formulari com a hidritat (es executa sols client-side)
  useEffect(() => {
    formRef.current?.setAttribute("data-rival-ready", "true");
  }, []);

  const refSlug = useMemo(() => slugify(myTeam), [myTeam]);
  const code = useMemo(() => toCode(refSlug), [refSlug]);

  const message = useMemo(() => {
    if (!myTeam || !rivalTeam || !code) return "";
    const link = `${SITE_URL}/inscripcion?ref=${refSlug}`;
    return `🏀 Ei!\n\nAcabem d'inscriure el ${myTeam} al 3×3 Westfield Glòries 2026 — el torneig FIBA del 6-7 juny a Barcelona.\n\nUs reto a venir-hi amb el ${rivalTeam} 💪\n\nSi us inscriviu amb el codi ${code}, l'organització ens descompta 5 € a cadascun. Codi vàlid només per a aquest repte.\n\nInfo i inscripció:\n${link}`;
  }, [myTeam, rivalTeam, code, refSlug]);

  const waLink = useMemo(() => {
    if (!message) return "";
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }, [message]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!myTeam.trim() || !rivalTeam.trim()) return;
    setGenerated(true);
    setCopied(false);
  }

  function handleReset() {
    setGenerated(false);
    setCopied(false);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_e) {
      // fallback silent
    }
  }

  return (
    <form className="rival-form" ref={formRef} onSubmit={handleSubmit}>
      <div className="rival-field">
        <label htmlFor="my-team">El nom del teu equip</label>
        <input
          id="my-team"
          type="text"
          value={myTeam}
          onChange={(e) => {
            setMyTeam(e.target.value);
            setGenerated(false);
          }}
          placeholder="Ex: CB Grup Barna A"
          required
          maxLength={60}
        />
      </div>

      <div className="rival-field">
        <label htmlFor="rival-team">L'equip que vols desafiar</label>
        <input
          id="rival-team"
          type="text"
          value={rivalTeam}
          onChange={(e) => {
            setRivalTeam(e.target.value);
            setGenerated(false);
          }}
          placeholder="Ex: CB Cornellà Sènior"
          required
          maxLength={60}
        />
      </div>

      {!generated ? (
        <button type="submit" className="rival-submit" disabled={!myTeam.trim() || !rivalTeam.trim()}>
          Genera el repte per WhatsApp →
        </button>
      ) : (
        <div className="rival-preview">
          <div className="rival-code-box">
            <span className="rival-code-label">Codi de descompte</span>
            <div className="rival-code-row">
              <code className="rival-code">{code}</code>
              <button type="button" className="rival-code-copy" onClick={copyCode}>
                {copied ? "Copiat ✓" : "Copiar"}
              </button>
            </div>
            <p className="rival-code-hint">
              Tots dos equips heu de citar aquest codi quan inscriviu — l'organització aplica −5 € a cada un.
              Apunta-te'l també tu.
            </p>
          </div>

          <span className="rival-preview-label">Missatge per al rival · revisa abans d'enviar</span>
          <pre className="rival-preview-msg">{message}</pre>
          <div className="rival-preview-actions">
            <a href={waLink} target="_blank" rel="noreferrer" className="rival-wa-btn">
              Obrir WhatsApp i triar contacte →
            </a>
            <button type="button" className="rival-edit-btn" onClick={handleReset}>
              Editar
            </button>
          </div>
          <p className="rival-tip">
            S'obrirà el WhatsApp amb el missatge ja escrit. Tu tries el capità rival entre els teus contactes
            i envies. Si no et surt cap chat, copia el missatge i envia-li manualment.
          </p>
        </div>
      )}
    </form>
  );
}
