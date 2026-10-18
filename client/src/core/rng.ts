/**
 * Sinh so ngau nhien co seed.
 *
 * Vi sao khong dung Math.random: test tat dinh la test bat duoc nhieu hoi quy
 * gameplay nhat (ADR-0002). No chi kha thi khi cung mot seed cho ra cung mot dai
 * so. `Math.random` thi khong tai lap duoc, va mot loi spawn se khong bao gio
 * dung lai duoc de sua.
 */
export interface Rng {
  /** [0, 1) */
  next(): number
  /** So nguyen trong [min, max] */
  int(min: number, max: number): number
  /** Mot phan tu bat ky. Mang rong thi nem — goi sai la loi lap trinh. */
  pick<T>(items: readonly T[]): T
}

/** mulberry32 — 32 bit, du tot cho game va ngan gon. */
export function createRng(seed: number): Rng {
  let a = seed >>> 0
  const next = (): number => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick<T>(items: readonly T[]): T {
      if (items.length === 0) throw new Error('rng.pick: mang rong')
      return items[Math.floor(next() * items.length)] as T
    },
  }
}
