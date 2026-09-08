import { describe, expect, it } from 'vitest'
import { DEFAULT_SAVE, load, sanitize, save, SAVE_KEY, type Storage } from '../../src/data/save'

const fake = (initial?: string): Storage & { data: Map<string, string> } => {
  const data = new Map<string, string>()
  if (initial !== undefined) data.set(SAVE_KEY, initial)
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
  }
}

const throwing = (): Storage => ({
  getItem: () => {
    throw new Error('che do rieng tu chan localStorage')
  },
  setItem: () => {
    throw new Error('het dung luong')
  },
})

describe('NFR-DATA-04 — ban luu hong khong duoc lam hong game', () => {
  it('chua co gi thi tra ve mac dinh', () => {
    expect(load(fake())).toEqual(DEFAULT_SAVE)
  })

  it('JSON hong -> mac dinh, khong nem', () => {
    expect(() => load(fake('{khong phai json'))).not.toThrow()
    expect(load(fake('{khong phai json'))).toEqual(DEFAULT_SAVE)
  })

  it('JSON hop le nhung khong phai object -> mac dinh', () => {
    expect(load(fake('42'))).toEqual(DEFAULT_SAVE)
    expect(load(fake('null'))).toEqual(DEFAULT_SAVE)
    expect(load(fake('"chuoi"'))).toEqual(DEFAULT_SAVE)
    expect(load(fake('[1,2,3]'))).toEqual(DEFAULT_SAVE)
  })

  it('thieu field -> field do lay mac dinh, field con lai giu nguyen', () => {
    const got = load(fake(JSON.stringify({ version: 1, bestDistanceM: 500 })))
    expect(got.bestDistanceM).toBe(500)
    expect(got.coins).toBe(DEFAULT_SAVE.coins)
    expect(got.selectedCharacter).toBe(DEFAULT_SAVE.selectedCharacter)
  })

  it('so hong (NaN, Infinity, chuoi) KHONG duoc lot vao phan tinh diem', () => {
    const got = load(
      fake(JSON.stringify({ version: 1, bestDistanceM: 'nhieu lam', coins: null })),
    )
    expect(Number.isFinite(got.bestDistanceM)).toBe(true)
    expect(Number.isFinite(got.coins)).toBe(true)
    expect(got.bestDistanceM).toBe(0)
  })

  it('so am bi ep ve 0 — vi da tung co ban luu bi sua tay', () => {
    expect(sanitize({ coins: -999 }).coins).toBe(0)
  })

  it('am luong ngoai [0,1] bi kep lai', () => {
    expect(sanitize({ musicVolume: 8 }).musicVolume).toBe(1)
    expect(sanitize({ sfxVolume: -3 }).sfxVolume).toBe(0)
  })

  it('version cu -> doc duoc, nang len version hien tai', () => {
    const got = load(fake(JSON.stringify({ version: 0, bestDistanceM: 120 })))
    expect(got.version).toBe(DEFAULT_SAVE.version)
    expect(got.bestDistanceM).toBe(120)
  })

  it('nhan vat mac dinh LUON thuoc so huu, ke ca khi ban luu noi khong', () => {
    const got = sanitize({ ownedCharacters: [], selectedCharacter: 'khong-ton-tai' })
    expect(got.ownedCharacters).toContain(DEFAULT_SAVE.selectedCharacter)
    expect(got.selectedCharacter).toBe(DEFAULT_SAVE.selectedCharacter)
  })

  it('chon nhan vat chua so huu -> ve mac dinh', () => {
    const got = sanitize({ ownedCharacters: ['runner'], selectedCharacter: 'glider' })
    expect(got.selectedCharacter).toBe('runner')
  })

  it('localStorage nem khi doc -> mac dinh, khong crash', () => {
    expect(() => load(throwing())).not.toThrow()
    expect(load(throwing())).toEqual(DEFAULT_SAVE)
  })

  it('localStorage nem khi ghi -> tra ve false, khong crash', () => {
    expect(save({ ...DEFAULT_SAVE }, throwing())).toBe(false)
  })
})

describe('ghi roi doc lai', () => {
  it('giu nguyen du lieu', () => {
    const store = fake()
    const data = { ...DEFAULT_SAVE, bestDistanceM: 1482, coins: 382 }
    expect(save(data, store)).toBe(true)
    expect(load(store)).toEqual(data)
  })
})
