---
name: ux-persona-review
description: Use when you want to know how a real stranger experiences Duck Runner — dispatches blind persona subagents that actually drive the running game in a browser, then returns UX findings mapped to ISO 9241-11, LATCH, trigger words, interaction design, visual hierarchy and form design, every finding backed by a quote from a session log. Trigger on "chay persona", "test UX", "nguoi choi that thay sao", "UX review", "red route", or before opening a PR that changes user-facing behaviour.
---

# Duck Runner — UX persona review

## Sản phẩm này

- Thư mục: `D:/Learn/web-app-ecosystem/web-game/web-game-endless-runner`
- Port: **`:5173`** — mặc định của Vite, `vite.config.ts` không đặt `server.port`
- Bật app: `npm ci` rồi `npm run dev` (**npm, không phải yarn**)
- Bản live, không cần bật gì: <https://levananhduc.github.io/web-game-duck-runner/>
- Dấu hiệu nhận biết đúng app: wordmark **DUCK / RUNNER** hai dòng, dưới nó là câu
  *"Ba làn. Một kỹ năng. Một con đường qua vực."*, rồi ba nút **CHƠI · CỬA HÀNG · CÀI ĐẶT**.
  Ở bản dev còn có `window.__duckRunner`.
- Email dùng-một-lần: **không dùng**. Game không có form, không có tài khoản, không có
  backend (`docs/01-product/overview.md` §Non-Goals). Persona nào đòi nhập email là đang
  bịa ra một màn hình không tồn tại.
- Tài khoản thử: **không có**, cùng lý do.

⚠️ **`:5173` là port mặc định của Vite, và 12 game cạnh nhau trong `web-game/` đều là Vite.**
Vite tự nhảy sang `5174`, `5175`… khi port bị chiếm, nên **số port không chứng minh được
điều gì** — luôn đối chiếu wordmark ở trên trước khi phát brief cho persona. Đây là bản địa
phương của cái bẫy `:5300` giữa Match CV và Shorten Link ở workspace gen-1.

## Chạy

Toàn bộ quy trình nằm ở `lib/orchestration.md`. Đọc nó trước, rồi làm theo.

Dữ liệu riêng của sản phẩm này:

| Cần gì | Ở đâu |
| --- | --- |
| Red Route đã chốt | `references/red-routes.md` |
| Dàn persona | `references/personas/` |
| Rule đã dùng để sinh persona | `references/persona-rules.md` |
| Khung đánh giá, luật xếp hạng | `lib/frameworks.md` |
| Thứ tự công cụ trình duyệt | `lib/browser-capability.md` |

## Ba điều chỉ đúng với game này

Ba mục dưới đây **ghi đè** phần tương ứng trong `lib/`. Chúng là lý do skill này được cá thể
hoá cho một game thời gian thực chứ không phải một CRUD app.

### 1. Độ trễ tool là một biến của phép đo, không phải nhiễu bỏ qua được

Persona điều khiển bằng tool call. Mỗi call mất hàng trăm ms, còn game chạy 60fps và
`REACTION_MIN_MS = 620`. Nghĩa là **persona không thể chơi giỏi** — nó sẽ chết sớm, gần như
luôn luôn.

Đừng chữa bằng cách nâng trần hành động, và **đừng kết luận game quá khó** từ số mét chạy
được. Chia làm hai loại kết luận:

| Kết luận | Có hiệu lực? |
| --- | --- |
| hiểu được phải làm gì trong 10 giây đầu · đọc được chữ · thấy được nút · biết mình vừa chết vì cái gì · tìm được đường vào cửa hàng | **có** — không phụ thuộc phản xạ |
| game khó hay dễ · `REACTION_MIN_MS = 620` hợp lý chưa · nhịp sinh chướng ngại | **không** — chỉ người thật trả lời được |

Loại thứ hai vẫn đang nằm ở `docs/04-state/backlog.md` §Việc tiếp theo, ưu tiên **cao**, và
**skill này không đóng được việc đó**. Nó thu hẹp việc đó lại: 5 người thật kia không nên
phải tiêu lượt thử của mình vào những thứ persona đã tìm ra.

Mọi báo cáo **phải** ghi câu này vào §Ghi chú về chính lần chạy này.

### 2. Chết là một kết quả hợp lệ, không phải một phiên thất bại

Trong một endless runner, chết là cách vòng chơi kết thúc. Một phiên chạy được 40 m rồi chết
rồi thấy màn kết thúc là phiên **thành công** — nó đã đi hết `RR-01`. Điều kiện dừng vẫn theo
`lib/orchestration.md`; chỉ có cách đọc kết quả là khác.

Cái đáng ghi lại là **persona nghĩ gì lúc chết**: có biết vừa vấp cái gì không, có biết làm gì
tiếp không. Đó chính là `NFR-A11Y-07` và `ADR-0009` nhìn từ phía người chơi — hai lỗi hình ảnh
nặng nhất của dự án đều do người chơi thật tìm ra, không test nào bắt được
(`docs/04-state/backlog.md` §Đang làm).

### 3. Nạp sẵn `localStorage` là fixture, không phải mách nước

`RR-04` (cửa hàng) cần **80 xu** cho nhân vật rẻ nhất, mà nhịp kiếm xu đo được là
**29.8 xu/phút** — tức ~2.7 phút chơi liên tục, điều mà mục 1 vừa nói là bất khả.

Cách xử lý: **ghi sẵn save data trước khi persona mở trang.** Bối cảnh của `US-04` vốn đã là
*"đã chơi vài lượt, ví có xu"* — nạp ví không cho persona biết thêm bất cứ điều gì về UI, nên
nó **không phá tính mù**. Nói cho persona biết nút CỬA HÀNG ở đâu thì mới phá.

```js
localStorage.setItem('duck-runner.save.v1', JSON.stringify({
  version: 1, bestDistanceM: 320, coins: 240,
  ownedCharacters: ['runner'], selectedCharacter: 'runner',
  muted: false, musicVolume: 0.5, sfxVolume: 0.8,
}))
```

Chạy trước khi điều hướng, và **ghi vào log của phiên đó** là ví đã được nạp sẵn. Persona nào
không cần xu thì mở context sạch — mặc định là ví 0 xu, kỷ lục 0 m.

Khoá và schema lấy từ `src/data/save.ts`. Đổi ở đó thì sửa lại đoạn trên; ghi sai schema thì
`readSave()` trả về mặc định và persona sẽ báo cáo một cửa hàng trống rỗng một cách hợp lý.

## Hai agent

`ux-persona` (Sonnet, chỉ có trình duyệt) đóng vai người chơi.
`ux-expert` (Opus, chỉ có Read) dịch log sang khung đánh giá — `Read` đọc được cả ảnh PNG,
nên nó xem được ảnh chụp mà không cần tool trình duyệt.

Cả hai định nghĩa ở `D:/Learn/web-app-ecosystem/web-game/web-game-endless-runner/.claude/agents/`.
Nếu Claude Code báo không tìm thấy agent type, phiên hiện tại được mở trước khi hai file đó
tồn tại — khởi động lại phiên. Cách chạy vòng qua được ghi ở §Nếu không khởi động lại được.

Tên tool trình duyệt trong workspace này là `mcp__plugin_playwright_playwright__*` và
`mcp__plugin_chrome-devtools-mcp_chrome-devtools__*` — **không** phải `mcp__playwright__*`
như template gốc của máy phát. Dòng `tools:` trong `ux-persona.md` đã sửa theo. Chạy
`install.sh --update` sẽ ghi đè lại bằng tên sai; sửa lại sau mỗi lần update.

### Nếu không khởi động lại được

Dispatch `subagent_type: general-purpose` và dán nguyên brief từ `lib/persona-brief.tpl` vào
prompt. Agent đó có context sạch, nên **tính mù vẫn giữ được** — đó là thứ duy nhất bắt buộc.
Mất hai thứ, phải ghi vào báo cáo: nó không bị giới hạn tool (phải tự dặn trong brief là chỉ
dùng trình duyệt) và nó không chạy Sonnet.

## Bảo trì

Nâng cấp phần logic: `bash D:/Learn/web-app-ecosystem/.claude/skills/ux-persona-lab/scripts/install.sh D:/Learn/web-app-ecosystem/web-game/web-game-endless-runner --update`
Lấy lại rule persona mới: cùng lệnh với `--refresh-rules`.
Cả hai đều **không** đụng tới `red-routes.md` và `personas/`.

Sau `--update`, kiểm hai chỗ mà bản gốc của máy phát sẽ ghi đè mất: dòng `tools:` trong
`.claude/agents/ux-persona.md`, và §Ba điều chỉ đúng với game này ở file này.

## Báo cáo đi đâu trong repo này

`lib/orchestration.md` §Báo cáo đi đâu vẫn đúng, thêm một ràng buộc của dự án: dự án dùng
**nhánh thường rẽ từ `main`**, không dùng worktree cho từng mốc (`backlog.md` §Nợ kỹ thuật).
Ngoài nhánh feature thì báo cáo về `docs/ux-reviews/YYYY-MM-DD-<scope>.md`.

Thư mục đó **chưa tồn tại** và không thuộc hai tầng tài liệu trong `.claude/CLAUDE.md` — nó là
tầng thứ ba: sản phẩm đo được của một lần chạy, không phải tài liệu thường trực và cũng không
phải tài liệu của một feature. Không có header 4 dòng, không có mã ID cấp mới. Phát hiện nào
đủ nặng để thành việc phải làm thì **chuyển thành `FR-` hoặc `NFR-` mới trong `scope.md` /
`nfr.md`**, rồi báo cáo chỉ còn là dẫn chứng cho nó.
