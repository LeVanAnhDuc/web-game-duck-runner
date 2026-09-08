import { useCallback, useEffect, useRef, useState } from 'react'
import { hasWebGL, prefersReducedMotion } from '../core/input'
import { DEFAULT_SAVE, load as loadSave, save as writeSave, type SaveData } from '../data/save'
import { S } from '../data/strings'
import { Hud, type HudHandle } from './hud/Hud'
import { GameHost, type RunResult } from './GameHost'
import {
  ErrorScreen, GameOverScreen, LoadingScreen, MenuScreen, PauseScreen,
} from './screens/Screens'
import { ShopScreen } from './screens/Shop'
import { SettingsScreen } from './screens/Settings'
import { AudioEngine } from '../audio/Audio'
import { buy as buyCharacter, equip as equipCharacter } from '../data/shop'

type Screen = 'loading' | 'menu' | 'playing' | 'paused' | 'over' | 'shop' | 'settings' | 'error'

export function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [saveData, setSaveData] = useState<SaveData>(() => loadSave())
  const [result, setResult] = useState<RunResult & { isRecord: boolean }>({
    distanceM: 0,
    coins: 0,
    isRecord: false,
  })
  const [errorMessage, setErrorMessage] = useState<string>(S.error.body)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hudRef = useRef<HudHandle>(null)
  const hostRef = useRef<GameHost | null>(null)
  const reducedMotion = useRef(prefersReducedMotion())
  const audio = useRef(new AudioEngine())

  // Doc `screen` qua ref: `togglePause` duoc GameHost giu lai tu luc khoi tao,
  // nen no khong duoc phu thuoc vao closure cua mot lan render cu the.
  const screenRef = useRef<Screen>('loading')
  screenRef.current = screen

  const togglePause = useCallback(() => {
    const host = hostRef.current
    if (!host) return
    if (screenRef.current === 'playing') {
      host.pause()
      setScreen('paused')
    } else if (screenRef.current === 'paused') {
      host.resume()
      setScreen('playing')
    }
  }, [])

  const handleRunEnd = useCallback((r: RunResult) => {
    setSaveData((prev) => {
      const isRecord = r.distanceM > prev.bestDistanceM
      const next: SaveData = {
        ...prev,
        bestDistanceM: Math.max(prev.bestDistanceM, r.distanceM),
        // Xu vao vi o CUOI luot, khong vao ngay luc nhat — invariants.md §11
        coins: prev.coins + r.coins,
      }
      writeSave(next)
      setResult({ ...r, isRecord })
      return next
    })
    setScreen('over')
  }, [])

  // Khoi tao mot lan. GameHost so huu vong lap; React khong cham vao no nua.
  useEffect(() => {
    if (!hasWebGL()) {
      setErrorMessage(S.error.body)
      setScreen('error')
      return
    }
    const canvas = canvasRef.current
    const hud = hudRef.current
    if (!canvas || !hud) return

    let host: GameHost
    try {
      host = new GameHost(canvas, hud, {
        characterId: saveData.selectedCharacter,
        reducedMotion: reducedMotion.current,
        audio: audio.current,
        onRunEnd: handleRunEnd,
        onPause: () => togglePause(),
        onContextLost: () => {
          setErrorMessage(S.error.lost)
          setScreen('error')
        },
      })
    } catch {
      setErrorMessage(S.error.body)
      setScreen('error')
      return
    }
    hostRef.current = host
    setScreen('menu')
    const engine = audio.current
    return () => {
      host.dispose()
      engine.dispose()
      hostRef.current = null
    }
    // Mang phu thuoc rong la CO Y: tao lai host la mat ca canh 3D va ca luot
    // choi. Moi thu host can deu doc qua ref, khong qua closure.
  }, [])

  const play = useCallback(() => {
    /**
     * Tuong tac dau tien la cho DUY NHAT duoc phep tao AudioContext — moi trinh
     * duyet hien dai chan tu dong phat, va tao som se de lai mot context
     * `suspended` ma khong co gi bao. ADR-0008.
     */
    audio.current.unlock()
    audio.current.setSettings(saveData)
    audio.current.setMusicEnabled(!saveData.muted)
    setScreen('playing')
    hostRef.current?.start(Math.floor(Math.random() * 0x7fffffff), saveData.selectedCharacter)
  }, [saveData.selectedCharacter])

  const patchSettings = useCallback((patch: Partial<SaveData>) => {
    setSaveData((prev) => {
      const next = { ...prev, ...patch }
      writeSave(next)
      audio.current.setSettings(next)
      audio.current.setMusicEnabled(!next.muted)
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    const fresh = { ...DEFAULT_SAVE }
    writeSave(fresh)
    setSaveData(fresh)
    hostRef.current?.setCharacter(fresh.selectedCharacter)
    audio.current.setSettings(fresh)
  }, [])

  const handleBuy = useCallback((id: string) => {
    setSaveData((prev) => {
      // `buy` idempotent theo id: bam hai lan that nhanh khong tru tien hai lan
      const next = buyCharacter(prev, id)
      if (next !== prev) writeSave(next)
      return next
    })
  }, [])

  const handleEquip = useCallback((id: string) => {
    setSaveData((prev) => {
      const next = equipCharacter(prev, id)
      if (next !== prev) {
        writeSave(next)
        // Doi hinh bong trong canh ngay; ky nang moi ap tu luot KE TIEP
        hostRef.current?.setCharacter(id)
      }
      return next
    })
  }, [])

  const goHome = useCallback(() => {
    hostRef.current?.abandon()
    setScreen('menu')
  }, [])

  return (
    <div className="stage">
      <div className="frame">
        <canvas ref={canvasRef} aria-label={S.a11y.canvas} role="img" />

        {/* HUD luon o trong cay DOM: thao ra lap vao moi luot se lam mat ref,
            va no phai san sang truoc khi vong lap chay buoc dau tien. */}
        <div
          className="layer"
          style={{ display: screen === 'playing' || screen === 'paused' ? 'block' : 'none' }}
        >
          <Hud
            ref={hudRef}
            onPause={() => togglePause()}
            onSkill={() => hostRef.current?.useSkill()}
            skillEnabled
          />
        </div>

        {screen === 'loading' && <LoadingScreen progress={0.35} />}

        {screen === 'menu' && (
          <MenuScreen
            bestDistanceM={saveData.bestDistanceM}
            coins={saveData.coins}
            onPlay={play}
            onShop={() => setScreen('shop')}
            onSettings={() => setScreen('settings')}
          />
        )}

        {screen === 'shop' && (
          <ShopScreen
            save={saveData}
            onBuy={handleBuy}
            onEquip={handleEquip}
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'settings' && (
          <SettingsScreen
            save={saveData}
            reducedMotion={reducedMotion.current}
            onChange={patchSettings}
            onReset={resetProgress}
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'paused' && (
          <PauseScreen onResume={() => togglePause()} onHome={goHome} />
        )}

        {screen === 'over' && (
          <GameOverScreen
            distanceM={result.distanceM}
            bestDistanceM={saveData.bestDistanceM}
            coins={result.coins}
            wallet={saveData.coins}
            isRecord={result.isRecord}
            onRetry={play}
            onHome={goHome}
          />
        )}

        {screen === 'error' && (
          <ErrorScreen message={errorMessage} onRetry={() => globalThis.location.reload()} />
        )}
      </div>
    </div>
  )
}
