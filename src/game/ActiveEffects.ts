import type { SimClock } from '../core/clock'

/**
 * Mọi hiệu ứng có thời hạn, bất kể nguồn là power-up hay kỹ năng nhân vật.
 *
 * Hai hệ thống đó khác nhau ở **quyền kiểm soát thời điểm**, không khác nhau ở cơ
 * chế — nên chúng dùng chung module này. Tách làm hai là cách chắc chắn để hai bản
 * lệch nhau về cách xử lý tạm dừng.
 *
 * BẤT BIẾN #5: mọi bộ đếm đọc `SimClock`, không đọc `Date.now()`. Vi phạm thì Tạm
 * dừng không dừng bộ đếm — người chơi mở menu một phút, quay lại thì kỹ năng đã hết
 * hạn. Không có lỗi nào được ném ra; chỉ có người chơi thấy vô lý.
 */
export type EffectKind = 'magnet' | 'rush' | 'ram' | 'slow' | 'fly'

/** Khiên đếm LẦN, không đếm giờ — nên nó không nằm trong bảng thời hạn. */
export interface EffectSnapshot {
  kind: EffectKind
  remainingMs: number
  totalMs: number
}

export class ActiveEffects {
  private readonly untilMs = new Map<EffectKind, number>()
  private readonly totalMs = new Map<EffectKind, number>()
  private shields = 0
  /** Bất tử ngắn sau khi khiên vỡ. Xem design.md §5. */
  private graceUntilMs = 0

  constructor(private readonly clock: SimClock) {}

  reset(): void {
    this.untilMs.clear()
    this.totalMs.clear()
    this.shields = 0
    this.graceUntilMs = 0
  }

  /** Cùng loại thì GIA HẠN, không cộng dồn — cộng dồn cho ra hiệu ứng dài vô lý. */
  start(kind: EffectKind, durationMs: number): void {
    this.untilMs.set(kind, this.clock.now + durationMs)
    this.totalMs.set(kind, durationMs)
  }

  has(kind: EffectKind): boolean {
    return (this.untilMs.get(kind) ?? 0) > this.clock.now
  }

  remainingMs(kind: EffectKind): number {
    return Math.max(0, (this.untilMs.get(kind) ?? 0) - this.clock.now)
  }

  /** Danh sách hiệu ứng đang chạy, để HUD hiện chip. */
  list(): EffectSnapshot[] {
    const out: EffectSnapshot[] = []
    for (const [kind, until] of this.untilMs) {
      const remaining = until - this.clock.now
      if (remaining > 0) {
        out.push({ kind, remainingMs: remaining, totalMs: this.totalMs.get(kind) ?? remaining })
      }
    }
    return out
  }

  addShield(): void {
    this.shields = 1
  }

  get hasShield(): boolean {
    return this.shields > 0
  }

  /** Dùng một lần khiên. Trả về true nếu có khiên để dùng. */
  consumeShield(graceMs: number): boolean {
    if (this.shields <= 0) return false
    this.shields -= 1
    this.graceUntilMs = this.clock.now + graceMs
    return true
  }

  /**
   * Có đang miễn nhiễm va chạm không.
   *
   * Gộp mọi nguồn vào một câu hỏi duy nhất: nếu mỗi chỗ tự hỏi riêng thì sớm muộn
   * sẽ có một chỗ quên mất một nguồn.
   */
  get invincible(): boolean {
    return this.has('ram') || this.has('fly') || this.has('rush') || this.clock.now < this.graceUntilMs
  }

  /** Hệ số tốc độ do hiệu ứng áp lên thế giới. */
  speedFactor(slowFactor: number, rushFactor: number): number {
    let f = 1
    if (this.has('slow')) f *= slowFactor
    if (this.has('rush')) f *= rushFactor
    return f
  }
}
