import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AudioEngine, type Sfx } from '../../src/audio/Audio'

/**
 * jsdom khong co Web Audio. Do chinh la thu can kiem: game phai choi duoc trong im
 * lang, khong nem loi, khong chan luot choi. Mot trinh duyet cu hoac mot thiet bi
 * chan audio khong duoc phep lam hong game.
 */

const ALL: Sfx[] = ['jump', 'slide', 'coin', 'hit', 'skill', 'shield', 'powerup', 'deny']

describe('Khong co Web Audio', () => {
  it('unlock() tra ve false thay vi nem', () => {
    const engine = new AudioEngine()
    expect(() => engine.unlock()).not.toThrow()
    expect(engine.unlock()).toBe(false)
  })

  it('play() im lang, khong nem', () => {
    const engine = new AudioEngine()
    for (const kind of ALL) expect(() => engine.play(kind)).not.toThrow()
  })

  it('setSettings va setMusicEnabled an toan khi chua unlock', () => {
    const engine = new AudioEngine()
    expect(() => engine.setSettings({ muted: false, musicVolume: 0.5, sfxVolume: 0.8 })).not.toThrow()
    expect(() => engine.setMusicEnabled(true)).not.toThrow()
    expect(() => engine.dispose()).not.toThrow()
  })
})

describe('Co Web Audio — ADR-0008', () => {
  const created: unknown[] = []
  let ctorCalls = 0

  beforeEach(() => {
    ctorCalls = 0
    created.length = 0
    const node = () => ({
      connect: vi.fn(function (this: unknown, next: unknown) {
        return next
      }),
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        setTargetAtTime: vi.fn(),
      },
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      start: vi.fn(),
      stop: vi.fn(),
      type: 'sine',
    })
    class FakeCtx {
      currentTime = 0
      sampleRate = 48_000
      destination = {}
      constructor() {
        ctorCalls++
      }
      createGain() {
        const n = node()
        created.push(n)
        return n
      }
      createOscillator() {
        const n = node()
        created.push(n)
        return n
      }
      createBiquadFilter() {
        return node()
      }
      createBufferSource() {
        return { ...node(), buffer: null }
      }
      createBuffer(_ch: number, frames: number) {
        const data = new Float32Array(frames)
        return { getChannelData: () => data }
      }
      resume = vi.fn(async () => undefined)
      close = vi.fn(async () => undefined)
    }
    ;(globalThis as unknown as { AudioContext: unknown }).AudioContext = FakeCtx
  })

  afterEach(() => {
    delete (globalThis as unknown as { AudioContext?: unknown }).AudioContext
    vi.useRealTimers()
  })

  it('AudioContext duoc tao DUNG MOT LAN, du unlock nhieu lan', () => {
    const engine = new AudioEngine()
    expect(engine.unlock()).toBe(true)
    engine.unlock()
    engine.unlock()
    expect(ctorCalls).toBe(1)
    engine.dispose()
  })

  it('khong tao AudioContext truoc khi unlock — moi trinh duyet chan tu dong phat', () => {
    const engine = new AudioEngine()
    engine.setSettings({ muted: false, musicVolume: 1, sfxVolume: 1 })
    engine.play('coin')
    engine.setMusicEnabled(true)
    expect(ctorCalls).toBe(0)
    engine.unlock()
    expect(ctorCalls).toBe(1)
    engine.dispose()
  })

  it('tat tieng thi play() khong dung den bo dao dong nao', () => {
    const engine = new AudioEngine()
    engine.unlock()
    const before = created.length
    engine.setSettings({ muted: true, musicVolume: 0.5, sfxVolume: 0.8 })
    for (const kind of ALL) engine.play(kind)
    expect(created.length).toBe(before)
    engine.dispose()
  })

  it('moi loai am thanh deu dung duoc, khong nem', () => {
    const engine = new AudioEngine()
    engine.unlock()
    engine.setSettings({ muted: false, musicVolume: 0.5, sfxVolume: 0.8 })
    for (const kind of ALL) expect(() => engine.play(kind)).not.toThrow()
    engine.dispose()
  })

  it('nhac nen dung lai duoc va khong de lai bo hen gio', () => {
    vi.useFakeTimers()
    const engine = new AudioEngine()
    engine.unlock()
    engine.setSettings({ muted: false, musicVolume: 0.5, sfxVolume: 0.8 })
    engine.setMusicEnabled(true)
    expect(vi.getTimerCount()).toBeGreaterThan(0)
    engine.setMusicEnabled(false)
    expect(vi.getTimerCount()).toBe(0)
    engine.dispose()
  })

  it('dispose() don sach bo hen gio', () => {
    vi.useFakeTimers()
    const engine = new AudioEngine()
    engine.unlock()
    engine.setMusicEnabled(true)
    engine.dispose()
    expect(vi.getTimerCount()).toBe(0)
  })
})
