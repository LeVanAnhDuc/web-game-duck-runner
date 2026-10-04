import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'

const auth = vi.hoisted(() => ({ value: {} as Record<string, unknown> }))
vi.mock('@/hooks/useDuckerAuth', () => ({ useDuckerAuth: () => auth.value }))

import { AccountButton } from '@/components/AccountButton'
import { S } from '@/data/strings'

const base = {
  enabled: true,
  profileUrl: 'http://localhost:3000/profile',
  signIn: vi.fn(),
  signOut: vi.fn(),
}

describe('AccountButton — Ducker ID sign-in', () => {
  beforeEach(() => {
    base.signIn.mockClear()
    base.signOut.mockClear()
  })

  it('renders nothing when the feature is disabled', () => {
    auth.value = { ...base, enabled: false, status: 'idle', profile: null }
    const { container } = render(<AccountButton />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the sign-in button when signed out and starts login on click', () => {
    auth.value = { ...base, status: 'signed-out', profile: null }
    render(<AccountButton />)
    fireEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }))
    expect(base.signIn).toHaveBeenCalledOnce()
  })

  it('shows the sign-in button before the client has started (idle)', () => {
    auth.value = { ...base, status: 'idle', profile: null }
    render(<AccountButton />)
    expect(screen.getByRole('button', { name: S.account.signIn })).toBeEnabled()
  })

  it('disables the button while signing in', () => {
    auth.value = { ...base, status: 'loading', profile: null }
    render(<AccountButton />)
    expect(screen.getByRole('button', { name: 'Đang đăng nhập…' })).toBeDisabled()
  })

  it('shows the picture as the avatar when there is one, and the initial when not', () => {
    auth.value = { ...base, status: 'signed-in', profile: { sub: 'u1', name: 'Đức', picture: 'http://x/p.png' } }
    const { container, unmount } = render(<AccountButton />)
    expect(container.querySelector('img')?.getAttribute('src')).toBe('http://x/p.png')
    unmount()
    auth.value = { ...base, status: 'signed-in', profile: { sub: 'u1', name: 'đức' } }
    render(<AccountButton />)
    expect(screen.getByText('Đ')).toBeInTheDocument()
  })

  it('opens the account menu with profile link and sign out; Esc closes and refocuses', () => {
    auth.value = {
      ...base,
      status: 'signed-in',
      profile: { sub: 'u1', name: 'Lê Văn Anh Đức', email: 'duc@ducker.id' },
    }
    render(<AccountButton />)
    const trigger = screen.getByRole('button', { name: 'Tài khoản Ducker ID' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const menuEl = screen.getByRole('menu')
    expect(within(menuEl).getByText('Lê Văn Anh Đức')).toBeInTheDocument()
    expect(within(menuEl).getByText('duc@ducker.id')).toBeInTheDocument()
    const link = screen.getByRole('menuitem', { name: 'Mở hồ sơ Ducker ID' })
    expect(link).toHaveAttribute('href', 'http://localhost:3000/profile')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('menuitem', { name: 'Đăng xuất' }))
    expect(base.signOut).toHaveBeenCalledOnce()
  })

  it('closes on an outside pointer down', () => {
    auth.value = { ...base, status: 'signed-in', profile: { sub: 'u1', name: 'Đức' } }
    render(<AccountButton />)
    const trigger = screen.getByRole('button', { name: 'Tài khoản Ducker ID' })
    fireEvent.click(trigger)
    fireEvent.pointerDown(document.body)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
