import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { NavPage } from "../pages/NavPage";

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
  await page.goto("http://localhost:3000/index.html");
});

test.describe("sample suite", () => {
  test("Test home page ", async ({ page }) => {
    await expect(
      page.locator(".concept-cards .card", {
        has: page.getByRole("heading", { level: 3, name: "Browser Context" }),
      })
    ).toContainText("Browser Context");

    const card1Title = page.locator(".concept-cards .card", {
      has: page.getByRole("heading", { level: 3, name: "Browser Context" }),
    });

    await expect(card1Title).toContainText("Browser Context");
  });

  test("Test home page with POM", async ({ page }) => {
    const homePage = new HomePage(page);

    await expect(homePage.card1Title).toContainText("Browser Context");
    // await homePage.button1.click();
    await homePage.clickButton1();
  });

  test(
    "Test nav links ",
    {
      annotation: {
        type: "Issue",
        description: "https://github.com/microsoft/playwright/issues/23180",
      },
    },
    async ({ page }) => {
      const navPage = new NavPage(page);

      // await navPage.contextLink.click();
      // await navPage.formControlsLink.click();
      // await navPage.isolationTestLink.click();
      // await navPage.sharedStateLink.click();
      // await navPage.timeoutsWaitLink.click();
      // await navPage.windowsDialogsLink.click();
      // await navPage.homeLink.click();

      await navPage.navLink("Form Controls").click();
    }
  );
});
