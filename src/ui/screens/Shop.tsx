import { CHARACTERS, type CharacterDef } from '../../data/catalog'
import type { SaveData } from '../../data/save'
import { cardState, shortfall } from '../../data/shop'
import { S, fmt } from '../../data/strings'
import { SILHOUETTES } from '../../render/Shapes'
import { IconCoin } from '../icons'
import { ScreenHeader } from './Screens'

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
  const headZone = 0.18
  const torsoH = H * s.torso
  const legH = H * (1 - headZone) - torsoH
  const cx = 50
  // Hinh bong phai to du de PHAN BIET duoc nhan vat — do la ca ly do the ton tai.
  // Scale 46 cho ra vai rong 19px tren viewBox 100, hai nhan vat trong nhu mot.
  const scale = 92
  const legW = s.hip * scale * 0.38
  const y = (v: number) => H - v

  const headH = s.headR * scale * 1.8
  const headW = s.headR * scale * 1.7
  /**
   * Phu kien tinh theo DINH DAU, khong theo scale.
   * Tinh theo scale thi tai va mu bi day ra ngoai viewBox va bien mat — dung luc
   * chung la thu duy nhat phan biet hai nhan vat co cung ti le nguoi.
   */
  const headBottom = legH + torsoH
  const headTop = headBottom + headH

  return (
    <svg viewBox="-6 -14 112 124" width="100%" height="100%" aria-hidden focusable="false">
      <g fill="var(--world-ink)" stroke="var(--sky-low)" strokeWidth="1.6">
        <rect x={cx - s.hip * scale * 0.34 - legW / 2} y={y(legH)} width={legW} height={legH} rx="1.5" />
        <rect x={cx + s.hip * scale * 0.34 - legW / 2} y={y(legH)} width={legW} height={legH} rx="1.5" />
        <rect
          x={cx - (s.shoulder * scale) / 2}
          y={y(legH + torsoH)}
          width={s.shoulder * scale}
          height={torsoH}
          rx="2"
        />
        <rect x={cx - headW / 2} y={y(headTop)} width={headW} height={headH} rx="2" />

        {s.crown === 'cap' && (
          <rect x={cx - headW * 0.78} y={y(headTop + 5)} width={headW * 1.56} height="5" rx="2" />
        )}
        {s.crown === 'ears' && (
          <>
            <rect x={cx - headW * 0.42} y={y(headTop + 11)} width="5" height="12" rx="2.5" />
            <rect x={cx + headW * 0.42 - 5} y={y(headTop + 11)} width="5" height="12" rx="2.5" />
          </>
        )}
        {s.crown === 'tuft' && (
          <rect x={cx - 3} y={y(headTop + 10)} width="6" height="11" rx="3" />
        )}
        {s.tail && (
          <rect
            x={cx + (s.shoulder * scale) / 2 - 2}
            y={y(legH + torsoH * 0.5)}
            width="16"
            height="6"
            rx="3"
          />
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
