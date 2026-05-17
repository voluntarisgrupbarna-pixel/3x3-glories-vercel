/**
 * Bateria de proves — SocialDiscountBlock (5 contactes WA + IG)
 * Ruta: /inscripcion (Step 1)
 *
 * El descompte social del 5% s'activa quan:
 *   1. L'usuari clica els 5 botons de WA (un per contacte)
 *   2. L'usuari clica el botó de seguir @cbgrupbarna a Instagram
 * Cobreix: estat inicial, clics parcials, flux complet, comptador, badges, preus.
 */

import { test, expect, Page } from "@playwright/test";

const REQUIRED_SHARES = 5;

async function gotoStep1(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("queuePassed", "1");
    sessionStorage.setItem("exit_intent_shown", "1");
  });
  await page.route("/api/inscripcio", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, teamId: "T3X3-SOC-001", playerIds: ["T3X3-SOC-001-J01"] }),
    })
  );
  await page.route("/api/abandoned", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
  );
  await page.goto("/inscripcion");
  await page.waitForSelector('.wizard[data-wizard-ready="true"]');
  await expect(page.getByText("Descomptes disponibles")).toBeVisible();
}

/** Clica els N primers slots de WA (0-based, fins a REQUIRED_SHARES) */
async function clickWaSlots(page: Page, count: number) {
  for (let i = 0; i < count; i++) {
    await page.locator(`[data-slot="${i}"]`).click();
  }
}

/** Clica tots els 5 slots WA + el botó IG */
async function activateSocialDiscount(page: Page) {
  await clickWaSlots(page, REQUIRED_SHARES);
  await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
  await expect(page.getByText(/Descompte social del 5 % activat/i)).toBeVisible();
}

test.describe("SocialDiscountBlock — 5 contactes WA + IG", () => {

  // ── Estat inicial ────────────────────────────────────────────────────────

  test("1 · Bloc social visible a l'Step 1", async ({ page }) => {
    await gotoStep1(page);
    await expect(page.getByText(/Descompte social/i)).toBeVisible();
    await expect(page.getByText(/−5 %/)).toBeVisible();
  });

  test("2 · Es mostren exactament 5 botons de WA", async ({ page }) => {
    await gotoStep1(page);
    await expect(page.locator(".wizard-social-btn--slot")).toHaveCount(REQUIRED_SHARES);
  });

  test("3 · Comptador inicial mostra '0/5 contactes'", async ({ page }) => {
    await gotoStep1(page);
    await expect(page.locator(".wizard-social-wa-progress")).toContainText("0/5");
  });

  test("4 · Sense cap clic → cap descompte activat", async ({ page }) => {
    await gotoStep1(page);
    await expect(page.getByText(/Descompte social del 5 % activat/i)).not.toBeVisible();
    await expect(page.locator(".wizard-discount-status--on")).not.toBeVisible();
  });

  // ── Clics parcials de WA ─────────────────────────────────────────────────

  test("5 · Clicar 1 slot WA → comptador mostra '1/5'", async ({ page }) => {
    await gotoStep1(page);
    await page.locator("[data-slot='0']").click();
    await expect(page.locator(".wizard-social-wa-progress")).toContainText("1/5");
  });

  test("6 · Clicar 3 slots WA → comptador mostra '3/5'", async ({ page }) => {
    await gotoStep1(page);
    await clickWaSlots(page, 3);
    await expect(page.locator(".wizard-social-wa-progress")).toContainText("3/5");
  });

  test("7 · Clicar slot WA → canvia a estat 'compartit'", async ({ page }) => {
    await gotoStep1(page);
    await page.locator("[data-slot='0']").click();
    await expect(page.locator("[data-slot='0']")).toHaveClass(/wizard-social-btn--done/);
    await expect(page.locator("[data-slot='0']")).toContainText("Contacte 1 compartit");
  });

  test("8 · 4 slots WA + IG → descompte NO activat (falta 1 WA)", async ({ page }) => {
    await gotoStep1(page);
    await clickWaSlots(page, 4); // falta 1
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
    await expect(page.getByText(/Descompte social del 5 % activat/i)).not.toBeVisible();
  });

  test("9 · 5 slots WA sense IG → descompte NO activat", async ({ page }) => {
    await gotoStep1(page);
    await clickWaSlots(page, REQUIRED_SHARES);
    // Sense clicar IG
    await expect(page.getByText(/Descompte social del 5 % activat/i)).not.toBeVisible();
    // Però sí apareix el missatge de 5 contactes notificats
    await expect(page.getByText(/5 contactes notificats/i)).toBeVisible();
  });

  test("10 · Clicar IG sense cap WA → descompte NO activat", async ({ page }) => {
    await gotoStep1(page);
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
    await expect(page.getByText(/Descompte social del 5 % activat/i)).not.toBeVisible();
  });

  // ── Flux complet — activa ────────────────────────────────────────────────

  test("11 · 5 slots WA + IG → descompte ACTIVAT", async ({ page }) => {
    await gotoStep1(page);
    await activateSocialDiscount(page);
  });

  test("12 · Quan actiu, tots els slots mostren check ✓", async ({ page }) => {
    await gotoStep1(page);
    await activateSocialDiscount(page);
    const slots = page.locator(".wizard-social-btn--slot");
    for (let i = 0; i < REQUIRED_SHARES; i++) {
      await expect(slots.nth(i)).toHaveClass(/wizard-social-btn--done/);
    }
  });

  test("13 · Quan actiu, comptador mostra '5/5 contactes'", async ({ page }) => {
    await gotoStep1(page);
    await clickWaSlots(page, REQUIRED_SHARES);
    await expect(page.locator(".wizard-social-wa-progress")).toContainText("5/5");
  });

  // ── Ordre invers (IG primer) ─────────────────────────────────────────────

  test("14 · IG primer, després 5 WA → descompte ACTIVAT", async ({ page }) => {
    await gotoStep1(page);
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
    await clickWaSlots(page, REQUIRED_SHARES);
    await expect(page.getByText(/Descompte social del 5 % activat/i)).toBeVisible();
  });

  // ── URL dels botons ──────────────────────────────────────────────────────

  test("15 · Tots els botons WA apunten a wa.me", async ({ page }) => {
    await gotoStep1(page);
    const slots = page.locator(".wizard-social-btn--slot");
    for (let i = 0; i < REQUIRED_SHARES; i++) {
      const href = await slots.nth(i).getAttribute("href");
      expect(href).toContain("wa.me");
      expect(href).toContain("3x3");
    }
  });

  test("16 · Botó IG apunta al perfil @cbgrupbarna", async ({ page }) => {
    await gotoStep1(page);
    const igLink = page.getByRole("link", { name: /Segueix @cbgrupbarna/i });
    const href = await igLink.getAttribute("href");
    expect(href).toContain("instagram.com/cbgrupbarna");
  });

  // ── Persistència al Step 2 ───────────────────────────────────────────────

  test("17 · Descompte social actiu → badge visible al Step 2", async ({ page }) => {
    await gotoStep1(page);
    await activateSocialDiscount(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.getByText("Dades de l'equip")).toBeVisible();
    await expect(page.locator(".wizard-active-badge--social")).toBeVisible();
  });

  test("18 · Descompte social actiu → preu reduït visible als paquets del Step 2", async ({ page }) => {
    await gotoStep1(page);
    await activateSocialDiscount(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.getByText("Dades de l'equip")).toBeVisible();
    await expect(page.locator(".wizard-pkg-price-old").first()).toBeVisible();
  });

  test("19 · Sense descompte social → NO hi ha preu ratllat als paquets", async ({ page }) => {
    await gotoStep1(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.getByText("Dades de l'equip")).toBeVisible();
    await expect(page.locator(".wizard-pkg-price-old").first()).not.toBeVisible();
  });

  // ── Persistència al Step 5 ───────────────────────────────────────────────

  test("20 · Descompte social reflectit al resum del Step 5", async ({ page }) => {
    await gotoStep1(page);
    await activateSocialDiscount(page);

    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.getByText("Dades de l'equip")).toBeVisible();

    await page.getByRole("button", { name: /Inscripció individual/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Femení");
    await page.getByLabel("Nom i cognoms *").first().fill("Anna García López");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 000 001");
    await page.getByLabel("Email *").first().fill("anna@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    await page.locator("#wizard-indiv-birth").fill("1995");
    await page.locator("#wizard-indiv-gender").selectOption("Femení");

    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();
    await page.getByRole("button", { name: /Continuar/i }).last().click();

    await expect(page.locator(".wizard-summary-row-discount", { hasText: /Social/i })).toBeVisible();
  });
});
