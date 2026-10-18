/**
 * Token mau, chep tu docs/design-system/endless-runner/MASTER.md.
 *
 * Day la ban sao DUY NHAT trong code. Moi cho khac import tu day, khong viet
 * hex truc tiep — neu khong thi doi bang mau se thanh mot cuoc san lung.
 *
 * LUAT HAI LOP (ADR-0009, bat bien #14): moi vat the nguoi choi phai doc trong
 * mot phan giay deu co THAN TOI va CANH SANG. Nen toi thi canh doc duoc, nen
 * sang thi than doc duoc, va khong ton tai nen nao lam no bien mat. Xu di theo
 * chieu nguoc lai vi than xu von da sang: than vang + vong toi.
 *
 * `tests/render/contrast.test.ts` do 13 cap tren chinh cac hang nay va lam CI do
 * neu mot cap tut duoi nguong. Doi mot so o day la phai chay lai test do.
 */

// ── Suong va rung ─────────────────────────────────────────────────────────────
/** Diem SANG NHAT cua canh. Fog cung dung mau nay: no la thu bao dam moi vat the xa deu co nen sang. */
export const MIST_FAR = 0xcbd6c6
/** Suong giua cac tang cay. */
export const MIST_NEAR = 0x93a896
/** Tan la va than cay. Toi nhat cua phan rung. */
export const CANOPY = 0x0d1512

// ── Duong chay va vuc ─────────────────────────────────────────────────────────
/**
 * Da uot duoi chan. Token BI RANG BUOC HAI DAU, khong doi tu do duoc:
 * sang hon thi xu va ky nang tut duoi 3:1, toi hon thi chuong ngai tut duoi 3:1.
 * Khoang hop le cua do sang la 13%-16.7%; mau nay nam giua o 14.5%.
 */
export const ROAD_NEAR = 0x6f6a5d
/** Mat duong hoa dan vao suong theo chieu sau. */
export const ROAD_FAR = 0xa8ac9e
/** Vuc hai ben duong. Toi tuyet doi — no la thu khien duong doc ra la mot cay cau. */
export const CHASM = 0x05070a

// ── Vat the ───────────────────────────────────────────────────────────────────
/** Than chuong ngai. */
export const HAZARD = 0x191410
/** Canh chuong ngai — mep uot bat sang. Lop thu hai cua luat hai lop. */
export const HAZARD_EDGE = 0xeaf0e6
export const COIN = 0xffc94a
/** Vong toi quanh xu, de xu doc duoc ca tren suong sang. */
export const COIN_RING = 0x171208
export const SKILL = 0x5be0c8

/**
 * Vien nhan vat. Mau AM duy nhat trong ca canh, va do la toan bo cach nguoi choi
 * tim thay minh: khong vat the nao khac duoc dung mau nay.
 *
 * `#F5A15C` cua ADR-0006 chi dat 2.60:1 tren mat duong moi, nen no phai sang len.
 */
export const PLAYER_RIM = 0xffd9a8

// ── Giao dien ─────────────────────────────────────────────────────────────────
export const TEXT = 0xf5f1ea
export const SURFACE = 0x151221
/** Mau scrim dat duoi chu HUD. */
export const INK_SCRIM = 0x120e1f
/**
 * Alpha toi thieu cua scrim HUD. Do duoc: tren diem sang nhat cua canh, 0.55 cho
 * 4.99:1 va 0.45 chi con 3.75:1 — duoi nguong NFR-A11Y-01. Rang buoc CUNG.
 */
export const SCRIM_ALPHA = 0.55

export const hex = (n: number): string => `#${n.toString(16).padStart(6, '0')}`
