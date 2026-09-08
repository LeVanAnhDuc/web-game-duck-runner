import { FixedStepAccumulator } from '../core/loop'
import { InputController } from '../core/input'
import { Game } from '../game/Game'
import { GameRenderer } from '../render/Renderer'
import type { AudioEngine } from '../audio/Audio'
import { S } from '../data/strings'
import type { EffectKind } from '../game/ActiveEffects'
import type { HudHandle } from './hud/Hud'

const EFFECT_LABELS: Record<EffectKind, string> = {
  magnet: S.hud.magnet,
  rush: S.hud.rush,
  ram: 'Ủi',
  slow: 'Chậm',
  fly: 'Bay',
}

export interface RunResult {
  distanceM: number
  coins: number
}

export interface HostOptions {
  characterId: string
  reducedMotion: boolean
  audio: AudioEngine
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
      onIntent: (i) => {
        if (i.jump) opts.audio.play('jump')
        if (i.slide) opts.audio.play('slide')
        this.game.queue(i)
      },
      onPause: () => opts.onPause(),
    })

    const audio = opts.audio
    this.game.events.on('coinCollected', (p) => {
      this.hud.setCoins(p.total)
      this.hud.setCharge(p.chargePct)
      audio.play('coin')
    })
    this.game.events.on('chargeFull', () => audio.play('shield'))
    this.game.events.on('skillActivated', () => audio.play('skill'))
    this.game.events.on('powerUpStarted', () => audio.play('powerup'))
    this.game.events.on('shieldBroken', () => audio.play('shield'))
    this.game.events.on('playerHit', () => audio.play('hit'))

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
    this.installDevStats()
    this.loop(0)
  }

  start(seed: number, characterId?: string): void {
    this.game.start(seed, characterId)
    this.lastDistance = -1
    this.hud.setDistance(0)
    this.hud.setCoins(0)
    this.hud.setCharge(0)
    this.hud.setEffects([])
    this.running = true
    this.game.clock.resume()
  }

  pause(): void {
    if (!this.running) return
    this.game.pause()
    this.running = false
  }

  resume(): void {
    if (this.game.phase !== 'running') return
    this.game.resume()
    this.lastMs = 0
    this.acc.reset()
    this.running = true
  }

  /** Bo luot dang choi va ve man hinh chinh. */
  abandon(): void {
    this.running = false
    this.game.resume()
    this.game.phase = 'idle'
  }

  /**
   * Dung ky nang. Tra ve false neu thanh chua day — luc do HUD rung mot nhip,
   * vi im lang la cach chac nhat de nguoi choi tuong nut bi hong (MASTER §7.5).
   */
  useSkill(): boolean {
    const ok = this.game.useSkill()
    if (ok) {
      this.hud.setCharge(0)
    } else {
      this.hud.nudge()
      this.opts.audio.play('deny')
    }
    return ok
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

  private effectLabels(): string[] {
    const out: string[] = []
    for (const e of this.game.effects.list()) {
      const label = EFFECT_LABELS[e.kind]
      if (label) out.push(`${label} ${Math.ceil(e.remainingMs / 1000)}s`)
    }
    if (this.game.effects.hasShield) out.push(S.hud.shield)
    return out
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

  /**
   * Moc do hieu nang — chi ton tai o ban dev.
   *
   * NFR-PERF-05 va NFR-PERF-08 doi so do THAT, khong doi uoc luong. Khong co moc
   * nay thi cach duy nhat de dem draw call la mo devtools va doc bang tay, va khong
   * ai lam viec do mot cach deu dan.
   */
  private installDevStats(): void {
    if (!import.meta.env.DEV) return
    let frames = 0
    let last = 0
    let fps = 0
    const sample = (t: number): void => {
      frames++
      if (last === 0) last = t
      if (t - last >= 1000) {
        fps = Math.round((frames * 1000) / (t - last))
        frames = 0
        last = t
      }
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
    ;(globalThis as unknown as { __duskrun?: unknown }).__duskrun = {
      stats: () => ({
        fps,
        drawCalls: this.renderer.drawCalls,
        activeObstacles: this.game.track.activeObstacleCount,
        activeCoins: this.game.track.activeCoinCount,
        speedMps: Number(this.game.speedMps.toFixed(2)),
        distanceM: this.game.scoring.displayDistance,
      }),
      /** Bat bat tu de do o canh day nhat ma khong chet. */
      immortal: () => this.game.effects.start('rush', 10 * 60 * 1000),
      warp: (seconds: number) => {
        for (let i = 0; i < seconds * 60; i++) this.game.step()
      },
    }
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
      // setEffects tu bo qua khi tap nhan khong doi, nen goi moi frame la re
      this.hud.setEffects(this.effectLabels())
    }

    this.renderer.render(this.game, Math.min(dtMs, 100) / 1000, this.running)
  }
}
