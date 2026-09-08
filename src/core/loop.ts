import { MAX_STEPS_PER_FRAME, STEP_MS } from '../game/constants'

/**
 * Vong lap buoc co dinh — invariants.md §2.
 *
 * `feed` nhan thoi gian thuc troi qua va tra ve SO BUOC mo phong can chay. Logic
 * luon chay o STEP_MS, bat ke man hinh 60Hz hay 144Hz. `alpha` la he so noi suy
 * cho tang hien thi, de chuyen dong van muot khi step khong trung frame.
 *
 * Tran MAX_STEPS_PER_FRAME chan "spiral of death": tab bi an 30 giay roi hien
 * lai khong duoc tua nhanh 1800 buoc trong mot frame.
 */
export class FixedStepAccumulator {
  private acc = 0

  feed(dtMs: number): number {
    // dt am hoac phi ly (dong ho he thong nhay) thi bo qua, khong keo lui mo phong
    if (!Number.isFinite(dtMs) || dtMs <= 0) return 0
    this.acc += dtMs
    let steps = 0
    while (this.acc >= STEP_MS && steps < MAX_STEPS_PER_FRAME) {
      this.acc -= STEP_MS
      steps++
    }
    // Vuot tran: vut phan du thay vi giu no lai cho frame sau
    if (this.acc >= STEP_MS) this.acc = 0
    return steps
  }

  /** [0, 1) — vi tri giua buoc truoc va buoc hien tai, cho noi suy khi ve. */
  get alpha(): number {
    return this.acc / STEP_MS
  }

  reset(): void {
    this.acc = 0
  }
}
