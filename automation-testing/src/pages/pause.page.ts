import type { Locator } from "@playwright/test";
import { copy } from "@/data/copy";
import { BasePage } from "./base.page";

/** The pause panel over a run. */
export class PausePage extends BasePage {
  heading(): Locator {
    return this.page.getByRole("heading", { name: copy.pause.title });
  }

  resumeButton(): Locator {
    return this.page.getByRole("button", { name: copy.pause.resume, exact: true });
  }

  homeButton(): Locator {
    return this.page.getByRole("button", { name: copy.pause.home, exact: true });
  }
}
