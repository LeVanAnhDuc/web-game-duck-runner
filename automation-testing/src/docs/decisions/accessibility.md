# ACCESSIBILITY — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/nfr.md` NFR-A11Y-02, -03, -04, -05, -06
- `../docs/02-requirements/scope.md` FR-30
- `../docs/design-system/endless-runner/MASTER.md` (vòng focus, 44 px)
- `../client/src/core/input.ts` (Space bị `preventDefault`)
- `../README.md` §Features/§Controls

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Space trên nút đang focus: NFR-A11Y-02 đòi "thao tác được bằng bàn phím"; Enter làm được, nhưng Space là cách kích hoạt button chuẩn và game nuốt nó ở mọi màn (input.ts gọi `preventDefault` cho Space ở mọi nơi trừ INPUT/TEXTAREA). Người dùng bàn phím quen Space sẽ thấy nút "chết" → bug. Chốt bởi agent (user uỷ quyền). → REQ-ACCESSIBILITY-03

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Tương phản HUD trên cảnh 3D (NFR-A11Y-01, -07): đo bằng unit test `client/tests/render/contrast.test.ts`.

## Tech debt liên quan

- BUG-ACCESSIBILITY-01 đang mở.
