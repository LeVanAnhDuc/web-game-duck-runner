import { test, expect } from "@/fixtures";

// FR-33 · NFR-SEC-07 · NFR-DATA-05 · ADR-0012: a static build that works under any base path (GitHub Pages serves it
// under /web-game-duck-runner/), loads only its own scripts, and talks to nobody but Google Fonts for its typefaces.

const FONTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

test("trang chỉ nạp script của chính site, không script bên thứ ba", { tag: ["@TC-DEPLOY-001", "@smoke"] }, async ({
  page,
  menuPage,
  baseURL,
}) => {
  const origin = new URL(baseURL!).origin;
  const scripts: string[] = [];
  page.on("request", (r) => {
    if (r.resourceType() === "script") scripts.push(r.url());
  });
  await menuPage.goto();
  expect(scripts.length).toBeGreaterThan(0);
  for (const url of scripts) expect(new URL(url).origin).toBe(origin);
  const inline = await page.evaluate(() => [...document.scripts].filter((s) => !s.src).length);
  expect(inline).toBe(0);
});

test("không request nào ra ngoài site ngoài Google Fonts", { tag: ["@TC-DEPLOY-002"] }, async ({
  page,
  menuPage,
  playPage,
  baseURL,
}) => {
  const origin = new URL(baseURL!).origin;
  const outside: string[] = [];
  page.on("request", (r) => {
    const url = r.url();
    if (url.startsWith("data:") || url.startsWith("blob:")) return;
    if (new URL(url).origin !== origin && !FONTS.test(url)) outside.push(url);
  });
  await menuPage.goto();
  await menuPage.play();
  await expect.poll(() => playPage.distanceValue()).toBeGreaterThan(0);
  expect(outside).toEqual([]);
});

test("mọi tài nguyên của trang nạp được dưới đường dẫn gốc của site", { tag: ["@TC-DEPLOY-003", "@smoke"] }, async ({
  page,
  menuPage,
  baseURL,
}) => {
  const base = baseURL!;
  const failed: string[] = [];
  const own: string[] = [];
  page.on("response", (res) => {
    if (!res.url().startsWith(new URL(base).origin)) return;
    own.push(res.url());
    if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
  });
  await menuPage.goto();
  await expect.poll(() => own.some((u) => u.endsWith(".webp"))).toBe(true);
  expect(failed).toEqual([]);
  for (const url of own) expect(url.startsWith(base)).toBe(true);
});
