# Nguồn tài nguyên

> **Trả lời:** Mỗi file ảnh trong repo này từ đâu ra, giấy phép gì, và đã xử lý thế nào?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-10 · commit —
> **Cập nhật khi:** thêm, đổi hoặc bỏ một file tài nguyên nhị phân

Chỉ nhận **CC0 hoặc phạm vi công cộng** — `overview.md` đặt trần chi phí ở `0đ` và
`NFR-SEC-07` đòi biết rõ nguồn gốc mọi thứ trong repo. Giấy phép "được dùng miễn phí"
mà không phải CC0 (Unsplash, Pexels) **không** được nhận: điều kiện của họ có thể đổi,
phạm vi công cộng thì không.

## `public/textures/jungle-far.webp` · 640×288 · 31.4 KB

Tầng lá xa trong cảnh 3D, vẽ **trên** đường chân trời — xem `ADR-0010`.

| | |
| --- | --- |
| Nguồn | <https://commons.wikimedia.org/wiki/File:Jungle_path_in_the_Dari%C3%A9n_Gap.jpg> |
| Giấy phép | Phạm vi công cộng (public domain) |
| Bản gốc | 960×960 JPEG, lấy qua bản thumbnail 960px của Wikimedia |

## `public/textures/jungle-screen.webp` · 512×512 · 65.9 KB

Nền các màn hình 2D đặc (cửa hàng, cài đặt) — `FR-40`.

Cùng ảnh gốc như trên, cùng giấy phép.

## Cách hai file trên được tạo

Không phải một script trong repo — chạy lại là việc tay, và đây là các bước:

1. Tải bản thumbnail **960px** từ Wikimedia. Wikimedia chỉ phục vụ một tập chiều rộng
   nhất định; 240/320/480/640/800px đều trả về **HTTP 400**, chỉ 960px chạy.
2. Vẽ vào canvas ở kích thước đích, rồi kéo màu về phía bảng màu của cảnh:
   - `jungle-far`: cắt nửa trên (960×430), giảm bão hoà xuống **0.30**, nhân độ sáng
     **0.50**, phủ `#0d1512` ở alpha **0.40**.
   - `jungle-screen`: dùng cả ảnh, bão hoà **0.55**, độ sáng **0.62**, phủ `#0d1512` ở
     alpha **0.25**.
3. `canvas.toDataURL('image/webp', 0.72)`.

Bước 2 không phải để cho đẹp: ảnh gốc là rừng xanh ban ngày, và đưa nguyên vào thì nó
phá cấu trúc độ sáng mà `ADR-0009` đã đo. Sau khi xử lý, chỗ sáng nhất của
`jungle-screen` composite ở opacity 0.5 trên `--surface` đo được **8.6% độ sáng**, cho
chữ trắng **6.85:1** — trên ngưỡng `NFR-A11Y-01`.

## `docs/assets/screenshot.png`

Ảnh chụp game đang chạy, lấy từ bản deploy bằng `scripts/capture-screenshots.mjs`.
Không phải tài nguyên ngoài.

## Không có gì khác

Không font tải về (Google Fonts nạp qua CSS, không nằm trong repo), không âm thanh —
mọi âm đều tổng hợp bằng Web Audio, xem `ADR-0008`.
