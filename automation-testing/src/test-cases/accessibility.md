# ACCESSIBILITY — test case

### TC-ACCESSIBILITY-001 — cả vòng chơi chỉ bằng bàn phím: Tab tới CHƠI, Enter, chơi, Enter trên CHƠI LẠI

- **Requirement:** REQ-ACCESSIBILITY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** seed 1
- **Bước:** Tab, Enter, ← ở 1 s, chờ kết thúc, Tab, Enter
- **Mong đợi:** CHƠI được focus; lượt chạy; CHƠI LẠI được focus; lượt mới 0 m
- **Automated:** `tests/e2e/accessibility/keyboard-and-names.e2e.ts`

### TC-ACCESSIBILITY-002 — mọi nút ngoài lúc chơi nhận focus bằng Tab và có vòng focus thấy được

- **Requirement:** REQ-ACCESSIBILITY-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** ví 100
- **Bước:** Tab qua màn chính, cửa hàng, cài đặt
- **Mong đợi:** thứ tự CHƠI → CỬA HÀNG → CÀI ĐẶT; Quay lại, nút thẻ, công tắc nhận focus; viền ≥ 2 px
- **Automated:** `tests/e2e/accessibility/keyboard-and-names.e2e.ts`

### TC-ACCESSIBILITY-003 — Space bấm được nút đang có focus ở màn chính, cửa hàng và cài đặt

- **Requirement:** REQ-ACCESSIBILITY-03
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** focus trên CỬA HÀNG
- **Bước:** bấm Space
- **Mong đợi:** mở cửa hàng
- **Automated:** `tests/e2e/accessibility/keyboard-and-names.e2e.ts`

### TC-ACCESSIBILITY-004 — vùng chơi và nút HUD có tên đọc được

- **Requirement:** REQ-ACCESSIBILITY-04
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** đang chơi
- **Bước:** đọc accessible name
- **Mong đợi:** canvas = câu hướng dẫn điều khiển; `Tạm dừng`; `Dùng kỹ năng`
- **Automated:** `tests/e2e/accessibility/keyboard-and-names.e2e.ts`

### TC-ACCESSIBILITY-005 — nút tạm dừng và nút kỹ năng rộng ít nhất 44×44 px trên điện thoại

- **Requirement:** REQ-ACCESSIBILITY-05
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** 375×667, đang chơi
- **Bước:** đo hai nút
- **Mong đợi:** ≥ 44×44
- **Automated:** `tests/e2e/accessibility/keyboard-and-names.e2e.ts`

### TC-ACCESSIBILITY-006 — mọi ô nhập trong cài đặt có nhãn liên kết

- **Requirement:** REQ-ACCESSIBILITY-06
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** màn cài đặt
- **Bước:** tìm 3 ô theo nhãn
- **Mong đợi:** đủ 3 ô, mỗi nhãn trỏ đúng một ô
- **Automated:** `tests/e2e/accessibility/keyboard-and-names.e2e.ts`

### TC-ACCESSIBILITY-007 — bật giảm chuyển động thì vòng chơi vẫn chạy đủ tới màn kết thúc

- **Requirement:** REQ-ACCESSIBILITY-07
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** `prefers-reduced-motion: reduce`
- **Bước:** chơi tới va chạm
- **Mong đợi:** quãng đường tăng, màn kết thúc có quãng đường > 0
- **Automated:** `tests/e2e/accessibility/keyboard-and-names.e2e.ts`
