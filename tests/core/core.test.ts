import { describe, expect, it } from 'vitest'
import { createRng } from '../../src/core/rng'
import { SimClock } from '../../src/core/clock'
import { FixedStepAccumulator } from '../../src/core/loop'
import { EventBus } from '../../src/core/events'
import { MAX_STEPS_PER_FRAME, STEP_MS } from '../../src/game/constants'

describe('rng — tai lap duoc', () => {
  it('cung seed cho cung dai so', () => {
    const a = createRng(42)
    const b = createRng(42)
    const seqA = Array.from({ length: 200 }, () => a.next())
    const seqB = Array.from({ length: 200 }, () => b.next())
    expect(seqA).toEqual(seqB)
  })

  it('seed khac cho dai khac', () => {
    const a = Array.from({ length: 50 }, () => createRng(1).next())
    const b = Array.from({ length: 50 }, () => createRng(2).next())
    expect(a).not.toEqual(b)
  })

  it('next() luon nam trong [0,1)', () => {
    const r = createRng(7)
    for (let i = 0; i < 10_000; i++) {
      const v = r.next()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('int() phu het khoang va khong vuot ra ngoai', () => {
    const r = createRng(9)
    const seen = new Set<number>()
    for (let i = 0; i < 5000; i++) {
      const v = r.int(0, 4)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(4)
      seen.add(v)
    }
    expect(seen.size).toBe(5)
  })
})

describe('SimClock — invariants.md §5', () => {
  it('pause dung bo dem, resume chay tiep', () => {
    const c = new SimClock()
    c.advance(100)
    c.pause()
    c.advance(1000)
    expect(c.now).toBe(100)
    c.resume()
    c.advance(50)
    expect(c.now).toBe(150)
  })
})

describe('FixedStepAccumulator — invariants.md §2', () => {
  it('60Hz va 144Hz cho cung so buoc sau cung mot quang thoi gian', () => {
    const run = (frameMs: number, totalMs: number) => {
      const acc = new FixedStepAccumulator()
      let steps = 0
      for (let t = 0; t < totalMs; t += frameMs) steps += acc.feed(frameMs)
      return steps
    }
    const at60 = run(1000 / 60, 3000)
    const at144 = run(1000 / 144, 3000)
    // Chenh lech toi da mot buoc do lam tron o bien
    expect(Math.abs(at60 - at144)).toBeLessThanOrEqual(1)
    expect(at60).toBeGreaterThan(170)
  })

  it('khong tua nhanh khi tab bi an lau', () => {
    const acc = new FixedStepAccumulator()
    expect(acc.feed(30_000)).toBe(MAX_STEPS_PER_FRAME)
  })

  it('bo qua dt am hoac khong hop le', () => {
    const acc = new FixedStepAccumulator()
    expect(acc.feed(-5)).toBe(0)
    expect(acc.feed(Number.NaN)).toBe(0)
  })

  it('alpha nam trong [0,1)', () => {
    const acc = new FixedStepAccumulator()
    acc.feed(STEP_MS * 1.5)
    expect(acc.alpha).toBeGreaterThanOrEqual(0)
    expect(acc.alpha).toBeLessThan(1)
  })
})

describe('EventBus', () => {
  it('goi handler va go duoc', () => {
    const bus = new EventBus()
    let n = 0
    const off = bus.on('chargeFull', () => n++)
    bus.emit('chargeFull', {})
    off()
    bus.emit('chargeFull', {})
    expect(n).toBe(1)
  })

  it('handler tu go chinh no trong luc chay khong lam vo vong lap', () => {
    const bus = new EventBus()
    let n = 0
    const off = bus.on('chargeFull', () => {
      n++
      off()
    })
    bus.on('chargeFull', () => n++)
    expect(() => bus.emit('chargeFull', {})).not.toThrow()
    expect(n).toBe(2)
  })
})
