import { S, fmt } from '@/data/strings'
import { IconCoin, IconTrophy, IconRetry, IconHome } from '@/components/icons'

export function GameOverScreen({
  distanceM, bestDistanceM, coins, wallet, isRecord, onRetry, onHome,
}: {
  distanceM: number
  bestDistanceM: number
  coins: number
  wallet: number
  isRecord: boolean
  onRetry: () => void
  onHome: () => void
}) {
  return (
    <div className="screen screen-modal">
      <div className="panel centre-panel">
        {isRecord ? (
          // MASTER §2.2 — vàng được dùng cho dấu kỷ lục mới, không chỉ cho xu
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold)' }}>
            <IconTrophy />
            <span className="lbl" style={{ color: 'var(--gold)', fontSize: 14 }}>
              {S.gameOver.newRecord}
            </span>
          </div>
        ) : (
          <span className="lbl" style={{ fontSize: 14 }}>
            {S.gameOver.best} {fmt(bestDistanceM)} {S.hud.metres}
          </span>
        )}

        <p className="disp score-big" style={{ margin: 0 }}>
          {fmt(distanceM)}
          <span>{S.hud.metres}</span>
        </p>

        <div className="rule" style={{ width: '100%' }} />

        <div className="split">
          <div>
            <span className="lbl" style={{ fontSize: 14 }}>
              {S.gameOver.thisRun}
            </span>
            <span
              className="mono"
              style={{ fontSize: 20, color: 'var(--gold)', display: 'flex', gap: 6 }}
            >
              <IconCoin />+{fmt(coins)}
            </span>
          </div>
          <div className="split-sep" />
          <div>
            <span className="lbl" style={{ fontSize: 14 }}>
              {S.gameOver.wallet}
            </span>
            <span className="mono" style={{ fontSize: 20, display: 'flex', gap: 6 }}>
              <IconCoin />
              {fmt(wallet)}
            </span>
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', height: 56 }} onClick={onRetry}>
          <IconRetry />
          {S.gameOver.retry}
        </button>
        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={onHome}>
          <IconHome />
          {S.gameOver.home}
        </button>
      </div>
    </div>
  )
}

