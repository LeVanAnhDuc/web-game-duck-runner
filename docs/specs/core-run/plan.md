# M1 · Vòng chơi — kế hoạch

Ô đánh dấu là phòng thủ khi ngữ cảnh bị nén: đọc lại file này là biết đang ở việc mấy
trên mấy. Đánh dấu **ngay khi xong**, không để cuối.

## A. Khung dự án

- [x] A1 · `package.json`, Vite + TypeScript + React, script `dev/build/test/lint`
- [x] A2 · `tsconfig.json` strict, `vitest.config.ts` môi trường node + jsdom
- [x] A3 · ESLint chặn `import 'three'` và `window`/`document` trong `src/game/**` và
      `src/data/**` — đây là thứ ép `invariants.md` §4, không phải quy ước
- [x] A4 · `index.html` + `src/ui/styles.css` với token từ `MASTER.md`
- [x] A5 · Test đầu tiên chạy xanh (`vitest run`)

## B. Lõi mô phỏng — không có Three.js ở đây

- [x] B1 · `core/rng.ts` — RNG có seed (mulberry32). Test: cùng seed → cùng dãy
- [x] B2 · `core/clock.ts` — đồng hồ mô phỏng, `pause()` dừng nó. Test: pause dừng đếm
- [x] B3 · `core/loop.ts` — accumulator bước cố định + trần `MAX_STEPS_PER_FRAME`.
      Test: 144Hz và 60Hz cho cùng số bước sau cùng một quãng thời gian
- [x] B4 · `core/events.ts` — kênh sự kiện rời rạc
- [x] B5 · `game/constants.ts` — mọi hằng số luật chơi, một chỗ duy nhất

## C. Luật chơi

- [x] C1 · `game/Player.ts` — làn, nhảy, trượt. Test: **vị trí thật khi đang đổi làn**
      nằm giữa hai làn, không nhảy cóc sang làn đích
- [x] C2 · `game/Collision.ts` — AABB thuần số. Test: không xuyên vật thể khi đổi làn
- [x] C3 · `data/patterns.ts` — catalog cụm chướng ngại, 3 tier
- [x] C4 · `game/PatternSolver.ts` — BFS chứng minh giải được. Test: **duyệt toàn bộ
      catalog**, cụm nào không giải được thì đỏ
- [x] C5 · `game/Spawner.ts` — khoảng cách theo `REACTION_MIN_MS × tốc độ`. Test: đúng
      ở mọi mức tốc độ từ đầu tới trần
- [x] C6 · `game/Track.ts` — pool đoạn + pool chướng ngại. Test: số object sống là
      hằng số sau 10 000 bước
- [x] C7 · `game/Scoring.ts` — quãng đường
- [x] C8 · `game/Game.ts` — máy trạng thái một lượt. Test: **tất định** — cùng seed +
      cùng chuỗi input → cùng quãng đường cuối

## D. Lưu trữ

- [x] D1 · `data/save.ts` — một key, schema có `version`, validate + migrate
- [x] D2 · Test: JSON hỏng · thiếu field · version cũ · `localStorage` ném lỗi → tất cả
      về mặc định, không crash (`NFR-DATA-04`)

## E. Hiển thị

- [x] E1 · `render/Scene.ts` — camera khoá `fov` dọc, trời gradient, quầng mặt trời
- [x] E2 · `render/Shapes.ts` — nhân vật và chướng ngại bằng hình khối (`ADR-0007`)
- [x] E3 · Viền sáng nhân vật bằng outline BackSide (`MASTER §1`)
- [x] E4 · `render/Renderer.ts` — đồng bộ trạng thái mô phỏng sang cảnh mỗi frame,
      dùng `InstancedMesh` cho chướng ngại
- [x] E5 · Đóng khung 9:16 ở giữa trên khổ rộng (`ADR-0005`)
- [x] E6 · `prefers-reduced-motion` tắt vệt tốc độ và rung camera

## F. Nhập liệu

- [x] F1 · `core/input.ts` — bàn phím + vuốt gộp về một `InputIntent`
- [x] F2 · Vùng loại trừ cử chỉ cho nút kỹ năng (chuẩn bị cho M2)
- [x] F3 · `touch-action: none`, chặn cuộn và kéo-để-tải-lại

## G. Giao diện

- [x] G1 · `data/strings.ts` — mọi chuỗi hiển thị (`NFR-I18N-01`)
- [x] G2 · Màn chính (`FR-11`)
- [x] G3 · HUD (`FR-08`) — chừa chỗ thanh nạp và nút kỹ năng ở trạng thái rỗng
- [x] G4 · Màn kết thúc lượt + chơi lại (`FR-09`, `FR-10`)
- [x] G5 · Màn tải và màn thiếu WebGL (`FR-32`, `NFR-REL-03`, `NFR-REL-04`)
- [x] G6 · HUD **không re-render React** trong lúc chơi (`invariants.md` §7)
- [x] G7 · Test luồng: chính → chơi → kết thúc → chơi lại, đi được bằng bàn phím

## H. Chốt

- [x] H1 · `vitest run` xanh, `tsc --noEmit` sạch, `eslint` sạch
- [x] H2 · Chạy app thật, chụp 375 / 768 / 1440 (1024 để lại cho M4 cùng lượt đo)
- [x] H3 · Cập nhật `scope.md` (FR-01…FR-11, FR-31, FR-32 → xong), `README.md`
      §Features, `backlog.md`
