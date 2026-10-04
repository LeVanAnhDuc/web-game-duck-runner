import type { CallbackResult, DuckerConfig, PendingAuth } from './types'
import { DUCKER_CONFIG, DUCKER_PKCE_KEY, appRootPath } from './config'
import { challengeOf, randomUrlSafeToken } from './pkce'

const CALLBACK_PARAMS = ['code', 'state', 'error', 'error_description', 'iss']

export function redirectUri(): string {
  return new URL(appRootPath(), window.location.origin).toString()
}

function readPending(): PendingAuth | null {
  try {
    const raw = sessionStorage.getItem(DUCKER_PKCE_KEY)
    return raw ? (JSON.parse(raw) as PendingAuth) : null
  } catch {
    return null
  }
}

function clearPending(): void {
  try {
    sessionStorage.removeItem(DUCKER_PKCE_KEY)
  } catch {
    // sessionStorage bi chan — coi nhu khong co phien cho
  }
}

let starting = false

// Back tu Ducker ID khoi phuc trang tu bfcache: co "dang di" se ket o true.
if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) starting = false
  })
}

/** Dung URL authorize roi chuyen ca trang sang Ducker ID. Bo qua neu dang di. */
export async function startLogin(config: DuckerConfig): Promise<void> {
  if (starting) return
  starting = true
  try {
    await redirectToIssuer(config)
  } catch (error) {
    starting = false
    throw error
  }
}

async function redirectToIssuer(config: DuckerConfig): Promise<void> {
  const verifier = randomUrlSafeToken()
  const state = randomUrlSafeToken()
  const pending: PendingAuth = {
    state,
    verifier,
    returnTo: window.location.pathname + window.location.search,
  }
  try {
    sessionStorage.setItem(DUCKER_PKCE_KEY, JSON.stringify(pending))
  } catch {
    starting = false
    return // khong cat duoc verifier thi dung di, se ket o callback
  }
  const url = new URL('/oauth/authorize', config.issuer)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', config.clientId)
  url.searchParams.set('redirect_uri', redirectUri())
  url.searchParams.set('scope', config.scope)
  url.searchParams.set('state', state)
  url.searchParams.set('code_challenge', await challengeOf(verifier))
  url.searchParams.set('code_challenge_method', 'S256')
  window.location.assign(url.toString())
}

/**
 * Doc ?code / ?error roi don DUNG cac tham so OAuth khoi URL — tham so cua game
 * giu nguyen. Code chi dung duoc mot lan, de lai tren URL thi F5 se doi lan nua.
 */
export function consumeCallback(): CallbackResult | null {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const error = params.get('error')
  const state = params.get('state')
  if (!code && !error) return null

  const pending = readPending()
  clearPending()
  for (const key of CALLBACK_PARAMS) params.delete(key)
  const query = params.toString()
  window.history.replaceState(
    window.history.state,
    '',
    window.location.pathname + (query ? `?${query}` : '') + window.location.hash,
  )

  // returnTo duoc khoi phuc ca khi thanh cong LAN khi loi: redirect_uri la goc app tran,
  // nen huy dang nhap ma khong co no se mat ?level... cua game.
  const returnTo = pending && isSafeReturnTo(pending.returnTo) ? pending.returnTo : undefined
  if (error) return { error, returnTo }
  if (!pending || pending.state !== state) return { error: 'state_mismatch' }
  return { code: code ?? undefined, verifier: pending.verifier, returnTo }
}

/** Chi duong dan cung origin moi duoc dua vao replaceState ("//evil" se nem loi luc nap). */
function isSafeReturnTo(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
}

let captured: CallbackResult | null = null
let didCapture = false

/** Chay mot lan khi module nap tren trinh duyet, truoc moi code game doc URL. */
export function captureCallback(): void {
  if (didCapture) return
  didCapture = true
  captured = consumeCallback()
  if (captured?.returnTo) {
    try {
      window.history.replaceState(window.history.state, '', captured.returnTo)
    } catch {
      // URL khong dung duoc — giu URL da don
    }
  }
}

export function capturedCallback(): CallbackResult | null {
  return captured
}

/** Chi danh cho test. */
export function resetCaptureForTests(): void {
  starting = false
  captured = null
  didCapture = false
}

if (typeof window !== 'undefined' && DUCKER_CONFIG) captureCallback()
