# RESPONSIVE — test case

### TC-RESPONSIVE-001 — màn hình rộng có khung chơi dọc ở giữa, cao bằng màn hình

- **Requirement:** REQ-RESPONSIVE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** 1440×900
- **Bước:** mở trang
- **Mong đợi:** khung cao 900 > rộng, tâm ở x = 720, không cuộn ngang
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-002 — điện thoại dùng hết bề ngang và không cuộn ngang ở màn nào

- **Requirement:** REQ-RESPONSIVE-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** 320×568, 375×667, 390×844
- **Bước:** màn chính → cửa hàng → cài đặt
- **Mong đợi:** khung rộng bằng màn ±1 px, không cuộn ngang, nút trong màn hình
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-003 — HUD nằm trọn trong màn hình điện thoại khi đang chơi

- **Requirement:** REQ-RESPONSIVE-03
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** 375×667, đang chơi
- **Bước:** đọc vị trí HUD
- **Mong đợi:** bốn phần HUD trong màn hình
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-004 — xoay ngang giữa lượt thì lượt vẫn chạy và HUD vẫn đủ

- **Requirement:** REQ-RESPONSIVE-04
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** 375×667, đang chơi 1 s
- **Bước:** đổi sang 667×375, để 1 s
- **Mong đợi:** quãng đường tăng, canvas hiện, nút trong màn hình
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`
