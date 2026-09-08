# M4 · Âm thanh và hoàn thiện — kế hoạch

- [x] A1 · `ADR-0008` — tổng hợp âm thanh bằng Web Audio, gỡ `howler`
- [x] A2 · `audio/Audio.ts` — 8 hiệu ứng + nhạc nền lập lịch theo `AudioContext`
- [x] A3 · `AudioContext` chỉ tạo ở tương tác đầu tiên
- [x] A4 · Tiếng nhặt xu tăng cao độ theo chuỗi liên tiếp
- [x] B1 · Nối âm thanh vào `core/events` — `game/` không biết `audio/` tồn tại
- [x] C1 · Màn cài đặt: tắt tiếng · nhạc nền · hiệu ứng · xoá tiến độ có xác nhận
- [x] C2 · Tự vẽ checkbox và thanh trượt cho khớp giao diện tối
- [x] C3 · Màn cài đặt nói ra khi `prefers-reduced-motion` đang bật
- [x] D1 · `.github/workflows/deploy.yml` — cổng kiểm trước khi deploy
- [x] E1 · Đo bundle: **180.8 KB gzip** / 661 KB thô
- [x] E2 · Đo fps và draw call: **103–104 fps**, **20 draw call** ở CPU 4×, cảnh dày nhất
- [x] E3 · Đo heap: **phẳng qua 2 phút**, không có xu hướng tăng
- [x] E4 · Đo thời gian tới lúc chơi được: **2 679 ms** tải nguội, Slow 4G + CPU 4×
- [x] E5 · Ghi số đo + điều kiện đo vào `nfr.md`; thêm `NFR-PERF-09`
- [x] F1 · Soi khổ **1024**: khung dọc 432×768, tỉ lệ đúng 0.563, không cuộn ngang
- [x] F2 · 15 test mới cho âm thanh và môi trường; tổng 121 test
- [ ] G1 · Deploy thật — **bị chặn: repo chưa có remote.** `FR-33` giữ trạng thái *đang*
- [ ] G2 · Xác nhận fps trên **máy mobile thật** — CPU throttle không thay được GPU thật
