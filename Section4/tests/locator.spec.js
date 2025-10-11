import { test, expect } from "@playwright/test";

test.describe("sample suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/isolation-test.html");
  });

  test("Test getByRole ", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
  });

  test("Test more locators", async ({ page }) => {
    await expect(page.getByLabel("Name:")).toBeVisible();
    await expect(
      page.getByPlaceholder("Enter your full name (e.g., John Doe)")
    ).toBeVisible();

    await expect(page.getByText("Test Isolation Scenarios")).toBeVisible();

    await expect(page.getByAltText("Form icon")).toBeVisible();

    await expect(
      page.getByTitle("Enter a valid email address").first()
    ).toBeVisible();

    await expect(page.getByTestId("clear-button")).toBeVisible();

    await expect(page.locator("#add-todo")).toBeVisible();
    await expect(
      page.locator("#scenario-2 > div > div.form-group > button")
    ).toBeVisible();

    await expect(page.locator('//*[@id="clear-todos"]')).toBeVisible();
  });

  test("Test toggle 2 ", async ({ page }) => {
    await expect(
      page.getByRole("listitem").filter({ hasText: "Practice test isolation" })
    ).toBeVisible();

    // await expect(
    //   page
    //     .getByRole("listitem")
    //     .filter({ hasNotText: "Practice test isolation" })
    // ).toBeVisible();

    await expect(
      page
        .getByRole("listitem")
        .filter({ hasText: "Practice test isolation" })
        .getByRole("button", { name: "Toggle" })
    ).toBeVisible();

    await expect(
      page.getByTestId("todo-list").getByRole("listitem")
    ).toHaveCount(2);
  });
});
