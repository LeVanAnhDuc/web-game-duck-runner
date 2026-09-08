import { S, fmt } from '../../data/strings'
import {
  IconBack, IconCart, IconCoin, IconGear, IconHome, IconPlay, IconRetry, IconTrophy, IconWarn,
} from '../icons'

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

export function PauseScreen({ onResume, onHome }: { onResume: () => void; onHome: () => void }) {
  return (
    <div className="screen screen-modal">
      <div className="panel centre-panel">
        <h2 className="disp" style={{ fontSize: 32, letterSpacing: '.04em' }}>
          {S.pause.title}
        </h2>
        <div className="rule" style={{ width: '100%' }} />
        <button className="btn btn-primary" style={{ width: '100%', height: 56 }} onClick={onResume}>
          <IconPlay />
          {S.pause.resume}
        </button>
        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={onHome}>
          <IconHome />
          {S.pause.home}
        </button>
      </div>
    </div>
  )
}

export function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="screen screen-modal" style={{ background: 'var(--surface)' }}>
      <div className="centre-panel" style={{ boxShadow: 'none' }}>
        <h1 className="disp menu-title">
          {S.gameTitleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <div className="loading-bar">
          {/* Yếu tố đặc trưng dùng làm phần đầy của thanh tiến trình — MASTER §1 */}
          <div className="rule" style={{ height: 6, width: `${Math.round(progress * 100)}%` }} />
        </div>
        <span className="lbl" style={{ fontSize: 14 }}>
          {S.loading.title}
        </span>
      </div>
    </div>
  )
}

export function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="screen screen-modal" style={{ background: 'var(--surface)' }}>
      <div className="panel centre-panel" style={{ textAlign: 'center' }}>
        <span style={{ color: 'var(--alert)' }}>
          <IconWarn />
        </span>
        <h2 className="disp" style={{ fontSize: 26 }}>
          {S.error.title}
        </h2>
        <p className="note" style={{ margin: 0 }}>
          {message}
        </p>
        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={onRetry}>
          <IconRetry size={18} />
          {S.error.retry}
        </button>
      </div>
    </div>
  )
}

export function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="screen-head">
      <button className="btn btn-icon" onClick={onBack} aria-label={S.shop.back}>
        <IconBack />
      </button>
      <h2>{title}</h2>
    </div>
  )
}
