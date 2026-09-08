import { SimClock } from '../core/clock'
import { EventBus } from '../core/events'
import { createRng, type Rng } from '../core/rng'
import {
  CHARGE_COINS, COIN_MAGNET_REACH_M, COIN_REACH_M, POWERUP_DURATION_MS, RUSH_FACTOR,
  SHIELD_GRACE_MS, SKILL_DURATION_MS, SLOW_FACTOR, characterById,
} from '../data/catalog'
import { ActiveEffects } from './ActiveEffects'
import { obstacleAabb, overlaps } from './Collision'
import {
  LANE_CENTER, LANE_WIDTH_M, POWERUP_EVERY_M, SPAWN_AHEAD_M, SPEED_MAX_MPS,
  SPEED_RAMP_MPS2, SPEED_START_MPS, STEP_MS, STEP_S,
} from './constants'
import { Player } from './Player'
import { Scoring } from './Scoring'
import { Spawner } from './Spawner'
import { Track } from './Track'
import { emptyIntent, type InputIntent, type PowerUpKind, type RunPhase } from './types'

const POWERUP_KINDS: readonly PowerUpKind[] = ['magnet', 'shield', 'rush']

/**
 * Một lượt chơi.
 *
 * Đây là toàn bộ luật chơi, và nó không biết gì về Three.js, về DOM, hay về đồng hồ
 * thực — ADR-0002. Nhờ vậy `step()` chạy được trong Node, và test tất định (cùng
 * seed + cùng chuỗi input → cùng kết quả) trở nên khả thi. Đó là test bắt được nhiều
 * hồi quy gameplay nhất.
 */
export class Game {
  readonly player = new Player()
  readonly track = new Track()
  readonly scoring = new Scoring()
  readonly clock = new SimClock()
  readonly events = new EventBus()
  readonly effects = new ActiveEffects(this.clock)

  phase: RunPhase = 'idle'
  speedMps = SPEED_START_MPS
  seed = 1
  characterId = 'runner'

  /** Xu đã nhặt tính cho thanh nạp. Khác `scoring.coins`: cái này reset khi dùng. */
  chargeCoins = 0

  private rng: Rng = createRng(1)
  private spawner = new Spawner(this.rng)
  private intent: InputIntent = emptyIntent()
  private nextPowerUpM = POWERUP_EVERY_M

  start(seed: number, characterId = this.characterId): void {
    // Bấm Chơi lại hai lần thật nhanh không được tạo hai lượt chồng nhau
    if (this.phase === 'running') return
    this.seed = seed
    this.characterId = characterId
    this.rng = createRng(seed)
    this.spawner = new Spawner(this.rng)
    this.player.reset()
    this.track.reset()
    this.scoring.reset()
    this.clock.reset()
    this.effects.reset()
    this.spawner.reset(this.track)
    this.speedMps = SPEED_START_MPS
    this.chargeCoins = 0
    this.nextPowerUpM = POWERUP_EVERY_M * (0.5 + this.rng.next() * 0.5)
    this.intent = emptyIntent()
    this.phase = 'running'
    this.events.emit('runStarted', { seed })
  }

  /** Nhận ý định từ người chơi. Được gộp lại cho tới bước mô phỏng kế tiếp. */
  queue(intent: Partial<InputIntent>): void {
    if (intent.lane) this.intent.lane = intent.lane
    if (intent.jump) this.intent.jump = true
    if (intent.slide) this.intent.slide = true
    if (intent.skill) this.intent.skill = true
  }

  get chargePct(): number {
    return Math.min(1, this.chargeCoins / CHARGE_COINS)
  }

  get skill() {
    return characterById(this.characterId).skill
  }

  /**
   * Dùng kỹ năng. Trả về false nếu thanh chưa đầy — người gọi có trách nhiệm phản
   * hồi bằng một nhịp rung, không được im lặng (MASTER §7.5).
   */
  useSkill(): boolean {
    if (this.phase !== 'running' || this.chargePct < 1) return false
    const { effect } = this.skill
    this.effects.start(effect, SKILL_DURATION_MS)
    // BẤT BIẾN #11: chỉ reset thanh nạp. Ví KHÔNG bị trừ.
    this.chargeCoins = 0
    this.events.emit('skillActivated', { skillId: effect })
    return true
  }

  pause(): void {
    if (this.phase !== 'running') return
    this.clock.pause()
  }

  resume(): void {
    this.clock.resume()
  }

  get isPaused(): boolean {
    return this.clock.isPaused
  }

  /** Một bước mô phỏng cố định. Gọi bởi core/loop, không gọi trực tiếp. */
  step(): void {
    if (this.phase !== 'running' || this.clock.isPaused) return
    this.clock.advance(STEP_MS)

    if (this.intent.skill) this.useSkill()

    this.speedMps = Math.min(SPEED_MAX_MPS, this.speedMps + SPEED_RAMP_MPS2 * STEP_S)
    const worldSpeed = this.speedMps * this.effects.speedFactor(SLOW_FACTOR, RUSH_FACTOR)
    const dz = worldSpeed * STEP_S

    this.player.apply(this.intent)
    this.intent = emptyIntent()
    this.player.step(STEP_MS)

    this.track.step(dz)
    this.spawner.step(dz, this.speedMps, this.track)
    this.spawnPowerUps(dz)
    // Điểm tính theo tốc độ THẾ GIỚI, không theo tốc độ danh nghĩa: Chậm phải
    // thực sự đánh đổi quãng đường, nếu không nó là kỹ năng miễn phí.
    this.scoring.advance(worldSpeed, STEP_S)

    this.collide()
    this.collectCoins()
    this.collectPowerUps()
  }

  private spawnPowerUps(dz: number): void {
    this.nextPowerUpM -= dz
    if (this.nextPowerUpM > 0) return
    const kind = this.rng.pick(POWERUP_KINDS)
    const lane = this.rng.int(0, 2)
    this.track.spawnPowerUp(kind, lane, SPAWN_AHEAD_M)
    this.nextPowerUpM = POWERUP_EVERY_M * (0.75 + this.rng.next() * 0.5)
  }

  private collide(): void {
    const box = this.player.aabb
    for (const o of this.track.obstacles) {
      if (!o.active) continue
      // Bỏ qua sớm những gì còn xa — vòng này chạy 60 lần mỗi giây
      if (o.z > 3 || o.z < -3) continue
      // BẤT BIẾN #1: hộp bao lấy từ VỊ TRÍ THẬT của nhân vật (player.aabb đọc
      // player.x nội suy), không lấy từ làn đích.
      if (!overlaps(box, { ...obstacleAabb(o), cz: o.z })) continue

      if (this.effects.invincible) {
        // Ủi · Bay · Tua nhanh · bất tử ngắn sau khiên: chướng ngại vỡ
        o.active = false
        continue
      }
      if (this.effects.consumeShield(SHIELD_GRACE_MS)) {
        o.active = false
        this.events.emit('shieldBroken', {})
        continue
      }
      this.end()
      return
    }
  }

  private collectCoins(): void {
    const px = this.player.x
    const reach = this.effects.has('magnet') || this.effects.has('fly')
      ? COIN_MAGNET_REACH_M
      : COIN_REACH_M
    const zWindow = this.effects.has('magnet') ? 3.0 : 1.2
    for (const c of this.track.coins) {
      if (!c.active) continue
      if (c.z > zWindow || c.z < -zWindow) continue
      const cx = (c.lane - LANE_CENTER) * LANE_WIDTH_M
      if (Math.abs(cx - px) > reach) continue
      // Nhảy cao quá thì không với tới xu — xu treo ở 1m. Nam châm và Bay bỏ qua
      // điều kiện này, vì hút xu là đúng việc của chúng.
      if (this.player.y > 1.8 && !this.effects.has('magnet') && !this.effects.has('fly')) continue
      c.active = false
      this.scoring.addCoin()
      this.chargeCoins = Math.min(CHARGE_COINS, this.chargeCoins + 1)
      const pct = this.chargePct
      this.events.emit('coinCollected', { total: this.scoring.coins, chargePct: pct })
      if (this.chargeCoins === CHARGE_COINS) this.events.emit('chargeFull', {})
    }
  }

  private collectPowerUps(): void {
    const px = this.player.x
    for (const p of this.track.powerUps) {
      if (!p.active) continue
      if (p.z > 1.4 || p.z < -1.4) continue
      const cx = (p.lane - LANE_CENTER) * LANE_WIDTH_M
      if (Math.abs(cx - px) > LANE_WIDTH_M * 0.6) continue
      p.active = false
      if (p.kind === 'shield') this.effects.addShield()
      else this.effects.start(p.kind, POWERUP_DURATION_MS[p.kind])
      this.events.emit('powerUpStarted', { kind: p.kind })
    }
  }

  private end(): void {
    this.phase = 'ended'
    this.events.emit('playerHit', {})
    this.events.emit('runEnded', {
      distanceM: this.scoring.displayDistance,
      coins: this.scoring.coins,
      // Có phải kỷ lục hay không do tầng trên quyết định: nó cần dữ liệu đã lưu,
      // mà `game/` thì không được đọc localStorage.
      isRecord: false,
    })
  }
}
