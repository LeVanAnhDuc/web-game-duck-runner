import { test, expect } from "@/fixtures";
import { copy, fmt } from "@/data/copy";
import { RUNS, STORAGE, save } from "@/data/test-data";

// FR-10 · FR-13 · NFR-DATA-04 · invariants.md §8 · US-02: progress lives in one localStorage key with a version; a
// save that cannot be read falls back to defaults instead of breaking the game; an old key is still read.

test("kỷ lục và ví được lưu sau lượt và còn sau khi tải lại", { tag: ["@TC-PERSISTENCE-001", "@smoke"] }, async ({
  startRun,
  runUntilOver,
  menuPage,
  gameOverPage,
}) => {
  await startRun(RUNS.plain.seed);
  await runUntilOver();
  const { distance, wallet } = await gameOverPage.result();
  const stored = await menuPage.storedSave();
  expect(stored).toMatchObject({ version: 1, bestDistanceM: distance, coins: wallet });

  await menuPage.page.clock.resume();
  await menuPage.reload();
  await expect(menuPage.bestDistance()).toHaveText(`${fmt(distance)} ${copy.hud.metres}`);
  await expect(menuPage.wallet()).toHaveText(fmt(wallet));
});

test("save hỏng không phải JSON thì về mặc định và vẫn chơi được", { tag: ["@TC-PERSISTENCE-002", "@smoke"] }, async ({
  menuPage,
  playPage,
}) => {
  const errors: string[] = [];
  menuPage.page.on("pageerror", (e) => errors.push(e.message));
  await menuPage.seedSave("{not json");
  await menuPage.goto();
  await expect(menuPage.bestDistance()).toHaveText("0 m");
  await expect(menuPage.wallet()).toHaveText("0");
  await menuPage.play();
  await expect(playPage.hud()).toBeVisible();
  expect(errors).toEqual([]);
});

test("trường sai kiểu, âm hoặc vượt biên được thay bằng mặc định", { tag: ["@TC-PERSISTENCE-003"] }, async ({
  menuPage,
  settingsPage,
}) => {
  await menuPage.seedSave(
    JSON.stringify({ version: 1, bestDistanceM: "abc", coins: -5, musicVolume: 7, sfxVolume: null, muted: "yes" }),
  );
  await menuPage.goto();
  await expect(menuPage.bestDistance()).toHaveText("0 m");
  await expect(menuPage.wallet()).toHaveText("0");
  await menuPage.openSettings();
  await expect(settingsPage.musicSlider()).toHaveValue("100");
  await expect(settingsPage.sfxSlider()).toHaveValue("80");
  await expect(settingsPage.muteSwitch()).not.toBeChecked();
});

test("save dưới khoá cũ của game vẫn được đọc, lần ghi sau sang khoá mới", { tag: ["@TC-PERSISTENCE-004"] }, async ({
  menuPage,
  settingsPage,
}) => {
  await menuPage.seedSave(save({ bestDistanceM: 777, coins: 33 }), STORAGE.legacySave);
  await menuPage.goto();
  await expect(menuPage.bestDistance()).toHaveText(`777 ${copy.hud.metres}`);
  await expect(menuPage.wallet()).toHaveText("33");
  await menuPage.openSettings();
  await settingsPage.muteSwitch().check();
  expect(await settingsPage.storedSave()).toMatchObject({ bestDistanceM: 777, coins: 33, muted: true });
});

test("trình duyệt chặn localStorage thì game vẫn mở và chơi hết một lượt", { tag: ["@TC-PERSISTENCE-005"] }, async ({
  page,
  menuPage,
  startRun,
  runUntilOver,
  gameOverPage,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await menuPage.blockStorage();
  await startRun(RUNS.plain.seed);
  await runUntilOver();
  await expect(gameOverPage.newRecord()).toBeVisible();
  expect((await gameOverPage.result()).distance).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
