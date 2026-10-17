# SHOP — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-SHOP-01](#bug-shop-01) | Thấp | TC-SHOP-008 | Save chọn nhân vật ngoài danh mục: cửa hàng không có thẻ ĐANG DÙNG |

### BUG-SHOP-01

- **TC:** TC-SHOP-008 · **Requirement:** REQ-SHOP-07
- **Tìm thấy:** 2026-10-18, lúc dựng bộ hồi quy (bản build production của `main` + PR #9)
- **Bước tái hiện:** Đặt save `ownedCharacters: ["runner", "ghost"]`, `selectedCharacter: "ghost"` → mở cửa hàng.
- **Mong đợi:** Nhân vật ngoài danh mục bị lọc bỏ (`docs/specs/character-shop/design.md` §4), Lữ khách ĐANG DÙNG.
- **Thực tế:** `sanitize()` giữ chuỗi lạ nên `ghost` vẫn là nhân vật đang dùng: không thẻ nào ghi ĐANG DÙNG, Lữ khách hiện CHỌN, trong khi lượt chơi lại dùng Lữ khách (`characterById` rơi về mặc định).

## Đã sửa

_(chưa có)_
