# RESPONSIVE — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-31
- `../docs/decisions/0005-khoa-goc-nhin-theo-chieu-doc.md`
- `../docs/01-product/journeys.md` US-01 ("xoay ngang máy giữa lượt")
- `../docs/design-system/endless-runner/MASTER.md`
- `../client/src/styles/styles.css` (`.stage`, `.frame`)

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Khung giữ tỉ lệ dọc nên ở 320×568 rộng 319,5 px: chấp nhận lệch ≤ 1 px là "hết bề ngang". Chốt bởi agent (user uỷ quyền). → REQ-RESPONSIVE-02

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- (không có)

## Tech debt liên quan

- (không có)
