/**
 * Bateria de proves — Navegació mòbil
 *
 * Comprova StickyCtaBar (botons flotants), navegació per ancles
 * del hero, nav del hero i footer.
 */

import { test, expect } from "@playwright/test";

test.describe("Navegació — mòbil", () => {

  // ── StickyCtaBar ─────────────────────────────────────────────────────────────

  test.describe("StickyCtaBar", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("h1.hero-festival-title")).toBeVisible();
    });

    test("1 · StickyCtaBar visible a la pàgina principal", async ({ page }) => {
      await expect(page.locator(".sticky-cta-bar")).toBeVisible();
    });

    test("2 · Botó Pack Rival visible i apunta a /porta-un-rival", async ({ page }) => {
      const btn = page.locator("a.sticky-cta-rival");
      await expect(btn).toBeVisible();
      await expect(btn).toHaveAttribute("href", "/porta-un-rival");
      await expect(btn).toContainText("Pack Rival");
    });

    test("3 · Botó 'Inscriure'm sol' visible i apunta a /inscripcio-individual", async ({ page }) => {
      const btn = page.locator("a.sticky-cta-solo");
      await expect(btn).toBeVisible();
      await expect(btn).toHaveAttribute("href", "/inscripcio-individual");
    });

    test("4 · Botó Compartir visible", async ({ page }) => {
      await expect(page.locator("button.sticky-cta-share")).toBeVisible();
    });

    test("5 · StickyCtaBar: alçada botons ≥ 44px (touch target)", async ({ page }) => {
      const rival = page.locator("a.sticky-cta-rival");
      const box = await rival.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test("6 · StickyCtaBar OCULTA a /inscripcion", async ({ page }) => {
      await page.goto("/inscripcion");
      await expect(page.locator(".sticky-cta-bar")).not.toBeVisible();
    });

    test("7 · StickyCtaBar OCULTA a /inscripcio-individual", async ({ page }) => {
      await page.goto("/inscripcio-individual");
      await expect(page.locator(".sticky-cta-bar")).not.toBeVisible();
    });

    test("8 · StickyCtaBar OCULTA a /porta-un-rival", async ({ page }) => {
      await page.goto("/porta-un-rival");
      await expect(page.locator(".sticky-cta-bar")).not.toBeVisible();
    });
  });

  // ── Navegació per ancles del hero ────────────────────────────────────────────

  test.describe("Ancles del hero", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await expect(page.locator(".hero-festival-nav")).toBeVisible();
    });

    test("9 · Link 'Ubicacions' navega a la secció #ubicacions", async ({ page }) => {
      await page.locator("a.hero-festival-link[href='#ubicacions']").click();
      await expect(page.locator("#ubicacions")).toBeInViewport({ ratio: 0.2 });
    });

    test("10 · Link 'Premis' navega a la secció #premis", async ({ page }) => {
      await page.locator("a.hero-festival-link[href='#premis']").click();
      await expect(page.locator("#premis")).toBeInViewport({ ratio: 0.2 });
    });

    test("11 · Link 'Categories' navega a la secció #categories", async ({ page }) => {
      await page.locator("a.hero-festival-link[href='#categories']").click();
      await expect(page.locator("#categories")).toBeInViewport({ ratio: 0.2 });
    });

    test("12 · CTA 'Inscriu-te' del nav navega a /inscripcion", async ({ page }) => {
      const cta = page.locator("a.hero-festival-nav-cta");
      await expect(cta).toHaveAttribute("href", "/inscripcion");
    });

    test("13 · Link 'FAQs' navega a /preguntes-frequents", async ({ page }) => {
      const faqLink = page.locator("a.hero-festival-link[href='/preguntes-frequents']");
      await expect(faqLink).toBeVisible();
    });
  });

  // ── Footer ──────────────────────────────────────────────────────────────────

  test.describe("Footer", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
    });

    test("14 · Footer visible al final de la pàgina", async ({ page }) => {
      const footer = page.locator("footer").first();
      await expect(footer).toBeVisible();
    });

    test("15 · Footer no té overflow horitzontal", async ({ page }) => {
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
    });

    test("16 · Footer — link Instagram apunta a @cbgrupbarna", async ({ page }) => {
      const igLink = page.locator("footer a[href*='instagram.com/cbgrupbarna']").first();
      await expect(igLink).toBeVisible();
    });
  });

  // ── Navegació pàgines internes ───────────────────────────────────────────────

  test("17 · /preguntes-frequents carrega sense error", async ({ page }) => {
    await page.goto("/preguntes-frequents");
    await expect(page).toHaveTitle(/preguntes|FAQ/i);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("18 · /patrocinar carrega sense error", async ({ page }) => {
    await page.goto("/patrocinar");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("19 · /seu/westfield-glories carrega sense error", async ({ page }) => {
    await page.goto("/seu/westfield-glories");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("20 · /seu/nau-del-clot carrega sense error", async ({ page }) => {
    await page.goto("/seu/nau-del-clot");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});
