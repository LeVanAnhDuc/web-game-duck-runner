import { describe, expect, it } from 'vitest'
import { SimClock } from '../../src/core/clock'
import { ActiveEffects } from '../../src/game/ActiveEffects'
import { Game } from '../../src/game/Game'
import { createRng } from '../../src/core/rng'
import {
  CHARGE_COINS, RUSH_FACTOR, SHIELD_GRACE_MS, SKILL_DURATION_MS, SLOW_FACTOR,
} from '../../src/data/catalog'
import { LANE_CENTER } from '../../src/game/constants'
import type { Obstacle } from '../../src/game/types'

describe('BAT BIEN #5 — bo dem chay theo dong ho MO PHONG', () => {
  it('tam dung 10 giay thi thoi gian con lai KHONG doi', () => {
    const clock = new SimClock()
    const fx = new ActiveEffects(clock)
    fx.start('rush', 4000)
    clock.advance(1000)
    expect(fx.remainingMs('rush')).toBe(3000)

    clock.pause()
    clock.advance(10_000)
    expect(fx.remainingMs('rush')).toBe(3000)

    clock.resume()
    clock.advance(500)
    expect(fx.remainingMs('rush')).toBe(2500)
  })

  it('het han thi has() tra ve false', () => {
    const clock = new SimClock()
    const fx = new ActiveEffects(clock)
    fx.start('magnet', 1000)
    clock.advance(999)
    expect(fx.has('magnet')).toBe(true)
    clock.advance(2)
    expect(fx.has('magnet')).toBe(false)
  })

  it('cung loai thi GIA HAN, khong cong don', () => {
    const clock = new SimClock()
    const fx = new ActiveEffects(clock)
    fx.start('magnet', 3000)
    clock.advance(1000)
    fx.start('magnet', 3000)
    // Gia han: con dung 3000, khong phai 2000 + 3000
    expect(fx.remainingMs('magnet')).toBe(3000)
  })

  it('list() chi tra ve hieu ung con song', () => {
    const clock = new SimClock()
    const fx = new ActiveEffects(clock)
    fx.start('magnet', 1000)
    fx.start('rush', 3000)
    clock.advance(1500)
    expect(fx.list().map((e) => e.kind)).toEqual(['rush'])
  })
})

describe('Khien — dem LAN, khong dem gio', () => {
  it('dung duoc dung MOT lan', () => {
    const clock = new SimClock()
    const fx = new ActiveEffects(clock)
    fx.addShield()
    expect(fx.consumeShield(SHIELD_GRACE_MS)).toBe(true)
    expect(fx.consumeShield(SHIELD_GRACE_MS)).toBe(false)
  })

  it('vo khien thi duoc bat tu ngan — neu khong, vat ke tiep giet ngay', () => {
    const clock = new SimClock()
    const fx = new ActiveEffects(clock)
    fx.addShield()
    fx.consumeShield(SHIELD_GRACE_MS)
    expect(fx.invincible).toBe(true)
    clock.advance(SHIELD_GRACE_MS + 1)
    expect(fx.invincible).toBe(false)
  })

  it('nhat khien hai lan khong tich luy thanh hai khien', () => {
    const clock = new SimClock()
    const fx = new ActiveEffects(clock)
    fx.addShield()
    fx.addShield()
    expect(fx.consumeShield(0)).toBe(true)
    expect(fx.consumeShield(0)).toBe(false)
  })
})

describe('Bat tu gop moi nguon vao MOT cau hoi', () => {
  it.each(['ram', 'fly', 'rush'] as const)('%s cho bat tu', (kind) => {
    const clock = new SimClock()
    const fx = new ActiveEffects(clock)
    expect(fx.invincible).toBe(false)
    fx.start(kind, 1000)
    expect(fx.invincible).toBe(true)
  })

  it('Cham KHONG cho bat tu — no chi lam the gioi cham lai', () => {
    const clock = new SimClock()
    const fx = new ActiveEffects(clock)
    fx.start('slow', 1000)
    expect(fx.invincible).toBe(false)
  })
})

describe('He so toc do', () => {
  it('Cham lam giam, Tua nhanh lam tang, hai cai cung luc thi nhan nhau', () => {
    const clock = new SimClock()
    const fx = new ActiveEffects(clock)
    expect(fx.speedFactor(SLOW_FACTOR, RUSH_FACTOR)).toBe(1)
    fx.start('slow', 1000)
    expect(fx.speedFactor(SLOW_FACTOR, RUSH_FACTOR)).toBeCloseTo(SLOW_FACTOR, 6)
    fx.start('rush', 1000)
    expect(fx.speedFactor(SLOW_FACTOR, RUSH_FACTOR)).toBeCloseTo(SLOW_FACTOR * RUSH_FACTOR, 6)
  })
})

describe('Thanh nap va ky nang — BAT BIEN #11', () => {
  const feedCoins = (g: Game, n: number) => {
    for (let i = 0; i < n; i++) {
      const c = g.track.coins.find((x) => !x.active)
      if (!c) break
      c.active = true
      c.lane = LANE_CENTER
      c.z = 0
      g.step()
    }
  }

  it('thanh nap day dung o CHARGE_COINS xu', () => {
    const g = new Game()
    g.start(11)
    expect(g.chargePct).toBe(0)
    feedCoins(g, CHARGE_COINS)
    expect(g.chargePct).toBe(1)
  })

  it('dung ky nang reset thanh nap nhung KHONG tru vi', () => {
    const g = new Game()
    g.start(11)
    feedCoins(g, CHARGE_COINS)
    const walletBefore = g.scoring.coins
    expect(g.useSkill()).toBe(true)
    expect(g.chargePct).toBe(0)
    expect(g.scoring.coins).toBe(walletBefore)
  })

  it('bam ky nang khi thanh chua day thi bi tu choi', () => {
    const g = new Game()
    g.start(11)
    feedCoins(g, CHARGE_COINS - 1)
    expect(g.chargePct).toBeLessThan(1)
    expect(g.useSkill()).toBe(false)
  })

  it('ky nang chay dung SKILL_DURATION_MS theo dong ho mo phong', () => {
    const g = new Game()
    g.start(11)
    feedCoins(g, CHARGE_COINS)
    g.useSkill()
    const effect = g.skill.effect
    expect(g.effects.has(effect)).toBe(true)
    expect(g.effects.remainingMs(effect)).toBeCloseTo(SKILL_DURATION_MS, 0)
  })

  it('tam dung giua luc ky nang dang chay thi bo dem dung theo', () => {
    const g = new Game()
    g.start(11)
    feedCoins(g, CHARGE_COINS)
    g.useSkill()
    const effect = g.skill.effect
    for (let i = 0; i < 60; i++) g.step()
    const left = g.effects.remainingMs(effect)
    g.pause()
    for (let i = 0; i < 600; i++) g.step()
    expect(g.effects.remainingMs(effect)).toBe(left)
    g.resume()
    for (let i = 0; i < 60; i++) g.step()
    expect(g.effects.remainingMs(effect)).toBeLessThan(left)
  })
})

describe('Va cham khi dang bat tu — design.md §5', () => {
  const putWallAt = (g: Game, z: number): Obstacle => {
    const o = g.track.obstacles.find((x) => !x.active)!
    o.active = true
    o.kind = 'block'
    o.lane = LANE_CENTER
    o.z = z
    return o
  }

  it('binh thuong thi chet', () => {
    const g = new Game()
    g.start(21)
    putWallAt(g, 0)
    g.step()
    expect(g.phase).toBe('ended')
  })

  it('dang bat tu thi chuong ngai VO, luot tiep tuc', () => {
    const g = new Game()
    g.start(21)
    g.effects.start('ram', 3000)
    const wall = putWallAt(g, 0)
    g.step()
    expect(g.phase).toBe('running')
    expect(wall.active).toBe(false)
  })

  it('co khien thi khien mat, chuong ngai vo, luot tiep tuc', () => {
    const g = new Game()
    g.start(21)
    g.effects.addShield()
    const wall = putWallAt(g, 0)
    g.step()
    expect(g.phase).toBe('running')
    expect(wall.active).toBe(false)
    expect(g.effects.hasShield).toBe(false)
  })

  it('khien chi cuu MOT lan: qua thoi gian bat tu ngan thi chet', () => {
    const g = new Game()
    g.start(21)
    g.effects.addShield()
    putWallAt(g, 0)
    g.step()
    expect(g.phase).toBe('running')
    // Cho het bat tu ngan roi dung khoi thu hai
    while (g.effects.invincible && g.phase === 'running') g.step()
    putWallAt(g, 0)
    g.step()
    expect(g.phase).toBe('ended')
  })
})

describe('Cham phai doi bang quang duong', () => {
  it('quang duong tinh theo toc do THE GIOI, nen Cham thuc su la mot danh doi', () => {
    const run = (useSlow: boolean) => {
      const g = new Game()
      g.start(31)
      if (useSlow) g.effects.start('slow', 60_000)
      for (let i = 0; i < 300; i++) {
        g.phase = 'running'
        g.step()
      }
      return g.scoring.distanceM
    }
    expect(run(true)).toBeLessThan(run(false))
  })
})

describe('Tat dinh van giu khi co ky nang trong chuoi input', () => {
  it('cung seed + cung chuoi input cho cung ket qua', () => {
    const run = (seed: number) => {
      const g = new Game()
      g.start(seed)
      const scripted = createRng(seed ^ 0xbeef)
      for (let i = 0; i < 5000 && g.phase === 'running'; i++) {
        const r = scripted.next()
        if (r < 0.03) g.queue({ lane: -1 })
        else if (r < 0.06) g.queue({ lane: 1 })
        else if (r < 0.1) g.queue({ jump: true })
        else if (r < 0.13) g.queue({ slide: true })
        else if (r < 0.14) g.queue({ skill: true })
        g.step()
      }
      return { d: g.scoring.distanceM, coins: g.scoring.coins, charge: g.chargeCoins }
    }
    expect(run(4242)).toEqual(run(4242))
  })
})
