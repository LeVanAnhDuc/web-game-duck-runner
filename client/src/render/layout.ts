import { LANE_COUNT, LANE_WIDTH_M } from '../game/constants'

/**
 * Kich thuoc HINH HOC cua canh — cai gi nam o dau, rong bao nhieu, suong bat dau
 * tu dau.
 *
 * File rieng chu khong nam trong `Scene.ts` vi ca `Scene` va `Scenery` deu can:
 * dat o mot trong hai thi cai con lai phai import vong tron, va mot hang so tinh
 * o dau module se thanh `undefined` truoc khi vong tron duoc giai.
 */

/** Nua chieu rong cua con duong, met. Ba lan cong mot chut le da hai ben. */
export const ROAD_HALF_M = (LANE_COUNT * LANE_WIDTH_M) / 2 + 0.7

/** Do rong cua go sang o mep duong, met. */
export const LIP_M = 0.12

/**
 * Bien do cua texture mat duong, nhan vao mau `--road-near`.
 *
 * KHONG duoc tang so nay. Cac cap tuong phan o `design.md` §4 do tren gia tri
 * token phang; modulation ±8% giu cap yeu nhat (ky nang 3.32:1) o **3.15:1** va
 * cap chuong ngai o **3.06:1** — van tren 3. ±12% la tut duoi nguong.
 * `tests/render/contrast.test.ts` kiem dung con so nay.
 */
export const ROAD_TEXTURE_AMPLITUDE = 0.08

/**
 * Suong bat dau o 60m.
 *
 * Con so nay khong tuy y: chuong ngai sinh ra o 95m (`SPAWN_AHEAD_M`) va nguoi
 * choi doc no trong khoang 20-50m truoc mat. Neu suong bat dau gan hon thi
 * chuong ngai bi lam nhat DUNG trong cua so phai doc no — tuc suong se tai tao
 * lai chinh cai loi tuong phan 1.16:1 ma no dang duoc dung de sua.
 */
export const FOG_NEAR_M = 60
export const FOG_FAR_M = 200
