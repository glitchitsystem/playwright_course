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
  // Code
});

test.describe("sample suite", () => {
  test("Test one ", async ({ page }) => {
    // Add steps
  });

  test("Test two @smoke", async ({ page }) => {
    // Add steps
  });

  test(
    "Test three ",
    {
      annotation: {
        type: "Issue",
        description: "https://github.com/microsoft/playwright/issues/23180",
      },
    },
    async ({ page }) => {
      // ...
    }
  );
});
