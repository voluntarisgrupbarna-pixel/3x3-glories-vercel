/**
 * Bateria de proves — Rutes API Next.js
 * /api/inscripcio  i  /api/abandoned
 *
 * Usa el request context de Playwright (sense browser).
 * No envia dades reals a Apps Script: la variable APPS_SCRIPT_WEBHOOK_URL
 * no està definida en entorn de test, per tant el handler fa log i retorna OK.
 */

import { test, expect } from "@playwright/test";

// ── Payload de referència ────────────────────────────────────────────────────

const VALID_PAYLOAD = {
  packageKey: "team-4",
  packageTitle: "Equip 4 jugadors",
  packagePrice: 75,
  teamName: "Street Ballers Test",
  category: "Sènior Masculí",
  captain: {
    fullName: "Anna García López",
    phone: "+34 600 000 001",
    email: "anna@test.com",
    shirtSize: "M",
  },
  tutor: null,
  players: [
    {
      fullName: "Jugador Test 1",
      club: "CB Grup Barna",
      category: "Sènior Masculí",
      birthYear: "2000",
      gender: "Masculí",
      phone: "+34 600000001",
      shirtSize: "M",
      email: "j1@test.com",
      birthDate: "2000-01-01",
      imageRights: true,
    },
    {
      fullName: "Jugador Test 2",
      club: "CB Grup Barna",
      category: "Sènior Masculí",
      birthYear: "1998",
      gender: "Masculí",
      phone: "+34 600000002",
      shirtSize: "L",
      email: "j2@test.com",
      birthDate: "1998-01-01",
      imageRights: true,
    },
    {
      fullName: "Jugador Test 3",
      club: "CB Grup Barna",
      category: "Sènior Masculí",
      birthYear: "2001",
      gender: "Femení",
      phone: "+34 600000003",
      shirtSize: "S",
      email: "",
      birthDate: "2001-01-01",
      imageRights: true,
    },
  ],
  proof: { fileName: "", mime: "", base64: "" },
  rgpdConsent: true,
  imageRightsConsent: true,
  refCode: null,
  submittedAt: new Date().toISOString(),
  discountType: null,
  discountAmount: 0,
  finalPrice: 75,
  earlyBirdApplied: false,
  socialShareDone: false,
};

// ── Tests /api/inscripcio ────────────────────────────────────────────────────

test.describe("POST /api/inscripcio", () => {

  test("1 · Payload complet → 200 + ok:true + teamId + playerIds", async ({ request }) => {
    const res = await request.post("/api/inscripcio", { data: VALID_PAYLOAD });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.teamId).toBeTruthy();
    expect(Array.isArray(json.playerIds)).toBe(true);
    expect(json.playerIds).toHaveLength(3);
  });

  test("2 · teamId segueix el format T3X3-2026-XXXXX", async ({ request }) => {
    const res = await request.post("/api/inscripcio", { data: VALID_PAYLOAD });
    const { teamId } = await res.json();
    expect(teamId).toMatch(/^T3X3-2026-[A-Z2-9]{5}$/);
  });

  test("3 · Sense packageKey → 400", async ({ request }) => {
    const payload = { ...VALID_PAYLOAD, packageKey: undefined };
    const res = await request.post("/api/inscripcio", { data: payload });
    expect(res.status()).toBe(400);
  });

  test("4 · Sense captain.fullName → 400", async ({ request }) => {
    const payload = {
      ...VALID_PAYLOAD,
      captain: { ...VALID_PAYLOAD.captain, fullName: "" },
    };
    const res = await request.post("/api/inscripcio", { data: payload });
    expect(res.status()).toBe(400);
  });

  test("5 · Sense rgpdConsent:true → 400", async ({ request }) => {
    const payload = { ...VALID_PAYLOAD, rgpdConsent: false };
    const res = await request.post("/api/inscripcio", { data: payload });
    expect(res.status()).toBe(400);
  });

  test("6 · Sense imageRightsConsent:true → 400", async ({ request }) => {
    const payload = { ...VALID_PAYLOAD, imageRightsConsent: false };
    const res = await request.post("/api/inscripcio", { data: payload });
    expect(res.status()).toBe(400);
  });
});

// ── Tests /api/abandoned ─────────────────────────────────────────────────────

test.describe("POST /api/abandoned", () => {

  test("7 · Amb captainEmail → 200 + ok:true", async ({ request }) => {
    const res = await request.post("/api/abandoned", {
      data: {
        action: "abandoned",
        abandonedAt: new Date().toISOString(),
        reason: "test",
        step: 2,
        packageKey: "team-4",
        packageTitle: "Equip 4 jugadors",
        packagePrice: 75,
        teamName: "Test Team",
        category: "Sènior Masculí",
        captainName: "Anna García",
        captainPhone: "+34 600000001",
        captainEmail: "anna@test.com",
        finalPrice: 75,
        proofUploaded: false,
        earlyBirdApplied: false,
        socialShareDone: false,
      },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  test("8 · Sense captainEmail ni captainPhone → 400", async ({ request }) => {
    const res = await request.post("/api/abandoned", {
      data: {
        action: "abandoned",
        reason: "test",
        step: 2,
        captainEmail: "",
        captainPhone: "",
      },
    });
    expect(res.status()).toBe(400);
  });
});
