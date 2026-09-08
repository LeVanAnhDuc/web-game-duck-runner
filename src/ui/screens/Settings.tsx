import { useState } from 'react'
import type { SaveData } from '../../data/save'
import { S } from '../../data/strings'
import { ScreenHeader } from './Screens'

export function SettingsScreen({
  save, reducedMotion, onChange, onReset, onBack,
}: {
  save: SaveData
  reducedMotion: boolean
  onChange: (patch: Partial<SaveData>) => void
  onReset: () => void
  onBack: () => void
}) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="screen screen-solid">
      <ScreenHeader title={S.settings.title} onBack={onBack} />

      <div className="stack">
        <label className="switch">
          <span>{S.settings.mute}</span>
          <input
            type="checkbox"
            checked={save.muted}
            onChange={(e) => onChange({ muted: e.target.checked })}
          />
        </label>

        <div className="setting-row">
          <label htmlFor="music">{S.settings.music}</label>
          <input
            id="music"
            type="range"
            min={0}
            max={100}
            value={Math.round(save.musicVolume * 100)}
            disabled={save.muted}
            onChange={(e) => onChange({ musicVolume: Number(e.target.value) / 100 })}
          />
        </div>

        <div className="setting-row">
          <label htmlFor="sfx">{S.settings.sfx}</label>
          <input
            id="sfx"
            type="range"
            min={0}
            max={100}
            value={Math.round(save.sfxVolume * 100)}
            disabled={save.muted}
            onChange={(e) => onChange({ sfxVolume: Number(e.target.value) / 100 })}
          />
        </div>

        {/* NFR-A11Y-05: nói ra điều đã xảy ra, thay vì im lặng đổi hành vi */}
        {reducedMotion && <p className="note">{S.settings.reducedMotion}</p>}

        {!confirming && (
          <button className="btn btn-danger" onClick={() => setConfirming(true)}>
            {S.settings.reset}
          </button>
        )}

        {confirming && (
          <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="note" style={{ margin: 0, color: 'var(--text)' }}>
              {S.settings.resetConfirm}
            </p>
            <div className="row">
              <button className="btn btn-ghost" onClick={() => setConfirming(false)}>
                {S.settings.resetNo}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setConfirming(false)
                  onReset()
                }}
              >
                {S.settings.resetYes}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
