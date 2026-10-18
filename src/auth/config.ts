import type { DuckerConfig, DuckerEnv } from './types'

export const DUCKER_PKCE_KEY = 'ducker.pkce'

/**
 * Dang nhap Ducker ID chi bat khi co = "true" VA du ca 4 gia tri.
 * Khong co gia tri mac dinh nao o day: thieu la tat, khong doan.
 */
export function readDuckerConfig(raw: DuckerEnv): DuckerConfig | null {
  if (raw.enabled !== 'true') return null
  const { issuer, clientId, scope, profilePath } = raw
  if (!issuer || !clientId || !scope || !profilePath) return null
  // "localhost:3000" la URL hop le voi scheme "localhost:" — chan.
  if (!/^https?:\/\//.test(issuer)) return null
  try {
    return {
      issuer: new URL(issuer).origin,
      clientId,
      scope,
      profileUrl: new URL(profilePath, issuer).toString(),
    }
  } catch {
    return null // issuer sai dinh dang -> coi nhu chua cau hinh, game van chay
  }
}

// Doc theo ten literal de Vite inline luc build.
export const DUCKER_CONFIG = readDuckerConfig({
  enabled: import.meta.env.VITE_FEATURE_DUCKER_SIGN_IN,
  issuer: import.meta.env.VITE_DUCKER_ISSUER,
  clientId: import.meta.env.VITE_DUCKER_CLIENT_ID,
  scope: import.meta.env.VITE_DUCKER_SCOPE,
  profilePath: import.meta.env.VITE_DUCKER_PROFILE_PATH,
})

/** Goc app — redirect_uri phai khop tuyet doi voi URI da dang ky o Ducker ID. */
export function appRootPath(): string {
  return import.meta.env.BASE_URL
}
