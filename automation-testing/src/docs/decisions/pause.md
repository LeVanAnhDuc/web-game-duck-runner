# PAUSE — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-22
- `../docs/01-product/journeys.md` US-03
- `../client/src/views/Play/index.tsx` (`togglePause`, `goHome`), `GameHost.ts` (`pause`, `resume`, `abandon`), `../client/src/core/input.ts` (Esc, P)
- `../README.md` "Pause that stops the simulation clock"

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** VỀ MÀN CHÍNH khi đang tạm dừng: docs không nói xu của lượt bỏ dở đi đâu; code (`abandon`) bỏ lượt không phát `runEnded` nên không ghi gì. Chấp nhận là hành vi mong muốn (bỏ lượt = không tính). Chốt bởi agent (user uỷ quyền). → REQ-PAUSE-05

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Bộ đếm kỹ năng/power-up dừng theo khi tạm dừng (US-03): không đọc được thời gian còn lại của hiệu ứng đang chạy trong lượt e2e — unit test `client/tests/game/effects.test.ts`; REQ-PAUSE-04 chứng minh gián tiếp rằng cả mô phỏng dừng.

## Tech debt liên quan

- (không có)
