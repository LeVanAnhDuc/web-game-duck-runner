import { S } from '@/data/strings'

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

