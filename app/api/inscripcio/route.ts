import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Player = {
  fullName: string;
  birthDate: string;
  gender: string;
  position: string;
  level: string;
  shirtSize: string;
  dorsal: string;
  federated: boolean;
  federationKey: string;
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
  proof: {
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
    // proof.base64 és OPCIONAL: la gent pot enviar sense justificant i fer-ho per WA
    if (!payload.rgpdConsent || !payload.imageRightsConsent) {
      return NextResponse.json({ error: "Consents required" }, { status: 400 });
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
      teamId,
      playerIds,
      secret: scriptSecret || "",
      receivedAt: new Date().toISOString(),
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
        proof.fileName,
        proof.mime,
        `${Math.round(proof.base64.length / 1024)}KB`,
      );
    }

    return NextResponse.json({ ok: true, teamId, playerIds });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[inscripcio] handler error", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
