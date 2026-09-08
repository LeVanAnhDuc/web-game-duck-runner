import { CHARACTERS, characterById } from './catalog'
import type { SaveData } from './save'

/**
 * Luật cửa hàng, thuần dữ liệu.
 *
 * Hai hàm dưới nhận trạng thái và trả về trạng thái mới. Không cờ `isBuying`, không
 * biến cục bộ nào phải nhớ dọn: **mua một nhân vật đã sở hữu trả về chính trạng thái
 * cũ**, nên bấm hai lần thật nhanh không thể trừ tiền hai lần.
 */

export type CardState = 'buyable' | 'tooExpensive' | 'owned' | 'equipped'

export function cardState(save: SaveData, characterId: string): CardState {
  if (save.selectedCharacter === characterId) return 'equipped'
  if (save.ownedCharacters.includes(characterId)) return 'owned'
  const price = characterById(characterId).price
  return save.coins >= price ? 'buyable' : 'tooExpensive'
}

/** Số xu còn thiếu để mua được. 0 nếu đã đủ hoặc đã sở hữu. */
export function shortfall(save: SaveData, characterId: string): number {
  if (save.ownedCharacters.includes(characterId)) return 0
  return Math.max(0, characterById(characterId).price - save.coins)
}

/** Idempotent theo `id`: gọi lại lần thứ hai không trừ tiền thêm. */
export function buy(save: SaveData, characterId: string): SaveData {
  if (save.ownedCharacters.includes(characterId)) return save
  const character = CHARACTERS.find((c) => c.id === characterId)
  if (!character) return save
  if (save.coins < character.price) return save
  return {
    ...save,
    coins: save.coins - character.price,
    ownedCharacters: [...save.ownedCharacters, characterId],
  }
}

/** Chọn nhân vật đang dùng. Chưa sở hữu thì không đổi gì. */
export function equip(save: SaveData, characterId: string): SaveData {
  if (!save.ownedCharacters.includes(characterId)) return save
  if (save.selectedCharacter === characterId) return save
  return { ...save, selectedCharacter: characterId }
}
