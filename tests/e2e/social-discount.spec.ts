/**
 * Bateria de proves — SocialDiscountBlock (1 botó WA + checkbox confirmació + IG)
 * Ruta: /inscripcion (Step 1)
 *
 * Flux: clicar WA → WhatsApp s'obre → tornar → marcar checkbox "He compartit amb 5 amics"
 *       + clicar IG → descompte -5% activat.
 */

import { test, expect, Page } from "@playwright/test";

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

/** Activa el descompte social complet: WA + checkbox + IG */
async function activateSocialDiscount(page: Page) {
  await page.locator("[data-wa-share]").click();
  await page.locator("[data-wa-confirm] input[type='checkbox']").check();
  await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
  await expect(page.getByText(/Descompte social del 5 % activat/i)).toBeVisible();
}

test.describe("SocialDiscountBlock — WA + confirmació + IG", () => {

  // ── Estat inicial ────────────────────────────────────────────────────────

  test("1 · Bloc social visible a l'Step 1", async ({ page }) => {
    await gotoStep1(page);
    await expect(page.getByText(/Descompte social/i)).toBeVisible();
    await expect(page.getByText(/−5 %/)).toBeVisible();
  });

  test("2 · Un sol botó WA visible (sense checkbox inicial)", async ({ page }) => {
    await gotoStep1(page);
    await expect(page.locator("[data-wa-share]")).toBeVisible();
    await expect(page.locator("[data-wa-confirm]")).not.toBeVisible();
  });

  test("3 · Sense cap clic → cap descompte activat", async ({ page }) => {
    await gotoStep1(page);
    await expect(page.getByText(/Descompte social del 5 % activat/i)).not.toBeVisible();
  });

  // ── Clicar WA mostra el checkbox ─────────────────────────────────────────

  test("4 · Clicar WA → checkbox de confirmació apareix", async ({ page }) => {
    await gotoStep1(page);
    await page.locator("[data-wa-share]").click();
    await expect(page.locator("[data-wa-confirm]")).toBeVisible();
  });

  test("5 · Clicar WA → botó canvia a 'WhatsApp obert'", async ({ page }) => {
    await gotoStep1(page);
    await page.locator("[data-wa-share]").click();
    await expect(page.locator("[data-wa-share]")).toContainText(/WhatsApp obert/i);
  });

  test("6 · Botó WA apunta a wa.me amb text del torneig", async ({ page }) => {
    await gotoStep1(page);
    const href = await page.locator("[data-wa-share]").getAttribute("href");
    expect(href).toContain("wa.me");
    expect(href).toContain("3x3");
    expect(href).toContain("inscripcion");
  });

  // ── Clics parcials — no activen el descompte ─────────────────────────────

  test("7 · Clicar WA + marcar checkbox, sense IG → descompte NO activat", async ({ page }) => {
    await gotoStep1(page);
    await page.locator("[data-wa-share]").click();
    await page.locator("[data-wa-confirm] input[type='checkbox']").check();
    await expect(page.getByText(/Descompte social del 5 % activat/i)).not.toBeVisible();
  });

  test("8 · Clicar IG sense WA → descompte NO activat", async ({ page }) => {
    await gotoStep1(page);
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
    await expect(page.getByText(/Descompte social del 5 % activat/i)).not.toBeVisible();
  });

  test("9 · Clicar WA sense marcar checkbox + IG → descompte NO activat", async ({ page }) => {
    await gotoStep1(page);
    await page.locator("[data-wa-share]").click();
    // No marquem el checkbox
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
    await expect(page.getByText(/Descompte social del 5 % activat/i)).not.toBeVisible();
  });

  // ── Flux complet — activa ────────────────────────────────────────────────

  test("10 · WA + checkbox + IG → descompte ACTIVAT", async ({ page }) => {
    await gotoStep1(page);
    await activateSocialDiscount(page);
  });

  test("11 · Ordre invers: IG primer, WA + checkbox → descompte ACTIVAT", async ({ page }) => {
    await gotoStep1(page);
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
    await page.locator("[data-wa-share]").click();
    await page.locator("[data-wa-confirm] input[type='checkbox']").check();
    await expect(page.getByText(/Descompte social del 5 % activat/i)).toBeVisible();
  });

  // ── Desmarcar el checkbox elimina el descompte ───────────────────────────

  test("12 · Desmarcar checkbox → descompte es desactiva", async ({ page }) => {
    await gotoStep1(page);
    await activateSocialDiscount(page);
    // Desmarcar
    await page.locator("[data-wa-confirm] input[type='checkbox']").uncheck();
    await expect(page.getByText(/Descompte social del 5 % activat/i)).not.toBeVisible();
  });

  // ── Botó Instagram ───────────────────────────────────────────────────────

  test("13 · Botó IG apunta a instagram.com/cbgrupbarna", async ({ page }) => {
    await gotoStep1(page);
    const href = await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).getAttribute("href");
    expect(href).toContain("instagram.com/cbgrupbarna");
  });

  test("14 · Botó IG canvia a 'Instagram obert' après clic", async ({ page }) => {
    await gotoStep1(page);
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
    await expect(page.getByText(/📸 Instagram obert/i)).toBeVisible();
  });

  // ── Persistència al Step 2 ───────────────────────────────────────────────

  test("15 · Descompte actiu → badge Social visible al Step 2", async ({ page }) => {
    await gotoStep1(page);
    await activateSocialDiscount(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.getByText("Dades de l'equip")).toBeVisible();
    await expect(page.locator(".wizard-active-badge--social")).toBeVisible();
  });

  test("16 · Descompte actiu → preu ratllat visible als paquets", async ({ page }) => {
    await gotoStep1(page);
    await activateSocialDiscount(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.locator(".wizard-pkg-price-old").first()).toBeVisible();
  });

  test("17 · Sense descompte → sense preu ratllat als paquets", async ({ page }) => {
    await gotoStep1(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.locator(".wizard-pkg-price-old").first()).not.toBeVisible();
  });

  // ── Persistència al Step 5 ───────────────────────────────────────────────

  test("18 · Descompte social reflectit al resum del Step 5", async ({ page }) => {
    await gotoStep1(page);
    await activateSocialDiscount(page);

    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await page.getByRole("button", { name: /Inscripció individual/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Femení");
    await page.getByLabel("Nom i cognoms *").first().fill("Anna García López");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 000 001");
    await page.getByLabel("Email *").first().fill("anna@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    await page.locator("#wizard-indiv-birth").fill("1995");
    await page.locator("#wizard-indiv-gender").selectOption("Femení");

    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await page.getByRole("button", { name: /Continuar/i }).last().click();

    await expect(page.locator(".wizard-summary-row-discount", { hasText: /Social/i })).toBeVisible();
  });

  // ── Touch targets mòbil ───────────────────────────────────────────────────

  test("19 · Botó WA touch target ≥ 44px (WCAG)", async ({ page }) => {
    await gotoStep1(page);
    const box = await page.locator("[data-wa-share]").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("20 · Botó IG touch target ≥ 44px (WCAG)", async ({ page }) => {
    await gotoStep1(page);
    const box = await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});
