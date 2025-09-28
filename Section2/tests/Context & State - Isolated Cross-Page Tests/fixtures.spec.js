// tests/fixtures-demo.spec.ts
import { test, expect } from "@playwright/test";

test("page fixture: one ready-to-use tab per test", async ({ page }) => {
  // `page` is a fresh tab in a fresh browser context for THIS test only.
  await page.goto("https://example.com");
  await expect(page).toHaveTitle(/Example Domain/i);
});

test("context fixture: open a second tab in the SAME test session", async ({
  context,
}) => {
  // `context` is the isolated browser session for this test (cookies/storage live here).
  const page1 = await context.newPage();
  const page2 = await context.newPage(); // second tab, same auth/session as page1

  await page1.goto("https://example.com");
  await page2.goto("https://example.com");

  // Both pages share cookies/localStorage because they're in the same context.
  await expect(page1).toHaveTitle(/Example/);
  await expect(page2).toHaveTitle(/Example/);
});

test("browser fixture: create a brand-new isolated context yourself", async ({
  browser,
}) => {
  // `browser` is the underlying browser process. You can create your own context
  // when you need totally separate sessions/users inside one test.
  const userA = await browser.newContext(); // session A
  const userB = await browser.newContext(); // session B (fully isolated from A)
  const aPage = await userA.newPage();
  const bPage = await userB.newPage();

  await aPage.goto("https://example.com");
  await bPage.goto("https://example.com");

  await expect(aPage).toHaveTitle(/Example/);
  await expect(bPage).toHaveTitle(/Example/);

  await userA.close();
  await userB.close(); // clean up contexts you created manually
});
