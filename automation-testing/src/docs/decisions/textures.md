# TEXTURES — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-39, FR-40
- `../docs/02-requirements/nfr.md` NFR-PERF-10
- `../docs/decisions/0010-anh-cc0-that-tai-sau-frame-dau.md`
- `../client/src/render/TextureStream.ts`

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** "Sau frame đầu" kiểm bằng cách giữ request ảnh lại: CHƠI phải bấm được trong lúc ảnh chưa về. Chốt bởi agent (user uỷ quyền). → REQ-TEXTURES-01

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Ảnh xa trong cảnh 3D (texture tán lá) — chỉ thấy trong canvas.

## Tech debt liên quan

- (không có)
