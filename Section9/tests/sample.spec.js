import { test, expect } from "@playwright/test";

test.afterAll(async () => {
  // Code
});

test.afterEach(async ({ page }) => {
  // Code
});

test.beforeAll(async () => {
  // Code
});

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/timeouts-waiting.html");
});

test.describe("sample suite", () => {
  test("Test timeouts ", async ({ page }) => {
    // test.setTimeout(15000);
    // page.setDefaultTimeout(500);
    await page.locator("#timeout-input").fill("6000");
    await page.locator("#timeout-btn").click();

    await expect(page.locator("#timeout-result")).toContainText("Finished", {
      timeout: 7000,
    });
    console.log(await page.locator("#timeout-result").innerText());
  });

  test("Test auto-waiting", async ({ page }) => {
    await page.locator("#timeout-input").fill("2000");

    await page.locator("#timeout-btn").click();

    await page.locator("#show-delayed").click();
    await expect(page.getByTestId("delayed-element")).toContainText(
      "Element appeared after delay!"
    );
  });

  test(
    "Test waitFor ",
    {
      annotation: {
        type: "Issue",
        description: "https://github.com/microsoft/playwright/issues/23180",
      },
    },
    async ({ page }) => {
      const visibleElement = page.getByTestId("visible-element");
      await expect(visibleElement).toBeHidden();
      await page.locator("#show-visible").click();

      await visibleElement.waitFor({ state: "visible", timeout: 2000 });
      await expect(visibleElement).toBeVisible();

      const input1 = page.getByTestId("enabled-input");
      await expect(input1).toBeDisabled();
      await page.locator("#toggle-enabled").click();
      await expect(input1).toBeEnabled();
      await input1.fill("Test");
    }
  );
});
