import { COIN_POOL_SIZE, OBSTACLE_POOL_SIZE, PATTERN_SLOT_GAP_M } from './constants'
import type { Coin, Obstacle, Pattern } from './types'

/**
 * Duong chay: pool chuong ngai va pool xu.
 *
 * BAT BIEN #9: khong `new` gi trong vong lap. Pool duoc cap phat mot lan luc
 * khoi tao va tai su dung mai mai. Neu tao/vut moi frame thi GC gom rac giua
 * luc choi, gay khung theo chu ky — rat kho truy vi khong tai lap duoc.
 *
 * `spawnPattern` tra ve false khi pool day. Do la tin hieu tran chu khong phai
 * loi: bo qua mot cum con hon lam tut frame.
 */
export class Track {
  readonly obstacles: Obstacle[] = []
  readonly coins: Coin[] = []
  /**
   * Vat the lui ra sau nguoi choi qua nguong nay thi tra ve pool.
   *
   * Camera dung o z = -6.4. De nguong o -6 nghia la mot dong xu se troi qua
   * cach ong kinh 40cm va to bang nua man hinh. -2 la vua sau lung nguoi choi,
   * ngoai vung mat dang nhin.
   */
  private static readonly DESPAWN_Z = -2

  constructor() {
    for (let i = 0; i < OBSTACLE_POOL_SIZE; i++) {
      this.obstacles.push({ active: false, kind: 'low', lane: 1, z: 0 })
    }
    for (let i = 0; i < COIN_POOL_SIZE; i++) {
      this.coins.push({ active: false, lane: 1, z: 0 })
    }
  }

  reset(): void {
    for (const o of this.obstacles) o.active = false
    for (const c of this.coins) c.active = false
  }

  /** Dat mot cum tai `atZ` met truoc mat. Tra ve do dai cum, hoac -1 neu tran pool. */
  spawnPattern(pattern: Pattern, atZ: number): number {
    const needObstacles = pattern.slots.reduce(
      (n, slot) => n + slot.filter((c) => c !== null).length,
      0,
    )
    const needCoins = pattern.coins?.length ?? 0
    if (this.freeObstacles < needObstacles || this.freeCoins < needCoins) return -1

    pattern.slots.forEach((slot, i) => {
      slot.forEach((cell, lane) => {
        if (!cell) return
        const o = this.takeObstacle()
        if (!o) return
        o.kind = cell
        o.lane = lane
        o.z = atZ + i * PATTERN_SLOT_GAP_M
      })
    })
    for (const [slotIdx, lane] of pattern.coins ?? []) {
      const c = this.takeCoin()
      if (!c) break
      c.lane = lane
      c.z = atZ + slotIdx * PATTERN_SLOT_GAP_M
    }
    return (pattern.slots.length - 1) * PATTERN_SLOT_GAP_M
  }

  /** Keo moi thu ve phia nguoi choi. */
  step(dz: number): void {
    for (const o of this.obstacles) {
      if (!o.active) continue
      o.z -= dz
      if (o.z < Track.DESPAWN_Z) o.active = false
    }
    for (const c of this.coins) {
      if (!c.active) continue
      c.z -= dz
      if (c.z < Track.DESPAWN_Z) c.active = false
    }
  }

  get activeObstacleCount(): number {
    let n = 0
    for (const o of this.obstacles) if (o.active) n++
    return n
  }

  get activeCoinCount(): number {
    let n = 0
    for (const c of this.coins) if (c.active) n++
    return n
  }

  private get freeObstacles(): number {
    return this.obstacles.length - this.activeObstacleCount
  }

  private get freeCoins(): number {
    return this.coins.length - this.activeCoinCount
  }

  private takeObstacle(): Obstacle | null {
    for (const o of this.obstacles) {
      if (!o.active) {
        o.active = true
        return o
      }
    }
    return null
  }

  private takeCoin(): Coin | null {
    for (const c of this.coins) {
      if (!c.active) {
        c.active = true
        return c
      }
    }
    return null
  }
}
