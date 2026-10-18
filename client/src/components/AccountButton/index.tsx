import { useEffect, useRef, useState } from 'react'
import { useAccountMenu, useDuckerAuth } from '@/hooks'
import { IconExternal, IconSignOut, IconUser } from '@/components/icons'
import { initialOf } from '@/auth/initials'
import { S } from '@/data/strings'

/**
 * Dang nhap Ducker ID — tuy chon, chi hien khi cau hinh du (auth/config.ts).
 * Khong bat thi tra ve null: khong DOM, khong request, khong cham storage.
 */
export function AccountButton() {
  const auth = useDuckerAuth()
  const menu = useAccountMenu()
  const signInRef = useRef<HTMLButtonElement>(null)
  const focusSignIn = useRef(false)
  const [brokenPicture, setBrokenPicture] = useState<string | null>(null)

  // Sau "Dang xuat" nut menu bi go khoi DOM: tra focus ve nut dang nhap o cung cho,
  // khong de roi ve <body>.
  useEffect(() => {
    if (focusSignIn.current && signInRef.current) {
      signInRef.current.focus()
      focusSignIn.current = false
    }
  }, [auth.status])

  if (!auth.enabled) return null

  if (auth.status !== 'signed-in' || !auth.profile) {
    // idle (truoc khi client chay) cung la nut vo hieu cung kich thuoc: khong bam duoc truoc luc do.
    const loading = auth.status === 'loading'
    const inert = loading || auth.status === 'idle'
    return (
      <div className="account">
        <button
          ref={signInRef}
          type="button"
          className="btn btn-ghost account-signin"
          onClick={auth.signIn}
          disabled={inert}
          aria-busy={loading}
        >
          <IconUser />
          {loading ? S.account.signingIn : S.account.signIn}
        </button>
      </div>
    )
  }

  const { profile } = auth
  return (
    <div className="account">
      <button
        ref={menu.triggerRef}
        type="button"
        className="btn btn-ghost account-trigger"
        onClick={menu.toggle}
        aria-haspopup="menu"
        aria-expanded={menu.open}
        aria-label={S.account.menuLabel}
      >
        {profile.picture && profile.picture !== brokenPicture ? (
          <img
            className="account-avatar"
            src={profile.picture}
            alt=""
            width={32}
            height={32}
            referrerPolicy="no-referrer"
            onError={() => setBrokenPicture(profile.picture ?? null)}
          />
        ) : (
          <span className="account-avatar" aria-hidden="true">
            {initialOf(profile)}
          </span>
        )}
        <span className="account-label">{profile.name || profile.email}</span>
      </button>
      {menu.open && (
        <div ref={menu.menuRef} role="menu" className="account-menu">
          <div className="account-who" role="none">
            <p className="account-name">{profile.name || profile.email}</p>
            {profile.name && profile.email && <p className="account-email">{profile.email}</p>}
          </div>
          <div className="rule" />
          <a
            role="menuitem"
            className="btn btn-ghost account-item"
            href={auth.profileUrl ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => menu.close(false)}
          >
            <IconExternal />
            {S.account.openProfile}
          </a>
          <button
            role="menuitem"
            type="button"
            className="btn btn-ghost account-item"
            onClick={() => {
              menu.close(false)
              focusSignIn.current = true
              auth.signOut()
            }}
          >
            <IconSignOut />
            {S.account.signOut}
          </button>
        </div>
      )}
    </div>
  )
}
