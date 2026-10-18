import { useSyncExternalStore } from 'react'
import type { AuthSnapshot } from '@/auth/types'
import { DUCKER_CONFIG } from '@/auth/config'
import { getServerSnapshot, getSnapshot, signIn, signOut, subscribe } from '@/auth/duckerSession'

export function useDuckerAuth(): AuthSnapshot & {
  enabled: boolean
  profileUrl: string | null
  signIn: () => void
  signOut: () => void
} {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return {
    ...snapshot,
    enabled: DUCKER_CONFIG !== null,
    profileUrl: DUCKER_CONFIG ? DUCKER_CONFIG.profileUrl : null,
    signIn,
    signOut,
  }
}
