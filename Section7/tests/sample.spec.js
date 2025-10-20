import { test, expect } from "@playwright/test";
import path from "path";

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
  page.goto("http://localhost:3000/windows-dialogs.html");
});

test.describe("sample suite", () => {
  test("Test windows ", async ({ page }) => {
    const [testTab] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("open-new-tab").click(),
    ]);

    await testTab.waitForLoadState();
    await expect(testTab.getByRole("heading", { level: 1 })).toHaveText(
      "New Tab Opened"
    );

    await testTab.close();
  });

  test("Test multi windows", async ({ page, context }) => {
    const [testTab] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("open-new-tab").click(),
    ]);

    const [testWindow] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("open-new-window").click(),
    ]);

    await testTab.waitForLoadState();
    await testWindow.waitForLoadState();

    expect(context.pages().length).toBe(3);
  });

  test(
    "Test iframes ",
    {
      annotation: {
        type: "Issue",
        description: "https://github.com/microsoft/playwright/issues/23180",
      },
    },
    async ({ page }) => {
      const internal = page.frameLocator("#internal-frame");

      await expect(internal.getByRole("heading", { level: 3 })).toHaveText(
        "Inside Frame Content"
      );
      await expect(
        internal.getByText("This content is loaded inside an iframe.")
      ).toBeVisible();

      await internal.getByTestId("frame-text-input").fill("Something");
      await internal.getByTestId("frame-button").click();
    }
  );

  test("Test alerts", async ({ page }) => {
    page.on("dialog", (dialog) => {
      expect(dialog.type()).toBe("alert");
      console.log("alert message:", dialog.message());
      dialog.accept();
    });
    await page.getByTestId("alert-dialog").click();
    await page.getByTestId("alert-dialog").click();
  });

  test("Test confirm", async ({ page }) => {
    page.once("dialog", (dialog) => {
      expect(dialog.type()).toBe("confirm");
      console.log("Alert appeared");
      dialog.accept();
      // dialog.dismiss();
    });

    await page.getByTestId("confirm-dialog").click();
    await page.getByTestId("confirm-dialog").click();
  });

  test("Test prompt", async ({ page }) => {
    page.on("dialog", (dialog) => {
      console.log("default:", dialog.defaultValue());
      dialog.accept("Glitchy");
    });

    await page.getByTestId("prompt-dialog").click();
  });

  test("Test upload", async ({ page }) => {
    const fileInput = page.getByTestId("single-file-upload");

    // eslint-disable-next-line no-undef
    await fileInput.setInputFiles(path.join(__dirname, "files", "myfile.pdf"));

    const multiFileInput = page.getByTestId("multiple-file-upload");

    await multiFileInput.setInputFiles([
      path.join(__dirname, "files", "image1.png"),
      path.join(__dirname, "files", "image2.png"),
    ]);

    const dropInput = page.locator("#drop-zone-input");

    await dropInput.setInputFiles(path.join(__dirname, "files", "image1.png"));
  });

  test("Test download", async ({ page }) => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("download-text-file").click();
    const download = await downloadPromise;

    await download.saveAs(
      path.join(__dirname, "downloads", download.suggestedFilename())
    );
  });
});
