// @vitest-environment jsdom
import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import { LANE_CENTER, LANE_COUNT, LANE_WIDTH_M } from '../../src/game/constants'
import { SceneRig } from '../../src/render/Scene'

/**
 * BAT BIEN #13: lan 0 phai hien ra o NUA TRAI cua man hinh.
 *
 * `constants.ts` khai bao "0 trai, 1 giua, 2 phai" va ban phim gui `lane: -1`
 * cho mui ten trai. Neu tang render dat lan 0 ra nua phai thi bam trai lai nhay
 * sang phai — game van chay dung luat, test luat van xanh, chi nguoi choi la
 * sai. Cho nay do bang phep chieu qua camera THAT, khong doan theo toa do.
 */

/** Toa do X trong mo phong cua mot lan — dung cong thuc cua chinh Player.x. */
const laneX = (lane: number): number => (lane - LANE_CENTER) * LANE_WIDTH_M

/** Chieu mot diem trong `world` ra toa do man hinh [-1,1]; -1 la ria trai. */
function screenX(rig: SceneRig, x: number): number {
  const probe = new THREE.Object3D()
  rig.world.add(probe)
  probe.position.set(x, 1, 0)
  rig.scene.updateMatrixWorld(true)
  const v = probe.getWorldPosition(new THREE.Vector3()).project(rig.camera)
  rig.world.remove(probe)
  return v.x
}

describe('Truc ngang cua man hinh khop voi chi so lan', () => {
  it('lan 0 o nua trai, lan 2 o nua phai, lan giua o giua', () => {
    const rig = new SceneRig(true)
    rig.resize(405, 720)

    expect(screenX(rig, laneX(0))).toBeLessThan(0)
    expect(screenX(rig, laneX(LANE_CENTER))).toBeCloseTo(0, 5)
    expect(screenX(rig, laneX(LANE_COUNT - 1))).toBeGreaterThan(0)

    rig.dispose()
  })

  it('thu tu tren man hinh tang dan theo chi so lan', () => {
    const rig = new SceneRig(true)
    rig.resize(405, 720)

    const xs = [0, 1, 2].map((lane) => screenX(rig, laneX(lane)))
    expect(xs[0]!).toBeLessThan(xs[1]!)
    expect(xs[1]!).toBeLessThan(xs[2]!)

    rig.dispose()
  })
})
