/**
 * Bateria de proves — Wizard en mòbil
 * Ruta: /inscripcion
 *
 * Cobreix: overflow, touch targets, social share, navegació pels steps,
 * acordió de jugadors, checkboxes de consent i pantalla d'èxit en mòbil.
 */

import { test, expect, Page } from "@playwright/test";

async function gotoWizard(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("queuePassed", "1");
    sessionStorage.setItem("exit_intent_shown", "1");
  });
  await page.route("/api/inscripcio", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, teamId: "T3X3-MOB-001", playerIds: ["T3X3-MOB-001-J01"] }),
    })
  );
  await page.route("/api/abandoned", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
  );
  await page.goto("/inscripcion");
  await page.waitForSelector('.wizard[data-wizard-ready="true"]');
  await expect(page.getByText("Descomptes disponibles")).toBeVisible();
}

function checkNoOverflow(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
}

test.describe("Wizard — mòbil", () => {

  // ── Step 1 — Descomptes ──────────────────────────────────────────────────

  test("1 · Step 1: zero overflow horitzontal", async ({ page }) => {
    await gotoWizard(page);
    const dims = await checkNoOverflow(page);
    expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth + 2);
  });

  test("2 · Step 1: els 5 slots WA i el botó IG visibles", async ({ page }) => {
    await gotoWizard(page);
    // Els 5 slots han d'estar al DOM
    await expect(page.locator(".wizard-social-btn--slot")).toHaveCount(5);
    await expect(page.getByRole("link", { name: /Segueix @cbgrupbarna/i })).toBeVisible();
  });

  test("3 · Step 1: primer botó WA (slot 0) touch target ≥ 44px (WCAG)", async ({ page }) => {
    await gotoWizard(page);
    const btn = page.locator("[data-slot='0']");
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("4 · Step 1: botó IG touch target ≥ 44px (WCAG)", async ({ page }) => {
    await gotoWizard(page);
    const btn = page.getByRole("link", { name: /Segueix @cbgrupbarna/i });
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("5 · Step 1: descompte social s'activa en mòbil (5 WA + IG)", async ({ page }) => {
    await gotoWizard(page);
    for (let i = 0; i < 5; i++) await page.locator(`[data-slot="${i}"]`).click();
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
    await expect(page.getByText(/Descompte social del 5 % activat/i)).toBeVisible();
  });

  test("6 · Step 1: stepper visible i mostra 'Descompte' com a actiu", async ({ page }) => {
    await gotoWizard(page);
    await expect(page.locator(".wizard-stepper")).toBeVisible();
    await expect(page.locator(".wizard-stepper-item--active")).toBeVisible();
  });

  test("7 · Step 1: botó 'Continuar' touch target ≥ 44px", async ({ page }) => {
    await gotoWizard(page);
    const btn = page.getByRole("button", { name: /Continuar al formulari/i });
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  // ── Step 2 — Dades equip ─────────────────────────────────────────────────

  test("8 · Step 2: zero overflow horitzontal", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.getByText(/Dades de l.equip/i)).toBeVisible();

    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");

    const dims = await checkNoOverflow(page);
    expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth + 2);
  });

  test("9 · Step 2: grid de paquets visible (no desborda)", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.locator(".wizard-pkg-grid")).toBeVisible();
    const dims = await checkNoOverflow(page);
    expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth + 2);
  });

  // ── Step 3 — Pagament ────────────────────────────────────────────────────

  test("10 · Step 3: input de fitxer visible i accessible", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();

    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    await page.getByLabel("Nom de l'equip *").fill("Mobile Team");
    await page.getByLabel("Nom i cognoms *").first().fill("Capità Mòbil");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 222 333");
    await page.getByLabel("Email *").first().fill("mob@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();

    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();

    const dims = await checkNoOverflow(page);
    expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth + 2);
  });

  // ── Step 4 — Jugadors ────────────────────────────────────────────────────

  test("11 · Step 4: acordió jugadors obre i tanca en mòbil", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();

    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    await page.getByLabel("Nom de l'equip *").fill("Mobile Team");
    await page.getByLabel("Nom i cognoms *").first().fill("Capità Mòbil");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 222 333");
    await page.getByLabel("Email *").first().fill("mob@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await page.getByRole("button", { name: /Continuar/i }).last().click();

    await expect(page.getByText(/Jugadors \(/)).toBeVisible();

    // El primer jugador ha d'estar obert per defecte
    await expect(page.locator("#wp0-name")).toBeVisible();

    // Tancar el primer jugador
    await page.locator(".wizard-player-card").first().locator("button.wizard-player-head").click();
    await expect(page.locator("#wp0-name")).not.toBeVisible();

    // Tornar a obrir
    await page.locator(".wizard-player-card").first().locator("button.wizard-player-head").click();
    await expect(page.locator("#wp0-name")).toBeVisible();
  });

  test("12 · Step 4: zero overflow horitzontal", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();

    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    await page.getByLabel("Nom de l'equip *").fill("Mobile Team");
    await page.getByLabel("Nom i cognoms *").first().fill("Capità Mòbil");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 222 333");
    await page.getByLabel("Email *").first().fill("mob@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await page.getByRole("button", { name: /Continuar/i }).last().click();
    await expect(page.getByText(/Jugadors \(/)).toBeVisible();

    const dims = await checkNoOverflow(page);
    expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth + 2);
  });

  // ── Step 5 — Confirmació ─────────────────────────────────────────────────

  test("13 · Step 5: checkboxes consent visibles i clicables en mòbil", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();

    await page.getByRole("button", { name: /Inscripció individual/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Femení");
    await page.getByLabel("Nom i cognoms *").first().fill("Ana Mòbil");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 333 444");
    await page.getByLabel("Email *").first().fill("ana@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("S");
    await page.locator("#wizard-indiv-birth").fill("1995");
    await page.locator("#wizard-indiv-gender").selectOption("Femení");
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await page.getByRole("button", { name: /Continuar/i }).last().click();

    await expect(page.getByText("Revisa i envia")).toBeVisible();

    const rgpdLabel = page.getByText(/Accepto la política de privadesa/);
    const imgLabel = page.getByText(/Autoritzo l.organització/);
    await expect(rgpdLabel).toBeVisible();
    await expect(imgLabel).toBeVisible();

    await rgpdLabel.click();
    await imgLabel.click();
    await expect(page.getByRole("button", { name: /Enviar inscripció/i })).toBeEnabled();

    const dims = await checkNoOverflow(page);
    expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth + 2);
  });

  // ── Pantalla d'èxit ──────────────────────────────────────────────────────

  test("14 · Pantalla d'èxit: QR visible en mòbil", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();

    await page.getByRole("button", { name: /Inscripció individual/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Femení");
    await page.getByLabel("Nom i cognoms *").first().fill("Ana Mòbil");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 333 444");
    await page.getByLabel("Email *").first().fill("ana@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("S");
    await page.locator("#wizard-indiv-birth").fill("1995");
    await page.locator("#wizard-indiv-gender").selectOption("Femení");
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await page.getByRole("button", { name: /Continuar/i }).last().click();
    await page.getByText(/Accepto la política de privadesa/).click();
    await page.getByText(/Autoritzo l.organització/).click();
    await page.getByRole("button", { name: /Enviar inscripció/i }).click();

    await expect(page.getByText("Inscripció enviada!")).toBeVisible();
    await expect(page.locator(".wizard-success-qr img")).toBeVisible();
    await expect(page.locator(".wizard-success-code")).toContainText("T3X3-MOB-001");
  });

  test("15 · Pantalla d'èxit: zero overflow horitzontal", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await page.getByRole("button", { name: /Inscripció individual/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    await page.getByLabel("Nom i cognoms *").first().fill("Test Mob");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 444 555");
    await page.getByLabel("Email *").first().fill("mob2@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    await page.locator("#wizard-indiv-birth").fill("1990");
    await page.locator("#wizard-indiv-gender").selectOption("Masculí");
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await page.getByRole("button", { name: /Continuar/i }).last().click();
    await page.getByText(/Accepto la política de privadesa/).click();
    await page.getByText(/Autoritzo l.organització/).click();
    await page.getByRole("button", { name: /Enviar inscripció/i }).click();
    await expect(page.getByText("Inscripció enviada!")).toBeVisible();

    const dims = await checkNoOverflow(page);
    expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth + 2);
  });
});
