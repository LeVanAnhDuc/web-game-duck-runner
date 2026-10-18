import { describe, expect, it } from 'vitest'
import {
  CANOPY, CHASM, COIN, COIN_RING, HAZARD, HAZARD_EDGE, MIST_FAR, MIST_NEAR,
  PLAYER_RIM, ROAD_FAR, ROAD_NEAR, SKILL, TEXT, INK_SCRIM, SCRIM_ALPHA,
} from '../../src/render/palette'

/**
 * BAT BIEN #14 — luat hai lop, do bang so chu khong bang mat.
 *
 * File nay bien mot luat thiet ke thanh mot cong CI. Ly do no ton tai: ban dau
 * `ADR-0006` noi "nguy hiem doc bang do sang", va dieu do dung — nhung chi voi
 * nen troi. Chuong ngai tren mat duong gan chi dat **1.16:1**, gan nhu vo hinh,
 * va khong mot test nao trong 123 test bat duoc, vi tat ca deu do LUAT CHOI.
 *
 * Nguoi choi tim ra trong mot phut. Test nay la de lan sau may tim ra truoc.
 */

const channels = (n: number): [number, number, number] => [(n >> 16) & 255, (n >> 8) & 255, n & 255]

/** Do sang tuong doi theo WCAG 2.1. */
export function luminance(color: number): number {
  const [r, g, b] = channels(color).map((v) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Ti so tuong phan WCAG 2.1, tu 1 den 21. */
export function contrast(a: number, b: number): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

/** Tron mot mau co alpha len tren mot mau nen. */
function over(fg: number, bg: number, alpha: number): number {
  const f = channels(fg)
  const b = channels(bg)
  return f.reduce((acc, c, i) => (acc << 8) | Math.round(c * alpha + b[i]! * (1 - alpha)), 0)
}

/** 13 cap o design.md §4. Doi mot token nao trong palette la doi bang nay. */
const PAIRS: readonly [string, number, number, number][] = [
  ['chuong ngai vs mat duong gan', HAZARD, ROAD_NEAR, 3],
  ['chuong ngai vs mat duong xa', HAZARD, ROAD_FAR, 3],
  ['chuong ngai vs suong xa', HAZARD, MIST_FAR, 4.5],
  ['canh sang vs than chuong ngai', HAZARD_EDGE, HAZARD, 3],
  ['canh sang vs mat duong gan', HAZARD_EDGE, ROAD_NEAR, 3],
  ['xu vs mat duong gan', COIN, ROAD_NEAR, 3],
  ['vong xu vs suong xa', COIN_RING, MIST_FAR, 4.5],
  ['vong xu vs than xu', COIN_RING, COIN, 3],
  ['ky nang vs mat duong gan', SKILL, ROAD_NEAR, 3],
  ['vuc vs mat duong gan', CHASM, ROAD_NEAR, 3],
  ['tan cay vs suong xa', CANOPY, MIST_FAR, 4.5],
  ['tan cay vs suong gan', CANOPY, MIST_NEAR, 3],
  ['vien vit vs mat duong gan', PLAYER_RIM, ROAD_NEAR, 3],
]

describe('NFR-A11Y-07 — moi vat the doc duoc tren nen cua no', () => {
  for (const [label, a, b, min] of PAIRS) {
    it(`${label} >= ${min}:1`, () => {
      expect(contrast(a, b)).toBeGreaterThanOrEqual(min)
    })
  }
})

describe('Luat hai lop — than toi + canh sang', () => {
  it('chuong ngai co than TOI hon va canh SANG hon mat duong', () => {
    // Day moi la dieu khien luat hai lop hoat dong: mot lop nam duoi nen, mot
    // lop nam tren. Neu ca hai cung phia thi vat the chi doc duoc tren mot loai
    // nen — dung cai bug vua sua.
    expect(luminance(HAZARD)).toBeLessThan(luminance(ROAD_NEAR))
    expect(luminance(HAZARD_EDGE)).toBeGreaterThan(luminance(ROAD_NEAR))
  })

  it('xu dao nguoc hai lop: than SANG, vong TOI', () => {
    expect(luminance(COIN)).toBeGreaterThan(luminance(ROAD_NEAR))
    expect(luminance(COIN_RING)).toBeLessThan(luminance(ROAD_NEAR))
  })

  it('vien vit la mau AM duy nhat va sang hon mat duong', () => {
    const [r, , b] = channels(PLAYER_RIM)
    expect(r).toBeGreaterThan(b)
    expect(luminance(PLAYER_RIM)).toBeGreaterThan(luminance(ROAD_NEAR))
  })
})

describe('NFR-A11Y-01 — scrim HUD tren diem sang nhat cua canh', () => {
  it(`chu tren scrim alpha ${SCRIM_ALPHA} dat 4.5:1`, () => {
    expect(contrast(TEXT, over(INK_SCRIM, MIST_FAR, SCRIM_ALPHA))).toBeGreaterThanOrEqual(4.5)
  })

  it('alpha 0.45 cua ADR-0006 KHONG con du — day la ly do con so nay doi', () => {
    expect(contrast(TEXT, over(INK_SCRIM, MIST_FAR, 0.45))).toBeLessThan(4.5)
  })
})
