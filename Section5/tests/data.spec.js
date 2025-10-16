import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/isolation-test.html");
});

test.describe("sample suite", () => {
  test("Test data entry ", async ({ page }) => {
    await page.getByTitle("Please enter your full name").click();
    await page.keyboard.type("Bob Jones");
    await page.keyboard.press("Control+A"); // select all
    await page.keyboard.press("Control+X"); // cut
    await page.keyboard.press("Control+V"); // paste

    await page.getByTitle("Please enter a valid email address").focus();
    // await page.keyboard.type("bob@jones.com");
    await page.keyboard.insertText("bob@jones.com");
  });

  test("Test better data entry", async ({ page }) => {
    await page.getByTitle("Please enter your full name").fill("Jessie James");

    await page
      .getByTitle("Please enter a valid email address")
      .pressSequentially("jessie@james.com");

    await page.getByTestId("submit-button").press("Enter");
  });

  test("Test data retreival", async ({ page }) => {
    console.log(await page.locator("#scenario-1-heading").textContent());

    console.log(await page.locator("#isolation-heading").innerText());

    console.log(await page.locator("h3").allTextContents());

    console.log(await page.locator("h3").allInnerTexts());

    await page.getByTitle("Please enter your full name").fill("Jessie James");
    console.log(
      await page.getByTitle("Please enter your full name").inputValue()
    );
  });

  test("Test table data ", async ({ page }) => {
    await page.getByTitle("Add a new row with random data").click();
    await page.getByTitle("Add a new row with random data").click();

    const table = page.getByRole("table");

    const header = await table.getByRole("columnheader").allInnerTexts();
    console.log(header);

    const rows = table.locator("tbody tr");
    console.log(`Row Data: ${await rows.allInnerTexts()}`);

    const cell = table.locator("tbody tr").nth(1).locator("td").nth(2);
    console.log(`Cell Data: ${await cell.innerText()}`);
  });
});
