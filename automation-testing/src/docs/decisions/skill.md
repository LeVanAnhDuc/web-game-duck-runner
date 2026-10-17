# SKILL — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-14, FR-15 (FR-16…18 hiệu ứng kỹ năng)
- `../docs/01-product/journeys.md` US-03
- `../docs/design-system/endless-runner/MASTER.md` §7.5
- `../client/src/views/Play/mains/Hud/index.tsx`, `GameHost.ts` (`useSkill`), `../client/src/game/Game.ts`, `../client/src/data/catalog.ts` (CHARGE_COINS = 18)
- `../README.md` §Features/§Controls

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Thanh đầy cần 18 xu trong một lượt; không đọc được state nên không lái được nhân vật đi nhặt đủ. REQ-SKILL-05 để manual, đã có unit test `client/tests/game/effects.test.ts` + `client/tests/ui/flow.test.tsx`. Chốt bởi agent (user uỷ quyền). → REQ-SKILL-05
- **Q2** Space khi chưa đầy: MASTER §7.5 nói "bấm khi chưa sẵn sàng: một nhịp rung — không im lặng", US-03 "phải phản hồi rõ", NFR-A11Y-06 "bàn phím không phải đường phụ", README: Space = dùng kỹ năng. Nên Space phải có cùng phản hồi như nút. Chốt bởi agent (user uỷ quyền). → REQ-SKILL-04
- **Q3** Phản hồi "rung" đọc bằng class `nudge` mà HUD gắn vào nút (cách app vẽ nhịp rung). Chốt bởi agent (user uỷ quyền). → REQ-SKILL-03, REQ-SKILL-04

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Hiệu ứng Ủi / Chậm / Bay (FR-16…18) và thời lượng 5,2 s — unit test.

## Tech debt liên quan

- BUG-SKILL-01 (Space im lặng khi chưa đầy) đang mở.
