import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { POWERUP_RUNS } from "@/data/test-data";

// FR-20 · coins-and-skills/design.md §5 · glossary "Khiên": the shield counts HITS, not time — its chip carries no
// seconds, it absorbs exactly one hit (the obstacle breaks, the run goes on), and the hit after that ends the run.
// No key is pressed after frame 533, so the run walks into obstacles on its own (decisions/power-up.md Q1, Q3).
// Each test replays ~35 s of play before the power-up shows up: slow on software WebGL.
test.slow();
const run = POWERUP_RUNS.shield;

test("chạy qua khiên thì HUD hiện chip Khiên không kèm số giây", { tag: ["@TC-POWERUP-004"] }, async ({
  startRun,
  playPage,
}) => {
  await startRun(run.seed);
  await playPage.playFrames(run.pickupFrame - 1, run.inputs);
  await expect(playPage.effectChips()).toHaveCount(0);
  await playPage.playFrames(run.pickupFrame, run.inputs);
  await expect(playPage.effectChips()).toHaveText([copy.hud.shield]);
  // The same label later on: nothing counts down.
  await playPage.playFrames(run.breakFrame - 1, run.inputs);
  await expect(playPage.effectChips()).toHaveText([copy.hud.shield]);
});

test("chạm chướng ngại khi có khiên thì khiên vỡ và lượt vẫn chạy tiếp", { tag: ["@TC-POWERUP-005"] }, async ({
  startRun,
  playPage,
  gameOverPage,
}) => {
  await startRun(run.seed);
  await playPage.playFrames(run.breakFrame - 1, run.inputs);
  await expect(playPage.effectChips()).toHaveText([copy.hud.shield]);
  await playPage.playFrames(run.breakFrame, run.inputs);
  await expect(playPage.effectChips()).toHaveCount(0);
  const atBreak = await playPage.distanceValue();
  await playPage.playFrames(run.endFrame - 1, run.inputs);
  await expect(gameOverPage.retryButton()).toBeHidden();
  await expect(playPage.hud()).toBeVisible();
  expect(await playPage.distanceValue()).toBeGreaterThan(atBreak);
});

test("va chạm tiếp theo sau khi khiên đã vỡ thì kết thúc lượt", { tag: ["@TC-POWERUP-006"] }, async ({
  startRun,
  playPage,
  gameOverPage,
}) => {
  await startRun(run.seed);
  await playPage.playFrames(run.endFrame - 1, run.inputs);
  await expect(gameOverPage.retryButton()).toBeHidden();
  await playPage.playFrames(run.endFrame, run.inputs);
  await expect(gameOverPage.retryButton()).toBeVisible();
});
