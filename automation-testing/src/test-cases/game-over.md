# GAMEOVER — test case

### TC-GAMEOVER-001 — lượt đầu tiên là kỷ lục mới, màn kết thúc hiện quãng đường, xu lượt này và ví

- **Requirement:** REQ-GAMEOVER-01, REQ-GAMEOVER-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** không save, seed 3
- **Bước:** chơi tới khi va chạm
- **Mong đợi:** KỶ LỤC MỚI, quãng đường `<n>m` > 0, ví = xu lượt này
- **Automated:** `tests/e2e/game-over/result.e2e.ts`

### TC-GAMEOVER-002 — không phá kỷ lục thì hiện kỷ lục cũ thay cho KỶ LỤC MỚI

- **Requirement:** REQ-GAMEOVER-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** save best 5000
- **Bước:** chơi tới khi va chạm
- **Mong đợi:** `Kỷ lục 5 000 m`, không có KỶ LỤC MỚI
- **Automated:** `tests/e2e/game-over/result.e2e.ts`

### TC-GAMEOVER-003 — xu của lượt được cộng vào ví đã có

- **Requirement:** REQ-GAMEOVER-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** save coins 100
- **Bước:** chơi tới khi va chạm
- **Mong đợi:** ví = 100 + xu lượt này
- **Automated:** `tests/e2e/game-over/result.e2e.ts`

### TC-GAMEOVER-004 — CHƠI LẠI bắt đầu ngay lượt mới, không qua màn chính

- **Requirement:** REQ-GAMEOVER-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** màn kết thúc
- **Bước:** bấm CHƠI LẠI, để 1 s
- **Mong đợi:** HUD 0 m / 0 xu, không có màn chính, quãng đường tăng
- **Automated:** `tests/e2e/game-over/result.e2e.ts`

### TC-GAMEOVER-005 — bấm CHƠI LẠI hai lần thật nhanh chỉ tạo một lượt

- **Requirement:** REQ-GAMEOVER-05
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** màn kết thúc của seed 3
- **Bước:** bấm đúp CHƠI LẠI, để 2 s
- **Mong đợi:** quãng đường ≈ 2 s đầu của lượt trước (±1 m)
- **Automated:** `tests/e2e/game-over/result.e2e.ts`

### TC-GAMEOVER-006 — VỀ MÀN CHÍNH hiện kỷ lục và ví mới

- **Requirement:** REQ-GAMEOVER-06
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** save coins 7
- **Bước:** chơi tới khi va chạm → VỀ MÀN CHÍNH
- **Mong đợi:** màn chính hiện kỷ lục = quãng đường vừa chạy, ví mới
- **Automated:** `tests/e2e/game-over/result.e2e.ts`
