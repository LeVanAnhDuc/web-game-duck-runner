// Learns the key plans of POWERUP_RUNS (src/data/test-data.ts): seeded runs that steer far enough to pick up a power-up.
// Plays the client's own rules (../client/src/game) frame by frame the way the shipped build runs under `startRun`:
//   - PLAY draws the run seed from Math.random call #PLAY_CALL of the page (BasePage.fixSeed's mulberry32);
//   - the first run frame comes FRAME_MS after PLAY, every frame feeds FRAME_MS to the FixedStepAccumulator;
//   - a key pressed between frames lands on the first rule step of the next frame;
//   - the first frame after CHƠI TIẾP runs no step (GameHost.resume zeroes lastMs) and resets the accumulator.
// Not part of the suite. Run it from the client (it needs the client's TypeScript toolchain), then paste the output:
//   cd ../client && pnpm exec vite-node ../automation-testing/scripts/learn-powerup-runs.ts -- magnet 215
//   (kind: magnet | shield | rush; seeds: the fixSeed values to try, first success wins)
// PLAY_CALL changes when the build draws more or fewer Math.random values before PLAY (e.g. a Three.js upgrade): find
// it again by logging Math.random calls in a page started like `startRun`, and check that RUNS.laneAndJump (seed 1)
// still ends at 57 m with no input.
import { FixedStepAccumulator } from "../../client/src/core/loop";
import { Game } from "../../client/src/game/Game";

const FRAME_MS = 64;
const PLAY_CALL = 627;
type Key = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";
type Plan = Map<number, Key>;
const KEYS: Key[] = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
const INTENT = { ArrowLeft: { lane: -1 }, ArrowRight: { lane: 1 }, ArrowUp: { jump: true }, ArrowDown: { slide: true } } as const;

function runSeedOf(fixSeed: number): number {
  let a = fixSeed >>> 0;
  let v = 0;
  for (let i = 0; i < PLAY_CALL; i++) {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    v = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  return Math.floor(v * 0x7fffffff);
}

interface Frame {
  coins: number;
  chips: string;
}
interface Run {
  end: number | null;
  frames: Frame[];
  pickups: { frame: number; kind: string }[];
  shieldBroken: number[];
  firstSpawn: number | null;
}

/** Plays `plan` for up to `max` frames. `ignore`: a power-up kind whose effect is dropped (the counterfactual run). */
function play(seed: number, plan: Plan, max: number, opts: { ignore?: string; pauseBefore?: number } = {}): Run {
  const game = new Game();
  const acc = new FixedStepAccumulator();
  const run: Run = { end: null, frames: [], pickups: [], shieldBroken: [], firstSpawn: null };
  let frame = 0;
  game.events.on("powerUpStarted", (p) => run.pickups.push({ frame, kind: p.kind }));
  game.events.on("shieldBroken", () => run.shieldBroken.push(frame));
  if (opts.ignore === "shield") game.effects.addShield = () => {};
  else if (opts.ignore) {
    const start = game.effects.start.bind(game.effects);
    game.effects.start = (kind, ms) => (kind === opts.ignore ? undefined : start(kind, ms));
  }
  game.start(seed);
  for (frame = 1; frame <= max; frame++) {
    const key = plan.get(frame);
    if (key) game.queue(INTENT[key]);
    let dt = FRAME_MS;
    if (opts.pauseBefore === frame) {
      acc.reset();
      dt = 0;
    }
    for (let i = acc.feed(dt); i > 0; i--) game.step();
    if (run.firstSpawn === null && game.track.powerUps.some((p) => p.active)) run.firstSpawn = frame;
    const chips = game.effects.list().map((e) => `${e.kind} ${Math.ceil(e.remainingMs / 1000)}s`);
    if (game.effects.hasShield) chips.push("shield");
    run.frames.push({ coins: game.scoring.coins, chips: chips.join("|") });
    if (game.phase !== "running") {
      run.end = frame;
      break;
    }
  }
  return run;
}

/** Higher is better; Infinity = picked up `kind` first and survived `extra` frames after it. */
function score(seed: number, plan: Plan, kind: string, extra: number): { value: number; run: Run } {
  const run = play(seed, plan, 3000);
  const first = run.pickups[0];
  if (first && first.kind === kind) {
    if (run.end === null || run.end > first.frame + extra) return { value: Infinity, run };
    return { value: 5000 + run.end, run };
  }
  let fail = run.end ?? 3000;
  // The power-up went by without being picked up: as bad as dying where it passed.
  if (!first && run.firstSpawn !== null) fail = Math.min(fail, run.firstSpawn + 120);
  if (first) fail = Math.min(fail, first.frame);
  return { value: fail, run };
}

/** Greedy: add the one key press (or two) in the 30 frames before the failure that pushes the failure furthest. */
function search(seed: number, kind: string, extra: number): Plan | null {
  let plan: Plan = new Map();
  let cur = score(seed, plan, kind, extra);
  for (let iter = 0; iter < 200 && cur.value !== Infinity; iter++) {
    const failAt = cur.run.end ?? cur.value;
    let best = cur;
    let bestPlan = plan;
    const tryPlan = (p: Plan) => {
      const s = score(seed, p, kind, extra);
      if (s.value > best.value) {
        best = s;
        bestPlan = p;
      }
    };
    for (let back = 1; back <= 30; back++)
      for (const k of KEYS) if (!plan.has(failAt - back) && failAt - back > 0) tryPlan(new Map(plan).set(failAt - back, k));
    if (best === cur)
      for (let back = 2; back <= 30; back++)
        for (const k1 of KEYS)
          for (let gap = 2; gap <= 10; gap += 2)
            for (const k2 of KEYS) {
              const f = failAt - back;
              if (f > 0) tryPlan(new Map(plan).set(f, k1).set(f + gap, k2));
            }
    if (best === cur) return null;
    plan = bestPlan;
    cur = best;
  }
  return cur.value === Infinity ? plan : null;
}

const [kind = "magnet", ...seeds] = process.argv.slice(2).filter((a) => a !== "--");
// Magnet: keep steering through the 7 s it lasts. Shield and rush: the specs stop pressing keys at the pickup.
const extra = kind === "magnet" ? 120 : 0;
for (const fixSeed of seeds.map(Number)) {
  const seed = runSeedOf(fixSeed);
  const plan = search(seed, kind, extra);
  if (!plan) {
    console.log(`seed ${fixSeed}: no plan found`);
    continue;
  }
  const run = play(seed, plan, 3000);
  const pickup = run.pickups[0]!.frame;
  const changes: string[] = [];
  run.frames.forEach((f, i) => {
    if (i >= pickup - 1 && f.chips !== run.frames[i - 1]?.chips) changes.push(`${i + 1}:${f.chips || "-"}`);
  });
  const without = play(seed, plan, 3000, { ignore: kind });
  const inputs = [...plan].sort((a, b) => a[0] - b[0]).map(([f, k]) => `[${f}, "${k}"]`);
  console.log(`seed ${fixSeed} → ${kind} picked up at frame ${pickup}, run ends at ${run.end}`);
  console.log(`  inputs: [${inputs.join(", ")}]`);
  console.log(`  chips: ${changes.join("  ")}`);
  console.log(`  shield broken at: ${run.shieldBroken.join(", ") || "-"}`);
  console.log(`  without the ${kind}: ends at ${without.end}; coins at each chip change: ${changes.map((c) => without.frames[Number(c.split(":")[0]) - 1]?.coins).join(", ")}`);
  console.log(`  coins with it at each chip change: ${changes.map((c) => run.frames[Number(c.split(":")[0]) - 1]?.coins).join(", ")}`);
  if (kind === "magnet") {
    const paused = play(seed, plan, 3000, { pauseBefore: pickup + 32 });
    const gone = paused.frames.findIndex((f, i) => i >= pickup && f.chips === "") + 1;
    console.log(`  paused after frame ${pickup + 31} and resumed: chip gone at frame ${gone}, run ends at ${paused.end}`);
  }
  break;
}
