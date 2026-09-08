# Danh mục chức năng

> **Trả lời:** Hệ thống có những chức năng nào, mỗi cái đang ở trạng thái gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** brainstorm ra chức năng mới (cấp FR mới) · một FR chuyển trạng thái

<!-- CÁCH ĐIỀN
Chỉ LIỆT KÊ. Một dòng một chức năng, tên ngắn. Cách làm thuộc tài liệu thiết kế
của feature, không thuộc đây.

ID cấp tăng dần, không tái dùng, không xoá. Bỏ một chức năng thì đổi trạng thái
thành (bỏ) và giữ số — vì commit và test cũ vẫn tham chiếu ID đó.

Trạng thái: chưa · đang · xong · (bỏ)

KHÔNG chứa: cách hiện thực, ngưỡng phi chức năng (-> nfr.md), lý do chọn giải pháp
(-> decisions/).
-->

Cột **Mốc** chia công việc thành bốn giai đoạn, mỗi giai đoạn một thư mục
`docs/specs/`. Mỗi mốc kết thúc bằng một thứ chơi được.

| Mốc | Thư mục spec | Kết thúc khi |
| --- | --- | --- |
| M1 | `specs/core-run/` | chạy được một lượt từ đầu đến chết và chơi lại được |
| M2 | `specs/coins-and-skills/` | xu, thanh nạp, kỹ năng, power-up, tạm dừng |
| M3 | `specs/character-shop/` | mua và đổi nhân vật |
| M4 | `specs/polish-and-audio/` | âm thanh, cài đặt, đo hiệu năng, deploy |

## Vòng chơi

| ID | Chức năng | Thuộc luồng | Mốc | Trạng thái |
| --- | --- | --- | --- | --- |
| FR-01 | Chạy tự động trên 3 làn, tốc độ tăng dần có trần | US-01 | M1 | xong |
| FR-02 | Đổi làn trái/phải (vuốt ngang · phím mũi tên) | US-01 | M1 | xong |
| FR-03 | Nhảy qua chướng ngại thấp (vuốt lên · phím lên) | US-01 | M1 | xong |
| FR-04 | Trượt dưới chướng ngại cao (vuốt xuống · phím xuống) | US-01 | M1 | xong |
| FR-05 | Sinh chướng ngại theo pattern có bảo đảm tồn tại đường đi | US-01 | M1 | xong |
| FR-06 | Va chạm chướng ngại kết thúc lượt | US-01 | M1 | xong |
| FR-07 | Tính điểm theo quãng đường đã chạy | US-01 · US-02 | M1 | xong |

## Màn hình và lưu trữ

| ID | Chức năng | Thuộc luồng | Mốc | Trạng thái |
| --- | --- | --- | --- | --- |
| FR-08 | HUD lúc chơi: quãng đường, ví xu, thanh nạp, nút tạm dừng | US-01 | M1 | xong |
| FR-09 | Màn kết thúc lượt kèm nút chơi lại | US-01 · US-02 | M1 | xong |
| FR-10 | Lưu điểm cao trên máy và báo khi phá kỷ lục | US-02 | M1 | xong |
| FR-11 | Màn hình chính | US-01 | M1 | xong |
| FR-32 | Trạng thái tải tài nguyên và thông báo khi thiếu WebGL | US-01 | M1 | xong |

## Xu, kỹ năng, power-up

| ID | Chức năng | Thuộc luồng | Mốc | Trạng thái |
| --- | --- | --- | --- | --- |
| FR-12 | Nhặt xu rơi trên đường | US-03 | M1 | xong |
| FR-13 | Ví xu tích luỹ qua các lượt, cộng vào cuối lượt | US-04 | M2 | chưa |
| FR-14 | Thanh nạp kỹ năng, đầy dần theo xu nhặt trong lượt | US-03 | M2 | chưa |
| FR-15 | Kích hoạt kỹ năng (nút chạm · phím Space) | US-03 | M2 | chưa |
| FR-16 | Kỹ năng **Ủi** — húc vỡ chướng ngại trong thời gian giới hạn | US-03 | M2 | chưa |
| FR-17 | Kỹ năng **Chậm** — giảm tốc độ thế giới trong thời gian giới hạn | US-03 | M2 | chưa |
| FR-18 | Kỹ năng **Bay** — bay qua chướng ngại và tự hút xu | US-03 | M2 | chưa |
| FR-19 | Power-up nam châm — hút xu trong bán kính | US-01 | M2 | chưa |
| FR-20 | Power-up khiên — bỏ qua một lần va chạm | US-01 | M2 | chưa |
| FR-21 | Power-up tua nhanh — bất tử và tăng tốc có hạn giờ | US-01 | M2 | chưa |
| FR-22 | Tạm dừng và tiếp tục | US-03 | M2 | chưa |

## Cửa hàng và nhân vật

| ID | Chức năng | Thuộc luồng | Mốc | Trạng thái |
| --- | --- | --- | --- | --- |
| FR-23 | Danh mục nhân vật kèm giá và kỹ năng đi kèm | US-04 | M3 | chưa |
| FR-24 | Mua nhân vật bằng xu trong ví | US-04 | M3 | chưa |
| FR-25 | Chọn nhân vật đang dùng | US-04 | M3 | chưa |
| FR-26 | Màn cửa hàng | US-04 | M3 | chưa |

## Âm thanh, hoàn thiện, phát hành

| ID | Chức năng | Thuộc luồng | Mốc | Trạng thái |
| --- | --- | --- | --- | --- |
| FR-27 | Hiệu ứng âm thanh cho nhảy, nhặt xu, va chạm, kỹ năng | US-05 | M4 | chưa |
| FR-28 | Nhạc nền lặp, chỉ phát sau tương tác đầu tiên | US-05 | M4 | chưa |
| FR-29 | Màn cài đặt: âm lượng và tắt tiếng, nhớ giữa các phiên | US-05 | M4 | chưa |
| FR-30 | Tôn trọng `prefers-reduced-motion` — giảm hiệu ứng trang trí | US-05 | M4 | chưa |
| FR-31 | Đóng khung canvas theo tỉ lệ dọc trên màn hình rộng | US-01 | M1 | xong |
| FR-33 | Deploy tĩnh công khai | — | M4 | chưa |
