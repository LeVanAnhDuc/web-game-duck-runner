/**
 * Dong ho MO PHONG — invariants.md §5.
 *
 * Moi bo dem thoi han (ky nang, power-up, bat tu sau va cham) doc dong ho nay,
 * khong doc Date.now(). Vi pham thi Tam dung khong dung bo dem: nguoi choi mo
 * menu mot phut, quay lai thi ky nang da het han.
 */
export class SimClock {
  private elapsedMs = 0
  private paused = false

  advance(dtMs: number): void {
    if (!this.paused) this.elapsedMs += dtMs
  }

  get now(): number {
    return this.elapsedMs
  }

  pause(): void {
    this.paused = true
  }

  resume(): void {
    this.paused = false
  }

  get isPaused(): boolean {
    return this.paused
  }

  reset(): void {
    this.elapsedMs = 0
    this.paused = false
  }
}
