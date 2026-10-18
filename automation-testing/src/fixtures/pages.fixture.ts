import { ErrorPage } from "@/pages/error.page";
import { GameOverPage } from "@/pages/game-over.page";
import { MenuPage } from "@/pages/menu.page";
import { PausePage } from "@/pages/pause.page";
import { PlayPage } from "@/pages/play.page";
import { SettingsPage } from "@/pages/settings.page";
import { ShopPage } from "@/pages/shop.page";
import { MAX_RUN_MS, type Save } from "@/data/test-data";
import { test as core } from "./core.fixture";

export interface StartRunOptions {
  /** Save planted before the page loads. */
  save?: Save;
}

// One fixture per page object, named like the class in camelCase. Duck Runner is one URL: every screen is reached from
// the main screen through the UI, so specs usually take menuPage plus the screen they land on.
export const test = core.extend<{
  menuPage: MenuPage;
  playPage: PlayPage;
  pausePage: PausePage;
  gameOverPage: GameOverPage;
  shopPage: ShopPage;
  settingsPage: SettingsPage;
  errorPage: ErrorPage;
  /**
   * Seeded run on a frozen clock: fixes Math.random to `seed`, turns data saver on (no photo may race the seed),
   * installs the fake clock with a frame every 64 ms (slowFrames), opens the game, freezes time, presses PLAY. From there nothing moves until the test calls `playPage.advance(ms)`.
   */
  startRun: (seed: number, options?: StartRunOptions) => Promise<void>;
  /** Advances simulated time until the end-of-run panel is up. Fails if the run outlives MAX_RUN_MS. */
  runUntilOver: () => Promise<void>;
}>({
  menuPage: async ({ page }, use) => use(new MenuPage(page)),
  playPage: async ({ page }, use) => use(new PlayPage(page)),
  pausePage: async ({ page }, use) => use(new PausePage(page)),
  gameOverPage: async ({ page }, use) => use(new GameOverPage(page)),
  shopPage: async ({ page }, use) => use(new ShopPage(page)),
  settingsPage: async ({ page }, use) => use(new SettingsPage(page)),
  errorPage: async ({ page }, use) => use(new ErrorPage(page)),
  startRun: async ({ menuPage, playPage }, use) =>
    use(async (seed, options = {}) => {
      await menuPage.fixSeed(seed);
      await menuPage.saveDataOn();
      if (options.save) await menuPage.seedSave(options.save);
      await menuPage.installClock();
      await menuPage.slowFrames();
      await menuPage.goto();
      await menuPage.freezeClock();
      await menuPage.play();
      await playPage.hud().waitFor();
    }),
  runUntilOver: async ({ playPage, gameOverPage }, use) =>
    use(async () => {
      for (let elapsed = 0; elapsed <= MAX_RUN_MS; elapsed += 250) {
        if (await gameOverPage.retryButton().isVisible()) return;
        await playPage.advance(250);
      }
      await gameOverPage.retryButton().waitFor({ timeout: 2_000 });
    }),
});
