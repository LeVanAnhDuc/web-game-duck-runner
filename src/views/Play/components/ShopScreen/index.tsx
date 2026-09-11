import { CHARACTERS, type CharacterDef } from '@/data/catalog'
import type { SaveData } from '@/data/save'
import { cardState, shortfall } from '@/data/shop'
import { S, fmt } from '@/data/strings'
import { SILHOUETTES } from '@/render/Shapes'
import { IconCoin } from '@/components/icons'
import { ScreenHeader } from '../ScreenHeader'

/**
 * Hình bóng của nhân vật, vẽ bằng SVG.
 *
 * Cùng tham số `SILHOUETTES` mà `render/Shapes.ts` dùng để dựng khối 3D, nên thẻ
 * trong cửa hàng và nhân vật trên đường **không thể lệch nhau** — thêm một nhân vật
 * là thêm một dòng dữ liệu, và cả hai chỗ đổi theo.
 */
function Silhouette({ id }: { id: string }) {
  const s = SILHOUETTES[id] ?? SILHOUETTES.runner!
  const H = 100
  const HEAD_ZONE = 0.24
  const torsoH = H * s.torso
  const legH = H * (1 - HEAD_ZONE) - torsoH
  const cx = 46
  const scale = 92
  const legW = s.hip * scale * 0.34
  const y = (v: number) => H - v

  const headH = s.headR * scale * 1.8
  const headW = s.headR * scale * 1.7
  const bodyW = s.shoulder * scale
  const headBottom = legH + torsoH
  const headTop = headBottom + headH
  /**
   * Mo huong sang PHAI, khong huong ve nguoi xem.
   *
   * The trong cua hang la hinh chieu phang. Mot cai mo chi ve phia truoc se bi
   * chinh cai dau che mat, va con vit se doc ra nhu mot hinh nguoi — dung cai
   * mau thuan ma ten "Duck Runner" tao ra.
   */
  const beakLen = s.headR * scale * s.beak * 0.5
  const beakH = s.headR * scale * 0.5

  return (
    <svg viewBox="-8 -14 116 124" width="100%" height="100%" aria-hidden focusable="false">
      <g fill="var(--world-canopy)" stroke="var(--player-rim)" strokeWidth="1.6">
        <rect x={cx - s.hip * scale * 0.3 - legW / 2} y={y(legH)} width={legW} height={legH} rx="1.5" />
        <rect x={cx + s.hip * scale * 0.3 - legW / 2} y={y(legH)} width={legW} height={legH} rx="1.5" />

        {/* Than vit: rong va bo goc manh — day la net doc ra "vit" ro nhat */}
        <rect
          x={cx - bodyW / 2}
          y={y(legH + torsoH)}
          width={bodyW}
          height={torsoH}
          rx={Math.min(bodyW, torsoH) * 0.42}
        />

        {s.tail && (
          <rect
            x={cx - bodyW / 2 - 13}
            y={y(legH + torsoH * 0.78)}
            width="16"
            height={torsoH * 0.34}
            rx="4"
            transform={`rotate(-18 ${cx - bodyW / 2 - 5} ${y(legH + torsoH * 0.62)})`}
          />
        )}

        <rect x={cx - headW / 2} y={y(headTop)} width={headW} height={headH} rx={headW * 0.34} />

        <rect
          x={cx + headW / 2 - 2}
          y={y(headBottom + headH * 0.62)}
          width={beakLen}
          height={beakH}
          rx={beakH * 0.35}
        />

        {s.crown === 'cap' && (
          <rect x={cx - headW * 0.72} y={y(headTop + 5)} width={headW * 1.44} height="5" rx="2" />
        )}
        {s.crown === 'crest' && (
          <>
            <rect x={cx - headW * 0.4} y={y(headTop + 11)} width="5" height="12" rx="2.5" />
            <rect x={cx + headW * 0.4 - 5} y={y(headTop + 11)} width="5" height="12" rx="2.5" />
          </>
        )}
        {s.crown === 'tuft' && (
          <rect x={cx - 3} y={y(headTop + 10)} width="6" height="11" rx="3" />
        )}
      </g>
    </svg>
  )
}

function Card({
  character, save, onBuy, onEquip,
}: {
  character: CharacterDef
  save: SaveData
  onBuy: (id: string) => void
  onEquip: (id: string) => void
}) {
  const state = cardState(save, character.id)
  const missing = shortfall(save, character.id)

  return (
    <div className={`card${state === 'equipped' ? ' selected' : ''}`}>
      <div className="card-figure">
        <Silhouette id={character.id} />
      </div>
      <span className="card-name">{character.name}</span>
      <span className="card-skill">
        {S.shop.skillLabel}: {character.skill.name}
      </span>
      <p className="card-desc">{character.skill.blurb}</p>

      {state === 'equipped' && (
        <span className="lbl" style={{ color: 'var(--world-skill)', fontSize: 14 }}>
          {S.shop.equipped}
        </span>
      )}

      {state === 'owned' && (
        <button className="btn btn-ghost" onClick={() => onEquip(character.id)}>
          {S.shop.equip}
        </button>
      )}

      {state === 'buyable' && (
        <>
          <span className="card-price" style={{ color: 'var(--gold)' }}>
            <IconCoin size={16} />
            {fmt(character.price)}
          </span>
          <button className="btn btn-primary" onClick={() => onBuy(character.id)}>
            {S.shop.buy}
          </button>
        </>
      )}

      {state === 'tooExpensive' && (
        <>
          <span className="card-price" style={{ color: 'var(--text-muted)' }}>
            <IconCoin size={16} />
            {fmt(character.price)}
          </span>
          {/* MASTER §7.1: trạng thái vô hiệu PHẢI kèm chữ giải thích, không chỉ làm mờ */}
          <button className="btn btn-primary" disabled>
            {S.shop.buy}
          </button>
          <span className="lbl" style={{ fontSize: 14, letterSpacing: '.04em' }}>
            {S.shop.short(missing)}
          </span>
        </>
      )}
    </div>
  )
}

export function ShopScreen({
  save, onBuy, onEquip, onBack,
}: {
  save: SaveData
  onBuy: (id: string) => void
  onEquip: (id: string) => void
  onBack: () => void
}) {
  return (
    <div className="screen screen-solid">
      <ScreenHeader title={S.shop.title} onBack={onBack} />

      <div
        className="menu-stat"
        style={{ color: 'var(--gold)', marginBottom: 'var(--space-md)', fontSize: 18 }}
      >
        <IconCoin />
        <span className="mono">{fmt(save.coins)}</span>
      </div>

      <div className="shop-grid">
        {CHARACTERS.map((c) => (
          <Card key={c.id} character={c} save={save} onBuy={onBuy} onEquip={onEquip} />
        ))}
      </div>
    </div>
  )
}
