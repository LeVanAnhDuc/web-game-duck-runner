# ACCESSIBILITY — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-ACCESSIBILITY-01](#bug-accessibility-01) | Trung bình | TC-ACCESSIBILITY-003 | Space không kích hoạt nút đang có focus ở mọi màn |

### BUG-ACCESSIBILITY-01

- **TC:** TC-ACCESSIBILITY-003 · **Requirement:** REQ-ACCESSIBILITY-03
- **Tìm thấy:** 2026-10-18, lúc dựng bộ hồi quy (bản build production của `main` + PR #9)
- **Bước tái hiện:** Màn chính → Tab tới CỬA HÀNG → bấm Space (tương tự MUA, Quay lại, CHƠI…).
- **Mong đợi:** Nút được bấm như khi Enter (hành vi gốc của `<button>`), NFR-A11Y-02.
- **Thực tế:** Không có gì xảy ra: `InputController.onKeyDown` nghe `keydown` trên window ở mọi màn và gọi `preventDefault()` cho Space (chỉ bỏ qua INPUT/TEXTAREA), nên trình duyệt không bao giờ kích hoạt button.

## Đã sửa

_(chưa có)_
