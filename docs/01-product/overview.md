# Tổng quan sản phẩm

> **Trả lời:** Sản phẩm này là gì, cho ai, và **KHÔNG** làm gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** định vị đổi · thêm/bớt một Non-Goal · trần chi phí đổi

<!-- CÁCH ĐIỀN
File này là nơi DUY NHẤT trả lời "cái này có thuộc phạm vi không". Mọi tranh luận
về scope kết thúc ở đây.

Mục 4 (Non-Goals) là mục quan trọng nhất và là mục dễ bỏ trống nhất. Một Non-Goal
tốt là thứ nghe HỢP LÝ mà vẫn bị từ chối — "không làm chat realtime", "không hỗ trợ
nhiều tổ chức". Nếu danh sách Non-Goals trống, file này chưa làm được việc của nó.

KHÔNG chứa: danh sách tính năng (-> 02-requirements/scope.md), ngưỡng kỹ thuật
(-> 02-requirements/nfr.md), thuật ngữ (-> 01-product/glossary.md).
-->

## 1. Một câu định vị

Một endless runner 3 làn chạy thẳng vào màn hình, chơi ngay trên trình duyệt không
cần cài đặt, khác các bản web clone ở chỗ mỗi nhân vật mang một **kỹ năng chủ động**
do người chơi tự chọn thời điểm bấm.

## 2. Vấn đề đang giải

Người viết dự án này cần một sản phẩm portfolio chứng minh được ba thứ khó chứng
minh bằng CRUD app: xử lý thời gian thực ở 60fps, tách bạch mô phỏng khỏi hiển thị
để test được, và thiết kế tương tác đúng trên cả cảm ứng lẫn bàn phím.

Với người chơi: các endless runner trên web hầu hết chỉ có một hành động lặp lại,
không có khoảnh khắc nào để người chơi ra quyết định. Thanh nạp kỹ năng tạo ra
khoảnh khắc đó.

## 3. Người dùng mục tiêu

**Nhóm chính:** người xem portfolio — mở link trên điện thoại hoặc laptop, chơi thử
1–3 phút, không đọc hướng dẫn. Hệ quả: game phải hiểu được trong 10 giây đầu và
không được có màn hình chờ tải dài.

**Nhóm phụ:** người chơi casual tình cờ vào, quay lại vài lần để phá kỷ lục của
chính mình.

## 4. Non-Goals — dứt khoát không làm

- **Không có backend.** Toàn bộ chạy ở client, deploy tĩnh. Có backend là có chi
  phí, có vận hành, có bảo mật — không thứ nào phục vụ mục tiêu portfolio ở đây.
- **Không có bảng xếp hạng toàn cầu.** Kéo theo backend và định danh người chơi.
  Điểm cao chỉ so với chính mình, lưu trên máy.
- **Không chống gian lận điểm số.** Không có server để xác thực, nên mọi nỗ lực làm
  khó việc sửa `localStorage` chỉ tốn công mà không đạt được gì.
- **Không có tài khoản, đăng nhập, hay đồng bộ nhiều thiết bị.** Không có gì cần
  bảo vệ; đổi máy là mất tiến độ, và điều đó chấp nhận được.
- **Không có mua bán bằng tiền thật.** Xu chỉ kiếm được bằng cách chơi.
- **Không có chế độ nhiều người chơi.** Đồng bộ thời gian thực là một dự án khác.
- **Không có trình soạn màn chơi hay nội dung do người dùng tạo.**
- **Nhân vật không khác nhau về chỉ số cơ bản** (tốc độ, lực nhảy, hitbox) — xem
  `ADR-0004`. Chỉ kỹ năng chủ động là khác.
- **Không đa ngôn ngữ ở v1.** Một ngôn ngữ hiển thị duy nhất; chuỗi vẫn tách khỏi
  code để mở đường sau này (`NFR-I18N-01`).

## 5. Mô hình

| Câu hỏi | Trả lời |
| --- | --- |
| Ai trả tiền | Không ai — dự án học tập / portfolio |
| Trả bằng gì | — |
| **Trần chi phí hạ tầng / tháng** | **0đ.** Trang tĩnh trên hạ tầng miễn phí. Ràng buộc này là nguồn của Non-Goal "không backend" |

## 6. Thế nào là thành công

1. Người xem portfolio mở link trên điện thoại và **chơi hết một lượt mà không hỏi
   cách chơi** — đo bằng cách cho ít nhất 5 người thử, không giải thích trước.
2. Chạy mượt trên máy tầm trung: xem ngưỡng ở `NFR-PERF-05`, đo bằng Chrome DevTools
   với CPU throttle, không đoán.
3. Người chơi thử **tự bấm chơi lại ít nhất một lần** mà không được nhắc.
