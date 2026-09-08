# ADR-0001 · Dùng Three.js với model low-poly CC0 thay vì Phaser hoặc PixiJS

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-01 · FR-05 · NFR-PERF-05 · NFR-PERF-08

## 1. Bối cảnh

Góc nhìn đã chốt là "ba làn hội tụ về điểm tụ, chạy vào màn hình" — tức là có chiều
sâu thật. Nguồn hình ảnh đã chốt là asset pack miễn phí, không tự vẽ. Người làm là
lập trình viên frontend, không có hoạ sĩ.

Gợi ý ban đầu là Phaser hoặc PixiJS, đúng cho endless runner nhìn ngang.

## 2. Quyết định

Dùng **Three.js** dựng cảnh 3D thật với camera cố định sau lưng nhân vật. Ba làn là
ba toạ độ trên trục ngang. Model lấy từ các bộ low-poly CC0 của Kenney, định dạng
`.glb`, dùng nguyên không sửa. Vật thể lặp lại dùng instancing.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Phaser 3, giả phối cảnh bằng scale sprite (kiểu OutRun) | Phải tự chiếu toạ độ và tự sắp thứ tự vẽ mỗi frame. Nặng hơn: sprite phải được vẽ **nhìn chính diện** thì phóng to mới đúng, mà sprite 2D miễn phí hầu hết vẽ nhìn ngang — hai lựa chọn đã chốt (giả 3D + asset miễn phí) triệt tiêu nhau |
| PixiJS | Cùng vấn đề phối cảnh như Phaser, lại còn ít sẵn hơn: không có scene, input, audio, tween |
| Babylon.js | Đỡ phải tự viết hơn, nhưng bundle nặng hơn đáng kể và hệ GUI riêng của nó kéo UI ra khỏi DOM — mất luôn ưu thế responsive và a11y |

## 4. Hệ quả

**Được:**
- Phối cảnh, che khuất, sắp xếp theo chiều sâu, ánh sáng do engine lo, không phải mô phỏng bằng tay.
- Model 3D CC0 dùng được trực tiếp, không cần vẽ lại theo từng mức xa/gần.
- UI để trên DOM nên responsive và a11y làm theo cách thông thường.

**Mất / phải chấp nhận:**
- Three.js là thư viện render, không phải game engine: vòng lặp, state machine, input, âm thanh phải tự viết.
- Rủi ro hiệu năng trên mobile cao hơn 2D. Phải khống chế draw call từ đầu (`NFR-PERF-08`), tắt shadow map, giới hạn số vật thể sống.
- Bundle lớn hơn một game 2D thuần.

**Điều kiện xem lại quyết định này:** nếu đo được rằng không đạt `NFR-PERF-05` trên
mobile tầm trung kể cả sau khi tối ưu, thì phải viết ADR mới — hoặc hạ yêu cầu đồ
hoạ, hoặc đổi góc nhìn.
