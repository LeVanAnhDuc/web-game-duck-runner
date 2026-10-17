import type { CDPSession, Locator } from "@playwright/test";
import { copy } from "@/data/copy";
import { BasePage } from "./base.page";

type TouchType = "touchStart" | "touchMove" | "touchEnd";

/**
 * A run in progress: the Three.js canvas and the HUD over it. The HUD is real DOM written straight from the game
 * loop (invariants.md §7), so it is what a test reads — the scene itself is pixels.
 */
export class PlayPage extends BasePage {
  private cdp: CDPSession | null = null;

  canvas(): Locator {
    return this.page.getByRole("img", { name: copy.a11y.canvas });
  }

  /** The play area the canvas fills (the portrait frame on wide screens). */
  frame(): Locator {
    return this.page.locator(".frame");
  }

  pauseButton(): Locator {
    return this.page.getByRole("button", { name: copy.hud.pause, exact: true });
  }

  skillButton(): Locator {
    return this.page.getByRole("button", { name: copy.hud.skill, exact: true });
  }

  /** The skill button's box (the button plus its label): the zone a swipe must ignore. */
  skillZone(): Locator {
    return this.page.locator("[data-no-swipe]");
  }

  /** ĐANG NẠP / SẴN SÀNG under the skill button. */
  skillLabel(): Locator {
    return this.skillZone().locator(".lbl");
  }

  /** Distance in metres, as digits (thousands grouped with a space). */
  distance(): Locator {
    return this.page.locator(".hud-distance span").first();
  }

  /** Coins picked up in this run. */
  coins(): Locator {
    return this.page.locator(".hud-coins .mono");
  }

  /** The bar of the charge meter. */
  chargeBar(): Locator {
    return this.page.locator(".charge");
  }

  /** The filled part of the charge meter. */
  chargeFill(): Locator {
    return this.page.locator(".charge-fill");
  }

  /** The HUD (hidden outside a run). */
  hud(): Locator {
    return this.page.locator(".hud");
  }

  async distanceValue(): Promise<number> {
    return Number((await this.distance().innerText()).replace(/\s/g, ""));
  }

  async coinValue(): Promise<number> {
    return Number(await this.coins().innerText());
  }

  /** Width of the charge fill as written by the HUD (`style.width`, in %). */
  async chargePercent(): Promise<number> {
    return this.chargeFill().evaluate((el) => Number.parseFloat((el as HTMLElement).style.width) || 0);
  }

  /** True when the skill button carries the "not ready yet" nudge (MASTER §7.5). */
  async isNudged(): Promise<boolean> {
    return this.skillZone().evaluate((el) => el.classList.contains("nudge"));
  }

  async press(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /** A real touch swipe (CDP touch events → pointer events) across the middle of the play area. */
  async swipe(dx: number, dy: number): Promise<void> {
    const box = (await this.canvas().boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await this.touch([
      ["touchStart", x, y],
      ["touchMove", x + dx / 2, y + dy / 2],
      ["touchMove", x + dx, y + dy],
      ["touchEnd", x + dx, y + dy],
    ]);
  }

  /** A real touch tap on the centre of `target` (no movement). */
  async tap(target: Locator): Promise<void> {
    const box = (await target.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await this.touch([
      ["touchStart", x, y],
      ["touchEnd", x, y],
    ]);
  }

  /**
   * A swipe that STARTS on the skill button and moves far enough to count as a lane change anywhere else
   * (MASTER §7.5: the button is an exclusion zone for gestures).
   */
  async swipeFromSkillButton(dx: number, dy: number): Promise<void> {
    const box = (await this.skillButton().boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await this.touch([
      ["touchStart", x, y],
      ["touchMove", x + dx, y + dy],
      ["touchEnd", x + dx, y + dy],
    ]);
  }

  private async touch(steps: Array<[TouchType, number, number]>): Promise<void> {
    this.cdp ??= await this.page.context().newCDPSession(this.page);
    for (const [type, x, y] of steps) {
      await this.cdp.send("Input.dispatchTouchEvent", {
        type,
        touchPoints: type === "touchEnd" ? [] : [{ x, y }],
      });
    }
  }
}
