import { test, expect } from "@playwright/test";

test.describe("annotations and tags", { tag: "@regression" }, () => {
  test("Test one", async ({ page }) => {
    test.slow();
    // Add steps
  });

  test("Test two", async ({ page }) => {
    // Add steps
    expect(1).toEqual(2);
  });

  test("Test three", async ({ page, browserName }) => {
    test.skip(browserName === "firefox", "not supported");
    // Add steps
  });

  test("Test four", { tag: ["@mobile", "@smoke"] }, async ({ page }) => {
    // Add steps
  });

  test("Test five @desktop @smoke", async ({ page }) => {
    // Add steps
  });

  test(
    "Test six",
    {
      annotation: {
        type: "issue",
        description: "Jira-123",
      },
    },
    async ({ page }) => {
      // Add steps
    }
  );

  test("Test seven", async ({ page, browser }) => {
    test.info().annotations.push({
      type: "browser version",
      description: browser.version(),
    });
    // Add steps
  });
});
