# CONTROLS — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-02, FR-03, FR-04
- `../docs/02-requirements/nfr.md` NFR-A11Y-06
- `../docs/design-system/endless-runner/MASTER.md` §7.5 (vùng loại trừ cử chỉ)
- `../client/src/core/input.ts`
- `../README.md` §Features/§Controls

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Hành động trong canvas không đọc được qua DOM → chứng minh bằng kết quả lượt: cùng seed, có input ở đúng thời điểm thì kết quả khác chạy thẳng (lane ở 1 s seed 1, nhảy 5,9 s seed 1, trượt 7,25 s seed 6), và phím chữ / cử chỉ phải cho **đúng cùng** kết quả với phím mũi tên. Chốt bởi agent (user uỷ quyền). → REQ-CONTROLS-01…06
- **Q2** Cử chỉ phát bằng sự kiện chạm thật qua CDP (`Input.dispatchTouchEvent`) trên viewport có `hasTouch`, không giả bằng chuột. Chốt bởi agent (user uỷ quyền). → REQ-CONTROLS-04…07

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Đổi làn khi đang ở làn biên (không ra khỏi đường): không quan sát được qua DOM, unit test `client/tests/game/rules.test.ts`.

## Tech debt liên quan

- (không có)
