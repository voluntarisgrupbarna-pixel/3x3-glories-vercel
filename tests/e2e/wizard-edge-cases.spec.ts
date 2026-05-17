/**
 * Bateria de proves — Casos límit del wizard d'inscripció
 * Ruta: /inscripcion
 *
 * Cobreix: anys fora de rang, gènere incompatible, tutor formativa,
 * waFlow, errors de xarxa, matemàtica de descomptes, filtres de categoria,
 * clipboard (IBAN/concepte) i el flux complet formatiu.
 */

import { test, expect, Page } from "@playwright/test";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function mockApis(page: Page, failInscripcio = false) {
  await page.route("/api/inscripcio", (route) => {
    if (failInscripcio) {
      return route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "Internal error" }) });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, teamId: "T3X3-EDGE-001", playerIds: ["T3X3-EDGE-001-J01"] }),
    });
  });
  await page.route("/api/abandoned", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
  );
}

async function gotoWizard(page: Page, query = "", failInscripcio = false) {
  await page.addInitScript(() => {
    sessionStorage.setItem("queuePassed", "1");
    sessionStorage.setItem("exit_intent_shown", "1");
  });
  await mockApis(page, failInscripcio);
  await page.goto(`/inscripcion${query}`);
  await page.waitForSelector('.wizard[data-wizard-ready="true"]');
  await expect(page.getByText("Descomptes disponibles")).toBeVisible();
}

async function goToStep2(page: Page) {
  await page.getByRole("button", { name: /Continuar al formulari/i }).click();
  await expect(page.getByText(/Dades de l.equip/i)).toBeVisible();
}

async function fillCaptainIndividual(page: Page) {
  await page.getByLabel("Nom i cognoms *").first().fill("Test Individual");
  await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 111 222");
  await page.getByLabel("Email *").first().fill("test@test.com");
  await page.getByLabel("Talla samarreta *").first().selectOption("M");
  await page.locator("#wizard-indiv-birth").fill("1995");
  await page.locator("#wizard-indiv-gender").selectOption("Masculí");
}

async function fillCaptainTeam(page: Page) {
  await page.getByLabel("Nom i cognoms *").first().fill("Capità Test");
  await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 111 222");
  await page.getByLabel("Email *").first().fill("capit@test.com");
  await page.getByLabel("Talla samarreta *").first().selectOption("L");
}

async function goToStep4Team4(page: Page) {
  await gotoWizard(page);
  await goToStep2(page);
  await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
  await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
  await page.getByLabel("Nom de l'equip *").fill("Test Team");
  await fillCaptainTeam(page);
  await page.getByRole("button", { name: /Continuar al pagament/i }).click();
  await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();
  await page.getByRole("button", { name: /Continuar/i }).last().click();
  await expect(page.getByText(/Jugadors \(/)).toBeVisible();
}

// ── Tests ────────────────────────────────────────────────────────────────────

test.describe("Wizard — casos límit", () => {

  // ── Any de naixement fora de rang ────────────────────────────────────────

  test("1 · Step 4: any fora de rang → warning visible", async ({ page }) => {
    await goToStep4Team4(page);
    // Player 0 és l'únic obert per defecte
    const nameInput = page.locator("#wp0-name");
    if (!await nameInput.isVisible()) {
      await page.locator(".wizard-player-card").first().locator("button.wizard-player-head").click();
    }
    await page.locator("#wp0-name").fill("Jugador Test");
    await page.locator("#wp0-club").fill("CB Test");
    await page.locator("#wp0-birth").fill("2030"); // futur → fora de rang per Sènior [1960-2002]
    await page.locator("#wp0-gender").selectOption("Masculí");
    await page.locator("#wp0-shirt").selectOption("M");
    await expect(page.getByText(/Any fora del rang de la categoria/i)).toBeVisible();
  });

  test("2 · Step 4: any fora de rang → botó 'Revisar i enviar' desactivat", async ({ page }) => {
    await goToStep4Team4(page);
    const nameInput = page.locator("#wp0-name");
    if (!await nameInput.isVisible()) {
      await page.locator(".wizard-player-card").first().locator("button.wizard-player-head").click();
    }
    await page.locator("#wp0-name").fill("Jugador Test");
    await page.locator("#wp0-club").fill("CB Test");
    await page.locator("#wp0-birth").fill("2030");
    await page.locator("#wp0-gender").selectOption("Masculí");
    await page.locator("#wp0-shirt").selectOption("M");
    await expect(page.getByRole("button", { name: /Revisar i enviar/i })).toBeDisabled();
  });

  test("3 · Step 4: any dins rang → sense warning", async ({ page }) => {
    await goToStep4Team4(page);
    const nameInput = page.locator("#wp0-name");
    if (!await nameInput.isVisible()) {
      await page.locator(".wizard-player-card").first().locator("button.wizard-player-head").click();
    }
    await page.locator("#wp0-name").fill("Jugador Test");
    await page.locator("#wp0-club").fill("CB Test");
    await page.locator("#wp0-birth").fill("1995"); // dins rang Sènior
    await page.locator("#wp0-gender").selectOption("Masculí");
    await page.locator("#wp0-shirt").selectOption("M");
    await expect(page.getByText(/Any fora del rang de la categoria/i)).not.toBeVisible();
  });

  // ── Gènere incompatible ──────────────────────────────────────────────────

  test("4 · Step 4: gènere Femení a categoria Sènior Masculí → warning", async ({ page }) => {
    await goToStep4Team4(page); // categoria = Sènior Masculí
    const nameInput = page.locator("#wp0-name");
    if (!await nameInput.isVisible()) {
      await page.locator(".wizard-player-card").first().locator("button.wizard-player-head").click();
    }
    await page.locator("#wp0-name").fill("Jugadora Test");
    await page.locator("#wp0-club").fill("CB Test");
    await page.locator("#wp0-birth").fill("1995");
    await page.locator("#wp0-gender").selectOption("Femení");
    await page.locator("#wp0-shirt").selectOption("S");
    await expect(page.getByText(/El gènere del jugador\/a no coincideix/i)).toBeVisible();
  });

  test("5 · Step 4: gènere 'Altre' a qualsevol categoria → sense warning", async ({ page }) => {
    await goToStep4Team4(page);
    const nameInput = page.locator("#wp0-name");
    if (!await nameInput.isVisible()) {
      await page.locator(".wizard-player-card").first().locator("button.wizard-player-head").click();
    }
    await page.locator("#wp0-name").fill("Jugador Test");
    await page.locator("#wp0-club").fill("CB Test");
    await page.locator("#wp0-birth").fill("1995");
    await page.locator("#wp0-gender").selectOption("Altre");
    await page.locator("#wp0-shirt").selectOption("M");
    await expect(page.getByText(/El gènere del jugador\/a no coincideix/i)).not.toBeVisible();
  });

  // ── Filtres de categories per paquet ────────────────────────────────────

  test("6 · Paquet 'senior' → selector de categoria només mostra Sènior", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);
    await page.getByRole("button", { name: /Equip Sènior Pro/i }).first().click();
    const select = page.getByLabel("Categoria *");
    const options = await select.locator("option").allTextContents();
    const nonSenior = options.filter(o => o && !o.startsWith("Sènior") && o !== "Tria la categoria…");
    expect(nonSenior).toHaveLength(0);
  });

  test("7 · Paquet 'team-4' → categories Sènior NO disponibles", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);
    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    const select = page.getByLabel("Categoria *");
    const options = await select.locator("option").allTextContents();
    const seniorOptions = options.filter(o => o && o.startsWith("Sènior"));
    expect(seniorOptions).toHaveLength(0);
  });

  test("8 · Paquet 'individual' → totes les categories disponibles", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);
    await page.getByRole("button", { name: /Inscripció individual/i }).first().click();
    const select = page.getByLabel("Categoria *");
    const options = await select.locator("option").allTextContents();
    // Ha de tenir Sènior i categories formatives
    expect(options.some(o => o.startsWith("Sènior"))).toBe(true);
    expect(options.some(o => o.startsWith("Mini"))).toBe(true);
  });

  // ── Canvi de paquet reseteja la categoria si no és compatible ────────────

  test("9 · Seleccionar 'senior' → Sènior Masculí → canviar a 'team-4' → categoria buida", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);
    await page.getByRole("button", { name: /Equip Sènior Pro/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    // Ara canviar a team-4 (no admet Sènior)
    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    const catValue = await page.getByLabel("Categoria *").inputValue();
    expect(catValue).toBe(""); // categoria s'ha de resetejar
  });

  // ── Flux categoria formativa (Cadet + Tutor) ─────────────────────────────

  test("10 · Flux formativa Cadet: omple tutor → pot avançar", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Cadet Masculí");
    await page.getByLabel("Nom de l'equip *").fill("Cadets Test");

    // Capità (en formativa = tutor adult)
    await page.getByLabel("Nom i cognoms *").first().fill("Pare Test Adult");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 655 000 001");
    await page.getByLabel("Email *").first().fill("pare@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("L");

    // Capità menor (el bloc apareix automàticament)
    await expect(page.getByText("Capità/a de l'equip (menor)")).toBeVisible();
    // Els inputs del menor no tenen id — cerquem pels labels dins del segon bloc
    const tutorSection = page.locator(".wizard-grid-2").last();
    await tutorSection.getByLabel("Nom i cognoms *").fill("Marc Menor Cadet");
    await tutorSection.getByLabel("Telèfon *").fill("+34 600 555 001");
    await tutorSection.getByLabel("Email *").fill("marc@test.com");

    await expect(page.getByRole("button", { name: /Continuar al pagament/i })).toBeEnabled();
  });

  // ── waFlow — salta Step 3 ─────────────────────────────────────────────────

  test("11 · waFlow (?wa=1): de Step 2 va directament a Step 4", async ({ page }) => {
    await gotoWizard(page, "?wa=1");
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.getByText(/Dades de l.equip/i)).toBeVisible();

    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    await page.getByLabel("Nom de l'equip *").fill("WA Team");
    await fillCaptainTeam(page);

    await page.getByRole("button", { name: /Continuar al pagament/i }).click();

    // Ha de saltar el Step 3 (Fes la transferència) i anar directament al Step 4
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).not.toBeVisible();
    await expect(page.getByText(/Jugadors \(/)).toBeVisible();
  });

  // ── Error de xarxa al submit ─────────────────────────────────────────────

  test("12 · Error HTTP 500 al submit → missatge d'error visible", async ({ page }) => {
    await gotoWizard(page, "", true); // failInscripcio = true
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await expect(page.getByText(/Dades de l.equip/i)).toBeVisible();

    await page.getByRole("button", { name: /Inscripció individual/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Femení");
    await fillCaptainIndividual(page);

    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();
    await page.getByRole("button", { name: /Continuar/i }).last().click();

    await page.getByText(/Accepto la política de privadesa/).click();
    await page.getByText(/Autoritzo l.organització/).click();
    await page.getByRole("button", { name: /Enviar inscripció/i }).click();

    // Missatge d'error visible (conté "Error")
    await expect(page.getByText(/Error/i)).toBeVisible();
    // Botó torna a estar activat per reintentar
    await expect(page.getByRole("button", { name: /Enviar inscripció/i })).toBeEnabled();
  });

  // ── Matemàtica de descomptes ─────────────────────────────────────────────

  test("13 · Preu individual (20€) amb descompte social (−5%) = 19€", async ({ page }) => {
    await gotoWizard(page);
    // Activar social: WA + checkbox + IG
    await page.locator("[data-wa-share]").click();
    await page.locator("[data-wa-confirm] input[type='checkbox']").check();
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();

    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await page.getByRole("button", { name: /Inscripció individual/i }).first().click();

    // El preu final ha de ser 19€ (20 - 5% de 20 = 20 - 1 = 19)
    const finalPriceEl = page.locator(".wizard-pkg-price-final").first();
    await expect(finalPriceEl).toContainText("19");
  });

  test("14 · Rival codi vàlid aplicat: preu team-4 amb rival (−5€) visible", async ({ page }) => {
    await gotoWizard(page, "?ref=CBGB2026");
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();

    // Ha d'aparèixer el badge rival
    await expect(page.locator(".wizard-active-badge--rival")).toBeVisible();
  });

  // ── Clipboard (IBAN i concepte) ──────────────────────────────────────────

  test("15 · Copiar IBAN al clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();

    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    await page.getByLabel("Nom de l'equip *").fill("IBAN Team");
    await fillCaptainTeam(page);
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();

    // Clicar "Copiar" al costat de l'IBAN
    const ibanCopyBtns = page.locator(".wizard-copy-btn");
    await ibanCopyBtns.first().click();
    // Botó canvia a "✓ Copiat"
    await expect(page.getByText(/✓ Copiat/i).first()).toBeVisible();

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toMatch(/ES\d{22}/); // IBAN sense espais
  });

  test("16 · Copiar concepte de transferència al clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();

    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    await page.getByLabel("Nom de l'equip *").fill("Street Ballers");
    await fillCaptainTeam(page);
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();

    // El segon botó "Copiar" és el del concepte
    const copyBtns = page.locator(".wizard-copy-btn");
    await copyBtns.last().click();
    await expect(page.getByText(/✓ Copiat/i).last()).toBeVisible();

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain("STREET BALLERS");
    expect(clipboard).toContain("3X3");
  });

  // ── Validació telèfon (edge cases) ───────────────────────────────────────

  test("17 · Telèfon de 8 dígits (menys de 9) → botó Step 2 desactivat", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);
    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    await page.getByLabel("Nom de l'equip *").fill("Test");
    await page.getByLabel("Nom i cognoms *").first().fill("Test Person");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("12345678"); // 8 dígits
    await page.getByLabel("Email *").first().fill("test@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    await expect(page.getByRole("button", { name: /Continuar al pagament/i })).toBeDisabled();
  });

  test("18 · Telèfon de 9 dígits exactes → botó Step 2 activat", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);
    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    await page.getByLabel("Nom de l'equip *").fill("Test");
    await page.getByLabel("Nom i cognoms *").first().fill("Test Person");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("600111222"); // 9 dígits exactes
    await page.getByLabel("Email *").first().fill("test@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    await expect(page.getByRole("button", { name: /Continuar al pagament/i })).toBeEnabled();
  });

  // ── Any de naixement individual ──────────────────────────────────────────

  test("19 · Individual: any de naixement invàlid → botó Step 2 desactivat", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);
    await page.getByRole("button", { name: /Inscripció individual/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Masculí");
    await page.getByLabel("Nom i cognoms *").first().fill("Test");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 111 000");
    await page.getByLabel("Email *").first().fill("t@t.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    await page.locator("#wizard-indiv-birth").fill("1900"); // fora del rang vàlid [1950, any actual]
    await page.locator("#wizard-indiv-gender").selectOption("Masculí");
    await expect(page.getByRole("button", { name: /Continuar al pagament/i })).toBeDisabled();
  });

  // ── Avís falta justificant al Step 5 ────────────────────────────────────

  test("20 · Step 5 sense justificant: avís groc visible", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Continuar al formulari/i }).click();
    await page.getByRole("button", { name: /Inscripció individual/i }).first().click();
    await page.getByLabel("Categoria *").selectOption("Sènior Femení");
    await fillCaptainIndividual(page);
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await page.getByRole("button", { name: /Continuar/i }).last().click();

    // Avís de justificant pendent
    await expect(page.getByText(/No has adjuntat el justificant/i)).toBeVisible();
  });
});
