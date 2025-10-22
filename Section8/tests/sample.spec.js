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
  page.goto("http://localhost:3000/index.html");
});

test.describe("sample suite", () => {
  test("Test generic assertions ", async ({ page }) => {
    expect(5).toBe(5);
    expect("hi").toBe("hi");
    expect("hi").not.toBe("hi");

    expect(5).toEqual(5);
    expect("hi").toEqual("hi");

    const a = { x: 1 };
    const b = { x: 1 };

    expect(a).toBe(a);
    // expect(a).toBe(b); //will fail
    expect(a).toEqual(b);

    await page.getByRole("link", { name: "Context" }).first().click();

    await page.getByTestId("increment-button").click();
    await page.getByTestId("increment-button").click();

    const counterVal = await page.getByTestId("counter-value").textContent();
    const numberVal = Number(counterVal);
    expect(numberVal).toBeGreaterThan(1);

    // expect(numberVal).not.toBeGreaterThan(1);
  });

  test("Test locator assertions", async ({ page }) => {
    await page.getByRole("link", { name: "Form Controls" }).first().click();

    const radio1 = page.locator(
      "#test-form > section:nth-child(3) > fieldset > div > label:nth-child(1) > span"
    );

    await radio1.click();
    await expect(radio1).toBeChecked();

    const radio2 = page.locator(
      "#test-form > section:nth-child(3) > fieldset > div > label:nth-child(2) > span"
    );

    await expect(radio2).not.toBeChecked();

    const field = page.getByTestId("technology-search");
    await field.fill("123");

    await expect(field).toHaveValue("123");

    const list = page.getByTestId("location-suggestions");
    const nyc = page.getByTestId("suggestion-new-york");

    await expect(list).toBeHidden();

    await page.getByTestId("location-search").fill("new");

    await expect(list).toBeVisible();
    await expect(nyc).toBeVisible();
    await expect(nyc).toContainText(/new york/i);
  });

  test(
    "Test page assertions ",
    {
      annotation: {
        type: "Issue",
        description: "https://github.com/microsoft/playwright/issues/23180",
      },
    },
    async ({ page }) => {
      await expect(page).toHaveTitle("Playwright Core Concepts - Test App");
      await expect(page).toHaveTitle(/^Playwright Core Concepts/);
      await expect(page).toHaveTitle(/ - Test App$/);

      await expect(page).toHaveURL("http://localhost:3000/index.html");
      await expect(page).toHaveURL(/^http:\/\/localhost:3000\//);
    }
  );
});
