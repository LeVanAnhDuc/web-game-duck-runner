import { forwardRef, useImperativeHandle, useRef } from 'react'
import { S, fmt } from '../../data/strings'
import { IconBolt, IconCoin, IconPause } from '../icons'

/**
 * HUD lúc chơi.
 *
 * BẤT BIẾN #7: **React không re-render trong lúc đang chơi.** Quãng đường đổi 60
 * lần mỗi giây; đưa nó vào state là 60 lần reconcile mỗi giây, và frame sẽ rớt
 * đều đặn — rồi người ta sẽ đổ lỗi cho Three.js. Nên HUD phơi ra một handle
 * mệnh lệnh, và vòng lặp ghi thẳng vào DOM qua ref.
 *
 * Vi phạm bất biến này KHÔNG gây lỗi, chỉ gây tụt fps. Đó là lý do nó nằm trong
 * invariants.md chứ không nằm trong một lint rule.
 */
export interface HudHandle {
  setDistance(metres: number): void
  setCoins(n: number): void
  setCharge(pct: number): void
}

interface Props {
  onPause: () => void
  onSkill: () => void
  /** M1 chưa có kỹ năng; nút vẫn hiện ở trạng thái rỗng vì bố cục đã được duyệt. */
  skillEnabled: boolean
}

export const Hud = forwardRef<HudHandle, Props>(function Hud(
  { onPause, onSkill, skillEnabled },
  ref,
) {
  const distanceRef = useRef<HTMLSpanElement>(null)
  const coinsRef = useRef<HTMLSpanElement>(null)
  const chargeRef = useRef<HTMLDivElement>(null)
  const skillRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useImperativeHandle(
    ref,
    () => ({
      setDistance(metres) {
        const el = distanceRef.current
        if (el) el.textContent = fmt(metres)
      },
      setCoins(n) {
        const el = coinsRef.current
        if (el) el.textContent = String(n)
      },
      setCharge(pct) {
        const fill = chargeRef.current
        if (fill) {
          fill.style.width = `${Math.round(Math.min(1, Math.max(0, pct)) * 100)}%`
          fill.classList.toggle('ready', pct >= 1)
        }
        const btn = skillRef.current
        if (btn) btn.classList.toggle('ready', pct >= 1)
        const lbl = labelRef.current
        if (lbl) lbl.textContent = pct >= 1 ? S.hud.skillReady : S.hud.skillCharging
      },
    }),
    [],
  )

  return (
    <div className="hud">
      {/* MASTER §2.3 — scrim alpha ≥ 0.45, đo được: không có nó thì chữ trên
          chân trời sáng nhất chỉ đạt 1.84:1. */}
      <div className="hud-scrim" />

      <div className="hud-row">
        <button className="btn btn-icon" onClick={onPause} aria-label={S.hud.pause}>
          <IconPause />
        </button>

        <div className="mono hud-distance" aria-live="off">
          <span ref={distanceRef}>0</span>
          <span>{S.hud.metres}</span>
        </div>

        <div className="hud-coins">
          <IconCoin />
          <span className="mono" ref={coinsRef}>
            0
          </span>
        </div>
      </div>

      <div className="charge">
        <div className="charge-fill" ref={chargeRef} />
      </div>

      <div className="skill-btn" ref={skillRef} data-no-swipe>
        <button onClick={onSkill} aria-label={S.hud.skill} disabled={!skillEnabled}>
          <IconBolt />
        </button>
        <span className="lbl" ref={labelRef}>
          {S.hud.skillCharging}
        </span>
      </div>
    </div>
  )
})
