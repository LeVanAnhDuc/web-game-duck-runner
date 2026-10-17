import { test, expect } from "@/fixtures";
import { STORAGE } from "@/data/test-data";

// FR-41 · ADR-0012 · NFR-DATA-05: with the flag off (the default build, and the deployed one) the sign-in feature
// leaves no trace — no button, no request outside the site, no storage, and a stray ?code= is not touched.

const FONTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

test("cờ tắt thì không có nút đăng nhập và không request nào ra ngoài", { tag: ["@TC-DUCKERID-001", "@smoke"] }, async ({
  page,
  baseURL,
  menuPage,
}) => {
  const origin = new URL(baseURL!).origin;
  const outside: string[] = [];
  page.on("request", (r) => {
    // Google Fonts predates the feature and is allowed by NFR-DATA-05
    if (!r.url().startsWith(origin) && !r.url().startsWith("data:") && !FONTS.test(r.url())) outside.push(r.url());
  });
  await menuPage.goto();
  await expect(menuPage.signInButton()).toHaveCount(0);
  await expect(menuPage.accountButton()).toHaveCount(0);
  expect(outside).toEqual([]);
  expect(await page.evaluate((key) => sessionStorage.getItem(key), STORAGE.pkce)).toBeNull();
});

test("cờ tắt thì code và state lạ trên URL được để yên", { tag: ["@TC-DUCKERID-002"] }, async ({ page, menuPage }) => {
  await menuPage.goto("code=abc&state=xyz");
  await expect(menuPage.playButton()).toBeVisible();
  expect(new URL(page.url()).search).toBe("?code=abc&state=xyz");
});
