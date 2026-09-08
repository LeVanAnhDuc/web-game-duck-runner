/** Kieu dung chung cua tang mo phong. Khong co gi o day biet ve Three.js. */

export type ObstacleKind = 'low' | 'high' | 'block'

/** Mot o trong cum: null la trong. */
export type PatternCell = ObstacleKind | null

/** Mot cum chuong ngai. slots[i] la ba o ung voi ba lan. */
export interface Pattern {
  readonly id: string
  readonly tier: 1 | 2 | 3
  readonly slots: readonly (readonly [PatternCell, PatternCell, PatternCell])[]
  /** Vi tri xu di kem, [slotIndex, lane]. */
  readonly coins?: readonly (readonly [number, number])[]
}

export interface Obstacle {
  active: boolean
  kind: ObstacleKind
  lane: number
  /** Toa do doc theo duong chay, met. Tang dan ve phia truoc. */
  z: number
}

export interface Coin {
  active: boolean
  lane: number
  z: number
}

/** Power-up nam tren duong. Khac ky nang: khong chon duoc thoi diem. */
export type PowerUpKind = 'magnet' | 'shield' | 'rush'

export interface PowerUp {
  active: boolean
  kind: PowerUpKind
  lane: number
  z: number
}

export type PlayerAction = 'jump' | 'slide'

export interface InputIntent {
  /** -1 sang trai, +1 sang phai, 0 giu nguyen. Chi doc mot lan roi xoa. */
  lane: -1 | 0 | 1
  jump: boolean
  slide: boolean
  skill: boolean
}

export const emptyIntent = (): InputIntent => ({ lane: 0, jump: false, slide: false, skill: false })

export type RunPhase = 'idle' | 'running' | 'ended'

export interface Aabb {
  cx: number
  cy: number
  halfW: number
  halfH: number
  cz: number
  halfD: number
}
