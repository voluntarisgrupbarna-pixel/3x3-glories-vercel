"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_WAIT_MS = 1_500;
const DONE_HOLD_MS  = 1_200;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const TOAST_TEAMS = [
  { team: "Lleons del Clot",           cat: "Cadet Masc." },
  { team: "Falcons de Gràcia",         cat: "Sènior Masc." },
  { team: "Tigres de Sarrià",          cat: "Júnior Masc." },
  { team: "Panteres de l'Eixample",    cat: "Sènior Fem." },
  { team: "Àguiles de Nou Barris",     cat: "Sènior Amateur Masc." },
  { team: "Llops de Sants",            cat: "Sub-23 Masc." },
  { team: "Corsaris de Poblenou",      cat: "Infantil Masc." },
  { team: "Dracs de Sant Andreu",      cat: "Cadet Fem." },
  { team: "Búfals de Sant Martí",      cat: "Sènior Masc." },
  { team: "Tornados del Guinardó",     cat: "Sènior Amateur Fem." },
  { team: "Estels de Les Corts",       cat: "Júnior Fem." },
  { team: "Balenes de la Barceloneta", cat: "Sub-23 Masc." },
  { team: "Pumes de la Sagrera",       cat: "Infantil Fem." },
  { team: "Falcons de Badalona",       cat: "Sènior Masc." },
  { team: "Tigres de l'Hospitalet",    cat: "Sènior Amateur Masc." },
  { team: "Condors de Horta",          cat: "Premini Masc." },
  { team: "Llames de Gràcia",          cat: "Sènior Fem." },
  { team: "Sharks del Raval",          cat: "Sub-23 Fem." },
];

// Toast especial d'escassetat per categories quasi plenes (actualitzat 29/05/2026)
const URGENCY_TOASTS = [
  "🔥 Sènior Masc. — ÚLTIMA plaça!",
  "🔥 Cadet Masc. — ÚLTIMA plaça!",
  "🔥 Premini Masc. — ÚLTIMA plaça!",
  "🔥 Escoleta — ÚLTIMA plaça!",
  "⚠️ Mini — 2 places restants",
  "⚠️ Cadet Fem. — 2 places restants",
  "⚠️ Sènior Fem. — 3 places restants",
  "⚠️ Infantil — 3 places restants",
];

interface Toast {
  id: number;
  text: string;
  isUrgency?: boolean;
}

interface Props {
  children: React.ReactNode;
}

export default function QueueGate({ children }: Props) {
  const [phase, setPhase]       = useState<"queue" | "done" | "form">("queue");
  const [progress, setProgress] = useState(0);
  const [position, setPosition] = useState<number | null>(null);
  const [connected, setConnected] = useState<number | null>(null);
  const [registered, setRegistered] = useState<number | null>(null);
  const [placesLeft, setPlacesLeft] = useState<number | null>(null);
  const [toasts, setToasts]     = useState<Toast[]>([]);

  const startRef      = useRef<number | null>(null);
  const rafRef        = useRef<number | null>(null);
  const posTimers     = useRef<ReturnType<typeof setTimeout>[]>([]);
  const toastTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urgencyFired  = useRef(false);
  const toastIdRef    = useRef(0);
  const usedTeams     = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (sessionStorage.getItem("queuePassed") === "1") {
      setPhase("form");
      return;
    }

    const initPos        = randomInt(5, 8);
    const initConnected  = randomInt(91, 148);
    const initRegistered = randomInt(27, 36);
    const initPlaces     = randomInt(33, 42);

    setPosition(initPos);
    setConnected(initConnected);
    setRegistered(initRegistered);
    setPlacesLeft(initPlaces);

    // Decrementar posició de forma natural
    let pos = initPos;
    for (let step = 1; step < initPos; step++) {
      const delay = (TOTAL_WAIT_MS / initPos) * step - 200;
      const t = setTimeout(() => {
        pos -= 1;
        setPosition(pos);
        // Petita fluctuació als connectats
        setConnected((c) => (c !== null ? c + randomInt(-3, 5) : c));
      }, delay);
      posTimers.current.push(t);
    }

    // Places lliures decreixen 1-2 cops durant l'espera
    const placesDecrement1 = setTimeout(() => {
      setPlacesLeft((p) => (p !== null ? p - 1 : p));
    }, randomInt(3_500, 5_500));
    const placesDecrement2 = setTimeout(() => {
      setPlacesLeft((p) => (p !== null ? p - 1 : p));
    }, randomInt(7_000, 9_500));
    posTimers.current.push(placesDecrement1, placesDecrement2);

    // Toast de categories quasi plenes (1 cop, a les 6-7s)
    const urgencyTimer = setTimeout(() => {
      if (urgencyFired.current) return;
      urgencyFired.current = true;
      const text = URGENCY_TOASTS[randomInt(0, URGENCY_TOASTS.length - 1)];
      const id = ++toastIdRef.current;
      setToasts((prev) => [...prev.slice(-2), { id, text, isUrgency: true }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4_500);
    }, randomInt(5_800, 7_200));
    posTimers.current.push(urgencyTimer);

    // Toasts d'equips encadenats recursivament
    const fireToast = () => {
      let idx: number;
      let attempts = 0;
      do {
        idx = randomInt(0, TOAST_TEAMS.length - 1);
        attempts++;
      } while (usedTeams.current.has(idx) && attempts < 20);
      usedTeams.current.add(idx);

      const { team, cat } = TOAST_TEAMS[idx];
      const id = ++toastIdRef.current;
      setToasts((prev) => [...prev.slice(-2), { id, text: `${team} · ${cat}` }]);
      setRegistered((r) => (r !== null ? r + 1 : r));

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3_500);

      if (usedTeams.current.size < TOAST_TEAMS.length) {
        toastTimer.current = setTimeout(fireToast, randomInt(2_000, 3_600));
      }
    };

    toastTimer.current = setTimeout(fireToast, 1_600);

    // Barra de progrés via rAF
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - (startRef.current ?? now);
      const pct     = Math.min(100, (elapsed / TOTAL_WAIT_MS) * 100);
      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("done");
        sessionStorage.setItem("queuePassed", "1");
        setTimeout(() => setPhase("form"), DONE_HOLD_MS);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current)     cancelAnimationFrame(rafRef.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      posTimers.current.forEach(clearTimeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === "form") return <>{children}</>;

  const isDone      = phase === "done";
  const secondsLeft = Math.max(1, Math.ceil((1 - progress / 100) * TOTAL_WAIT_MS / 1_000));
  const isLast      = position === 1;

  return (
    <div className="queue-overlay">

      {/* Toasts — inscripcions en temps real */}
      <div className="queue-toasts" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className={`queue-toast${t.isUrgency ? " queue-toast--urgency" : ""}`}>
            <span className="queue-toast-ball" aria-hidden="true">
              {t.isUrgency ? "⚠️" : "🏀"}
            </span>
            <span className="queue-toast-text">
              {t.isUrgency
                ? <strong style={{ fontSize: 12, color: "#fbbf24" }}>{t.text}</strong>
                : <><strong>Nou equip inscrit!</strong><br />{t.text}</>
              }
            </span>
          </div>
        ))}
      </div>

      <div className="queue-card">

        {/* Indicador live */}
        {!isDone && (
          <div className="queue-live">
            <span className="queue-live-dot" />
            EN VIU
          </div>
        )}

        {/* Icona */}
        <div className={`queue-icon${isDone ? " queue-icon--done" : ""}`}>
          {isDone ? "✅" : isLast ? "⚡" : "🏀"}
        </div>

        {/* Títol */}
        <h2 className="queue-title">
          {isDone
            ? "Plaça reservada!"
            : isLast
              ? "Tu ets el següent!"
              : "Reservant el teu lloc…"}
        </h2>

        <p className="queue-sub">
          {isDone
            ? "Ja pots completar el formulari d'inscripció."
            : isLast
              ? "Accés imminent. Prepara les dades del teu equip."
              : "Hi ha molta demanda. Estem garantint el teu lloc abans que s'acabi."}
        </p>

        {/* Barra progrés */}
        <div className="queue-bar-track">
          <div
            className={`queue-bar-fill${isDone ? " queue-bar-fill--done" : ""}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {!isDone && (
          <>
            {/* Countdown de segons */}
            <p className="queue-countdown">
              Temps estimat: <strong>{secondsLeft}s</strong>
            </p>

            {/* 4 stats */}
            <div className="queue-stats">
              <div className="queue-stat">
                <span className={`queue-stat-value${isLast ? " queue-stat-value--next" : ""}`}>
                  {isLast ? "→" : `#${position ?? "…"}`}
                </span>
                <span className="queue-stat-label">posició</span>
              </div>
              <div className="queue-stat-divider" />
              <div className="queue-stat">
                <span className="queue-stat-value">{connected ?? "…"}</span>
                <span className="queue-stat-label">connectats</span>
              </div>
              <div className="queue-stat-divider" />
              <div className="queue-stat">
                <span className="queue-stat-value queue-stat-value--places">
                  {placesLeft ?? "…"}
                </span>
                <span className="queue-stat-label">places lliures</span>
              </div>
              <div className="queue-stat-divider" />
              <div className="queue-stat">
                <span className="queue-stat-value">{registered ?? "…"}</span>
                <span className="queue-stat-label">inscrits avui</span>
              </div>
            </div>

            {/* Avís */}
            <p className="queue-warning">
              <span aria-hidden="true">⚠️</span> No tanquis la pàgina — perdràs el teu lloc
            </p>

            {/* Punts animats */}
            <div className="queue-dots" aria-hidden="true">
              <span /><span /><span />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
