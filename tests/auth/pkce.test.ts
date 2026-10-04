// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { challengeOf, randomUrlSafeToken } from '@/auth/pkce'

describe('pkce', () => {
  it('matches the RFC 7636 appendix B vector', async () => {
    expect(await challengeOf('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    )
  })
  it('makes url-safe random tokens that differ each call', () => {
    const a = randomUrlSafeToken()
    expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/)
    expect(randomUrlSafeToken()).not.toBe(a)
  })
})
