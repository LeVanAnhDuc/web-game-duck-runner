import * as THREE from 'three'
import type { Game } from '../game/Game'
import {
  LANE_CENTER, LANE_WIDTH_M, OBSTACLE_POOL_SIZE, COIN_POOL_SIZE, POWERUP_POOL_SIZE,
} from '../game/constants'
import type { ObstacleKind, PowerUpKind } from '../game/types'
import { SceneRig } from './Scene'
import {
  coinGeometry, buildPlayer, inkMaterial, obstacleGeometry, powerUpGeometry, SILHOUETTES,
  type PlayerRig,
} from './Shapes'
import { COIN, SKILL } from './palette'

const KINDS: readonly ObstacleKind[] = ['low', 'high', 'block']
const POWERUPS: readonly PowerUpKind[] = ['magnet', 'shield', 'rush']
/**
 * Dong bo trang thai mo phong sang canh 3D.
 *
 * Chieu phu thuoc di MOT huong: file nay doc `Game`, `Game` khong biet file nay
 * ton tai (ADR-0002). Moi vat the lap lai dung InstancedMesh — mot draw call
 * cho tat ca chuong ngai cung loai, thay vi mot draw call moi vien gach.
 */
export class GameRenderer {
  readonly rig: SceneRig
  private readonly renderer: THREE.WebGLRenderer
  private readonly obstacleMeshes = new Map<ObstacleKind, THREE.InstancedMesh>()
  private readonly coinMesh: THREE.InstancedMesh
  private readonly powerUpMeshes = new Map<PowerUpKind, THREE.InstancedMesh>()
  private player: PlayerRig
  private readonly dummy = new THREE.Object3D()
  private readonly reducedMotion: boolean
  private runTimeS = 0
  private shakeS = 0

  constructor(canvas: HTMLCanvasElement, characterId: string, reducedMotion: boolean) {
    this.reducedMotion = reducedMotion
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setClearColor(0x151221, 1)
    // Tran devicePixelRatio: man hinh 3x tren dien thoai tam trung se giet fps
    this.renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2))

    this.rig = new SceneRig(reducedMotion)

    for (const kind of KINDS) {
      const mesh = new THREE.InstancedMesh(obstacleGeometry(kind), inkMaterial(), OBSTACLE_POOL_SIZE)
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      mesh.frustumCulled = false
      this.obstacleMeshes.set(kind, mesh)
      this.rig.world.add(mesh)
    }

    this.coinMesh = new THREE.InstancedMesh(
      coinGeometry(),
      new THREE.MeshBasicMaterial({ color: COIN }),
      COIN_POOL_SIZE,
    )
    this.coinMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.coinMesh.frustumCulled = false
    this.rig.world.add(this.coinMesh)

    for (const kind of POWERUPS) {
      const mesh = new THREE.InstancedMesh(
        powerUpGeometry(kind),
        new THREE.MeshBasicMaterial({ color: SKILL }),
        POWERUP_POOL_SIZE,
      )
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      mesh.frustumCulled = false
      this.powerUpMeshes.set(kind, mesh)
      this.rig.world.add(mesh)
    }

    this.player = buildPlayer(SILHOUETTES[characterId] ?? SILHOUETTES.runner!)
    this.rig.world.add(this.player.root)
  }

  setCharacter(characterId: string): void {
    this.rig.world.remove(this.player.root)
    disposeTree(this.player.root)
    for (const kind of POWERUPS) {
      const mesh = new THREE.InstancedMesh(
        powerUpGeometry(kind),
        new THREE.MeshBasicMaterial({ color: SKILL }),
        POWERUP_POOL_SIZE,
      )
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      mesh.frustumCulled = false
      this.powerUpMeshes.set(kind, mesh)
      this.rig.world.add(mesh)
    }

    this.player = buildPlayer(SILHOUETTES[characterId] ?? SILHOUETTES.runner!)
    this.rig.world.add(this.player.root)
  }

  /** Rung camera mot nhip khi va cham. NFR-A11Y-05: bo qua neu giam chuyen dong. */
  shake(): void {
    if (!this.reducedMotion) this.shakeS = 0.35
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height, false)
    this.rig.resize(width, height)
  }

  render(game: Game, dtS: number, live: boolean): void {
    this.runTimeS += dtS
    this.syncPlayer(game)
    this.syncObstacles(game)
    this.syncCoins(game)
    this.syncPowerUps(game)
    if (live) this.rig.setScroll(game.scoring.distanceM)
    this.applyShake(dtS)
    this.renderer.render(this.rig.scene, this.rig.camera)
  }

  private syncPlayer(game: Game): void {
    const p = game.player
    // Bay nang nhan vat len. Day la HIEN THI thuan tuy: `game/` khong doi vi tri,
    // vi bat tu da lo phan luat choi roi.
    const lift = game.effects.has('fly') ? 2.4 : 0
    this.player.root.position.set(p.x, p.y + lift, 0)
    // Nghieng theo huong doi lan — dau hieu thi giac re tien nhat bao "dang re"
    const drift = (p.laneTo - p.laneFrom) * (1 - easeOut(p.laneT))
    this.player.body.rotation.z = -drift * 0.32
    // Nghieng ve truoc: hinh bong dung yen trong nhu dang dung, khong dang chay
    this.player.body.rotation.x = p.state === 'sliding' ? 1.15 : 0.15
    this.player.body.position.y = p.state === 'sliding' ? 0.28 : 0

    // Nhip chan tay. Dung dong ho MO PHONG khong can thiet o day: day la trang
    // tri thuan tuy, khong anh huong ket qua luot choi.
    const airborne = p.state === 'jumping'
    const cycle = airborne ? 0 : Math.sin(this.runTimeS * 13)
    const swing = airborne ? 0.9 : cycle * 0.85
    this.player.legL.rotation.x = swing
    this.player.legR.rotation.x = -swing
    this.player.armL.rotation.x = -swing * 0.7
    this.player.armR.rotation.x = swing * 0.7
  }

  private syncObstacles(game: Game): void {
    const counts = new Map<ObstacleKind, number>(KINDS.map((k) => [k, 0]))
    for (const o of game.track.obstacles) {
      if (!o.active) continue
      const mesh = this.obstacleMeshes.get(o.kind)
      if (!mesh) continue
      const i = counts.get(o.kind)!
      if (i >= OBSTACLE_POOL_SIZE) continue
      counts.set(o.kind, i + 1)
      this.dummy.position.set((o.lane - LANE_CENTER) * LANE_WIDTH_M, 0, o.z)
      this.dummy.rotation.set(0, 0, 0)
      this.dummy.scale.setScalar(1)
      this.dummy.updateMatrix()
      mesh.setMatrixAt(i, this.dummy.matrix)
    }
    /**
     * `count` la thu giu cho khong con "bong ma": instance ngoai count khong duoc
     * ve, nen ma tran cu cua chung khong con y nghia. Thieu dong nay thi chuong
     * ngai cua frame truoc dung yen giua man hinh cho toi khi bi ghi de.
     */
    for (const [kind, n] of counts) {
      const mesh = this.obstacleMeshes.get(kind)
      if (!mesh) continue
      mesh.count = n
      mesh.instanceMatrix.needsUpdate = true
    }
  }

  private syncCoins(game: Game): void {
    const spin = this.reducedMotion ? 0 : this.runTimeS * 2.4
    let n = 0
    for (const c of game.track.coins) {
      if (!c.active || n >= COIN_POOL_SIZE) continue
      this.dummy.position.set((c.lane - LANE_CENTER) * LANE_WIDTH_M, 1.0, c.z)
      this.dummy.rotation.set(0, spin, 0)
      this.dummy.scale.setScalar(1)
      this.dummy.updateMatrix()
      this.coinMesh.setMatrixAt(n, this.dummy.matrix)
      n++
    }
    this.coinMesh.count = n
    this.coinMesh.instanceMatrix.needsUpdate = true
  }

  private syncPowerUps(game: Game): void {
    const spin = this.reducedMotion ? 0 : this.runTimeS * 1.8
    const counts = new Map<PowerUpKind, number>(POWERUPS.map((k) => [k, 0]))
    for (const p of game.track.powerUps) {
      if (!p.active) continue
      const mesh = this.powerUpMeshes.get(p.kind)
      if (!mesh) continue
      const i = counts.get(p.kind)!
      counts.set(p.kind, i + 1)
      this.dummy.position.set((p.lane - LANE_CENTER) * LANE_WIDTH_M, 1.15, p.z)
      this.dummy.rotation.set(0, spin, 0)
      this.dummy.scale.setScalar(1)
      this.dummy.updateMatrix()
      mesh.setMatrixAt(i, this.dummy.matrix)
    }
    for (const [kind, n] of counts) {
      const mesh = this.powerUpMeshes.get(kind)
      if (!mesh) continue
      mesh.count = n
      mesh.instanceMatrix.needsUpdate = true
    }
  }

  private applyShake(dtS: number): void {
    if (this.shakeS <= 0) {
      this.rig.camera.position.x = 0
      return
    }
    this.shakeS = Math.max(0, this.shakeS - dtS)
    this.rig.camera.position.x = Math.sin(this.shakeS * 90) * this.shakeS * 0.35
  }

  dispose(): void {
    for (const mesh of this.obstacleMeshes.values()) {
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
    }
    this.coinMesh.geometry.dispose()
    ;(this.coinMesh.material as THREE.Material).dispose()
    for (const mesh of this.powerUpMeshes.values()) {
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
    }
    disposeTree(this.player.root)
    this.rig.dispose()
    this.renderer.dispose()
  }

  /** Chi so dung de DO hieu nang. NFR-PERF-08 kiem bang con so nay. */
  get drawCalls(): number {
    return this.renderer.info.render.calls
  }
}

function easeOut(t: number): number {
  const c = 1 - t
  return 1 - c * c * c
}

function disposeTree(root: THREE.Object3D): void {
  root.traverse((o) => {
    const m = o as THREE.Mesh
    if (m.geometry) m.geometry.dispose()
    const mat = m.material
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
    else if (mat) (mat as THREE.Material).dispose()
  })
}
