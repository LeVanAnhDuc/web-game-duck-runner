import type { Locator } from "@playwright/test";
import { copy } from "@/data/copy";
import { BasePage } from "./base.page";

/** Settings: mute switch, music and effects volume, the reduced-motion note, reset progress with a confirm step. */
export class SettingsPage extends BasePage {
  heading(): Locator {
    return this.page.getByRole("heading", { name: copy.settings.title });
  }

  backButton(): Locator {
    return this.page.getByRole("button", { name: copy.settings.back, exact: true });
  }

  /** Found by its label: NFR-A11Y-04 wants every input linked to one. */
  muteSwitch(): Locator {
    return this.page.getByLabel(copy.settings.mute);
  }

  musicSlider(): Locator {
    return this.page.getByLabel(copy.settings.music);
  }

  sfxSlider(): Locator {
    return this.page.getByLabel(copy.settings.sfx);
  }

  reducedMotionNote(): Locator {
    return this.page.getByText(copy.settings.reducedMotion, { exact: true });
  }

  resetButton(): Locator {
    return this.page.getByRole("button", { name: copy.settings.reset, exact: true });
  }

  resetQuestion(): Locator {
    return this.page.getByText(copy.settings.resetConfirm, { exact: true });
  }

  confirmResetButton(): Locator {
    return this.page.getByRole("button", { name: copy.settings.resetYes, exact: true });
  }

  cancelResetButton(): Locator {
    return this.page.getByRole("button", { name: copy.settings.resetNo, exact: true });
  }

  /** Sets a range input the way a drag would end: value + input/change events React listens to. */
  async setSlider(slider: Locator, value: number): Promise<void> {
    await slider.fill(String(value));
  }
}
