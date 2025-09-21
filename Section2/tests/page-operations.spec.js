import { test, expect } from "@playwright/test";

test.describe("Page Fixture Tests", () => {
  test.describe("TC-BF-001: Basic Page Fixture Usage", () => {
    /*
     * TC-BF-001: Basic Page Fixture Usage
     * Objective: Verify the page fixture provides a functional page object.
     * Steps:
     * 1. Use page fixture in test function parameter
     * 2. Navigate to application URL using page.goto()
     * 3. Verify page loads successfully
     * 4. Perform basic page interactions
     * Expected Result: Page fixture provides fully functional page object.
     */
    test("Page fixture provides functional page object", async ({ page }) => {
      // Verify page fixture is provided
      expect(page).toBeTruthy();
      expect(typeof page.goto).toBe("function");
      expect(typeof page.locator).toBe("function");
      expect(typeof page.evaluate).toBe("function");

      // Navigate to application URL
      await page.goto("/index.html");

      // Verify page loads successfully
      await expect(page).toHaveTitle(/Core Concepts/);

      // Perform basic page interactions
      const navLinks = page.locator("nav a");
      await expect(navLinks).toHaveCount(5);
    });

    /*
     * TC-BF-004: Page Fixture Element Interaction
     * Objective: Verify page fixture enables element interactions.
     * Steps:
     * 1. Use page fixture to navigate to isolation-test page
     * 2. Fill form using page.fill()
     * 3. Click buttons using page.click()
     * 4. Verify interactions work correctly
     * Expected Result: Page fixture provides full interaction capabilities.
     */
    test("Page fixture navigation and interaction", async ({ page }) => {
      // Navigate to isolation test page
      await page.goto("/isolation-test.html");
      await expect(page).toHaveTitle(/Test Isolation/);

      // Interact with form elements
      const nameInput = page.locator("#name-1");
      const emailInput = page.locator("#email-1");

      await nameInput.fill("Test User");
      await emailInput.fill("test@example.com");

      // Verify interactions work
      await expect(nameInput).toHaveValue("Test User");
      await expect(emailInput).toHaveValue("test@example.com");
    });
  });

  test.describe("TC-BF-003: Page Fixture Navigation", () => {
    /*
     * TC-BF-003: Page Fixture Navigation
     * Objective: Verify page fixture handles navigation correctly.
     * Steps:
     * 1. Use page fixture to navigate to index.html
     * 2. Navigate to context-a.html
     * 3. Navigate to isolation-test.html
     * 4. Verify navigation history and state
     * Expected Result: Page fixture handles navigation seamlessly.
     */
    test("Page fixture handles navigation correctly", async ({ page }) => {
      // Navigate to index
      await page.goto("/index.html");
      await expect(page).toHaveURL(/index.html/);

      // Navigate to context-a
      await page.goto("/context-a.html");
      await expect(page).toHaveURL(/context-a.html/);

      // Navigate to isolation-test
      await page.goto("/isolation-test.html");
      await expect(page).toHaveURL(/isolation-test.html/);

      // Verify page loads correctly after navigation
      await expect(page).toHaveTitle(/Test Isolation/);
    });

    /*
     * TC-BF-003: Page navigation with browser history
     * Objective: Verify page fixture handles browser back/forward navigation.
     * Steps:
     * 1. Navigate through multiple pages
     * 2. Use browser back navigation
     * 3. Use browser forward navigation
     * 4. Verify navigation state is maintained
     * Expected Result: Browser history navigation works correctly.
     */
    test("Page navigation with browser history", async ({ page }) => {
      // Navigate through multiple pages
      await page.goto("/index.html");
      await page.goto("/context-a.html");
      await page.goto("/context-b.html");

      // Use browser back navigation
      await page.goBack();
      await expect(page).toHaveURL(/context-a.html/);

      // Use browser forward navigation
      await page.goForward();
      await expect(page).toHaveURL(/context-b.html/);
    });
  });

  test.describe("TC-BF-005: Page Fixture Wait Operations", () => {
    /*
     * TC-BF-005: Page Fixture Wait Operations
     * Objective: Verify page fixture supports wait operations.
     * Steps:
     * 1. Use page fixture to navigate to dynamic content page
     * 2. Use page.waitForSelector() for dynamic elements
     * 3. Use page.waitForLoadState() for page load
     * 4. Verify wait operations work correctly
     * Expected Result: Page fixture supports all wait operations.
     */
    test("Page fixture supports wait operations", async ({ page }) => {
      await page.goto("/isolation-test.html");

      // Wait for todo count selector
      await page.waitForSelector('[data-testid="todo-count"]');
      const todoCount = page.locator('[data-testid="todo-count"]');
      await expect(todoCount).toBeVisible();

      // Wait for load state
      await page.waitForLoadState("networkidle");

      // Test dynamic content waiting
      const todoInput = page.locator('[data-testid="todo-input"]');
      const addTodoButton = page.locator('[data-testid="add-todo"]');

      await todoInput.fill("Test Todo");
      await addTodoButton.click();

      // Wait for content change
      await expect(todoCount).toHaveText("1");
    });
  });
});
