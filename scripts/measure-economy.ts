/**
 * Đo nhịp kiếm xu để đặt giá nhân vật.
 *
 *   pnpm exec vite-node scripts/measure-economy.ts
 *
 * Vì sao cần: giá trong `data/catalog.ts` quyết định người chơi phải chơi bao lâu mới
 * mở được nhân vật thứ hai. Đặt số bằng cảm giác thì hoặc mở ngay sau một lượt (cửa
 * hàng vô nghĩa), hoặc mất một tiếng (không ai chờ).
 *
 * Người chơi mô phỏng ở đây là một **autopilot tham lam**: mỗi bước nó chọn làn an
 * toàn, ưu tiên làn có xu. Nó không giỏi bằng người chơi tốt và không tệ bằng người
 * mới, nên con số ra là một mốc giữa — đủ để đặt giá, không đủ để coi là chân lý.
 */
import { createRng } from '../src/core/rng'
import { Game } from '../src/game/Game'
import { obstacleAabb, overlaps } from '../src/game/Collision'
import { LANE_COUNT, STEP_S } from '../src/game/constants'
import { CHARACTERS } from '../src/data/catalog'

/** Làn nào an toàn trong LOOKAHEAD mét tới, và làn nào có xu. */
const LOOKAHEAD_M = 26

function pickLane(game: Game): { lane: number; jump: boolean; slide: boolean } {
  const scores = new Array<number>(LANE_COUNT).fill(0)
  let needJump = false
  let needSlide = false

  for (const o of game.track.obstacles) {
    if (!o.active || o.z < 0 || o.z > LOOKAHEAD_M) continue
    const weight = 1 - o.z / LOOKAHEAD_M
    if (o.kind === 'block') {
      scores[o.lane]! -= 100 * weight
    } else {
      scores[o.lane]! -= 8 * weight
    }
  }
  for (const c of game.track.coins) {
    if (!c.active || c.z < 0 || c.z > LOOKAHEAD_M) continue
    scores[c.lane]! += 4 * (1 - c.z / LOOKAHEAD_M)
  }

  const current = game.player.laneTo
  let best = current
  for (let l = 0; l < LANE_COUNT; l++) {
    if (Math.abs(l - current) > 1) continue
    if (scores[l]! > scores[best]!) best = l
  }

  // Chướng ngại sắp tới ngay trên làn đã chọn: nhảy hoặc trượt
  const box = game.player.aabb
  for (const o of game.track.obstacles) {
    if (!o.active || o.lane !== best || o.z > 4.5 || o.z < 0) continue
    if (o.kind === 'low') needJump = true
    else if (o.kind === 'high') needSlide = true
    else if (overlaps(box, { ...obstacleAabb(o), cz: o.z })) needJump = true
  }

  return { lane: best - current, jump: needJump, slide: needSlide && !needJump }
}

function runOnce(seed: number, maxSteps: number) {
  const game = new Game()
  game.start(seed)
  let steps = 0
  let skillUses = 0
  while (game.phase === 'running' && steps < maxSteps) {
    const { lane, jump, slide } = pickLane(game)
    game.queue({ lane: Math.sign(lane) as -1 | 0 | 1, jump, slide })
    if (game.chargePct >= 1) {
      game.queue({ skill: true })
      skillUses++
    }
    game.step()
    steps++
  }
  return {
    seconds: steps * STEP_S,
    distanceM: game.scoring.displayDistance,
    coins: game.scoring.coins,
    skillUses,
    survived: game.phase === 'running',
  }
}

const RUNS = 120
const MAX_STEPS = 60 * 60 * 4 // trần 4 phút mỗi lượt

let totalSeconds = 0
let totalCoins = 0
let totalDistance = 0
let deaths = 0
const runLengths: number[] = []

const rng = createRng(20260908)
for (let i = 0; i < RUNS; i++) {
  const r = runOnce(rng.int(1, 2 ** 30), MAX_STEPS)
  totalSeconds += r.seconds
  totalCoins += r.coins
  totalDistance += r.distanceM
  if (!r.survived) deaths++
  runLengths.push(r.seconds)
}

runLengths.sort((a, b) => a - b)
const median = runLengths[Math.floor(runLengths.length / 2)]!
const coinsPerMinute = (totalCoins / totalSeconds) * 60
const coinsPerRun = totalCoins / RUNS

console.log('')
console.log(`Số lượt đo:            ${RUNS}`)
console.log(`Tổng thời gian chơi:   ${(totalSeconds / 60).toFixed(1)} phút`)
console.log(`Chết trước trần:       ${deaths}/${RUNS}`)
console.log(`Độ dài lượt (trung vị): ${median.toFixed(1)} giây`)
console.log(`Quãng đường TB/lượt:   ${(totalDistance / RUNS).toFixed(0)} m`)
console.log('')
console.log(`>> XU / PHÚT:          ${coinsPerMinute.toFixed(1)}`)
console.log(`>> XU / LƯỢT:          ${coinsPerRun.toFixed(1)}`)
console.log('')
console.log('Giá hiện tại trong catalog, quy ra thời gian chơi:')
for (const c of CHARACTERS) {
  if (c.price === 0) {
    console.log(`  ${c.name.padEnd(12)} miễn phí`)
    continue
  }
  const minutes = c.price / coinsPerMinute
  const runs = c.price / coinsPerRun
  console.log(
    `  ${c.name.padEnd(12)} ${String(c.price).padStart(5)} xu  =  ` +
      `${minutes.toFixed(1)} phút  ~  ${runs.toFixed(0)} lượt`,
  )
}
console.log('')
