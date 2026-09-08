import type { EffectKind } from '../game/ActiveEffects'

/**
 * Nhân vật và kỹ năng — DỮ LIỆU, không phải code.
 *
 * `ADR-0004`: nhân vật khác nhau ở **kỹ năng chủ động**, giống nhau ở chỉ số cơ bản
 * (tốc độ, lực nhảy, kích thước hitbox). Nếu chỉ số khác nhau thì phải cân bằng độ
 * khó cho từng nhân vật, và kỷ lục mất ý nghĩa so sánh với chính mình.
 *
 * Thêm một nhân vật là thêm một dòng ở đây — không sửa một dòng code nào. Đó là
 * ranh giới đáng giữ: nó buộc kỹ năng phải là tổ hợp tham số, không phải một nhánh
 * `if` mới trong `Game`.
 */
export interface SkillDef {
  /** Hiệu ứng nào được bật. Cùng bảng với power-up — xem ActiveEffects. */
  effect: Extract<EffectKind, 'ram' | 'slow' | 'fly'>
  name: string
  /** Một câu: kỹ năng này cứu tình huống nào. */
  blurb: string
}

export interface CharacterDef {
  id: string
  name: string
  price: number
  skill: SkillDef
}

/**
 * `ADR-0004`: chi phí nạp và thời lượng BẰNG NHAU giữa mọi kỹ năng. Đó là điều duy
 * nhất phải giữ, và là lý do dự án này không biến thành một cuộc cân bằng số liệu.
 */
export const SKILL_DURATION_MS = 5200
export const CHARGE_COINS = 18

/**
 * Giá được ĐẶT TỪ SỐ ĐO, không từ cảm giác.
 *
 * `npx vite-node scripts/measure-economy.ts` (2026-09-08, 120 lượt, autopilot tham
 * lam) cho **29.8 xu/phút** và 5.9 xu/lượt. Quy ra:
 *
 *   Thợ ủi   80 xu → ~2.7 phút  ~14 lượt
 *   Kẻ lượn 200 xu → ~6.7 phút  ~34 lượt
 *   Kẻ trôi 360 xu → ~12.1 phút ~61 lượt
 *
 * Bộ giá đầu tiên (320 / 640 / 980) khiến nhân vật thứ hai mất 10.7 phút. Người xem
 * portfolio chơi 1–3 phút, nên với bộ giá đó cửa hàng sẽ không bao giờ được thấy
 * hoạt động. Chạy lại script sau khi đổi bất cứ thứ gì ảnh hưởng nhịp rơi xu.
 */
export const CHARACTERS: readonly CharacterDef[] = [
  {
    id: 'runner',
    name: 'Lữ khách',
    price: 0,
    skill: {
      effect: 'slow',
      name: 'Chậm',
      blurb: 'Thế giới chạy chậm lại. Dùng khi tốc độ đã vượt phản xạ.',
    },
  },
  {
    id: 'bruiser',
    name: 'Thợ ủi',
    price: 80,
    skill: {
      effect: 'ram',
      name: 'Ủi',
      blurb: 'Húc vỡ mọi thứ chắn đường. Dùng khi bị dồn vào thế không còn làn trống.',
    },
  },
  {
    id: 'glider',
    name: 'Kẻ lượn',
    price: 200,
    skill: {
      effect: 'fly',
      name: 'Bay',
      blurb: 'Bay qua đầu mọi thứ và tự hút xu. Đổi quãng đường lấy xu.',
    },
  },
  {
    id: 'drifter',
    name: 'Kẻ trôi',
    price: 360,
    skill: {
      effect: 'slow',
      name: 'Chậm',
      blurb: 'Cùng kỹ năng với Lữ khách. Khác ở hình bóng, không khác ở sức mạnh.',
    },
  },
]

export const characterById = (id: string): CharacterDef =>
  CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0]!

/** Thời lượng power-up. Khác kỹ năng: đây là phần thưởng, không phải công cụ. */
export const POWERUP_DURATION_MS: Record<'magnet' | 'rush', number> = {
  magnet: 7000,
  rush: 4500,
}

/** Bất tử ngắn sau khi khiên vỡ — design.md §5. */
export const SHIELD_GRACE_MS = 900

/** Hệ số tốc độ của hiệu ứng. */
export const SLOW_FACTOR = 0.55
export const RUSH_FACTOR = 1.45

/** Bán kính hút xu: bình thường · khi có nam châm hoặc đang Bay. */
export const COIN_REACH_M = 1.0
export const COIN_MAGNET_REACH_M = 4.6
