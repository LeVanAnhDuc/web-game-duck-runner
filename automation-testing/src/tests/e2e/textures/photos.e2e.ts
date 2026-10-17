import { test, expect } from "@/fixtures";

// FR-39 · FR-40 · ADR-0010 · NFR-PERF-10: the two CC0 photos are a layer on top, never a condition to play. They are
// requested only after the first frame, skipped entirely under data saver, and a failed download changes nothing.

const PHOTO = /\/textures\/[^/]+\.webp$/;

test("hai ảnh nền chỉ tải sau khi game đã bấm chơi được", { tag: ["@TC-TEXTURES-001", "@smoke"] }, async ({
  page,
  menuPage,
}) => {
  // Hold the photos back: the main screen must be usable while they are still on the way.
  const held: Array<() => Promise<void>> = [];
  await page.route(PHOTO, (route) => {
    held.push(() => route.continue());
  });
  const requested: string[] = [];
  page.on("request", (r) => {
    if (PHOTO.test(new URL(r.url()).pathname)) requested.push(r.url());
  });
  await menuPage.goto();
  await expect(menuPage.playButton()).toBeEnabled();
  await expect.poll(() => requested.length).toBe(2);
  expect(await page.evaluate(() => document.body.dataset.textures)).toBeUndefined();
  await Promise.all(held.map((go) => go()));
  await expect.poll(() => page.evaluate(() => document.body.dataset.textures)).toBe("on");
});

test("bật tiết kiệm dữ liệu thì không tải ảnh nào", { tag: ["@TC-TEXTURES-002"] }, async ({
  page,
  menuPage,
  playPage,
}) => {
  const requested: string[] = [];
  page.on("request", (r) => {
    if (PHOTO.test(new URL(r.url()).pathname)) requested.push(r.url());
  });
  await menuPage.saveDataOn();
  await menuPage.goto();
  await menuPage.play();
  await expect(playPage.hud()).toBeVisible();
  await expect.poll(() => playPage.distanceValue()).toBeGreaterThan(0);
  expect(requested).toEqual([]);
});

test("ảnh tải lỗi thì game vẫn chơi được bình thường", { tag: ["@TC-TEXTURES-003"] }, async ({
  page,
  menuPage,
  playPage,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route(PHOTO, (route) => route.abort());
  await menuPage.goto();
  await menuPage.play();
  await expect.poll(() => playPage.distanceValue()).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.body.dataset.textures)).toBeUndefined();
  expect(errors).toEqual([]);
});

test("tổng dung lượng ảnh không quá 200 KB", { tag: ["@TC-TEXTURES-004"] }, async ({ page, menuPage }) => {
  const sizes: number[] = [];
  page.on("response", async (res) => {
    if (PHOTO.test(new URL(res.url()).pathname)) sizes.push((await res.body()).length);
  });
  await menuPage.goto();
  await expect.poll(() => sizes.length).toBe(2);
  expect(sizes.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(200 * 1024);
});
