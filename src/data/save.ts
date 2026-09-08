/**
 * Trang thai luu tren may nguoi choi.
 *
 * Mot key, mot object co `version`. Doc thi PHAI validate — invariants.md §8,
 * NFR-DATA-04. Nguoi dung sua tay duoc, phien ban cu de lai schema cu duoc, va
 * mot field thieu se thanh NaN chay khap phan tinh diem: khong crash, chi hien
 * NaN. Khong ai biet cho toi luc nhin thay.
 *
 * Khong chong gian lan — Non-Goal trong overview.md. Khong co server de xac
 * thuc, nen moi no luc lam kho viec sua localStorage chi ton cong.
 */
export const SAVE_KEY = 'duck-runner.save.v1'
/**
 * Khoa cu, tu thoi game con ten `Duskrun`.
 *
 * Chi doc, khong bao gio ghi. Khi game doi ten, mot ban luu duoi khoa cu se tro
 * thanh vo hinh — nguoi choi mat ky luc va vi xu ma khong co gi giai thich. Ba
 * dong doc du phong re hon rat nhieu so voi cai an tuong do.
 */
export const LEGACY_SAVE_KEYS = ['duskrun.save.v1'] as const
export const SAVE_VERSION = 1

export interface SaveData {
  version: number
  bestDistanceM: number
  coins: number
  ownedCharacters: string[]
  selectedCharacter: string
  muted: boolean
  musicVolume: number
  sfxVolume: number
}

export const DEFAULT_SAVE: Readonly<SaveData> = Object.freeze({
  version: SAVE_VERSION,
  bestDistanceM: 0,
  coins: 0,
  ownedCharacters: ['runner'],
  selectedCharacter: 'runner',
  muted: false,
  musicVolume: 0.5,
  sfxVolume: 0.8,
})

/** Kho luu tru — tach ra de test khong can jsdom va de gia lap loi. */
export interface Storage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

function browserStorage(): Storage | null {
  try {
    // Che do rieng tu cua vai trinh duyet nem ngay o buoc truy cap
    const s = globalThis.localStorage
    const probe = '__duck_runner_probe__'
    s.setItem(probe, '1')
    s.removeItem(probe)
    return s
  } catch {
    return null
  }
}

/** Khong co localStorage thi giu trong bo nho: game van choi duoc, chi khong nho. */
function memoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
  }
}

export function load(storage: Storage | null = browserStorage()): SaveData {
  const store = storage ?? memoryStorage()
  let raw: string | null = null
  try {
    raw = store.getItem(SAVE_KEY)
    // Chua co ban luu duoi khoa moi: thu cac khoa cu truoc khi ket luan la nguoi
    // choi moi. Lan `save()` ke tiep se ghi sang khoa moi.
    if (raw === null) {
      for (const legacy of LEGACY_SAVE_KEYS) {
        raw = store.getItem(legacy)
        if (raw !== null) break
      }
    }
  } catch {
    return { ...DEFAULT_SAVE }
  }
  if (!raw) return { ...DEFAULT_SAVE }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ...DEFAULT_SAVE }
  }
  return sanitize(parsed)
}

export function save(data: SaveData, storage: Storage | null = browserStorage()): boolean {
  const store = storage ?? memoryStorage()
  try {
    store.setItem(SAVE_KEY, JSON.stringify(sanitize(data)))
    return true
  } catch {
    // Het dung luong hoac bi chan: mat tien do con hon mat luot choi
    return false
  }
}

/**
 * Bien bat ky thu gi thanh mot SaveData hop le.
 *
 * Khong nem, khong tra ve mot phan. Field nao khong doc duoc thi lay mac dinh —
 * mot ban luu hong khong duoc phep lam hong game.
 */
export function sanitize(input: unknown): SaveData {
  if (typeof input !== 'object' || input === null) return { ...DEFAULT_SAVE }
  const o = input as Record<string, unknown>
  const owned = Array.isArray(o.ownedCharacters)
    ? o.ownedCharacters.filter((c): c is string => typeof c === 'string' && c.length > 0)
    : []
  // Nhan vat mac dinh luon thuoc so huu, ke ca khi ban luu noi khong
  if (!owned.includes(DEFAULT_SAVE.selectedCharacter)) owned.unshift(DEFAULT_SAVE.selectedCharacter)
  const selected =
    typeof o.selectedCharacter === 'string' && owned.includes(o.selectedCharacter)
      ? o.selectedCharacter
      : DEFAULT_SAVE.selectedCharacter

  return {
    version: SAVE_VERSION,
    bestDistanceM: num(o.bestDistanceM, DEFAULT_SAVE.bestDistanceM, 0),
    coins: num(o.coins, DEFAULT_SAVE.coins, 0),
    ownedCharacters: owned,
    selectedCharacter: selected,
    muted: typeof o.muted === 'boolean' ? o.muted : DEFAULT_SAVE.muted,
    musicVolume: num(o.musicVolume, DEFAULT_SAVE.musicVolume, 0, 1),
    sfxVolume: num(o.sfxVolume, DEFAULT_SAVE.sfxVolume, 0, 1),
  }
}

function num(v: unknown, fallback: number, min: number, max = Number.MAX_SAFE_INTEGER): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) return fallback
  return Math.min(max, Math.max(min, v))
}
