/**
 * Bateria de proves — PortaUnRivalForm
 * Ruta: /porta-un-rival
 *
 * Genera un codi RIVAL-<SLUG> i un missatge de WhatsApp per desafiar un rival.
 * No fa cap crida a l'API pròpia.
 */

import { test, expect, Page } from "@playwright/test";

// ── Helper ───────────────────────────────────────────────────────────────────

async function fillAndSubmit(page: Page, myTeam: string, rivalTeam: string) {
  // Espera que React hagi hidritat el formulari (data-rival-ready s'afegeix al primer useEffect)
  await page.waitForSelector('.rival-form[data-rival-ready="true"]');
  // Usem id directament — més ràpid i robust que getByLabel per accents i apostrofes
  await page.locator("#my-team").fill(myTeam);
  await page.locator("#rival-team").fill(rivalTeam);
  await page.getByRole("button", { name: /Genera el repte per WhatsApp/i }).click();
}

test.describe("PortaUnRivalForm", () => {

  test("1 · Botó desactivat si falta nom propi", async ({ page }) => {
    await page.goto("/porta-un-rival");
    await page.locator("#rival-team").fill("Rivals FC");
    await expect(page.getByRole("button", { name: /Genera el repte per WhatsApp/i })).toBeDisabled();
  });

  test("2 · Botó desactivat si falta nom rival", async ({ page }) => {
    await page.goto("/porta-un-rival");
    await page.locator("#my-team").fill("CB Grup Barna A");
    await expect(page.getByRole("button", { name: /Genera el repte per WhatsApp/i })).toBeDisabled();
  });

  test("3 · Submit → apareix codi RIVAL-<SLUG> en majúscules", async ({ page }) => {
    await page.goto("/porta-un-rival");
    await fillAndSubmit(page, "CB Grup Barna A", "Rivals FC");
    const code = page.locator(".rival-code");
    await expect(code).toBeVisible();
    const text = await code.textContent();
    expect(text).toMatch(/^RIVAL-[A-Z0-9\-]+$/);
  });

  test("4 · Codi correcte per 'CB Grup Barna' → RIVAL-CB-GRUP-BARNA", async ({ page }) => {
    await page.goto("/porta-un-rival");
    await fillAndSubmit(page, "CB Grup Barna", "Rivals FC");
    await expect(page.locator(".rival-code")).toHaveText("RIVAL-CB-GRUP-BARNA");
  });

  test("5 · Codi correcte per 'Barça Júniors' → sense accents, majúscules", async ({ page }) => {
    await page.goto("/porta-un-rival");
    await fillAndSubmit(page, "Barça Júniors", "Rivals FC");
    const code = await page.locator(".rival-code").textContent();
    // Ha d'estar en majúscules i sense accents
    expect(code).toMatch(/^RIVAL-[A-Z0-9\-]+$/);
    expect(code).not.toMatch(/[àáèéíïòóúüç]/i);
  });

  test("6 · Botó 'Copiar' guarda el codi al clipboard", async ({ page, context }) => {
    // Cal concedir els permisos ABANS de navegar
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/porta-un-rival");
    await fillAndSubmit(page, "CB Grup Barna A", "Rivals FC");

    await page.getByRole("button", { name: /Copiar/i }).click();
    // Esperem que el botó canviï a "Copiat ✓" per confirmar l'acció
    await expect(page.getByRole("button", { name: /Copiat/i })).toBeVisible();

    // Llegim el clipboard per verificar
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toMatch(/^RIVAL-[A-Z0-9\-]+$/);
  });

  test("7 · Missatge WA conté codi, noms i URL d'inscripció", async ({ page }) => {
    await page.goto("/porta-un-rival");
    await fillAndSubmit(page, "Street Ballers", "Fire Girls");
    const msg = page.locator(".rival-preview-msg");
    await expect(msg).toContainText("Street Ballers");
    await expect(msg).toContainText("Fire Girls");
    await expect(msg).toContainText("RIVAL-STREET-BALLERS");
    await expect(msg).toContainText("cbgrupbarna-3x3timechamber.com");
  });

  test("8 · Botó 'Editar' torna al formulari i oculta el codi", async ({ page }) => {
    await page.goto("/porta-un-rival");
    await fillAndSubmit(page, "CB Grup Barna A", "Rivals FC");
    await expect(page.locator(".rival-code")).toBeVisible();

    await page.getByRole("button", { name: /Editar/i }).click();

    // El codi ha d'estar ocult
    await expect(page.locator(".rival-preview")).not.toBeVisible();
    // El formulari ha de ser visible de nou
    await expect(page.getByRole("button", { name: /Genera el repte per WhatsApp/i })).toBeVisible();
  });
});
