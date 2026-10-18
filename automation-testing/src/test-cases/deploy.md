# DEPLOY — test case

### TC-DEPLOY-001 — trang chỉ nạp script của chính site, không script bên thứ ba

- **Requirement:** REQ-DEPLOY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** —
- **Bước:** mở trang
- **Mong đợi:** mọi script cùng origin, 0 script nội tuyến
- **Automated:** `tests/e2e/deploy/static-site.e2e.ts`

### TC-DEPLOY-002 — không request nào ra ngoài site ngoài Google Fonts

- **Requirement:** REQ-DEPLOY-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** —
- **Bước:** mở trang, CHƠI
- **Mong đợi:** không request ngoài origin trừ fonts.googleapis/gstatic
- **Automated:** `tests/e2e/deploy/static-site.e2e.ts`

### TC-DEPLOY-003 — mọi tài nguyên của trang nạp được dưới đường dẫn gốc của site

- **Requirement:** REQ-DEPLOY-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** —
- **Bước:** mở trang, chờ ảnh
- **Mong đợi:** không response ≥ 400, mọi URL của site bắt đầu bằng baseURL
- **Automated:** `tests/e2e/deploy/static-site.e2e.ts`
