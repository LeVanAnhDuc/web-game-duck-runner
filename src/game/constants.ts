/**
 * Moi hang so cua LUAT CHOI nam o day, khong o dau khac.
 *
 * Ly do: can bang do kho la viec chinh so, lap di lap lai. Neu hang so nam rai
 * trong Player.ts, Spawner.ts, Track.ts thi moi lan chinh la mot lan di tim.
 */

// ── Nhip mo phong ──────────────────────────────────────────────────────────
export const STEP_MS = 1000 / 60
export const STEP_S = STEP_MS / 1000
/** Tran chong "spiral of death" khi tab bi an lau roi hien lai. */
export const MAX_STEPS_PER_FRAME = 5

// ── Lan duong ──────────────────────────────────────────────────────────────
export const LANE_COUNT = 3
/** Chi so lan: 0 trai, 1 giua, 2 phai. Toa do X = (lane - 1) * LANE_WIDTH_M */
export const LANE_CENTER = 1
export const LANE_WIDTH_M = 2.2

// ── Toc do ─────────────────────────────────────────────────────────────────
export const SPEED_START_MPS = 9
export const SPEED_MAX_MPS = 26
/** Gia toc theo thoi gian, m/s moi giay. */
export const SPEED_RAMP_MPS2 = 0.14

// ── Hanh dong ──────────────────────────────────────────────────────────────
export const LANE_CHANGE_MS = 140
export const JUMP_MS = 620
export const JUMP_HEIGHT_M = 1.9
export const SLIDE_MS = 520

// ── Hitbox ─────────────────────────────────────────────────────────────────
/** Hep hon model — le cua the loai: tha thu hon la chinh xac. */
export const PLAYER_HALF_W_M = LANE_WIDTH_M * 0.21
export const PLAYER_HALF_D_M = 0.35
export const PLAYER_STAND_H_M = 1.7
export const PLAYER_SLIDE_H_M = 0.75

// ── Sinh chuong ngai ───────────────────────────────────────────────────────
/**
 * RANG BUOC CHIU LUC — invariants.md §3.
 *
 * Khoang cach giua hai cum = REACTION_MIN_MS / 1000 * toc do hien tai.
 * Thoi gian phan xa cua nguoi choi la hang so; toc do thi tang. Neu giu khoang
 * cach co dinh thi sau khoang mot phut game thanh BAT KHA, khong phai kho.
 */
export const REACTION_MIN_MS = 620
/** Khe ho ngau nhien them vao, tinh theo boi so cua khoang cach toi thieu. */
export const SPAWN_GAP_JITTER = 0.55
export const SPAWN_AHEAD_M = 95
/** Khoang cach giua hai o trong cung mot cum, met. */
export const PATTERN_SLOT_GAP_M = 7.5

// ── Duong chay ─────────────────────────────────────────────────────────────
export const SEGMENT_LEN_M = 12
export const SEGMENT_COUNT = 14
/** Tran so chuong ngai song cung luc — quyet dinh kich thuoc pool. */
export const OBSTACLE_POOL_SIZE = 48
export const COIN_POOL_SIZE = 96
export const POWERUP_POOL_SIZE = 6

/** Khoang cach trung binh giua hai power-up, met. Thua thi het y nghia phan thuong. */
export const POWERUP_EVERY_M = 620

// ── Kich thuoc vat the ─────────────────────────────────────────────────────
export const OBSTACLE_LOW_H_M = 0.95
export const OBSTACLE_HIGH_CLEAR_M = 1.15
export const OBSTACLE_HIGH_H_M = 1.4
export const OBSTACLE_BLOCK_H_M = 2.6
export const OBSTACLE_HALF_D_M = 0.5

// ── Do kho ─────────────────────────────────────────────────────────────────
/** Nguong toc do de mo tier pattern kho hon. Theo TOC DO, khong theo thoi gian:
 *  nguoi choi gioi len toc do cao nhanh hon thi gap cum kho som hon. */
export const TIER2_SPEED_MPS = 13
export const TIER3_SPEED_MPS = 18
