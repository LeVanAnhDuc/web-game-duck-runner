# RUN — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-01, FR-06, FR-07, FR-08, FR-12
- `../docs/01-product/journeys.md` US-01
- `../docs/03-design/invariants.md` §2 (bước cố định), §7 (HUD ghi thẳng DOM)
- `../client/src/views/Play/index.tsx`, `GameHost.ts`, `mains/Hud/index.tsx`, `../client/src/game/Game.ts`, `constants.ts`
- `../README.md` §Features/§Controls

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Bản production không có `window.__duckRunner`, cảnh là canvas: kiểm luật chơi qua đâu? → chỉ qua DOM (HUD, màn kết thúc) của một lượt có seed cố định chạy trên đồng hồ giả. Chi tiết tốc độ/chướng ngại/power-up đã có unit test ở `client/tests/game/`, e2e chỉ chứng minh luật tới được người chơi. Chốt bởi agent (user uỷ quyền). → REQ-RUN-02…06
- **Q2** Seed lấy từ `Math.random()` lúc bấm CHƠI → test thay `Math.random` bằng bộ sinh có seed, bật `saveData` để ảnh CC0 không giành `Math.random` với seed, và vẽ một khung mỗi 64 ms (luật vẫn bước 60 Hz, tối đa 5 bước/khung — invariants §2) để lượt chạy nổi trên WebGL phần mềm của CI. Chốt bởi agent (user uỷ quyền). → REQ-RUN-04
- **Q3** "Tốc độ tăng dần" đo bằng quãng đường của hai cửa sổ 2,5 giây (đầu lượt và 6–8,5 giây), vì tốc độ không hiện trên UI. Chốt bởi agent (user uỷ quyền). → REQ-RUN-06

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Tốc độ trần 26 m/s, khoảng cách chướng ngại theo phản xạ, pattern có đường đi — unit test `client/tests/game/rules.test.ts` (cần chạy hàng phút, e2e không đáng).
- Power-up nam châm/khiên/tua nhanh (FR-19…21): xuất hiện sau ~300 m — phủ riêng ở module `power-up` (2026-10-18) bằng kế hoạch phím học trước (`decisions/power-up.md` Q1).

## Tech debt liên quan

- Mốc thời gian của seed (RUNS trong `src/data/test-data.ts`) gắn với số liệu cân bằng hiện tại; đổi cân bằng thì học lại mốc.
