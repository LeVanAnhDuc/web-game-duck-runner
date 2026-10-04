# Đăng nhập Ducker ID — thiết kế (duck-runner)

**Liên quan:** FR-41 · US-06 · NFR-SEC-03 · NFR-DATA-05 · NFR-PERF-09 · ADR-0012

**Spec chung (hành vi, copy, env, test):**
`web-game/docs/superpowers/specs/2026-10-04-ducker-id-sign-in-design.md` — file này chỉ
ghi phần riêng của repo.

**Xong nghĩa là:** cờ + 4 biến bật thì có nút đăng nhập và menu tài khoản đúng spec §3;
thiếu một biến thì game y hệt bản cũ; `deploy.yml` không truyền cờ.

## 1. Chỗ đặt và giao diện

- **Slot:** `views/Play/components/MenuScreen`, **ngay dưới** hàng Cửa hàng / Cài đặt, rộng
  bằng hàng đó. Spec nói "cùng hàng", nhưng ba nút ghost cộng nhãn "Đăng nhập" cần ~410px
  mà khung 375 chỉ có 327px (đã chụp: tràn). Cờ tắt thì không có phần tử nào, bố cục không đổi.
- **Nút:** `.btn .btn-ghost` (bo 12, cao 48). Đã đăng nhập: avatar tròn 32px (`--text` nền,
  `--ink` chữ, hoặc ảnh) + tên, mở menu **lên trên** vì nút nằm sát đáy màn.
- **Menu:** panel `--surface-raised` bo 16, tên + email + đường kẻ dải sương, hai mục
  "Mở hồ sơ Ducker ID" (`target=_blank rel="noopener noreferrer"`) và "Đăng xuất".
  Esc / bấm ngoài / chọn mục thì đóng; Esc trả focus về nút. Vàng chỉ cho xu và CTA chính,
  aqua chỉ cho kỹ năng (vòng focus vẫn aqua theo MASTER) nên không màu mới.
- **Chuỗi:** `S.account` trong `src/data/strings.ts` (chỉ tiếng Việt).
- **Icon:** `IconUser`, `IconExternal`, `IconSignOut` trong `components/icons` (SVG nội tuyến).

## 2. Tệp

`src/auth/{types,config,pkce,duckerAuth,request,duckerSession,initials}.ts` ·
`src/hooks/{useDuckerAuth,useAccountMenu,index}.ts` · `src/components/AccountButton/index.tsx`.
`src/main.tsx` import `./auth/duckerSession` đầu tiên. Quy ước repo (R-14: không `src/types/`,
R-01: mỗi vai trò một thư mục) nên auth nằm gọn trong `src/auth/`, không rải qua
`constants/ libs/ requests/`. Test ở `tests/auth/` và `tests/ui/accountButton.test.tsx`
(`vitest.config.ts` chỉ nhận `tests/**`).

## 3. Ngoại lệ NFR và bundle

Xem `ADR-0012` và `nfr.md` (`NFR-SEC-03`, `NFR-DATA-05`). Repo không có test grep/mạng cần
allowlist. Bundle JS gzip 181.5 kB / 250 kB (`NFR-PERF-09`).

## 4. Không làm

Không e2e (repo không có Playwright; kiểm tay + ảnh chụp 375/768/1440). Không lưu profile.
Không đổi save, điểm, cài đặt.
