# PERSISTENCE — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/nfr.md` NFR-DATA-04
- `../docs/03-design/invariants.md` §8
- `../docs/01-product/journeys.md` US-02 ("dữ liệu lưu từ phiên bản cũ")
- `../client/src/data/save.ts`

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** musicVolume 7 kẹp về 1 (hiện 100), sfxVolume null về mặc định 0.8, muted "yes" về false — theo `sanitize()` và NFR-DATA-04 "hỏng thì về mặc định". Chốt bởi agent (user uỷ quyền). → REQ-PERSISTENCE-03

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Hết dung lượng localStorage giữa chừng: không tái hiện ổn định.

## Tech debt liên quan

- (không có)
