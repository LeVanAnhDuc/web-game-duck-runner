import { S, fmt } from '@/data/strings'
import { IconPlay, IconCoin, IconTrophy, IconCart, IconGear } from '@/components/icons'

export function MenuScreen({
  bestDistanceM, coins, onPlay, onShop, onSettings,
}: {
  bestDistanceM: number
  coins: number
  onPlay: () => void
  onShop: () => void
  onSettings: () => void
}) {
  return (
    <div className="screen screen-dim">
      <div className="menu-bottom">
        <h1 className="disp menu-title">
          {S.gameTitleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <div className="rule" style={{ width: '50%' }} />
        <p className="menu-tagline">{S.tagline}</p>

        <div className="menu-stats">
          <div className="menu-stat">
            <IconTrophy />
            <span className="mono">
              {fmt(bestDistanceM)} {S.hud.metres}
            </span>
          </div>
          <div className="menu-sep" />
          <div className="menu-stat" style={{ color: 'var(--gold)' }}>
            <IconCoin />
            <span className="mono">{fmt(coins)}</span>
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', height: 56 }} onClick={onPlay}>
          <IconPlay />
          {S.menu.play}
        </button>

        <div className="row">
          <button className="btn btn-ghost" onClick={onShop}>
            <IconCart />
            {S.menu.shop}
          </button>
          <button className="btn btn-ghost" onClick={onSettings}>
            <IconGear />
            {S.menu.settings}
          </button>
        </div>

        <p className="lbl" style={{ letterSpacing: '.06em', textAlign: 'center', margin: 0 }}>
          {S.menu.hint}
        </p>
      </div>
    </div>
  )
}

