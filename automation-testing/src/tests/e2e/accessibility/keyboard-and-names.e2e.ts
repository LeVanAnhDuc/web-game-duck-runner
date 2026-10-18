import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { RUNS, save } from "@/data/test-data";

// NFR-A11Y-02 · NFR-A11Y-03 · NFR-A11Y-04 · NFR-A11Y-06 · FR-30: every screen outside a run works from the keyboard
// with a visible focus ring; the whole loop plays with the keyboard alone; touch targets are at least 44 px; the
// play area and the HUD buttons have names; reduced motion keeps the run intact.

test("cả vòng chơi chỉ bằng bàn phím: Tab tới CHƠI, Enter, chơi, Enter trên CHƠI LẠI", { tag: ["@TC-ACCESSIBILITY-001", "@smoke"] }, async ({
  menuPage,
  playPage,
  gameOverPage,
  runUntilOver,
}) => {
  const { seed, laneAtMs } = RUNS.laneAndJump;
  await menuPage.fixSeed(seed);
  await menuPage.saveDataOn();
  await menuPage.installClock();
  await menuPage.slowFrames();
  await menuPage.goto();
  await menuPage.freezeClock();

  await menuPage.page.keyboard.press("Tab");
  await expect(menuPage.playButton()).toBeFocused();
  await menuPage.page.keyboard.press("Enter");
  await expect(playPage.hud()).toBeVisible();
  await playPage.advance(laneAtMs);
  await playPage.press("ArrowLeft");
  await runUntilOver();

  // Focus fell to <body> when PLAY unmounted; the first Tab on the end panel lands on PLAY AGAIN.
  await menuPage.page.keyboard.press("Tab");
  await expect(gameOverPage.retryButton()).toBeFocused();
  await menuPage.page.keyboard.press("Enter");
  await expect(playPage.hud()).toBeVisible();
  await expect(playPage.distance()).toHaveText("0");
});

test("mọi nút ngoài lúc chơi nhận focus bằng Tab và có vòng focus thấy được", { tag: ["@TC-ACCESSIBILITY-002"] }, async ({
  page,
  menuPage,
  shopPage,
  settingsPage,
}) => {
  await menuPage.seedSave(save({ coins: 100 }));
  await menuPage.goto();
  const reached: string[] = [];
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Tab");
    reached.push((await menuPage.focused()).name);
    expect((await menuPage.focusOutline()).width).toBeGreaterThanOrEqual(2);
  }
  expect(reached).toEqual([copy.menu.play, copy.menu.shop, copy.menu.settings]);

  await menuPage.openShop();
  await page.keyboard.press("Tab");
  await expect(shopPage.backButton()).toBeFocused();
  expect((await shopPage.focusOutline()).width).toBeGreaterThanOrEqual(2);
  await page.keyboard.press("Tab");
  expect((await shopPage.focused()).tag).toBe("BUTTON");
  expect((await shopPage.focusOutline()).width).toBeGreaterThanOrEqual(2);

  await shopPage.backButton().click();
  await menuPage.openSettings();
  await page.keyboard.press("Tab");
  await expect(settingsPage.backButton()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(settingsPage.muteSwitch()).toBeFocused();
  expect((await settingsPage.focusOutline()).width).toBeGreaterThanOrEqual(2);
});

test("Space bấm được nút đang có focus ở màn chính, cửa hàng và cài đặt", { tag: ["@TC-ACCESSIBILITY-003"] }, async ({
  page,
  menuPage,
  shopPage,
}) => {
  // BUG: defects/accessibility.md#bug-accessibility-01
  test.fail();
  await menuPage.goto();
  await menuPage.shopButton().focus();
  await page.keyboard.press("Space");
  await expect(shopPage.heading()).toBeVisible({ timeout: 3_000 });
});

test("vùng chơi và nút HUD có tên đọc được", { tag: ["@TC-ACCESSIBILITY-004"] }, async ({ startRun, playPage }) => {
  await startRun(RUNS.plain.seed);
  await expect(playPage.canvas()).toHaveAccessibleName(copy.a11y.canvas);
  await expect(playPage.pauseButton()).toHaveAccessibleName(copy.hud.pause);
  await expect(playPage.skillButton()).toHaveAccessibleName(copy.hud.skill);
});

test("nút tạm dừng và nút kỹ năng rộng ít nhất 44×44 px trên điện thoại", { tag: ["@TC-ACCESSIBILITY-005"] }, async ({
  page,
  startRun,
  playPage,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await startRun(RUNS.plain.seed);
  for (const button of [playPage.pauseButton(), playPage.skillButton()]) {
    const box = (await button.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

test("mọi ô nhập trong cài đặt có nhãn liên kết", { tag: ["@TC-ACCESSIBILITY-006"] }, async ({
  page,
  menuPage,
  settingsPage,
}) => {
  await menuPage.goto();
  await menuPage.openSettings();
  await expect(page.locator("input")).toHaveCount(3);
  await expect(settingsPage.muteSwitch()).toHaveCount(1);
  await expect(settingsPage.musicSlider()).toHaveCount(1);
  await expect(settingsPage.sfxSlider()).toHaveCount(1);
});

test("bật giảm chuyển động thì vòng chơi vẫn chạy đủ tới màn kết thúc", { tag: ["@TC-ACCESSIBILITY-007"] }, async ({
  page,
  startRun,
  runUntilOver,
  playPage,
  gameOverPage,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await startRun(RUNS.plain.seed);
  await playPage.advance(1000);
  expect(await playPage.distanceValue()).toBeGreaterThan(0);
  await runUntilOver();
  expect((await gameOverPage.result()).distance).toBeGreaterThan(0);
});
