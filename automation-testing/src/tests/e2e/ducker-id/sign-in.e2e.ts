import { test, expect } from "@/fixtures";
import { DUCKER, STORAGE, save } from "@/data/test-data";

// FR-41 · US-06 · ADR-0012: sign-in against the flag-on build (project app-auth, dev only) and a fake issuer
// (fakeIssuer) that is never resolved for real. Identity only: the game and the save do not change.

test.beforeEach(async ({ fakeIssuer }) => {
  await fakeIssuer();
});

test("đăng nhập xong thấy nút tài khoản, URL sạch và không lỗi console", { tag: ["@TC-DUCKERID-003", "@smoke"] }, async ({
  page,
  menuPage,
}) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await menuPage.goto();
  await menuPage.signIn();
  await expect(menuPage.accountButton()).toContainText(DUCKER.user.name);
  expect(new URL(page.url()).search).not.toMatch(/code=|state=/);
  expect(await page.evaluate((key) => sessionStorage.getItem(key), STORAGE.pkce)).toBeNull();
  expect(errors).toEqual([]);
});

test("menu tài khoản hiện tên, email, hồ sơ, đăng xuất và trả focus đúng chỗ", { tag: ["@TC-DUCKERID-004"] }, async ({
  page,
  menuPage,
}) => {
  await menuPage.goto();
  await menuPage.signIn();

  await menuPage.accountButton().click();
  await expect(menuPage.accountMenu().getByText(DUCKER.user.name, { exact: true })).toBeVisible();
  await expect(menuPage.accountMenu().getByText(DUCKER.user.email, { exact: true })).toBeVisible();
  await expect(menuPage.profileLink()).toHaveAttribute("href", `${DUCKER.issuer}${DUCKER.profilePath}`);
  await expect(menuPage.profileLink()).toHaveAttribute("target", "_blank");
  await expect(menuPage.profileLink()).toHaveAttribute("rel", /noopener/);

  await page.keyboard.press("Escape");
  await expect(menuPage.accountMenu()).toBeHidden();
  await expect(menuPage.accountButton()).toBeFocused();

  await menuPage.accountButton().click();
  await menuPage.signOutItem().click();
  await expect(menuPage.signInButton()).toBeFocused();
});

test("tải lại khi đang đăng nhập thì về chưa đăng nhập", { tag: ["@TC-DUCKERID-005"] }, async ({ menuPage }) => {
  await menuPage.goto();
  await menuPage.signIn();
  await menuPage.reload();
  await expect(menuPage.signInButton()).toBeEnabled();
  await expect(menuPage.accountButton()).toHaveCount(0);
});

test("state bị sửa thì về chưa đăng nhập và URL sạch", { tag: ["@TC-DUCKERID-006"] }, async ({ page, menuPage }) => {
  await menuPage.goto("code=stolen&state=evil");
  await expect(menuPage.signInButton()).toBeEnabled();
  expect(new URL(page.url()).search).toBe("");
});

test("Ducker ID từ chối thì về chưa đăng nhập và URL sạch", { tag: ["@TC-DUCKERID-007"] }, async ({
  page,
  menuPage,
  fakeIssuer,
}) => {
  await fakeIssuer("deny");
  await menuPage.goto();
  await menuPage.signInButton().click();
  await expect(menuPage.signInButton()).toBeEnabled();
  await expect(menuPage.accountButton()).toHaveCount(0);
  expect(new URL(page.url()).search).toBe("");
});

test("đã đăng nhập thì game vẫn chơi được và save không đổi", { tag: ["@TC-DUCKERID-008"] }, async ({
  menuPage,
  playPage,
}) => {
  const progress = save({ bestDistanceM: 250, coins: 40 });
  await menuPage.seedSave(progress);
  await menuPage.goto();
  await menuPage.signIn();
  expect(await menuPage.storedSave()).toEqual(progress);
  await menuPage.play();
  await expect(playPage.hud()).toBeVisible();
  await expect.poll(() => playPage.distanceValue()).toBeGreaterThan(0);
});

test("ở 375px nút đăng nhập rộng ít nhất 44 và menu tài khoản nằm trong màn hình", { tag: ["@TC-DUCKERID-009"] }, async ({
  page,
  menuPage,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await menuPage.goto();
  await expect(menuPage.signInButton()).toBeEnabled();
  const button = (await menuPage.signInButton().boundingBox())!;
  expect(button.width).toBeGreaterThanOrEqual(44);
  expect(button.height).toBeGreaterThanOrEqual(44);
  expect(await menuPage.fullyInViewport(menuPage.signInButton())).toBe(true);

  await menuPage.signIn();
  await menuPage.accountButton().click();
  await expect(menuPage.accountMenu()).toBeVisible();
  expect(await menuPage.fullyInViewport(menuPage.accountMenu())).toBe(true);
  expect(await menuPage.horizontalOverflow()).toBe(0);
});

test("phím mũi tên trong menu tài khoản chuyển giữa các mục", { tag: ["@TC-DUCKERID-010"] }, async ({
  page,
  menuPage,
}) => {
  await menuPage.goto();
  await menuPage.signIn();
  await menuPage.accountButton().click();
  await expect(menuPage.profileLink()).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menuPage.signOutItem()).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menuPage.profileLink()).toBeFocused();
  await page.keyboard.press("End");
  await expect(menuPage.signOutItem()).toBeFocused();
  await page.keyboard.press("Home");
  await expect(menuPage.profileLink()).toBeFocused();
});
