import type { Pattern } from '../game/types'

/**
 * Catalog cum chuong ngai — DU LIEU, khong phai code.
 *
 * Moi cum PHAI ton tai it nhat mot duong di qua (invariants.md §10). Dieu do
 * khong duoc bao dam bang cach doc ky, ma bang test duyet toan bo file nay qua
 * `PatternSolver`. Them mot cum sai thi CI do, khong phai nguoi choi phat hien.
 *
 * Quy uoc o: null trong · 'low' nhay qua · 'high' truot duoi · 'block' chi doi lan.
 * Moi slot la mot hang ba o, ung voi lan 0 / 1 / 2.
 */
export const PATTERNS: readonly Pattern[] = [
  // ── Tier 1 — mot hanh dong, mot quyet dinh ───────────────────────────────
  {
    id: 't1-low-mid',
    tier: 1,
    slots: [[null, 'low', null]],
    coins: [[0, 0], [0, 2]],
  },
  {
    id: 't1-high-mid',
    tier: 1,
    slots: [[null, 'high', null]],
    coins: [[0, 0], [0, 2]],
  },
  {
    id: 't1-block-left',
    tier: 1,
    slots: [['block', null, null]],
    coins: [[0, 1], [0, 2]],
  },
  {
    id: 't1-block-right',
    tier: 1,
    slots: [[null, null, 'block']],
    coins: [[0, 0], [0, 1]],
  },
  {
    id: 't1-low-wide',
    tier: 1,
    slots: [['low', 'low', 'low']],
    coins: [[0, 1]],
  },

  // ── Tier 2 — hai quyet dinh noi tiep ─────────────────────────────────────
  {
    id: 't2-block-then-low',
    tier: 2,
    slots: [
      ['block', null, null],
      [null, 'low', null],
    ],
    coins: [[0, 2], [1, 2]],
  },
  {
    id: 't2-high-then-block',
    tier: 2,
    slots: [
      [null, 'high', null],
      [null, null, 'block'],
    ],
    coins: [[0, 0], [1, 0]],
  },
  {
    id: 't2-corridor-left',
    tier: 2,
    slots: [
      [null, 'block', 'block'],
      [null, 'block', null],
    ],
    coins: [[0, 0], [1, 0]],
  },
  {
    id: 't2-high-wide',
    tier: 2,
    slots: [['high', 'high', 'high']],
    coins: [[0, 1]],
  },
  {
    id: 't2-zigzag',
    tier: 2,
    slots: [
      ['block', null, null],
      [null, null, 'block'],
    ],
    coins: [[0, 1], [1, 1]],
  },

  // ── Tier 3 — ba quyet dinh, khong con lan an toan co dinh ────────────────
  {
    id: 't3-stair',
    tier: 3,
    slots: [
      ['block', null, null],
      [null, 'block', null],
      [null, null, 'block'],
    ],
    coins: [[0, 2], [1, 2], [2, 1]],
  },
  {
    id: 't3-low-corridor',
    tier: 3,
    slots: [
      ['block', null, 'block'],
      [null, 'low', null],
      ['block', null, 'block'],
    ],
    coins: [[1, 1]],
  },
  {
    id: 't3-high-then-low',
    tier: 3,
    slots: [
      ['high', 'high', 'high'],
      [null, null, null],
      ['low', 'low', 'low'],
    ],
    coins: [[1, 1]],
  },
  {
    id: 't3-weave',
    tier: 3,
    slots: [
      [null, 'block', 'block'],
      ['block', null, 'block'],
      ['block', 'block', null],
    ],
    coins: [[0, 0], [1, 1], [2, 2]],
  },
]

export function patternsForTier(maxTier: 1 | 2 | 3): readonly Pattern[] {
  return PATTERNS.filter((p) => p.tier <= maxTier)
}
