import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { CHARGE_COINS, RUNS } from "@/data/test-data";

// FR-14 · FR-15 · US-03 · MASTER §7.5: coins fill the charge meter; the skill button says it is not ready, and when
// pressed early it answers with a nudge instead of silence. A full meter and the skill effects themselves are proven
// by client/tests/game/effects.test.ts (decisions/skill.md Q1).

test("đầu lượt nút kỹ năng ở trạng thái ĐANG NẠP và thanh nạp rỗng", { tag: ["@TC-SKILL-001", "@smoke"] }, async ({
  startRun,
  playPage,
}) => {
  await startRun(RUNS.plain.seed);
  await expect(playPage.skillLabel()).toHaveText(copy.hud.skillCharging);
  expect(await playPage.chargePercent()).toBe(0);
});

test("mỗi xu nhặt được làm đầy thêm một phần mười tám thanh nạp", { tag: ["@TC-SKILL-002"] }, async ({
  startRun,
  playPage,
  gameOverPage,
}) => {
  await startRun(RUNS.plain.seed);
  for (let t = 0; t < 30_000 && (await playPage.coinValue()) < 2; t += 100) {
    if (await gameOverPage.retryButton().isVisible()) break;
    await playPage.advance(100);
  }
  const coins = await playPage.coinValue();
  expect(coins).toBeGreaterThanOrEqual(1);
  expect(await playPage.chargePercent()).toBe(Math.round((coins / CHARGE_COINS) * 100));
  await expect(playPage.skillLabel()).toHaveText(copy.hud.skillCharging);
});

test("bấm nút kỹ năng khi thanh chưa đầy thì nút rung báo chưa sẵn sàng", { tag: ["@TC-SKILL-003", "@smoke"] }, async ({
  startRun,
  playPage,
}) => {
  await startRun(RUNS.plain.seed);
  await playPage.advance(500);
  expect(await playPage.isNudged()).toBe(false);
  await playPage.skillButton().click();
  expect(await playPage.isNudged()).toBe(true);
  await expect(playPage.skillLabel()).toHaveText(copy.hud.skillCharging);
  await expect(playPage.hud()).toBeVisible();
});

test("Space khi thanh chưa đầy cũng báo chưa sẵn sàng", { tag: ["@TC-SKILL-004"] }, async ({ startRun, playPage }) => {
  // BUG: defects/skill.md#bug-skill-01
  test.fail();
  await startRun(RUNS.plain.seed);
  await playPage.advance(500);
  await playPage.press("Space");
  // Space reaches the game as a skill intent; the nudge is written on the next simulation step.
  await playPage.advance(100);
  expect(await playPage.isNudged()).toBe(true);
});
