# SHOP — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-23…FR-26
- `../docs/01-product/journeys.md` US-04
- `../docs/specs/character-shop/design.md` §3–§4
- `../docs/design-system/endless-runner/MASTER.md` §7.1, §7.6
- `../client/src/views/Play/components/ShopScreen`, `../client/src/data/shop.ts`, `catalog.ts`, `save.ts`

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Save sửa tay chọn một id lạ (`ghost`): design §4 nói nhân vật ngoài danh mục "bị lọc bỏ"; code `sanitize()` giữ chuỗi lạ nên `selectedCharacter` vẫn là `ghost`, game chơi bằng Lữ khách (`characterById` rơi về mặc định) nhưng cửa hàng không có thẻ nào ĐANG DÙNG. Theo thứ tự thẩm quyền docs > code → bug. Chốt bởi agent (user uỷ quyền). → REQ-SHOP-07

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Kỹ năng mới áp dụng từ lượt kế tiếp, hình bóng 3D đổi ngay: không quan sát được ngoài canvas.

## Tech debt liên quan

- BUG-SHOP-01 đang mở.
