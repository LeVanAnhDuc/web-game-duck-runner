# SETTINGS — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-29, FR-30
- `../docs/02-requirements/nfr.md` NFR-A11Y-04, NFR-A11Y-05
- `../docs/01-product/journeys.md` US-05
- `../client/src/views/Play/components/SettingsScreen`, `../client/src/views/Play/index.tsx` (`patchSettings`, `resetProgress`)

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Xoá tiến độ chỉ xoá tiến độ (kỷ lục, ví, nhân vật); docs không nói về âm thanh — code giữ nguyên? `resetProgress` ghi `DEFAULT_SAVE` nên âm lượng cũng về mặc định. Không ràng buộc điều đó trong test (không có nguồn docs). Chốt bởi agent (user uỷ quyền). → REQ-SETTINGS-04

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Tắt hiệu ứng trang trí thật sự (rung camera, vệt tốc độ) — chỉ thấy trong canvas; ghi chú trên UI là phần quan sát được (NFR-A11Y-05: "nói ra điều đã xảy ra").

## Tech debt liên quan

- (không có)
