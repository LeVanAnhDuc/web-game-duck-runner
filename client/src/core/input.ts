import type { InputIntent } from '../game/types'

/**
 * Gom ban phim va cu chi vuot ve MOT y dinh duy nhat.
 *
 * Day la cach duy nhat de "mobile va desktop ngang nhau" khong bien thanh hai
 * nhanh code song song. `game/` khong bao gio biet nguoi choi dang dung gi.
 */

export interface InputOptions {
  /** Nhan y dinh. Duoc goi nhieu lan giua hai buoc mo phong; Game tu gop lai. */
  onIntent: (intent: Partial<InputIntent>) => void
  /** Bam Esc / nut tam dung. */
  onPause: () => void
}

/** Vuot ngan hon nguong nay tinh la cham, khong tinh la vuot. */
const SWIPE_MIN_PX = 26
/** Vuot dai hon nguong nay ma chua nhac tay thi van tinh — nguoi choi vuot nhanh. */
const SWIPE_COMMIT_PX = 44

export class InputController {
  private startX = 0
  private startY = 0
  private tracking = false
  private committed = false
  private readonly abort = new AbortController()

  constructor(target: HTMLElement, private readonly opts: InputOptions) {
    const signal = this.abort.signal
    globalThis.addEventListener('keydown', this.onKeyDown, { signal })
    target.addEventListener('pointerdown', this.onPointerDown, { signal })
    target.addEventListener('pointermove', this.onPointerMove, { signal })
    target.addEventListener('pointerup', this.onPointerUp, { signal })
    target.addEventListener('pointercancel', this.onPointerUp, { signal })
    // Chan keo-de-tai-lai va cuon dan hoi tren iOS
    target.addEventListener('touchmove', preventIfTracking(this), { signal, passive: false })
  }

  dispose(): void {
    this.abort.abort()
  }

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    // Khong cuop phim khi nguoi dung dang o mot nut hay o nhap lieu
    const tag = (e.target as HTMLElement | null)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return

    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.opts.onIntent({ lane: -1 })
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.opts.onIntent({ lane: 1 })
        break
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.opts.onIntent({ jump: true })
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        this.opts.onIntent({ slide: true })
        break
      case ' ':
      case 'Spacebar':
        // Space la ky nang, khong phai nhay: nhay da co mui ten len va vuot len
        e.preventDefault()
        this.opts.onIntent({ skill: true })
        break
      case 'Escape':
      case 'p':
      case 'P':
        this.opts.onPause()
        break
      default:
        return
    }
    if (e.key.startsWith('Arrow')) e.preventDefault()
  }

  private readonly onPointerDown = (e: PointerEvent): void => {
    /**
     * MASTER §7.5: nut ky nang la VUNG LOAI TRU cua cu chi vuot. Cham vao no
     * khong duoc tinh thanh vuot doi lan — neu khong, moi lan bam ky nang la
     * mot lan doi lan ngoai y muon.
     */
    if ((e.target as HTMLElement | null)?.closest('[data-no-swipe]')) return
    this.tracking = true
    this.committed = false
    this.startX = e.clientX
    this.startY = e.clientY
  }

  private readonly onPointerMove = (e: PointerEvent): void => {
    if (!this.tracking || this.committed) return
    const dx = e.clientX - this.startX
    const dy = e.clientY - this.startY
    if (Math.abs(dx) < SWIPE_COMMIT_PX && Math.abs(dy) < SWIPE_COMMIT_PX) return
    this.commit(dx, dy)
  }

  private readonly onPointerUp = (e: PointerEvent): void => {
    if (!this.tracking) return
    if (!this.committed) {
      const dx = e.clientX - this.startX
      const dy = e.clientY - this.startY
      if (Math.abs(dx) >= SWIPE_MIN_PX || Math.abs(dy) >= SWIPE_MIN_PX) this.commit(dx, dy)
    }
    this.tracking = false
    this.committed = false
  }

  private commit(dx: number, dy: number): void {
    this.committed = true
    if (Math.abs(dx) > Math.abs(dy)) {
      this.opts.onIntent({ lane: dx > 0 ? 1 : -1 })
    } else if (dy < 0) {
      this.opts.onIntent({ jump: true })
    } else {
      this.opts.onIntent({ slide: true })
    }
  }

  get isTracking(): boolean {
    return this.tracking
  }
}

function preventIfTracking(c: InputController): (e: TouchEvent) => void {
  return (e) => {
    if (c.isTracking) e.preventDefault()
  }
}

/** Doc mot lan luc khoi dong. NFR-A11Y-05. */
export function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

/** WebGL co dung duoc khong — FR-32, NFR-REL-04. */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}
