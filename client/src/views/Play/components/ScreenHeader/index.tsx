import { S } from '@/data/strings'
import { IconBack } from '@/components/icons'

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

