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
