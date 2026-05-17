import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    actionTimeout: 15_000,
  },

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },

  projects: [
    // Tests funcionals: Desktop + Mobile Chrome
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/e2e/**/*.spec.ts",
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] }, // 393×851
    },
    // Tests específics mòbil: cross-browser Safari + viewport petit
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] }, // 390×844
      testMatch: "**/mobile/**/*.spec.ts",
    },
    {
      name: "Mobile Small",
      use: { ...devices["iPhone SE"] }, // 375×667, viewport mínim
      testMatch: "**/mobile/**/*.spec.ts",
    },
    // Tests tablet — iPad Pro 11" (1024×1366)
    {
      name: "Tablet iPad",
      use: { ...devices["iPad Pro 11"] },
      testMatch: "**/tablet/**/*.spec.ts",
    },
  ],
});
