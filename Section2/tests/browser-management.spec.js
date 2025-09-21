import { test, expect, chromium, firefox, webkit } from "@playwright/test";

test.describe("Browser Management Tests", () => {
  test.describe("TC-BC-001: Create Single Browser Instance", () => {
    /*
     * TC-BC-001: Create Single Browser Instance
     * Objective: Verify that a single browser instance can be created successfully.
     * Steps:
     * 1. Launch a new browser instance using `playwright.chromium.launch()`
     * 2. Verify browser instance is created
     * 3. Close the browser
     * Expected Result: Browser launches successfully and closes without errors.
     */
    test("Launch and close browser instance successfully", async () => {
      // Launch a new browser instance
      const browser = await chromium.launch();

      // Verify browser instance is created
      expect(browser).toBeTruthy();
      expect(browser.isConnected()).toBe(true);

      // Close the browser
      await browser.close();

      // Verify browser is closed
      expect(browser.isConnected()).toBe(false);
    });

    /*
     * TC-BC-001: Browser instance has expected properties and methods
     * Objective: Verify browser instance provides expected functionality.
     * Steps:
     * 1. Launch browser instance
     * 2. Verify browser has expected methods
     * 3. Verify browser version is available
     * 4. Close browser
     * Expected Result: Browser provides all expected properties and methods.
     */
    test("Browser instance has expected properties and methods", async () => {
      const browser = await chromium.launch();

      // Verify browser has expected methods
      expect(typeof browser.newContext).toBe("function");
      expect(typeof browser.close).toBe("function");
      expect(typeof browser.isConnected).toBe("function");
      expect(typeof browser.version).toBe("function");

      // Verify browser version is available
      const version = browser.version();
      expect(version).toBeTruthy();
      expect(typeof version).toBe("string");

      await browser.close();
    });
  });

  test.describe("TC-BC-N002: Access Closed Browser", () => {
    /*
     * TC-BC-N002: Access Closed Browser
     * Objective: Verify proper error handling when trying to create context on closed browser.
     * Steps:
     * 1. Launch browser instance
     * 2. Close browser
     * 3. Attempt to create new context on closed browser
     * Expected Result: Appropriate error is thrown when accessing closed browser.
     */
    test("Error when creating context on closed browser", async () => {
      const browser = await chromium.launch();

      // Close browser
      await browser.close();
      expect(browser.isConnected()).toBe(false);

      // Attempt to create new context on closed browser
      await expect(browser.newContext()).rejects.toThrow();
    });

    /*
     * TC-BC-N002: Error when accessing closed browser properties
     * Objective: Verify proper error handling when accessing closed browser.
     * Steps:
     * 1. Launch browser instance
     * 2. Close browser
     * 3. Verify browser reports as disconnected
     * 4. Attempt operations on closed browser
     * Expected Result: Operations fail appropriately on closed browser.
     */
    test("Error when accessing closed browser properties", async () => {
      const browser = await chromium.launch();
      await browser.close();

      // Verify browser reports as disconnected
      expect(browser.isConnected()).toBe(false);

      // Attempting operations on closed browser should fail
      await expect(browser.newContext()).rejects.toThrow();
    });
  });

  test.describe("TC-BC-B001: Cross-Browser Context Behavior", () => {
    /*
     * TC-BC-B001: Cross-Browser Context Behavior
     * Objective: Verify context behavior is consistent across different browsers.
     * Steps:
     * 1. Repeat core context tests on Chromium, Firefox, and WebKit
     * 2. Compare behavior across browsers
     * 3. Verify isolation works the same way
     * Expected Result: Context behavior is consistent across all supported browsers.
     */
    test("Context creation works across all browsers", async () => {
      const browsers = [
        { name: "chromium", launcher: chromium },
        { name: "firefox", launcher: firefox },
        { name: "webkit", launcher: webkit },
      ];

      for (const { name, launcher } of browsers) {
        const browser = await launcher.launch();

        // Create context with baseURL
        const context = await browser.newContext({
          baseURL: "http://localhost:3000",
        });
        expect(context).toBeTruthy();

        // Create page
        const page = await context.newPage();
        expect(page).toBeTruthy();

        // Navigate to test page using relative URL (baseURL will be prepended)
        await page.goto("/");

        // Wait for page to load and verify title
        await page.waitForLoadState("networkidle");

        // Check if server is running and page loaded correctly
        try {
          await expect(page).toHaveTitle(/Core Concepts/, { timeout: 10000 });
        } catch (error) {
          // If title check fails, log helpful error message
          const currentTitle = await page.title();
          const currentURL = page.url();
          throw new Error(
            `Server may not be running. Expected title containing "Core Concepts" but got "${currentTitle}" at URL: ${currentURL}. Make sure to run 'npm run dev' before running tests.`
          );
        }

        // Clean up
        await context.close();
        await browser.close();
      }
    });

    /*
     * TC-BC-B001: Verify server connectivity before browser tests
     * Objective: Ensure server is running before running browser tests.
     * Steps:
     * 1. Test server connectivity using built-in request
     * 2. Verify server responds with 200 status
     * Expected Result: Server is accessible and responding.
     */
    test("Verify server connectivity before browser tests", async () => {
      // Test server connectivity using built-in request fixture
      const response = await fetch("http://localhost:3000");
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });
  });
});
