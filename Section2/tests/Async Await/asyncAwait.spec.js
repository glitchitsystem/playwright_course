// tests/await-basics.spec.ts
import { test, expect } from "@playwright/test";

test("await only the async stuff", async ({ page }) => {
  await page.goto("https://example.com");

  const link = page.getByRole("link", {
    name: /More information/i,
  });

  await expect(link).toBeVisible();
  await link.click();

  const currentUrl = page.url();
  expect(currentUrl).toContain("example");
});
