export class NavPage {
  constructor(page) {
    this.page = page;

    this.homeLink = page.getByRole("link", { name: "Home" }).first();
    this.contextLink = page.getByRole("link", { name: "Context" }).first();
    this.sharedStateLink = page
      .getByRole("link", { name: "Shared State" })
      .first();
    this.isolationTestLink = page
      .getByRole("link", { name: "Isolation Test" })
      .first();
    this.formControlsLink = page
      .getByRole("link", { name: "Form Controls" })
      .first();
    this.windowsDialogsLink = page.getByRole("link", {
      name: "Windows & Dialogs",
    });
    this.timeoutsWaitLink = page
      .getByRole("link", {
        name: "Timeouts & Waiting",
      })
      .first();

    this.navLink = (text) => page.getByRole("link", { name: text }).first();
  }
}
