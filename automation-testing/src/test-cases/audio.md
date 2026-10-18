# AUDIO — test case

### TC-AUDIO-001 — không có âm thanh nào trước khi bấm CHƠI

- **Requirement:** REQ-AUDIO-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** trang mới
- **Bước:** mở trang, vào CÀI ĐẶT, quay lại
- **Mong đợi:** 0 context, 0 nguồn âm
- **Automated:** `tests/e2e/audio/audio.e2e.ts`

### TC-AUDIO-002 — bấm CHƠI mở âm thanh và nhạc nền bắt đầu

- **Requirement:** REQ-AUDIO-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** trang mới
- **Bước:** CHƠI
- **Mong đợi:** 1 context, > 0 nguồn âm
- **Automated:** `tests/e2e/audio/audio.e2e.ts`

### TC-AUDIO-003 — tắt toàn bộ âm thanh thì cả lượt không phát âm nào

- **Requirement:** REQ-AUDIO-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** save `muted: true`
- **Bước:** CHƠI, ↑, ↓, nút kỹ năng, chơi tới va chạm
- **Mong đợi:** 0 nguồn âm
- **Automated:** `tests/e2e/audio/audio.e2e.ts`
