import { FixedStepAccumulator } from '../core/loop'
import { InputController } from '../core/input'
import { Game } from '../game/Game'
import { GameRenderer } from '../render/Renderer'
import type { HudHandle } from './hud/Hud'

export interface RunResult {
  distanceM: number
  coins: number
}

export interface HostOptions {
  characterId: string
  reducedMotion: boolean
  onRunEnd: (result: RunResult) => void
  onPause: () => void
  onContextLost: () => void
}

/**
 * Chu so huu vong lap.
 *
 * Day la ranh gioi giua React va phan chay 60 lan moi giay: React dung o day.
 * Ben trong khong co state, khong co re-render — HUD duoc ghi qua handle menh
 * lenh (invariants.md §7), canh duoc ve truc tiep.
 */
export class GameHost {
  readonly game = new Game()
  private readonly renderer: GameRenderer
  private readonly input: InputController
  private readonly acc = new FixedStepAccumulator()
  private readonly resizeObserver: ResizeObserver
  private raf = 0
  private lastMs = 0
  private lastDistance = -1
  private attractM = 0
  private running = false
  private disposed = false

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly hud: HudHandle,
    private readonly opts: HostOptions,
  ) {
    this.renderer = new GameRenderer(canvas, opts.characterId, opts.reducedMotion)
    this.input = new InputController(canvas.parentElement ?? canvas, {
      onIntent: (i) => this.game.queue(i),
      onPause: () => opts.onPause(),
    })

    this.game.events.on('coinCollected', (p) => this.hud.setCoins(p.total))

    this.game.events.on('runEnded', (p) => {
      this.renderer.shake()
      this.running = false
      opts.onRunEnd({ distanceM: p.distanceM, coins: p.coins })
    })

    // WebGL context co the bi thu hoi bat ky luc nao — NFR-REL-04
    canvas.addEventListener('webglcontextlost', this.onContextLost)

    this.resizeObserver = new ResizeObserver(() => this.applySize())
    this.resizeObserver.observe(canvas.parentElement ?? canvas)
    this.applySize()
    this.loop(0)
  }

  start(seed: number): void {
    this.game.start(seed)
    this.lastDistance = -1
    this.hud.setDistance(0)
    this.hud.setCoins(0)
    this.hud.setCharge(0)
    this.running = true
    this.game.clock.resume()
  }

  pause(): void {
    if (!this.running) return
    this.game.clock.pause()
    this.running = false
  }

  resume(): void {
    if (this.game.phase !== 'running') return
    this.game.clock.resume()
    this.lastMs = 0
    this.acc.reset()
    this.running = true
  }

  setCharacter(id: string): void {
    this.renderer.setCharacter(id)
  }

  get drawCalls(): number {
    return this.renderer.drawCalls
  }

  dispose(): void {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost)
    this.resizeObserver.disconnect()
    this.input.dispose()
    this.renderer.dispose()
  }

  private readonly onContextLost = (e: Event): void => {
    e.preventDefault()
    this.running = false
    cancelAnimationFrame(this.raf)
    this.opts.onContextLost()
  }

  private applySize(): void {
    const host = this.canvas.parentElement
    const w = host?.clientWidth ?? this.canvas.width
    const h = host?.clientHeight ?? this.canvas.height
    this.renderer.resize(w, h)
  }

  private readonly loop = (nowMs: number): void => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.loop)

    const dtMs = this.lastMs === 0 ? 0 : nowMs - this.lastMs
    this.lastMs = nowMs

    if (!this.running) {
      // Man hinh chinh: duong chay van cuon de canh khong chet cung, nhung
      // KHONG chay mo phong — khong vat the, khong diem, khong va cham.
      this.attractM += (dtMs / 1000) * 7
      this.renderer.rig.setScroll(this.attractM)
    }

    if (this.running) {
      const steps = this.acc.feed(dtMs)
      for (let i = 0; i < steps; i++) this.game.step()

      // Chi cham DOM khi con so THUC SU doi — 60 lan/giay van la 60 lan reflow
      const d = this.game.scoring.displayDistance
      if (d !== this.lastDistance) {
        this.lastDistance = d
        this.hud.setDistance(d)
      }
    }

    this.renderer.render(this.game, Math.min(dtMs, 100) / 1000, this.running)
  }
}
