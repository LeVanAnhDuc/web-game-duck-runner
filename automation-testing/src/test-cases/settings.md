# SETTINGS — test case

### TC-SETTINGS-001 — tắt toàn bộ âm thanh làm mờ hai thanh âm lượng và được nhớ sau khi tải lại

- **Requirement:** REQ-SETTINGS-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** không save
- **Bước:** CÀI ĐẶT → bật tắt tiếng → tải lại
- **Mong đợi:** hai thanh `disabled`, công tắc còn bật, save `muted: true`
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-002 — âm lượng nhạc nền và hiệu ứng được nhớ sau khi tải lại

- **Requirement:** REQ-SETTINGS-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** không save
- **Bước:** nhạc 20, hiệu ứng 0 → tải lại
- **Mong đợi:** mặc định 50/80; sau tải lại 20/0
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-003 — XOÁ TIẾN ĐỘ hỏi lại trước, HUỶ giữ nguyên tiến độ

- **Requirement:** REQ-SETTINGS-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** save có tiến độ
- **Bước:** XOÁ TIẾN ĐỘ → HUỶ
- **Mong đợi:** câu hỏi xác nhận hiện rồi ẩn, save không đổi
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-004 — xác nhận XOÁ đưa kỷ lục, ví và nhân vật về mặc định

- **Requirement:** REQ-SETTINGS-04
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** save best 321, coins 50, đang dùng Thợ ủi
- **Bước:** XOÁ TIẾN ĐỘ → XOÁ → Quay lại
- **Mong đợi:** save 0 / 0 / [runner] / runner; màn chính 0 m, 0
- **Automated:** `tests/e2e/settings/settings.e2e.ts`

### TC-SETTINGS-005 — hệ thống bật giảm chuyển động thì cài đặt nói rõ hiệu ứng trang trí đã tắt

- **Requirement:** REQ-SETTINGS-05
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** —
- **Bước:** mở cài đặt; bật `prefers-reduced-motion`, tải lại, mở cài đặt
- **Mong đợi:** không có ghi chú → có ghi chú
- **Automated:** `tests/e2e/settings/settings.e2e.ts`
