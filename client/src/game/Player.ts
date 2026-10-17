import {
  JUMP_HEIGHT_M, JUMP_MS, LANE_CENTER, LANE_CHANGE_MS, LANE_COUNT, LANE_WIDTH_M,
  PLAYER_HALF_D_M, PLAYER_HALF_W_M, PLAYER_SLIDE_H_M, PLAYER_STAND_H_M, SLIDE_MS,
} from './constants'
import type { Aabb, InputIntent } from './types'

export type PlayerState = 'running' | 'jumping' | 'sliding'

export interface PlayerSnapshot {
  laneFrom: number
  laneTo: number
  laneT: number
  state: PlayerState
  actionLeftMs: number
  actionTotalMs: number
}

/**
 * Nhan vat.
 *
 * BAT BIEN #1: `x` la vi tri THAT, noi suy giua laneFrom va laneTo. Va cham doc
 * `x`, khong doc `laneTo`. Neu doc lan dich thi nguoi choi bam doi lan dung luc
 * la xuyen qua chuong ngai — game van chay, test van xanh, co mot lo khai thac.
 */
export class Player {
  laneFrom = LANE_CENTER
  laneTo = LANE_CENTER
  /** [0,1] tien do chuyen lan. */
  laneT = 1
  state: PlayerState = 'running'
  /** Thoi gian con lai cua hanh dong hien tai, ms. */
  private actionLeftMs = 0
  private actionTotalMs = 0

  reset(): void {
    this.laneFrom = LANE_CENTER
    this.laneTo = LANE_CENTER
    this.laneT = 1
    this.state = 'running'
    this.actionLeftMs = 0
    this.actionTotalMs = 0
  }

  /** Vi tri ngang thuc te, met. */
  get x(): number {
    const from = (this.laneFrom - LANE_CENTER) * LANE_WIDTH_M
    const to = (this.laneTo - LANE_CENTER) * LANE_WIDTH_M
    return from + (to - from) * easeOutCubic(this.laneT)
  }

  /** Do cao tam nhan vat so voi mat duong, met. */
  get y(): number {
    if (this.state !== 'jumping') return 0
    const t = 1 - this.actionLeftMs / this.actionTotalMs
    // Parabol theo THOI GIAN, khong theo gia toc: thoi gian bay la hang so nen
    // nguoi choi hoc duoc nhip, va nhip khong doi khi toc do tang.
    return 4 * JUMP_HEIGHT_M * t * (1 - t)
  }

  get height(): number {
    return this.state === 'sliding' ? PLAYER_SLIDE_H_M : PLAYER_STAND_H_M
  }

  /** Hop bao — dung cho va cham. cz = 0: nhan vat luon la goc toa do doc. */
  get aabb(): Aabb {
    const h = this.height
    return {
      cx: this.x,
      cy: this.y + h / 2,
      halfW: PLAYER_HALF_W_M,
      halfH: h / 2,
      cz: 0,
      halfD: PLAYER_HALF_D_M,
    }
  }

  apply(intent: InputIntent): void {
    // Doi lan duoc phep trong luc nhay hoac truot — no la truc doc lap.
    if (intent.lane !== 0 && this.laneT >= 1) {
      const target = clampLane(this.laneTo + intent.lane)
      if (target !== this.laneTo) {
        this.laneFrom = this.laneTo
        this.laneTo = target
        this.laneT = 0
      }
    }
    // Nhay/truot khi dang nhay/truot thi BO QUA, khong xep hang. Xep hang lam
    // nguoi choi mat cam giac dieu khien: hanh dong xay ra sau khi ho da thoi muon.
    if (this.state === 'running') {
      if (intent.jump) this.begin('jumping', JUMP_MS)
      else if (intent.slide) this.begin('sliding', SLIDE_MS)
    }
  }

  step(dtMs: number): void {
    if (this.laneT < 1) {
      this.laneT = Math.min(1, this.laneT + dtMs / LANE_CHANGE_MS)
    }
    if (this.state !== 'running') {
      this.actionLeftMs -= dtMs
      if (this.actionLeftMs <= 0) {
        this.state = 'running'
        this.actionLeftMs = 0
      }
    }
  }

  /** Chup trang thai — dung boi PatternSolver de thu nhieu nhanh hanh dong. */
  save(): PlayerSnapshot {
    return {
      laneFrom: this.laneFrom, laneTo: this.laneTo, laneT: this.laneT,
      state: this.state, actionLeftMs: this.actionLeftMs, actionTotalMs: this.actionTotalMs,
    }
  }

  load(s: PlayerSnapshot): void {
    this.laneFrom = s.laneFrom
    this.laneTo = s.laneTo
    this.laneT = s.laneT
    this.state = s.state
    this.actionLeftMs = s.actionLeftMs
    this.actionTotalMs = s.actionTotalMs
  }

  private begin(state: PlayerState, durationMs: number): void {
    this.state = state
    this.actionLeftMs = durationMs
    this.actionTotalMs = durationMs
  }
}

export function clampLane(lane: number): number {
  return Math.max(0, Math.min(LANE_COUNT - 1, lane))
}

function easeOutCubic(t: number): number {
  const c = 1 - t
  return 1 - c * c * c
}
