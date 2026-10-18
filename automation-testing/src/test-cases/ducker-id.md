# DUCKERID — test case

### TC-DUCKERID-001 — cờ tắt thì không có nút đăng nhập và không request nào ra ngoài

- **Requirement:** REQ-DUCKERID-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** build cờ tắt
- **Bước:** mở trang
- **Mong đợi:** 0 nút Đăng nhập / tài khoản, 0 request ngoài (trừ fonts), không `ducker.pkce`
- **Automated:** `tests/e2e/ducker-id/flag-off.e2e.ts`

### TC-DUCKERID-002 — cờ tắt thì code và state lạ trên URL được để yên

- **Requirement:** REQ-DUCKERID-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** build cờ tắt
- **Bước:** mở `./?code=abc&state=xyz`
- **Mong đợi:** màn chính hiện, URL giữ nguyên query
- **Automated:** `tests/e2e/ducker-id/flag-off.e2e.ts`

### TC-DUCKERID-003 — đăng nhập xong thấy nút tài khoản, URL sạch và không lỗi console

- **Requirement:** REQ-DUCKERID-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** build cờ bật, issuer giả
- **Bước:** Đăng nhập
- **Mong đợi:** nút tài khoản có tên, URL không `code`/`state`, không `ducker.pkce`, không lỗi console
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-004 — menu tài khoản hiện tên, email, hồ sơ, đăng xuất và trả focus đúng chỗ

- **Requirement:** REQ-DUCKERID-04
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** đã đăng nhập
- **Bước:** mở menu; Esc; mở menu → Đăng xuất
- **Mong đợi:** tên, email, href hồ sơ, `target=_blank`, `rel` noopener; focus về nút tài khoản; focus về Đăng nhập
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-005 — tải lại khi đang đăng nhập thì về chưa đăng nhập

- **Requirement:** REQ-DUCKERID-05
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** đã đăng nhập
- **Bước:** tải lại
- **Mong đợi:** nút Đăng nhập, không nút tài khoản
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-006 — state bị sửa thì về chưa đăng nhập và URL sạch

- **Requirement:** REQ-DUCKERID-06
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** build cờ bật
- **Bước:** mở `./?code=stolen&state=evil`
- **Mong đợi:** nút Đăng nhập, URL không query
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-007 — Ducker ID từ chối thì về chưa đăng nhập và URL sạch

- **Requirement:** REQ-DUCKERID-06
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** issuer giả trả `access_denied`
- **Bước:** Đăng nhập
- **Mong đợi:** nút Đăng nhập, không nút tài khoản, URL không query
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-008 — đã đăng nhập thì game vẫn chơi được và save không đổi

- **Requirement:** REQ-DUCKERID-07
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** save best 250, coins 40
- **Bước:** Đăng nhập → CHƠI
- **Mong đợi:** save y nguyên, lượt chạy
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-009 — ở 375px nút đăng nhập rộng ít nhất 44 và menu tài khoản nằm trong màn hình

- **Requirement:** REQ-DUCKERID-08
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** 375×667
- **Bước:** Đăng nhập → mở menu
- **Mong đợi:** nút ≥ 44×44 trong màn hình; menu trong màn hình, không cuộn ngang
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-010 — phím mũi tên trong menu tài khoản chuyển giữa các mục

- **Requirement:** REQ-DUCKERID-09
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** menu tài khoản mở
- **Bước:** ↓, ↓, End, Home
- **Mong đợi:** focus hồ sơ → đăng xuất → hồ sơ → đăng xuất → hồ sơ
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`
