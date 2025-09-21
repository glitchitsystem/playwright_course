import { test, expect } from "@playwright/test";

test.describe("Browser Context Tests", () => {
  test.describe("TC-BC-002: Create Multiple Browser Contexts", () => {
    /*
     * TC-BC-002: Create Multiple Browser Contexts
     * Objective: Verify that multiple browser contexts can be created within a single browser.
     * Steps:
     * 1. Launch a browser instance
     * 2. Create first browser context using `browser.newContext()`
     * 3. Create second browser context using `browser.newContext()`
     * 4. Verify both contexts exist independently
     * 5. Close contexts and browser
     * Expected Result: Both contexts are created successfully and operate independently.
     */
    test("Create and manage multiple contexts within single browser", async ({
      browser,
    }) => {
      // Create first browser context
      const contextA = await browser.newContext();
      expect(contextA).toBeTruthy();

      // Create second browser context
      const contextB = await browser.newContext();
      expect(contextB).toBeTruthy();

      // Verify both contexts exist independently
      expect(contextA).not.toBe(contextB);

      // Create pages in each context
      const pageA = await contextA.newPage();
      const pageB = await contextB.newPage();

      expect(pageA).toBeTruthy();
      expect(pageB).toBeTruthy();
      expect(pageA).not.toBe(pageB);

      // Clean up
      await contextA.close();
      await contextB.close();
    });

    /*
     * TC-BC-003: Navigate Different Pages in Different Contexts
     * Objective: Verify that different contexts can navigate to different pages simultaneously.
     * Steps:
     * 1. Launch browser and create two contexts
     * 2. Create page in context A, navigate to `/context-a.html`
     * 3. Create page in context B, navigate to `/context-b.html`
     * 4. Verify both pages loaded correctly
     * 5. Verify contexts maintain separate navigation history
     * Expected Result: Each context navigates independently without affecting the other.
     */
    test("Multiple contexts operate independently", async ({ browser }) => {
      const contextA = await browser.newContext();
      const contextB = await browser.newContext();

      const pageA = await contextA.newPage();
      const pageB = await contextB.newPage();

      // Navigate to different pages
      await pageA.goto("/context-a.html");
      await pageB.goto("/context-b.html");

      // Verify different page titles
      await expect(pageA).toHaveTitle(/Context A/);
      await expect(pageB).toHaveTitle(/Context B/);

      await contextA.close();
      await contextB.close();
    });
  });

  test.describe("TC-BC-004: Verify Context Storage Isolation", () => {
    /*
     * TC-BC-004: Verify Context Storage Isolation
     * Objective: Verify that localStorage and sessionStorage are isolated between contexts.
     * Steps:
     * 1. Create two browser contexts
     * 2. In context A: Navigate to shared-state page, set localStorage value
     * 3. In context B: Navigate to same page, check localStorage
     * 4. Verify context B cannot access context A's localStorage
     * Expected Result: Storage is completely isolated between contexts.
     */
    test("localStorage isolation between contexts", async ({ browser }) => {
      const contextA = await browser.newContext();
      const contextB = await browser.newContext();

      const pageA = await contextA.newPage();
      const pageB = await contextB.newPage();

      // Navigate both to same page
      await pageA.goto("/context-a.html");
      await pageB.goto("/context-a.html");

      // Set localStorage in context A
      await pageA.evaluate(() => {
        localStorage.setItem("testKey", "contextA_value");
      });

      // Verify localStorage exists in context A
      const valueA = await pageA.evaluate(() =>
        localStorage.getItem("testKey")
      );
      expect(valueA).toBe("contextA_value");

      // Verify localStorage is empty in context B
      const valueB = await pageB.evaluate(() =>
        localStorage.getItem("testKey")
      );
      expect(valueB).toBeNull();

      await contextA.close();
      await contextB.close();
    });

    /*
     * TC-BC-005: Verify Cookie Isolation Between Contexts
     * Objective: Verify that cookies are isolated between different browser contexts.
     * Steps:
     * 1. Create two browser contexts
     * 2. In context A: Set a cookie via browser or page interaction
     * 3. In context B: Navigate to same domain, check for cookie
     * 4. Verify context B doesn't have context A's cookie
     * Expected Result: Cookies are not shared between contexts.
     */
    test("Cookie isolation between contexts", async ({ browser }) => {
      const contextA = await browser.newContext();
      const contextB = await browser.newContext();

      const pageA = await contextA.newPage();
      const pageB = await contextB.newPage();

      await pageA.goto("/index.html");
      await pageB.goto("/index.html");

      // Set cookie in context A
      await contextA.addCookies([
        {
          name: "testCookie",
          value: "contextA_cookie",
          domain: "localhost",
          path: "/",
        },
      ]);

      // Verify cookie exists in context A
      const cookiesA = await contextA.cookies();
      expect(
        cookiesA.some(
          (cookie) =>
            cookie.name === "testCookie" && cookie.value === "contextA_cookie"
        )
      ).toBe(true);

      // Verify cookie doesn't exist in context B
      const cookiesB = await contextB.cookies();
      expect(cookiesB.some((cookie) => cookie.name === "testCookie")).toBe(
        false
      );

      await contextA.close();
      await contextB.close();
    });
  });

  test.describe("TC-BC-E002: Context Creation with Custom Options", () => {
    /*
     * TC-BC-E002: Context Creation with Custom Options
     * Objective: Verify context creation with specific browser context options.
     * Steps:
     * 1. Create context with custom viewport size
     * 2. Create context with specific user agent
     * 3. Create context with custom locale
     * 4. Verify each context respects its configuration
     * Expected Result: Each context operates with its specified configuration.
     */
    test("Context with custom viewport and user agent", async ({ browser }) => {
      const customContext = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: "Custom Test Agent 1.0",
      });

      const page = await customContext.newPage();

      // Verify viewport
      const viewportSize = page.viewportSize();
      expect(viewportSize.width).toBe(1280);
      expect(viewportSize.height).toBe(720);

      // Verify user agent
      await page.goto("/index.html");
      const userAgent = await page.evaluate(() => navigator.userAgent);
      expect(userAgent).toBe("Custom Test Agent 1.0");

      await customContext.close();
    });
  });
});
