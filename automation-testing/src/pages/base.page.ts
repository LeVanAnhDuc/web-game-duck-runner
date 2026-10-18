import type { Locator, Page } from "@playwright/test";
import { STORAGE, type Save } from "@/data/test-data";

/** Start of the fake clock: a fixed date, so nothing in a run depends on the day the suite runs. */
const CLOCK_START = new Date("2026-10-01T08:00:00Z").getTime();
/** Where `freezeClock` stops time: far enough past CLOCK_START that page load never gets there first. */
const FROZEN_AFTER_MS = 10 * 60 * 1000;
/** Frame interval of `slowFrames`: 4 rule steps a frame (the loop allows 5). */
export const FRAME_MS = 64;

/**
 * Shared parts of every screen. Duck Runner is a single-URL SPA: every screen lives at "./" (relative, so the same
 * object works under GitHub Pages' /web-game-duck-runner/ base path), and what varies between visits is what the game
 * finds in localStorage, the seed it draws when PLAY is pressed, and how much simulated time has passed.
 */
export abstract class BasePage {
  constructor(readonly page: Page) {}

  /** Opens the game. `query` is appended as-is ("code=abc&state=xyz"). */
  async open(query = ""): Promise<void> {
    await this.page.goto(query ? `./?${query}` : "./");
  }

  /**
   * Puts a save in localStorage before the game reads it. Runs on the first document of this tab only (a
   * sessionStorage marker), so a later reload sees what the GAME wrote, not the planted value again.
   * A string is planted verbatim (lets a test plant something that is not valid JSON). `key` defaults to the save key.
   */
  async seedSave(value: Save | string, key: string = STORAGE.save): Promise<void> {
    const raw = typeof value === "string" ? value : JSON.stringify(value);
    await this.page.addInitScript(
      ([k, v]) => {
        const marker = `__e2e_seeded:${k}`;
        if (sessionStorage.getItem(marker)) return;
        localStorage.setItem(k, v);
        sessionStorage.setItem(marker, "1");
      },
      [key, raw] as const,
    );
  }

  /** The way private mode or a blocked-site-data policy looks to a page: touching localStorage throws. */
  async blockStorage(): Promise<void> {
    await this.page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new DOMException("The operation is insecure.", "SecurityError");
        },
      });
    });
  }

  /** The save as the game last wrote it (null when nothing is stored under the save key). */
  async storedSave(): Promise<Save | null> {
    const raw = await this.page.evaluate((key) => localStorage.getItem(key), STORAGE.save);
    return raw === null ? null : (JSON.parse(raw) as Save);
  }

  /** Every localStorage key the page holds. */
  async storageKeys(): Promise<string[]> {
    return this.page.evaluate(() => Object.keys(localStorage));
  }

  /**
   * Replaces Math.random with a seeded generator (mulberry32) before any page script runs. The run seed is drawn from
   * Math.random when PLAY is pressed, so the same seed gives the same track.
   */
  async fixSeed(seed: number): Promise<void> {
    await this.page.addInitScript((s) => {
      let a = s >>> 0;
      Math.random = () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }, seed);
  }

  /**
   * Turns the browser's data saver on (navigator.connection.saveData), which makes the game skip its two CC0 photos
   * (ADR-0010, FR-39). The photos arrive on real network time and Three.js draws a Math.random() for the texture it
   * builds from one, so in a seeded run they would race the seed drawn at PLAY.
   */
  async saveDataOn(): Promise<void> {
    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } });
    });
  }

  /**
   * Installs the fake clock before the page loads. Call `freezeClock()` once the page is open: from then on the game
   * loop (requestAnimationFrame + performance.now) only moves when the test calls `advance`.
   */
  async installClock(): Promise<void> {
    await this.page.clock.install({ time: CLOCK_START });
  }

  /**
   * Draws a frame every FRAME_MS of simulated time instead of every 16 ms. Call after `installClock` (it must replace
   * the clock's own requestAnimationFrame). The game steps its rules at a fixed 60 Hz whatever the frame rate
   * (invariants.md §2, up to 5 steps a frame), so a run is the same run — it is only drawn less often, which is what
   * makes a software-WebGL run in CI affordable. Inputs land on the next frame, as they would on a 15 fps phone.
   */
  async slowFrames(): Promise<void> {
    await this.page.addInitScript((frameMs) => {
      window.requestAnimationFrame = (cb) => window.setTimeout(() => cb(performance.now()), frameMs) as unknown as number;
      window.cancelAnimationFrame = (id) => window.clearTimeout(id);
    }, FRAME_MS);
  }

  /**
   * Stops time; nothing in the page's timers moves until `advance`. Jumps to a fixed moment well past page load (a
   * jump fires each due timer once, it does not replay every frame), so every test starts its run at the same instant.
   */
  async freezeClock(): Promise<void> {
    await this.page.clock.pauseAt(CLOCK_START + FROZEN_AFTER_MS);
  }

  /** Lets `ms` of simulated time pass (frames fire every 16 ms, timers fire on time). */
  async advance(ms: number): Promise<void> {
    await this.page.clock.runFor(ms);
  }

  /**
   * Counts what the page does with Web Audio: AudioContexts created, and sound sources (oscillators, noise buffers)
   * created on them. Read with `audioStats()`.
   */
  async instrumentAudio(): Promise<void> {
    await this.page.addInitScript(() => {
      const Original = window.AudioContext;
      const stats = { contexts: 0, sources: 0 };
      class Counted extends Original {
        constructor(...args: ConstructorParameters<typeof AudioContext>) {
          super(...args);
          stats.contexts++;
        }
        override createOscillator(): OscillatorNode {
          stats.sources++;
          return super.createOscillator();
        }
        override createBufferSource(): AudioBufferSourceNode {
          stats.sources++;
          return super.createBufferSource();
        }
      }
      window.AudioContext = Counted;
      (window as unknown as { __audioStats: typeof stats }).__audioStats = stats;
    });
  }

  async audioStats(): Promise<{ contexts: number; sources: number }> {
    return this.page.evaluate(() => ({ ...(window as unknown as { __audioStats: { contexts: number; sources: number } }).__audioStats }));
  }

  /** Horizontal overflow of the whole document, in px (0 = no sideways scroll). */
  async horizontalOverflow(): Promise<number> {
    return this.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  }

  /** True when the element's whole box lies inside the viewport (1px rounding allowed). */
  async fullyInViewport(target: Locator): Promise<boolean> {
    const box = await target.boundingBox();
    const vp = this.page.viewportSize();
    if (!box || !vp) return false;
    return box.x >= -1 && box.y >= -1 && box.x + box.width <= vp.width + 1 && box.y + box.height <= vp.height + 1;
  }

  /** The focus ring of the focused element: computed outline style and width in px. */
  async focusOutline(): Promise<{ style: string; width: number }> {
    return this.page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return { style: "none", width: 0 };
      const s = getComputedStyle(el);
      return { style: s.outlineStyle, width: Number.parseFloat(s.outlineWidth) || 0 };
    });
  }

  /** Tag and visible text / aria-label of the element that has keyboard focus ("BODY" when focus fell to <body>). */
  async focused(): Promise<{ tag: string; name: string }> {
    return this.page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return {
        tag: el?.tagName ?? "",
        name: (el?.getAttribute("aria-label") ?? el?.textContent ?? "").trim(),
      };
    });
  }
}
