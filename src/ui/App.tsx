import { useCallback, useEffect, useRef, useState } from 'react'
import { hasWebGL, prefersReducedMotion } from '../core/input'
import { load as loadSave, save as writeSave, type SaveData } from '../data/save'
import { S } from '../data/strings'
import { Hud, type HudHandle } from './hud/Hud'
import { GameHost, type RunResult } from './GameHost'
import { ErrorScreen, GameOverScreen, LoadingScreen, MenuScreen } from './screens/Screens'

type Screen = 'loading' | 'menu' | 'playing' | 'over' | 'error'

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
        onRunEnd: handleRunEnd,
        onPause: () => undefined,
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
    return () => {
      host.dispose()
      hostRef.current = null
    }
    // Mang phu thuoc rong la CO Y: tao lai host la mat ca canh 3D va ca luot
    // choi. Moi thu host can deu doc qua ref, khong qua closure.
  }, [])

  const play = useCallback(() => {
    setScreen('playing')
    hostRef.current?.start(Math.floor(Math.random() * 0x7fffffff))
  }, [])

  return (
    <div className="stage">
      <div className="frame">
        <canvas ref={canvasRef} aria-label={S.a11y.canvas} role="img" />

        {/* HUD luon o trong cay DOM: thao ra lap vao moi luot se lam mat ref,
            va no phai san sang truoc khi vong lap chay buoc dau tien. */}
        <div className="layer" style={{ display: screen === 'playing' ? 'block' : 'none' }}>
          <Hud ref={hudRef} onPause={() => undefined} onSkill={() => undefined} skillEnabled={false} />
        </div>

        {screen === 'loading' && <LoadingScreen progress={0.35} />}

        {screen === 'menu' && (
          <MenuScreen
            bestDistanceM={saveData.bestDistanceM}
            coins={saveData.coins}
            onPlay={play}
            onShop={() => undefined}
            onSettings={() => undefined}
          />
        )}

        {screen === 'over' && (
          <GameOverScreen
            distanceM={result.distanceM}
            bestDistanceM={saveData.bestDistanceM}
            coins={result.coins}
            wallet={saveData.coins}
            isRecord={result.isRecord}
            onRetry={play}
            onHome={() => setScreen('menu')}
          />
        )}

        {screen === 'error' && (
          <ErrorScreen message={errorMessage} onRetry={() => globalThis.location.reload()} />
        )}
      </div>
    </div>
  )
}
