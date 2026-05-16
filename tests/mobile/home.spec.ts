/**
 * Bateria de proves — Home page en mòbil
 *
 * Comprova que tota la pàgina principal renderitza correctament
 * en viewports mòbil: seccions visibles, zero overflow horitzontal,
 * countdown actiu i CTAs accessibles.
 */

import { test, expect } from "@playwright/test";

test.describe("Home — mòbil", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Esperem que el hero carregui (títol principal)
    await expect(page.locator("h1.hero-festival-title")).toBeVisible();
  });

  // ── Hero ────────────────────────────────────────────────────────────────────

  test("1 · Hero — títol principal visible", async ({ page }) => {
    await expect(page.locator("h1.hero-festival-title")).toContainText("3×3 Westfield Glòries");
  });

  test("2 · Hero — data de l'esdeveniment visible", async ({ page }) => {
    await expect(page.getByText(/6 i 7 de Juny 2026/i)).toBeVisible();
  });

  test("3 · Hero — CTA primari d'inscripció visible i clicable", async ({ page }) => {
    const cta = page.locator("a.hero-festival-cta-primary");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/inscripcion");
  });

  test("4 · Hero — CTA individual (20€) visible", async ({ page }) => {
    const solo = page.locator("a.hero-festival-solo-cta");
    await expect(solo).toBeVisible();
    await expect(solo).toContainText("20€");
    await expect(solo).toHaveAttribute("href", "/inscripcio-individual");
  });

  test("5 · Hero — stats 180+ equips i 800+ jugadors visibles", async ({ page }) => {
    const stats = page.locator(".hero-festival-stats");
    await expect(stats).toBeVisible();
    await expect(stats.getByText("180+")).toBeVisible();
    await expect(stats.getByText("800+")).toBeVisible();
  });

  test("6 · Hero — indicador d'ocupació visible", async ({ page }) => {
    await expect(page.locator(".hero-festival-progress")).toBeVisible();
    await expect(page.locator(".hero-festival-progress")).toContainText("%");
  });

  test("7 · Hero — slideshow: primer slide visible (no error d'imatge)", async ({ page }) => {
    const slide = page.locator(".hero-festival-slide").first();
    await expect(slide).toBeVisible();
    // Comprovem que la imatge no té error (naturalWidth > 0)
    const loaded = await slide.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(loaded).toBe(true);
  });

  // ── Early Bird Banner ────────────────────────────────────────────────────────

  test("8 · EarlyBirdBanner — visible sobre el hero", async ({ page }) => {
    // El banner apareix sobre el main, busquem per text
    const banner = page.getByText(/Early Bird/i).first();
    await expect(banner).toBeVisible();
  });

  // ── Seccions (scroll) ────────────────────────────────────────────────────────

  test("9 · Secció Ubicacions visible en fer scroll", async ({ page }) => {
    await page.locator("#ubicacions").scrollIntoViewIfNeeded();
    await expect(page.locator("#ubicacions")).toBeVisible();
  });

  test("10 · Secció Premis visible en fer scroll", async ({ page }) => {
    await page.locator("#premis").scrollIntoViewIfNeeded();
    await expect(page.locator("#premis")).toBeVisible();
  });

  test("11 · Secció Categories visible en fer scroll", async ({ page }) => {
    await page.locator("#categories").scrollIntoViewIfNeeded();
    await expect(page.locator("#categories")).toBeVisible();
  });

  test("12 · Secció FAQ visible en fer scroll", async ({ page }) => {
    await page.locator("#faqs").scrollIntoViewIfNeeded();
    await expect(page.locator("#faqs")).toBeVisible();
  });

  test("13 · Secció Sponsors visible en fer scroll", async ({ page }) => {
    await page.locator("#sponsors").scrollIntoViewIfNeeded();
    await expect(page.locator("#sponsors")).toBeVisible();
  });

  test("14 · Footer visible al final de la pàgina", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // El footer ha de contenir text de copyright o nom del club
    const footer = page.locator("footer").first();
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/CB Grup Barna|3×3/i);
  });

  // ── Overflow horitzontal ────────────────────────────────────────────────────

  test("15 · Zero overflow horitzontal al hero (viewport initial)", async ({ page }) => {
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
  });

  test("16 · Zero overflow horitzontal en fer scroll al final", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
  });

  // ── Touch targets ────────────────────────────────────────────────────────────

  test("17 · CTA primari: alçada mínima 44px (touch target WCAG)", async ({ page }) => {
    const cta = page.locator("a.hero-festival-cta-primary");
    const box = await cta.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("18 · Botó 'Saber més' visible i accessible", async ({ page }) => {
    await expect(page.locator("a.hero-festival-cta-secondary")).toBeVisible();
  });
});
