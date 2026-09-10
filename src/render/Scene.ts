import * as THREE from 'three'
import { LANE_WIDTH_M } from '../game/constants'
import { COIN, SKY_HIGH, SKY_LOW, SKY_MID, hex } from './palette'

/**
 * Canh 3D: bau troi, mat troi, mat duong, camera.
 *
 * Khong den, khong shadow map. Canh la NGUOC SANG (ADR-0006) nen moi vat the la
 * mot bong den phang — them den chi ton fill rate ma khong doi hinh anh. Do cung
 * la cach re nhat de dat NFR-PERF-08.
 */

const GROUND_VERT = `
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

/**
 * Mat duong ve BANG SHADER, khong bang hinh hoc: vach lan va vach ngang cuon
 * deu la ham cua toa do the gioi. Doi lai la hai tam giac thay vi hang tram
 * vach, va khong co gi phai tai su dung hay don dep.
 */
const GROUND_FRAG = `
  varying vec3 vWorld;
  uniform float uScroll;
  uniform float uLaneW;
  uniform vec3 uNear;
  uniform vec3 uFar;
  uniform vec3 uLine;
  uniform float uStripes;

  float band(float v, float w) {
    float f = fwidth(v) * 1.5;
    return 1.0 - smoothstep(w - f, w + f, abs(v));
  }

  void main() {
    float depth = clamp(vWorld.z / 190.0, 0.0, 1.0);
    vec3 c = mix(uNear, uFar, pow(depth, 0.55));

    float lane = 0.0;
    lane += band(vWorld.x - uLaneW * 0.5, 0.05);
    lane += band(vWorld.x + uLaneW * 0.5, 0.05);
    lane += band(vWorld.x - uLaneW * 1.5, 0.06);
    lane += band(vWorld.x + uLaneW * 1.5, 0.06);
    c = mix(c, uLine, clamp(lane, 0.0, 1.0) * 0.42 * (1.0 - depth * 0.5));

    float inRoad = 1.0 - smoothstep(uLaneW * 1.45, uLaneW * 1.6, abs(vWorld.x));
    float s = fract((vWorld.z + uScroll) / 13.0);
    float stripe = 1.0 - smoothstep(0.0, 0.028, s);
    c = mix(c, uLine, stripe * inRoad * 0.22 * (1.0 - depth) * uStripes);

    gl_FragColor = vec4(c, 1.0);
    /**
     * ShaderMaterial KHONG tu chen buoc chuyen khong gian mau — khac voi
     * MeshBasicMaterial. Thieu dong nay thi mau viet ra bi coi la tuyen tinh va
     * hien ra toi hon dung mot bac gamma: mat duong den si, khong ai hieu vi sao.
     */
    #include <colorspace_fragment>
  }
`

/**
 * Bau troi ve mot lan vao texture roi dung lam nen canh.
 *
 * Vi sao khong dung shader: nen la screen-space, va camera khong bao gio doi
 * goc ngang. Mot texture 2x512 lam dung viec do voi chi phi bang khong, va
 * khong them mot draw call nao vao vong lap.
 */
function skyTexture(): THREE.Texture {
  const w = 256
  const h = 512
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()

  /**
   * HORIZON_V la vi tri duong chan troi tren man hinh, tinh ra tu goc camera:
   * camera nhin xuong 7.2 do, fov doc 58 do, nen chan troi nam o
   * 0.5 - 0.5 * tan(7.2) / tan(29) = 0.386 tinh tu dinh.
   * Dat sai con so nay thi dai ho phach roi xuong duoi mat duong va bien mat —
   * dung cai loi da mac o ban dau tien.
   */
  const HORIZON_V = 0.386

  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, hex(SKY_HIGH))
  grad.addColorStop(HORIZON_V * 0.55, hex(SKY_MID))
  grad.addColorStop(HORIZON_V, hex(SKY_LOW))
  grad.addColorStop(1, hex(SKY_LOW))
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Quang mat troi ngay tren duong chan troi, tai diem tu
  const cx = w / 2
  const cy = h * HORIZON_V
  const sun = ctx.createRadialGradient(cx, cy, 0, cx, cy, h * 0.34)
  sun.addColorStop(0, 'rgba(255, 232, 196, 0.95)')
  sun.addColorStop(0.18, 'rgba(255, 205, 150, 0.62)')
  sun.addColorStop(0.55, 'rgba(245, 161, 92, 0.24)')
  sun.addColorStop(1, 'rgba(245, 161, 92, 0)')
  ctx.fillStyle = sun
  ctx.fillRect(0, 0, w, h)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  return tex
}

export class SceneRig {
  readonly scene = new THREE.Scene()
  readonly camera: THREE.PerspectiveCamera
  readonly world = new THREE.Group()
  private readonly ground: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>

  constructor(reducedMotion: boolean) {
    /**
     * ADR-0005: `fov` cua PerspectiveCamera trong Three.js la fov DOC. Giu
     * nguyen no va KHONG bu theo ti le khung hinh chinh la cach khoa goc nhin
     * theo chieu doc — man hinh rong khong duoc nhin xa hon.
     */
    this.camera = new THREE.PerspectiveCamera(58, 9 / 16, 0.1, 400)
    this.camera.position.set(0, 3.15, -6.4)
    this.camera.lookAt(0, 1.2, 9)

    /**
     * BAT BIEN #13: lan 0 hien ra o NUA TRAI man hinh.
     *
     * Camera dung o z am va nhin ve +z, nen huong "phai cua man hinh" la −X chu
     * khong phai +X: mot camera nam ben kia goc toa do thi thay truc X nguoc lai.
     * Do khong phai loi cua lookAt, do la hinh hoc — khong cach nao sua bang cach
     * xoay camera, tru khi dao chieu chay cua ca the gioi sang −z.
     *
     * Nen phep lat nam o DAY, dung mot lan, tren nhom chua moi vat the: `game/`
     * giu nguyen quy uoc "0 trai, 1 giua, 2 phai" cua `constants.ts`, va tang
     * render viet toa do mo phong y nguyen. Vat the moi them vao `world` tu dong
     * dung chieu, khong phai nho phu dinh X o tung cho.
     *
     * Three.js xu ly dung scale am (`matrixWorld.determinant() < 0` → `frontFace`
     * doi chieu), nen mat truoc van la mat truoc, ke ca vien sang BackSide cua
     * nhan vat. Thu duy nhat se bi lat la chu — dung dat text 3D vao `world`.
     */
    this.world.scale.x = -1

    this.scene.background = skyTexture()
    this.scene.fog = new THREE.Fog(SKY_MID, 70, 215)

    const geo = new THREE.PlaneGeometry(120, 300)
    geo.rotateX(-Math.PI / 2)
    geo.translate(0, 0, 130)
    this.ground = new THREE.Mesh(
      geo,
      new THREE.ShaderMaterial({
        vertexShader: GROUND_VERT,
        fragmentShader: GROUND_FRAG,
        fog: false,
        uniforms: {
          uScroll: { value: 0 },
          uLaneW: { value: LANE_WIDTH_M },
          uNear: { value: new THREE.Color(0x241a3d) },
          uFar: { value: new THREE.Color(0x5d3550) },
          uLine: { value: new THREE.Color(SKY_LOW) },
          // NFR-A11Y-05: vach cuon la trang tri, tat khi nguoi dung yeu cau
          uStripes: { value: reducedMotion ? 0 : 1 },
        },
      }),
    )
    this.scene.add(this.ground)
    this.scene.add(this.world)
  }

  /** Cuon nen o man hinh chinh: duong chay dong, khong vat the, khong mo phong. */
  setScroll(distanceM: number): void {
    this.ground.material.uniforms.uScroll!.value = -distanceM
  }

  /** ADR-0005: chi doi aspect, KHONG doi fov. */
  resize(width: number, height: number): void {
    this.camera.aspect = width / Math.max(1, height)
    this.camera.updateProjectionMatrix()
  }

  dispose(): void {
    this.ground.geometry.dispose()
    this.ground.material.dispose()
    ;(this.scene.background as THREE.Texture | null)?.dispose?.()
  }
}

export const coinMaterial = (): THREE.Material => new THREE.MeshBasicMaterial({ color: COIN })
