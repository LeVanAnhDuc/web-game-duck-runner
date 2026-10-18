# Test đã gom về lúc scaffold

Không có gì để gom. App chưa từng có bộ test cấp hệ thống: không `playwright.config.*`, không `e2e/`, không
`cypress/`, không `e2e.md` / `e2e-bugs.md`. Thư mục `tests/` của app (giờ là `client/tests/`) là unit + component test
Vitest — chúng thuộc về code nên ở lại `client/`.

| Từ | Về | Trạng thái |
|---|---|---|
| — | — | — |

## Còn trỏ về nơi cũ

- `docs/specs/ducker-id-sign-in/design.md` §4 ("Không e2e — repo không có Playwright") — tài liệu lịch sử (đã ship), giữ
  nguyên văn. E2E của tính năng đó giờ ở `src/tests/e2e/ducker-id/`.
