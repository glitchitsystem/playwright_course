// tests/step-demo.spec.ts
import { test, expect } from "@playwright/test";

test("checkout smoke", async ({ page }) => {
  // Step 1: Open the site
  await page.goto("https://example.com");
  await expect(page).toHaveTitle(/Example Domain/i);

  // Step 2: Navigate using an accessible locator
  await page.getByRole("link", { name: /More information/i }).click();
  await expect(page).toHaveURL(/iana\.org/i);
});

test("checkout smoke — step-by-step", async ({ page }) => {
  // Step 1: Open the site
  await test.step("Open homepage", async () => {
    await page.goto("https://example.com");
    await expect(page).toHaveTitle(/Example Domain/i);
  });

  // Step 2: Navigate using an accessible locator
  await test.step("Go to info page", async () => {
    await page.getByRole("link", { name: /More information/i }).click();
    await expect(page).toHaveURL(/iana\.org/i);
  });
});
