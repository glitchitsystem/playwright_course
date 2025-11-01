export class HomePage {
  constructor(page) {
    this.page = page;

    this.card1Title = page.locator(".concept-cards .card", {
      has: page.getByRole("heading", { level: 3, name: "Browser Context" }),
    });

    this.button1 = page.getByRole("link", { name: "Explore Context" });
  }

  async clickButton1() {
    await this.button1.click();
  }
}
