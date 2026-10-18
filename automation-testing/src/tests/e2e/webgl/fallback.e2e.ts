import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { RUNS } from "@/data/test-data";

// FR-32 · NFR-REL-03 · NFR-REL-04 · US-01: without WebGL, or when the browser takes the GPU context back, the player
// reads why in words — never a black canvas or a blank page.

test("trình duyệt không có WebGL thì hiện lời giải thích thay cho màn đen", { tag: ["@TC-WEBGL-001", "@smoke"] }, async ({
  errorPage,
  menuPage,
}) => {
  await errorPage.disableWebGL();
  await errorPage.open();
  await expect(errorPage.heading()).toBeVisible();
  await expect(errorPage.message(copy.error.body)).toBeVisible();
  await expect(errorPage.retryButton()).toBeEnabled();
  await expect(menuPage.playButton()).toHaveCount(0);
});

test("THỬ LẠI tải lại trang", { tag: ["@TC-WEBGL-002"] }, async ({ page, errorPage }) => {
  await errorPage.disableWebGL();
  await errorPage.open();
  await expect(errorPage.retryButton()).toBeVisible();
  const reloaded = page.waitForEvent("load");
  await errorPage.retryButton().click();
  await reloaded;
  await expect(errorPage.heading()).toBeVisible();
});

test("mất bộ nhớ đồ hoạ giữa lượt thì lượt dừng và hiện lời giải thích", { tag: ["@TC-WEBGL-003"] }, async ({
  startRun,
  playPage,
  errorPage,
}) => {
  await startRun(RUNS.plain.seed);
  await playPage.advance(1000);
  await errorPage.loseContext();
  await expect(errorPage.heading()).toBeVisible();
  await expect(errorPage.message(copy.error.lost)).toBeVisible();
  await expect(playPage.hud()).toBeHidden();
});
