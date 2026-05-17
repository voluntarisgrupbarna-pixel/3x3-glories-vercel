/**
 * Bateria de proves — Wizard en tablet (iPad Pro 11, 1024px)
 * Ruta: /inscripcion
 *
 * Cobreix: happy path complet, overflow, layout 2 columnes, grid de paquets,
 * acordió de jugadors i descompte social en tablet.
 */

import { test, expect, Page } from "@playwright/test";

async function gotoWizard(page: Page, query = "") {
  await page.addInitScript(() => {
    sessionStorage.setItem("queuePassed", "1");
    sessionStorage.setItem("exit_intent_shown", "1");
  });
  await page.route("/api/inscripcio", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, teamId: "T3X3-TAB-001", playerIds: ["T3X3-TAB-001-J01", "T3X3-TAB-001-J02", "T3X3-TAB-001-J03"] }),
    })
  );
  await page.route("/api/abandoned", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
  );
  await page.goto(`/inscripcion${query}`);
  await page.waitForSelector('.wizard[data-wizard-ready="true"]');
  await expect(page.getByText("Descomptes disponibles")).toBeVisible();
}

function checkNoOverflow(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
}

async function fillPlayer(page: Page, idx: number, year = "2000") {
  const nameInput = page.locator(`#wp${idx}-name`);
  if (!await nameInput.isVisible()) {
    await page.locator(".wizard-player-card").nth(idx).locator("button.wizard-player-head").click();
    await expect(nameInput).toBeVisible();
  }
  await nameInput.fill(`Jugador Tablet ${idx + 1}`);
  await page.locator(`#wp${idx}-club`).fill("CB Grup Barna");
  await page.locator(`#wp${idx}-birth`).fill(year);
  await page.locator(`#wp${idx}-gender`).selectOption("Masculí");
  await page.locator(`#wp${idx}-shirt`).selectOption("M");
}

test.describe("Wizard — tablet (iPad)", () => {

  // ── Overflow i layout ────────────────────────────────────────────────────

  test("1 · Step 1: zero overflow horitzontal en tablet", async ({ page }) => {
    await gotoWizard(page);
    const dims = await checkNoOverflow(page);
    expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth + 2);
  });

  test("2 · Step 1: tots els blocs de descompte visibles", async ({ page }) => {
    await gotoWizard(page);
    await expect(page.getByText("Early Bird")).toBeVisible();
    await expect(page.getByText(/Descompte social/i)).toBeVisible();
  });

  test("3 · Step 2: zero overflow horitzontal", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.getByText(/Dades de l.equip/i)).toBeVisible();

    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");

    const dims = await checkNoOverflow(page);
    expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth + 2);
  });

  test("4 · Step 2: grid 2 columnes visible (capità fields)", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    // El grid .wizard-grid-2 ha d'existir i ser visible
    await expect(page.locator(".wizard-grid-2").first()).toBeVisible();
  });

  test("5 · Step 2: els 4 paquets visibles sense scroll horitzontal", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.locator(".wizard-pkg-grid")).toBeVisible();
    // Els 4 botons de paquet han d'estar visibles
    await expect(page.locator(".wizard-pkg-card")).toHaveCount(4);
    const dims = await checkNoOverflow(page);
    expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth + 2);
  });

  // ── Descompte social en tablet ───────────────────────────────────────────

  test("6 · Descompte social s'activa en tablet (WA + checkbox + IG)", async ({ page }) => {
    await gotoWizard(page);
    await page.locator("[data-wa-share]").click();
    await page.locator("[data-wa-confirm] input[type='checkbox']").check();
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
    await expect(page.getByText(/Descompte social del 5 % activat/i)).toBeVisible();
  });

  test("7 · Descompte social persistent a Step 2 en tablet", async ({ page }) => {
    await gotoWizard(page);
    await page.locator("[data-wa-share]").click();
    await page.locator("[data-wa-confirm] input[type='checkbox']").check();
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.locator(".wizard-active-badge--social")).toBeVisible();
  });

  // ── Happy path complet en tablet ─────────────────────────────────────────

  test("8 · Happy path: equip 4 jugadors — flux complet fins a pantalla d'èxit", async ({ page }) => {
    await gotoWizard(page);

    // Step 1
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.getByText(/Dades de l.equip/i)).toBeVisible();

    // Step 2 — equip
    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    await page.getByLabel("Nom de l'equip *").fill("Tablet Warriors");
    await page.getByLabel("Nom i cognoms *").first().fill("Capità Tablet");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 777 888");
    await page.getByLabel("Email *").first().fill("tablet@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("L");
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();

    // Step 3 — pagament
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();
    const dims3 = await checkNoOverflow(page);
    expect(dims3.scrollWidth).toBeLessThanOrEqual(dims3.clientWidth + 2);
    await page.getByRole("button", { name: /Continuar/i }).last().click();

    // Step 4 — jugadors
    await expect(page.getByText(/Jugadors \(/)).toBeVisible();
    for (let i = 0; i < 3; i++) await fillPlayer(page, i, "1995");

    const dims4 = await checkNoOverflow(page);
    expect(dims4.scrollWidth).toBeLessThanOrEqual(dims4.clientWidth + 2);
    await page.getByRole("button", { name: /Revisar i enviar/i }).click();

    // Step 5 — confirmació
    await expect(page.getByText("Revisa i envia")).toBeVisible();
    await page.getByText(/Accepto la política de privadesa/).click();
    await page.getByText(/Autoritzo l.organització/).click();
    await page.getByRole("button", { name: /Enviar inscripció/i }).click();

    // Pantalla d'èxit
    await expect(page.getByText("Inscripció enviada!")).toBeVisible();
    await expect(page.locator(".wizard-success-code")).toContainText("T3X3-TAB-001");
    await expect(page.locator(".wizard-success-qr img")).toBeVisible();

    const dimsSuccess = await checkNoOverflow(page);
    expect(dimsSuccess.scrollWidth).toBeLessThanOrEqual(dimsSuccess.clientWidth + 2);
  });

  // ── Acordió jugadors en tablet ───────────────────────────────────────────

  test("9 · Step 4: acordió jugadors funciona en tablet", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();

    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    await page.getByLabel("Nom de l'equip *").fill("Tablet Test");
    await page.getByLabel("Nom i cognoms *").first().fill("Capità Tab");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 888 999");
    await page.getByLabel("Email *").first().fill("tab@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await page.getByRole("button", { name: /Continuar/i }).last().click();
    await expect(page.getByText(/Jugadors \(/)).toBeVisible();

    // El primer jugador obert → tancar → obrir
    await expect(page.locator("#wp0-name")).toBeVisible();
    await page.locator(".wizard-player-card").first().locator("button.wizard-player-head").click();
    await expect(page.locator("#wp0-name")).not.toBeVisible();
    await page.locator(".wizard-player-card").first().locator("button.wizard-player-head").click();
    await expect(page.locator("#wp0-name")).toBeVisible();
  });

  // ── Stepper en tablet ─────────────────────────────────────────────────────

  test("10 · Stepper visible i correcte a cada step en tablet", async ({ page }) => {
    await gotoWizard(page);
    await expect(page.locator(".wizard-stepper")).toBeVisible();

    // Step 1 actiu
    const activeItems = page.locator(".wizard-stepper-item--active");
    await expect(activeItems).toHaveCount(1);

    // Avançar a Step 2
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.locator(".wizard-stepper-item--done")).toHaveCount(1); // Step 1 = done
  });

  // ── URL ?ref=XXXX en tablet ──────────────────────────────────────────────

  test("11 · URL ?ref= pre-omple el codi rival en tablet", async ({ page }) => {
    await gotoWizard(page, "?ref=TABLET2026");
    await expect(page.getByPlaceholder("RIVAL-XXXXXX")).toHaveValue("RIVAL-TABLET2026");
  });
});
