"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { faqs } from "../data/faqs";
import { WA_REGISTER_URL } from "../lib/whatsapp";
import type { Faq } from "../data/faqs";

interface Props {
  items?: Faq[];
  page?: string; // "frequents" | "home"
}

export default function FaqSearch({ items = faqs, page = "frequents" }: Props) {
  const [query, setQuery] = useState("");
  const [showIdForm, setShowIdForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rgpd, setRgpd] = useState(false);
  const [idSent, setIdSent] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmed = query.trim();
  const isSearching = trimmed.length >= 2;

  const filtered = isSearching
    ? items.filter(
        (f) =>
          f.q.toLowerCase().includes(trimmed.toLowerCase()) ||
          f.a.toLowerCase().includes(trimmed.toLowerCase()),
      )
    : items;

  // Track search query (debounced, fire & forget)
  const trackSearch = useCallback(
    (q: string, n?: string | null, em?: string | null) => {
      if (!q.trim() || q.trim().length < 2) return;
      fetch("/api/cerca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q.trim(),
          name: n || null,
          email: em || null,
          page,
          timestamp: new Date().toISOString(),
        }),
        keepalive: true,
      }).catch(() => {});
    },
    [page],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!isSearching) return;
    debounceRef.current = setTimeout(() => {
      trackSearch(query, idSent ? name : null, idSent ? email : null);
    }, 900);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, isSearching, trackSearch, idSent, name, email]);

  function handleIdentitySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rgpd || !email) return;
    setIdSent(true);
    setShowIdForm(false);
    trackSearch(trimmed || "(cedió dades)", name, email);
  }

  return (
    <div className="faq-search-root">
      {/* ── Search bar ── */}
      <div className="faq-search-bar">
        <span className="faq-search-icon" aria-hidden="true">🔍</span>
        <input
          type="search"
          className="faq-search-input"
          placeholder="Cerca una pregunta… (ex: inscripció, preus, FIBA…)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpenIdx(null);
          }}
          aria-label="Cerca entre les preguntes freqüents"
        />
        {query && (
          <button
            type="button"
            className="faq-search-clear"
            onClick={() => setQuery("")}
            aria-label="Esborra la cerca"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Identity capture (optional) ── */}
      {!idSent ? (
        <div className="faq-search-id-wrap">
          {!showIdForm ? (
            <button
              type="button"
              className="faq-search-id-trigger"
              onClick={() => setShowIdForm(true)}
            >
              📬 No has trobat el que busques? Rep la resposta per email
            </button>
          ) : (
            <form className="faq-search-id-form" onSubmit={handleIdentitySubmit}>
              <p className="faq-search-id-hint">
                Deixa les teves dades i us contestem en menys de 24h.{" "}
                <strong>Completament opcional.</strong>
              </p>
              <div className="faq-search-id-fields">
                <input
                  type="text"
                  placeholder="Nom (opcional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="faq-search-id-input"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="faq-search-id-input"
                />
              </div>
              <label className="faq-search-id-rgpd">
                <input
                  type="checkbox"
                  checked={rgpd}
                  onChange={(e) => setRgpd(e.target.checked)}
                  required
                />
                <span>
                  Accepto que CB Grup Barna guardi les meves dades per respondre la
                  meva consulta, d'acord amb la{" "}
                  <Link href="/contacte" style={{ color: "#ff375f" }}>
                    política de privacitat
                  </Link>
                  .
                </span>
              </label>
              <div className="faq-search-id-actions">
                <button
                  type="submit"
                  className="faq-search-id-btn"
                  disabled={!rgpd || !email}
                >
                  Enviar →
                </button>
                <button
                  type="button"
                  className="faq-search-id-cancel"
                  onClick={() => setShowIdForm(false)}
                >
                  Cancel·lar
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <p className="faq-search-id-ok">
          ✅ Dades rebudes! Us contestem en menys de 24h.
        </p>
      )}

      {/* ── Results count ── */}
      {isSearching && (
        <p className="faq-search-count">
          {filtered.length === 0
            ? "Cap resultat. Prova una altra paraula o escriu-nos."
            : `${filtered.length} pregunta${filtered.length !== 1 ? "es" : ""} trobada${filtered.length !== 1 ? "es" : ""}`}
        </p>
      )}

      {/* ── FAQ list (accordion when not searching) ── */}
      <div className="faq-search-list">
        {filtered.length > 0
          ? filtered.map((faq, i) => {
              const open = isSearching || openIdx === i;
              return (
                <div
                  key={faq.q}
                  className={`faq-search-item${open ? " faq-search-item--open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-search-q-btn"
                    onClick={() => !isSearching && setOpenIdx(open ? null : i)}
                    aria-expanded={open}
                  >
                    <span className="faq-search-q">{faq.q}</span>
                    {!isSearching && (
                      <span className="faq-search-chevron" aria-hidden="true">
                        {open ? "−" : "+"}
                      </span>
                    )}
                  </button>
                  {open && <p className="faq-search-a">{faq.a}</p>}
                </div>
              );
            })
          : isSearching && (
              <div className="faq-search-empty">
                <p>No hem trobat cap pregunta amb &ldquo;{trimmed}&rdquo;.</p>
                <a
                  href={WA_REGISTER_URL}
                  target="_blank" rel="noreferrer noopener"
                  className="faq-search-wa-link"
                >
                  📱 Deixa el mòbil i et responem per WhatsApp
                </a>
              </div>
            )}
      </div>
    </div>
  );
}
