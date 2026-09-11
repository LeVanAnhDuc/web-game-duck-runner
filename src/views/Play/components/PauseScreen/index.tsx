import { S } from '@/data/strings'
import { IconPlay, IconHome } from '@/components/icons'

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

