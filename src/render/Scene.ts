import * as THREE from 'three'
import { LANE_WIDTH_M } from '../game/constants'
import {
  FOG_FAR_M, FOG_NEAR_M, LIP_M, ROAD_HALF_M, ROAD_TEXTURE_AMPLITUDE,
} from './layout'
import {
  CANOPY, CHASM, HAZARD_EDGE, MIST_FAR, MIST_NEAR, ROAD_FAR, ROAD_NEAR, hex,
} from './palette'
import { Scenery } from './Scenery'

/**
 * Canh 3D: suong, rung, vuc, mat duong, camera — ADR-0009.
 *
 * Khong den, khong shadow map. Canh la RUNG LUC SUONG SOM: suong sang nam sau
 * moi thu o moi khoang cach, nen moi vat the deu co nen sang de in bong len.
 * Do la cach cau truc canh tu bao dam viec doc chuong ngai, thay vi phai ap mot
 * noi quy len tung vat the — xem `bat bien #14`.
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
 * Mat duong, vuc va go sang — ba thu, MOT shader, khong them draw call nao.
 *
 * Vach lan va vach ngang cuon deu la ham cua toa do the gioi, nen hai tam giac
 * lam duoc viec cua hang tram vach hinh hoc.
 */
const GROUND_FRAG = `
  varying vec3 vWorld;
  uniform sampler2D uNoise;
  uniform float uScroll;
  uniform float uLaneW;
  uniform float uRoadHalf;
  uniform float uLip;
  uniform float uAmp;
  uniform vec3 uRoadNear;
  uniform vec3 uRoadFar;
  uniform vec3 uChasm;
  uniform vec3 uEdge;
  uniform vec3 uMist;
  uniform float uStripes;

  float band(float v, float w) {
    float f = fwidth(v) * 1.5;
    return 1.0 - smoothstep(w - f, w + f, abs(v));
  }

  void main() {
    float ax = abs(vWorld.x);
    float dist = vWorld.z + 6.4;
    float depth = clamp(vWorld.z / 190.0, 0.0, 1.0);

    // ── Mat duong ────────────────────────────────────────────────────────────
    vec3 road = mix(uRoadNear, uRoadFar, pow(depth, 0.55));
    // Texture da uot. Modulation quanh 1.0, bien do khoa boi uAmp.
    float n = texture2D(uNoise, vec2(vWorld.x * 0.34, (vWorld.z + uScroll) * 0.34)).r;
    road *= 1.0 + (n - 0.5) * 2.0 * uAmp;

    float lane = 0.0;
    lane += band(vWorld.x - uLaneW * 0.5, 0.045);
    lane += band(vWorld.x + uLaneW * 0.5, 0.045);
    road = mix(road, uEdge, clamp(lane, 0.0, 1.0) * 0.16 * (1.0 - depth));

    float s = fract((vWorld.z + uScroll) / 13.0);
    float stripe = 1.0 - smoothstep(0.0, 0.028, s);
    road = mix(road, uEdge, stripe * 0.1 * (1.0 - depth) * uStripes);

    // ── Vuc, va go sang o mep ────────────────────────────────────────────────
    float onRoad = 1.0 - smoothstep(uRoadHalf - 0.03, uRoadHalf + 0.03, ax);
    vec3 c = mix(uChasm, road, onRoad);
    // Go sang: mot dai hep dung o mep. Day la thu khien con duong doc ra la mot
    // CAY CAU thay vi mot mat duong bi cat ngang.
    c = mix(c, uEdge, band(ax - uRoadHalf + uLip, uLip) * (1.0 - depth * 0.6));

    // ── Suong ────────────────────────────────────────────────────────────────
    float fog = clamp((dist - ${FOG_NEAR_M}.0) / ${FOG_FAR_M - FOG_NEAR_M}.0, 0.0, 1.0);
    gl_FragColor = vec4(mix(c, uMist, fog), 1.0);
    /**
     * ShaderMaterial KHONG tu chen buoc chuyen khong gian mau — khac voi
     * MeshBasicMaterial. Thieu dong nay thi mau viet ra bi coi la tuyen tinh va
     * hien ra toi hon dung mot bac gamma.
     */
    #include <colorspace_fragment>
  }
`

/** Sinh so gia ngau nhien co hat — de texture giong nhau moi lan tai trang. */
function seeded(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/**
 * Nen canh: mot dai doc tu tan la toi o dinh xuong suong sang o chan troi.
 *
 * Vi sao khong dung shader: nen la screen-space va camera khong bao gio doi goc
 * ngang. Mot texture 256x512 lam dung viec do voi chi phi bang khong.
 */
function backdropTexture(): THREE.Texture {
  const w = 256
  const h = 512
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()

  /**
   * Chan troi o 0.386 tinh tu dinh: camera nhin xuong 7.2 do, fov doc 58 do, nen
   * 0.5 - 0.5 * tan(7.2) / tan(29). Dat sai con so nay thi dai suong sang nhat
   * roi xuong duoi mat duong va bien mat.
   */
  const HORIZON_V = 0.386
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, hex(CANOPY))
  grad.addColorStop(HORIZON_V * 0.42, hex(MIST_NEAR))
  grad.addColorStop(HORIZON_V, hex(MIST_FAR))
  grad.addColorStop(1, hex(MIST_FAR))
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Vet sang thap phia truoc — mot huong sang, du de canh khong phang det
  const glow = ctx.createRadialGradient(w / 2, h * HORIZON_V, 0, w / 2, h * HORIZON_V, h * 0.3)
  glow.addColorStop(0, 'rgba(255, 252, 240, 0.85)')
  glow.addColorStop(0.4, 'rgba(226, 236, 220, 0.32)')
  glow.addColorStop(1, 'rgba(203, 214, 198, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  /**
   * Tang cay XA nam trong texture nen, khong phai hinh hoc: o khoang cach do
   * suong da lam nhat gan het, va chung khong bao gio can cuon — chuyen dong do
   * than cay gan dam nhiem. Doi lai la khong mot draw call nao.
   */
  const rnd = seeded(0x5eed17)
  ctx.fillStyle = hex(CANOPY)
  for (let i = 0; i < 34; i++) {
    const x = rnd() * w
    const trunkW = 3 + rnd() * 7
    const top = h * (HORIZON_V - 0.3 - rnd() * 0.09)
    ctx.globalAlpha = 0.1 + rnd() * 0.18
    ctx.fillRect(x, top, trunkW, h * HORIZON_V - top)
    // Vom la tren dinh than
    ctx.beginPath()
    ctx.ellipse(x + trunkW / 2, top, trunkW * 2.6, trunkW * 1.5, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  return tex
}

/** Nhieu xam lap lai duoc, dung lam texture da uot cua mat duong. */
function groundNoiseTexture(): THREE.Texture {
  const n = 128
  const canvas = document.createElement('canvas')
  canvas.width = n
  canvas.height = n
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()
  const rnd = seeded(0xda0ada)
  const img = ctx.createImageData(n, n)
  // Hai tang: nhieu min lam hat da, dom lon lam vung uot
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      // Tan so phai la SO NGUYEN chu ky tren canh texture, neu khong thi
      // RepeatWrapping lo ra mot duong noi thang chay doc mat duong.
      const coarse =
        Math.sin((x / n) * Math.PI * 2 * 3) * Math.cos((y / n) * Math.PI * 2 * 2) * 0.5 + 0.5
      const v = Math.round(255 * (0.34 * rnd() + 0.66 * coarse))
      const i = (y * n + x) * 4
      img.data[i] = v
      img.data[i + 1] = v
      img.data[i + 2] = v
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  return tex
}

/**
 * Tan la tren dau: mot tran la co khe ho, khong phai mot dam la roi.
 *
 * Da thu hai lan truoc khi ra hinh nay, va ca hai lan sai deu day duoc ly do:
 *
 * 1. La thuon rat manh, goc quay tu do → doc thanh mot dan manh vun bay ngang.
 * 2. Khoi ellipse tron, lon → doc thanh may hoac da, vi vien nhan qua.
 *
 * Thu quyet dinh la **vien RANG**. Tan la o day gan nhu den tuyet doi tren nen
 * suong sang, nen mau va be mat khong dong gop gi — chi co hinh bong. Va hinh
 * bong doc ra la "la" nho mep khia, khong nho do tron.
 */
function canopyTexture(): THREE.Texture {
  const n = 256
  const canvas = document.createElement('canvas')
  canvas.width = n
  canvas.height = n
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()
  const rnd = seeded(0xca0f17)
  ctx.clearRect(0, 0, n, n)
  ctx.fillStyle = hex(CANOPY)

  /** Ve o ca chin o lan can, de hinh cham canh van lien mach khi tile. */
  const tiled = (draw: (dx: number, dy: number) => void): void => {
    for (const dx of [-n, 0, n]) for (const dy of [-n, 0, n]) draw(dx, dy)
  }

  /**
   * Mot tau la kep: mot cuong, hai ben la cac la chet nhau. Ve bang MOT duong
   * kin co mep rang — do la net khien no doc ra la la du o co nao.
   */
  const frond = (cx: number, cy: number, len: number, rot: number, alpha: number): void => {
    const leaflets = 9
    ctx.globalAlpha = alpha
    tiled((dx, dy) => {
      ctx.save()
      ctx.translate(cx + dx, cy + dy)
      ctx.rotate(rot)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      // Mep tren: rang cua, mo rong o giua tau la roi thu lai o ngon
      for (let i = 0; i <= leaflets; i++) {
        const t = i / leaflets
        const w = len * 0.3 * Math.sin(Math.PI * (0.15 + t * 0.85))
        ctx.lineTo(t * len, -w)
        ctx.lineTo((t + 0.5 / leaflets) * len, -w * 0.42)
      }
      // Mep duoi: lap lai nguoc chieu
      for (let i = leaflets; i >= 0; i--) {
        const t = i / leaflets
        const w = len * 0.3 * Math.sin(Math.PI * (0.15 + t * 0.85))
        ctx.lineTo((t + 0.5 / leaflets) * len, w * 0.42)
        ctx.lineTo(t * len, w)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    })
  }

  // Tang 1: khoi la nho lam phan day — chi de bit khe, khong duoc lan hinh
  for (let i = 0; i < 7; i++) {
    const cx = rnd() * n
    const cy = rnd() * n
    const r = 15 + rnd() * 14
    ctx.globalAlpha = 0.5 + rnd() * 0.3
    tiled((dx, dy) => {
      ctx.beginPath()
      ctx.ellipse(cx + dx, cy + dy, r, r * 0.7, rnd() * 3.1, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  // Tang 2: tau la moc thanh chum tu mot diem — cach la thuc su moc
  for (let i = 0; i < 15; i++) {
    const cx = rnd() * n
    const cy = rnd() * n
    const base = rnd() * Math.PI * 2
    const count = 3 + Math.floor(rnd() * 3)
    for (let k = 0; k < count; k++) {
      frond(cx, cy, 46 + rnd() * 44, base + (k / count) * 2.3 - 1.15, 0.68 + rnd() * 0.32)
    }
  }
  ctx.globalAlpha = 1

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  return tex
}

/**
 * Mat dung cua con duong — thanh cay cau.
 *
 * Mot mat phang toi khong doc ra la mot cai VUC; no doc ra la mat dat toi. Thu
 * noi cho mat biet co mot cu roi la be day: mot mat dung o dung mep, sang o dinh
 * va toi dan xuong duoi. Hai tam giac moi ben, mot draw call, dung yen — no
 * deu tap theo chieu z nen khong can cuon.
 */
function causewayFaces(): THREE.Mesh {
  const zNear = -24
  const zFar = 250
  const drop = 1.7
  const top = new THREE.Color(ROAD_NEAR).lerp(new THREE.Color(CHASM), 0.42)
  const bottom = new THREE.Color(CHASM)
  const position: number[] = []
  const color: number[] = []
  for (const side of [-1, 1]) {
    const x = side * ROAD_HALF_M
    // Mat huong VAO trong duong, nen thu tu dinh doi chieu theo ben
    const quad: [number, number, number][] =
      side < 0
        ? [[x, 0, zNear], [x, -drop, zNear], [x, -drop, zFar], [x, 0, zNear], [x, -drop, zFar], [x, 0, zFar]]
        : [[x, 0, zNear], [x, -drop, zFar], [x, -drop, zNear], [x, 0, zNear], [x, 0, zFar], [x, -drop, zFar]]
    for (const [px, py, pz] of quad) {
      position.push(px, py, pz)
      const c = py === 0 ? top : bottom
      color.push(c.r, c.g, c.b)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(color, 3))
  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, fog: true }))
}

export class SceneRig {
  readonly scene = new THREE.Scene()
  readonly camera: THREE.PerspectiveCamera
  readonly world = new THREE.Group()
  private readonly ground: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  private readonly canopy: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  private readonly scenery = new Scenery()
  private readonly faces = causewayFaces()

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

    this.scene.background = backdropTexture()
    this.scene.fog = new THREE.Fog(MIST_FAR, FOG_NEAR_M, FOG_FAR_M)

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
          uNoise: { value: groundNoiseTexture() },
          uScroll: { value: 0 },
          uLaneW: { value: LANE_WIDTH_M },
          uRoadHalf: { value: ROAD_HALF_M },
          uLip: { value: LIP_M },
          uAmp: { value: ROAD_TEXTURE_AMPLITUDE },
          uRoadNear: { value: new THREE.Color(ROAD_NEAR) },
          uRoadFar: { value: new THREE.Color(ROAD_FAR) },
          uChasm: { value: new THREE.Color(CHASM) },
          uEdge: { value: new THREE.Color(HAZARD_EDGE) },
          uMist: { value: new THREE.Color(MIST_FAR) },
          // NFR-A11Y-05: vach cuon la trang tri, tat khi nguoi dung yeu cau
          uStripes: { value: reducedMotion ? 0 : 1 },
        },
      }),
    )
    this.scene.add(this.ground)

    /**
     * Tan la tren dau. Mot mat phang duy nhat, cuon bang `map.offset` chu khong
     * bang hinh hoc — nen no khong bao gio phai tai su dung hay don dep gi.
     */
    const canopyGeo = new THREE.PlaneGeometry(90, 210)
    canopyGeo.rotateX(Math.PI / 2)
    canopyGeo.translate(0, 11.5, 95)
    const canopyMap = canopyTexture()
    canopyMap.repeat.set(3, 7)
    this.canopy = new THREE.Mesh(
      canopyGeo,
      new THREE.MeshBasicMaterial({
        map: canopyMap,
        color: CANOPY,
        transparent: true,
        depthWrite: false,
        fog: true,
        side: THREE.DoubleSide,
      }),
    )
    this.scene.add(this.canopy)

    /**
     * Than cay nam trong `world` de dung mot quy uoc truc X voi moi vat the khac
     * (bat bien #13). Chung doi xung nen phep lat khong nhin thay duoc, nhung
     * dat dung cho van re hon giai thich vi sao mot thu nam ngoai.
     */
    this.world.add(this.scenery.mesh)
    this.scene.add(this.faces)
    this.scene.add(this.world)
  }

  /**
   * Cuon nen theo khoang cach da chay.
   *
   * Ca man hinh chinh (attract) va luot choi that deu di qua day, nen rung cuon
   * o ca hai — mot duong vao duy nhat, khong phai hai nhanh song song.
   */
  setScroll(distanceM: number): void {
    this.ground.material.uniforms.uScroll!.value = -distanceM
    this.scenery.update(distanceM)
    const map = this.canopy.material.map
    // Tan la cuon CHAM hon mat duong — parallax, va do la thu duy nhat noi cho
    // nguoi choi biet tan la o tren cao chu khong dan vao mat duong.
    if (map) map.offset.y = (distanceM * 0.045) % 1
  }

  /** ADR-0005: chi doi aspect, KHONG doi fov. */
  resize(width: number, height: number): void {
    this.camera.aspect = width / Math.max(1, height)
    this.camera.updateProjectionMatrix()
  }

  dispose(): void {
    this.ground.geometry.dispose()
    this.ground.material.uniforms.uNoise!.value?.dispose?.()
    this.ground.material.dispose()
    this.canopy.geometry.dispose()
    this.canopy.material.map?.dispose()
    this.canopy.material.dispose()
    this.scenery.dispose()
    this.faces.geometry.dispose()
    ;(this.faces.material as THREE.Material).dispose()
    ;(this.scene.background as THREE.Texture | null)?.dispose?.()
  }
}
