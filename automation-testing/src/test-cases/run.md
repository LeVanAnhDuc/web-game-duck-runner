# RUN — test case

### TC-RUN-001 — bấm CHƠI mở HUD với 0 m, 0 xu, nút tạm dừng và nút kỹ năng

- **Requirement:** REQ-RUN-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** trang mới, seed 3
- **Bước:** bấm CHƠI
- **Mong đợi:** HUD hiện, quãng đường `0`, xu `0`, nút `Tạm dừng`, nút `Dùng kỹ năng`, canvas
- **Automated:** `tests/e2e/run/run-loop.e2e.ts`

### TC-RUN-002 — quãng đường tăng dần khi không chạm gì

- **Requirement:** REQ-RUN-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** lượt seed 3 vừa bắt đầu
- **Bước:** để 1 s rồi thêm 1 s
- **Mong đợi:** quãng đường > 0 sau 1 s và lớn hơn nữa sau 2 s
- **Automated:** `tests/e2e/run/run-loop.e2e.ts`

### TC-RUN-003 — không né thì va chạm kết thúc lượt và hiện màn kết thúc

- **Requirement:** REQ-RUN-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** lượt seed 3, không input
- **Bước:** cho thời gian trôi tới khi lượt kết thúc
- **Mong đợi:** nút `CHƠI LẠI` hiện, HUD ẩn, quãng đường > 0
- **Automated:** `tests/e2e/run/run-loop.e2e.ts`

### TC-RUN-004 — cùng seed và cùng input cho cùng kết quả

- **Requirement:** REQ-RUN-04
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** seed 1
- **Bước:** chơi hai lần, cả hai lần bấm ← ở 1 s
- **Mong đợi:** hai màn kết thúc cùng quãng đường và cùng số xu
- **Automated:** `tests/e2e/run/run-loop.e2e.ts`

### TC-RUN-005 — số xu trên HUD bằng số xu của lượt ở màn kết thúc

- **Requirement:** REQ-RUN-05
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** lượt seed 1
- **Bước:** đọc HUD sau mỗi 100 ms tới khi lượt kết thúc
- **Mong đợi:** xu của lượt > 0 và bằng số cuối cùng trên HUD
- **Automated:** `tests/e2e/run/run-loop.e2e.ts`

### TC-RUN-006 — tốc độ tăng dần: quãng đường 2,5 giây sau dài hơn 2,5 giây đầu

- **Requirement:** REQ-RUN-06
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** lượt seed 1, nhảy ở 5,9 s để sống qua 8,5 s
- **Bước:** đo quãng đường 0–2,5 s và 6–8,5 s
- **Mong đợi:** cửa sổ sau dài hơn cửa sổ đầu, lượt vẫn chạy
- **Automated:** `tests/e2e/run/run-loop.e2e.ts`
