# ADR-0002 · Tách mô phỏng khỏi hiển thị: `game/` không được import `three`

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-01 · FR-05 · FR-06 · NFR-PERF-06

## 1. Bối cảnh

Luật chơi của một runner là thứ dễ hồi quy âm thầm nhất: đổi một hằng số spawn thì
sáu tuần sau mới có người nhận ra game không qua nổi phút thứ hai. Cần test tự động
cho luật chơi.

Nếu luật chơi nằm lẫn với `Object3D`, `Mesh`, `Vector3` thì mọi test đều cần WebGL,
tức là cần trình duyệt headless, tức là chậm và giòn — và trên thực tế sẽ không ai
viết chúng.

## 2. Quyết định

Thư mục `game/` chứa toàn bộ luật chơi và **không được import `three`**, không chạm
DOM, không đọc `Date.now()`. Nó chỉ làm việc trên số. Thư mục `render/` đọc trạng
thái đó rồi dựng cảnh; chiều phụ thuộc chỉ đi một hướng.

Ràng buộc này được ép bằng một quy tắc lint (`no-restricted-imports` cho `three` và
`window` trong `game/**`), không phải bằng ý chí.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Để logic bám thẳng vào `Object3D` như hầu hết tutorial | Nhanh lúc đầu, nhưng khoá luôn khả năng test và khoá luôn khả năng đổi engine |
| Tách bằng quy ước, không có lint chặn | Quy ước không được ép sẽ bị phá ở lần vội đầu tiên, và không ai biết cho tới lúc test bắt đầu cần trình duyệt |
| Dùng ECS đầy đủ | Đúng hướng nhưng thừa cho quy mô này; tốn nhiều hạ tầng trước khi có gì chơi được |

## 4. Hệ quả

**Được:**
- Luật chơi test được bằng Vitest chạy trong Node — nhanh, không giòn.
- Mở ra test tất định: cùng seed + cùng chuỗi input → cùng kết quả. Đây là test bắt được nhiều hồi quy nhất.
- Mở ra test duyệt toàn bộ catalog pattern để chứng minh mỗi pattern đều có đường đi qua.

**Mất / phải chấp nhận:**
- Trạng thái bị viết hai lần: một bản số trong `game/`, một bản `Object3D` trong `render/`. Phải có bước đồng bộ mỗi frame.
- Thêm một lớp gián tiếp mà người quen viết game kiểu tutorial sẽ thấy thừa lúc đầu.
- Hiệu ứng thuần trang trí vẫn nằm ở `render/`, nên không có test tự động — kiểm bằng mắt.

**Điều kiện xem lại quyết định này:** nếu chi phí đồng bộ mỗi frame đo được là đáng
kể trong tổng thời gian frame.
