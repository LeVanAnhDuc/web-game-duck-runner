# ADR-0005 · Khoá góc nhìn theo chiều dọc, đóng khung canvas trên màn hình rộng

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-31 · NFR-A11Y-06 · US-01

## 1. Bối cảnh

Yêu cầu là mobile và desktop ngang nhau, không cái nào là phụ. Nhưng camera phối
cảnh mặc định của Three.js khoá `fov` theo **chiều dọc**, còn chiều ngang giãn theo
tỉ lệ khung hình. Nếu để nguyên mà chuyển sang cách khoá theo chiều ngang — hoặc để
canvas kéo dãn full-width trên desktop — thì màn hình càng rộng càng nhìn được xa,
và chướng ngại xuất hiện sớm hơn.

Đây là kiểu lệch không ai báo lỗi: game vẫn chạy đúng, chỉ là dễ hơn thật sự trên
màn hình rộng.

## 2. Quyết định

Thời gian từ lúc một chướng ngại hiện ra tới lúc chạm phải là **hằng số trên mọi tỉ
lệ khung hình**. Cụ thể: giữ nguyên cách khoá `fov` theo chiều dọc, và trên màn hình
rộng thì **đóng khung canvas theo tỉ lệ dọc ở giữa màn hình**, phần còn lại là nền
trang trí — không kéo dãn full-width.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Canvas full-width, để `fov` dọc cố định | Màn hình rộng nhìn ra hai bên nhiều hơn nhưng cũng thấy chướng ngại sớm hơn ở rìa; game dễ hơn mà không đo được từ trong code |
| Khoá `fov` theo chiều ngang | Đảo ngược vấn đề: màn hình dọc hẹp lại thành khó bất thường |
| Chấp nhận lệch, coi là khác biệt nền tảng | Mâu thuẫn trực tiếp với yêu cầu "cả hai ngang nhau", và làm điểm cao giữa hai thiết bị không so sánh được |

## 4. Hệ quả

**Được:**
- Độ khó như nhau trên mọi thiết bị, và điều đó kiểm chứng được chứ không phải cảm tính.
- Trên desktop, khung dọc ở giữa còn để lại chỗ cho nền trang trí — một cơ hội thẩm mỹ chứ không chỉ là chỗ trống.

**Mất / phải chấp nhận:**
- Desktop không dùng hết chiều rộng màn hình; với người chưa hiểu lý do thì trông giống lỗi.
- Cần một quyết định thiết kế riêng cho phần nền hai bên, sẽ chốt cùng `MASTER.md`.

**Điều kiện xem lại quyết định này:** nếu sau này có chế độ chơi ngang riêng cho
desktop với bố cục làn khác.
