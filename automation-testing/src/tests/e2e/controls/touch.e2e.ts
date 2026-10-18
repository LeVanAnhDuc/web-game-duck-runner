import { test, expect } from "@/fixtures";
import { RUNS } from "@/data/test-data";
import type { PlayPage } from "@/pages/play.page";

// FR-02 · FR-03 · FR-04 · NFR-A11Y-06 · MASTER §7.5: touch is not the fallback for the keyboard — both go through one
// InputIntent, so a swipe at a moment gives exactly the run the matching arrow key gives. Real CDP touch events.

test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

type Act = (playPage: PlayPage) => Promise<void>;
type Play = (seed: number, atMs: number, act: Act | null) => Promise<Outcome>;

const key = (k: string): Act => (p) => p.press(k);
const swipe = (dx: number, dy: number): Act => (p) => p.swipe(dx, dy);

/** What a run produced. The wallet is left out: it carries over from the previous run in the same tab. */
type Outcome = { distance: number; coins: number };

// Each test plays the same seed several times: allow for it.
test.slow();

const test2 = test.extend<{ play: Play }>({
  play: async ({ page, startRun, playPage, runUntilOver, gameOverPage }, use) =>
    use(async (seed, atMs, act) => {
      await startRun(seed);
      if (act) {
        await playPage.advance(atMs);
        await act(playPage);
      }
      await runUntilOver();
      const { distance, coins } = await gameOverPage.result();
      await page.goto("about:blank");
      return { distance, coins };
    }),
});

test2("vuốt trái và phải đổi làn đúng như phím mũi tên", { tag: ["@TC-CONTROLS-006", "@smoke"] }, async ({ play }) => {
  const { seed, laneAtMs } = RUNS.laneAndJump;
  expect(await play(seed, laneAtMs, swipe(-120, 0))).toEqual(await play(seed, laneAtMs, key("ArrowLeft")));
  expect(await play(seed, laneAtMs, swipe(120, 0))).toEqual(await play(seed, laneAtMs, key("ArrowRight")));
});

test2("vuốt lên nhảy và vuốt xuống trượt đúng như phím mũi tên", { tag: ["@TC-CONTROLS-007"] }, async ({ play }) => {
  const jump = RUNS.laneAndJump;
  const slide = RUNS.slide;
  expect(await play(jump.seed, jump.jumpAtMs, swipe(0, -120))).toEqual(
    await play(jump.seed, jump.jumpAtMs, key("ArrowUp")),
  );
  expect(await play(slide.seed, slide.slideAtMs, swipe(0, 120))).toEqual(
    await play(slide.seed, slide.slideAtMs, key("ArrowDown")),
  );
});

test2("chạm không vuốt thì không đổi làn", { tag: ["@TC-CONTROLS-008"] }, async ({ play }) => {
  const { seed, laneAtMs } = RUNS.laneAndJump;
  // A move shorter than the swipe threshold (26 px) is a tap.
  expect(await play(seed, laneAtMs, swipe(-15, 0))).toEqual(await play(seed, 0, null));
});

test2("vuốt bắt đầu trên nút kỹ năng không đổi làn", { tag: ["@TC-CONTROLS-009"] }, async ({ play }) => {
  const { seed, laneAtMs } = RUNS.laneAndJump;
  // The charge meter is empty this early, so the skill itself does nothing either: the run must equal no input.
  expect(await play(seed, laneAtMs, (p) => p.swipeFromSkillButton(-120, 0))).toEqual(await play(seed, 0, null));
});

test("vuốt trên vùng chơi không cuộn hay kéo trang", { tag: ["@TC-CONTROLS-010"] }, async ({
  page,
  startRun,
  playPage,
}) => {
  await startRun(RUNS.plain.seed);
  for (const [dx, dy] of [
    [0, 160],
    [0, -160],
    [-140, 0],
  ] as const) {
    await playPage.swipe(dx, dy);
    await playPage.advance(200);
  }
  expect(await page.evaluate(() => [window.scrollX, window.scrollY])).toEqual([0, 0]);
  expect(await playPage.horizontalOverflow()).toBe(0);
  await expect(playPage.hud()).toBeVisible();
});
