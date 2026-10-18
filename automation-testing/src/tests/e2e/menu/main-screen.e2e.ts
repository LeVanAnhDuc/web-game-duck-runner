import { test, expect } from "@/fixtures";
import { copy, fmt } from "@/data/copy";
import { save } from "@/data/test-data";

// FR-11 · US-01 · US-02: the main screen is the first thing a stranger sees — what the game is, one obvious way to
// start, and the record and wallet kept on this machine.

test("màn chính hiện tên game, khẩu hiệu và ba nút CHƠI, CỬA HÀNG, CÀI ĐẶT", { tag: ["@TC-MENU-001", "@smoke"] }, async ({
  page,
  menuPage,
}) => {
  await menuPage.goto();
  await expect(menuPage.title()).toHaveText(copy.titleLines.join(""));
  await expect(menuPage.tagline()).toBeVisible();
  await expect(menuPage.playButton()).toBeEnabled();
  await expect(menuPage.shopButton()).toBeEnabled();
  await expect(menuPage.settingsButton()).toBeEnabled();
  await expect(page).toHaveTitle(copy.documentTitle);
});

test("người chơi mới thấy kỷ lục 0 m và ví 0", { tag: ["@TC-MENU-002"] }, async ({ menuPage }) => {
  await menuPage.goto();
  await expect(menuPage.bestDistance()).toHaveText(`0 ${copy.hud.metres}`);
  await expect(menuPage.wallet()).toHaveText("0");
});

test("kỷ lục và ví đã lưu hiện trên màn chính, số lớn tách hàng nghìn", { tag: ["@TC-MENU-003"] }, async ({
  menuPage,
}) => {
  await menuPage.seedSave(save({ bestDistanceM: 1482, coins: 12345 }));
  await menuPage.goto();
  await expect(menuPage.bestDistance()).toHaveText(`${fmt(1482)} ${copy.hud.metres}`);
  await expect(menuPage.wallet()).toHaveText(fmt(12345));
});

test("màn chính có dòng gợi ý điều khiển", { tag: ["@TC-MENU-004"] }, async ({ menuPage }) => {
  await menuPage.goto();
  await expect(menuPage.hint()).toBeVisible();
});

test("mở trang không có lỗi console hay lỗi trang", { tag: ["@TC-MENU-005", "@smoke"] }, async ({ page, menuPage }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await menuPage.goto();
  await expect(menuPage.playButton()).toBeVisible();
  expect(errors).toEqual([]);
});

test("CỬA HÀNG và CÀI ĐẶT mở màn của chúng, Quay lại về màn chính", { tag: ["@TC-MENU-006"] }, async ({
  menuPage,
  shopPage,
  settingsPage,
}) => {
  await menuPage.goto();
  await menuPage.openShop();
  await expect(shopPage.heading()).toBeVisible();
  await shopPage.backButton().click();
  await expect(menuPage.playButton()).toBeVisible();
  await menuPage.openSettings();
  await expect(settingsPage.heading()).toBeVisible();
  await settingsPage.backButton().click();
  await expect(menuPage.playButton()).toBeVisible();
});
