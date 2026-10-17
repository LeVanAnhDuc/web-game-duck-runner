# MENU — test case

### TC-MENU-001 — màn chính hiện tên game, khẩu hiệu và ba nút CHƠI, CỬA HÀNG, CÀI ĐẶT

- **Requirement:** REQ-MENU-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** trang mới
- **Bước:** mở `./`
- **Mong đợi:** heading `DUCKRUNNER`, khẩu hiệu, ba nút bật, title `Duck Runner`
- **Automated:** `tests/e2e/menu/main-screen.e2e.ts`

### TC-MENU-002 — người chơi mới thấy kỷ lục 0 m và ví 0

- **Requirement:** REQ-MENU-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** không có save
- **Bước:** mở `./`
- **Mong đợi:** `0 m` và `0`
- **Automated:** `tests/e2e/menu/main-screen.e2e.ts`

### TC-MENU-003 — kỷ lục và ví đã lưu hiện trên màn chính, số lớn tách hàng nghìn

- **Requirement:** REQ-MENU-02, REQ-MENU-03
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** save best 1482, coins 12345
- **Bước:** mở `./`
- **Mong đợi:** `1 482 m` và `12 345`
- **Automated:** `tests/e2e/menu/main-screen.e2e.ts`

### TC-MENU-004 — màn chính có dòng gợi ý điều khiển

- **Requirement:** REQ-MENU-04
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** trang mới
- **Bước:** mở `./`
- **Mong đợi:** dòng gợi ý hiện
- **Automated:** `tests/e2e/menu/main-screen.e2e.ts`

### TC-MENU-005 — mở trang không có lỗi console hay lỗi trang

- **Requirement:** REQ-MENU-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** trang mới
- **Bước:** mở `./`
- **Mong đợi:** không `console.error`, không `pageerror`
- **Automated:** `tests/e2e/menu/main-screen.e2e.ts`

### TC-MENU-006 — CỬA HÀNG và CÀI ĐẶT mở màn của chúng, Quay lại về màn chính

- **Requirement:** REQ-MENU-06
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** màn chính
- **Bước:** CỬA HÀNG → Quay lại → CÀI ĐẶT → Quay lại
- **Mong đợi:** đúng heading từng màn, về màn chính
- **Automated:** `tests/e2e/menu/main-screen.e2e.ts`
