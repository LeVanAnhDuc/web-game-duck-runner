# ADR-0011 · Nhận bộ quy ước view dùng chung của workspace `web-game`

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** [`docs/code-conventions.md`](../code-conventions.md)

## 1. Bối cảnh

Repo cuối trong workspace nhận bộ quy ước dùng chung, sau mười lần áp thật.

Ba chỗ lệch:

- `src/ui/` là tên cũ của `src/views/`, và nó gom cả `App.tsx` (màn chơi), `GameHost.ts`
  (không phải component), `icons.tsx` (14 icon) và `styles.css` vào một tầng.
- **`ui/screens/Screens.tsx` xuất 6 component trong một file 209 dòng.**
- Không có alias `@/`.

## 2. Quyết định

Theo [`docs/code-conventions.md`](../code-conventions.md):

- `ui/App.tsx` → `views/Play/index.tsx`, hàm đổi tên thành `Play`. Nó giữ canvas, HUD
  và mọi lớp phủ, nên nó **là** màn chơi — không phải tầng routing.
- `Screens.tsx` tách thành 6 thư mục trong `views/Play/components/`; `Shop` và
  `Settings` cũng vào đó.
- `ui/hud/Hud.tsx` → `views/Play/mains/Hud/` (khối cấu trúc của màn).
- `ui/icons.tsx` → `src/components/icons/`; `ui/styles.css` → `src/styles/`.
- Alias `@/` khai ở **ba** chỗ: `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`.
  Chỗ thứ ba là bắt buộc chứ không phải cho đủ: `tests/ui/flow.test.tsx` nạp view bằng
  `await import(...)`, nên thiếu nó là đúng test đó đỏ.

**`GameHost.ts` ở lại trong view, không xuống `src/game/`.** Nó là cầu nối React ↔
engine và nó phụ thuộc kiểu `HudHandle` của `views/Play/mains/Hud`. Đặt nó ở `game/` sẽ
làm tầng nghiệp vụ phụ thuộc tầng view — ngược chiều phụ thuộc. Nó nằm cạnh
`index.tsx` như một module thường, không phải component, nên không có thư mục riêng.

**R-04 (`ghosts/`) ➖.** `views/Play` có đúng một `useEffect`, và nó là vòng đời mount
engine: dựng canvas, gắn `GameHost`, và `setErrorMessage`/`setScreen` khi không có
WebGL. Nó sinh state để render và sở hữu ref — ghost là thứ `return null`.

**R-18 (barrel hook) ➖.** Repo không có `src/hooks/`; không có hook nào để gom.

**Một thay đổi ngoài phạm vi rule, phát sinh từ nó:**
`src/audio/Audio.ts` khai `musicTimer: number | null`. Thêm `@types/node` (cần cho
`node:url` ở cấu hình Vite) làm `setInterval` trả `Timeout` thay vì `number`, nên kiểu
đó thành sai. Đã đổi thành `ReturnType<typeof setInterval>` — nó đúng ở cả hai nền
tảng, và đúng hơn `number` ở cả hai.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Giữ `Screens.tsx` một file | 6 component trong một file thì cây thư mục không nói được gì, và `git blame` của cả 6 dính vào nhau |
| Coi `App` là tầng routing như ở `duck-defense` | Ở defense, `App` chỉ đổi màn hình và không vẽ gì. Ở đây nó giữ canvas, HUD và mọi lớp phủ — nó là màn chơi, và gọi nó là routing sẽ làm `main.tsx` mount một thứ mang tên sai |
| Chuyển `GameHost.ts` xuống `src/game/` | Nó phụ thuộc `HudHandle` của view. Chuyển xuống là làm nghiệp vụ phụ thuộc UI |
| Tránh `@types/node` để không phải sửa `Audio.ts` | Cách tránh duy nhất còn lại là một alias không dùng `node:url`, và trên Windows `new URL(...).pathname` cho `/D:/...` — Vite giải sai. Một dòng kiểu đúng hơn rẻ hơn một lỗi chỉ xuất hiện trên một hệ điều hành |
| Đưa `"node"` vào một `tsconfig.node.json` riêng cho file cấu hình | Là cách idiomatic của Vite, nhưng nó thêm một file cấu hình thứ hai để tránh sửa một dòng. Đổi lại thì `ReturnType<typeof setInterval>` là thứ đúng dù có node types hay không |

## 4. Hệ quả

**Được:**
- Mở `views/Play/` là thấy cả game: view, HUD, 8 lớp phủ, và cầu nối engine.
- `tests/ui/flow.test.tsx` — test hành vi duy nhất của tầng view — vẫn xanh qua đường
  dẫn mới, nên đợt chuyển này có lưới đỡ thật chứ không chỉ có `tsc`.

**Mất / phải chấp nhận:**
- Alias khai ở ba chỗ. Sửa hai quên một thì hoặc `tsc`, hoặc build, hoặc test sẽ hỏng,
  mỗi cái ở một thời điểm khác nhau.
- `views/Play/index.tsx` vẫn là file lớn nhất của repo. Nó giữ máy trạng thái 8 màn và
  vòng đời engine; chia nhỏ nữa cần một quyết định về chỗ đặt máy trạng thái, không
  phải một lần di chuyển file.
