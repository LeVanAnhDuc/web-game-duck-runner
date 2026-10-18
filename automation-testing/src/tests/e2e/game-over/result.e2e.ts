import { test, expect } from "@/fixtures";
import { copy, fmt } from "@/data/copy";
import { RUNS, save } from "@/data/test-data";

// FR-09 · FR-10 · FR-13 · US-01 · US-02 · invariants.md §11: the end of a run shows what it was worth, adds its coins
// to the wallet at the END of the run, keeps the record, and PLAY AGAIN goes straight into the next run.

test("lượt đầu tiên là kỷ lục mới, màn kết thúc hiện quãng đường, xu lượt này và ví", { tag: ["@TC-GAMEOVER-001", "@smoke"] }, async ({
  startRun,
  runUntilOver,
  gameOverPage,
}) => {
  await startRun(RUNS.plain.seed);
  await runUntilOver();
  await expect(gameOverPage.newRecord()).toBeVisible();
  await expect(gameOverPage.bestLine()).toHaveCount(0);
  const result = await gameOverPage.result();
  expect(result.distance).toBeGreaterThan(0);
  await expect(gameOverPage.distance()).toHaveText(`${fmt(result.distance)}${copy.hud.metres}`);
  expect(result.wallet).toBe(result.coins);
});

test("không phá kỷ lục thì hiện kỷ lục cũ thay cho KỶ LỤC MỚI", { tag: ["@TC-GAMEOVER-002"] }, async ({
  startRun,
  runUntilOver,
  gameOverPage,
}) => {
  await startRun(RUNS.plain.seed, { save: save({ bestDistanceM: 5000 }) });
  await runUntilOver();
  await expect(gameOverPage.newRecord()).toHaveCount(0);
  await expect(gameOverPage.bestLine()).toHaveText(`${copy.gameOver.best} ${fmt(5000)} ${copy.hud.metres}`);
});

test("xu của lượt được cộng vào ví đã có", { tag: ["@TC-GAMEOVER-003", "@smoke"] }, async ({
  startRun,
  runUntilOver,
  gameOverPage,
}) => {
  await startRun(RUNS.plain.seed, { save: save({ coins: 100 }) });
  await runUntilOver();
  const { coins, wallet } = await gameOverPage.result();
  expect(coins).toBeGreaterThan(0);
  expect(wallet).toBe(100 + coins);
});

test("CHƠI LẠI bắt đầu ngay lượt mới, không qua màn chính", { tag: ["@TC-GAMEOVER-004", "@smoke"] }, async ({
  startRun,
  runUntilOver,
  menuPage,
  playPage,
  gameOverPage,
}) => {
  await startRun(RUNS.plain.seed);
  await runUntilOver();
  await gameOverPage.retryButton().click();
  await expect(playPage.hud()).toBeVisible();
  await expect(playPage.distance()).toHaveText("0");
  await expect(playPage.coins()).toHaveText("0");
  await expect(menuPage.playButton()).toHaveCount(0);
  await playPage.advance(1000);
  expect(await playPage.distanceValue()).toBeGreaterThan(0);
});

test("bấm CHƠI LẠI hai lần thật nhanh chỉ tạo một lượt", { tag: ["@TC-GAMEOVER-005"] }, async ({
  startRun,
  runUntilOver,
  playPage,
  gameOverPage,
}) => {
  await startRun(RUNS.plain.seed);
  await playPage.advance(2000);
  const oneRunTwoSeconds = await playPage.distanceValue();
  await runUntilOver();
  await gameOverPage.retryButton().dblclick();
  await expect(playPage.hud()).toBeVisible();
  await playPage.advance(2000);
  // Two runs stacked would move the HUD at twice the pace, or restart it mid-way.
  const after = await playPage.distanceValue();
  expect(Math.abs(after - oneRunTwoSeconds)).toBeLessThanOrEqual(1);
});

test("VỀ MÀN CHÍNH hiện kỷ lục và ví mới", { tag: ["@TC-GAMEOVER-006"] }, async ({
  startRun,
  runUntilOver,
  menuPage,
  gameOverPage,
}) => {
  await startRun(RUNS.plain.seed, { save: save({ coins: 7 }) });
  await runUntilOver();
  const { distance, wallet } = await gameOverPage.result();
  await gameOverPage.homeButton().click();
  await expect(menuPage.playButton()).toBeVisible();
  await expect(menuPage.bestDistance()).toHaveText(`${fmt(distance)} ${copy.hud.metres}`);
  await expect(menuPage.wallet()).toHaveText(fmt(wallet));
});
