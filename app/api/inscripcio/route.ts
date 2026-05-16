import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Player = {
  fullName: string;
  club?: string;
  category?: string;
  birthYear?: string;
  birthDate?: string;
  gender?: string;
  phone?: string;
  email?: string;
  shirtSize?: string;
  position?: string;
  level?: string;
  dorsal?: string;
  federated?: boolean;
  federationKey?: string;
  imageRights: boolean;
};

type ContactPerson = {
  fullName: string;
  phone: string;
  email: string;
  shirtSize?: string;
};

type Payload = {
  packageKey: string;
  packageTitle: string;
  packagePrice: number;
  teamName: string;
  category: string;
  captain: ContactPerson;
  tutor: ContactPerson | null;
  players: Player[];
  proof?: {
    fileName: string;
    mime: string;
    base64: string;
  };
  rgpdConsent: boolean;
  imageRightsConsent: boolean;
  refCode: string | null;
  submittedAt: string;
  // Descomptes (acumulables, pot ser "earlybird+social+rival" o combinació)
  discountType: string | null;
  discountAmount: number;
  finalPrice: number;
  socialShareDone?: boolean;
  earlyBirdApplied?: boolean;
};

// IDs deterministes + curts: T3X3-2026-<5 chars random>
function generateTeamId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sense 0/O/1/I per evitar confusió
  let out = "";
  for (let i = 0; i < 5; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `T3X3-2026-${out}`;
}

function generatePlayerId(teamId: string, idx: number): string {
  const num = String(idx + 1).padStart(2, "0");
  return `${teamId}-J${num}`;
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as Payload;

    // Basic validation
    if (!payload.packageKey || !payload.captain?.fullName || !payload.players?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!payload.rgpdConsent || !payload.imageRightsConsent) {
      return NextResponse.json({ error: "Consents required" }, { status: 400 });
    }

    // Validació email capità
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.captain.email)) {
      return NextResponse.json({ error: "Email del capità invàlid" }, { status: 400 });
    }
    // Validació telèfon (mínim 9 caràcters)
    if (!payload.captain.phone || payload.captain.phone.trim().length < 9) {
      return NextResponse.json({ error: "Telèfon del capità obligatori (mínim 9 dígits)" }, { status: 400 });
    }
    // Talla samarreta capità
    if (!payload.captain.shirtSize) {
      return NextResponse.json({ error: "Talla samarreta del capità obligatòria" }, { status: 400 });
    }
    // Tutor obligatori per a categories formatives — email també obligatori
    if (payload.tutor) {
      if (!payload.tutor.fullName?.trim() || !payload.tutor.phone?.trim()) {
        return NextResponse.json({ error: "Nom i telèfon del tutor obligatoris" }, { status: 400 });
      }
      if (!payload.tutor.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.tutor.email)) {
        return NextResponse.json({ error: "Email del tutor obligatori i ha de ser vàlid" }, { status: 400 });
      }
    }
    // Validació packageKey contra llista tancada
    const VALID_PACKAGE_KEYS = ["individual", "team-4", "team-5", "senior"];
    if (!VALID_PACKAGE_KEYS.includes(payload.packageKey)) {
      return NextResponse.json({ error: "Categoria no vàlida" }, { status: 400 });
    }
    const proof = payload.proof ?? { fileName: "", mime: "", base64: "" };
    const proofBase64 = proof.base64 || "";

    // El justificant és recomanat, però no bloqueja: la plaça queda pendent de validació.
    // Si s'adjunta, validem mida per evitar bloquejos a Apps Script/Drive.
    const sizeBytes = proofBase64 ? Math.ceil((proofBase64.length * 3) / 4) : 0;
    if (proofBase64 && sizeBytes > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El justificant supera els 4 MB. Comprimit la imatge i torna a intentar-ho." },
        { status: 413 }
      );
    }
    // Club i talla samarreta obligatoris per jugadors (no per a inscripció individual)
    // Telèfon és opcional — el capità ja l'ha proporcionat com a contacte principal
    if (payload.packageKey !== "individual") {
      for (const p of payload.players) {
        if (!p.club?.trim()) {
          return NextResponse.json({ error: "El club d'origen és obligatori per a tots els jugadors" }, { status: 400 });
        }
        if (!p.shirtSize) {
          return NextResponse.json({ error: "La talla de samarreta és obligatòria per a tots els jugadors" }, { status: 400 });
        }
      }
    }

    // Generate IDs
    const teamId = generateTeamId();
    const playerIds = payload.players.map((_, idx) => generatePlayerId(teamId, idx));

    // === Fase 1 (MVP): forward to Apps Script Web App ===
    // Apps Script gestiona:
    //   1. Desar a Google Sheet "Inscripcions 3x3 2026"
    //   2. Guardar justificant a Drive (decodificant base64)
    //   3. Forward a GitHub JSON + Issue (backup paranoid)
    //   4. Notificació WhatsApp via Brevo + email confirmació
    //
    // L'URL del Web App va a la env var APPS_SCRIPT_WEBHOOK_URL (Vercel env).
    // Mentre no estigui configurada, l'endpoint guarda les dades al log
    // (en producció Vercel logs queden 1h) i retorna OK perquè el frontend continuï.

    const scriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
    const scriptSecret = process.env.APPSCRIPT_SECRET;

    const forwardPayload = {
      ...payload,
      proof,
      teamId,
      playerIds,
      secret: scriptSecret || "",
      receivedAt: new Date().toISOString(),
      paymentStatus: proofBase64 ? "proof_uploaded" : "pending_proof",
      // Camps normalitzats per Apps Script (compatibilitat)
      nomEquip: payload.teamName,
      midaEquip: String(payload.players.length),
      capCategoria: payload.category,
      capNom: payload.captain.fullName,
      capEmail: payload.captain.email,
      capTelefon: payload.captain.phone,
      tutorNom: payload.tutor?.fullName || "",
      tutorTelefon: payload.tutor?.phone || "",
      total: payload.finalPrice ?? payload.packagePrice,
      discountType: payload.discountType ?? null,
      discountAmount: payload.discountAmount ?? 0,
      finalPrice: payload.finalPrice ?? payload.packagePrice,
      rivalCode: payload.refCode ?? null,
    };

    if (scriptUrl) {
      try {
        const upstream = await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(forwardPayload),
          // Apps Script Web Apps redirect; needed to follow
          redirect: "follow",
        });

        if (!upstream.ok) {
          const text = await upstream.text();
          console.error("[inscripcio] Apps Script error", upstream.status, text);
          // No fallem cap a l'usuari, però ho registrem
        } else {
          const result = await upstream.json().catch(() => null);
          if (result && result.ok === false) {
            console.error("[inscripcio] Apps Script reported error", result);
          }
        }
      } catch (err) {
        console.error("[inscripcio] Apps Script fetch failed", err);
      }
    } else {
      // Sense backend Apps Script — log a Vercel
      const { proof, secret, ...safe } = forwardPayload;
      console.log("[inscripcio] PENDING (no APPS_SCRIPT_WEBHOOK_URL):", JSON.stringify(safe));
      console.log(
        "[inscripcio] proof file:",
        proof.fileName || "pending",
        proof.mime || "none",
        `${Math.round((proof.base64 || "").length / 1024)}KB`,
      );
    }

    return NextResponse.json({ ok: true, teamId, playerIds });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[inscripcio] handler error", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
