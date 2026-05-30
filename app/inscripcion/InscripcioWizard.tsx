"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  PACKAGES,
  CATEGORIES,
  SHIRT_SIZES,
  GENDERS,
  POSITIONS,
  LEVELS,
  IBAN_INFO,
  type Package,
  type PackageKey,
  type DiscountResult,
  isEarlyBirdActive,
  calcDiscount,
  EARLY_BIRD_DEADLINE,
  PROMO_2025_CODE,
  getCategoryBirthRange,
  getCategoryBirthHint,
  PACKAGE_ALLOWED_CATEGORIES,
} from "./wizardData";

// ── Types ──────────────────────────────────────────────────────────────────

type Player = {
  fullName: string;
  club: string;
  category: string;
  birthYear: string;
  gender: string;
  phone: string;
  shirtSize: string;
  email: string;
};

type Captain = {
  fullName: string;
  phone: string;
  email: string;
  shirtSize: string;
};

type Tutor = {
  fullName: string;
  phone: string;
  email: string;
};

type WizardState = {
  step: number;
  // Step 1 — descomptes (pre-form)
  socialShareDone: boolean;
  rivalCode: string;
  promoCode: string;            // codi de fidelitat 2025 (EQUIPS2025)
  earlyEmail: string;           // email opcional capturat a l'Step 1
  // Step 2 — equip + capità
  packageKey: PackageKey | null;
  teamName: string;
  category: string;
  captain: Captain;
  needsTutor: boolean;
  tutor: Tutor;
  // Step 2 — camps addicionals per inscripció individual
  indivBirthYear: string;
  indivGender: string;
  indivPosition: string;
  indivLevel: string;
  // Step 3 — pagament
  proofFileName: string;
  proofBase64: string;
  proofMime: string;
  // Step 4 — jugadors
  players: Player[];
  // Step 5 — confirmació
  rgpdConsent: boolean;
  imageRightsConsent: boolean;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

const FORMATIVE_CATS = ["Escoleta", "Premini", "Mini", "Preinfantil", "Infantil", "Cadet", "Júnior"];

function trackWizardEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, { event_category: "inscripcion_3x3", ...params });
  window.fbq?.("trackCustom", name, params);
}

function isFormative(cat: string): boolean {
  return FORMATIVE_CATS.some((f) => cat.startsWith(f));
}

function isRivalCodeValid(code: string): boolean {
  return /^RIVAL-[A-Z0-9]{3,}$/i.test(code.trim());
}

function isPromoCodeValid(code: string): boolean {
  return code.trim().toUpperCase() === PROMO_2025_CODE;
}

/** Validació bàsica de telèfon: mínim 9 dígits (ignorant espais, guions, parèntesis) */
function isValidPhone(phone: string): boolean {
  return phone.replace(/[\s\-().+]/g, "").replace(/\D/g, "").length >= 9;
}

/** Any de naixement vàlid: 4 dígits, rang [1950, any actual] */
function isValidBirthYear(year: string): boolean {
  const n = parseInt(year);
  return !isNaN(n) && n >= 1950 && n <= new Date().getFullYear();
}

function hasMinorCaptain(tutor: Tutor): boolean {
  return Boolean(tutor.fullName.trim() || tutor.phone.trim() || tutor.email.trim());
}

function isValidMinorCaptain(tutor: Tutor): boolean {
  if (!hasMinorCaptain(tutor)) return true;
  if (!tutor.fullName.trim() || !tutor.phone.trim() || !tutor.email.trim()) return false;
  if (!isValidPhone(tutor.phone)) return false;
  if (!tutor.email.includes("@") || !tutor.email.includes(".")) return false;
  return true;
}

/**
 * Per Inscripció Individual + Formativa: només cal el nom del menor.
 * Phone/email del menor són opcionals (el contacte vàlid és el del tutor adult al `captain`).
 */
function isValidMinorPlayerName(tutor: Tutor): boolean {
  if (!tutor.fullName.trim()) return false;
  // Si l'usuari ha posat phone/email opcionals, validem el format
  if (tutor.phone.trim() && !isValidPhone(tutor.phone)) return false;
  if (tutor.email.trim() && (!tutor.email.includes("@") || !tutor.email.includes("."))) return false;
  return true;
}

/** Retorna true si el gènere del jugador és compatible amb la categoria (soft check) */
function genderMatchesCategory(gender: string, cat: string): boolean {
  if (!gender || gender === "Altre") return true;
  if (cat.includes("Masculí") && gender === "Femení") return false;
  if (cat.includes("Femení") && gender === "Masculí") return false;
  return true;
}

function getCategoryYearRange(cat: string): [number, number] | null {
  const m = cat.match(/\((\d{4})[-–](\d{4})\)/);
  if (m) return [parseInt(m[1]), parseInt(m[2])];
  return null;
}

function emptyPlayer(defaultCategory = ""): Player {
  return { fullName: "", club: "", category: defaultCategory, birthYear: "", gender: "", phone: "", shirtSize: "", email: "" };
}

const STEPS = [
  { id: 1, label: "Descompte" },
  { id: 2, label: "Equip" },
  { id: 3, label: "Pagament" },
  { id: 4, label: "Jugadors" },
  { id: 5, label: "Confirma" },
];

// ── Copy button ────────────────────────────────────────────────────────────

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  function doCopy() {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button type="button" className="wizard-copy-btn" onClick={doCopy} title={`Copiar ${label}`}>
      {copied ? "✓ Copiat" : "Copiar"}
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

type Props = { initialRefCode?: string; waFlow?: boolean };

export default function InscripcioWizard({ initialRefCode = "", waFlow = false }: Props) {
  const [state, setState] = useState<WizardState>({
    step: 1,
    socialShareDone: false,
    rivalCode: initialRefCode,
    promoCode: "",
    earlyEmail: "",
    packageKey: null,
    teamName: "",
    category: "",
    captain: { fullName: "", phone: "", email: "", shirtSize: "" },
    needsTutor: false,
    tutor: { fullName: "", phone: "", email: "" },
    indivBirthYear: "",
    indivGender: "",
    indivPosition: "",
    indivLevel: "",
    proofFileName: "",
    proofBase64: "",
    proofMime: "",
    players: [emptyPlayer()],
    rgpdConsent: false,
    imageRightsConsent: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<null | { ok: boolean; teamId?: string; playerIds?: string[]; error?: string }>(null);

  // ── Stats: places en temps real ───────────────────────────────────────────
  const [stats, setStats] = useState<{ teamsCount: number; maxTeams: number; spotsLeft: number } | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) return;
        const data = await res.json() as { ok: boolean; teamsCount: number; maxTeams: number; spotsLeft: number };
        if (!cancelled && data.ok) setStats(data);
      } catch { /* silenci */ }
    }
    fetchStats();
    // Refresca cada 60s mentre el formulari és obert
    const interval = setInterval(fetchStats, 60_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const stateRef = useRef(state);
  const submitResultRef = useRef(submitResult);
  const abandonedEventsSent = useRef<Set<string>>(new Set());
  const earlyEmailSentRef = useRef(false);
  const emailDebounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneDebounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wizardRef = useRef<HTMLDivElement>(null);
  useEffect(() => { stateRef.current = state; });
  useEffect(() => { submitResultRef.current = submitResult; });
  // Marca el wizard com a hidritat — s'executa només client-side, un cop
  // tots els event handlers estan registrats. Útil per a tests E2E.
  useEffect(() => {
    wizardRef.current?.setAttribute("data-wizard-ready", "true");
  }, []);

  // ── Persistència localStorage — recupera esborrany en carregar ───────────
  const DRAFT_KEY = "insc3x3_draft_v1";
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as WizardState & { _ts?: number };
      // Restaurar només si l'esborrany és de les últimes 24h
      if (!parsed._ts || Date.now() - parsed._ts > 86_400_000) {
        localStorage.removeItem(DRAFT_KEY);
        return;
      }
      // No restaurar si ja s'ha enviat (pas 5 amb resultat OK)
      if (submitResultRef.current?.ok === true) return;
      // Restaurar l'estat (sense el camp binari proofBase64 per estalviar memòria)
      const { _ts: _ignored, proofBase64: _proof, rgpdConsent: _rgpd, imageRightsConsent: _img, ...rest } = parsed as WizardState & { _ts?: number };
      setState((prev) => ({
        ...prev,
        ...rest,
        proofBase64: "",       // no persistim el binari
        rgpdConsent: false,    // consents sempre explícits per llei
        imageRightsConsent: false,
        step: Math.min((rest.step ?? 1), 4), // cap al pas 4 com a màxim en restaurar
      }));
    } catch (_) {
      // Si localStorage no és accessible (mode privat, etc.) ignorem silenciosament
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Desa l'esborrany a localStorage en cada canvi d'estat (no desa el binari)
  useEffect(() => {
    if (submitResult?.ok === true) {
      // Formulari enviat — esborrar l'esborrany
      try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
      return;
    }
    if (state.step >= 5) return; // No persistir el pas de confirmació
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { proofBase64: _proof, ...stateToPersist } = state;
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...stateToPersist, _ts: Date.now() }));
    } catch (_) {}
  }, [state, submitResult]);

  useEffect(() => {
    trackWizardEvent("wizard_step_view", {
      step: state.step,
      package_key: state.packageKey || "none",
      category: state.category || "none",
    });
  }, [state.step, state.packageKey, state.category]);

  // ── Abandoned lead capture ─────────────────────────────────────────────
  // Captura per cada pas — deduplicat per reason (permet múltiples events per sessió)
  function sendAbandonedLead(reason: string) {
    if (submitResultRef.current?.ok === true) return;
    if (abandonedEventsSent.current.has(reason)) return;
    const s = stateRef.current;
    if (!s.captain.email && !s.captain.phone) return;
    abandonedEventsSent.current.add(reason);
    const currentPkg = PACKAGES.find((p) => p.key === s.packageKey) || null;
    const disc = currentPkg
      ? calcDiscount(currentPkg.price, {
          earlyBird: isEarlyBirdActive(),
          social: s.socialShareDone,
          rivalValid: /^RIVAL-[A-Z0-9]{3,}$/i.test(s.rivalCode.trim()),
          promoValid: isPromoCodeValid(s.promoCode),
        })
      : null;
    const body = JSON.stringify({
      action: "abandoned",
      abandonedAt: new Date().toISOString(),
      reason,
      step: s.step,
      packageKey: s.packageKey || "",
      packageTitle: currentPkg?.title || "",
      packagePrice: currentPkg?.price || 0,
      teamName: s.teamName,
      category: s.category,
      captainName: s.captain.fullName,
      captainPhone: s.captain.phone,
      captainEmail: s.captain.email,
      finalPrice: disc?.finalPrice ?? currentPkg?.price ?? 0,
      proofUploaded: s.proofBase64.length > 0,
      earlyBirdApplied: isEarlyBirdActive(),
      socialShareDone: s.socialShareDone,
    });
    if (reason === "beforeunload") {
      navigator.sendBeacon("/api/abandoned", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/abandoned", { method: "POST", headers: { "Content-Type": "application/json" }, body }).catch(() => {});
    }
    trackWizardEvent("wizard_abandoned", {
      reason,
      step: s.step,
      package_key: s.packageKey || "none",
      has_contact: Boolean(s.captain.email || s.captain.phone),
    });
  }

  // Captura email opcional a l'Step 1 — s'envia una sola vegada
  function sendEarlyEmailLead(email: string) {
    if (!email.includes("@") || !email.includes(".")) return;
    if (earlyEmailSentRef.current) return;
    if (submitResultRef.current?.ok === true) return;
    earlyEmailSentRef.current = true;
    const s = stateRef.current;
    fetch("/api/abandoned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "abandoned",
        abandonedAt: new Date().toISOString(),
        reason: "step1_email",
        step: 1,
        stepLabel: "Descompte",
        packageKey: s.packageKey || "",
        packageTitle: "",
        packagePrice: 0,
        teamName: "",
        category: "",
        captainName: "",
        captainPhone: "",
        captainEmail: email,
        finalPrice: 0,
        proofUploaded: false,
        earlyBirdApplied: isEarlyBirdActive(),
        socialShareDone: s.socialShareDone,
      }),
    }).catch(() => {});
  }

  useEffect(() => {
    const onUnload = () => sendAbandonedLead("beforeunload");
    const onVisibility = () => {
      if (document.visibilityState === "hidden") sendAbandonedLead("hidden");
    };
    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Captura en temps real quan el capità omple l'email a l'Step 2 (debounce 2s)
  useEffect(() => {
    const email = state.captain.email;
    if (!email.includes("@") || !email.includes(".")) return;
    if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);
    emailDebounceRef.current = setTimeout(() => {
      sendAbandonedLead("email_entered");
    }, 2_000);
    return () => {
      if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);
    };
  }, [state.captain.email]); // eslint-disable-line react-hooks/exhaustive-deps

  // Captura en temps real quan el capità omple el telèfon a l'Step 2 (debounce 3s)
  // Permet saber qui ha abandonat fins i tot sense email, per a seguiment per WhatsApp.
  useEffect(() => {
    const phone = state.captain.phone;
    const name  = state.captain.fullName;
    if (!phone || phone.replace(/[\s\-().+]/g, "").length < 9) return; // mínim 9 dígits
    if (!name.trim()) return; // necessitem almenys el nom per identificar el lead
    if (phoneDebounceRef.current) clearTimeout(phoneDebounceRef.current);
    phoneDebounceRef.current = setTimeout(() => {
      sendAbandonedLead("phone_entered");
    }, 3_000);
    return () => {
      if (phoneDebounceRef.current) clearTimeout(phoneDebounceRef.current);
    };
  }, [state.captain.phone, state.captain.fullName]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived ────────────────────────────────────────────────────────────
  const pkg: Package | null = useMemo(
    () => PACKAGES.find((p) => p.key === state.packageKey) || null,
    [state.packageKey],
  );

  const disc: DiscountResult = useMemo(() => {
    if (!pkg) return { earlyBirdAmt: 0, socialAmt: 0, rivalAmt: 0, promoAmt: 0, totalDiscount: 0, finalPrice: 0 };
    return calcDiscount(pkg.price, {
      earlyBird: isEarlyBirdActive(),
      social: state.socialShareDone,
      rivalValid: isRivalCodeValid(state.rivalCode),
      promoValid: isPromoCodeValid(state.promoCode),
    });
  }, [pkg, state.socialShareDone, state.rivalCode, state.promoCode]);

  // ── State helpers ──────────────────────────────────────────────────────
  function update<K extends keyof WizardState>(k: K, v: WizardState[K]) {
    setState((prev) => ({ ...prev, [k]: v }));
  }

  function updateCaptain<K extends keyof Captain>(k: K, v: Captain[K]) {
    setState((prev) => ({ ...prev, captain: { ...prev.captain, [k]: v } }));
  }

  function updateTutor<K extends keyof Tutor>(k: K, v: Tutor[K]) {
    setState((prev) => ({ ...prev, tutor: { ...prev.tutor, [k]: v } }));
  }

  function updatePlayer(idx: number, patch: Partial<Player>) {
    setState((prev) => {
      const players = [...prev.players];
      players[idx] = { ...players[idx], ...patch };
      return { ...prev, players };
    });
  }

  function addPlayer() {
    setState((prev) => {
      if (!pkg || prev.players.length >= pkg.maxPlayers) return prev;
      return { ...prev, players: [...prev.players, emptyPlayer(prev.category)] };
    });
  }

  function removePlayer(idx: number) {
    setState((prev) => {
      if (prev.players.length <= (pkg?.minPlayers ?? 1)) return prev;
      return { ...prev, players: prev.players.filter((_, i) => i !== idx) };
    });
  }

  function selectPackage(key: PackageKey) {
    const p = PACKAGES.find((x) => x.key === key);
    if (!p) return;
    setState((prev) => {
      let players = prev.players;
      if (players.length < p.minPlayers) {
        players = [...players, ...Array.from({ length: p.minPlayers - players.length }, () => emptyPlayer(prev.category))];
      } else if (players.length > p.maxPlayers) {
        players = players.slice(0, p.maxPlayers);
      }
      // Reset category si no és compatible amb el nou paquet
      const allowed = PACKAGE_ALLOWED_CATEGORIES[key];
      const category = allowed.includes(prev.category) ? prev.category : "";
      return { ...prev, packageKey: key, players, category };
    });
  }

  function handleCategoryChange(cat: string) {
    setState((prev) => ({
      ...prev,
      category: cat,
      needsTutor: isFormative(cat),
      players: prev.players.map((p) => ({ ...p, category: cat })),
    }));
  }

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) {
      setState((prev) => ({ ...prev, proofFileName: "", proofBase64: "", proofMime: "" }));
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("El fitxer és massa gran (màxim 4 MB). Comprimeix la imatge i torna-la a adjuntar.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setState((prev) => ({
        ...prev,
        proofFileName: file.name,
        proofBase64: result.split(",")[1] || "",
        proofMime: file.type,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────────
  function scrollToWizard() {
    // Scroll al wizard (respectant scroll-margin-top: 64px per SiteNav)
    // en comptes de scrollTo(0) que deixaria el wizard fora de vista sota el hero
    wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    const s = stateRef.current;
    trackWizardEvent("wizard_step_complete", {
      step: s.step,
      package_key: s.packageKey || "none",
      category: s.category || "none",
    });
    setState((prev) => {
      let nextStep = prev.step + 1;
      if (waFlow && nextStep === 3) nextStep = 4;
      if (prev.packageKey === "individual" && nextStep === 4) nextStep = 5;
      return { ...prev, step: Math.min(nextStep, 5) };
    });
    scrollToWizard();
  }

  function prev() {
    setState((prev) => {
      let prevStep = prev.step - 1;
      if (prev.packageKey === "individual" && prevStep === 4) prevStep = 3;
      if (waFlow && prevStep === 3) prevStep = 2;
      return { ...prev, step: Math.max(prevStep, 1) };
    });
    scrollToWizard();
  }

  // ── Validation ─────────────────────────────────────────────────────────
  // Step 1: social + rival → always optional, always can advance
  const canAdvanceStep1 = true;

  const canAdvanceStep2 = useMemo(() => {
    if (!state.packageKey || !state.category) return false;
    if (!pkg) return false;
    if (pkg.isTeam && !state.teamName.trim()) return false;
    const c = state.captain;
    if (!c.fullName.trim() || !c.phone.trim() || !c.email.trim()) return false;
    if (!isValidPhone(c.phone)) return false;
    if (!c.email.includes("@") || !c.email.includes(".")) return false;
    // Inscripció Individual + Formativa: cal el nom del menor (jugador real)
    if (state.packageKey === "individual" && state.needsTutor) {
      if (!isValidMinorPlayerName(state.tutor)) return false;
    } else if (state.needsTutor && !isValidMinorCaptain(state.tutor)) {
      return false;
    }
    // Camps addicionals obligatoris per inscripció individual
    if (state.packageKey === "individual") {
      if (!state.indivBirthYear || !isValidBirthYear(state.indivBirthYear)) return false;
      if (!state.indivGender) return false;
    }
    return true;
  }, [pkg, state.packageKey, state.category, state.teamName, state.captain, state.tutor, state.needsTutor, state.indivBirthYear, state.indivGender]);

  // El justificant és recomanat però no bloqueja (vegeu text d'introducció de la pàgina)
  const canAdvanceStep3 = true;

  const canAdvanceStep4 = useMemo(() => {
    if (!state.players.length) return false;
    return state.players.every((p) => {
      if (!p.fullName.trim() || !p.category || !p.birthYear.trim() || !p.gender) return false;
      if (!isValidBirthYear(p.birthYear)) return false;
      // Hard block si l'any és clarament fora del rang de la categoria (>5 anys de diferència)
      const range = getCategoryBirthRange(p.category);
      if (range) {
        const y = parseInt(p.birthYear);
        if (y < range[0] - 1 || y > range[1] + 1) return false;
      }
      return true;
    });
  }, [state.players]);

  const canSubmit = state.rgpdConsent && state.imageRightsConsent;

  // ── Missing field hints ────────────────────────────────────────────────
  const missingStep2 = useMemo((): string[] => {
    if (canAdvanceStep2) return [];
    const m: string[] = [];
    if (!state.packageKey) m.push("modalitat");
    if (!state.category) m.push("categoria");
    if (pkg?.isTeam && !state.teamName.trim()) m.push("nom de l'equip");
    const c = state.captain;
    if (!c.fullName.trim()) m.push("nom del capità/a");
    if (!c.phone.trim()) m.push("telèfon del capità/a");
    else if (!isValidPhone(c.phone)) m.push("telèfon invàlid (mínim 9 dígits)");
    if (!c.email.trim()) m.push("email del capità/a");
    else if (!c.email.includes("@") || !c.email.includes(".")) m.push("format d'email invàlid");

    // Inscripció Individual + Formativa: el menor és el jugador inscrit → cal el nom
    if (state.packageKey === "individual" && state.needsTutor) {
      const t = state.tutor;
      if (!t.fullName.trim()) m.push("nom del jugador/a menor inscrit/a");
      if (t.phone.trim() && !isValidPhone(t.phone)) m.push("telèfon del menor invàlid");
      if (t.email.trim() && (!t.email.includes("@") || !t.email.includes("."))) m.push("format d'email del menor invàlid");
    } else if (state.needsTutor && hasMinorCaptain(state.tutor)) {
      const t = state.tutor;
      if (!t.fullName.trim()) m.push("nom del capità/a menor");
      if (!t.phone.trim()) m.push("telèfon del capità/a menor");
      else if (!isValidPhone(t.phone)) m.push("telèfon del capità/a menor invàlid");
      if (!t.email.trim()) m.push("email del capità/a menor");
      else if (!t.email.includes("@") || !t.email.includes(".")) m.push("format d'email del capità/a menor invàlid");
    }
    if (state.packageKey === "individual") {
      if (!state.indivBirthYear) m.push("any de naixement");
      else if (!isValidBirthYear(state.indivBirthYear)) m.push("any de naixement invàlid");
      if (!state.indivGender) m.push("gènere");
    }
    return m;
  }, [canAdvanceStep2, pkg, state.packageKey, state.category, state.teamName, state.captain, state.tutor, state.needsTutor, state.indivBirthYear, state.indivGender]);

  const missingStep4 = useMemo((): string[] => {
    if (canAdvanceStep4) return [];
    const m: string[] = [];
    state.players.forEach((p, i) => {
      const n = i + 1;
      const f: string[] = [];
      if (!p.fullName.trim()) f.push("nom");
      if (!p.category) f.push("categoria");
      if (!p.birthYear.trim()) f.push("any naix.");
      else if (!isValidBirthYear(p.birthYear)) f.push("any naix. invàlid");
      else {
        const range = getCategoryBirthRange(p.category);
        if (range) {
          const y = parseInt(p.birthYear);
          if (y < range[0] - 1 || y > range[1] + 1) {
            f.push(`any naix. fora de rang (${getCategoryBirthHint(p.category)})`);
          }
        }
      }
      if (!p.gender) f.push("gènere");
      // club i talla: recomanats però NO bloquegen (s'indiquen al check-in)
      if (!p.shirtSize) f.push("talla (opcional al check-in)");
      if (f.length) m.push(`Jugador/a ${n}: ${f.join(", ")}`);
    });
    return m;
  }, [canAdvanceStep4, state.players]);

  // ── Submit ─────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (submitting || !canSubmit || !pkg) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      // BUG FIX (2026-05-28): per Inscripció Individual + Formativa el JUGADOR
      // és el menor (state.tutor.fullName), no el tutor adult (state.captain).
      // Cas Bruno Cuevas: l'inscripció es registrava amb el nom del pare (Franklin)
      // en lloc del nen (Bruno). Vegeu /Abandonaments + /Inscripcions sheet.
      const isIndividualMinor =
        !pkg.isTeam && state.needsTutor && Boolean(state.tutor.fullName.trim());
      const playerName = isIndividualMinor ? state.tutor.fullName : state.captain.fullName;
      const playerPhone = isIndividualMinor && state.tutor.phone.trim() ? state.tutor.phone : state.captain.phone;
      const playerEmail = isIndividualMinor && state.tutor.email.trim() ? state.tutor.email : state.captain.email;
      const players =
        pkg.isTeam
          ? state.players
          : [{ fullName: playerName, club: "Individual", category: state.category, birthYear: state.indivBirthYear, gender: state.indivGender, phone: playerPhone, shirtSize: state.captain.shirtSize, email: playerEmail }];

      const payload = {
        packageKey: state.packageKey,
        packageTitle: pkg.title,
        packagePrice: pkg.price,
        teamName: state.teamName || state.captain.fullName,
        category: state.category,
        captain: { fullName: state.captain.fullName, phone: state.captain.phone, email: state.captain.email, shirtSize: state.captain.shirtSize },
        tutor: state.needsTutor && hasMinorCaptain(state.tutor)
          ? { fullName: state.tutor.fullName, phone: state.tutor.phone, email: state.tutor.email, shirtSize: "" }
          : null,
        players: players.map((p) => ({
          fullName: p.fullName,
          club: p.club,
          category: p.category,
          birthYear: p.birthYear,
          gender: p.gender,
          phone: p.phone,
          shirtSize: p.shirtSize,
          email: p.email,
          birthDate: p.birthYear ? `${p.birthYear}-01-01` : "",
          imageRights: true,
        })),
        proof: { fileName: state.proofFileName, mime: state.proofMime, base64: state.proofBase64 },
        rgpdConsent: state.rgpdConsent,
        imageRightsConsent: state.imageRightsConsent,
        refCode: isRivalCodeValid(state.rivalCode) ? state.rivalCode : null,
        indivPosition: state.packageKey === "individual" ? state.indivPosition : null,
        indivLevel: state.packageKey === "individual" ? state.indivLevel : null,
        submittedAt: new Date().toISOString(),
        discountType: [disc.earlyBirdAmt > 0 && "earlybird", disc.promoAmt > 0 && "promo", disc.socialAmt > 0 && "social", disc.rivalAmt > 0 && "rival"].filter(Boolean).join("+") || null,
        discountAmount: disc.totalDiscount,
        finalPrice: disc.finalPrice > 0 ? disc.finalPrice : pkg.price,
        earlyBirdApplied: isEarlyBirdActive(),
        socialShareDone: state.socialShareDone,
      };

      const res = await fetch("/api/inscripcio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      trackWizardEvent("signup_success", {
        package_key: state.packageKey || "none",
        category: state.category || "none",
        final_price: payload.finalPrice,
        proof_uploaded: Boolean(state.proofBase64),
      });
      setSubmitResult({ ok: true, teamId: data.teamId, playerIds: data.playerIds });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconegut";
      trackWizardEvent("signup_error", {
        package_key: state.packageKey || "none",
        step: state.step,
      });
      setSubmitResult({ ok: false, error: msg });
      setSubmitting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  if (submitResult?.ok) {
    return (
      <SuccessPanel
        teamId={submitResult.teamId!}
        playerIds={submitResult.playerIds || []}
        disc={disc}
        pkg={pkg!}
        teamName={state.teamName}
        waFlow={waFlow}
        category={state.category}
        captainName={state.captain.fullName}
        captainEmail={state.captain.email}
        proofUploaded={Boolean(state.proofBase64)}
      />
    );
  }

  return (
    <div className="wizard" ref={wizardRef}>
      {/* Banner de places — visible quan hi ha dades i queden ≤16 places */}
      {stats && stats.spotsLeft <= 16 && (
        <div className="wizard-spots-banner">
          <span className="wizard-spots-count">{stats.teamsCount}</span> equips inscrits
          {stats.spotsLeft > 0
            ? <> · <strong>{stats.spotsLeft} places restants</strong> 🔥</>
            : <> · <strong>Places esgotades</strong> — llista d&apos;espera</>
          }
        </div>
      )}
      {/* Banner neutre quan hi ha marge */}
      {stats && stats.spotsLeft > 16 && (
        <div className="wizard-spots-banner wizard-spots-banner--neutral">
          🏀 {stats.teamsCount} equips ja inscrits
        </div>
      )}

      {/* Avís de deadline (29/05/2026) */}
      <div style={{
        background: "linear-gradient(135deg, #fef3c7, #fde68a)",
        border: "2px solid #f59e0b",
        borderRadius: 12,
        padding: "12px 16px",
        margin: "8px 0 12px",
        textAlign: "center",
        fontSize: 14,
        color: "#78350f",
        fontWeight: 600,
        lineHeight: 1.5,
      }}>
        ⏰ <strong>Tanquem inscripcions dimecres 4 de juny a les 23:59 h.</strong>
        <br />
        <span style={{ fontWeight: 500, fontSize: 13 }}>
          Després, no entra ningú més. Queden 8 dies pel torneig (6-7 juny).
        </span>
      </div>

      {/* Status places per categoria (29/05/2026) */}
      <CategoryStatusGrid />

      <Stepper currentStep={state.step} isIndividual={state.packageKey === "individual"} waFlow={waFlow} />

      {state.step === 1 && (
        <Step1Discounts
          socialShareDone={state.socialShareDone}
          rivalCode={state.rivalCode}
          promoCode={state.promoCode}
          earlyEmail={state.earlyEmail}
          onSocialDone={(v) => update("socialShareDone", v)}
          onRivalCode={(v) => update("rivalCode", v.toUpperCase())}
          onPromoCode={(v) => update("promoCode", v.toUpperCase())}
          onEarlyEmail={(v) => { update("earlyEmail", v); sendEarlyEmailLead(v); }}
          onNext={next}
        />
      )}

      {state.step === 2 && (
        <Step2Team
          state={state}
          pkg={pkg}
          disc={disc}
          selectPackage={selectPackage}
          updateCaptain={updateCaptain}
          updateTutor={updateTutor}
          setTeamName={(v) => update("teamName", v)}
          setCategory={handleCategoryChange}
          setIndivField={(field, value) => setState((prev) => ({ ...prev, [field]: value }))}
          onPrev={prev}
          onNext={() => { sendAbandonedLead("step2_done"); next(); }}
          canAdvance={canAdvanceStep2}
          missing={missingStep2}
        />
      )}

      {state.step === 3 && pkg && (
        <Step3Payment
          pkg={pkg}
          disc={disc}
          teamName={state.teamName}
          proofFileName={state.proofFileName}
          onFile={handleFileChange}
          onPrev={prev}
          onNext={() => { sendAbandonedLead("step3_done"); next(); }}
          canAdvance={canAdvanceStep3}
          missing={[]}
        />
      )}

      {state.step === 4 && pkg && pkg.isTeam && (
        <Step4Players
          pkg={pkg}
          players={state.players}
          teamCategory={state.category}
          updatePlayer={updatePlayer}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
          onPrev={prev}
          onNext={() => { sendAbandonedLead("step4_done"); next(); }}
          canAdvance={canAdvanceStep4}
          missing={missingStep4}
        />
      )}

      {state.step === 5 && pkg && (
        <Step5Confirm
          pkg={pkg}
          state={state}
          disc={disc}
          setRgpd={(v) => update("rgpdConsent", v)}
          setImageRights={(v) => update("imageRightsConsent", v)}
          onPrev={prev}
          onSubmit={handleSubmit}
          canSubmit={canSubmit}
          submitting={submitting}
          error={submitResult && !submitResult.ok ? submitResult.error ?? null : null}
        />
      )}
    </div>
  );
}

// ── Stepper ────────────────────────────────────────────────────────────────

function Stepper({ currentStep, isIndividual, waFlow = false }: { currentStep: number; isIndividual: boolean; waFlow?: boolean }) {
  const steps = (() => {
    if (waFlow && isIndividual) return [
      { id: 1, label: "Descompte" }, { id: 2, label: "Equip" }, { id: 5, label: "Confirma" },
    ];
    if (waFlow) return [
      { id: 1, label: "Descompte" }, { id: 2, label: "Equip" }, { id: 4, label: "Jugadors" }, { id: 5, label: "Confirma" },
    ];
    if (isIndividual) return [
      { id: 1, label: "Descompte" }, { id: 2, label: "Equip" }, { id: 3, label: "Pagament" }, { id: 5, label: "Confirma" },
    ];
    return STEPS;
  })();

  // Visual position = how many steps have id ≤ currentStep
  const visualStep = steps.filter((s) => s.id <= currentStep).length;

  return (
    <ol className="wizard-stepper">
      {steps.map((s, idx) => {
        const pos = idx + 1;
        const status = pos < visualStep ? "done" : pos === visualStep ? "active" : "pending";
        return (
          <li key={s.id} className={`wizard-stepper-item wizard-stepper-item--${status}`}>
            <span className="wizard-stepper-dot">{status === "done" ? "✓" : pos}</span>
            <span className="wizard-stepper-label">{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

// ── Social Discount Block ──────────────────────────────────────────────────
// Flux:
//  1. Usuari clica "Compartir per WhatsApp" → s'obre WA, tria 5 contactes de cop
//  2. Torna a la pàgina i confirma "He compartit amb 5 amics" (checkbox)
//  3. Clica "Segueix @cbgrupbarna" a Instagram
//  Quan les dues condicions es compleixen → descompte -5% activat.

const WA_SHARE_URL = `https://wa.me/?text=${encodeURIComponent(
  "Vine al 3×3 Westfield Glòries 2026! Torneig FIBA a Barcelona el 6-7 juny. 2.000€ premi en metàl·lic. Inscriu-te: https://www.cbgrupbarna-3x3timechamber.com/inscripcion 🏀"
)}`;

function SocialDiscountBlock({
  socialShareDone,
  onSocialDone,
}: {
  socialShareDone: boolean;
  onSocialDone: (v: boolean) => void;
}) {
  const [waOpened, setWaOpened] = useState(false);
  const [waConfirmed, setWaConfirmed] = useState(false);
  const [igClicked, setIgClicked] = useState(false);

  function handleWaOpen() {
    setWaOpened(true);
  }

  function handleWaConfirm(checked: boolean) {
    setWaConfirmed(checked);
    if (checked && igClicked) onSocialDone(true);
    if (!checked) onSocialDone(false);
  }

  function handleIg() {
    setIgClicked(true);
    if (waConfirmed) onSocialDone(true);
  }

  return (
    <div className={`wizard-discount-block${socialShareDone ? " wizard-discount-block--active" : ""}`}>
      <div className="wizard-discount-head">
        <span className="wizard-discount-pct wizard-discount-pct--blue">📲 −5 %</span>
        <div>
          <strong>Descompte social</strong>
          {socialShareDone && <span className="wizard-discount-status wizard-discount-status--on">Activat ✓</span>}
        </div>
      </div>
      <p className="wizard-discount-desc">
        Comparteix el torneig amb <strong>5 amics</strong> per WhatsApp i segueix{" "}
        <strong>@cbgrupbarna</strong> a Instagram. El descompte s&apos;activa quan hagis fet les dues coses.
      </p>

      <div className="wizard-social-actions">
        {/* Botó WA únic — obre WhatsApp on es poden triar múltiples contactes */}
        <a
          href={WA_SHARE_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-wa-share
          className={`wizard-social-btn wizard-social-btn--wa${waOpened ? " wizard-social-btn--opened" : ""}`}
          onClick={handleWaOpen}
        >
          {waOpened ? "📲 WhatsApp obert — tria 5 contactes!" : "📲 Comparteix per WhatsApp"}
        </a>

        {/* Confirmació manual — apareix després de clicar WA */}
        {waOpened && (
          <label className="wizard-social-confirm" data-wa-confirm>
            <input
              type="checkbox"
              checked={waConfirmed}
              onChange={(e) => handleWaConfirm(e.target.checked)}
            />
            <span>He compartit el torneig amb <strong>5 amics</strong> ✓</span>
          </label>
        )}

        {/* Botó Instagram */}
        <a
          href="https://www.instagram.com/cbgrupbarna/"
          target="_blank"
          rel="noopener noreferrer"
          className={`wizard-social-btn wizard-social-btn--ig${igClicked ? " wizard-social-btn--done" : ""}`}
          onClick={handleIg}
        >
          {igClicked ? "📸 Instagram obert" : "📸 Segueix @cbgrupbarna a Instagram"}
        </a>
      </div>

      {socialShareDone && <p className="wizard-social-ok">✅ Descompte social del 5 % activat!</p>}
    </div>
  );
}

// ── Step 1 — Descomptes (pre-form) ────────────────────────────────────────

function Step1Discounts({
  socialShareDone,
  rivalCode,
  promoCode,
  earlyEmail,
  onSocialDone,
  onRivalCode,
  onPromoCode,
  onEarlyEmail,
  onNext,
}: {
  socialShareDone: boolean;
  rivalCode: string;
  promoCode: string;
  earlyEmail: string;
  onSocialDone: (v: boolean) => void;
  onRivalCode: (v: string) => void;
  onPromoCode: (v: string) => void;
  onEarlyEmail: (v: string) => void;
  onNext: () => void;
}) {
  const earlyBirdActive = isEarlyBirdActive();
  const daysLeft = Math.max(0, Math.ceil((EARLY_BIRD_DEADLINE.getTime() - Date.now()) / 86_400_000));
  const rivalValid = isRivalCodeValid(rivalCode);
  const promoValid = isPromoCodeValid(promoCode);
  // Pre-obrir si hi ha codi des de la URL (?ref=...)
  const [rivalOpen, setRivalOpen] = useState(rivalCode.length > 0);
  const [promoOpen, setPromoOpen] = useState(promoCode.length > 0);

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Descomptes disponibles</h2>
      <p className="wizard-step-desc">
        Pots combinar fins a 3 descomptes. S&apos;apliquen automàticament al preu final.
      </p>

      {/* Early Bird — només mostrar si actiu */}
      {earlyBirdActive && (
        <div className="wizard-discount-block wizard-discount-block--active">
          <div className="wizard-discount-head">
            <span className="wizard-discount-pct wizard-discount-pct--fire">🔥 −10 %</span>
            <div>
              <strong>Early Bird</strong>
              <span className="wizard-discount-status wizard-discount-status--on">Actiu · {daysLeft} {daysLeft === 1 ? "dia" : "dies"} restants</span>
            </div>
          </div>
          <p className="wizard-discount-desc">S&apos;aplica automàticament a tots els paquets. No cal fer res.</p>
        </div>
      )}

      {/* Social share */}
      <SocialDiscountBlock socialShareDone={socialShareDone} onSocialDone={onSocialDone} />

      {/* Pack Rival — plegat per defecte, s'obre amb codi de la URL o manualment */}
      {!rivalOpen ? (
        <button
          type="button"
          className="wizard-rival-toggle"
          onClick={() => setRivalOpen(true)}
        >
          🏀 Tens un codi d&apos;equip rival? (−5 €)
        </button>
      ) : (
        <div className={`wizard-discount-block${rivalValid ? " wizard-discount-block--active" : ""}`}>
          <div className="wizard-discount-head">
            <span className="wizard-discount-pct" style={{ background: "rgba(255,122,0,.18)", color: "#ff9c3c" }}>🏀 −5 €</span>
            <div>
              <strong>Pack Rival</strong>
              {rivalValid
                ? <span className="wizard-discount-status wizard-discount-status--on">Activat ✓</span>
                : <span className="wizard-discount-status wizard-discount-status--off">Introdueix el codi</span>
              }
            </div>
          </div>
          <p className="wizard-discount-desc">
            Un equip rival t&apos;ha convidat? Introdueix el seu codi i us feu −5 € cadascun.
          </p>
          <input
            type="text"
            className="wizard-rival-input"
            placeholder="RIVAL-XXXXXX"
            value={rivalCode}
            onChange={(e) => onRivalCode(e.target.value)}
            maxLength={40}
            autoCapitalize="characters"
            style={{ marginTop: 8, width: "100%", padding: "0.55rem 0.8rem", borderRadius: 8, border: rivalValid ? "1.5px solid #ff9c3c" : "1.5px solid rgba(255,247,239,.15)", background: "rgba(255,247,239,.06)", color: "#fff7ef", fontSize: "0.95rem", letterSpacing: "0.04em" }}
          />
        </div>
      )}

      {/* EQUIPS2025 — fidelitat 2025 */}
      {!promoOpen ? (
        <button
          type="button"
          className="wizard-rival-toggle"
          onClick={() => setPromoOpen(true)}
        >
          🏆 Vas participar al 3×3 el 2025? (−10 %)
        </button>
      ) : (
        <div className={`wizard-discount-block${promoValid ? " wizard-discount-block--active" : ""}`}>
          <div className="wizard-discount-head">
            <span className="wizard-discount-pct" style={{ background: "rgba(250,204,21,.18)", color: "#facc15" }}>🏆 −10 %</span>
            <div>
              <strong>Fidelitat 2025</strong>
              {promoValid
                ? <span className="wizard-discount-status wizard-discount-status--on">Activat ✓</span>
                : <span className="wizard-discount-status wizard-discount-status--off">Introdueix el codi</span>
              }
            </div>
          </div>
          <p className="wizard-discount-desc">
            Per a equips que van participar al 3×3 Westfield Glòries 2025. No acumulable amb Early Bird (s&apos;aplica el més gran dels dos).
          </p>
          <input
            type="text"
            className="wizard-rival-input"
            placeholder="EQUIPS2025"
            value={promoCode}
            onChange={(e) => onPromoCode(e.target.value)}
            maxLength={20}
            autoCapitalize="characters"
            style={{ marginTop: 8, width: "100%", padding: "0.55rem 0.8rem", borderRadius: 8, border: promoValid ? "1.5px solid #facc15" : "1.5px solid rgba(255,247,239,.15)", background: "rgba(255,247,239,.06)", color: "#fff7ef", fontSize: "0.95rem", letterSpacing: "0.04em" }}
          />
        </div>
      )}

      {/* Email opcional per capturar leads de Step 1 */}
      <div className="wizard-early-email-block">
        <label htmlFor="wizard-early-email" className="wizard-early-email-label">
          📬 Rep recordatoris i novetats del torneig <span className="wizard-early-email-optional">(opcional)</span>
        </label>
        <input
          id="wizard-early-email"
          type="email"
          className="wizard-early-email-input"
          placeholder="el-teu@email.com"
          value={earlyEmail}
          onChange={(e) => onEarlyEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
        />
        {earlyEmail.includes("@") && earlyEmail.includes(".") && (
          <p className="wizard-early-email-ok">✅ T&apos;avisarem de qualsevol novetat!</p>
        )}
      </div>

      {/* Preview de preus — sempre visible al pas 1 per eliminar sorpreses */}
      <div className="wizard-price-preview">
        <p className="wizard-price-preview-title">Preus{(rivalValid || promoValid || socialShareDone) ? " amb descomptes aplicats" : ""}:</p>
        <div className="wizard-price-preview-grid">
          {PACKAGES.map((p) => {
            const d = calcDiscount(p.price, { earlyBird: earlyBirdActive, social: socialShareDone, rivalValid, promoValid });
            const discounted = d.totalDiscount > 0;
            return (
              <div key={p.key} className="wizard-price-preview-item">
                <span className="wizard-price-preview-name">{p.emoji} {p.title}</span>
                <span className="wizard-price-preview-price">
                  {discounted && <s style={{ color: "#999", marginRight: 4, fontSize: 12 }}>{p.price} €</s>}
                  <strong style={{ color: discounted ? "#2a9d2a" : "inherit" }}>
                    {d.finalPrice.toFixed(2).replace(".00", "")} €
                  </strong>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="wizard-nav" style={{ marginTop: 28 }}>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext}>
          Continuar al formulari →
        </button>
      </div>
    </div>
  );
}

// ── Step 2 — Equip + Capità ────────────────────────────────────────────────

function Step2Team({
  state,
  pkg,
  disc,
  selectPackage,
  updateCaptain,
  updateTutor,
  setTeamName,
  setCategory,
  setIndivField,
  missing,
  onPrev,
  onNext,
  canAdvance,
}: {
  state: WizardState;
  pkg: Package | null;
  disc: DiscountResult;
  selectPackage: (k: PackageKey) => void;
  updateCaptain: <K extends keyof Captain>(k: K, v: Captain[K]) => void;
  updateTutor: <K extends keyof Tutor>(k: K, v: Tutor[K]) => void;
  setTeamName: (v: string) => void;
  setCategory: (v: string) => void;
  setIndivField: (field: "indivBirthYear" | "indivGender" | "indivPosition" | "indivLevel", value: string) => void;
  onPrev: () => void;
  onNext: () => void;
  canAdvance: boolean;
  missing: string[];
}) {
  const earlyBirdActive = isEarlyBirdActive();
  // Categories filtrades per paquet seleccionat
  const availableCategories = state.packageKey ? PACKAGE_ALLOWED_CATEGORIES[state.packageKey] : CATEGORIES;
  // Hint d’anys de naixement per categoria individual
  const indivBirthHint = state.category ? getCategoryBirthHint(state.category) : "";

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">{state.packageKey === "individual" ? "Les teves dades" : "Dades de l’equip"}</h2>

      {/* Active discounts badge */}
      {(disc.totalDiscount > 0) && (
        <div className="wizard-active-discounts">
          {disc.earlyBirdAmt > 0 && <span className="wizard-active-badge wizard-active-badge--eb">🔥 Early Bird −10 %</span>}
          {disc.promoAmt > 0 && <span className="wizard-active-badge wizard-active-badge--promo">🏆 Fidelitat 2025 −10 %</span>}
          {disc.socialAmt > 0 && <span className="wizard-active-badge wizard-active-badge--social">📲 Social −5 %</span>}
          {disc.rivalAmt > 0 && <span className="wizard-active-badge wizard-active-badge--rival">🏀 Rival −5 €</span>}
          <span className="wizard-active-badge-note">ja aplicat als preus</span>
        </div>
      )}

      {/* Paquet */}
      <h3 className="wizard-section-title">Modalitat *</h3>
      <div className="wizard-pkg-grid">
        {PACKAGES.map((p) => {
          const isSelected = state.packageKey === p.key;
          const preview = calcDiscount(p.price, { earlyBird: earlyBirdActive, social: state.socialShareDone, rivalValid: isRivalCodeValid(state.rivalCode), promoValid: isPromoCodeValid(state.promoCode) });
          const hasDiscount = preview.totalDiscount > 0;
          return (
            <button
              key={p.key}
              type="button"
              className={`wizard-pkg-card${isSelected ? " wizard-pkg-card--selected" : ""}`}
              onClick={() => selectPackage(p.key)}
            >
              <span className="wizard-pkg-emoji">{p.emoji}</span>
              <div className="wizard-pkg-head">
                <strong>{p.title}</strong>
                <span className="wizard-pkg-subtitle">{p.subtitle}</span>
              </div>
              <div className="wizard-pkg-price-block">
                {hasDiscount ? (
                  <>
                    <span className="wizard-pkg-price-old">{p.price} €</span>
                    <span className="wizard-pkg-price wizard-pkg-price-final">
                      {preview.finalPrice.toFixed(2).replace(".00", "")} €
                    </span>
                  </>
                ) : (
                  <span className="wizard-pkg-price">{p.price} €</span>
                )}
                {p.isTeam && (
                  <span className="wizard-pkg-players-hint">
                    {p.minPlayers === p.maxPlayers ? `${p.minPlayers} jugadors` : `${p.minPlayers}–${p.maxPlayers} jugadors`}
                  </span>
                )}
              </div>
              <p className="wizard-pkg-desc">{p.description}</p>
            </button>
          );
        })}
      </div>

      {/* Categoria — filtrada per paquet */}
      <div className="wizard-field wizard-field-full" style={{ marginTop: 8 }}>
        <label htmlFor="wizard-team-cat">Categoria *</label>
        <select id="wizard-team-cat" value={state.category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Tria la categoria…</option>
          {availableCategories.map((c) => {
            const hint = getCategoryBirthHint(c);
            return <option key={c} value={c}>{c}{hint ? ` — ${hint}` : ""}</option>;
          })}
        </select>
      </div>

      {/* Nom equip */}
      {state.packageKey && state.packageKey !== "individual" && (
        <div className="wizard-field wizard-field-full">
          <label htmlFor="wizard-team-name">Nom de l&apos;equip *</label>
          <input
            id="wizard-team-name"
            type="text"
            value={state.teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Ex: Lakers BCN, Fire Girls, Street Ballers…"
            maxLength={60}
            required
          />
        </div>
      )}

      {/* Capità / Tutor */}
      <h3 className="wizard-section-title" style={{ marginTop: 28 }}>
        {state.needsTutor ? "Tutor/a (responsable adult)" : "Capità / Capitana"}
      </h3>
      {state.needsTutor && (
        <p style={{ marginBottom: 12, color: "#aaa", fontSize: 14 }}>
          Per a categories formatives cal el contacte d&apos;un adult responsable.
        </p>
      )}

      <div className="wizard-grid-2">
        <div className="wizard-field wizard-field-full">
          <label htmlFor="wizard-capt-name">Nom i cognoms *</label>
          <input id="wizard-capt-name" type="text" value={state.captain.fullName} onChange={(e) => updateCaptain("fullName", e.target.value)} placeholder="Anna García López" required maxLength={80} autoComplete="name" />
        </div>
        <div className="wizard-field">
          <label htmlFor="wizard-capt-phone">Telèfon (WhatsApp) *</label>
          <input id="wizard-capt-phone" type="tel" value={state.captain.phone} onChange={(e) => updateCaptain("phone", e.target.value)} placeholder="+34 600 000 000" required maxLength={20} autoComplete="tel" />
        </div>
        <div className="wizard-field">
          <label htmlFor="wizard-capt-email">Email *</label>
          <input id="wizard-capt-email" type="email" value={state.captain.email} onChange={(e) => updateCaptain("email", e.target.value)} placeholder="capitana@email.com" required maxLength={100} autoComplete="email" />
        </div>
        <div className="wizard-field">
          <label htmlFor="wizard-capt-shirt">Talla samarreta <span style={{ fontWeight: 400, color: "#888" }}>(opcional)</span></label>
          <select id="wizard-capt-shirt" value={state.captain.shirtSize} onChange={(e) => updateCaptain("shirtSize", e.target.value)}>
            <option value="">Talla…</option>
            {SHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Camps addicionals per a inscripció individual */}
        {state.packageKey === "individual" && (<>
          <div className="wizard-field">
            <label htmlFor="wizard-indiv-birth">
              Any de naixement *
              {indivBirthHint && <span style={{ fontWeight: 400, color: "#888", marginLeft: 6 }}>({indivBirthHint})</span>}
            </label>
            <input
              id="wizard-indiv-birth"
              type="text"
              value={state.indivBirthYear}
              onChange={(e) => setIndivField("indivBirthYear", e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="2005"
              maxLength={4}
              inputMode="numeric"
              required
            />
          </div>
          <div className="wizard-field">
            <label htmlFor="wizard-indiv-gender">Gènere *</label>
            <select id="wizard-indiv-gender" value={state.indivGender} onChange={(e) => setIndivField("indivGender", e.target.value)} required>
              <option value="">Tria…</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="wizard-field">
            <label htmlFor="wizard-indiv-position">Posició preferida <span style={{ fontWeight: 400, color: "#888" }}>(opcional)</span></label>
            <select id="wizard-indiv-position" value={state.indivPosition} onChange={(e) => setIndivField("indivPosition", e.target.value)}>
              <option value="">Indiferent</option>
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="wizard-field">
            <label htmlFor="wizard-indiv-level">Nivell de joc <span style={{ fontWeight: 400, color: "#888" }}>(opcional)</span></label>
            <select id="wizard-indiv-level" value={state.indivLevel} onChange={(e) => setIndivField("indivLevel", e.target.value)}>
              <option value="">Tria…</option>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </>)}
      </div>

      {/* Menor: variant Individual+Formativa (jugador inscrit) vs Equip+Formativa (capità menor opcional) */}
      {state.needsTutor && state.packageKey === "individual" && (
        <>
          <h3 className="wizard-section-title" style={{ marginTop: 28 }}>
            Jugador/a inscrit/a (menor) <span style={{ color: "#ef4444" }}>*</span>
          </h3>
          <p style={{ marginBottom: 12, color: "#aaa", fontSize: 14 }}>
            És el nom del <strong>nen/a o adolescent que jugarà</strong>. Les dades de contacte (telèfon/email)
            ja les hem agafat del tutor/a a dalt — només cal el nom del jugador menor.
          </p>
          <div className="wizard-grid-2">
            <div className="wizard-field wizard-field-full">
              <label htmlFor="wizard-minor-name">Nom i cognoms del jugador/a menor *</label>
              <input
                id="wizard-minor-name"
                type="text"
                value={state.tutor.fullName}
                onChange={(e) => updateTutor("fullName", e.target.value)}
                placeholder="Bruno Cuevas Medina"
                maxLength={80}
                autoComplete="off"
                required
              />
            </div>
            <div className="wizard-field">
              <label htmlFor="wizard-minor-phone">Telèfon propi del menor <span style={{ fontWeight: 400, color: "#888" }}>(opcional)</span></label>
              <input id="wizard-minor-phone" type="tel" value={state.tutor.phone} onChange={(e) => updateTutor("phone", e.target.value)} placeholder="(si en té)" maxLength={20} autoComplete="off" />
            </div>
            <div className="wizard-field">
              <label htmlFor="wizard-minor-email">Email propi del menor <span style={{ fontWeight: 400, color: "#888" }}>(opcional)</span></label>
              <input id="wizard-minor-email" type="email" value={state.tutor.email} onChange={(e) => updateTutor("email", e.target.value)} placeholder="(si en té)" maxLength={100} autoComplete="off" />
            </div>
          </div>
        </>
      )}

      {/* Capità menor (només per Equip + Formativa) */}
      {state.needsTutor && state.packageKey !== "individual" && (
        <>
          <h3 className="wizard-section-title" style={{ marginTop: 28 }}>Capità/a de l&apos;equip (menor, opcional)</h3>
          <p style={{ marginBottom: 12, color: "#aaa", fontSize: 14 }}>
            Si encara no el tens clar, pots deixar aquests camps en blanc i posar els jugadors al pas següent.
          </p>
          <div className="wizard-grid-2">
            <div className="wizard-field wizard-field-full">
              <label>Nom i cognoms</label>
              <input type="text" value={state.tutor.fullName} onChange={(e) => updateTutor("fullName", e.target.value)} placeholder="Marc Puig Torres" maxLength={80} autoComplete="name" />
            </div>
            <div className="wizard-field">
              <label>Telèfon</label>
              <input type="tel" value={state.tutor.phone} onChange={(e) => updateTutor("phone", e.target.value)} placeholder="+34 600 000 000" maxLength={20} autoComplete="tel" />
            </div>
            <div className="wizard-field">
              <label>Email</label>
              <input type="email" value={state.tutor.email} onChange={(e) => updateTutor("email", e.target.value)} placeholder="capitan@email.com" maxLength={100} autoComplete="email" />
            </div>
          </div>
        </>
      )}

      {!canAdvance && missing.length > 0 && (
        <p role="alert" style={{ color: "#f08c00", fontSize: 13, margin: "16px 0 0", lineHeight: 1.5 }}>
          ⚠️ Falta: {missing.join(" · ")}
        </p>
      )}
      <div className="wizard-nav" style={{ marginTop: 12 }}>
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev}>← Enrere</button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Continuar al pagament →
        </button>
      </div>
    </div>
  );
}

// ── Step 3 — Pagament ──────────────────────────────────────────────────────

function Step3Payment({
  pkg,
  disc,
  teamName,
  proofFileName,
  onFile,
  onPrev,
  onNext,
  canAdvance,
  missing,
}: {
  pkg: Package;
  disc: DiscountResult;
  teamName: string;
  proofFileName: string;
  onFile: (f: File | null) => void;
  onPrev: () => void;
  onNext: () => void;
  canAdvance: boolean;
  missing: string[];
}) {
  const finalPrice = disc.finalPrice > 0 ? disc.finalPrice : pkg.price;
  const concept = `${(teamName || "EQUIP").toUpperCase().replace(/\s+/g, " ")} 3X3`;

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Fes la transferència</h2>
      <p className="wizard-step-desc">
        Transfereix l&apos;import al compte del club i adjunta el justificant aquí sota. Validem en menys de 24h.
      </p>

      <div className="wizard-iban-box">
        <div className="wizard-iban-row">
          <span className="wizard-iban-label">Import</span>
          <div className="wizard-iban-value-wrap">
            <strong className="wizard-iban-amount">
              {disc.totalDiscount > 0
                ? <><s style={{ color: "rgba(255,255,255,.3)", fontWeight: 400 }}>{pkg.price} €</s>{" "}{finalPrice.toFixed(2).replace(".00", "")} €</>
                : <>{pkg.price} €</>
              }
            </strong>
            {disc.earlyBirdAmt > 0 && <span className="wizard-iban-discount-badge">🔥 −{disc.earlyBirdAmt.toFixed(2).replace(".00", "")} €</span>}
            {disc.socialAmt > 0 && <span className="wizard-iban-discount-badge">📲 −{disc.socialAmt.toFixed(2).replace(".00", "")} €</span>}
            {disc.rivalAmt > 0 && <span className="wizard-iban-discount-badge">🏀 −{disc.rivalAmt} €</span>}
          </div>
        </div>
        <div className="wizard-iban-row">
          <span className="wizard-iban-label">IBAN</span>
          <div className="wizard-iban-value-wrap">
            <strong className="wizard-iban-mono">{IBAN_INFO.iban}</strong>
            <CopyBtn text={IBAN_INFO.iban.replace(/\s/g, "")} label="IBAN" />
          </div>
        </div>
        <div className="wizard-iban-row">
          <span className="wizard-iban-label">Beneficiari</span>
          <strong>{IBAN_INFO.beneficiary}</strong>
        </div>
        <div className="wizard-iban-row">
          <span className="wizard-iban-label">Concepte</span>
          <div className="wizard-iban-value-wrap">
            <strong className="wizard-iban-mono">{concept}</strong>
            <CopyBtn text={concept} label="concepte" />
          </div>
        </div>
      </div>

      <p className="wizard-help" style={{ marginTop: 6, marginBottom: 8 }}>
        ⚠️ Posa exactament aquest concepte perquè puguem identificar el teu equip.
      </p>
      <div style={{ background: "#f0f7ff", border: "1px solid #b8d8f8", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#1a5080", marginBottom: 20, lineHeight: 1.6 }}>
        <p style={{ margin: "0 0 6px" }}>
          ✅ <strong>Si ja has pagat la transferència:</strong> puja el justificant aquí mateix per validar la inscripció avui i rebre el QR de check-in.
        </p>
        <p style={{ margin: 0 }}>
          ⏳ <strong>Si pagaràs després:</strong> pots enviar la inscripció sense justificant. Tens <strong>48 hores</strong> per fer la transferència i enviar-nos el comprovant per <a href="https://wa.me/34698425153" target="_blank" rel="noreferrer" style={{ color: "#1a5080" }}>WhatsApp</a> amb el concepte indicat.
        </p>
      </div>

      <div className="wizard-field wizard-field-full">
        <label htmlFor="proof">
          Justificant de la transferència{" "}
          <span style={{ fontWeight: 400, color: "#888" }}>JPG, PNG o PDF · màx. 4 MB</span>
        </label>
        <input
          id="proof"
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => onFile(e.target.files?.[0] || null)}
        />
        {proofFileName
          ? <p className="wizard-help wizard-help-success">✓ Fitxer adjuntat: <strong>{proofFileName}</strong></p>
          : <p className="wizard-help">📎 Adjunta el comprovant si ja has fet la transferència — o continua i envia&apos;ns-el per WhatsApp.</p>
        }
      </div>

      {!canAdvance && missing.length > 0 && (
        <p role="alert" style={{ color: "#f08c00", fontSize: 13, margin: "16px 0 0", lineHeight: 1.5 }}>
          ⚠️ Falta: {missing.join(" · ")}
        </p>
      )}
      <div className="wizard-nav" style={{ marginTop: 12 }}>
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev}>← Enrere</button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Continuar →
        </button>
      </div>
    </div>
  );
}

// ── Step 4 — Jugadors ──────────────────────────────────────────────────────

function Step4Players({
  pkg,
  players,
  teamCategory,
  updatePlayer,
  addPlayer,
  removePlayer,
  missing,
  onPrev,
  onNext,
  canAdvance,
}: {
  pkg: Package;
  players: Player[];
  teamCategory: string;
  updatePlayer: (idx: number, patch: Partial<Player>) => void;
  addPlayer: () => void;
  removePlayer: (idx: number) => void;
  missing: string[];
  onPrev: () => void;
  onNext: () => void;
  canAdvance: boolean;
}) {
  const [openIdx, setOpenIdx] = useState<number>(0);

  function isPlayerComplete(p: Player): boolean {
    return !!(p.fullName.trim() && p.category && p.birthYear.trim() && p.gender && p.club.trim() && p.shirtSize);
  }

  function handleToggle(idx: number) {
    setOpenIdx((prev) => (prev === idx ? -1 : idx));
  }

  function handlePlayerUpdate(idx: number, patch: Partial<Player>) {
    updatePlayer(idx, patch);
    // Si el jugador queda complet, avança al primer jugador incomplet
    const updated = { ...players[idx], ...patch };
    if (isPlayerComplete(updated as Player)) {
      const nextIncomplete = players.findIndex((p, i) => i !== idx && !isPlayerComplete({ ...p, ...(i === idx ? patch : {}) }));
      if (nextIncomplete !== -1) setOpenIdx(nextIncomplete);
    }
  }

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Jugadors ({players.length}/{pkg.maxPlayers})</h2>
      <p className="wizard-step-desc">
        Mínim {pkg.minPlayers}, màxim {pkg.maxPlayers}. El mail és opcional.
      </p>

      {players.map((p, idx) => {
        const complete = isPlayerComplete(p);
        const isOpen = openIdx === idx;
        return (
        <div key={idx} className="wizard-player-card">
          <button
            type="button"
            className="wizard-player-head"
            onClick={() => handleToggle(idx)}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{complete ? "✅" : "⭕"}</span>
              <strong style={{ color: "#fff7ef" }}>
                {p.fullName.trim() || `Jugador/a ${idx + 1}`}
              </strong>
              {complete && <span style={{ fontSize: 12, color: "#aaa" }}>{p.shirtSize} · {p.club}</span>}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {players.length > pkg.minPlayers && (
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); removePlayer(idx); }}
                  style={{ fontSize: 12, color: "#f08c00", textDecoration: "underline", cursor: "pointer" }}
                >Eliminar</span>
              )}
              <span style={{ color: "#aaa", fontSize: 14 }}>{isOpen ? "▲" : "▼"}</span>
            </span>
          </button>

          {isOpen && (
          <div className="wizard-grid-2" style={{ padding: "0 16px 16px" }}>
            <div className="wizard-field wizard-field-full">
              <label htmlFor={`wp${idx}-name`}>Nom i cognoms *</label>
              <input id={`wp${idx}-name`} type="text" value={p.fullName} onChange={(e) => handlePlayerUpdate(idx, { fullName: e.target.value })} required maxLength={80} />
            </div>
            <div className="wizard-field">
              <label htmlFor={`wp${idx}-club`}>Club d&apos;origen{" "}
                {!p.club && idx > 0 && players[idx - 1]?.club
                  ? <button type="button" style={{ fontSize: 11, fontWeight: 400, color: "#aaa", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }} onClick={() => handlePlayerUpdate(idx, { club: players[idx - 1].club })}>= {players[idx - 1].club}</button>
                  : !p.club && <button type="button" style={{ fontSize: 11, fontWeight: 400, color: "#aaa", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }} onClick={() => handlePlayerUpdate(idx, { club: "Sense club" })}>Sense club</button>
                }
              </label>
              <input id={`wp${idx}-club`} type="text" value={p.club} onChange={(e) => handlePlayerUpdate(idx, { club: e.target.value })} placeholder="CB Grup Barna…" maxLength={60} />
            </div>
            <div className="wizard-field">
              <label>Categoria</label>
              <p style={{ margin: "6px 0 0", fontWeight: 600, fontSize: 15 }}>{teamCategory || "—"}</p>
            </div>
            <div className="wizard-field">
              <label htmlFor={`wp${idx}-birth`}>
                Any de naixement *
                {p.category && getCategoryBirthHint(p.category) && (
                  <span style={{ fontWeight: 400, color: "#888", marginLeft: 6 }}>({getCategoryBirthHint(p.category)})</span>
                )}
              </label>
              <input
                id={`wp${idx}-birth`}
                type="text"
                value={p.birthYear}
                onChange={(e) => handlePlayerUpdate(idx, { birthYear: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                placeholder="2010"
                maxLength={4}
                inputMode="numeric"
                required
                style={(() => {
                  if (!p.birthYear || !isValidBirthYear(p.birthYear)) return {};
                  const range = getCategoryBirthRange(p.category);
                  if (!range) return {};
                  const y = parseInt(p.birthYear);
                  return (y < range[0] - 1 || y > range[1] + 1)
                    ? { borderColor: "#f08c00" }
                    : {};
                })()}
              />
              {p.birthYear && isValidBirthYear(p.birthYear) && (() => {
                const range = getCategoryBirthRange(p.category);
                if (!range) return null;
                const y = parseInt(p.birthYear);
                return (y < range[0] - 1 || y > range[1] + 1) ? (
                  <p style={{ color: "#f08c00", fontSize: 12, margin: "4px 0 0", lineHeight: 1.5 }}>
                    ⚠️ Any fora del rang ({getCategoryBirthHint(p.category)}). Es permet ±1 any per circumstàncies especials — ho revisarem manualment i us confirmem.
                  </p>
                ) : null;
              })()}
            </div>
            <div className="wizard-field">
              <label htmlFor={`wp${idx}-gender`}>Gènere *</label>
              <select id={`wp${idx}-gender`} value={p.gender} onChange={(e) => handlePlayerUpdate(idx, { gender: e.target.value })} required>
                <option value="">Tria…</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              {p.gender && !genderMatchesCategory(p.gender, teamCategory) && (
                <p style={{ color: "#f08c00", fontSize: 12, margin: "4px 0 0" }}>
                  ⚠️ El gènere del jugador/a no coincideix amb la categoria de l&apos;equip
                </p>
              )}
            </div>
            <div className="wizard-field">
              <label htmlFor={`wp${idx}-phone`}>Telèfon</label>
              <input id={`wp${idx}-phone`} type="tel" value={p.phone} onChange={(e) => handlePlayerUpdate(idx, { phone: e.target.value })} placeholder="+34 600 000 000" maxLength={20} />
            </div>
            <div className="wizard-field">
              <label htmlFor={`wp${idx}-shirt`}>Talla samarreta <span style={{ fontWeight: 400, color: "#888" }}>(opcional)</span></label>
              <select id={`wp${idx}-shirt`} value={p.shirtSize} onChange={(e) => handlePlayerUpdate(idx, { shirtSize: e.target.value })}>
                <option value="">Talla…</option>
                {SHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="wizard-field">
              <label>Email <span style={{ fontWeight: 400, color: "#888" }}>(opcional)</span></label>
              <input type="email" value={p.email} onChange={(e) => handlePlayerUpdate(idx, { email: e.target.value })} placeholder="jugador@email.com" maxLength={100} />
            </div>
          </div>
          )}
        </div>
        );
      })}

      {players.length < pkg.maxPlayers && (
        <button type="button" className="wizard-add-player" onClick={addPlayer}>
          + Afegir jugador/a ({players.length + 1}/{pkg.maxPlayers})
        </button>
      )}

      {!canAdvance && missing.length > 0 && (
        <p style={{ color: "#f08c00", fontSize: 13, margin: "16px 0 0", lineHeight: 1.6 }}>
          ⚠️ {missing.slice(0, 3).join(" · ")}
          {missing.length > 3 && ` · i ${missing.length - 3} camp${missing.length - 3 > 1 ? "s" : ""} més`}
        </p>
      )}
      <div className="wizard-nav" style={{ marginTop: 12 }}>
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev}>← Enrere</button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onNext} disabled={!canAdvance}>
          Revisar i enviar →
        </button>
      </div>
    </div>
  );
}

// ── Step 5 — Confirmació ───────────────────────────────────────────────────

function Step5Confirm({
  pkg,
  state,
  disc,
  setRgpd,
  setImageRights,
  onPrev,
  onSubmit,
  canSubmit,
  submitting,
  error,
}: {
  pkg: Package;
  state: WizardState;
  disc: DiscountResult;
  setRgpd: (v: boolean) => void;
  setImageRights: (v: boolean) => void;
  onPrev: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  submitting: boolean;
  error: string | null;
}) {
  const finalPrice = disc.finalPrice > 0 ? disc.finalPrice : pkg.price;

  return (
    <div className="wizard-step">
      <h2 className="wizard-step-title">Revisa i envia</h2>
      <p className="wizard-step-desc">
        En menys de 24h et confirmem la plaça per WhatsApp i email.
      </p>

      <div className="wizard-summary">
        <div className="wizard-summary-row"><span>Paquet</span><strong>{pkg.emoji} {pkg.title}</strong></div>
        {pkg.isTeam && state.teamName && <div className="wizard-summary-row"><span>Equip</span><strong>{state.teamName}</strong></div>}
        <div className="wizard-summary-row"><span>Categoria</span><strong>{state.category}</strong></div>
        <div className="wizard-summary-row"><span>{state.needsTutor ? "Tutor/a responsable" : "Capità/a"}</span><strong>{state.captain.fullName} · {state.captain.phone}</strong></div>
        {state.needsTutor && state.tutor.fullName && (
          <div className="wizard-summary-row">
            <span>{state.packageKey === "individual" ? "Jugador/a inscrit/a" : "Capità/a equip"}</span>
            <strong>{state.tutor.fullName}</strong>
          </div>
        )}
        {pkg.isTeam && <div className="wizard-summary-row"><span>Jugadors</span><strong>{state.players.length}</strong></div>}
        <div className="wizard-summary-row"><span>Justificant</span><strong>{state.proofFileName || "—"}</strong></div>
        {disc.earlyBirdAmt > 0 && <div className="wizard-summary-row wizard-summary-row-discount"><span>🔥 Early Bird −10 %</span><strong>−{disc.earlyBirdAmt.toFixed(2).replace(".00", "")} €</strong></div>}
        {disc.socialAmt > 0 && <div className="wizard-summary-row wizard-summary-row-discount"><span>📲 Social −5 %</span><strong>−{disc.socialAmt.toFixed(2).replace(".00", "")} €</strong></div>}
        {disc.rivalAmt > 0 && <div className="wizard-summary-row wizard-summary-row-discount"><span>🏀 Pack Rival</span><strong>−{disc.rivalAmt} €</strong></div>}
        <div className="wizard-summary-row wizard-summary-row-total">
          <span>Total pagat</span>
          <strong className="wizard-summary-total">
            {disc.totalDiscount > 0
              ? <><s style={{ color: "rgba(255,247,239,.38)", fontWeight: 400 }}>{pkg.price} €</s>{" "}{finalPrice.toFixed(2).replace(".00", "")} €</>
              : <>{pkg.price} €</>
            }
          </strong>
        </div>
      </div>

      {!state.proofFileName && (
        <p style={{ background: "rgba(240,140,0,.1)", border: "1px solid rgba(240,140,0,.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f08c00", margin: "0 0 16px", lineHeight: 1.5 }}>
          ⚠️ No has adjuntat el justificant de la transferència. Pots enviar la inscripció igualment — envia&apos;ns el comprovant per{" "}
          <a href="https://wa.me/34698425153" target="_blank" rel="noreferrer" style={{ color: "#f08c00" }}>WhatsApp</a> en quan facis el pagament.
        </p>
      )}

      <label className="wizard-toggle">
        <input type="checkbox" checked={state.rgpdConsent} onChange={(e) => setRgpd(e.target.checked)} />
        <span>Accepto la política de privadesa i el tractament de les dades (RGPD). *</span>
      </label>
      <label className="wizard-toggle">
        <input type="checkbox" checked={state.imageRightsConsent} onChange={(e) => setImageRights(e.target.checked)} />
        <span>Autoritzo l&apos;organització a fer fotos/vídeos durant el torneig per a difusió del club. *</span>
      </label>

      {error && <p role="alert" className="wizard-error">⚠️ Error: {error}. Torna-ho a provar o deixa les dades a Contacte.</p>}

      <div className="wizard-nav">
        <button type="button" className="wizard-btn wizard-btn-ghost" onClick={onPrev} disabled={submitting}>← Enrere</button>
        <button type="button" className="wizard-btn wizard-btn-primary" onClick={onSubmit} disabled={!canSubmit || submitting}>
          {submitting ? "Enviant…" : "Enviar inscripció ✓"}
        </button>
      </div>
    </div>
  );
}

// ── Success ────────────────────────────────────────────────────────────────

function SuccessPanel({
  teamId,
  playerIds,
  disc,
  pkg,
  teamName,
  waFlow = false,
  category = "",
  captainName = "",
  captainEmail = "",
  proofUploaded = false,
}: {
  teamId: string;
  playerIds: string[];
  disc: DiscountResult;
  pkg: Package;
  teamName: string;
  waFlow?: boolean;
  category?: string;
  captainName?: string;
  captainEmail?: string;
  proofUploaded?: boolean;
}) {
  const checkInUrl = `https://www.cbgrupbarna-3x3timechamber.com/check-in/${teamId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(checkInUrl)}`;
  const finalPrice = disc.finalPrice > 0 ? disc.finalPrice : pkg.price;
  const waProofText = [
    `Hola! Us envio el justificant de pagament.`,
    `Equip: ${teamName || captainName} | ID: ${teamId}`,
    category ? `Categoria: ${category}` : "",
    `Paquet: ${pkg.title} | Import: ${finalPrice}€`,
    captainName ? `Capità/a: ${captainName}` : "",
  ].filter(Boolean).join("\n");
  const waProofHref = `https://wa.me/34698425153?text=${encodeURIComponent(waProofText)}`;

  return (
    <div className="wizard-success">
      <span className="wizard-success-emoji">🏀</span>
      <h2>Inscripció enviada!</h2>
      {teamName && <p style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{teamName}</p>}
      <p style={{ margin: "0 0 20px", color: "rgba(255,247,239,.75)", fontSize: 14 }}>
        Codi d&apos;inscripció: <code className="wizard-success-code" style={{ fontSize: 13 }}>{teamId}</code>
      </p>

      {/* Timeline — el que passa ara */}
      <div className="wizard-success-timeline">
        <div className="wizard-success-timeline-item wizard-success-timeline-item--done">
          <span className="wizard-success-tl-dot">✓</span>
          <div>
            <strong>Inscripció rebuda</strong>
            <p>Tenim totes les teves dades.</p>
          </div>
        </div>
        <div className="wizard-success-timeline-item">
          <span className="wizard-success-tl-dot">2</span>
          <div>
            <strong>Confirmació plaça — en menys de 24h</strong>
            <p>
              Rebràs WhatsApp + email a {captainEmail
                ? <strong>{captainEmail}</strong>
                : "l'adreça indicada"
              }. Revisa la carpeta de spam si no arriba.
            </p>
            {!proofUploaded && (
              <p style={{ marginTop: 4, color: "#f08c00", fontSize: 12 }}>
                ⏳ Tens <strong>48h</strong> per enviar el justificant de pagament per{" "}
                <a href={waProofHref} target="_blank" rel="noreferrer" style={{ color: "#f08c00" }}>WhatsApp</a>.
              </p>
            )}
          </div>
        </div>
        <div className="wizard-success-timeline-item">
          <span className="wizard-success-tl-dot">3</span>
          <div>
            <strong>Horaris i rivals — 1 setmana abans</strong>
            <p>Us enviarem els horaris, pistes i els equips rivals per WhatsApp.</p>
          </div>
        </div>
        <div className="wizard-success-timeline-item">
          <span className="wizard-success-tl-dot">🏀</span>
          <div>
            <strong>Dia del torneig — 6-7 juny 2026</strong>
            <p>Check-in a Westfield Glòries. Porta el QR aquí sota.</p>
          </div>
        </div>
      </div>

      {waFlow && (
        <a
          href={waProofHref}
          className="wizard-btn wizard-btn-primary"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: 8 }}
        >
          Enviar justificant per WhatsApp
        </a>
      )}

      {disc.totalDiscount > 0 && (
        <div className="wizard-success-discount">
          <span>Estalvi total</span>
          <strong>−{disc.totalDiscount.toFixed(2).replace(".00", "")} € · Has pagat {finalPrice.toFixed(2).replace(".00", "")} €</strong>
        </div>
      )}

      <div className="wizard-success-qr">
        <Image src={qrUrl} alt={`QR check-in equip ${teamId}`} width={240} height={240} unoptimized priority />
        <p><strong>Guarda aquest QR.</strong> El necessitaràs el dia del torneig per fer el check-in. Fes captura de pantalla ara.</p>
      </div>
      <a href={`/check-in/${teamId}`} className="wizard-btn wizard-btn-primary">Obrir pàgina de check-in →</a>
      {playerIds.length > 1 && (
        <details className="wizard-success-details">
          <summary>Codis dels {playerIds.length} jugadors</summary>
          <ul className="wizard-success-player-ids">
            {playerIds.map((id) => <li key={id}><a href={`/jugador/${id}`}><code>{id}</code></a></li>)}
          </ul>
        </details>
      )}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 16 }}>
        <a href="/" className="wizard-btn wizard-btn-ghost">Tornar a l&apos;inici</a>
        <a
          href={`https://wa.me/34698425153?text=${encodeURIComponent(`Hola! Acabo d'inscriure l'equip ${teamId}${teamName ? ` (${teamName})` : ""}. Tinc un dubte.`)}`}
          target="_blank"
          rel="noreferrer"
          className="wizard-btn wizard-btn-ghost"
        >
          💬 Dubtes? WhatsApp
        </a>
      </div>
    </div>
  );
}

// ── Estat de places per categoria (actualitzat 29/05/2026) ─────────────────
// Estratègia de captació: NO mostrar mai "0 places" — sempre 1 mínim per
// generar urgència i atraure més inscripcions. Si volem tancar una categoria
// definitivament, posar `closed: true`.
const CATEGORY_STATUS: Array<{ name: string; left: number; closed?: boolean }> = [
  { name: "Escoleta",       left: 1 },
  { name: "Premini Masc.",  left: 1 },  // Anabela acaba d'omplir, però deixem 1 per atraure
  { name: "Premini Fem.",   left: 5 },
  { name: "Mini",           left: 2 },
  { name: "Preinfantil",    left: 4 },
  { name: "Infantil",       left: 3 },
  { name: "Cadet Masc.",    left: 1 },
  { name: "Cadet Fem.",     left: 2 },
  { name: "Júnior",         left: 5 },
  { name: "Sènior Masc.",   left: 1 },
  { name: "Sènior Fem.",    left: 3 },
  { name: "Veterans",       left: 4 },
];

function CategoryStatusGrid() {
  return (
    <details style={{
      background: "#0f1115",
      border: "1px solid #1f2937",
      borderRadius: 12,
      padding: "10px 14px",
      margin: "0 0 14px",
      color: "#e5e7eb",
      fontSize: 13,
      lineHeight: 1.6,
    }}>
      <summary style={{ cursor: "pointer", fontWeight: 600, listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none" }}>
        <span>📊 Places restants per categoria</span>
        <span style={{ color: "#9ca3af", fontSize: 12, fontWeight: 400 }}>(toca per veure)</span>
      </summary>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 6,
        marginTop: 10,
      }}>
        {CATEGORY_STATUS.map((c) => {
          // Si no està tancada explícitament, mai mostrem menys d'1 plaça
          const displayed = c.closed ? 0 : Math.max(1, c.left);
          const isCritical = displayed === 1;
          const isLow      = displayed === 2 || displayed === 3;
          const color = c.closed ? "#ef4444" : isCritical ? "#f97316" : isLow ? "#facc15" : "#22c55e";
          const icon  = c.closed ? "🚫" : isCritical ? "🔥" : isLow ? "⚠️" : "✅";
          return (
            <div key={c.name} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "6px 10px",
              background: "rgba(255,255,255,0.02)",
              borderLeft: `3px solid ${color}`,
              borderRadius: 4,
            }}>
              <span style={{ fontSize: 13 }}>{icon} {c.name}</span>
              <strong style={{ color, fontSize: 13 }}>
                {c.closed ? "TANCADA" : `${displayed} ${displayed === 1 ? "plaça" : "places"}`}
              </strong>
            </div>
          );
        })}
      </div>
    </details>
  );
}
