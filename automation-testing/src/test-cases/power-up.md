# POWERUP — test case

### TC-POWERUP-001 — chạy qua nam châm thì HUD hiện chip Nam châm 7s

- **Requirement:** REQ-POWERUP-01, REQ-POWERUP-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** lượt seed 215 phát lại `POWERUP_RUNS.magnet`
- **Bước:** chạy tới khung 562, rồi khung 563
- **Mong đợi:** khung 562 chưa có chip; khung 563 có đúng một chip `Nam châm 7s`
- **Automated:** `tests/e2e/power-up/magnet.e2e.ts`

### TC-POWERUP-002 — chip Nam châm đếm ngược từng giây và biến mất khi hết 7 giây

- **Requirement:** REQ-POWERUP-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** như TC-POWERUP-001
- **Bước:** đọc chip ở khung 563, 595, 672, 673
- **Mong đợi:** `7s` → `5s` → `1s` → không còn chip, HUD vẫn hiện (lượt chạy tiếp)
- **Automated:** `tests/e2e/power-up/magnet.e2e.ts`

### TC-POWERUP-003 — trong 7 giây có nam châm lượt nhặt được nhiều xu hơn khi không có

- **Requirement:** REQ-POWERUP-03
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** như TC-POWERUP-001
- **Bước:** đọc số xu ở khung nhặt (563) và khung hết nam châm (673)
- **Mong đợi:** 24 xu lúc nhặt; lúc hết nhiều hơn 31 (số xu cùng chuỗi phím khi bỏ nam châm, decisions Q5)
- **Automated:** `tests/e2e/power-up/magnet.e2e.ts`

### TC-POWERUP-004 — chạy qua khiên thì HUD hiện chip Khiên không kèm số giây

- **Requirement:** REQ-POWERUP-01, REQ-POWERUP-04
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** lượt seed 212 phát lại `POWERUP_RUNS.shield`
- **Bước:** chạy tới khung 561, 562, rồi 574
- **Mong đợi:** khung 561 chưa có chip; khung 562 và 574 chip đúng chữ `Khiên`, không đổi
- **Automated:** `tests/e2e/power-up/shield.e2e.ts`

### TC-POWERUP-005 — chạm chướng ngại khi có khiên thì khiên vỡ và lượt vẫn chạy tiếp

- **Requirement:** REQ-POWERUP-05
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** như TC-POWERUP-004, không bấm phím sau khung 533
- **Bước:** chạy tới khung 575 (va chạm mà không có khiên thì kết thúc lượt), rồi tới 619
- **Mong đợi:** khung 575 chip biến mất; tới khung 619 chưa có màn kết thúc, HUD vẫn hiện, quãng đường tiếp tục tăng
- **Automated:** `tests/e2e/power-up/shield.e2e.ts`

### TC-POWERUP-006 — va chạm tiếp theo sau khi khiên đã vỡ thì kết thúc lượt

- **Requirement:** REQ-POWERUP-05
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** như TC-POWERUP-005
- **Bước:** chạy tới khung 619, rồi 620
- **Mong đợi:** khung 619 chưa kết thúc; khung 620 hiện màn kết thúc (nút CHƠI LẠI)
- **Automated:** `tests/e2e/power-up/shield.e2e.ts`

### TC-POWERUP-007 — chạy qua tua nhanh thì chip Tua nhanh đếm ngược từ 5s rồi biến mất

- **Requirement:** REQ-POWERUP-01, REQ-POWERUP-06
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** lượt seed 312 phát lại `POWERUP_RUNS.rush`
- **Bước:** đọc chip ở khung 555, 556, 625, 626
- **Mong đợi:** chưa có chip → `Tua nhanh 5s` → `Tua nhanh 1s` → không còn chip
- **Automated:** `tests/e2e/power-up/rush.e2e.ts`

### TC-POWERUP-008 — đang tua nhanh thì chạm chướng ngại không kết thúc lượt, hết tua nhanh thì có

- **Requirement:** REQ-POWERUP-06
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** như TC-POWERUP-007, không bấm phím sau khung 534 (không có tua nhanh lượt này kết thúc ở khung 566)
- **Bước:** chạy tới khung 576, 625, rồi 661
- **Mong đợi:** khung 576 và 625 chưa có màn kết thúc (khung 625 chip `Tua nhanh 1s`); khung 661, sau khi hết tua nhanh, màn kết thúc hiện
- **Automated:** `tests/e2e/power-up/rush.e2e.ts`

### TC-POWERUP-009 — tua nhanh làm quãng đường tăng nhanh hơn rõ rệt

- **Requirement:** REQ-POWERUP-07
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** như TC-POWERUP-007
- **Bước:** đo quãng đường tăng trong khung 540→556 (trước khi nhặt) và 572→588 (trong tua nhanh)
- **Mong đợi:** tỉ lệ trong / trước > 1,3
- **Automated:** `tests/e2e/power-up/rush.e2e.ts`

### TC-POWERUP-010 — tạm dừng lúc nam châm đang chạy thì số giây còn lại đứng yên

- **Requirement:** REQ-POWERUP-08
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** như TC-POWERUP-001
- **Bước:** tới khung 594 (chip `Nam châm 6s`) → Esc → để ~10 s trôi → đọc chip → CHƠI TIẾP → chạy tới khung 673, 674
- **Mong đợi:** chip vẫn `Nam châm 6s` sau 10 s tạm dừng (dài hơn thời gian nam châm còn lại); sau khi chơi tiếp chip còn `1s` ở khung 673 và biến mất ở khung 674 (decisions Q7)
- **Automated:** `tests/e2e/power-up/magnet.e2e.ts`
