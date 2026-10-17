import { test, expect } from "@/fixtures";
import { RUNS } from "@/data/test-data";

// FR-02 · FR-03 · FR-04 · README §Controls · NFR-A11Y-06: the keyboard alone plays the whole loop. What a key did is
// read from the run it produced: the same seed with no input is the baseline, and a lane change, a jump or a slide at
// the right moment gives a different run (decisions/controls.md Q1). Letter keys must give the SAME run as arrows.

type Play = (seed: number, atMs: number, key: string | null) => Promise<Outcome>;

/** What a run produced. The wallet is left out: it carries over from the previous run in the same tab. */
type Outcome = { distance: number; coins: number };

// Each test plays the same seed several times: allow for it.
test.slow();

const test2 = test.extend<{ play: Play }>({
  play: async ({ page, startRun, playPage, runUntilOver, gameOverPage }, use) =>
    use(async (seed, atMs, key) => {
      await startRun(seed);
      if (key) {
        await playPage.advance(atMs);
        await playPage.press(key);
      }
      await runUntilOver();
      const { distance, coins } = await gameOverPage.result();
      await page.goto("about:blank");
      return { distance, coins };
    }),
});

test2("mũi tên trái đổi làn và làm lượt chơi khác đi", { tag: ["@TC-CONTROLS-001", "@smoke"] }, async ({ play }) => {
  const { seed, laneAtMs } = RUNS.laneAndJump;
  const straight = await play(seed, 0, null);
  const left = await play(seed, laneAtMs, "ArrowLeft");
  const right = await play(seed, laneAtMs, "ArrowRight");
  expect(left).not.toEqual(straight);
  expect(right).not.toEqual(straight);
  expect(right).not.toEqual(left);
});

test2("A và D cho đúng lượt chơi như mũi tên trái và phải", { tag: ["@TC-CONTROLS-002"] }, async ({ play }) => {
  const { seed, laneAtMs } = RUNS.laneAndJump;
  expect(await play(seed, laneAtMs, "a")).toEqual(await play(seed, laneAtMs, "ArrowLeft"));
  expect(await play(seed, laneAtMs, "d")).toEqual(await play(seed, laneAtMs, "ArrowRight"));
});

test2("nhảy đúng lúc vượt qua chướng ngại thấp, W như mũi tên lên", { tag: ["@TC-CONTROLS-003", "@smoke"] }, async ({
  play,
}) => {
  const { seed, jumpAtMs } = RUNS.laneAndJump;
  const straight = await play(seed, 0, null);
  const jumped = await play(seed, jumpAtMs, "ArrowUp");
  expect(jumped.distance).toBeGreaterThan(straight.distance);
  expect(await play(seed, jumpAtMs, "w")).toEqual(jumped);
});

test2("trượt đúng lúc qua dưới chướng ngại cao, S như mũi tên xuống", { tag: ["@TC-CONTROLS-004", "@smoke"] }, async ({
  play,
}) => {
  const { seed, slideAtMs } = RUNS.slide;
  const straight = await play(seed, 0, null);
  const slid = await play(seed, slideAtMs, "ArrowDown");
  expect(slid.distance).toBeGreaterThan(straight.distance);
  expect(await play(seed, slideAtMs, "s")).toEqual(slid);
});

test("phím điều khiển ở màn chính không bắt đầu lượt chơi", { tag: ["@TC-CONTROLS-005"] }, async ({
  menuPage,
  playPage,
}) => {
  await menuPage.goto();
  for (const key of ["ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight", "Escape"]) await playPage.press(key);
  await expect(menuPage.playButton()).toBeVisible();
  await expect(playPage.hud()).toBeHidden();
});
