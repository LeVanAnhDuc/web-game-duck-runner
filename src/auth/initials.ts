import type { DuckerProfile } from './types'

/** Chu cai dau cua ten (hoac email) cho avatar khi khong co anh. */
export function initialOf(profile: DuckerProfile): string {
  const source = profile.name?.trim() || profile.email?.trim() || ''
  return source ? (source[0] ?? '?').toLocaleUpperCase('vi') : '?'
}
