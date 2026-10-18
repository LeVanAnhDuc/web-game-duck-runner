import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { POWERUP_RUNS } from "@/data/test-data";

// FR-19 · README "Three power-ups on the road" · glossary "Nam châm": a magnet picked up on the road widens the coin
// pull for 7 s (catalog POWERUP_DURATION_MS) and shows as a chip with the seconds left. The run reaches it by replaying
// a learned key plan (decisions/power-up.md Q1).
// Each test replays ~35 s of play before the power-up shows up: slow on software WebGL.
test.slow();
const run = POWERUP_RUNS.magnet;
const chip = (seconds: number) => `${copy.hud.magnet} ${seconds}s`;

test("chạy qua nam châm thì HUD hiện chip Nam châm 7s", { tag: ["@TC-POWERUP-001"] }, async ({ startRun, playPage }) => {
  await startRun(run.seed);
  await playPage.playFrames(run.pickupFrame - 1, run.inputs);
  await expect(playPage.effectChips()).toHaveCount(0);
  await playPage.playFrames(run.pickupFrame, run.inputs);
  await expect(playPage.effectChips()).toHaveText([chip(7)]);
});

test("chip Nam châm đếm ngược từng giây và biến mất khi hết 7 giây", { tag: ["@TC-POWERUP-002"] }, async ({
  startRun,
  playPage,
}) => {
  await startRun(run.seed);
  await playPage.playFrames(run.pickupFrame, run.inputs);
  await expect(playPage.effectChips()).toHaveText([chip(7)]);
  await playPage.playFrames(run.pickupFrame + 32, run.inputs);
  await expect(playPage.effectChips()).toHaveText([chip(5)]);
  await playPage.playFrames(run.expiredFrame - 1, run.inputs);
  await expect(playPage.effectChips()).toHaveText([chip(1)]);
  await playPage.playFrames(run.expiredFrame, run.inputs);
  await expect(playPage.effectChips()).toHaveCount(0);
  await expect(playPage.hud()).toBeVisible();
});

test("trong 7 giây có nam châm lượt nhặt được nhiều xu hơn khi không có", { tag: ["@TC-POWERUP-003"] }, async ({
  startRun,
  playPage,
}) => {
  await startRun(run.seed);
  await playPage.playFrames(run.pickupFrame, run.inputs);
  expect(await playPage.coinValue()).toBe(run.coinsAtPickup);
  await playPage.playFrames(run.expiredFrame, run.inputs);
  expect(await playPage.coinValue()).toBeGreaterThan(run.coinsWithoutMagnet);
});

test("tạm dừng lúc nam châm đang chạy thì số giây còn lại đứng yên", { tag: ["@TC-POWERUP-010"] }, async ({
  startRun,
  playPage,
  pausePage,
}) => {
  await startRun(run.seed);
  await playPage.playFrames(run.pauseAfterFrame, run.inputs);
  await expect(playPage.effectChips()).toHaveText([chip(6)]);
  await playPage.press("Escape");
  await expect(pausePage.heading()).toBeVisible();
  // ~10 s: longer than the 5-6 s the magnet has left, so a timer that ran on would be gone by now.
  await playPage.waitFrames(157);
  await expect(playPage.effectChips()).toHaveText([chip(6)]);
  await pausePage.resumeButton().click();
  await expect(pausePage.heading()).toBeHidden();
  await playPage.playFrames(run.pausedExpiredFrame - 1, run.inputs);
  await expect(playPage.effectChips()).toHaveText([chip(1)]);
  await playPage.playFrames(run.pausedExpiredFrame, run.inputs);
  await expect(playPage.effectChips()).toHaveCount(0);
});
