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
  page.goto("http://localhost:3000/form-controls.html");
});

test.describe("sample suite", () => {
  test("Test dropdowns ", async ({ page }) => {
    const selectCountry = page.getByTestId("country-select");

    await selectCountry.selectOption("us");

    await selectCountry.selectOption({ label: "Canada" });

    await selectCountry.selectOption({ index: 2 });

    const selectSkills = page.getByTestId("skills-trigger");
    await selectSkills.click();

    await page.getByTestId("skill-javascript").click();

    const skillsMenu = page.getByTestId("skills-menu");
    await skillsMenu.getByText("Python").click();

    await skillsMenu.locator('[data-value="java"]').click();
  });

  test("Test radios and checks", async ({ page }) => {
    await page
      .locator(".radio-group .radio-label", {
        hasText: /intermediate \(2-5 years\)/i,
      })
      .click();

    await page
      .locator(
        "#test-form > section:nth-child(3) > fieldset > div > label:nth-child(3) > span"
      )
      .check();

    await page
      .locator(
        "#test-form > section:nth-child(4) > fieldset > div > label:nth-child(1) > span"
      )
      .check();

    await page
      .locator(
        "#test-form > section:nth-child(4) > fieldset > div > label:nth-child(1) > span"
      )
      .uncheck();
  });

  test(
    "Test date pickers ",
    {
      annotation: {
        type: "Issue",
        description: "https://github.com/microsoft/playwright/issues/23180",
      },
    },
    async ({ page }) => {
      await page.getByTestId("birth-date-picker").fill("2025-12-25");

      await page.getByTestId("datetime-picker").fill("2020-01-02T14:30");

      await page.getByTestId("custom-calendar-input").click();
      const prevMonth = page.getByTestId("prev-month");
      const nextMonth = page.getByTestId("next-month");

      await prevMonth.click();
      await nextMonth.click();

      const calGrid = page.getByTestId("calendar-grid");

      await calGrid.getByText("31").click();
    }
  );

  test("Test autosuggest forms", async ({ page }) => {
    const techField = page.getByTestId("technology-search");
    const sugList = page.getByTestId("suggestions-list");

    await techField.fill("java");
    await sugList.getByText("JavaScript").click();

    const locField = page.getByTestId("location-search");

    await locField.fill("san");

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
  });
});
