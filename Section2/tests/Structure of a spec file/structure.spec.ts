// tests/beginner.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows the correct title", async ({ page }) => {
    // Step 1: Open the page (Playwright controls a real browser behind the scenes)
    await page.goto("https://example.com");

    // Single assertion: Make sure the page's title is correct
    await expect(page).toHaveTitle(/Example Domain/i);

    // Step 2 (optional action): Click a link by its accessible name
    await page.getByRole("link", { name: /More information/i }).click();
  });
});
