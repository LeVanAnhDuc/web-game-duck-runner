import { patternsForTier } from '../data/patterns'
import type { Rng } from '../core/rng'
import {
  REACTION_MIN_MS, SPAWN_AHEAD_M, SPAWN_GAP_JITTER, SPEED_START_MPS, TIER2_SPEED_MPS,
  TIER3_SPEED_MPS,
} from './constants'
import type { Track } from './Track'

/**
 * Quyet dinh khi nao dat cum tiep theo.
 *
 * BAT BIEN #3 nam tron trong `minGapM`: khoang cach tinh bang THOI GIAN PHAN XA
 * nhan TOC DO HIEN TAI, khong phai mot hang so met. Thoi gian phan xa cua nguoi
 * choi la hang so; toc do thi tang. Giu khoang cach co dinh thi sau khoang mot
 * phut game tro thanh bat kha — khong phai kho, ma la khong the.
 */
export class Spawner {
  private distanceUntilNextM = 0

  constructor(private readonly rng: Rng) {}

  /**
   * Nap san duong chay.
   *
   * Khong lam viec nay thi cum dau tien sinh o SPAWN_AHEAD_M va mat ~10 giay de
   * di toi nguoi choi — muoi giay dau tien cua game la mot con duong trong
   * khong. Do la an tuong dau tien te nhat co the co.
   */
  reset(track?: Track): void {
    this.distanceUntilNextM = SPAWN_AHEAD_M
    if (!track) return
    const gap = Spawner.minGapM(SPEED_START_MPS)
    const pool = patternsForTier(1)
    // Cum dau tien phai de trong lan giua: nguoi choi vua bam Choi, chua kip
    // hieu minh dang o dau, va chet trong ba giay dau thi ho khong choi lai.
    const opener = pool.filter((p) => p.slots[0]?.[1] === null)
    // Vi tri cum dau tien co ngau nhien: de co dinh thi moi luot choi mo dau
    // y het nhau, va nguoi choi hoc thuoc long ba giay dau.
    let z = 28 + this.rng.next() * 14
    let first = true
    while (z < SPAWN_AHEAD_M) {
      const pattern = this.rng.pick(first && opener.length > 0 ? opener : pool)
      first = false
      const span = track.spawnPattern(pattern, z)
      if (span < 0) break
      z += span + gap * (3 + this.rng.next() * SPAWN_GAP_JITTER)
    }
  }

  /** Khoang cach toi thieu giua hai cum o toc do da cho, met. */
  static minGapM(speedMps: number): number {
    return (REACTION_MIN_MS / 1000) * speedMps
  }

  static tierFor(speedMps: number): 1 | 2 | 3 {
    if (speedMps >= TIER3_SPEED_MPS) return 3
    if (speedMps >= TIER2_SPEED_MPS) return 2
    return 1
  }

  step(dz: number, speedMps: number, track: Track): void {
    this.distanceUntilNextM -= dz
    if (this.distanceUntilNextM > 0) return

    const pool = patternsForTier(Spawner.tierFor(speedMps))
    const pattern = this.rng.pick(pool)
    const spanM = track.spawnPattern(pattern, SPAWN_AHEAD_M)
    if (spanM < 0) {
      // Pool day — thu lai sau mot nhip thay vi bo cum vinh vien
      this.distanceUntilNextM = Spawner.minGapM(speedMps)
      return
    }
    const gap = Spawner.minGapM(speedMps)
    this.distanceUntilNextM = spanM + gap * (1 + this.rng.next() * SPAWN_GAP_JITTER)
  }
}
