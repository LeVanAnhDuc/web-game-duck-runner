import { test, expect } from "@/fixtures";
import { RUNS } from "@/data/test-data";

// FR-31 · ADR-0005 · MASTER §5 · US-01: the camera is locked to portrait, so a wide screen frames a portrait play area
// in the middle; a phone gets the whole width, and no screen scrolls sideways.

test("màn hình rộng có khung chơi dọc ở giữa, cao bằng màn hình", { tag: ["@TC-RESPONSIVE-001", "@smoke"] }, async ({
  page,
  menuPage,
  playPage,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await menuPage.goto();
  const frame = (await playPage.frame().boundingBox())!;
  expect(frame.height).toBeGreaterThan(frame.width);
  expect(frame.height).toBeCloseTo(900, 0);
  expect(Math.abs(frame.x + frame.width / 2 - 720)).toBeLessThanOrEqual(1);
  expect(await playPage.horizontalOverflow()).toBe(0);
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
]) {
  test(`điện thoại dùng hết bề ngang và không cuộn ngang ở màn nào — ${viewport.width}px`, { tag: ["@TC-RESPONSIVE-002"] }, async ({
    page,
    menuPage,
    playPage,
    shopPage,
    settingsPage,
  }) => {
    await page.setViewportSize(viewport);
    await menuPage.goto();
    const frame = (await playPage.frame().boundingBox())!;
    // The frame keeps its portrait ratio, so it may come out a sub-pixel narrower than the screen.
    expect(Math.abs(frame.width - viewport.width)).toBeLessThanOrEqual(1);
    expect(await menuPage.horizontalOverflow()).toBe(0);
    for (const button of [menuPage.playButton(), menuPage.shopButton(), menuPage.settingsButton()]) {
      expect(await menuPage.fullyInViewport(button)).toBe(true);
    }
    await menuPage.openShop();
    await expect(shopPage.heading()).toBeVisible();
    expect(await shopPage.horizontalOverflow()).toBe(0);
    await shopPage.backButton().click();
    await menuPage.openSettings();
    await expect(settingsPage.heading()).toBeVisible();
    expect(await settingsPage.horizontalOverflow()).toBe(0);
    expect(await settingsPage.fullyInViewport(settingsPage.resetButton())).toBe(true);
  });
}

test("HUD nằm trọn trong màn hình điện thoại khi đang chơi", { tag: ["@TC-RESPONSIVE-003"] }, async ({
  page,
  startRun,
  playPage,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await startRun(RUNS.plain.seed);
  for (const part of [playPage.pauseButton(), playPage.distance(), playPage.coins(), playPage.skillButton()]) {
    expect(await playPage.fullyInViewport(part)).toBe(true);
  }
});

test("xoay ngang giữa lượt thì lượt vẫn chạy và HUD vẫn đủ", { tag: ["@TC-RESPONSIVE-004"] }, async ({
  page,
  startRun,
  playPage,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await startRun(RUNS.plain.seed);
  await playPage.advance(1000);
  const before = await playPage.distanceValue();
  await page.setViewportSize({ width: 667, height: 375 });
  await playPage.advance(1000);
  expect(await playPage.distanceValue()).toBeGreaterThan(before);
  await expect(playPage.canvas()).toBeVisible();
  for (const part of [playPage.pauseButton(), playPage.skillButton()]) {
    expect(await playPage.fullyInViewport(part)).toBe(true);
  }
});
