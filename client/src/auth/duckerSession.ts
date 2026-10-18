import type { AuthSnapshot, CallbackResult, DuckerConfig } from './types'
import { exchangeCode, fetchProfile } from './request'
import { DUCKER_CONFIG } from './config'
import { capturedCallback, startLogin } from './duckerAuth'

const IDLE: AuthSnapshot = { status: 'idle', profile: null }
const SIGNED_OUT: AuthSnapshot = { status: 'signed-out', profile: null }

let snapshot: AuthSnapshot = IDLE
let started = false
const listeners = new Set<() => void>()

function set(next: AuthSnapshot): void {
  snapshot = next
  listeners.forEach((listener) => listener())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSnapshot(): AuthSnapshot {
  return snapshot
}

/** Ban render dau tien luon la idle (cung dung cho SSR neu sau nay co). */
export function getServerSnapshot(): AuthSnapshot {
  return IDLE
}

/**
 * Doi code -> profile dung MOT lan moi lan mo trang (StrictMode, remount deu an toan).
 * Moi loi chi ha ve signed-out: dang nhap la tinh nang cong them, khong phai cong chan.
 * Tham so mac dinh la diem tiem cho test, khong phai gia tri cau hinh mac dinh.
 */
export function startSession(
  config: DuckerConfig | null = DUCKER_CONFIG,
  callback: CallbackResult | null = capturedCallback(),
): void {
  if (started || !config) return
  started = true
  if (!callback || callback.error || !callback.code || !callback.verifier) {
    set(SIGNED_OUT)
    return
  }
  set({ status: 'loading', profile: null })
  exchangeCode(config, callback.code, callback.verifier)
    .then((tokens) => fetchProfile(config, tokens.accessToken))
    .then(
      (profile) => set({ status: 'signed-in', profile }),
      () => set(SIGNED_OUT),
    )
}

export function signIn(): void {
  if (DUCKER_CONFIG) {
    void startLogin(DUCKER_CONFIG).catch(() => {
      // im lang: dang nhap la tuy chon
    })
  }
}

/** Quen profile trong bo nho. Phien o Ducker ID van con — dung nghia SSO. */
export function signOut(): void {
  set(SIGNED_OUT)
}

export function resetSessionForTests(): void {
  snapshot = IDLE
  started = false
  listeners.clear()
}

if (typeof window !== 'undefined') startSession()
