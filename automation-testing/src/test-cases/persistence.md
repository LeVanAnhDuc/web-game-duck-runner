# PERSISTENCE — test case

### TC-PERSISTENCE-001 — kỷ lục và ví được lưu sau lượt và còn sau khi tải lại

- **Requirement:** REQ-PERSISTENCE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** không save
- **Bước:** chơi tới khi va chạm, tải lại
- **Mong đợi:** save `{version:1, bestDistanceM, coins}` đúng kết quả; màn chính hiện lại
- **Automated:** `tests/e2e/persistence/save-file.e2e.ts`

### TC-PERSISTENCE-002 — save hỏng không phải JSON thì về mặc định và vẫn chơi được

- **Requirement:** REQ-PERSISTENCE-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** save `{not json`
- **Bước:** mở trang, CHƠI
- **Mong đợi:** 0 m / 0, HUD hiện, không lỗi trang
- **Automated:** `tests/e2e/persistence/save-file.e2e.ts`

### TC-PERSISTENCE-003 — trường sai kiểu, âm hoặc vượt biên được thay bằng mặc định

- **Requirement:** REQ-PERSISTENCE-03
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** best "abc", coins −5, music 7, sfx null, muted "yes"
- **Bước:** mở trang, CÀI ĐẶT
- **Mong đợi:** 0 m / 0; nhạc 100, hiệu ứng 80, không tắt tiếng
- **Automated:** `tests/e2e/persistence/save-file.e2e.ts`

### TC-PERSISTENCE-004 — save dưới khoá cũ của game vẫn được đọc, lần ghi sau sang khoá mới

- **Requirement:** REQ-PERSISTENCE-04
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** save best 777, coins 33 dưới `duskrun.save.v1`
- **Bước:** mở trang; CÀI ĐẶT → bật tắt tiếng
- **Mong đợi:** 777 m / 33; khoá mới có 777/33/muted
- **Automated:** `tests/e2e/persistence/save-file.e2e.ts`

### TC-PERSISTENCE-005 — trình duyệt chặn localStorage thì game vẫn mở và chơi hết một lượt

- **Requirement:** REQ-PERSISTENCE-05
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** localStorage ném SecurityError
- **Bước:** chơi tới khi va chạm
- **Mong đợi:** màn kết thúc với KỶ LỤC MỚI, không lỗi trang
- **Automated:** `tests/e2e/persistence/save-file.e2e.ts`
