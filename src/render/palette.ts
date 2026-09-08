/**
 * Token mau, chep tu docs/design-system/endless-runner/MASTER.md.
 *
 * Day la ban sao DUY NHAT trong code. Moi cho khac import tu day, khong viet
 * hex truc tiep — neu khong thi doi bang mau se thanh mot cuoc san lung.
 */
export const INK = 0x120e1f
export const COIN = 0xffc94a
export const SKILL = 0x5be0c8
export const SKY_HIGH = 0x2b1b4d
export const SKY_MID = 0x8e3b6b
export const SKY_LOW = 0xf5a15c
export const SURFACE = 0x151221

/** Vien sang cua nhan vat — MASTER §1. Khong vat the nao khac duoc dung mau nay. */
export const RIM = SKY_LOW

export const hex = (n: number): string => `#${n.toString(16).padStart(6, '0')}`
