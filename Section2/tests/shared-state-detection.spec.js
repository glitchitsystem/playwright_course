import { test, expect } from "@playwright/test";

test.describe("TC-TI-P008: Prove Isolation Failure Detection", () => {
  test.describe("Shared State Problem Demonstration", () => {
    /*
     * TC-TI-P008: Prove Isolation Failure Detection with Shared State Page
     * Objective: Prove we can detect when isolation fails by using the problematic shared-state page.
     * Steps:
     * 1. Test 1 (Create Persistent State): Navigate to `/shared-state.html` (problematic page),
     *    Increment global counter to 15, Save persistent form data, Login user "persistent_user", Verify all state is saved to localStorage
     * 2. Test 2 (Detect Isolation Failure): Navigate to `/shared-state.html`,
     *    Expected Failure: Assert global counter is 0 (it will be 15), Expected Failure: Assert form is empty (it will have data),
     *    Expected Failure: Assert user is logged out (they will be logged in), Catch and verify these assertion failures prove isolation is broken
     * 3. Test 3 (Demonstrate Fix): Clear localStorage manually: `localStorage.clear()`, Navigate to `/shared-state.html`, Verify clean state now that storage is cleared
     * Expected Result: Test 2 fails as expected, demonstrating how shared state breaks isolation. Test 3 passes with manual cleanup.
     */
    test("Test 1 (Create Persistent State) - Pollute shared-state page", async ({
      page,
    }) => {
      // Navigate to problematic shared-state page
      await page.goto("/shared-state.html");

      // Increment global counter to 15
      const globalCounterButton = page.locator("#increment-global");
      const globalCounterDisplay = page.locator("#global-counter");

      if (await globalCounterButton.isVisible()) {
        for (let i = 0; i < 15; i++) {
          await globalCounterButton.click();
        }
        await expect(globalCounterDisplay).toHaveText("15");
      }

      // Save persistent form data
      const persistentNameInput = page.locator("#persistent-name");
      const persistentRoleSelect = page.locator("#persistent-role");
      const saveButton = page.locator("#save-persistent");

      if (await persistentNameInput.isVisible()) {
        await persistentNameInput.fill("persistent_user");
        await persistentRoleSelect.selectOption("admin");
        await saveButton.click();
      }

      // Login user "persistent_user"
      const usernameInput = page.locator("#username");
      const loginButton = page.locator("#login-btn");

      if (await usernameInput.isVisible()) {
        await usernameInput.fill("persistent_user");
        await loginButton.click();
      }

      // Verify all state is saved to localStorage
      const localStorageData = await page.evaluate(() => {
        return {
          counter: localStorage.getItem("global-counter"),
          name: localStorage.getItem("persistent-name"),
          role: localStorage.getItem("persistent-role"),
          isLoggedIn: localStorage.getItem("isLoggedIn"),
          username: localStorage.getItem("logged-in-username"),
        };
      });

      expect(localStorageData.counter).toBe("15");
      expect(localStorageData.name).toBe("persistent_user");
      expect(localStorageData.role).toBe("admin");
      expect(localStorageData.isLoggedIn).toBe("true");
      expect(localStorageData.username).toBe("persistent_user");
    });

    // This test is expected to PASS if isolation is working, FAIL if isolation is broken
    test("Test 2 (Detect Isolation Success/Failure) - Check for clean state", async ({
      page,
    }) => {
      // Navigate to shared-state page
      await page.goto("/shared-state.html");

      // If isolation is working: these assertions will PASS
      // If isolation is broken: these assertions will FAIL, proving isolation problem

      const globalCounterDisplay = page.locator("#global-counter");
      const persistentNameInput = page.locator("#persistent-name");
      const persistentRoleSelect = page.locator("#persistent-role");
      const authStatus = page.locator("#auth-status");

      // Assert global counter is 0 (will fail if isolation is broken)
      if (await globalCounterDisplay.isVisible()) {
        await expect(globalCounterDisplay).toHaveText("0");
      }

      // Assert form is empty (will fail if isolation is broken)
      if (await persistentNameInput.isVisible()) {
        await expect(persistentNameInput).toHaveValue("");
        await expect(persistentRoleSelect).toHaveValue("");
      }

      // Assert user is logged out (will fail if isolation is broken)
      if (await authStatus.isVisible()) {
        await expect(authStatus).toHaveText("Not Logged In");
      }

      // Verify localStorage is clean (will fail if isolation is broken)
      const localStorageLength = await page.evaluate(() => localStorage.length);
      expect(localStorageLength).toBe(0);
    });

    test("Test 3 (Demonstrate Fix) - Manual cleanup shows proper behavior", async ({
      page,
    }) => {
      // Navigate to shared-state page
      await page.goto("/shared-state.html");

      // Clear localStorage manually to simulate proper cleanup
      await page.evaluate(() => localStorage.clear());

      // Reload page to reflect clean state
      await page.reload();

      // Verify clean state now that storage is cleared
      const globalCounterDisplay = page.locator("#global-counter");
      const persistentNameInput = page.locator("#persistent-name");
      const persistentRoleSelect = page.locator("#persistent-role");
      const authStatus = page.locator("#auth-status");

      if (await globalCounterDisplay.isVisible()) {
        await expect(globalCounterDisplay).toHaveText("0");
      }

      if (await persistentNameInput.isVisible()) {
        await expect(persistentNameInput).toHaveValue("");
        await expect(persistentRoleSelect).toHaveValue("");
      }

      if (await authStatus.isVisible()) {
        await expect(authStatus).toHaveText("Not Logged In");
      }

      // Verify localStorage is clean
      const localStorageLength = await page.evaluate(() => localStorage.length);
      expect(localStorageLength).toBe(0);
    });
  });

  test.describe("Context Isolation Proof", () => {
    /*
     * TC-TI-P006: Prove Context Isolation with Parallel Context Verification
     * Objective: Prove different browser contexts are truly isolated by running parallel operations.
     * Steps:
     * 1. Create two browser contexts simultaneously
     * 2. Context A Operations: Navigate to `/context-a.html`, Set username "ContextA_User", theme "blue", Increment counter to 10,
     *    Set cookies via page: `context.addCookies([{name: 'context', value: 'A', domain: 'localhost'}])`
     * 3. Context B Operations (parallel): Navigate to `/context-b.html`, Set username "ContextB_User", theme "green", Increment counter to 3,
     *    Check for Context A's cookie: `expect(cookies).not.toContainEqual(expect.objectContaining({name: 'context', value: 'A'}))`
     * 4. Cross-Context Verification: In Context A: Navigate to Context B's URL, verify no Context B data,
     *    In Context B: Navigate to Context A's URL, verify no Context A data, Verify each context maintains only its own state
     * Expected Result: Contexts maintain completely separate state and cannot access each other's data.
     */
    test("Parallel Context Isolation Verification", async ({ browser }) => {
      // Create two browser contexts simultaneously
      const contextA = await browser.newContext();
      const contextB = await browser.newContext();

      try {
        const pageA = await contextA.newPage();
        const pageB = await contextB.newPage();

        // Context A operations
        await pageA.goto("/context-a.html");
        const usernameA = pageA.locator('[data-testid="username-input"]');
        const saveButtonA = pageA.locator('[data-testid="save-button"]');

        if (await usernameA.isVisible()) {
          await usernameA.fill("ContextA_User");
          // IMPORTANT: Save the state to localStorage so it persists
          if (await saveButtonA.isVisible()) {
            await saveButtonA.click();
            await pageA.waitForTimeout(100); // Wait for save operation
          }
        }

        // Context B operations (parallel)
        await pageB.goto("/context-b.html");
        const usernameB = pageB.locator('[data-testid="username-input"]');
        const saveButtonB = pageB.locator('[data-testid="save-button"]');

        if (await usernameB.isVisible()) {
          await usernameB.fill("ContextB_User");
          // IMPORTANT: Save the state to localStorage so it persists
          if (await saveButtonB.isVisible()) {
            await saveButtonB.click();
            await pageB.waitForTimeout(100); // Wait for save operation
          }
        }

        // Cross-context verification
        // Navigate Context A to Context B's URL, verify no Context B data
        await pageA.goto("/context-b.html");
        const usernameBFromA = pageA.locator('[data-testid="username-input"]');
        if (await usernameBFromA.isVisible()) {
          await expect(usernameBFromA).toHaveValue(""); // Should be empty
        }

        // Navigate Context B to Context A's URL, verify no Context A data
        await pageB.goto("/context-a.html");
        const usernameAFromB = pageB.locator('[data-testid="username-input"]');
        if (await usernameAFromB.isVisible()) {
          await expect(usernameAFromB).toHaveValue(""); // Should be empty
        }

        // Verify each context maintains only its own state
        await pageA.goto("/context-a.html");
        if (await usernameA.isVisible()) {
          await expect(usernameA).toHaveValue("ContextA_User"); // Should persist in its own context
        }

        await pageB.goto("/context-b.html");
        if (await usernameB.isVisible()) {
          await expect(usernameB).toHaveValue("ContextB_User"); // Should persist in its own context
        }
      } finally {
        // Clean up contexts
        await contextA.close();
        await contextB.close();
      }
    });
  });
});
