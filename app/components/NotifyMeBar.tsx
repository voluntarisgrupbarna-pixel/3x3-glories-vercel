"use client";

import { useState } from "react";

export default function NotifyMeBar() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Avisa'm",   // placeholder — no demana nom per no friccionar
          email,
          phone: "",
          interest: "notifica-places",
          question: "avisar-places",
          origin: "notify-bar",
          consent: true,     // acceptació implícita al fer submit
        }),
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="notify-bar notify-bar--done" role="status" aria-live="polite">
        <span className="notify-bar-check">✅</span>
        <span>T'avisarem quan quedin poques places. Gràcies!</span>
      </div>
    );
  }

  return (
    <div className="notify-bar">
      <span className="notify-bar-bell" aria-hidden="true">🔔</span>
      <span className="notify-bar-label">
        No estàs llest/a per inscriure't?{" "}
        <strong>Avisa'm quan s'ompli</strong>
      </span>

      <form className="notify-bar-form" onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="el-teu@email.com"
          required
          aria-label="Email per a notificació de places"
          className="notify-bar-input"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className="notify-bar-btn"
          disabled={status === "loading"}
        >
          {status === "loading" ? "…" : "Avisa'm"}
        </button>
      </form>

      {status === "error" && (
        <span className="notify-bar-error">Error. Prova per WA.</span>
      )}
    </div>
  );
}
