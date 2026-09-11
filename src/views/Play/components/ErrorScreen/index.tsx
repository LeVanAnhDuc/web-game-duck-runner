import { S } from '@/data/strings'
import { IconRetry, IconWarn } from '@/components/icons'

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

