import { test, expect } from "@/fixtures";
import { save } from "@/data/test-data";

// FR-29 · FR-30 · US-05 · NFR-A11Y-04 · NFR-A11Y-05: volume and mute are remembered between sessions; reset asks
// first; the reduced-motion preference is said out loud instead of silently changing behaviour.

test("tắt toàn bộ âm thanh làm mờ hai thanh âm lượng và được nhớ sau khi tải lại", { tag: ["@TC-SETTINGS-001", "@smoke"] }, async ({
  menuPage,
  settingsPage,
}) => {
  await menuPage.goto();
  await menuPage.openSettings();
  await expect(settingsPage.muteSwitch()).not.toBeChecked();
  await settingsPage.muteSwitch().check();
  await expect(settingsPage.musicSlider()).toBeDisabled();
  await expect(settingsPage.sfxSlider()).toBeDisabled();
  await menuPage.reload();
  await menuPage.openSettings();
  await expect(settingsPage.muteSwitch()).toBeChecked();
  expect((await settingsPage.storedSave())?.muted).toBe(true);
});

test("âm lượng nhạc nền và hiệu ứng được nhớ sau khi tải lại", { tag: ["@TC-SETTINGS-002"] }, async ({
  menuPage,
  settingsPage,
}) => {
  await menuPage.goto();
  await menuPage.openSettings();
  await expect(settingsPage.musicSlider()).toHaveValue("50");
  await expect(settingsPage.sfxSlider()).toHaveValue("80");
  await settingsPage.setSlider(settingsPage.musicSlider(), 20);
  await settingsPage.setSlider(settingsPage.sfxSlider(), 0);
  await menuPage.reload();
  await menuPage.openSettings();
  await expect(settingsPage.musicSlider()).toHaveValue("20");
  await expect(settingsPage.sfxSlider()).toHaveValue("0");
});

test("XOÁ TIẾN ĐỘ hỏi lại trước, HUỶ giữ nguyên tiến độ", { tag: ["@TC-SETTINGS-003", "@smoke"] }, async ({
  menuPage,
  settingsPage,
}) => {
  const progress = save({ bestDistanceM: 321, coins: 50, ownedCharacters: ["runner", "bruiser"] });
  await menuPage.seedSave(progress);
  await menuPage.goto();
  await menuPage.openSettings();
  await settingsPage.resetButton().click();
  await expect(settingsPage.resetQuestion()).toBeVisible();
  await settingsPage.cancelResetButton().click();
  await expect(settingsPage.resetQuestion()).toBeHidden();
  await expect(settingsPage.resetButton()).toBeVisible();
  expect(await settingsPage.storedSave()).toEqual(progress);
});

test("xác nhận XOÁ đưa kỷ lục, ví và nhân vật về mặc định", { tag: ["@TC-SETTINGS-004"] }, async ({
  menuPage,
  settingsPage,
}) => {
  await menuPage.seedSave(
    save({ bestDistanceM: 321, coins: 50, ownedCharacters: ["runner", "bruiser"], selectedCharacter: "bruiser" }),
  );
  await menuPage.goto();
  await menuPage.openSettings();
  await settingsPage.resetButton().click();
  await settingsPage.confirmResetButton().click();
  const stored = await settingsPage.storedSave();
  expect(stored).toMatchObject({ bestDistanceM: 0, coins: 0, ownedCharacters: ["runner"], selectedCharacter: "runner" });
  await settingsPage.backButton().click();
  await expect(menuPage.bestDistance()).toHaveText("0 m");
  await expect(menuPage.wallet()).toHaveText("0");
});

test("hệ thống bật giảm chuyển động thì cài đặt nói rõ hiệu ứng trang trí đã tắt", { tag: ["@TC-SETTINGS-005"] }, async ({
  page,
  menuPage,
  settingsPage,
}) => {
  await menuPage.goto();
  await menuPage.openSettings();
  await expect(settingsPage.reducedMotionNote()).toHaveCount(0);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await menuPage.reload();
  await menuPage.openSettings();
  await expect(settingsPage.reducedMotionNote()).toBeVisible();
});
