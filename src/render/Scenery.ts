import * as THREE from 'three'
import { CANOPY } from './palette'
import { ROAD_HALF_M } from './layout'

/**
 * Rung hai ben: than cay cuon qua, ben kia vuc.
 *
 * Day la thu duy nhat noi cho nguoi choi biet ho dang di NHANH bao nhieu. Mat
 * duong co vach cuon, nhung vach cuon phang; than cay di qua o hai ben cho ra
 * thi sai chuyen dong that.
 *
 * Khong cap phat gi trong vong lap (bat bien #9): so instance la hang so, va vi
 * tri suy ra tu chi so cong khoang cach — mot phep modulo, khong mot pool nao
 * phai quan ly.
 */

/** So than cay MOI BEN. Tong instance = gap doi. */
const PER_SIDE = 22
/** Khoang cach trung binh giua hai than theo chieu sau, met. */
const SPACING_M = 9.5
/** Vong lap khep kin: cay di qua camera thi quay ve dau. */
const LOOP_M = PER_SIDE * SPACING_M
/** Than cay bat dau ben kia vuc. */
const INNER_M = ROAD_HALF_M + 2.6
const OUTER_M = ROAD_HALF_M + 13

/** Hat co dinh: rung giong nhau moi lan tai trang, nen anh chup so sanh duoc. */
function jitter(i: number, salt: number): number {
  const s = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return s - Math.floor(s)
}

export class Scenery {
  readonly mesh: THREE.InstancedMesh
  private readonly dummy = new THREE.Object3D()

  constructor() {
    /**
     * Than cay la khoi tru sau canh — du de doc ra la than cay o hinh bong, va
     * re hon `CylinderGeometry` mac dinh 32 canh dung mot bac.
     */
    const geo = new THREE.CylinderGeometry(0.36, 0.52, 1, 6, 1)
    geo.translate(0, 0.5, 0)
    this.mesh = new THREE.InstancedMesh(
      geo,
      new THREE.MeshBasicMaterial({ color: CANOPY, fog: true }),
      PER_SIDE * 2,
    )
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.mesh.frustumCulled = false
    this.update(0)
  }

  /**
   * Dat lai vi tri moi frame theo khoang cach da chay.
   *
   * `distanceM` la khoang cach cua MO PHONG, khong phai thoi gian thuc: rung
   * dung lai khi tam dung, va khong troi khi hieu ung Slow dang lam cham the
   * gioi. Rung troi trong luc mo phong dung la thu pha vo cam giac dieu khien.
   */
  update(distanceM: number): void {
    let n = 0
    for (let side = 0; side < 2; side++) {
      const sx = side === 0 ? -1 : 1
      for (let i = 0; i < PER_SIDE; i++) {
        const z = (i * SPACING_M - (distanceM % LOOP_M) + LOOP_M * 2) % LOOP_M
        const x = sx * (INNER_M + jitter(i, side) * (OUTER_M - INNER_M))
        const h = 7 + jitter(i, side + 7) * 9
        const lean = (jitter(i, side + 13) - 0.5) * 0.16
        this.dummy.position.set(x, 0, z + 2)
        this.dummy.rotation.set(0, jitter(i, side + 21) * Math.PI, lean)
        this.dummy.scale.set(1 + jitter(i, side + 31) * 0.5, h, 1 + jitter(i, side + 31) * 0.5)
        this.dummy.updateMatrix()
        this.mesh.setMatrixAt(n++, this.dummy.matrix)
      }
    }
    this.mesh.count = n
    this.mesh.instanceMatrix.needsUpdate = true
  }

  dispose(): void {
    this.mesh.geometry.dispose()
    ;(this.mesh.material as THREE.Material).dispose()
  }
}
