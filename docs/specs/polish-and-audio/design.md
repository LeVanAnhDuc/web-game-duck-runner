# M4 · Âm thanh và hoàn thiện — thiết kế

**Liên quan:** FR-27 · FR-28 · FR-29 · FR-30 · FR-33 · NFR-PERF-05…09 · NFR-A11Y-05 ·
NFR-REL-05 · ADR-0008

**Xong nghĩa là:** có âm thanh và nhạc nền tắt được, cài đặt nhớ giữa các phiên, các
ngưỡng hiệu năng có **số đo thật**, và có đường deploy.

## 1. Âm thanh không có file — `ADR-0008`

Tổng hợp toàn bộ bằng Web Audio, gỡ `howler`. Lý do ở ADR; hai điều dễ sai và cả hai
đều im lặng:

- `AudioContext` chỉ tạo ở **tương tác đầu tiên**. Tạo lúc tải trang thì nó ở trạng
  thái `suspended`, không âm nào phát, và không lỗi nào được ném.
- Nhạc nền lập lịch theo **đồng hồ của `AudioContext`**, không theo `setInterval`.
  `setInterval` bị giảm nhịp khi tab mất focus và nhạc sẽ giật khi quay lại.

Tiếng nhặt xu **tăng cao độ theo chuỗi liên tiếp** — thứ chỉ âm thanh tham số hoá làm
được, một bộ file cố định thì không.

## 2. Âm thanh đọc SỰ KIỆN, không đọc trạng thái

`GameHost` gắn vào `core/events`: `coinCollected` · `skillActivated` · `powerUpStarted`
· `shieldBroken` · `playerHit`. `game/` không biết `audio/` tồn tại — nếu nó biết thì
`game/` sẽ không chạy được trong Node nữa, và `ADR-0002` sụp.

## 3. Cài đặt

Dùng lại `data/save.ts`, không thêm key. Tắt tiếng thì hai thanh âm lượng **bị vô hiệu
kèm dấu hiệu thị giác** — không im lặng bỏ tác dụng.

Checkbox và thanh trượt **tự vẽ**: `accent-color` chỉ tô phần đã tích, còn ô chưa tích
vẫn là ô trắng mặc định của trình duyệt, lạc hẳn khỏi giao diện tối.

Xoá tiến độ có bước xác nhận. Đây là hành động không hồi lại được duy nhất trong game.

## 4. `prefers-reduced-motion` — `FR-30`

Đọc **một lần lúc khởi động** rồi truyền xuống, không theo dõi thay đổi: đổi giữa lượt
chơi sẽ phải dựng lại cảnh.

| Tắt gì | Giữ gì |
| --- | --- |
| Vạch cuộn trên mặt đường (`uStripes = 0`) | Vòng chơi — không thể tắt chuyển động chính của một runner |
| Rung camera khi va chạm | Toàn bộ luật chơi |
| Xu quay | Mọi chuyển động cần cho việc đọc tình huống |
| Trượt khi chuyển màn (CSS) | Mờ dần khi chuyển màn |

Màn cài đặt **nói ra** rằng hiệu ứng đã tắt, thay vì im lặng đổi hành vi.

## 5. Đo hiệu năng — biến `nfr.md` từ mục tiêu thành số đo

`NFR-PERF-05`…`09` được đặt ra ở M1 như **mục tiêu chưa đo**. Mốc này đo thật và ghi
kèm **điều kiện đo** — một con số không có điều kiện thì không kiểm lại được.

Công cụ: `__duskrun.stats()` (chỉ có ở bản dev) cho fps và draw call ·
`performance.memory` cho heap · `MutationObserver` cài trước khi trang tải cho thời
gian tới lúc chơi được · `pnpm build` cho kích thước bundle.

**Một giới hạn phải nói ra:** Chrome hạ `requestAnimationFrame` xuống ~1fps khi cửa sổ
bị che, kể cả khi `visibilityState` vẫn báo `visible`. Số fps chỉ có nghĩa khi tab
thật sự hoạt động, và các lần đo lặp lại cho 1fps là **nhiễu, không phải hồi quy**.

## 6. Deploy — `FR-33`

GitHub Actions build rồi đẩy lên Pages. `vite.config.ts` đặt `base: './'` nên bundle
chạy ở bất kỳ đường dẫn con nào.

Cổng kiểm chạy **trước** khi deploy: `lint` → `typecheck` → `test` → `build`. Một bản
hỏng không được lên sóng.

**Trạng thái thật:** workflow đã có, nhưng repo **chưa có remote**, nên chưa deploy lần
nào. `FR-33` giữ trạng thái *đang*, không phải *xong*.
