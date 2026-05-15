"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_WAIT_MS = 9_000;   // 9 s reals — sembla prou
const DONE_HOLD_MS  = 1_400;   // 1.4 s mostrant "✅ Plaça reservada!"

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Props {
  children: React.ReactNode;
}

export default function QueueGate({ children }: Props) {
  const [phase, setPhase] = useState<"queue" | "done" | "form">("queue");
  const [progress, setProgress] = useState(0);
  const [position, setPosition] = useState<number | null>(null);
  const [connected, setConnected] = useState<number | null>(null);
  const startRef  = useRef<number | null>(null);
  const rafRef    = useRef<number | null>(null);
  const posTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Skip queue si ja s'ha fet en aquesta sessió
    if (sessionStorage.getItem("queuePassed") === "1") {
      setPhase("form");
      return;
    }

    const initPos       = randomInt(4, 7);
    const initConnected = randomInt(38, 71);
    setPosition(initPos);
    setConnected(initConnected);

    // Decrementar posició de forma natural
    let pos = initPos;
    for (let step = 1; step < initPos; step++) {
      const delay = (TOTAL_WAIT_MS / initPos) * step - 300;
      const t = setTimeout(() => {
        pos -= 1;
        setPosition(pos);
        // Fluctuació lleugera de "connectats"
        setConnected((c) => (c !== null ? c + randomInt(-3, 5) : c));
      }, delay);
      posTimers.current.push(t);
    }

    // Barra de progrés via rAF
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed  = now - (startRef.current ?? now);
      const pct      = Math.min(100, (elapsed / TOTAL_WAIT_MS) * 100);
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
      if (rafRef.current)    cancelAnimationFrame(rafRef.current);
      posTimers.current.forEach(clearTimeout);
    };
  }, []);

  if (phase === "form") return <>{children}</>;

  const isDone = phase === "done";

  return (
    <div className="queue-overlay">
      <div className="queue-card">

        {/* Icona central */}
        <div className={`queue-icon${isDone ? " queue-icon--done" : ""}`}>
          {isDone ? "✅" : "🏀"}
        </div>

        {/* Títol */}
        <h2 className="queue-title">
          {isDone ? "Plaça reservada!" : "Preparant la teva inscripció…"}
        </h2>
        <p className="queue-sub">
          {isDone
            ? "Ja pots completar el formulari."
            : "Moltes persones volen inscriure's al mateix temps. Estem reservant el teu lloc."}
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
            {/* Posició a la cua */}
            <div className="queue-stats">
              <div className="queue-stat">
                <span className="queue-stat-value">#{position ?? "…"}</span>
                <span className="queue-stat-label">posició a la cua</span>
              </div>
              <div className="queue-stat-divider" />
              <div className="queue-stat">
                <span className="queue-stat-value">{connected ?? "…"}</span>
                <span className="queue-stat-label">persones connectades ara</span>
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
