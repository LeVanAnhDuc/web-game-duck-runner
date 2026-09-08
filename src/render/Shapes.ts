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

/** Ti le hinh bong cua mot nhan vat. Nhan vat phan biet nhau BANG HINH BONG. */
export interface Silhouette {
  /** Ti le chieu cao than tren tong chieu cao. */
  torso: number
  shoulder: number
  hip: number
  headR: number
  /** Phu kien tren dau: mu luoi trai, tai, hoac khong. */
  crown: 'none' | 'cap' | 'ears' | 'tuft'
  /** Duoi phia sau — them mot net nhan dang o hinh bong. */
  tail: boolean
}

export const SILHOUETTES: Record<string, Silhouette> = {
  runner: { torso: 0.36, shoulder: 0.42, hip: 0.34, headR: 0.155, crown: 'cap', tail: false },
  bruiser: { torso: 0.38, shoulder: 0.58, hip: 0.44, headR: 0.15, crown: 'none', tail: false },
  drifter: { torso: 0.34, shoulder: 0.34, hip: 0.28, headR: 0.14, crown: 'tuft', tail: true },
  glider: { torso: 0.35, shoulder: 0.46, hip: 0.3, headR: 0.145, crown: 'ears', tail: true },
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
  const HEAD_ZONE = 0.18
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
  } else if (s.crown === 'ears') {
    body.add(part(0.09, 0.24, 0.06, -s.headR * 0.6, headY + s.headR * 1.5))
    body.add(part(0.09, 0.24, 0.06, s.headR * 0.6, headY + s.headR * 1.5))
  } else if (s.crown === 'tuft') {
    body.add(part(0.1, 0.2, 0.1, 0, headY + s.headR * 1.4, -0.05))
  }
  if (s.tail) {
    body.add(part(0.12, 0.12, 0.5, 0, torsoY - torsoH * 0.2, -0.34))
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
