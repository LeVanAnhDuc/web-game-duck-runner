import type { Locator } from "@playwright/test";
import { copy } from "@/data/copy";
import { BasePage } from "./base.page";

/** The shop: wallet, one card per duck (silhouette, name, skill, price, BUY / CHOOSE / IN USE / short by N). */
export class ShopPage extends BasePage {
  heading(): Locator {
    return this.page.getByRole("heading", { name: copy.shop.title });
  }

  backButton(): Locator {
    return this.page.getByRole("button", { name: copy.shop.back, exact: true });
  }

  /** The wallet line above the cards. */
  wallet(): Locator {
    return this.page.locator(".screen > .menu-stat .mono");
  }

  cards(): Locator {
    return this.page.locator(".card");
  }

  /** The card whose name is `name` (name as shown, e.g. "Thợ ủi"). */
  card(name: string): Locator {
    return this.cards().filter({ has: this.page.getByText(name, { exact: true }) });
  }

  buyButton(name: string): Locator {
    return this.card(name).getByRole("button", { name: copy.shop.buy, exact: true });
  }

  equipButton(name: string): Locator {
    return this.card(name).getByRole("button", { name: copy.shop.equip, exact: true });
  }

  equippedLabel(name: string): Locator {
    return this.card(name).getByText(copy.shop.equipped, { exact: true });
  }

  shortfall(name: string, n: number): Locator {
    return this.card(name).getByText(copy.shop.short(n), { exact: true });
  }

  skillLine(name: string): Locator {
    return this.card(name).getByText(new RegExp(`^${copy.shop.skillLabel}: `));
  }

  /** The price line of a card that is not owned yet. */
  price(name: string): Locator {
    return this.card(name).locator(".card-price");
  }

  async walletValue(): Promise<number> {
    return Number((await this.wallet().innerText()).replace(/\s/g, ""));
  }
}
