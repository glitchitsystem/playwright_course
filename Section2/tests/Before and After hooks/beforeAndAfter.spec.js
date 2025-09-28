// tests/hooks-demo.spec.ts
import { test, expect } from "@playwright/test";

let sharedUserId; // example of data created once for the suite

test.beforeAll(async () => {
  // Runs once before all tests in this file.
  // Imagine calling an API to create a test user; we’ll fake it here.
  sharedUserId = "user-" + Date.now();
  console.log("[beforeAll] created user:", sharedUserId);
});

test.afterAll(async () => {
  // Runs once after all tests in this file.
  // Imagine deleting that test user from the API.
  console.log("[afterAll] cleaned up user:", sharedUserId);
});

test.beforeEach(async ({ page }) => {
  // Runs before every test.
  // Put the app into a known state—e.g., open the homepage.
  await page.goto("https://example.com");
  console.log("[beforeEach] opened homepage");
});

test.afterEach(async () => {
  // Runs after every test.
  // Example: if you created extra contexts/pages in the test, close them here.
  // (The default test `page/context` are auto-cleaned by Playwright.)
  console.log("[afterEach] test finished");
});

test.describe("Hooks demo", () => {
  test("has the correct title (single assertion)", async ({ page }) => {
    await expect(page).toHaveTitle(/Example Domain/i);
  });
});
