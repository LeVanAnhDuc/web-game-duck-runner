# ADR-0004 · Nhân vật khác nhau ở kỹ năng chủ động, giống nhau ở chỉ số cơ bản

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-14 · FR-15 · FR-16 · FR-17 · FR-18 · FR-23 · FR-25

## 1. Bối cảnh

Cửa hàng cần có sức nặng: nếu nhân vật chỉ đổi ngoại hình thì việc tích xu không dẫn
tới thay đổi nào trong cách chơi. Nhưng nếu nhân vật đổi chỉ số cơ bản — tốc độ, lực
nhảy, hitbox — thì độ khó phải cân lại cho từng nhân vật, và điểm cao mất ý nghĩa so
sánh với chính mình.

Dự án này không có ngân sách cho một vòng cân bằng số liệu.

## 2. Quyết định

Mỗi nhân vật mang **một kỹ năng chủ động** riêng, nạp bằng xu nhặt trong lượt và do
người chơi bấm. Chỉ số cơ bản — tốc độ chạy, lực nhảy, kích thước hitbox — **giống
hệt nhau** giữa mọi nhân vật.

Ba kỹ năng khởi đầu giải ba vấn đề khác nhau, không mạnh hơn nhau: **Ủi** (húc vỡ
chướng ngại — cứu lúc bị dồn), **Chậm** (giảm tốc độ thế giới — cứu lúc vượt phản
xạ), **Bay** (bay qua và hút xu — đổi quãng đường lấy xu). Chi phí nạp và thời lượng
bằng nhau.

Kỹ năng định nghĩa **bằng dữ liệu** trong `data/catalog` — kiểu và tham số — không
phải một class cho mỗi nhân vật. Thêm nhân vật là thêm một dòng dữ liệu.

Xu nhặt trong lượt vừa nạp thanh vừa vào ví; dùng kỹ năng chỉ reset thanh, không trừ
ví.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Nhân vật chỉ đổi ngoại hình (quyết định ban đầu) | Cửa hàng không có sức nặng, và xu nhặt trong lượt không có hệ quả gì ngay lúc đó |
| Nhân vật đổi chỉ số cơ bản | Phải cân bằng độ khó cho từng nhân vật; điểm cao không so sánh được nữa |
| Kỹ năng tự động kích hoạt khi nạp đầy | Bỏ mất phần duy nhất mà người chơi ra quyết định. Nếu thời điểm không quan trọng thì đó là power-up, không phải kỹ năng |
| Dùng kỹ năng trừ xu trong ví | Có đánh đổi thật, nhưng khiến người chơi ngại dùng đúng cơ chế vui nhất trong game |

## 4. Hệ quả

**Được:**
- Cửa hàng đổi cách chơi mà không đổi độ khó.
- Chỉ phải cân độ khó một lần.
- Nhặt xu trở thành quyết định trong lúc chơi, không chỉ là tiền tệ meta.

**Mất / phải chấp nhận:**
- Nhân vật không còn "cảm giác" khác nhau khi chạy — chỉ khác lúc bấm kỹ năng.
- Vẫn sẽ có một kỹ năng mạnh hơn trong thực tế; chấp nhận, vì đây là game một người chơi với điểm cao cục bộ.
- Ba kỹ năng phải cài đặt và kiểm thử riêng — đây là phần lớn công việc của mốc M2.

**Điều kiện xem lại quyết định này:** nếu sau này có bảng xếp hạng chung (hiện là
Non-Goal), thì việc kỹ năng ảnh hưởng điểm số sẽ phải xem lại từ đầu.
