import { test, expect } from "@/fixtures";
import { RUNS, save } from "@/data/test-data";

// FR-27 · FR-28 · FR-29 · US-05 · ADR-0008: every sound is synthesised with Web Audio. Nothing exists before the first
// interaction (the AudioContext is created by PLAY), music starts with the run, and "mute everything" means no sound
// source is ever created. Read through an AudioContext wrapper (BasePage.instrumentAudio), not by listening.

test("không có âm thanh nào trước khi bấm CHƠI", { tag: ["@TC-AUDIO-001", "@smoke"] }, async ({
  menuPage,
  settingsPage,
}) => {
  await menuPage.instrumentAudio();
  await menuPage.goto();
  await menuPage.openSettings();
  await settingsPage.backButton().click();
  await expect(menuPage.playButton()).toBeVisible();
  expect(await menuPage.audioStats()).toEqual({ contexts: 0, sources: 0 });
});

test("bấm CHƠI mở âm thanh và nhạc nền bắt đầu", { tag: ["@TC-AUDIO-002"] }, async ({ menuPage, startRun }) => {
  await menuPage.instrumentAudio();
  await startRun(RUNS.plain.seed);
  const stats = await menuPage.audioStats();
  expect(stats.contexts).toBe(1);
  expect(stats.sources).toBeGreaterThan(0);
});

test("tắt toàn bộ âm thanh thì cả lượt không phát âm nào", { tag: ["@TC-AUDIO-003", "@smoke"] }, async ({
  menuPage,
  playPage,
  startRun,
  runUntilOver,
}) => {
  await menuPage.instrumentAudio();
  await startRun(RUNS.plain.seed, { save: save({ muted: true }) });
  await playPage.advance(1000);
  await playPage.press("ArrowUp");
  await playPage.press("ArrowDown");
  await playPage.skillButton().click();
  await runUntilOver();
  expect((await menuPage.audioStats()).sources).toBe(0);
});
