# SKILL — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-SKILL-01](#bug-skill-01) | Trung bình | TC-SKILL-004 | Space khi thanh nạp chưa đầy không có phản hồi nào |

### BUG-SKILL-01

- **TC:** TC-SKILL-004 · **Requirement:** REQ-SKILL-04
- **Tìm thấy:** 2026-10-18, lúc dựng bộ hồi quy (bản build production của `main` + PR #9)
- **Bước tái hiện:** Bắt đầu lượt (thanh nạp rỗng) → bấm Space.
- **Mong đợi:** Nút kỹ năng rung một nhịp (và âm `deny`) như khi bấm nút kỹ năng — MASTER §7.5, US-03, NFR-A11Y-06.
- **Thực tế:** Im lặng: không rung, không âm. Space đi vào `Game.queue({ skill })` → `Game.useSkill()` trả false trong `step()`, không qua `GameHost.useSkill()` nơi có `hud.nudge()` + `audio.play('deny')` (`client/src/core/input.ts`, `client/src/game/Game.ts`, `client/src/views/Play/GameHost.ts`).

## Đã sửa

_(chưa có)_
