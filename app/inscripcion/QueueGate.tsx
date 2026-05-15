"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_WAIT_MS = 12_000;
const DONE_HOLD_MS  = 1_400;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const TOAST_TEAMS = [
  { team: "Lleons del Clot",          cat: "Cadet Masc." },
  { team: "Falcons de Gràcia",        cat: "Sènior Masc." },
  { team: "Tigres de Sarrià",         cat: "Júnior Masc." },
  { team: "Panteres de l'Eixample",   cat: "Sènior Fem." },
  { team: "Àguiles de Nou Barris",    cat: "Veterans Masc." },
  { team: "Llops de Sants",           cat: "Sub-23 Masc." },
  { team: "Corsaris de Poblenou",     cat: "Infantil Masc." },
  { team: "Dracs de Sant Andreu",     cat: "Cadet Fem." },
  { team: "Búfals de Sant Martí",     cat: "Sènior Masc." },
  { team: "Tornados del Guinardó",    cat: "Veterans Fem." },
  { team: "Estels de Les Corts",      cat: "Júnior Fem." },
  { team: "Balenes de la Barceloneta",cat: "Sub-23 Masc." },
  { team: "Pumes de la Sagrera",      cat: "Infantil Fem." },
  { team: "Falcons de Badalona",      cat: "Sènior Masc." },
  { team: "Tigres de l'Hospitalet",   cat: "Veterans Masc." },
  { team: "Condors de Horta",         cat: "Premini Masc." },
];

interface Toast {
  id: number;
  text: string;
}

interface Props {
  children: React.ReactNode;
}

export default function QueueGate({ children }: Props) {
  const [phase, setPhase]         = useState<"queue" | "done" | "form">("queue");
  const [progress, setProgress]   = useState(0);
  const [position, setPosition]   = useState<number | null>(null);
  const [connected, setConnected] = useState<number | null>(null);
  const [registered, setRegistered] = useState<number | null>(null);
  const [toasts, setToasts]       = useState<Toast[]>([]);

  const startRef    = useRef<number | null>(null);
  const rafRef      = useRef<number | null>(null);
  const posTimers   = useRef<ReturnType<typeof setTimeout>[]>([]);
  const toastTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef  = useRef(0);
  const usedTeams   = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (sessionStorage.getItem("queuePassed") === "1") {
      setPhase("form");
      return;
    }

    const initPos        = randomInt(4, 7);
    const initConnected  = randomInt(84, 143);
    const initRegistered = randomInt(24, 32);

    setPosition(initPos);
    setConnected(initConnected);
    setRegistered(initRegistered);

    // Decrementar posició de forma natural
    let pos = initPos;
    for (let step = 1; step < initPos; step++) {
      const delay = (TOTAL_WAIT_MS / initPos) * step - 300;
      const t = setTimeout(() => {
        pos -= 1;
        setPosition(pos);
        setConnected((c) => (c !== null ? c + randomInt(-4, 6) : c));
      }, delay);
      posTimers.current.push(t);
    }

    // Toasts encadenats de forma recursiva per variar intervals
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
        toastTimer.current = setTimeout(fireToast, randomInt(2_200, 3_800));
      }
    };

    // Primer toast als 1.8s
    toastTimer.current = setTimeout(fireToast, 1_800);

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
      if (rafRef.current)   cancelAnimationFrame(rafRef.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      posTimers.current.forEach(clearTimeout);
    };
  }, []);

  if (phase === "form") return <>{children}</>;

  const isDone = phase === "done";

  return (
    <div className="queue-overlay">

      {/* Toasts — inscripcions en temps real */}
      <div className="queue-toasts" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className="queue-toast">
            <span className="queue-toast-ball" aria-hidden="true">🏀</span>
            <span className="queue-toast-text">
              <strong>Nou equip inscrit!</strong>
              <br />{t.text}
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
          {isDone ? "✅" : "🏀"}
        </div>

        {/* Títol */}
        <h2 className="queue-title">
          {isDone ? "Plaça reservada!" : "Reservant el teu lloc…"}
        </h2>
        <p className="queue-sub">
          {isDone
            ? "Ja pots completar el formulari."
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
            {/* 3 stats */}
            <div className="queue-stats">
              <div className="queue-stat">
                <span className="queue-stat-value">#{position ?? "…"}</span>
                <span className="queue-stat-label">posició</span>
              </div>
              <div className="queue-stat-divider" />
              <div className="queue-stat">
                <span className="queue-stat-value">{connected ?? "…"}</span>
                <span className="queue-stat-label">connectats ara</span>
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
