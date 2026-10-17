import type { Locator } from "@playwright/test";
import { copy } from "@/data/copy";
import { BasePage } from "./base.page";

/** The text-only screen shown instead of a black canvas (no WebGL, or the context was lost). */
export class ErrorPage extends BasePage {
  heading(): Locator {
    return this.page.getByRole("heading", { name: copy.error.title });
  }

  message(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  retryButton(): Locator {
    return this.page.getByRole("button", { name: copy.error.retry, exact: true });
  }

  /** WebGL unavailable from the start: getContext returns null for every WebGL flavour (hardware acceleration off). */
  async disableWebGL(): Promise<void> {
    await this.page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
        if (/webgl/i.test(type)) return null;
        return (original as (...a: unknown[]) => unknown).call(this, type, ...rest);
      } as typeof original;
    });
  }

  /** The browser takes the GPU context back mid-session (WEBGL_lose_context on the game's own canvas). */
  async loseContext(): Promise<void> {
    await this.page.evaluate(() => {
      const canvas = document.querySelector("canvas")!;
      const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    });
  }
}
