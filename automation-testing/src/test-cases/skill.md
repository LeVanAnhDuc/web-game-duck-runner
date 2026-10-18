# SKILL — test case

### TC-SKILL-001 — đầu lượt nút kỹ năng ở trạng thái ĐANG NẠP và thanh nạp rỗng

- **Requirement:** REQ-SKILL-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** lượt vừa bắt đầu
- **Bước:** đọc HUD
- **Mong đợi:** `ĐANG NẠP`, độ rộng thanh 0%
- **Automated:** `tests/e2e/skill/charge.e2e.ts`

### TC-SKILL-002 — mỗi xu nhặt được làm đầy thêm một phần mười tám thanh nạp

- **Requirement:** REQ-SKILL-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** lượt seed 3
- **Bước:** chạy tới khi HUD có xu
- **Mong đợi:** độ rộng thanh = round(xu / 18 × 100)%, vẫn ĐANG NẠP
- **Automated:** `tests/e2e/skill/charge.e2e.ts`

### TC-SKILL-003 — bấm nút kỹ năng khi thanh chưa đầy thì nút rung báo chưa sẵn sàng

- **Requirement:** REQ-SKILL-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** thanh rỗng
- **Bước:** bấm nút Dùng kỹ năng
- **Mong đợi:** nút có nhịp rung, vẫn ĐANG NẠP, lượt chạy tiếp
- **Automated:** `tests/e2e/skill/charge.e2e.ts`

### TC-SKILL-004 — Space khi thanh chưa đầy cũng báo chưa sẵn sàng

- **Requirement:** REQ-SKILL-04
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** thanh rỗng
- **Bước:** bấm Space
- **Mong đợi:** nút có nhịp rung như khi bấm nút
- **Automated:** `tests/e2e/skill/charge.e2e.ts`

### TC-SKILL-005 — thanh đầy thì SẴN SÀNG, dùng kỹ năng thì thanh về 0 và ví không bị trừ

- **Requirement:** REQ-SKILL-05
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** 18 xu trong một lượt
- **Bước:** nhặt đủ xu, bấm kỹ năng
- **Mong đợi:** SẴN SÀNG → hiệu ứng chạy, thanh 0%, xu lượt không giảm
- **Automated:** manual — cần lái nhân vật nhặt 18 xu; phủ bởi unit test client/tests/game/effects.test.ts
