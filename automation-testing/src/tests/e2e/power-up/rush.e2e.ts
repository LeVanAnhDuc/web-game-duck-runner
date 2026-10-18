import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { POWERUP_RUNS } from "@/data/test-data";

// FR-21 · coins-and-skills/design.md §5 · glossary "Tua nhanh": the speed rush lasts 4.5 s (catalog
// POWERUP_DURATION_MS), makes the duck break through obstacles and speeds the world up (RUSH_FACTOR 1.45). No key is
// pressed after frame 534; without the rush this run ends at frame 566 (decisions/power-up.md Q1, Q4).
// Each test replays ~35 s of play before the power-up shows up: slow on software WebGL.
test.slow();
const run = POWERUP_RUNS.rush;
const chip = (seconds: number) => `${copy.hud.rush} ${seconds}s`;

test("chạy qua tua nhanh thì chip Tua nhanh đếm ngược từ 5s rồi biến mất", { tag: ["@TC-POWERUP-007"] }, async ({
  startRun,
  playPage,
}) => {
  await startRun(run.seed);
  await playPage.playFrames(run.pickupFrame - 1, run.inputs);
  await expect(playPage.effectChips()).toHaveCount(0);
  await playPage.playFrames(run.pickupFrame, run.inputs);
  // 4.5 s left, shown rounded up.
  await expect(playPage.effectChips()).toHaveText([chip(5)]);
  await playPage.playFrames(run.expiredFrame - 1, run.inputs);
  await expect(playPage.effectChips()).toHaveText([chip(1)]);
  await playPage.playFrames(run.expiredFrame, run.inputs);
  await expect(playPage.effectChips()).toHaveCount(0);
});

test("đang tua nhanh thì chạm chướng ngại không kết thúc lượt, hết tua nhanh thì có", { tag: ["@TC-POWERUP-008"] }, async ({
  startRun,
  playPage,
  gameOverPage,
}) => {
  await startRun(run.seed);
  await playPage.playFrames(run.endWithoutRushFrame + 10, run.inputs);
  await expect(gameOverPage.retryButton()).toBeHidden();
  await playPage.playFrames(run.expiredFrame - 1, run.inputs);
  await expect(gameOverPage.retryButton()).toBeHidden();
  await expect(playPage.effectChips()).toHaveText([chip(1)]);
  await playPage.playFrames(run.endFrame, run.inputs);
  await expect(gameOverPage.retryButton()).toBeVisible();
});

test("tua nhanh làm quãng đường tăng nhanh hơn rõ rệt", { tag: ["@TC-POWERUP-009"] }, async ({ startRun, playPage }) => {
  await startRun(run.seed);
  // About one second (16 frames) just before the pickup, then one second inside the rush.
  await playPage.playFrames(run.pickupFrame - 16, run.inputs);
  const before0 = await playPage.distanceValue();
  await playPage.playFrames(run.pickupFrame, run.inputs);
  const before = (await playPage.distanceValue()) - before0;
  await playPage.playFrames(run.pickupFrame + 16, run.inputs);
  const during0 = await playPage.distanceValue();
  await playPage.playFrames(run.pickupFrame + 32, run.inputs);
  const during = (await playPage.distanceValue()) - during0;
  // RUSH_FACTOR is 1.45; the normal speed ramp adds ~2 % over these two seconds.
  expect(during / before).toBeGreaterThan(1.3);
});
