/**
 * Bateria de proves — IndividualSignupForm
 * Ruta: /inscripcio-individual
 *
 * Aquest formulari genera un missatge de WhatsApp pre-omplert.
 * No fa cap crida a l'API pròpia.
 */

import { test, expect, Page } from "@playwright/test";

// ── Helper ───────────────────────────────────────────────────────────────────

async function fillForm(page: Page, opts: { skipConsent?: boolean; skipEmail?: boolean } = {}) {
  // Espera que React hagi hidritat el formulari (data-individual-ready s'afegeix al primer useEffect)
  await page.waitForSelector('.solo-form[data-individual-ready="true"]');
  await page.getByLabel("Nom i cognoms *").fill("Marta Puig Roca");
  await page.getByLabel("Data de naixement *").fill("1995-06-15");
  await page.getByLabel("Categoria *").selectOption("Femení");
  await page.getByLabel("Posició preferida *").selectOption("Base");
  await page.getByLabel("Nivell *").selectOption("Avançat");
  await page.getByLabel("Talla samarreta *").selectOption("S");
  await page.getByLabel("Telèfon (WhatsApp) *").fill("+34 611 222 333");
  if (!opts.skipEmail) {
    await page.getByLabel("Email *").fill("marta@test.com");
  }
  if (!opts.skipConsent) {
    await page.getByLabel(/Accepto rebre comunicacions/i).check();
  }
}

test.describe("IndividualSignupForm", () => {

  test("1 · Botó desactivat per defecte (formulari buit)", async ({ page }) => {
    await page.goto("/inscripcio-individual");
    await expect(page.getByRole("button", { name: /Generar inscripció per WhatsApp/i })).toBeDisabled();
  });

  test("2 · Emplenar tots els camps → botó activat", async ({ page }) => {
    await page.goto("/inscripcio-individual");
    await fillForm(page);
    await expect(page.getByRole("button", { name: /Generar inscripció per WhatsApp/i })).toBeEnabled();
  });

  test("3 · Submit → apareix previsualització del missatge", async ({ page }) => {
    await page.goto("/inscripcio-individual");
    await fillForm(page);
    await page.getByRole("button", { name: /Generar inscripció per WhatsApp/i }).click();
    await expect(page.locator(".solo-preview-msg")).toBeVisible();
  });

  test("4 · Missatge conté tots els camps rellevants", async ({ page }) => {
    await page.goto("/inscripcio-individual");
    await fillForm(page);
    await page.getByRole("button", { name: /Generar inscripció per WhatsApp/i }).click();

    const msg = page.locator(".solo-preview-msg");
    await expect(msg).toContainText("Marta Puig Roca");
    await expect(msg).toContainText("1995-06-15");
    await expect(msg).toContainText("Femení");
    await expect(msg).toContainText("Base");
    await expect(msg).toContainText("Avançat");
    await expect(msg).toContainText("S");
    await expect(msg).toContainText("+34 611 222 333");
    await expect(msg).toContainText("marta@test.com");
  });

  test("5 · Botó WhatsApp apunta al número del club (+34698425153)", async ({ page }) => {
    await page.goto("/inscripcio-individual");
    await fillForm(page);
    await page.getByRole("button", { name: /Generar inscripció per WhatsApp/i }).click();

    const waLink = page.locator(".solo-wa-btn");
    const href = await waLink.getAttribute("href");
    expect(href).toMatch(/wa\.me\/34698425153/);
  });

  test("6 · Botó 'Editar' torna al formulari amb les dades preservades", async ({ page }) => {
    await page.goto("/inscripcio-individual");
    await fillForm(page);
    await page.getByRole("button", { name: /Generar inscripció per WhatsApp/i }).click();
    await page.getByRole("button", { name: /Editar/i }).click();

    // El formulari torna a ser visible amb les dades
    await expect(page.getByLabel("Nom i cognoms *")).toHaveValue("Marta Puig Roca");
    await expect(page.getByLabel("Email *")).toHaveValue("marta@test.com");
  });

  test("7 · Consent desmarcat → botó desactivat", async ({ page }) => {
    await page.goto("/inscripcio-individual");
    await fillForm(page, { skipConsent: true });
    await expect(page.getByRole("button", { name: /Generar inscripció per WhatsApp/i })).toBeDisabled();
  });

  test("8 · Falta email → botó desactivat (type=email + required)", async ({ page }) => {
    await page.goto("/inscripcio-individual");
    await fillForm(page, { skipEmail: true });
    await expect(page.getByRole("button", { name: /Generar inscripció per WhatsApp/i })).toBeDisabled();
  });

  test("9 · Mòbil: cap overflow horitzontal al formulari", async ({ page }) => {
    // Prova específica de viewport mòbil
    await page.goto("/inscripcio-individual");
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width ?? 390;
    // scrollWidth ha de ser <= viewportWidth (sense overflow)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2); // +2px de tolerància
  });
});
