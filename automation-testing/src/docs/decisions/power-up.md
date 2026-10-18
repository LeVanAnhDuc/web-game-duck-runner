# POWERUP — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-19, FR-20, FR-21 (và FR-22 tạm dừng)
- `../docs/01-product/glossary.md` (Power-up, Nam châm, Khiên, Tua nhanh, Hiệu ứng có thời hạn, Bất tử ngắn sau vỡ khiên)
- `../docs/specs/coins-and-skills/design.md` §5 (va chạm khi đang bất tử), §6 (tạm dừng), §7 (điều gì có thể sai)
- `../docs/03-design/invariants.md` §5 (mọi bộ đếm chạy theo đồng hồ mô phỏng)
- `../README.md` §Features ("Three power-ups on the road")
- `../client/src/game/Game.ts` (`spawnPowerUps`, `collide`, `collectCoins`, `collectPowerUps`), `../client/src/game/ActiveEffects.ts`, `../client/src/data/catalog.ts` (`POWERUP_DURATION_MS` 7000 / 4500, `RUSH_FACTOR` 1.45, `SHIELD_GRACE_MS` 900, `COIN_MAGNET_REACH_M`), `../client/src/game/constants.ts` (`POWERUP_EVERY_M` 620, `SPAWN_AHEAD_M` 95), `../client/src/views/Play/GameHost.ts` (`effectLabels`, `resume`), `../client/src/data/strings.ts` (`S.hud`)

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief follow-up F3, 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Power-up đầu tiên chỉ xuất hiện sau 310–620 m và được nhặt ~95 m sau đó (~35 s chơi), còn bản production không có `window.__duckRunner` để đọc state hay bật bất tử. Cách tới được: một **kế hoạch phím học trước** cho từng seed. `scripts/learn-powerup-runs.ts` chơi chính luật của client (`../client/src/game`) từng khung y như bản build chạy dưới `startRun` (seed lượt = lần gọi `Math.random` thứ 627 của trang, khung 64 ms, phím rơi vào bước đầu của khung sau) và tìm chuỗi phím sống tới power-up; spec phát lại chuỗi đó bằng `PlayPage.playFrames`. Mô hình đã kiểm khớp: lượt không input của seed 1 / 6 kết thúc ở 57 m / 70 m như `RUNS`, và mọi mốc khung trong `POWERUP_RUNS` đúng tới từng khung trên trình duyệt. Chốt bởi agent (user uỷ quyền). → mọi REQ
- **Q2** Không đọc được vị trí power-up trên canvas, nên "nhặt được" đọc qua chip HUD (`.effect-chip`, chữ từ `S.hud` + `" <giây>s"` do `GameHost.effectLabels` ghép). Chốt bởi agent (user uỷ quyền). → REQ-POWERUP-01, 02, 04, 06
- **Q3** "Bỏ qua một lần va chạm" chứng minh bằng một lượt không bấm phím sau khi nhặt khiên: cùng lượt đó không có khiên thì kết thúc ở khung 575 (đúng khung khiên vỡ), có khiên thì chip biến mất ở khung 575 mà lượt chạy tới khung 620 mới kết thúc. Bất tử ngắn 900 ms sau khi vỡ khiên không tách riêng được qua DOM — unit test giữ. Chốt bởi agent (user uỷ quyền). → REQ-POWERUP-05
- **Q4** "Bất tử" của tua nhanh chứng minh bằng lượt không bấm phím: không có tua nhanh thì kết thúc ở khung 566, có thì sống qua hết 4,5 s và kết thúc ở khung 661 sau khi hết. "Tăng tốc" đo bằng quãng đường của ~1 s trong tua nhanh so với ~1 s ngay trước khi nhặt, ngưỡng > 1,3 (hệ số 1,45; đà tăng tốc thường chỉ thêm ~2 % trong 2 s). Chốt bởi agent (user uỷ quyền). → REQ-POWERUP-06, 07
- **Q5** "Hút xu trong bán kính" (FR-19) không đo được bán kính trên canvas: so số xu cuối 7 s nam châm (37) với số xu của cùng chuỗi phím khi bỏ hiệu ứng nam châm (31, từ script). Test chỉ đòi lớn hơn 31. Chốt bởi agent (user uỷ quyền). → REQ-POWERUP-03
- **Q6** Thời lượng hiển thị: chip làm tròn lên (`Math.ceil`), nên nam châm bắt đầu `7s`, tua nhanh 4,5 s bắt đầu `5s`; khung cuối còn chip là `1s`. Chốt bởi agent (user uỷ quyền). → REQ-POWERUP-02, 06
- **Q7** Tạm dừng: khung đầu tiên sau CHƠI TIẾP không chạy bước nào (`GameHost.resume` đặt `lastMs = 0`), nên sau một lần tạm dừng mọi mốc trễ đúng một khung (`pausedExpiredFrame` 674 thay vì 673). Đó là hành vi đúng (không mất thời gian hiệu ứng), không phải bug. Chốt bởi agent (user uỷ quyền). → REQ-POWERUP-08

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game.

## Ngoài phạm vi

- Hai power-up cùng loại gia hạn chứ không cộng dồn, nhặt power-up trong lúc Bay, bất tử ngắn 900 ms sau khi vỡ khiên, khoảng cách sinh power-up — unit test `../client/tests/game/effects.test.ts` (cần nhiều power-up trong một lượt hoặc đọc state).
- Hình power-up trên đường và âm `powerup` — canvas / Web Audio, không có DOM để đọc.

## Tech debt liên quan

- `POWERUP_RUNS` gắn với số liệu cân bằng và số lần gọi `Math.random` trước khi bấm CHƠI của bản build hiện tại (giống `RUNS`). Đổi cân bằng, đổi `patterns.ts` hay nâng Three.js thì chạy lại `scripts/learn-powerup-runs.ts` (hướng dẫn ở đầu file) và dán kết quả.
