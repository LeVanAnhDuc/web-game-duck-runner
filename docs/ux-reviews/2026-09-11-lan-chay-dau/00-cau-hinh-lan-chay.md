# Cấu hình lần chạy — 2026-09-11 run1

## Đích

**Bản live trên GitHub Pages:** <https://levananhduc.github.io/web-game-duck-runner/>

Người dùng chọn đích này. Dev server không chạy (`:5173` và `:5174` đều không trả lời), và
`lib/orchestration.md` cấm orchestrator tự bật app.

Đối chiếu dấu hiệu nhận biết **trước** khi phát brief đầu tiên, đạt: wordmark `DUCK` / `RUNNER`
hai dòng · tagline *"Ba làn. Một kỹ năng. Một con đường qua vực."* · ba nút
`CHƠI` · `CỬA HÀNG` · `CÀI ĐẶT`.

⚠️ Đây là bản **production**, không có `window.__duckRunner`. Nếu `main` có commit chưa deploy
thì lần chạy này không mô tả working tree. Không kiểm được điều đó từ phía trình duyệt.

## Công cụ trình duyệt: hạng 2 — `chrome-devtools-mcp`

**Tụt một hạng so với mặc định của `lib/browser-capability.md`.** Lý do là năng lực, không phải
sở thích:

| Năng lực bắt buộc | playwright (hạng 1) | chrome-devtools (hạng 2) |
| --- | --- | --- |
| điều hướng · click · nhập liệu · chụp màn hình · đọc console · đặt viewport | ✅ | ✅ |
| **throttle mạng** | ❌ không có tool | ✅ `networkConditions: "Slow 4G"` |
| **giả lập cảm ứng thật** (`mobile,touch`) | ❌ chỉ đổi kích thước cửa sổ | ✅ `viewport: "…,mobile,touch"` |

`browser-capability.md` cấm degrade âm thầm. Thiếu throttle thì p04 (bà Liên, Slow 4G) thành
một persona hoàn toàn khác; thiếu `touch` thì hai persona điện thoại vuốt bằng chuột trên một
trang vẫn nghĩ mình đang ở desktop. Cả hai đều là kiểu hỏng mà báo cáo **vẫn trông hợp lý** —
đúng thứ tệ nhất mà file đó cảnh báo.

## Ba điều làm giảm giá trị kết quả — phải chép sang §Ghi chú của báo cáo

**1. Tuần tự, không song song.** Hạng 2 là một instance trình duyệt, một profile. `localStorage`
dùng chung theo origin giữa mọi tab, nên hai phiên chạy cùng lúc sẽ giẫm lên ví xu và kỷ lục
của nhau. Trần "4 phiên đồng thời" của `lib/orchestration.md` hạ xuống **1**. Mỗi phiên tự
`localStorage.clear()` ở bước dựng cảnh.

**2. Agent chạy bằng `general-purpose`, không phải `ux-persona`.** Thử dispatch `ux-persona`
trả về `Agent type 'ux-persona' not found` — file `.claude/agents/*.md` sinh lúc cài **không
được nạp nóng** (skill thì có, agent thì không). Dùng đường vòng đã ghi sẵn ở `SKILL.md`
§Nếu không khởi động lại được.

- **Giữ được:** tính mù. `general-purpose` là agent context sạch, không thừa kế gì từ phiên
  orchestrator — đó là thứ duy nhất bắt buộc.
- **Mất:** giới hạn tool. `general-purpose` có `Read`/`Grep`, tức **đọc được source của chính
  game**. Bù bằng một luật tuyệt đối đặt ở đầu mỗi brief; nhưng đó là lời dặn, không phải
  hàng rào. Phiên sau khi khởi động lại Claude Code sẽ chặt hơn.
- **Mất:** model cố định ở Sonnet theo định nghĩa agent (vẫn ép `model: sonnet` ở mỗi dispatch).

**3. Độ trễ tool.** `SKILL.md` §1. Persona không chơi giỏi được và sẽ chết sớm. Kết luận về
**hiểu hay không hiểu** có hiệu lực; kết luận về **độ khó, nhịp game, `REACTION_MIN_MS`**
không có hiệu lực và không được viết ra.

## Bảng phiên

| # | Route | Persona | emulate |
| --- | --- | --- | --- |
| 1 | RR-01 | p01 Mai | `390x844x3,mobile,touch` · Fast 4G |
| 2 | RR-02 | p01 Mai (context sạch lại) | `390x844x3,mobile,touch` · Fast 4G |
| 3 | RR-03 | p03 Hạnh | `1440x900x1` · không throttle · **chỉ bàn phím** |
| 4 | RR-04 | p05 Daniel | `1280x800x1` · không throttle · **ví nạp sẵn 240 xu** |
| 5 | RR-05 | p02 Tuấn | `1440x900x1` · không throttle |
| 6 | mù | p04 bà Liên | `360x740x2,mobile,touch` · **Slow 4G** |
| 7 | mù | p06 Vũ | `1920x1080x1` · không throttle |
