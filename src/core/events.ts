/** Su kien roi rac tu mo phong ra ngoai. Khong phai trang thai moi frame. */
export type GameEventMap = {
  runStarted: { seed: number }
  coinCollected: { total: number; chargePct: number }
  chargeFull: Record<string, never>
  skillActivated: { skillId: string }
  skillEnded: { skillId: string }
  powerUpStarted: { kind: string }
  powerUpEnded: { kind: string }
  shieldBroken: Record<string, never>
  playerHit: Record<string, never>
  runEnded: { distanceM: number; coins: number; isRecord: boolean }
  milestone: { distanceM: number }
}

type Handler<K extends keyof GameEventMap> = (payload: GameEventMap[K]) => void

export class EventBus {
  private handlers = new Map<string, Set<(p: unknown) => void>>()

  on<K extends keyof GameEventMap>(type: K, fn: Handler<K>): () => void {
    let set = this.handlers.get(type as string)
    if (!set) {
      set = new Set()
      this.handlers.set(type as string, set)
    }
    const wrapped = fn as (p: unknown) => void
    set.add(wrapped)
    return () => set.delete(wrapped)
  }

  emit<K extends keyof GameEventMap>(type: K, payload: GameEventMap[K]): void {
    const set = this.handlers.get(type as string)
    if (!set) return
    // Chep ra mang truoc khi goi: handler co the tu go chinh no trong luc chay
    for (const fn of [...set]) fn(payload)
  }

  clear(): void {
    this.handlers.clear()
  }
}
