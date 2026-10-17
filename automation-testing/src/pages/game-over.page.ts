import type { Locator } from "@playwright/test";
import { copy } from "@/data/copy";
import { BasePage } from "./base.page";

export interface RunResult {
  /** Distance of this run, metres. */
  distance: number;
  /** Coins picked up in this run. */
  coins: number;
  /** Wallet after this run's coins were added. */
  wallet: number;
}

/** The end-of-run panel: distance, record line, coins of this run, wallet, PLAY AGAIN / HOME. */
export class GameOverPage extends BasePage {
  panel(): Locator {
    return this.page.locator(".screen").filter({ has: this.retryButton() });
  }

  retryButton(): Locator {
    return this.page.getByRole("button", { name: copy.gameOver.retry, exact: true });
  }

  homeButton(): Locator {
    return this.page.getByRole("button", { name: copy.gameOver.home, exact: true });
  }

  newRecord(): Locator {
    return this.panel().getByText(copy.gameOver.newRecord, { exact: true });
  }

  /** "Kỷ lục <best> m", shown instead of KỶ LỤC MỚI when the run did not beat the record. */
  bestLine(): Locator {
    return this.panel().getByText(new RegExp(`^${copy.gameOver.best} `));
  }

  /** The big distance figure. */
  distance(): Locator {
    return this.panel().locator(".score-big");
  }

  async result(): Promise<RunResult> {
    const digits = (s: string) => Number(s.replace(/[^\d]/g, ""));
    const [coins, wallet] = await this.panel().locator(".split .mono").allInnerTexts();
    return {
      distance: digits(await this.distance().innerText()),
      coins: digits(coins ?? ""),
      wallet: digits(wallet ?? ""),
    };
  }
}
