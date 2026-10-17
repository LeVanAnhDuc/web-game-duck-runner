# SHOP — test case

### TC-SHOP-001 — cửa hàng có bốn nhân vật kèm kỹ năng, Lữ khách đang dùng

- **Requirement:** REQ-SHOP-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** không save
- **Bước:** màn chính → CỬA HÀNG
- **Mong đợi:** 4 thẻ, mỗi thẻ `Kỹ năng: <tên>`, Lữ khách ĐANG DÙNG
- **Automated:** `tests/e2e/shop/buy-equip.e2e.ts`

### TC-SHOP-002 — ví vừa đủ giá thì MUA bật, ví thiếu thì MUA tắt và ghi còn thiếu bao nhiêu

- **Requirement:** REQ-SHOP-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** ví 80 (= giá Thợ ủi)
- **Bước:** mở cửa hàng
- **Mong đợi:** Thợ ủi: MUA bật, giá 80; Kẻ lượn: MUA tắt, `Còn thiếu 120`
- **Automated:** `tests/e2e/shop/buy-equip.e2e.ts`

### TC-SHOP-003 — ví thiếu đúng một xu thì nút MUA tắt và ghi Còn thiếu 1

- **Requirement:** REQ-SHOP-02
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** ví 79
- **Bước:** mở cửa hàng
- **Mong đợi:** Thợ ủi: MUA tắt, `Còn thiếu 1`
- **Automated:** `tests/e2e/shop/buy-equip.e2e.ts`

### TC-SHOP-004 — mua trừ đúng giá khỏi ví và thẻ chuyển sang CHỌN

- **Requirement:** REQ-SHOP-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke
- **Tiền điều kiện:** ví 100
- **Bước:** MUA Thợ ủi
- **Mong đợi:** ví 20, thẻ có CHỌN, save có `bruiser`, coins 20
- **Automated:** `tests/e2e/shop/buy-equip.e2e.ts`

### TC-SHOP-005 — bấm MUA hai lần thật nhanh chỉ trừ tiền một lần

- **Requirement:** REQ-SHOP-04
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** ví 500
- **Bước:** bấm đúp MUA Thợ ủi
- **Mong đợi:** ví 420 trên UI và trong save
- **Automated:** `tests/e2e/shop/buy-equip.e2e.ts`

### TC-SHOP-006 — CHỌN đổi nhân vật đang dùng và lựa chọn còn sau khi tải lại

- **Requirement:** REQ-SHOP-05
- **Layer:** e2e · **Priority:** P1
- **Tiền điều kiện:** sở hữu Lữ khách + Kẻ lượn
- **Bước:** CHỌN Kẻ lượn, tải lại, mở cửa hàng
- **Mong đợi:** Kẻ lượn ĐANG DÙNG, Lữ khách có CHỌN; còn sau tải lại
- **Automated:** `tests/e2e/shop/buy-equip.e2e.ts`

### TC-SHOP-007 — quay lại màn chính thì ví đã trừ tiền mua

- **Requirement:** REQ-SHOP-06
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** ví 1000
- **Bước:** MUA Kẻ trôi → Quay lại
- **Mong đợi:** ví màn chính 640
- **Automated:** `tests/e2e/shop/buy-equip.e2e.ts`

### TC-SHOP-008 — save chọn nhân vật lạ thì cửa hàng về Lữ khách đang dùng

- **Requirement:** REQ-SHOP-07
- **Layer:** e2e · **Priority:** P2
- **Tiền điều kiện:** save owned `[runner, ghost]`, selected `ghost`
- **Bước:** mở cửa hàng
- **Mong đợi:** 4 thẻ, Lữ khách ĐANG DÙNG
- **Automated:** `tests/e2e/shop/buy-equip.e2e.ts`
