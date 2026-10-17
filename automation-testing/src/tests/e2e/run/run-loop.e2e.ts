import { test, expect } from "@/fixtures";
import { RUNS } from "@/data/test-data";

// FR-01 · FR-06 · FR-07 · FR-08 · FR-12 · US-01: a run starts from PLAY, runs by itself, counts distance and coins on
// the HUD, and ends on the first collision. Every run here is seeded and driven by a frozen clock (startRun).

test("bấm CHƠI mở HUD với 0 m, 0 xu, nút tạm dừng và nút kỹ năng", { tag: ["@TC-RUN-001", "@smoke"] }, async ({
  startRun,
  playPage,
}) => {
  await startRun(RUNS.plain.seed);
  await expect(playPage.hud()).toBeVisible();
  await expect(playPage.distance()).toHaveText("0");
  await expect(playPage.coins()).toHaveText("0");
  await expect(playPage.pauseButton()).toBeVisible();
  await expect(playPage.skillButton()).toBeVisible();
  await expect(playPage.canvas()).toBeVisible();
});

test("quãng đường tăng dần khi không chạm gì", { tag: ["@TC-RUN-002", "@smoke"] }, async ({ startRun, playPage }) => {
  await startRun(RUNS.plain.seed);
  await playPage.advance(1000);
  const first = await playPage.distanceValue();
  await playPage.advance(1000);
  const second = await playPage.distanceValue();
  expect(first).toBeGreaterThan(0);
  expect(second).toBeGreaterThan(first);
});

test("không né thì va chạm kết thúc lượt và hiện màn kết thúc", { tag: ["@TC-RUN-003", "@smoke"] }, async ({
  startRun,
  runUntilOver,
  playPage,
  gameOverPage,
}) => {
  await startRun(RUNS.plain.seed);
  await runUntilOver();
  await expect(gameOverPage.retryButton()).toBeVisible();
  await expect(playPage.hud()).toBeHidden();
  expect((await gameOverPage.result()).distance).toBeGreaterThan(0);
});

test("cùng seed và cùng input cho cùng kết quả", { tag: ["@TC-RUN-004"] }, async ({
  page,
  startRun,
  runUntilOver,
  playPage,
  gameOverPage,
}) => {
  const results = [];
  for (let i = 0; i < 2; i++) {
    await startRun(RUNS.laneAndJump.seed);
    await playPage.advance(RUNS.laneAndJump.laneAtMs);
    await playPage.press("ArrowLeft");
    await runUntilOver();
    results.push(await gameOverPage.result());
    await page.goto("about:blank");
  }
  expect(results[1]!.distance).toBe(results[0]!.distance);
  expect(results[1]!.coins).toBe(results[0]!.coins);
});

test("số xu trên HUD bằng số xu của lượt ở màn kết thúc", { tag: ["@TC-RUN-005"] }, async ({
  startRun,
  playPage,
  gameOverPage,
}) => {
  await startRun(RUNS.laneAndJump.seed);
  let hudCoins = 0;
  for (let t = 0; t < 60_000 && !(await gameOverPage.retryButton().isVisible()); t += 100) {
    hudCoins = await playPage.coinValue();
    await playPage.advance(100);
  }
  await expect(gameOverPage.retryButton()).toBeVisible();
  const { coins } = await gameOverPage.result();
  expect(coins).toBeGreaterThan(0);
  expect(coins).toBe(hudCoins);
});

test("tốc độ tăng dần: quãng đường 2,5 giây sau dài hơn 2,5 giây đầu", { tag: ["@TC-RUN-006"] }, async ({
  startRun,
  playPage,
}) => {
  // Seed 1 with its jump lives past 8.5 s, so [6 s, 8.5 s] is still the same run, with no other input.
  const { seed, jumpAtMs } = RUNS.laneAndJump;
  await startRun(seed);
  await playPage.advance(2500);
  const early = await playPage.distanceValue();
  await playPage.advance(jumpAtMs - 2500);
  await playPage.press("ArrowUp");
  await playPage.advance(6000 - jumpAtMs);
  const atSix = await playPage.distanceValue();
  await playPage.advance(2500);
  const late = (await playPage.distanceValue()) - atSix;
  await expect(playPage.hud()).toBeVisible();
  expect(late).toBeGreaterThan(early);
});
