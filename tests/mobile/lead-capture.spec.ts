/**
 * Bateria de proves — Captura de leads i modals (mòbil)
 *
 * Comprova WhatsAppLeadWidget (flotant), NotifyMeBar i ExitIntentModal.
 * Les crides a /api/lead es mocken per evitar escriure dades reals.
 */

import { test, expect, Page } from "@playwright/test";

async function mockLeadApi(page: Page) {
  await page.route("/api/lead", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  );
}

test.describe("Captura de leads — mòbil", () => {

  // ── WhatsAppLeadWidget (flotant) ─────────────────────────────────────────────

  test.describe("WhatsAppLeadWidget flotant", () => {
    test.beforeEach(async ({ page }) => {
      await mockLeadApi(page);
      await page.goto("/");
      await expect(page.locator("h1.hero-festival-title")).toBeVisible();
    });

    test("1 · Botó flotant WhatsApp visible", async ({ page }) => {
      await expect(page.locator("button.wa-floating-button")).toBeVisible();
    });

    test("2 · Botó flotant: alçada ≥ 44px (touch target)", async ({ page }) => {
      const btn = page.locator("button.wa-floating-button");
      const box = await btn.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test("3 · Clic al botó flotant obre el formulari", async ({ page }) => {
      await page.locator("button.wa-floating-button").click();
      await expect(page.locator(".wa-lead-overlay")).toBeVisible();
    });

    test("4 · Formulari WA: camp nom accessible i editable", async ({ page }) => {
      await page.locator("button.wa-floating-button").click();
      const nomInput = page.locator(".wa-lead-overlay input[autocomplete='name']");
      await expect(nomInput).toBeVisible();
      await nomInput.fill("Maria Test");
      await expect(nomInput).toHaveValue("Maria Test");
    });

    test("5 · Formulari WA: camp email accessible", async ({ page }) => {
      await page.locator("button.wa-floating-button").click();
      const emailInput = page.locator(".wa-lead-overlay input[type='email']");
      await expect(emailInput).toBeVisible();
    });

    test("6 · Formulari WA: camp telèfon accessible", async ({ page }) => {
      await page.locator("button.wa-floating-button").click();
      const telInput = page.locator(".wa-lead-overlay input[autocomplete='tel']");
      await expect(telInput).toBeVisible();
    });

    test("7 · Formulari WA: checkbox consent clicable", async ({ page }) => {
      await page.locator("button.wa-floating-button").click();
      const consent = page.locator(".wa-consent input[type='checkbox']");
      await expect(consent).toBeVisible();
      await consent.check();
      await expect(consent).toBeChecked();
    });

    test("8 · Formulari WA: botó tancar (×) tanca el overlay", async ({ page }) => {
      await page.locator("button.wa-floating-button").click();
      await expect(page.locator(".wa-lead-overlay")).toBeVisible();
      await page.locator(".wa-lead-close").click();
      await expect(page.locator(".wa-lead-overlay")).not.toBeVisible();
    });

    test("9 · Formulari WA: enviar amb dades vàlides → panell d'èxit", async ({ page }) => {
      await page.locator("button.wa-floating-button").click();

      await page.locator(".wa-lead-overlay input[autocomplete='name']").fill("Maria Test");
      await page.locator(".wa-lead-overlay input[type='email']").fill("maria@test.com");
      await page.locator(".wa-lead-overlay input[autocomplete='tel']").fill("600111222");
      await page.locator(".wa-consent input[type='checkbox']").check();

      await page.locator("button.wa-submit").click();
      await expect(page.locator(".wa-success-panel")).toBeVisible({ timeout: 10_000 });
    });

    test("10 · Formulari WA: error sense consent → mostra missatge d'error", async ({ page }) => {
      await page.locator("button.wa-floating-button").click();

      await page.locator(".wa-lead-overlay input[autocomplete='name']").fill("Maria Test");
      await page.locator(".wa-lead-overlay input[type='email']").fill("maria@test.com");
      await page.locator(".wa-lead-overlay input[autocomplete='tel']").fill("600111222");
      // Consent NO marcat

      await page.locator("button.wa-submit").click();
      await expect(page.locator(".wa-lead-error")).toBeVisible();
    });

    test("11 · Formulari WA: zero overflow horitzontal amb overlay obert", async ({ page }) => {
      await page.locator("button.wa-floating-button").click();
      await expect(page.locator(".wa-lead-overlay")).toBeVisible();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
    });

    test("12 · Botó WhatsApp accessible via QR (?qr=contacte) — overlay s'obre automàticament", async ({ page }) => {
      await mockLeadApi(page);
      await page.goto("/?qr=contacte");
      await expect(page.locator(".wa-lead-overlay")).toBeVisible({ timeout: 5_000 });
    });
  });

  // ── NotifyMeBar ──────────────────────────────────────────────────────────────

  test.describe("NotifyMeBar", () => {
    test.beforeEach(async ({ page }) => {
      await mockLeadApi(page);
      await page.goto("/");
      await page.locator(".notify-bar").scrollIntoViewIfNeeded();
      await expect(page.locator(".notify-bar")).toBeVisible();
    });

    test("13 · NotifyMeBar visible en fer scroll", async ({ page }) => {
      await expect(page.locator(".notify-bar")).toBeVisible();
    });

    test("14 · Input email accessible i editable", async ({ page }) => {
      const input = page.locator(".notify-bar-input");
      await expect(input).toBeVisible();
      await input.fill("test@example.com");
      await expect(input).toHaveValue("test@example.com");
    });

    test("15 · Botó 'Avisa'm' visible i clicable", async ({ page }) => {
      const btn = page.locator(".notify-bar-btn");
      await expect(btn).toBeVisible();
      await expect(btn).toBeEnabled();
    });

    test("16 · Enviar email vàlid → estat 'done' (confirmació)", async ({ page }) => {
      await page.locator(".notify-bar-input").fill("notifica@test.com");
      await page.locator(".notify-bar-btn").click();
      await expect(page.locator(".notify-bar--done")).toBeVisible({ timeout: 8_000 });
    });

    test("17 · NotifyMeBar: zero overflow horitzontal", async ({ page }) => {
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
    });
  });

  // ── ExitIntentModal ──────────────────────────────────────────────────────────

  test.describe("ExitIntentModal", () => {
    test("18 · Modal NO apareix en carregar la pàgina (sense delay ni scroll)", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator(".exit-overlay")).not.toBeVisible();
    });

    test("19 · Modal apareix en sessió nova després del delay + scroll amunt ràpid", async ({ page }) => {
      // Instal·lem rellotge virtual per saltar el delay de 8s
      await page.clock.install();
      await page.goto("/");
      await expect(page.locator("h1.hero-festival-title")).toBeVisible();

      // Saltem els 8 segons d'espera
      await page.clock.fastForward(9_000);

      // Scroll avall >300px (activa maxScrolled)
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(150);

      // Scroll amunt >200px ràpidament (delta net: 500 - 290 = 210 > 200)
      await page.mouse.wheel(0, -300);
      await page.waitForTimeout(300);

      await expect(page.locator('[role="dialog"][aria-label="Oferta Early Bird"]')).toBeVisible({ timeout: 3_000 });
    });

    test("20 · Modal: botó tancar (×) fa desaparèixer el modal", async ({ page }) => {
      await page.clock.install();
      await page.goto("/");
      await expect(page.locator("h1.hero-festival-title")).toBeVisible();
      await page.clock.fastForward(9_000);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(150);
      await page.mouse.wheel(0, -300);
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"][aria-label="Oferta Early Bird"]');
      await expect(modal).toBeVisible({ timeout: 3_000 });

      await page.locator("button.exit-close").click();
      await expect(modal).not.toBeVisible();
    });

    test("21 · Modal: conté CTA per WhatsApp", async ({ page }) => {
      await page.clock.install();
      await page.goto("/");
      await page.clock.fastForward(9_000);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(150);
      await page.mouse.wheel(0, -300);
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"][aria-label="Oferta Early Bird"]');
      await expect(modal).toBeVisible({ timeout: 3_000 });

      const waBtn = modal.locator("a.exit-btn-wa");
      await expect(waBtn).toBeVisible();
      const href = await waBtn.getAttribute("href");
      expect(href).toMatch(/wa\.me\/34698425153/);
    });

    test("22 · Modal: conté link 'Veure preus i categories'", async ({ page }) => {
      await page.clock.install();
      await page.goto("/");
      await page.clock.fastForward(9_000);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(150);
      await page.mouse.wheel(0, -300);
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"][aria-label="Oferta Early Bird"]');
      await expect(modal).toBeVisible({ timeout: 3_000 });

      const secondary = modal.locator("a.exit-btn-secondary");
      await expect(secondary).toBeVisible();
      await expect(secondary).toContainText(/Veure preus/i);
    });

    test("23 · Modal NO torna a aparèixer en la mateixa sessió (sessionStorage)", async ({ page }) => {
      // Precarreguem el flag de sessió com si ja s'hagués mostrat
      await page.clock.install();
      await page.goto("/");
      await page.evaluate(() => sessionStorage.setItem("exit_intent_shown", "1"));

      await page.clock.fastForward(9_000);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(150);
      await page.mouse.wheel(0, -300);
      await page.waitForTimeout(500);

      // El modal no ha d'aparèixer (ja s'havia mostrat)
      await expect(page.locator(".exit-overlay")).not.toBeVisible();
    });

    test("24 · Modal: zero overflow horitzontal quan és visible", async ({ page }) => {
      await page.clock.install();
      await page.goto("/");
      await page.clock.fastForward(9_000);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(150);
      await page.mouse.wheel(0, -300);
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"][aria-label="Oferta Early Bird"]');
      await expect(modal).toBeVisible({ timeout: 3_000 });

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);
    });
  });
});
