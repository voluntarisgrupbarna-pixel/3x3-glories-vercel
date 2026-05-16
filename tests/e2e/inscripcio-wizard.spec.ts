/**
 * Bateria de proves — InscripcioWizard (5 passos)
 * Ruta: /inscripcion
 *
 * Les crides a /api/inscripcio i /api/abandoned es mocken per evitar
 * enviar dades reals a Apps Script / Google Sheets.
 */

import { test, expect, Page } from "@playwright/test";

// ── Helpers ─────────────────────────────────────────────────────────────────

async function mockApis(page: Page) {
  await page.route("/api/inscripcio", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        teamId: "T3X3-2026-TST01",
        playerIds: ["T3X3-2026-TST01-J01", "T3X3-2026-TST01-J02"],
      }),
    })
  );
  await page.route("/api/abandoned", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
  );
}

async function gotoWizard(page: Page, query = "") {
  // El QueueGate mostra una cua falsa de ~11s. La saltem via sessionStorage
  // (el component ja fa: if (sessionStorage.getItem("queuePassed") === "1") setPhase("form"))
  await page.addInitScript(() => {
    sessionStorage.setItem("queuePassed", "1");
    sessionStorage.setItem("exit_intent_shown", "1"); // evita el modal d'exit-intent durant les proves
  });
  await mockApis(page);
  await page.goto(`/inscripcion${query}`);
  // Espera que React hagi hidritat el wizard (data-wizard-ready s'afegeix al primer useEffect,
  // garantint que tots els event handlers —inclòs onClick del botó— estan registrats)
  await page.waitForSelector('.wizard[data-wizard-ready="true"]');
  await expect(page.getByText("Descomptes disponibles")).toBeVisible();
}

/** Avança del Step 1 al Step 2 sense descomptes addicionals */
async function goToStep2(page: Page) {
  await page.getByRole("button", { name: /Continuar al formulari/i }).click();
  await expect(page.getByText("Dades de l'equip")).toBeVisible();
}

/** Omple el capità (sense talla — l'afegim manualment als tests que cal) */
async function fillCaptain(page: Page, opts?: { shirtSize?: boolean }) {
  await page.getByLabel("Nom i cognoms *").first().fill("Anna García López");
  await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600 000 001");
  await page.getByLabel("Email *").first().fill("anna@test.com");
  if (opts?.shirtSize !== false) {
    // La talla és obligatòria al capità
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
  }
}

/** Selecciona un paquet i una categoria no-formativa (Sènior Masculí) */
async function selectPackageAndCategory(
  page: Page,
  pkgName: string,
  category = "Sènior Masculí"
) {
  await page.getByRole("button", { name: new RegExp(pkgName, "i") }).first().click();
  await page.getByLabel("Categoria *").selectOption(category);
}

/** Omple un jugador pel seu índex (0-based) amb dades mínimes (usa IDs únics).
 *  Les targetes de jugador són un acordió — s'obre la que cal si és tancada. */
async function fillPlayer(page: Page, idx: number, year = "2000") {
  // Obre l'acordió si la targeta és tancada (els inputs no existeixen en DOM quan és tancada)
  const nameInput = page.locator(`#wp${idx}-name`);
  if (!await nameInput.isVisible()) {
    await page.locator(".wizard-player-card").nth(idx).locator("button.wizard-player-head").click();
    await expect(nameInput).toBeVisible();
  }
  await nameInput.fill(`Jugador Test ${idx + 1}`);
  await page.locator(`#wp${idx}-club`).fill("CB Grup Barna");
  await page.locator(`#wp${idx}-cat`).selectOption("Sènior Masculí");
  await page.locator(`#wp${idx}-birth`).fill(year);
  await page.locator(`#wp${idx}-gender`).selectOption("Masculí");
  await page.locator(`#wp${idx}-shirt`).selectOption("M");
}

// ── Grup principal ──────────────────────────────────────────────────────────

test.describe("InscripcioWizard", () => {

  // ── Navegació / Happy paths ──────────────────────────────────────────────

  test("1 · Individual — flux complet fins a pantalla d'èxit", async ({ page }) => {
    await gotoWizard(page);

    // Step 1 → Step 2
    await goToStep2(page);

    // Seleccionar paquet individual + categoria
    await selectPackageAndCategory(page, "Inscripció individual");
    await fillCaptain(page);

    // El botó "Talla samarreta" del capità ha d'estar omplert
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();

    // Step 3 → saltem (justificant opcional)
    await page.getByRole("button", { name: /Continuar/i }).last().click();

    // Com és "individual", ha de saltar directament a Step 5 (sense Step 4)
    await expect(page.getByText("Revisa i envia")).toBeVisible();

    // Consentiments + enviar
    await page.getByText(/Accepto la política de privadesa/).click();
    await page.getByText(/Autoritzo l'organització/).click();
    await page.getByRole("button", { name: /Enviar inscripció/i }).click();

    // Pantalla d'èxit
    await expect(page.getByText("Inscripció enviada!")).toBeVisible();
    await expect(page.getByText("T3X3-2026-TST01", { exact: true })).toBeVisible();
  });

  test("2 · Equip 4 jugadors — flux complet fins a pantalla d'èxit", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    await selectPackageAndCategory(page, "Equip 4 jugadors");
    await page.getByLabel("Nom de l'equip *").fill("Street Ballers BCN");
    await fillCaptain(page);
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();

    // Step 3 → Step 4
    await page.getByRole("button", { name: /Continuar/i }).last().click();
    await expect(page.getByText(/Jugadors \(/)).toBeVisible();

    // Omple els 3 jugadors mínims
    for (let i = 0; i < 3; i++) await fillPlayer(page, i);

    await page.getByRole("button", { name: /Revisar i enviar/i }).click();
    await expect(page.getByText("Revisa i envia")).toBeVisible();

    await page.getByText(/Accepto la política de privadesa/).click();
    await page.getByText(/Autoritzo l'organització/).click();
    await page.getByRole("button", { name: /Enviar inscripció/i }).click();

    await expect(page.getByText("Inscripció enviada!")).toBeVisible();
  });

  test("3 · Equip Sènior Pro — flux complet", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    await selectPackageAndCategory(page, "Equip Sènior Pro", "Sènior Masculí");
    await page.getByLabel("Nom de l'equip *").fill("Barna Warriors");
    await fillCaptain(page);
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();
    await page.getByRole("button", { name: /Continuar/i }).last().click();

    for (let i = 0; i < 3; i++) await fillPlayer(page, i);

    await page.getByRole("button", { name: /Revisar i enviar/i }).click();
    await page.getByText(/Accepto la política de privadesa/).click();
    await page.getByText(/Autoritzo l'organització/).click();
    await page.getByRole("button", { name: /Enviar inscripció/i }).click();

    await expect(page.getByText("Inscripció enviada!")).toBeVisible();
  });

  test("4 · Categoria formativa → apareix bloc Tutor/a", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    await selectPackageAndCategory(page, "Equip 4 jugadors", "Cadet Masculí (2010-2011)");
    // El títol del camp capità canvia a "Tutor/a"
    await expect(page.getByText("Tutor/a (responsable adult)")).toBeVisible();
    // I apareix un bloc per al capità menor
    await expect(page.getByText("Capità/a de l'equip (menor)")).toBeVisible();
  });

  test("5 · Individual salta Step 4 (jugadors)", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    await selectPackageAndCategory(page, "Inscripció individual");
    await fillCaptain(page);
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    // Step 3
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();
    await page.getByRole("button", { name: /Continuar/i }).last().click();
    // Ha de saltar a Step 5 directament
    await expect(page.getByText("Revisa i envia")).toBeVisible();
    await expect(page.getByText(/Jugadors \(/)).not.toBeVisible();
  });

  // ── Validació Step 2 ─────────────────────────────────────────────────────

  test("6 · Step 2: botó desactivat sense paquet seleccionat", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    // Sense cap paquet seleccionat → botó desactivat
    await expect(page.getByRole("button", { name: /Continuar al pagament/i })).toBeDisabled();
  });

  test("7 · Step 2: botó desactivat sense categoria", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    await page.getByRole("button", { name: /Equip 4 jugadors/i }).first().click();
    // Sense categoria → desactivat
    await expect(page.getByRole("button", { name: /Continuar al pagament/i })).toBeDisabled();
  });

  test("8 · Step 2: botó desactivat sense nom del capità", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    await selectPackageAndCategory(page, "Equip 4 jugadors");
    await page.getByLabel("Nom de l'equip *").fill("Test Team");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600000001");
    await page.getByLabel("Email *").first().fill("test@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    // Nom capità buit → desactivat
    await expect(page.getByRole("button", { name: /Continuar al pagament/i })).toBeDisabled();
  });

  test("9 · Step 2: botó desactivat sense telèfon del capità", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    await selectPackageAndCategory(page, "Equip 4 jugadors");
    await page.getByLabel("Nom de l'equip *").fill("Test Team");
    await page.getByLabel("Nom i cognoms *").first().fill("Anna García");
    await page.getByLabel("Email *").first().fill("test@test.com");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    // Telèfon buit → desactivat
    await expect(page.getByRole("button", { name: /Continuar al pagament/i })).toBeDisabled();
  });

  test("10 · Step 2: botó desactivat sense email del capità", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    await selectPackageAndCategory(page, "Equip 4 jugadors");
    await page.getByLabel("Nom de l'equip *").fill("Test Team");
    await page.getByLabel("Nom i cognoms *").first().fill("Anna García");
    await page.getByLabel(/Telèfon \(WhatsApp\)/i).first().fill("+34 600000001");
    await page.getByLabel("Talla samarreta *").first().selectOption("M");
    // Email buit → desactivat
    await expect(page.getByRole("button", { name: /Continuar al pagament/i })).toBeDisabled();
  });

  test("11 · Step 2: botó desactivat sense nom d'equip (paquet equip)", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    await selectPackageAndCategory(page, "Equip 4 jugadors");
    // Nom d'equip buit
    await fillCaptain(page);
    await expect(page.getByRole("button", { name: /Continuar al pagament/i })).toBeDisabled();
  });

  test("12 · Step 2: botó desactivat si categoria formativa i falta tutor", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    await selectPackageAndCategory(page, "Equip 4 jugadors", "Mini Masculí (2014-2015)");
    await page.getByLabel("Nom de l'equip *").fill("Mini Stars");
    await fillCaptain(page);
    // Falta nom+telèfon del tutor → desactivat
    await expect(page.getByRole("button", { name: /Continuar al pagament/i })).toBeDisabled();
  });

  test("13 · Step 2: botó activat quan tots els camps obligatoris omplerts", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);

    await selectPackageAndCategory(page, "Equip 4 jugadors");
    await page.getByLabel("Nom de l'equip *").fill("Street Ballers");
    await fillCaptain(page);
    await expect(page.getByRole("button", { name: /Continuar al pagament/i })).toBeEnabled();
  });

  // ── Validació Step 4 ─────────────────────────────────────────────────────

  async function goToStep4(page: Page) {
    await gotoWizard(page);
    await goToStep2(page);
    await selectPackageAndCategory(page, "Equip 4 jugadors");
    await page.getByLabel("Nom de l'equip *").fill("Test Team");
    await fillCaptain(page);
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();
    await page.getByRole("button", { name: /Continuar/i }).last().click();
    await expect(page.getByText(/Jugadors \(/)).toBeVisible();
  }

  test("14 · Step 4: botó desactivat si falta nom d'un jugador", async ({ page }) => {
    await goToStep4(page);
    // Player 0: tot omplert menys el nom (usa IDs únics)
    await page.locator("#wp0-club").fill("CB Grup Barna");
    await page.locator("#wp0-cat").selectOption("Sènior Masculí");
    await page.locator("#wp0-birth").fill("2000");
    await page.locator("#wp0-gender").selectOption("Masculí");
    await page.locator("#wp0-shirt").selectOption("M");
    for (let i = 1; i < 3; i++) await fillPlayer(page, i);
    await expect(page.getByRole("button", { name: /Revisar i enviar/i })).toBeDisabled();
  });

  test("15 · Step 4: botó desactivat si falta any de naixement", async ({ page }) => {
    await goToStep4(page);
    // Player 0: tot omplert menys l'any
    await page.locator("#wp0-name").fill("Jugador Test 1");
    await page.locator("#wp0-club").fill("CB Grup Barna");
    await page.locator("#wp0-cat").selectOption("Sènior Masculí");
    await page.locator("#wp0-gender").selectOption("Masculí");
    await page.locator("#wp0-shirt").selectOption("M");
    for (let i = 1; i < 3; i++) await fillPlayer(page, i);
    await expect(page.getByRole("button", { name: /Revisar i enviar/i })).toBeDisabled();
  });

  test("16 · Step 4: botó desactivat si falta gènere", async ({ page }) => {
    await goToStep4(page);
    // Player 0: tot omplert menys el gènere
    await page.locator("#wp0-name").fill("Jugador Test 1");
    await page.locator("#wp0-club").fill("CB Grup Barna");
    await page.locator("#wp0-cat").selectOption("Sènior Masculí");
    await page.locator("#wp0-birth").fill("2000");
    await page.locator("#wp0-shirt").selectOption("M");
    for (let i = 1; i < 3; i++) await fillPlayer(page, i);
    await expect(page.getByRole("button", { name: /Revisar i enviar/i })).toBeDisabled();
  });

  test("17 · Step 4: botó desactivat si falta club", async ({ page }) => {
    await goToStep4(page);
    // Player 0: tot omplert menys el club
    await page.locator("#wp0-name").fill("Jugador Test 1");
    await page.locator("#wp0-cat").selectOption("Sènior Masculí");
    await page.locator("#wp0-birth").fill("2000");
    await page.locator("#wp0-gender").selectOption("Masculí");
    await page.locator("#wp0-shirt").selectOption("M");
    for (let i = 1; i < 3; i++) await fillPlayer(page, i);
    await expect(page.getByRole("button", { name: /Revisar i enviar/i })).toBeDisabled();
  });

  test("18 · Step 4: botó activat quan tots els jugadors complerts", async ({ page }) => {
    await goToStep4(page);
    for (let i = 0; i < 3; i++) await fillPlayer(page, i);
    await expect(page.getByRole("button", { name: /Revisar i enviar/i })).toBeEnabled();
  });

  test("19 · Step 4: botó 'Eliminar' ocult quan jugadors = minPlayers (3)", async ({ page }) => {
    await goToStep4(page);
    // minPlayers per team-4 = 3 → no hi ha botó Eliminar
    await expect(page.getByRole("button", { name: /Eliminar/i })).not.toBeVisible();
  });

  test("20 · Step 4: botó 'Afegir jugador' ocult quan jugadors = maxPlayers (4)", async ({ page }) => {
    await goToStep4(page);
    await page.getByRole("button", { name: /Afegir jugador/i }).click();
    // Ara tenim 4 (maxPlayers) → el botó Afegir desapareix
    await expect(page.getByRole("button", { name: /Afegir jugador/i })).not.toBeVisible();
  });

  // ── Validació Step 5 ─────────────────────────────────────────────────────

  async function goToStep5Individual(page: Page) {
    await gotoWizard(page);
    await goToStep2(page);
    await selectPackageAndCategory(page, "Inscripció individual");
    await fillCaptain(page);
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();
    await page.getByRole("button", { name: /Continuar/i }).last().click();
    await expect(page.getByText("Revisa i envia")).toBeVisible();
  }

  test("21 · Step 5: botó desactivat sense RGPD", async ({ page }) => {
    await goToStep5Individual(page);
    // Només drets d'imatge marcat
    await page.getByText(/Autoritzo l'organització/).click();
    await expect(page.getByRole("button", { name: /Enviar inscripció/i })).toBeDisabled();
  });

  test("22 · Step 5: botó desactivat sense drets d'imatge", async ({ page }) => {
    await goToStep5Individual(page);
    // Només RGPD marcat
    await page.getByText(/Accepto la política de privadesa/).click();
    await expect(page.getByRole("button", { name: /Enviar inscripció/i })).toBeDisabled();
  });

  test("23 · Step 5: botó activat amb tots dos checkboxes marcats", async ({ page }) => {
    await goToStep5Individual(page);
    await page.getByText(/Accepto la política de privadesa/).click();
    await page.getByText(/Autoritzo l'organització/).click();
    await expect(page.getByRole("button", { name: /Enviar inscripció/i })).toBeEnabled();
  });

  // ── Descomptes ───────────────────────────────────────────────────────────

  test("24 · Early Bird: badge visible i preu amb descompte mostrat", async ({ page }) => {
    await gotoWizard(page);
    // El badge Early Bird ha d'aparèixer (si la data actual és < 2026-05-20)
    // Comprovem que la secció existeixi i el contingut sigui coherent
    await expect(page.getByText("Early Bird", { exact: true })).toBeVisible();
    // O bé "Actiu" (si estem dins el termini) o "Caducat"
    const status = page.locator(".wizard-discount-status");
    await expect(status.first()).toBeVisible();
  });

  test("25 · Social: clicar WA + IG activa el descompte", async ({ page }) => {
    await gotoWizard(page);
    await page.getByText(/Comparteix per WhatsApp/i).click();
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
    await expect(page.getByText(/Descompte social del 5 % activat/i)).toBeVisible();
  });

  test("26 · Social: clicar només WA no activa el descompte", async ({ page }) => {
    await gotoWizard(page);
    await page.getByText(/Comparteix per WhatsApp/i).click();
    // Sense clicar Instagram
    await expect(page.getByText(/Descompte social del 5 % activat/i)).not.toBeVisible();
  });

  test("27 · Rival vàlid: badge 'Activat ✓' apareix", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Tens un codi d'equip rival/i }).click();
    await page.getByPlaceholder("RIVAL-XXXXXX").fill("RIVAL-CBGB2026");
    await expect(page.getByText(/Pack Rival/).last()).toBeVisible();
    await expect(page.locator(".wizard-discount-status--on").last()).toBeVisible();
  });

  test("28 · Rival invàlid: cap badge activat", async ({ page }) => {
    await gotoWizard(page);
    await page.getByRole("button", { name: /Tens un codi d'equip rival/i }).click();
    await page.getByPlaceholder("RIVAL-XXXXXX").fill("HOLACODI");
    // El badge d'estat ha de dir "Introdueix el codi" (off)
    await expect(page.locator(".wizard-discount-status--off").last()).toBeVisible();
  });

  test("29 · URL ?ref=lakers: camp rival pre-omplert com RIVAL-LAKERS", async ({ page }) => {
    await gotoWizard(page, "?ref=lakers");
    // El camp ha d'estar visible i pre-omplert (la pàgina converteix el slug a codi)
    await expect(page.getByPlaceholder("RIVAL-XXXXXX")).toHaveValue("RIVAL-LAKERS");
  });

  test("30 · Tots 3 descomptes combinats: resum mostra tots al Step 5", async ({ page }) => {
    await gotoWizard(page, "?ref=CBGB2026");

    // Activar social
    await page.getByText(/Comparteix per WhatsApp/i).click();
    await page.getByRole("link", { name: /Segueix @cbgrupbarna/i }).click();
    await expect(page.getByText(/Descompte social del 5 % activat/i)).toBeVisible();

    await goToStep2(page);
    await selectPackageAndCategory(page, "Inscripció individual");
    await fillCaptain(page);
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();
    await page.getByRole("button", { name: /Continuar/i }).last().click();

    // Al resum Step 5 han de sortir els badges de descompte aplicats
    // Social i Rival (Early Bird s'aplica automàticament si és actiu)
    await expect(page.locator(".wizard-summary-row-discount", { hasText: /Social/i })).toBeVisible();
    await expect(page.locator(".wizard-summary-row-discount", { hasText: /Pack Rival/i })).toBeVisible();
  });

  // ── Fitxer justificant ───────────────────────────────────────────────────

  test("31 · Fitxer >5 MB bloquejat amb alerta", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);
    await selectPackageAndCategory(page, "Equip 4 jugadors");
    await page.getByLabel("Nom de l'equip *").fill("Test");
    await fillCaptain(page);
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();

    // Escoltem el diàleg d'alerta
    const alertMsg = new Promise<string>((resolve) => {
      page.once("dialog", async (dialog) => {
        resolve(dialog.message());
        await dialog.dismiss();
      });
    });

    // Creem un fitxer de 6 MB (> 5 MB límit)
    const bigFile = Buffer.alloc(6 * 1024 * 1024, "a");
    await page.locator('input[type="file"]').setInputFiles({
      name: "prova-gran.jpg",
      mimeType: "image/jpeg",
      buffer: bigFile,
    });

    const msg = await alertMsg;
    expect(msg).toContain("4 MB");
  });

  test("32 · Fitxer vàlid: nom visible al Step 3 i al resum Step 5", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);
    await selectPackageAndCategory(page, "Inscripció individual");
    await fillCaptain(page);
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();

    const smallFile = Buffer.alloc(100 * 1024, "a"); // 100 KB
    await page.locator('input[type="file"]').setInputFiles({
      name: "justificant.jpg",
      mimeType: "image/jpeg",
      buffer: smallFile,
    });

    await expect(page.getByText("justificant.jpg")).toBeVisible();

    // Avancem al Step 5 i comprovem que surt al resum
    await page.getByRole("button", { name: /Continuar/i }).last().click();
    await expect(page.getByText("justificant.jpg")).toBeVisible();
  });

  // ── Pantalla d'èxit ──────────────────────────────────────────────────────

  test("33 · Pantalla d'èxit: teamId i QR visibles", async ({ page }) => {
    await gotoWizard(page);
    await goToStep2(page);
    await selectPackageAndCategory(page, "Inscripció individual");
    await fillCaptain(page);
    await page.getByRole("button", { name: /Continuar al pagament/i }).click();
    await expect(page.getByRole("heading", { name: "Fes la transferència" })).toBeVisible();
    await page.getByRole("button", { name: /Continuar/i }).last().click();
    await page.getByText(/Accepto la política de privadesa/).click();
    await page.getByText(/Autoritzo l'organització/).click();
    await page.getByRole("button", { name: /Enviar inscripció/i }).click();

    await expect(page.getByText("Inscripció enviada!")).toBeVisible();
    await expect(page.getByText("T3X3-2026-TST01", { exact: true })).toBeVisible();
    // El QR és una <img> amb alt que conté el teamId
    await expect(page.getByAltText(/QR check-in equip T3X3-2026-TST01/i)).toBeVisible();
  });
});
