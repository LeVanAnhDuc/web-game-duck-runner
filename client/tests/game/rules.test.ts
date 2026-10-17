import { describe, expect, it } from 'vitest'
import { Player } from '../../src/game/Player'
import { obstacleAabb, overlaps } from '../../src/game/Collision'
import { Spawner } from '../../src/game/Spawner'
import { Track } from '../../src/game/Track'
import { Game } from '../../src/game/Game'
import { isSolvable, isSolvableAt } from '../../src/game/PatternSolver'
import { PATTERNS } from '../../src/data/patterns'
import { createRng } from '../../src/core/rng'
import {
  LANE_CENTER, LANE_CHANGE_MS, LANE_WIDTH_M, REACTION_MIN_MS, SPEED_MAX_MPS,
  SPEED_START_MPS, STEP_MS,
} from '../../src/game/constants'
import type { Obstacle, Pattern } from '../../src/game/types'

describe('BAT BIEN #1 — va cham theo vi tri THAT, khong theo lan dich', () => {
  it('giua luc doi lan, nhan vat nam GIUA hai lan', () => {
    const p = new Player()
    p.reset()
    p.apply({ lane: 1, jump: false, slide: false, skill: false })
    p.step(LANE_CHANGE_MS / 2)
    const centre = 0
    const right = LANE_WIDTH_M
    expect(p.x).toBeGreaterThan(centre)
    expect(p.x).toBeLessThan(right)
  })

  it('KHONG the xuyen qua chuong ngai bang cach bam doi lan dung luc', () => {
    // Khoi chan het lan giua. Nhan vat o lan giua va bam sang phai.
    // Neu va cham doc laneTo thi ngay frame dau no da "o lan 2" va thoat sach.
    const wall: Obstacle = { active: true, kind: 'block', lane: LANE_CENTER, z: 0 }
    const p = new Player()
    p.reset()
    p.apply({ lane: 1, jump: false, slide: false, skill: false })

    let hitAtLeastOnce = false
    for (let i = 0; i < 4; i++) {
      p.step(STEP_MS)
      if (overlaps(p.aabb, { ...obstacleAabb(wall), cz: 0 })) hitAtLeastOnce = true
    }
    expect(hitAtLeastOnce).toBe(true)
  })

  it('nhay qua duoc chuong ngai thap, khong qua duoc khoi chan', () => {
    const low: Obstacle = { active: true, kind: 'low', lane: LANE_CENTER, z: 0 }
    const block: Obstacle = { active: true, kind: 'block', lane: LANE_CENTER, z: 0 }
    const p = new Player()
    p.reset()
    p.apply({ lane: 0, jump: true, slide: false, skill: false })
    for (let i = 0; i < 18; i++) p.step(STEP_MS)
    expect(overlaps(p.aabb, { ...obstacleAabb(low), cz: 0 })).toBe(false)
    expect(overlaps(p.aabb, { ...obstacleAabb(block), cz: 0 })).toBe(true)
  })

  it('truot qua duoc chuong ngai cao', () => {
    const high: Obstacle = { active: true, kind: 'high', lane: LANE_CENTER, z: 0 }
    const p = new Player()
    p.reset()
    expect(overlaps(p.aabb, { ...obstacleAabb(high), cz: 0 })).toBe(true)
    p.apply({ lane: 0, jump: false, slide: true, skill: false })
    p.step(STEP_MS)
    expect(overlaps(p.aabb, { ...obstacleAabb(high), cz: 0 })).toBe(false)
  })

  it('nhay khi dang nhay bi bo qua, khong xep hang', () => {
    const p = new Player()
    p.reset()
    p.apply({ lane: 0, jump: true, slide: false, skill: false })
    for (let i = 0; i < 10; i++) p.step(STEP_MS)
    const yBefore = p.y
    p.apply({ lane: 0, jump: true, slide: false, skill: false })
    p.step(STEP_MS)
    // Neu lenh thu hai duoc nhan, parabol khoi dong lai va y tut ve gan 0
    expect(p.y).toBeGreaterThan(yBefore)
  })

  it('doi lan VAN duoc phep trong luc nhay', () => {
    const p = new Player()
    p.reset()
    p.apply({ lane: 0, jump: true, slide: false, skill: false })
    p.step(STEP_MS)
    p.apply({ lane: -1, jump: false, slide: false, skill: false })
    for (let i = 0; i < 10; i++) p.step(STEP_MS)
    expect(p.laneTo).toBe(LANE_CENTER - 1)
    expect(p.state).toBe('jumping')
  })

  it('khong doi lan ra ngoai bien', () => {
    const p = new Player()
    p.reset()
    for (let i = 0; i < 5; i++) {
      p.apply({ lane: -1, jump: false, slide: false, skill: false })
      for (let s = 0; s < 12; s++) p.step(STEP_MS)
    }
    expect(p.laneTo).toBe(0)
  })
})

describe('BAT BIEN #3 — khoang cach sinh tinh bang thoi gian phan xa', () => {
  it('khoang cach toi thieu ti le thuan voi toc do', () => {
    const slow = Spawner.minGapM(SPEED_START_MPS)
    const fast = Spawner.minGapM(SPEED_MAX_MPS)
    expect(fast / slow).toBeCloseTo(SPEED_MAX_MPS / SPEED_START_MPS, 5)
  })

  it('o MOI muc toc do, nguoi choi luon co it nhat REACTION_MIN_MS de phan ung', () => {
    for (let v = SPEED_START_MPS; v <= SPEED_MAX_MPS; v += 0.5) {
      const gapM = Spawner.minGapM(v)
      const reactionMs = (gapM / v) * 1000
      expect(reactionMs).toBeGreaterThanOrEqual(REACTION_MIN_MS - 1e-6)
    }
  })

  it('do kho mo theo TOC DO, khong theo thoi gian', () => {
    expect(Spawner.tierFor(SPEED_START_MPS)).toBe(1)
    expect(Spawner.tierFor(SPEED_MAX_MPS)).toBe(3)
  })
})

describe('BAT BIEN #10 — moi pattern deu co duong di qua', () => {
  it.each(PATTERNS.map((p) => [p.id, p] as [string, Pattern]))(
    '%s giai duoc o ca hai cuc toc do',
    (_id, p) => {
      expect(isSolvable(p)).toBe(true)
    },
  )

  it('solver TU CHOI cum chan het ba lan — no khong phai luon tra ve true', () => {
    const impossible: Pattern = {
      id: 'wall-of-three',
      tier: 1,
      slots: [['block', 'block', 'block']],
    }
    expect(isSolvableAt(impossible, SPEED_START_MPS)).toBe(false)
  })

  it('moi tier deu co pattern', () => {
    for (const t of [1, 2, 3]) {
      expect(PATTERNS.some((p) => p.tier === t)).toBe(true)
    }
  })
})

describe('BAT BIEN #9 — pool khong lon them', () => {
  it('so object song la hang so sau 10 000 buoc', () => {
    const track = new Track()
    const obstacleTotal = track.obstacles.length
    const coinTotal = track.coins.length
    const rng = createRng(123)
    const spawner = new Spawner(rng)
    spawner.reset()
    let speed = SPEED_START_MPS
    for (let i = 0; i < 10_000; i++) {
      speed = Math.min(SPEED_MAX_MPS, speed + 0.14 / 60)
      const dz = speed / 60
      track.step(dz)
      spawner.step(dz, speed, track)
    }
    expect(track.obstacles.length).toBe(obstacleTotal)
    expect(track.coins.length).toBe(coinTotal)
    expect(track.activeObstacleCount).toBeLessThanOrEqual(obstacleTotal)
  })
})

describe('Game — may trang thai va tinh tat dinh', () => {
  const runScripted = (seed: number) => {
    const g = new Game()
    g.start(seed)
    const scripted = createRng(seed ^ 0x5eed)
    for (let i = 0; i < 6000 && g.phase === 'running'; i++) {
      const r = scripted.next()
      if (r < 0.03) g.queue({ lane: -1 })
      else if (r < 0.06) g.queue({ lane: 1 })
      else if (r < 0.1) g.queue({ jump: true })
      else if (r < 0.13) g.queue({ slide: true })
      g.step()
    }
    return { d: g.scoring.distanceM, phase: g.phase, speed: g.speedMps }
  }

  it('TAT DINH: cung seed + cung chuoi input cho cung ket qua', () => {
    expect(runScripted(2024)).toEqual(runScripted(2024))
  })

  it('seed khac cho ra the gioi khac', () => {
    // So sanh THE GIOI SINH RA, khong so sanh quang duong luc chet: nguoi choi
    // kich ban chet o chuong ngai dau tien, nen quang duong noi rat it ve seed.
    const worldSignature = (seed: number) => {
      const track = new Track()
      const spawner = new Spawner(createRng(seed))
      spawner.reset(track)
      let speed = SPEED_START_MPS
      const seen: string[] = []
      for (let i = 0; i < 4000; i++) {
        speed = Math.min(SPEED_MAX_MPS, speed + 0.14 / 60)
        const dz = speed / 60
        track.step(dz)
        spawner.step(dz, speed, track)
        if (i % 200 === 0) {
          seen.push(
            track.obstacles
              .filter((o) => o.active)
              .map((o) => `${o.kind}${o.lane}${o.z.toFixed(1)}`)
              .join(','),
          )
        }
      }
      return seen.join('|')
    }
    expect(worldSignature(1)).not.toBe(worldSignature(2))
    expect(worldSignature(7)).toBe(worldSignature(7))
  })

  it('cum dau tien luon de trong lan giua — nguoi choi khong duoc chet trong 3 giay dau', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const g = new Game()
      g.start(seed)
      // Ba giay dau: khong bam gi ca, chi chay thang
      for (let i = 0; i < 180; i++) g.step()
      expect(g.phase).toBe('running')
    }
  })

  it('bam Choi lai hai lan that nhanh khong tao hai luot chong nhau', () => {
    const g = new Game()
    g.start(5)
    for (let i = 0; i < 100; i++) g.step()
    const d = g.scoring.distanceM
    g.start(999)
    expect(g.seed).toBe(5)
    expect(g.scoring.distanceM).toBe(d)
  })

  it('step() khi chua bat dau thi khong lam gi', () => {
    const g = new Game()
    for (let i = 0; i < 10; i++) g.step()
    expect(g.scoring.distanceM).toBe(0)
    expect(g.phase).toBe('idle')
  })

  it('phat su kien runEnded khi va cham', () => {
    const g = new Game()
    let ended: { distanceM: number } | null = null
    g.events.on('runEnded', (p) => {
      ended = p
    })
    g.start(3)
    for (let i = 0; i < 40_000 && g.phase === 'running'; i++) g.step()
    expect(g.phase).toBe('ended')
    expect(ended).not.toBeNull()
  })
})
