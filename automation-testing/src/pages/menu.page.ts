import type { Locator } from "@playwright/test";
import { copy } from "@/data/copy";
import { BasePage } from "./base.page";

/** The main screen: wordmark, best distance, wallet, PLAY / SHOP / SETTINGS, the optional Ducker ID button, the hint. */
export class MenuPage extends BasePage {
  /** Opens the game and waits for the main screen (the loading screen is gone once PLAY is there). */
  async goto(query = ""): Promise<void> {
    await this.open(query);
    await this.playButton().waitFor();
  }

  /** Reloads and waits for the main screen again. */
  async reload(): Promise<void> {
    await this.page.reload();
    await this.playButton().waitFor();
  }

  title(): Locator {
    return this.page.getByRole("heading", { level: 1 });
  }

  tagline(): Locator {
    return this.page.getByText(copy.tagline, { exact: true });
  }

  /** `exact`: "CHƠI" is a substring of "CHƠI LẠI" / "CHƠI TIẾP". */
  playButton(): Locator {
    return this.page.getByRole("button", { name: copy.menu.play, exact: true });
  }

  shopButton(): Locator {
    return this.page.getByRole("button", { name: copy.menu.shop, exact: true });
  }

  settingsButton(): Locator {
    return this.page.getByRole("button", { name: copy.menu.settings, exact: true });
  }

  /** "<best> m" next to the trophy. */
  bestDistance(): Locator {
    return this.page.locator(".menu-stat").first();
  }

  /** The wallet next to the coin. */
  wallet(): Locator {
    return this.page.locator(".menu-stat").nth(1);
  }

  hint(): Locator {
    return this.page.getByText(copy.menu.hint, { exact: true });
  }

  async play(): Promise<void> {
    await this.playButton().click();
  }

  async openShop(): Promise<void> {
    await this.shopButton().click();
  }

  async openSettings(): Promise<void> {
    await this.settingsButton().click();
  }

  // ── Ducker ID (only with the sign-in flag on) ─────────────────────────────

  signInButton(): Locator {
    return this.page.getByRole("button", { name: copy.account.signIn, exact: true });
  }

  accountButton(): Locator {
    return this.page.getByRole("button", { name: copy.account.menuLabel });
  }

  accountMenu(): Locator {
    return this.page.getByRole("menu");
  }

  profileLink(): Locator {
    return this.page.getByRole("menuitem", { name: copy.account.openProfile });
  }

  signOutItem(): Locator {
    return this.page.getByRole("menuitem", { name: copy.account.signOut });
  }

  /** Clicks "Đăng nhập" and waits until the round trip through the issuer lands back signed in. */
  async signIn(): Promise<void> {
    await this.signInButton().click();
    await this.accountButton().waitFor();
  }
}
