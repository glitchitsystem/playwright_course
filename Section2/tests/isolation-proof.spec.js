import { test, expect } from "@playwright/test";

test.describe("Test Isolation Proof Cases", () => {
  test.describe("TC-TI-P001: Prove Counter Isolation with State Verification", () => {
    /*
     * TC-TI-P001: Prove Counter Isolation with State Verification
     * Objective: Prove that counter state doesn't leak between tests by checking actual values.
     * Steps:
     * 1. Test 1 (State Creator): Navigate to `/isolation-test.html`, Increment session counter to 7,
     *    Verify counter displays "7", Store test completion timestamp in localStorage as `test1-completed`
     * 2. Test 2 (Isolation Verifier): Navigate to `/isolation-test.html`, Verify counter displays "0" (proves isolation),
     *    Check localStorage for `test1-completed` - should be empty (proves storage isolation), Increment counter to 3, verify it shows "3"
     * Expected Result: Each test sees counter at 0, proving no state carryover.
     */
    test("Test 1 (State Creator) - Create counter state and localStorage data", async ({
      page,
    }) => {
      // Navigate to isolation test page
      await page.goto("/isolation-test.html");

      // Find any increment button (there are multiple counters on this page)
      const addTodoButton = page.locator('[data-testid="add-todo"]');
      const todoCountDisplay = page.locator('[data-testid="todo-count"]');

      // Add some todos to create state
      const todoInput = page.locator('[data-testid="todo-input"]');
      await todoInput.fill("Test Todo 1");
      await addTodoButton.click();
      await todoInput.fill("Test Todo 2");
      await addTodoButton.click();

      // Verify counter displays "2"
      await expect(todoCountDisplay).toHaveText("2");

      // Store test completion timestamp in localStorage
      await page.evaluate(() => {
        localStorage.setItem("test1-completed", new Date().toISOString());
      });

      // Verify localStorage item was set
      const timestampValue = await page.evaluate(() =>
        localStorage.getItem("test1-completed")
      );
      expect(timestampValue).toBeTruthy();
    });

    test("Test 2 (Isolation Verifier) - Verify clean state proves isolation", async ({
      page,
    }) => {
      // Navigate to isolation test page
      await page.goto("/isolation-test.html");

      const todoCountDisplay = page.locator('[data-testid="todo-count"]');

      // Verify counter displays "0" (proves isolation)
      await expect(todoCountDisplay).toHaveText("0");

      // Check localStorage for 'test1-completed' - should be empty (proves storage isolation)
      const timestampValue = await page.evaluate(() =>
        localStorage.getItem("test1-completed")
      );
      expect(timestampValue).toBeNull();

      // Add 3 todos, verify it shows "3"
      const todoInput = page.locator('[data-testid="todo-input"]');
      const addTodoButton = page.locator('[data-testid="add-todo"]');

      for (let i = 0; i < 3; i++) {
        await todoInput.fill(`Todo ${i + 1}`);
        await addTodoButton.click();
      }
      await expect(todoCountDisplay).toHaveText("3");
    });
  });

  test.describe("TC-TI-P002: Prove Form Data Isolation with Content Verification", () => {
    /*
     * TC-TI-P002: Prove Form Data Isolation with Content Verification
     * Objective: Prove form data doesn't persist by checking actual form field values.
     * Steps:
     * 1. Test 1 (Data Polluter): Navigate to `/isolation-test.html`, Fill name field with "John Doe",
     *    Fill email field with "john@example.com", Submit form and verify success message, Check that form fields still contain entered data
     * 2. Test 2 (Isolation Verifier): Navigate to `/isolation-test.html`, Assert name field value is empty: `expect(nameField).toHaveValue('')`,
     *    Assert email field value is empty: `expect(emailField).toHaveValue('')`, Assert no success message is displayed,
     *    Fill with different data: "Jane Smith", "jane@example.com", Verify only new data appears
     * Expected Result: Form fields are empty in Test 2 and Test 3, proving isolation.
     */
    test("Test 1 (Data Polluter) - Fill form and submit data", async ({
      page,
    }) => {
      // Navigate to isolation test page
      await page.goto("/isolation-test.html");

      const nameField = page.locator("#name-1");
      const emailField = page.locator("#email-1");
      const submitButton = page.locator('[data-testid="submit-button"]');
      const resultDisplay = page.locator('[data-testid="form-result"]');

      // Fill name field with "John Doe"
      await nameField.fill("John Doe");

      // Fill email field with "john@example.com"
      await emailField.fill("john@example.com");

      // Submit form and verify success message
      await submitButton.click();
      await expect(resultDisplay).toBeVisible();
      await expect(resultDisplay).toContainText("Form submitted successfully");

      // Check that form fields still contain entered data
      await expect(nameField).toHaveValue("John Doe");
      await expect(emailField).toHaveValue("john@example.com");
    });

    test("Test 2 (Isolation Verifier) - Verify form fields are empty", async ({
      page,
    }) => {
      // Navigate to isolation test page
      await page.goto("/isolation-test.html");

      const nameField = page.locator("#name-1");
      const emailField = page.locator("#email-1");
      const resultDisplay = page.locator('[data-testid="form-result"]');

      // Assert name field value is empty (proves isolation)
      await expect(nameField).toHaveValue("");

      // Assert email field value is empty (proves isolation)
      await expect(emailField).toHaveValue("");

      // Assert no success message is displayed
      await expect(resultDisplay).toBeEmpty();

      // Fill with different data: "Jane Smith", "jane@example.com"
      await nameField.fill("Jane Smith");
      await emailField.fill("jane@example.com");

      // Verify only new data appears
      await expect(nameField).toHaveValue("Jane Smith");
      await expect(emailField).toHaveValue("jane@example.com");
    });
  });
});
