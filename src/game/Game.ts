import { SimClock } from '../core/clock'
import { EventBus } from '../core/events'
import { createRng, type Rng } from '../core/rng'
import { obstacleAabb, overlaps } from './Collision'
import {
  LANE_CENTER, LANE_WIDTH_M, SPEED_MAX_MPS, SPEED_RAMP_MPS2, SPEED_START_MPS, STEP_MS, STEP_S,
} from './constants'
import { Player } from './Player'
import { Scoring } from './Scoring'
import { Spawner } from './Spawner'
import { Track } from './Track'
import { emptyIntent, type InputIntent, type RunPhase } from './types'

/**
 * Mot luot choi.
 *
 * Day la toan bo luat choi, va no khong biet gi ve Three.js, ve DOM, hay ve
 * dong ho thuc — ADR-0002. Nho vay `step()` chay duoc trong Node, va test tat
 * dinh (cung seed + cung chuoi input -> cung ket qua) tro nen kha thi. Do la
 * test bat duoc nhieu hoi quy gameplay nhat.
 */
export class Game {
  readonly player = new Player()
  readonly track = new Track()
  readonly scoring = new Scoring()
  readonly clock = new SimClock()
  readonly events = new EventBus()

  phase: RunPhase = 'idle'
  speedMps = SPEED_START_MPS
  seed = 1

  private rng: Rng = createRng(1)
  private spawner = new Spawner(this.rng)
  private intent: InputIntent = emptyIntent()

  start(seed: number): void {
    // Bam Choi lai hai lan that nhanh khong duoc tao hai luot chong nhau
    if (this.phase === 'running') return
    this.seed = seed
    this.rng = createRng(seed)
    this.spawner = new Spawner(this.rng)
    this.player.reset()
    this.track.reset()
    this.scoring.reset()
    this.clock.reset()
    this.spawner.reset(this.track)
    this.speedMps = SPEED_START_MPS
    this.intent = emptyIntent()
    this.phase = 'running'
    this.events.emit('runStarted', { seed })
  }

  /** Nhan y dinh tu nguoi choi. Duoc gop lai cho toi buoc mo phong ke tiep. */
  queue(intent: Partial<InputIntent>): void {
    if (intent.lane) this.intent.lane = intent.lane
    if (intent.jump) this.intent.jump = true
    if (intent.slide) this.intent.slide = true
    if (intent.skill) this.intent.skill = true
  }

  /** Mot buoc mo phong co dinh. Goi boi core/loop, khong goi truc tiep. */
  step(): void {
    if (this.phase !== 'running') return
    this.clock.advance(STEP_MS)

    this.speedMps = Math.min(SPEED_MAX_MPS, this.speedMps + SPEED_RAMP_MPS2 * STEP_S)
    const dz = this.speedMps * STEP_S

    this.player.apply(this.intent)
    this.intent = emptyIntent()
    this.player.step(STEP_MS)

    this.track.step(dz)
    this.spawner.step(dz, this.speedMps, this.track)
    this.scoring.advance(this.speedMps, STEP_S)

    this.collide()
    this.collectCoins()
  }

  /** Ban kinh hut xu — rong hon hitbox va cham, vi truot xu la buc boi. */
  private static readonly COIN_REACH_M = 1.0

  private collectCoins(): void {
    const px = this.player.x
    for (const c of this.track.coins) {
      if (!c.active) continue
      if (c.z > 1.2 || c.z < -1.2) continue
      const cx = (c.lane - LANE_CENTER) * LANE_WIDTH_M
      if (Math.abs(cx - px) > Game.COIN_REACH_M) continue
      // Nhay cao qua thi khong voi toi xu — xu treo o 1m
      if (this.player.y > 1.8) continue
      c.active = false
      this.scoring.addCoin()
      this.events.emit('coinCollected', { total: this.scoring.coins, chargePct: 0 })
    }
  }

  private collide(): void {
    const box = this.player.aabb
    for (const o of this.track.obstacles) {
      if (!o.active) continue
      // Bo qua som nhung gi con xa — vong nay chay 60 lan moi giay
      if (o.z > 3 || o.z < -3) continue
      // BAT BIEN #1: hop bao lay tu VI TRI THAT cua nhan vat (player.aabb doc
      // player.x noi suy), khong lay tu lan dich.
      if (overlaps(box, { ...obstacleAabb(o), cz: o.z })) {
        this.end()
        return
      }
    }
  }

  private end(): void {
    this.phase = 'ended'
    this.events.emit('playerHit', {})
    this.events.emit('runEnded', {
      distanceM: this.scoring.displayDistance,
      coins: this.scoring.coins,
      isRecord: false, // do tang tren quyet dinh, vi no can du lieu da luu
    })
  }
}
