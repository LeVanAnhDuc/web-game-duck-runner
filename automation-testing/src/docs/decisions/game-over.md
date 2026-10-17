# GAMEOVER — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-09, FR-10, FR-13
- `../docs/01-product/journeys.md` US-01, US-02
- `../docs/03-design/invariants.md` §11 (xu vào ví cuối lượt)
- `../client/src/views/Play/index.tsx` (`handleRunEnd`), `components/GameOverScreen`

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Lượt đầu (kỷ lục 0) luôn là kỷ lục mới vì quãng đường > 0 — dùng làm case KỶ LỤC MỚI. Chốt bởi agent (user uỷ quyền). → REQ-GAMEOVER-02
- **Q2** "Hai lượt chồng nhau" quan sát bằng nhịp quãng đường: 2 s sau CHƠI LẠI (bấm đúp) phải bằng 2 s đầu của lượt trước ±1 m. Chốt bởi agent (user uỷ quyền). → REQ-GAMEOVER-05

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Đóng tab đúng lúc đang ghi (US-02): không tái hiện tất định được trong trình duyệt.

## Tech debt liên quan

- (không có)
