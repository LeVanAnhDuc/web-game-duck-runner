import { test, expect } from "@/fixtures";
import { RUNS } from "@/data/test-data";

// FR-22 · US-03 · README "Pause that stops the simulation clock": pausing stops the run itself, not only the picture.

test("Esc tạm dừng: hiện TẠM DỪNG và quãng đường đứng yên dù thời gian trôi", { tag: ["@TC-PAUSE-001", "@smoke"] }, async ({
  startRun,
  playPage,
  pausePage,
}) => {
  await startRun(RUNS.plain.seed);
  await playPage.advance(1500);
  await playPage.press("Escape");
  await expect(pausePage.heading()).toBeVisible();
  const frozen = await playPage.distanceValue();
  await playPage.advance(3000);
  expect(await playPage.distanceValue()).toBe(frozen);
});

test("phím P và nút tạm dừng trên HUD cũng tạm dừng", { tag: ["@TC-PAUSE-002"] }, async ({
  startRun,
  playPage,
  pausePage,
}) => {
  await startRun(RUNS.plain.seed);
  await playPage.advance(500);
  await playPage.press("p");
  await expect(pausePage.heading()).toBeVisible();
  await pausePage.resumeButton().click();
  await expect(pausePage.heading()).toBeHidden();
  await playPage.pauseButton().click();
  await expect(pausePage.heading()).toBeVisible();
});

test("CHƠI TIẾP chạy tiếp từ đúng chỗ đã dừng", { tag: ["@TC-PAUSE-003", "@smoke"] }, async ({
  startRun,
  playPage,
  pausePage,
}) => {
  await startRun(RUNS.plain.seed);
  await playPage.advance(1500);
  await playPage.press("Escape");
  const frozen = await playPage.distanceValue();
  await pausePage.resumeButton().click();
  await expect(pausePage.heading()).toBeHidden();
  expect(await playPage.distanceValue()).toBe(frozen);
  await playPage.advance(1000);
  expect(await playPage.distanceValue()).toBeGreaterThan(frozen);
});

test("Esc lần nữa khi đang tạm dừng thì chơi tiếp", { tag: ["@TC-PAUSE-004"] }, async ({
  startRun,
  playPage,
  pausePage,
}) => {
  await startRun(RUNS.plain.seed);
  await playPage.advance(500);
  await playPage.press("Escape");
  await expect(pausePage.heading()).toBeVisible();
  await playPage.press("Escape");
  await expect(pausePage.heading()).toBeHidden();
  await expect(playPage.hud()).toBeVisible();
});

test("tạm dừng giữa chừng không đổi kết quả của lượt", { tag: ["@TC-PAUSE-005"] }, async ({
  page,
  startRun,
  runUntilOver,
  playPage,
  pausePage,
  gameOverPage,
}) => {
  test.slow();
  const { seed } = RUNS.plain;
  await startRun(seed);
  await runUntilOver();
  const straight = await gameOverPage.result();
  await page.goto("about:blank");

  await startRun(seed);
  await playPage.advance(2000);
  await playPage.press("Escape");
  await playPage.advance(5000);
  await pausePage.resumeButton().click();
  await runUntilOver();
  const paused = await gameOverPage.result();
  expect({ distance: paused.distance, coins: paused.coins }).toEqual({
    distance: straight.distance,
    coins: straight.coins,
  });
});

test("VỀ MÀN CHÍNH từ tạm dừng bỏ lượt, kỷ lục và ví không đổi", { tag: ["@TC-PAUSE-006"] }, async ({
  startRun,
  playPage,
  pausePage,
  menuPage,
}) => {
  await startRun(RUNS.plain.seed);
  await playPage.advance(3000);
  await playPage.press("Escape");
  await pausePage.homeButton().click();
  await expect(menuPage.playButton()).toBeVisible();
  await expect(playPage.hud()).toBeHidden();
  await expect(menuPage.bestDistance()).toHaveText("0 m");
  await expect(menuPage.wallet()).toHaveText("0");
  expect(await menuPage.storedSave()).toBeNull();
});
