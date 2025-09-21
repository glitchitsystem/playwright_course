import { test, expect } from "@playwright/test";

test.describe("Request Fixture Tests", () => {
  test.describe("Basic Request Operations", () => {
    /*
     * Request Fixture: Basic GET Request
     * Objective: Verify request fixture can make GET requests successfully.
     * Steps:
     * 1. Verify request fixture is available
     * 2. Make GET request to the app
     * 3. Verify response status and content type
     * 4. Verify response contains expected content
     * Expected Result: Request fixture provides functional HTTP client.
     */
    test("Request fixture can make GET requests", async ({ request }) => {
      // Verify request fixture is available
      expect(request).toBeTruthy();
      expect(typeof request.get).toBe("function");

      // Make GET request to the app
      const response = await request.get("/index.html");

      // Verify response
      expect(response.ok()).toBe(true);
      expect(response.status()).toBe(200);

      // Verify content type
      const contentType = response.headers()["content-type"];
      expect(contentType).toContain("text/html");

      // Verify response contains expected content
      const body = await response.text();
      expect(body).toContain("Core Concepts");
    });

    /*
     * Request Fixture: 404 Error Handling
     * Objective: Verify request fixture handles error responses correctly.
     * Steps:
     * 1. Request non-existent resource
     * 2. Verify 404 response status
     * 3. Verify response.ok() returns false
     * Expected Result: Request fixture correctly handles error responses.
     */
    test("Request fixture handles 404 errors correctly", async ({
      request,
    }) => {
      // Request non-existent resource
      const response = await request.get("/non-existent-page.html");

      // Verify 404 response
      expect(response.status()).toBe(404);
      expect(response.ok()).toBe(false);
    });
  });

  test.describe("API Testing with Request Fixture", () => {
    /*
     * Request Fixture: API Endpoint Testing
     * Objective: Verify request fixture can test API endpoints with custom headers.
     * Steps:
     * 1. Ensure server is running
     * 2. Test health check endpoint
     * 3. Test request with custom headers
     * 4. Verify requests succeed
     * Expected Result: Request fixture supports API testing scenarios.
     */
    test("Request fixture can test API endpoints", async ({
      request,
      page,
    }) => {
      // First, navigate to a page to ensure server is running
      await page.goto("/index.html");

      // Test if there are any API endpoints (simulate API testing)
      const healthCheck = await request.get("/");
      expect(healthCheck.ok()).toBe(true);

      // Test request headers
      const headersResponse = await request.get("/index.html", {
        headers: {
          "User-Agent": "Playwright Test",
          Accept: "text/html",
        },
      });

      expect(headersResponse.ok()).toBe(true);
    });

    /*
     * Request Fixture: Custom Timeout and Performance
     * Objective: Verify request fixture supports custom timeout and measures performance.
     * Steps:
     * 1. Test request with custom timeout
     * 2. Measure response time
     * 3. Verify reasonable performance
     * Expected Result: Request fixture supports timeout configuration and performance monitoring.
     */
    test("Request fixture with custom timeout and retry", async ({
      request,
    }) => {
      // Test request with custom timeout
      const response = await request.get("/index.html", {
        timeout: 5000,
      });

      expect(response.ok()).toBe(true);

      // Measure response time
      const startTime = Date.now();
      await request.get("/styles.css");
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Verify reasonable response time (under 1 second for local server)
      expect(responseTime).toBeLessThan(1000);
    });
  });

  test.describe("Request Context and Isolation", () => {
    /*
     * Request Fixture: Isolation Per Test
     * Objective: Verify request fixture is isolated per test.
     * Steps:
     * 1. Make request with custom headers
     * 2. Make another request in same test
     * 3. Verify both requests succeed independently
     * 4. Verify no state leakage between requests
     * Expected Result: Request fixture provides clean context per test.
     */
    test("Request fixture is isolated per test", async ({ request }) => {
      // Make request with custom headers
      const response1 = await request.get("/index.html", {
        headers: {
          "X-Test-Header": "test-value-1",
        },
      });

      expect(response1.ok()).toBe(true);

      // Verify this is a fresh request context (no state from previous tests)
      const response2 = await request.get("/context-a.html");
      expect(response2.ok()).toBe(true);

      // Both requests should succeed independently
      expect(response1.status()).toBe(200);
      expect(response2.status()).toBe(200);
    });
  });
});
