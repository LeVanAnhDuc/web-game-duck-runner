import { afterEach, describe, expect, it, vi } from 'vitest'
import { hasWebGL, prefersReducedMotion } from '../../src/core/input'

/**
 * Hai cau hoi ve MOI TRUONG, va ca hai deu quyet dinh hanh vi im lang neu tra loi
 * sai: mot cai tat hieu ung trang tri (NFR-A11Y-05), mot cai chuyen sang man bao loi
 * thay vi de canvas den (NFR-REL-04).
 */

const originalMatchMedia = globalThis.matchMedia

afterEach(() => {
  globalThis.matchMedia = originalMatchMedia
  vi.restoreAllMocks()
})

describe('NFR-A11Y-05 — prefers-reduced-motion', () => {
  it('doc dung khi he thong bat', () => {
    globalThis.matchMedia = vi.fn((q: string) => ({
      matches: q.includes('reduce'),
      media: q,
    })) as unknown as typeof globalThis.matchMedia
    expect(prefersReducedMotion()).toBe(true)
  })

  it('doc dung khi he thong tat', () => {
    globalThis.matchMedia = vi.fn(() => ({ matches: false, media: '' })) as unknown as typeof globalThis.matchMedia
    expect(prefersReducedMotion()).toBe(false)
  })

  it('trinh duyet khong co matchMedia thi coi nhu TAT, khong nem', () => {
    // @ts-expect-error — co y xoa de gia lap trinh duyet cu
    delete globalThis.matchMedia
    expect(() => prefersReducedMotion()).not.toThrow()
    expect(prefersReducedMotion()).toBe(false)
  })
})

describe('NFR-REL-04 — phat hien WebGL', () => {
  it('khong co context thi tra ve false, khong nem', () => {
    // jsdom khong dung duoc WebGL, nen day la truong hop that
    expect(() => hasWebGL()).not.toThrow()
    expect(hasWebGL()).toBe(false)
  })

  it('getContext nem loi thi van tra ve false', () => {
    const spy = vi.spyOn(document, 'createElement')
    spy.mockImplementation(
      () =>
        ({
          getContext: () => {
            throw new Error('bi chan boi chinh sach')
          },
        }) as unknown as HTMLElement,
    )
    expect(hasWebGL()).toBe(false)
  })

  it('co context thi tra ve true', () => {
    const spy = vi.spyOn(document, 'createElement')
    spy.mockImplementation(
      () => ({ getContext: (t: string) => (t === 'webgl2' ? {} : null) }) as unknown as HTMLElement,
    )
    expect(hasWebGL()).toBe(true)
  })
})
