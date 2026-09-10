import * as THREE from 'three'
import {
  LANE_WIDTH_M, OBSTACLE_BLOCK_H_M, OBSTACLE_HIGH_CLEAR_M, OBSTACLE_HIGH_H_M,
  OBSTACLE_LOW_H_M, PLAYER_STAND_H_M,
} from '../game/constants'
import { CANOPY, COIN, COIN_RING, HAZARD, HAZARD_EDGE, PLAYER_RIM } from './palette'

/**
 * Moi vat the dung tu hinh khoi co ban — ADR-0007, van con hieu luc cho vat the
 * trong luot choi.
 *
 * LUAT HAI LOP (ADR-0009): than toi + canh sang, va hai lop do **nuong thang vao
 * hinh hoc** bang vertex color chu khong phai hai mesh. Doi lai la khong mot draw
 * call nao them cho canh sang, va hai lop khong bao gio lech nhau mot frame.
 */

/**
 * Ghep nhieu hinh khoi thanh mot, moi khoi mot mau, ra mot geometry co thuoc tinh
 * `color`. Viet tay thay vi keo `BufferGeometryUtils` tu `examples/jsm` — o day
 * chi can position + normal + color cho hinh khoi khong index.
 */
function mergeColored(parts: readonly { geo: THREE.BufferGeometry; color: number }[]): THREE.BufferGeometry {
  const flat = parts.map((p) => ({
    geo: p.geo.index ? p.geo.toNonIndexed() : p.geo,
    color: new THREE.Color(p.color),
  }))
  const total = flat.reduce((n, p) => n + p.geo.attributes.position!.count, 0)
  const position = new Float32Array(total * 3)
  const normal = new Float32Array(total * 3)
  const color = new Float32Array(total * 3)
  let at = 0
  for (const p of flat) {
    const pos = p.geo.attributes.position!
    const nor = p.geo.attributes.normal!
    position.set(pos.array as Float32Array, at * 3)
    normal.set(nor.array as Float32Array, at * 3)
    for (let i = 0; i < pos.count; i++) {
      color[(at + i) * 3] = p.color.r
      color[(at + i) * 3 + 1] = p.color.g
      color[(at + i) * 3 + 2] = p.color.b
    }
    at += pos.count
    p.geo.dispose()
  }
  const out = new THREE.BufferGeometry()
  out.setAttribute('position', new THREE.BufferAttribute(position, 3))
  out.setAttribute('normal', new THREE.BufferAttribute(normal, 3))
  out.setAttribute('color', new THREE.BufferAttribute(color, 3))
  return out
}

/** Vat lieu cho moi vat the co hai lop mau nuong san. */
export const layeredMaterial = (): THREE.Material =>
  new THREE.MeshBasicMaterial({ vertexColors: true, fog: true })

/** Vat lieu mot mau, cho vat the khong can hai lop. */
export const flatMaterial = (color: number): THREE.Material =>
  new THREE.MeshBasicMaterial({ color, fog: true })

const OBSTACLE_W = LANE_WIDTH_M * 0.84
/** Do day cua canh sang, met. Du day de thay o 50m, du mong de khong doc thanh mot khoi rieng. */
const EDGE_M = 0.075

/**
 * Ba loai chuong ngai, ba hinh khac nhau ro rang — va cung mot HOP BAO nhu truoc.
 *
 * Hop bao khong doi mot mili-met nao: `OBSTACLE_LOW_H_M`, `OBSTACLE_HIGH_CLEAR_M`,
 * `OBSTACLE_BLOCK_H_M` giu nguyen, nen do kho khong doi va moi pattern da duoc
 * solver chung minh van dung. Day chi la doi hinh hien thi.
 *
 * Canh sang dat dung o **duong bien nguoi choi phai vuot**: dinh khuc go la thu
 * phai nhay qua, day chum day leo la thu phai truot duoi. Vach sang khong chi de
 * nhin thay — no chi ra chinh xac cho phai vuot.
 */
export function obstacleGeometry(kind: 'low' | 'high' | 'block'): THREE.BufferGeometry {
  switch (kind) {
    case 'low': {
      // Khuc go muc nam ngang, hai mau go do o hai dau
      const r = OBSTACLE_LOW_H_M / 2
      const log = new THREE.CylinderGeometry(r, r, OBSTACLE_W, 10, 1)
      log.rotateZ(Math.PI / 2)
      log.translate(0, r, 0)
      const edge = new THREE.BoxGeometry(OBSTACLE_W * 1.01, EDGE_M, r * 1.1)
      edge.translate(0, OBSTACLE_LOW_H_M - EDGE_M * 0.3, 0)
      // Mau go: hai dia o hai dau, sang hon than mot bac de doc ra la KHUC GO
      const capL = new THREE.CylinderGeometry(r * 0.99, r * 0.99, EDGE_M, 10, 1)
      capL.rotateZ(Math.PI / 2)
      capL.translate(-OBSTACLE_W / 2, r, 0)
      const capR = capL.clone()
      capR.translate(OBSTACLE_W, 0, 0)
      return mergeColored([
        { geo: log, color: HAZARD },
        { geo: capL, color: HAZARD_EDGE },
        { geo: capR, color: HAZARD_EDGE },
        { geo: edge, color: HAZARD_EDGE },
      ])
    }
    case 'high': {
      // Chum day leo ru tu tren. Moi khoi nam TRONG hop bao — mot soi day thong
      // xuong duoi hop la mot loi hua va cham khong co that.
      const h = OBSTACLE_HIGH_H_M
      const y0 = OBSTACLE_HIGH_CLEAR_M
      const parts: { geo: THREE.BufferGeometry; color: number }[] = []
      const bar = new THREE.BoxGeometry(OBSTACLE_W, h * 0.42, 0.62)
      bar.translate(0, y0 + h - (h * 0.42) / 2, 0)
      parts.push({ geo: bar, color: HAZARD })
      for (let i = 0; i < 5; i++) {
        const x = (i / 4 - 0.5) * OBSTACLE_W * 0.82
        const len = h * (0.42 + (i % 2 === 0 ? 0.34 : 0.18))
        const vine = new THREE.CylinderGeometry(0.055, 0.04, len, 5, 1)
        vine.translate(x, y0 + h - h * 0.42 - len / 2, 0)
        parts.push({ geo: vine, color: HAZARD })
      }
      // Canh sang o DAY chum: no la duong bien phai truot duoi
      const edge = new THREE.BoxGeometry(OBSTACLE_W * 1.01, EDGE_M, 0.64)
      edge.translate(0, y0 + EDGE_M * 0.3, 0)
      parts.push({ geo: edge, color: HAZARD_EDGE })
      return mergeColored(parts)
    }
    case 'block': {
      // Cot da dung, thuon nhe len dinh — canh thang, doi xung, chan ngang:
      // ngon ngu hinh khoi cua NGUY HIEM, doi lap voi canh mem cua cay coi.
      const h = OBSTACLE_BLOCK_H_M
      const pillar = new THREE.CylinderGeometry(OBSTACLE_W * 0.42, OBSTACLE_W * 0.5, h, 5, 1)
      pillar.translate(0, h / 2, 0)
      const cap = new THREE.CylinderGeometry(OBSTACLE_W * 0.44, OBSTACLE_W * 0.44, EDGE_M, 5, 1)
      cap.translate(0, h - EDGE_M / 2, 0)
      // Hai vach doc: bit kin ca lan — doc ra ngay la khong the nhay hay truot
      const parts: { geo: THREE.BufferGeometry; color: number }[] = [
        { geo: pillar, color: HAZARD },
        { geo: cap, color: HAZARD_EDGE },
      ]
      for (const side of [-1, 1]) {
        const stripe = new THREE.BoxGeometry(EDGE_M, h * 0.94, EDGE_M)
        stripe.translate(side * OBSTACLE_W * 0.4, h * 0.47, -OBSTACLE_W * 0.28)
        parts.push({ geo: stripe, color: HAZARD_EDGE })
      }
      return mergeColored(parts)
    }
  }
}

/**
 * Xu: than sang, vong TOI — luat hai lop dao nguoc, vi than xu von da sang.
 *
 * Khong co vong toi thi xu bien mat khi bay ngang dai suong sang o chan troi.
 */
export function coinGeometry(): THREE.BufferGeometry {
  const core = new THREE.OctahedronGeometry(0.3, 0)
  const ring = new THREE.TorusGeometry(0.32, 0.055, 4, 10)
  return mergeColored([
    { geo: core, color: COIN },
    { geo: ring, color: COIN_RING },
  ])
}

/**
 * Power-up: mau aqua (MASTER §2.1 cho phep aqua cho "power-up dang chay"), va moi
 * loai mot HINH KHAC — nguoi choi phai doc duoc no trong mot phan giay, ma mau thi
 * chung nhau.
 */
export function powerUpGeometry(kind: 'magnet' | 'shield' | 'rush'): THREE.BufferGeometry {
  switch (kind) {
    case 'magnet':
      return new THREE.TorusGeometry(0.34, 0.12, 8, 14)
    case 'shield':
      return new THREE.IcosahedronGeometry(0.42, 0)
    case 'rush':
      return new THREE.ConeGeometry(0.34, 0.8, 6)
  }
}

/** Ti le hinh bong cua mot nhan vat. Nhan vat phan biet nhau BANG HINH BONG. */
export interface Silhouette {
  /** Ti le chieu cao than tren tong chieu cao. */
  torso: number
  shoulder: number
  hip: number
  headR: number
  /** Phu kien tren dau: mu luoi trai, mao, chom long, hoac khong. */
  crown: 'none' | 'cap' | 'crest' | 'tuft'
  /** Duoi phia sau — them mot net nhan dang o hinh bong. */
  tail: boolean
  /**
   * Do dai mo, tinh theo ban kinh dau. 0 la khong co mo.
   *
   * Camera dung sau lung nen mo gan nhu khong thay khi chay thang — no doc duoc
   * khi nhan vat nghieng luc doi lan, va doc rat ro o the trong cua hang. Do la
   * ly do no la mot THAM SO chu khong phai mot co bat/tat.
   */
  beak: number
}

/**
 * Bon con vit, phan biet nhau BANG HINH BONG.
 *
 * Than day hon va chan ngan hon so voi ti le nguoi o ban truoc: mot con vit doc
 * ra o dang thap-tron, khong o dang cao-gay. Tat ca deu co mo va co duoi — do la
 * hai net khien hinh bong doc ra la vit chu khong la nguoi.
 */
export const SILHOUETTES: Record<string, Silhouette> = {
  runner: { torso: 0.44, shoulder: 0.5, hip: 0.42, headR: 0.16, crown: 'cap', tail: true, beak: 1.5 },
  bruiser: { torso: 0.46, shoulder: 0.66, hip: 0.54, headR: 0.155, crown: 'none', tail: true, beak: 1.8 },
  drifter: { torso: 0.42, shoulder: 0.42, hip: 0.34, headR: 0.15, crown: 'tuft', tail: true, beak: 1.3 },
  glider: { torso: 0.43, shoulder: 0.56, hip: 0.38, headR: 0.155, crown: 'crest', tail: true, beak: 1.6 },
}

export interface PlayerRig {
  root: THREE.Group
  body: THREE.Group
  legL: THREE.Mesh
  legR: THREE.Mesh
  armL: THREE.Mesh
  armR: THREE.Mesh
}

/**
 * Dung nhan vat, kem VIEN SANG — MASTER §1.
 *
 * Nhan vat cung la hinh bong toi nhu chuong ngai, nen trong mot khung hinh tinh
 * hai thu de lan. Vien sang giai dieu do, va no la mau AM duy nhat trong ca
 * canh: khong vat the nao khac duoc dung `--player-rim`.
 */
export function buildPlayer(silhouette: Silhouette): PlayerRig {
  const H = PLAYER_STAND_H_M
  const s = silhouette
  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)

  const part = (w: number, h: number, d: number, x: number, y: number, z = 0): THREE.Mesh => {
    const geo = new THREE.BoxGeometry(w, h, d)
    const mesh = new THREE.Mesh(geo, flatMaterial(CANOPY))
    mesh.position.set(x, y, z)
    mesh.add(outlineOf(geo))
    return mesh
  }

  /**
   * Ti le vit: dau va co chiem nhieu hon, chan ngan hon nguoi. Cong thuc cu
   * `(1 - torso - headR*2)` cho ra chan dai 36cm tren nguoi cao 1.7m — hinh bong
   * trong nhu mot cai tu, khong nhu mot con vat dang chay.
   */
  const HEAD_ZONE = 0.24
  const torsoH = H * s.torso
  const legH = H * (1 - HEAD_ZONE) - torsoH
  const torsoY = legH + torsoH / 2

  const torso = part(s.shoulder, torsoH, 0.3, 0, torsoY)
  body.add(torso)

  // Khe co: khong co no thi dau dinh thang vao vai va trong nhu mot khoi lien
  const headY = legH + torsoH + H * s.headR * 1.15
  const head = part(s.headR * 1.7, s.headR * 1.8, s.headR * 1.7, 0, headY)
  body.add(head)

  if (s.crown === 'cap') {
    body.add(part(s.headR * 2.4, 0.07, s.headR * 2.6, 0, headY + s.headR, -s.headR * 0.5))
  } else if (s.crown === 'crest') {
    body.add(part(0.09, 0.24, 0.06, -s.headR * 0.6, headY + s.headR * 1.5))
    body.add(part(0.09, 0.24, 0.06, s.headR * 0.6, headY + s.headR * 1.5))
  } else if (s.crown === 'tuft') {
    body.add(part(0.1, 0.2, 0.1, 0, headY + s.headR * 1.4, -0.05))
  }
  if (s.beak > 0) {
    // Mo huong ve phia truoc (+z): thay duoc khi nhan vat nghieng luc doi lan
    const len = s.headR * s.beak * 0.42
    body.add(part(s.headR * 0.72, s.headR * 0.46, len, 0, headY - s.headR * 0.18, len / 2 + s.headR * 0.6))
  }
  if (s.tail) {
    // Duoi vit: ngan, chech len — khac han cai duoi dai o ban truoc
    const tail = part(s.hip * 0.5, s.hip * 0.36, 0.34, 0, torsoY - torsoH * 0.28, -0.3)
    tail.rotation.x = -0.5
    body.add(tail)
  }

  const legW = s.hip * 0.38
  const legL = part(legW, legH, 0.22, -s.hip * 0.34, legH / 2)
  const legR = part(legW, legH, 0.22, s.hip * 0.34, legH / 2)
  body.add(legL, legR)

  const armH = torsoH * 0.82
  const armL = part(0.11, armH, 0.13, -s.shoulder * 0.68, torsoY + torsoH * 0.08, 0.06)
  const armR = part(0.11, armH, 0.13, s.shoulder * 0.68, torsoY + torsoH * 0.08, 0.06)
  body.add(armL, armR)

  return { root, body, legL, legR, armL, armR }
}

/**
 * Vien sang bang ky thuat outline co dien: mot ban mesh phong to, ve mat trong.
 * Re hon post-processing rat nhieu, va khong can them mot render pass nao.
 */
function outlineOf(geo: THREE.BufferGeometry): THREE.Mesh {
  const mat = new THREE.MeshBasicMaterial({ color: PLAYER_RIM, side: THREE.BackSide, fog: false })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.scale.setScalar(1.055)
  return mesh
}
