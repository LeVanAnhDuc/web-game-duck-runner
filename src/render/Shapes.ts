import * as THREE from 'three'
import {
  LANE_WIDTH_M, OBSTACLE_BLOCK_H_M, OBSTACLE_HIGH_CLEAR_M, OBSTACLE_HIGH_H_M,
  OBSTACLE_LOW_H_M, PLAYER_STAND_H_M,
} from '../game/constants'
import { INK, RIM } from './palette'

/**
 * Moi vat the dung tu hinh khoi co ban — ADR-0007.
 *
 * Khong tai model ngoai, vi huong nghe thuat o ADR-0006 to moi thu bang mot mau
 * phang: texture khong dung, bang mau khong dung, chi tiet be mat khong nhin
 * thay. Con lai dung mot hinh bong, ma hinh bong thi BoxGeometry dung duoc.
 */

export const inkMaterial = (): THREE.Material =>
  new THREE.MeshBasicMaterial({ color: INK })

const OBSTACLE_W = LANE_WIDTH_M * 0.84

export function obstacleGeometry(kind: 'low' | 'high' | 'block'): THREE.BufferGeometry {
  switch (kind) {
    case 'low': {
      const g = new THREE.BoxGeometry(OBSTACLE_W, OBSTACLE_LOW_H_M, 0.9)
      g.translate(0, OBSTACLE_LOW_H_M / 2, 0)
      return g
    }
    case 'high': {
      const g = new THREE.BoxGeometry(OBSTACLE_W, OBSTACLE_HIGH_H_M, 0.7)
      g.translate(0, OBSTACLE_HIGH_CLEAR_M + OBSTACLE_HIGH_H_M / 2, 0)
      return g
    }
    case 'block': {
      const g = new THREE.BoxGeometry(OBSTACLE_W, OBSTACLE_BLOCK_H_M, 1.0)
      g.translate(0, OBSTACLE_BLOCK_H_M / 2, 0)
      return g
    }
  }
}

export function coinGeometry(): THREE.BufferGeometry {
  // Bat dien: it dinh, bat sang manh khi quay — du de doc o xa.
  return new THREE.OctahedronGeometry(0.34, 0)
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
  /** Nhom nghieng khi truot va nghieng khi doi lan. */
  body: THREE.Group
  legL: THREE.Mesh
  legR: THREE.Mesh
  armL: THREE.Mesh
  armR: THREE.Mesh
}

/**
 * Dung nhan vat, kem VIEN SANG — MASTER §1.
 *
 * Nhan vat cung la bong den nhu chuong ngai, nen trong mot khung hinh tinh hai
 * thu de lan. Vien sang giai dieu do, va no dung vat ly: mat troi o phia truoc
 * thi vat the nguoc sang co vien. Khong vat the nao khac duoc co vien.
 */
export function buildPlayer(silhouette: Silhouette): PlayerRig {
  const H = PLAYER_STAND_H_M
  const s = silhouette
  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)

  const part = (w: number, h: number, d: number, x: number, y: number, z = 0): THREE.Mesh => {
    const geo = new THREE.BoxGeometry(w, h, d)
    const mesh = new THREE.Mesh(geo, inkMaterial())
    mesh.position.set(x, y, z)
    mesh.add(outlineOf(geo))
    return mesh
  }

  /**
   * Ti le nguoi: chan ~46%, than ~36%, dau va co ~18% chieu cao.
   * Cong thuc cu (1 - torso - headR*2) cho ra chan dai 36cm tren nguoi cao
   * 1.7m — hinh bong trong nhu mot cai tu, khong nhu mot nguoi dang chay.
   */
  // Vit: dau va co chiem nhieu hon, chan ngan hon nguoi
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
  const mat = new THREE.MeshBasicMaterial({ color: RIM, side: THREE.BackSide })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.scale.setScalar(1.055)
  return mesh
}
