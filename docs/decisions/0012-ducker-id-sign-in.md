# ADR-0012 · Đăng nhập Ducker ID tuỳ chọn, phát hành "tối" sau cờ tính năng

> **Ngày:** 2026-10-04
> **Trạng thái:** accepted
> **Liên quan:** FR-41 · US-06 · NFR-SEC-03 · NFR-DATA-05 · NFR-PERF-09

## 1. Bối cảnh

Người dùng (chủ repo) yêu cầu 2026-10-04: mọi game trong `web-game/` có thêm "Đăng
nhập bằng Ducker ID", cùng cơ chế với `web-app-calculate-badminton` (OIDC Authorization
Code + PKCE, public client). Game này không có backend và không có tài khoản riêng
(Non-Goal ở `overview.md`), nên đăng nhập chỉ có thể là **định danh**, không đồng bộ
dữ liệu. Spec chung: `web-game/docs/superpowers/specs/2026-10-04-ducker-id-sign-in-design.md`.

## 2. Quyết định

Thêm nút đăng nhập + menu tài khoản (tên, email, "Mở hồ sơ Ducker ID", "Đăng xuất"),
chỉ định danh; save, điểm, cài đặt không đổi. **Phát hành tối:** code vào `main` nhưng
chỉ hiện khi `VITE_FEATURE_DUCKER_SIGN_IN=true` **và** đủ `VITE_DUCKER_ISSUER`,
`_CLIENT_ID`, `_SCOPE`, `_PROFILE_PATH`. `deploy.yml` không truyền cờ lẫn các biến này,
nên GitHub Pages không bao giờ thấy nút. Không có giá trị mặc định nào trong code.
Profile chỉ nằm trong bộ nhớ (tải lại = đăng xuất). `vite.config.ts` đọc `base` từ
`VITE_BASE_PATH` thay cho `'./'` (redirect_uri cần đường dẫn gốc xác định).

**Ngoại lệ NFR có giới hạn** (chỉ khi cờ bật): chỉ dùng key `sessionStorage`
`ducker.pkce`, xoá khi quay về; mạng chỉ tới issuer đã cấu hình, và tới URL ảnh đại diện
mà issuer trả về (có thể ở host khác, ảnh không bị giới hạn), chỉ sau khi đăng nhập; cờ tắt thì không đọc URL, không chạm storage, không request.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Lưu token/profile vào `localStorage` | Mở rộng bề mặt dữ liệu; tải lại = đăng xuất là đủ cho "chỉ định danh" |
| Bật thẳng ở bản deploy | Chưa đăng ký client ở Ducker ID cho game; chủ repo chọn phát hành tối |
| Thư viện OIDC (oidc-client-ts) | Thêm dependency cho ~100 dòng đã có bản tham chiếu ở badminton |

## 4. Hệ quả

**Được:** đường đăng nhập sẵn sàng bật bằng biến môi trường, không đụng code; bản deploy
không đổi hành vi. Bundle JS gzip 181.5 kB (ngưỡng `NFR-PERF-09` 250 kB). Không thêm
dependency nào.

**Mất / phải chấp nhận:** `NFR-SEC-03`, `NFR-DATA-05` thành ngoại lệ có điều kiện.
**Nợ `[skip release]`:** mọi commit của nhánh mang `[skip release]`, và `release.yml`
quét cả khoảng từ tag gần nhất, nên mọi lần push `main` sau đó cũng bị bỏ qua cho tới
khi có tag mới. Lần phát hành thật kế tiếp phải cắt tay một lần:
`pnpm release:next` → `git tag vX.Y.Z && git push origin vX.Y.Z` →
`gh release create vX.Y.Z --notes "$(pnpm -s release:notes)"`. Sau đó tự động hoá chạy lại.

**Điều kiện xem lại:** khi bật ở bản deploy (đăng ký client, truyền biến trong
`deploy.yml`), hoặc khi cần lưu dữ liệu gắn với tài khoản.
