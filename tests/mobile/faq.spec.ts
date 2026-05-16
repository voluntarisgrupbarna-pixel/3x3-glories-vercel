/**
 * Bateria de proves — FAQ mòbil
 *
 * Comprova l'acordió de FAQs al home i la pàgina /preguntes-frequents:
 * expansió/col·lapse, cerca, i accessibilitat en viewport mòbil.
 */

import { test, expect } from "@playwright/test";

test.describe("FAQ — mòbil", () => {

  // ── FaqSection al home ───────────────────────────────────────────────────────

  test.describe("FaqSection (home)", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.locator("#faqs").scrollIntoViewIfNeeded();
      await expect(page.locator("#faqs")).toBeVisible();
    });

    test("1 · Secció FAQ visible al home", async ({ page }) => {
      await expect(page.locator("#faqs")).toBeVisible();
    });

    test("2 · Primer ítem FAQ visible i obre la resposta en clic", async ({ page }) => {
      const firstItem = page.locator(".faq-item").first();
      const btn = firstItem.locator("button.faq-question");
      await expect(btn).toBeVisible();

      // Comprovem que el primer ítem comença obert (openIdx=0 per defecte)
      // O el clicem si no està obert
      const isOpen = await firstItem.locator(".faq-answer").isVisible().catch(() => false);
      if (!isOpen) {
        await btn.click();
      }
      await expect(firstItem.locator(".faq-answer")).toBeVisible();
    });

    test("3 · Clic al segon ítem FAQ l'obre", async ({ page }) => {
      const items = page.locator(".faq-item");
      const second = items.nth(1);
      await second.locator("button.faq-question").click();
      await expect(second.locator(".faq-answer")).toBeVisible();
    });

    test("4 · Tanca un ítem obert clicant-lo de nou", async ({ page }) => {
      const first = page.locator(".faq-item").first();
      const btn = first.locator("button.faq-question");

      // Assegurem que està obert
      const isOpen = await first.getAttribute("class").then(c => c?.includes("faq-item--open"));
      if (!isOpen) await btn.click();
      await expect(first.locator(".faq-answer")).toBeVisible();

      // Tanquem
      await btn.click();
      await expect(first.locator(".faq-answer")).not.toBeVisible();
    });

    test("5 · Almenys 6 ítems FAQ al home", async ({ page }) => {
      const count = await page.locator(".faq-item").count();
      expect(count).toBeGreaterThanOrEqual(6);
    });

    test("6 · Botons FAQ: aria-expanded correcte", async ({ page }) => {
      const first = page.locator(".faq-item").first();
      const btn = first.locator("button.faq-question");
      const expanded = await btn.getAttribute("aria-expanded");
      // Ha de ser "true" o "false" (mai null)
      expect(["true", "false"]).toContain(expanded);
    });

    test("7 · Secció FAQ: zero overflow horitzontal", async ({ page }) => {
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
    });

    test("8 · Link 'Veure totes les preguntes' visible i apunta a /preguntes-frequents", async ({ page }) => {
      const link = page.locator("a.faq-btn--outline");
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", "/preguntes-frequents");
    });

    test("9 · Link WhatsApp del FAQ apunta al número del club", async ({ page }) => {
      const waLink = page.locator("a.faq-btn--wa");
      await expect(waLink).toBeVisible();
      const href = await waLink.getAttribute("href");
      expect(href).toMatch(/wa\.me\/34698425153/);
    });
  });

  // ── Pàgina /preguntes-frequents ──────────────────────────────────────────────

  test.describe("Pàgina /preguntes-frequents", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/preguntes-frequents");
      await expect(page.locator("h1, h2").first()).toBeVisible();
    });

    test("10 · Pàgina carrega sense error en mòbil", async ({ page }) => {
      await expect(page.locator("h1, h2").first()).toBeVisible();
    });

    test("11 · Zero overflow horitzontal", async ({ page }) => {
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
    });

    test("12 · Input de cerca visible i accessible", async ({ page }) => {
      // FaqSearch usa class 'faq-search-input' i aria-label específic
      const input = page.locator("input.faq-search-input");
      await expect(input).toBeVisible();
      // És accessible (tap area suficient)
      const box = await input.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(36);
    });

    test("13 · Cerca 'equip' filtra i mostra resultats", async ({ page }) => {
      const input = page.locator("input.faq-search-input");
      await expect(input).toBeVisible();
      await input.fill("equip");
      await page.waitForTimeout(500);
      // La pàgina /preguntes-frequents usa .faq-search-item (FaqSearch component)
      const items = page.locator(".faq-search-item");
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    });

    test("14 · Esborrar cerca restaura la llista completa", async ({ page }) => {
      const input = page.locator("input.faq-search-input");
      await expect(input).toBeVisible();

      // Comptem ítems inicial (sense cerca activa, llista completa)
      const initialCount = await page.locator(".faq-search-item").count();

      await input.fill("xyz123inexistent");
      await page.waitForTimeout(400);

      await page.locator("button.faq-search-clear").click();
      await page.waitForTimeout(400);

      const afterCount = await page.locator(".faq-search-item").count();
      expect(afterCount).toBeGreaterThanOrEqual(initialCount);
    });
  });
});
