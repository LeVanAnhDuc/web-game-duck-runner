import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { S } from '../../src/data/strings'

/**
 * Luong man hinh — G7.
 *
 * jsdom khong co WebGL, nen App phai roi vao nhanh bao loi. Do chinh la thu can
 * kiem: NFR-REL-04 noi khong duoc de canvas den, va day la moi truong duy nhat
 * tai lap duoc tinh huong do mot cach chac chan.
 *
 * Luong choi that duoc kiem tren app dang chay (feature-flow buoc 5), khong o day.
 */

beforeEach(() => {
  vi.resetModules()
  localStorage.clear()
})

describe('Khong co WebGL — NFR-REL-04, FR-32', () => {
  it('hien man bao loi bang chu, khong de canvas den', async () => {
    const { Play } = await import('../../src/views/Play')
    render(<Play />)
    expect(await screen.findByText(S.error.title)).toBeTruthy()
    expect(screen.getByRole('button', { name: new RegExp(S.error.retry, 'i') })).toBeTruthy()
  })

  it('man bao loi giai thich duoc nguyen nhan, khong chi noi "loi"', async () => {
    const { Play } = await import('../../src/views/Play')
    render(<Play />)
    const body = await screen.findByText(new RegExp('WebGL'))
    expect(body.textContent?.length ?? 0).toBeGreaterThan(40)
  })
})

describe('Man hinh chinh — FR-11', () => {
  it('hien ky luc va vi da luu, va ba loi di', async () => {
    const { MenuScreen } = await import('../../src/views/Play/components/MenuScreen')
    render(
      <MenuScreen bestDistanceM={1482} coins={382} onPlay={() => {}} onShop={() => {}} onSettings={() => {}} />,
    )
    expect(screen.getByText(/1 482/)).toBeTruthy()
    expect(screen.getByText('382')).toBeTruthy()
    expect(screen.getByRole('button', { name: new RegExp(S.menu.play) })).toBeTruthy()
    expect(screen.getByRole('button', { name: new RegExp(S.menu.shop) })).toBeTruthy()
    expect(screen.getByRole('button', { name: new RegExp(S.menu.settings) })).toBeTruthy()
  })

  it('bam Choi goi dung mot lan', async () => {
    const { MenuScreen } = await import('../../src/views/Play/components/MenuScreen')
    const onPlay = vi.fn()
    render(
      <MenuScreen bestDistanceM={0} coins={0} onPlay={onPlay} onShop={() => {}} onSettings={() => {}} />,
    )
    await userEvent.click(screen.getByRole('button', { name: new RegExp(S.menu.play) }))
    expect(onPlay).toHaveBeenCalledTimes(1)
  })

  it('NFR-A11Y-06: di het duoc bang ban phim', async () => {
    const { MenuScreen } = await import('../../src/views/Play/components/MenuScreen')
    const onPlay = vi.fn()
    render(
      <MenuScreen bestDistanceM={0} coins={0} onPlay={onPlay} onShop={() => {}} onSettings={() => {}} />,
    )
    await userEvent.tab()
    expect(document.activeElement?.textContent).toContain(S.menu.play)
    await userEvent.keyboard('{Enter}')
    expect(onPlay).toHaveBeenCalled()
    await userEvent.tab()
    expect(document.activeElement?.textContent).toContain(S.menu.shop)
    await userEvent.tab()
    expect(document.activeElement?.textContent).toContain(S.menu.settings)
  })
})

describe('Man ket thuc luot — FR-09, FR-10', () => {
  it('bao ky luc moi khi pha ky luc', async () => {
    const { GameOverScreen } = await import('../../src/views/Play/components/GameOverScreen')
    render(
      <GameOverScreen
        distanceM={1482}
        bestDistanceM={1482}
        coins={42}
        wallet={382}
        isRecord
        onRetry={() => {}}
        onHome={() => {}}
      />,
    )
    expect(screen.getByText(S.gameOver.newRecord)).toBeTruthy()
  })

  it('khi chua pha ky luc thi hien ky luc cu, khong hien nhan ky luc moi', async () => {
    const { GameOverScreen } = await import('../../src/views/Play/components/GameOverScreen')
    render(
      <GameOverScreen
        distanceM={210}
        bestDistanceM={1482}
        coins={4}
        wallet={382}
        isRecord={false}
        onRetry={() => {}}
        onHome={() => {}}
      />,
    )
    expect(screen.queryByText(S.gameOver.newRecord)).toBeNull()
    expect(screen.getByText(new RegExp('1 482'))).toBeTruthy()
  })

  it('Choi lai va Ve man chinh deu bam duoc', async () => {
    const { GameOverScreen } = await import('../../src/views/Play/components/GameOverScreen')
    const onRetry = vi.fn()
    const onHome = vi.fn()
    render(
      <GameOverScreen
        distanceM={10}
        bestDistanceM={10}
        coins={0}
        wallet={0}
        isRecord={false}
        onRetry={onRetry}
        onHome={onHome}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: new RegExp(S.gameOver.retry) }))
    await userEvent.click(screen.getByRole('button', { name: new RegExp(S.gameOver.home) }))
    expect(onRetry).toHaveBeenCalledTimes(1)
    expect(onHome).toHaveBeenCalledTimes(1)
  })
})

describe('HUD — BAT BIEN #7: khong re-render React trong luc choi', () => {
  it('cap nhat quang duong qua ref, khong qua state', async () => {
    const { Hud } = await import('../../src/views/Play/mains/Hud')
    const { createRef } = await import('react')
    const ref = createRef<import('../../src/views/Play/mains/Hud').HudHandle>()

    let renders = 0
    function Probe() {
      renders++
      return <Hud ref={ref} onPause={() => {}} onSkill={() => {}} skillEnabled={false} />
    }
    render(<Probe />)
    const before = renders

    for (let i = 1; i <= 200; i++) ref.current?.setDistance(i)
    ref.current?.setCoins(37)
    ref.current?.setCharge(1)

    await waitFor(() => {
      expect(screen.getByText('200')).toBeTruthy()
    })
    expect(screen.getByText('37')).toBeTruthy()
    // 200 lan cap nhat quang duong ma KHONG mot lan re-render nao
    expect(renders).toBe(before)
  })

  it('thanh nap day thi nut ky nang chuyen sang trang thai san sang', async () => {
    const { Hud } = await import('../../src/views/Play/mains/Hud')
    const { createRef } = await import('react')
    const ref = createRef<import('../../src/views/Play/mains/Hud').HudHandle>()
    const { container } = render(
      <Hud ref={ref} onPause={() => {}} onSkill={() => {}} skillEnabled />,
    )
    expect(container.querySelector('.skill-btn.ready')).toBeNull()
    ref.current?.setCharge(1)
    expect(container.querySelector('.skill-btn.ready')).toBeTruthy()
    expect(screen.getByText(S.hud.skillReady)).toBeTruthy()
  })
})
