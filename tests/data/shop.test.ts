import { describe, expect, it } from 'vitest'
import { CHARACTERS, characterById } from '../../src/data/catalog'
import { DEFAULT_SAVE, sanitize, type SaveData } from '../../src/data/save'
import { buy, cardState, equip, shortfall } from '../../src/data/shop'

const withCoins = (coins: number, overrides: Partial<SaveData> = {}): SaveData => ({
  ...DEFAULT_SAVE,
  coins,
  ...overrides,
})

const paid = CHARACTERS.find((c) => c.price > 0)!

describe('Mua nhan vat', () => {
  it('tru dung gia va them vao so huu', () => {
    const before = withCoins(paid.price + 50)
    const after = buy(before, paid.id)
    expect(after.coins).toBe(50)
    expect(after.ownedCharacters).toContain(paid.id)
  })

  it('IDEMPOTENT: bam mua hai lan khong tru tien hai lan', () => {
    const before = withCoins(paid.price)
    const once = buy(before, paid.id)
    const twice = buy(once, paid.id)
    expect(twice).toBe(once) // chinh doi tuong cu, khong phai ban sao
    expect(twice.coins).toBe(0)
  })

  it('khong du xu thi khong doi gi', () => {
    const before = withCoins(paid.price - 1)
    expect(buy(before, paid.id)).toBe(before)
  })

  it('id khong ton tai thi khong doi gi', () => {
    const before = withCoins(99_999)
    expect(buy(before, 'khong-ton-tai')).toBe(before)
  })

  it('mua khong tu dong chon — do la hai hanh dong khac nhau', () => {
    const after = buy(withCoins(paid.price), paid.id)
    expect(after.selectedCharacter).toBe(DEFAULT_SAVE.selectedCharacter)
  })
})

describe('Chon nhan vat', () => {
  it('chon duoc cai da so huu', () => {
    const owned = buy(withCoins(paid.price), paid.id)
    expect(equip(owned, paid.id).selectedCharacter).toBe(paid.id)
  })

  it('chua so huu thi khong doi gi', () => {
    const before = withCoins(0)
    expect(equip(before, paid.id)).toBe(before)
  })

  it('chon lai cai dang dung thi khong doi gi', () => {
    const before = withCoins(0)
    expect(equip(before, DEFAULT_SAVE.selectedCharacter)).toBe(before)
  })
})

describe('Trang thai the', () => {
  it('bon trang thai duoc phan biet dung', () => {
    expect(cardState(withCoins(0), DEFAULT_SAVE.selectedCharacter)).toBe('equipped')
    expect(cardState(withCoins(0), paid.id)).toBe('tooExpensive')
    expect(cardState(withCoins(paid.price), paid.id)).toBe('buyable')
    const owned = buy(withCoins(paid.price), paid.id)
    expect(cardState(owned, paid.id)).toBe('owned')
  })

  it('so xu con thieu tinh dung — nguoi choi phai biet con bao nhieu', () => {
    expect(shortfall(withCoins(0), paid.id)).toBe(paid.price)
    expect(shortfall(withCoins(paid.price - 10), paid.id)).toBe(10)
    expect(shortfall(withCoins(paid.price), paid.id)).toBe(0)
  })

  it('da so huu thi khong con thieu gi', () => {
    const owned = buy(withCoins(paid.price), paid.id)
    expect(shortfall(owned, paid.id)).toBe(0)
  })
})

describe('Ban luu bi sua tay — NFR-DATA-04', () => {
  it('so huu mot nhan vat khong co trong danh muc thi bi loc bo', () => {
    const dirty = sanitize({ ownedCharacters: ['runner', 'nhan-vat-gia'], selectedCharacter: 'runner' })
    // sanitize giu chuoi, nhung cua hang chi hien nhan vat co trong CHARACTERS
    const shown = CHARACTERS.map((c) => c.id)
    expect(dirty.ownedCharacters.filter((id) => shown.includes(id))).toEqual(['runner'])
  })

  it('dang dung mot nhan vat chua so huu thi ve mac dinh', () => {
    const dirty = sanitize({ ownedCharacters: ['runner'], selectedCharacter: paid.id })
    expect(dirty.selectedCharacter).toBe(DEFAULT_SAVE.selectedCharacter)
  })
})

describe('ADR-0004 — moi nhan vat cung chi phi, cung thoi luong', () => {
  it('gia tang dan va nhan vat dau tien mien phi', () => {
    expect(CHARACTERS[0]!.price).toBe(0)
    for (let i = 1; i < CHARACTERS.length; i++) {
      expect(CHARACTERS[i]!.price).toBeGreaterThan(CHARACTERS[i - 1]!.price)
    }
  })

  it('moi nhan vat co dung mot ky nang, va id la duy nhat', () => {
    const ids = CHARACTERS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const c of CHARACTERS) {
      expect(c.skill.effect).toBeTruthy()
      expect(c.skill.name.length).toBeGreaterThan(0)
      expect(c.skill.blurb.length).toBeGreaterThan(20)
    }
  })

  it('characterById tra ve nhan vat mac dinh khi id la rac', () => {
    expect(characterById('rac').id).toBe(CHARACTERS[0]!.id)
  })
})
