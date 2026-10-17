# TEXTURES — test case

### TC-TEXTURES-001 — hai ảnh nền chỉ tải sau khi game đã bấm chơi được

- **Requirement:** REQ-TEXTURES-01, REQ-TEXTURES-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** request ảnh bị giữ
- **Bước:** mở trang; thả ảnh
- **Mong đợi:** CHƠI bật khi ảnh còn treo, đúng 2 request ảnh; sau khi thả `data-textures=on`
- **Automated:** `tests/e2e/textures/photos.e2e.ts`

### TC-TEXTURES-002 — bật tiết kiệm dữ liệu thì không tải ảnh nào

- **Requirement:** REQ-TEXTURES-03
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** `saveData: true`
- **Bước:** mở trang, CHƠI
- **Mong đợi:** 0 request ảnh, lượt chạy
- **Automated:** `tests/e2e/textures/photos.e2e.ts`

### TC-TEXTURES-003 — ảnh tải lỗi thì game vẫn chơi được bình thường

- **Requirement:** REQ-TEXTURES-04
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** request ảnh bị huỷ
- **Bước:** mở trang, CHƠI
- **Mong đợi:** lượt chạy, không `data-textures`, không lỗi trang
- **Automated:** `tests/e2e/textures/photos.e2e.ts`

### TC-TEXTURES-004 — tổng dung lượng ảnh không quá 200 KB

- **Requirement:** REQ-TEXTURES-05
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** —
- **Bước:** mở trang, chờ hai ảnh
- **Mong đợi:** tổng body ≤ 204 800 byte
- **Automated:** `tests/e2e/textures/photos.e2e.ts`
