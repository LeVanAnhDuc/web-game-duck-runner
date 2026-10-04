import { useCallback, useEffect, useRef, useState } from 'react'

/** Hanh vi cua menu tai khoan (mo/dong, Esc, bam ra ngoai, tra focus) — khong co style. */
export function useAccountMenu() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const close = useCallback((refocus: boolean) => {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close(true)
        return
      }
      if (event.key === 'Tab') {
        close(false)
        return
      }
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a,button') ?? [])
      if (!items.length) return
      const at = items.indexOf(document.activeElement as HTMLElement)
      let next = -1
      if (event.key === 'ArrowDown') next = (at + 1) % items.length
      else if (event.key === 'ArrowUp') next = (at <= 0 ? items.length : at) - 1
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = items.length - 1
      if (next >= 0) {
        event.preventDefault()
        items[next]?.focus()
      }
    }
    // Focus roi han ra ngoai thi dong. relatedTarget null (Safari khong focus nut khi bam)
    // thi KHONG dong: bam ngoai da co pointerdown lo.
    const onFocusOut = (event: FocusEvent) => {
      const to = event.relatedTarget as Node | null
      if (to && !menuRef.current?.contains(to) && !triggerRef.current?.contains(to)) close(false)
    }
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) close(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('focusout', onFocusOut)
    menuRef.current?.querySelector<HTMLElement>('a,button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [open, close])

  return { open, toggle: () => setOpen((value) => !value), close, triggerRef, menuRef }
}
