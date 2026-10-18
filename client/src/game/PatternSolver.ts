import { PATTERN_SLOT_GAP_M, SPEED_MAX_MPS, SPEED_START_MPS, STEP_MS, STEP_S } from './constants'
import { obstacleAabb, overlaps } from './Collision'
import { Player, type PlayerSnapshot } from './Player'
import type { InputIntent, Obstacle, Pattern } from './types'

/**
 * Chung minh mot cum chuong ngai CO the vuot qua.
 *
 * Vi sao can: random thuan se sinh ra luc chan ca ba lan. Nguoi choi chet oan,
 * va thu do trong giong "game kho" chu khong giong bug — nen khong ai bao loi,
 * ho chi bo choi. invariants.md §10.
 *
 * Cach lam: KHONG mo hinh hoa lai luat choi. Solver chay chinh `Player` va chinh
 * `Collision` cua ban phat hanh. Neu luat choi doi, solver doi theo — mot ban mo
 * hinh toan hoc rieng se lech dan roi noi doi ma khong ai biet.
 *
 * Thuat toan: BFS theo tung lop thoi gian. Moi DECISION_EVERY_STEPS buoc, moi
 * trang thai con song duoc nhan ra nam nhanh ung voi nam hanh dong. Trang thai
 * trung nhau (sau khi luong hoa) bi gop lai, nen khong gian tim kiem khong no.
 *
 * Vi thoi gian bay la HANG SO ma toc do thi tang, mot cu nhay o toc do cao phu
 * nhieu met hon o toc do thap. Tinh giai duoc vi vay PHU THUOC TOC DO — nen ta
 * kiem o ca hai cuc: toc do dau va tran toc do.
 *
 * Gioi han da biet: solver cho phep doi y dinh moi ~50ms, tuc no chung minh
 * "ton tai duong di", khong chung minh "de choi". Phan thoi gian danh cho nguoi
 * choi do REACTION_MIN_MS o Spawner lo, khong phai file nay.
 */

/** Nguoi choi doi y dinh moi ~50ms — do phan giai du cho tay nguoi. */
const DECISION_EVERY_STEPS = 3

const NONE: InputIntent = { lane: 0, jump: false, slide: false, skill: false }
const CHOICES: readonly InputIntent[] = [
  NONE,
  { lane: -1, jump: false, slide: false, skill: false },
  { lane: 1, jump: false, slide: false, skill: false },
  { lane: 0, jump: true, slide: false, skill: false },
  { lane: 0, jump: false, slide: true, skill: false },
]

export function flattenPattern(pattern: Pattern): Obstacle[] {
  const out: Obstacle[] = []
  pattern.slots.forEach((slot, i) => {
    slot.forEach((cell, lane) => {
      if (cell) out.push({ active: true, kind: cell, lane, z: (i + 1) * PATTERN_SLOT_GAP_M })
    })
  })
  return out
}

export function isSolvableAt(pattern: Pattern, speedMps: number): boolean {
  const obstacles = flattenPattern(pattern)
  if (obstacles.length === 0) return true

  const endZ = (pattern.slots.length + 2) * PATTERN_SLOT_GAP_M
  const dz = speedMps * STEP_S
  const totalSteps = Math.ceil(endZ / dz)

  const player = new Player()
  player.reset()
  let frontier: PlayerSnapshot[] = [player.save()]

  for (let step = 0; step < totalSteps; step++) {
    const z = (step + 1) * dz
    const canDecide = step % DECISION_EVERY_STEPS === 0
    const choices = canDecide ? CHOICES : [NONE]
    const next = new Map<string, PlayerSnapshot>()

    for (const snap of frontier) {
      for (const intent of choices) {
        player.load(snap)
        player.apply(intent)
        player.step(STEP_MS)
        if (hits(player, obstacles, z)) continue
        const key = keyOf(player)
        if (!next.has(key)) next.set(key, player.save())
      }
    }

    if (next.size === 0) return false
    frontier = [...next.values()]
  }
  return true
}

/** Giai duoc o CA HAI cuc toc do. Day la dinh nghia ta cam ket. */
export function isSolvable(pattern: Pattern): boolean {
  return isSolvableAt(pattern, SPEED_START_MPS) && isSolvableAt(pattern, SPEED_MAX_MPS)
}

function hits(player: Player, obstacles: readonly Obstacle[], playerZ: number): boolean {
  const box = player.aabb
  for (const o of obstacles) {
    const rel = o.z - playerZ
    if (rel > 3 || rel < -3) continue
    if (overlaps(box, { ...obstacleAabb(o), cz: rel })) return true
  }
  return false
}

/**
 * Khoa luong hoa. Hai trang thai gan nhau den muc nay thi coi nhu mot — day la
 * thu giu cho khong gian tim kiem khong no theo ham mu.
 */
function keyOf(p: Player): string {
  const s = p.save()
  return `${s.laneFrom},${s.laneTo},${Math.round(s.laneT * 16)},${s.state},${Math.round(s.actionLeftMs / 8)}`
}
