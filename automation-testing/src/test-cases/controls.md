# CONTROLS — test case

### TC-CONTROLS-001 — mũi tên trái đổi làn và làm lượt chơi khác đi

- **Requirement:** REQ-CONTROLS-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** seed 1
- **Bước:** chạy thẳng; rồi ← ở 1 s; rồi → ở 1 s
- **Mong đợi:** ba kết quả khác nhau đôi một
- **Automated:** `tests/e2e/controls/keyboard.e2e.ts`

### TC-CONTROLS-002 — A và D cho đúng lượt chơi như mũi tên trái và phải

- **Requirement:** REQ-CONTROLS-01
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** seed 1
- **Bước:** A ở 1 s và ← ở 1 s; D ở 1 s và → ở 1 s
- **Mong đợi:** kết quả từng cặp bằng nhau
- **Automated:** `tests/e2e/controls/keyboard.e2e.ts`

### TC-CONTROLS-003 — nhảy đúng lúc vượt qua chướng ngại thấp, W như mũi tên lên

- **Requirement:** REQ-CONTROLS-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** seed 1 (chết ở 57 m khi chạy thẳng)
- **Bước:** ↑ ở 5,9 s; W ở 5,9 s
- **Mong đợi:** đi xa hơn chạy thẳng; W cho đúng kết quả của ↑
- **Automated:** `tests/e2e/controls/keyboard.e2e.ts`

### TC-CONTROLS-004 — trượt đúng lúc qua dưới chướng ngại cao, S như mũi tên xuống

- **Requirement:** REQ-CONTROLS-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** seed 6 (chết ở 70 m khi chạy thẳng)
- **Bước:** ↓ ở 7,25 s; S ở 7,25 s
- **Mong đợi:** đi xa hơn chạy thẳng; S cho đúng kết quả của ↓
- **Automated:** `tests/e2e/controls/keyboard.e2e.ts`

### TC-CONTROLS-005 — phím điều khiển ở màn chính không bắt đầu lượt chơi

- **Requirement:** REQ-CONTROLS-08
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** màn chính
- **Bước:** bấm ← ↑ ↓ → Esc
- **Mong đợi:** vẫn ở màn chính, HUD ẩn
- **Automated:** `tests/e2e/controls/keyboard.e2e.ts`

### TC-CONTROLS-006 — vuốt trái và phải đổi làn đúng như phím mũi tên

- **Requirement:** REQ-CONTROLS-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** viewport cảm ứng 390×844, seed 1
- **Bước:** vuốt trái 120 px ở 1 s; ← ở 1 s; tương tự phải
- **Mong đợi:** từng cặp cho cùng kết quả
- **Automated:** `tests/e2e/controls/touch.e2e.ts`

### TC-CONTROLS-007 — vuốt lên nhảy và vuốt xuống trượt đúng như phím mũi tên

- **Requirement:** REQ-CONTROLS-04
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** viewport cảm ứng
- **Bước:** vuốt lên ở 5,9 s seed 1 vs ↑; vuốt xuống ở 7,25 s seed 6 vs ↓
- **Mong đợi:** từng cặp cho cùng kết quả
- **Automated:** `tests/e2e/controls/touch.e2e.ts`

### TC-CONTROLS-008 — chạm không vuốt thì không đổi làn

- **Requirement:** REQ-CONTROLS-05
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** viewport cảm ứng, seed 1
- **Bước:** chạm dịch 15 px ở 1 s
- **Mong đợi:** kết quả bằng chạy thẳng
- **Automated:** `tests/e2e/controls/touch.e2e.ts`

### TC-CONTROLS-009 — vuốt bắt đầu trên nút kỹ năng không đổi làn

- **Requirement:** REQ-CONTROLS-06
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** viewport cảm ứng, seed 1, thanh nạp rỗng
- **Bước:** vuốt trái 120 px bắt đầu trên nút kỹ năng ở 1 s
- **Mong đợi:** kết quả bằng chạy thẳng
- **Automated:** `tests/e2e/controls/touch.e2e.ts`

### TC-CONTROLS-010 — vuốt trên vùng chơi không cuộn hay kéo trang

- **Requirement:** REQ-CONTROLS-07
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** viewport cảm ứng, đang chơi
- **Bước:** vuốt xuống, lên, trái
- **Mong đợi:** `scrollX`/`scrollY` = 0, không cuộn ngang, HUD còn
- **Automated:** `tests/e2e/controls/touch.e2e.ts`
