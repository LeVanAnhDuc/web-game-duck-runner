# PAUSE — test case

### TC-PAUSE-001 — Esc tạm dừng: hiện TẠM DỪNG và quãng đường đứng yên dù thời gian trôi

- **Requirement:** REQ-PAUSE-01, REQ-PAUSE-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** lượt seed 3 sau 1,5 s
- **Bước:** Esc, để 3 s
- **Mong đợi:** TẠM DỪNG hiện, quãng đường không đổi
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-002 — phím P và nút tạm dừng trên HUD cũng tạm dừng

- **Requirement:** REQ-PAUSE-01
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** đang chơi
- **Bước:** P → CHƠI TIẾP → nút Tạm dừng
- **Mong đợi:** TẠM DỪNG hiện cả hai lần
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-003 — CHƠI TIẾP chạy tiếp từ đúng chỗ đã dừng

- **Requirement:** REQ-PAUSE-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** đang tạm dừng
- **Bước:** CHƠI TIẾP, để 1 s
- **Mong đợi:** quãng đường bằng lúc dừng rồi tăng
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-004 — Esc lần nữa khi đang tạm dừng thì chơi tiếp

- **Requirement:** REQ-PAUSE-03
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** đang tạm dừng
- **Bước:** Esc
- **Mong đợi:** TẠM DỪNG ẩn, HUD hiện
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-005 — tạm dừng giữa chừng không đổi kết quả của lượt

- **Requirement:** REQ-PAUSE-04
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** seed 3
- **Bước:** chạy thẳng; rồi chạy lại, tạm dừng ở 2 s trong 5 s rồi chơi tiếp
- **Mong đợi:** cùng quãng đường và cùng xu
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-006 — VỀ MÀN CHÍNH từ tạm dừng bỏ lượt, kỷ lục và ví không đổi

- **Requirement:** REQ-PAUSE-05
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** không save, lượt seed 3 sau 3 s
- **Bước:** Esc → VỀ MÀN CHÍNH
- **Mong đợi:** màn chính `0 m` / `0`, không có save
- **Automated:** `tests/e2e/pause/pause.e2e.ts`
