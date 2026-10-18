# WEBGL — test case

### TC-WEBGL-001 — trình duyệt không có WebGL thì hiện lời giải thích thay cho màn đen

- **Requirement:** REQ-WEBGL-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** WebGL bị tắt
- **Bước:** mở trang
- **Mong đợi:** heading `Không chạy được đồ hoạ 3D`, lời giải thích, THỬ LẠI bật, không có nút CHƠI
- **Automated:** `tests/e2e/webgl/fallback.e2e.ts`

### TC-WEBGL-002 — THỬ LẠI tải lại trang

- **Requirement:** REQ-WEBGL-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** màn lỗi WebGL
- **Bước:** bấm THỬ LẠI
- **Mong đợi:** trang tải lại (sự kiện load), màn lỗi hiện lại
- **Automated:** `tests/e2e/webgl/fallback.e2e.ts`

### TC-WEBGL-003 — mất bộ nhớ đồ hoạ giữa lượt thì lượt dừng và hiện lời giải thích

- **Requirement:** REQ-WEBGL-03
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** đang chơi 1 s
- **Bước:** `loseContext()`
- **Mong đợi:** màn lỗi với lời giải thích thu hồi bộ nhớ, HUD ẩn
- **Automated:** `tests/e2e/webgl/fallback.e2e.ts`

### TC-WEBGL-004 — trong lúc khởi tạo thấy màn ĐANG TẢI chứ không phải màn trắng

- **Requirement:** REQ-WEBGL-04
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** mạng chậm
- **Bước:** mở trang
- **Mong đợi:** thấy wordmark + ĐANG TẢI trước màn chính
- **Automated:** manual — màn tải chỉ sống một lần render, không chờ ổn định được (decisions Q2)
