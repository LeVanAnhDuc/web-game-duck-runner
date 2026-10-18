// Constants and generators for test input. No .env, no network: values only.

// client/src/data/save.ts (SAVE_KEY, LEGACY_SAVE_KEYS) · client/src/auth/config.ts (DUCKER_PKCE_KEY)
export const STORAGE = {
  save: "duck-runner.save.v1",
  legacySave: "duskrun.save.v1",
  pkce: "ducker.pkce",
} as const;

/** The save file as client/src/data/save.ts writes it. */
export interface Save {
  version: number;
  bestDistanceM: number;
  coins: number;
  ownedCharacters: string[];
  selectedCharacter: string;
  muted: boolean;
  musicVolume: number;
  sfxVolume: number;
}

// client/src/data/save.ts → DEFAULT_SAVE
export const DEFAULT_SAVE: Save = {
  version: 1,
  bestDistanceM: 0,
  coins: 0,
  ownedCharacters: ["runner"],
  selectedCharacter: "runner",
  muted: false,
  musicVolume: 0.5,
  sfxVolume: 0.8,
};

/** A save with only the given fields changed. */
export function save(patch: Partial<Save> = {}): Save {
  return { ...DEFAULT_SAVE, ownedCharacters: [...DEFAULT_SAVE.ownedCharacters], ...patch };
}

// client/src/data/catalog.ts → CHARACTERS (name as shown on the card, price in coins)
export const CHARACTERS = {
  runner: { id: "runner", name: "Lữ khách", price: 0, skill: "Chậm" },
  bruiser: { id: "bruiser", name: "Thợ ủi", price: 80, skill: "Ủi" },
  glider: { id: "glider", name: "Kẻ lượn", price: 200, skill: "Bay" },
  drifter: { id: "drifter", name: "Kẻ trôi", price: 360, skill: "Chậm" },
} as const;

// client/src/data/catalog.ts → CHARGE_COINS: coins that fill the charge meter.
export const CHARGE_COINS = 18;

/**
 * Seeded runs. A run's seed is `Math.random()` drawn when PLAY is pressed (views/Play/index.tsx), so a test that
 * replaces Math.random with a seeded generator (BasePage.fixSeed) gets the same track every time, and with the clock
 * paused (BasePage.freezeClock) and a frame every 64 ms (BasePage.slowFrames) the same input at the same simulated
 * moment gives the same run.
 *
 * The moments below were learned by playing these seeds in the shipped build (2026-10-18) and are tied to the current
 * balance (client/src/game/constants.ts, data/patterns.ts). If a balance change makes a spec that uses them fail with
 * "the input changed nothing", re-learn the moment — the expectation (an input changes the run) stays.
 */
export const RUNS = {
  /**
   * Seed 1: no input ends the run at 57 m. A change of lane 1 s in changes the run; a jump 5.9 s in (works from
   * 5.8 s to past 6 s) clears the low obstacle that ends it, and the run then lasts past 8.5 s.
   */
  laneAndJump: { seed: 1, laneAtMs: 1000, jumpAtMs: 5900 },
  /** Seed 6: no input ends the run at 70 m; a slide 7.25 s in (works from 7.1 s to 7.4 s) passes under that obstacle. */
  slide: { seed: 6, slideAtMs: 7250 },
  /** Seed 3: a plain run with no input, used where only "a run happened" matters. */
  plain: { seed: 3 },
} as const;

/** Longest a no-input run may take before the test calls it stuck (simulated ms). */
export const MAX_RUN_MS = 60_000;

// Ducker ID sign-in (flag-on build): values baked into the app-auth build by playwright.config.ts (FLAG_ON_ENV), and
// the profile the fake issuer (fixtures/issuer.fixture.ts) answers with.
export const DUCKER = {
  issuer: "http://ducker.test",
  profilePath: "/profile",
  user: { sub: "u-1", name: "Vịt Thử", email: "vit@example.com", email_verified: true },
} as const;

/** A key pressed just before run frame `frame` (frame 1 = first frame after PLAY): see PlayPage.playFrames. */
export type PlannedInput = readonly [frame: number, key: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown"];

/**
 * Runs that reach a power-up. The first power-up spawns 310–620 m in (Game.start: POWERUP_EVERY_M × 0.5–1) and is
 * picked up ~95 m later, i.e. after ~35 s of play, so a run gets there only when someone steers. These plans were
 * learned by `scripts/learn-powerup-runs.ts`, which plays the client's own rules (client/src/game) frame by frame the
 * way the shipped build does under `startRun` (PLAY draws Math.random call #627 as the run seed; first frame 64 ms
 * after PLAY; FixedStepAccumulator fed 64 ms a frame) and searches for key presses that survive to the power-up.
 * Every frame number below is an output of that script (2026-10-18 balance). If a balance or build change makes a
 * spec fail before the pickup ("chip never appeared"), re-run the script and paste its output here — the expectations
 * (what a power-up does) stay.
 */
export const POWERUP_RUNS = {
  /** Seed 215: picks up a magnet at frame 563 (7 s → chip gone at frame 673). */
  magnet: {
    seed: 215,
    inputs: [
      [135, "ArrowRight"], [311, "ArrowLeft"], [320, "ArrowDown"], [353, "ArrowUp"], [392, "ArrowLeft"],
      [412, "ArrowUp"], [424, "ArrowUp"], [436, "ArrowUp"], [507, "ArrowRight"], [528, "ArrowLeft"],
      [537, "ArrowUp"], [563, "ArrowRight"], [572, "ArrowLeft"], [590, "ArrowDown"], [655, "ArrowRight"],
      [663, "ArrowLeft"],
    ] as readonly PlannedInput[],
    pickupFrame: 563,
    /** First frame with no magnet chip. */
    expiredFrame: 673,
    /** Coins at the pickup frame — the same with or without the magnet. */
    coinsAtPickup: 24,
    /** Coins the same inputs collect by frame 673 when the magnet is ignored (the script's counterfactual run). */
    coinsWithoutMagnet: 31,
    /** A frame mid-magnet where the chip reads "6s", used to pause on. */
    pauseAfterFrame: 594,
    /**
     * First frame with no magnet chip when the run is paused after `pauseAfterFrame` and resumed: the first frame
     * after CHƠI TIẾP runs no rule step (GameHost.resume zeroes lastMs), so everything lands one frame later.
     */
    pausedExpiredFrame: 674,
  },
  /** Seed 212: picks up a shield at frame 562; it breaks on an obstacle at frame 575; the next hit ends the run at 620. */
  shield: {
    seed: 212,
    inputs: [
      [109, "ArrowUp"], [327, "ArrowDown"], [360, "ArrowUp"], [403, "ArrowRight"], [426, "ArrowUp"],
      [460, "ArrowUp"], [510, "ArrowLeft"], [533, "ArrowRight"],
    ] as readonly PlannedInput[],
    pickupFrame: 562,
    /** Frame of the hit the shield absorbs (without the shield the run ends here). */
    breakFrame: 575,
    endFrame: 620,
  },
  /** Seed 312: picks up a speed rush at frame 556 (4.5 s → chip gone at frame 626); no input after frame 534. */
  rush: {
    seed: 312,
    inputs: [
      [84, "ArrowRight"], [296, "ArrowLeft"], [308, "ArrowUp"], [321, "ArrowUp"], [344, "ArrowLeft"],
      [400, "ArrowUp"], [448, "ArrowUp"], [523, "ArrowRight"], [534, "ArrowLeft"],
    ] as readonly PlannedInput[],
    pickupFrame: 556,
    /** First frame with no rush chip. */
    expiredFrame: 626,
    /** Without the rush the same run hits an obstacle and ends at this frame. */
    endWithoutRushFrame: 566,
    /** With the rush, the first hit after it ran out ends the run here. */
    endFrame: 661,
  },
} as const;
