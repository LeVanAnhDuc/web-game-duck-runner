# Thuật ngữ

> **Trả lời:** Khái niệm này gọi là gì trong code, và hiện ra sao trên UI?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** xuất hiện một khái niệm nghiệp vụ mới trong code hoặc UI

<!-- CÁCH ĐIỀN
File này KHOÁ TÊN. Một khái niệm có ba tên — tên nghiệp vụ, tên trong code, tên
trên UI — và ba tên đó phải khớp mãi mãi. Đổi tên ở một chỗ mà không đổi ở đây là
cách chắc chắn nhất để sáu tháng sau không ai biết `Track` và "đường chạy" là một.

KHÔNG chứa: mô tả chức năng (-> 02-requirements/scope.md).
-->

| Khái niệm | Tên trong code | Hiện trên UI | Ghi chú |
| --- | --- | --- | --- |
| Lượt chơi | `Game`, `RunPhase` | — | Một lần từ lúc bấm Chơi tới lúc chết |
| Nhân vật người chơi | `Player` | — | Chỉ số cơ bản giống nhau giữa mọi nhân vật (`ADR-0004`) |
| Làn đường | `lane`, `LANE_CENTER` | — | 0 trái · 1 giữa · 2 phải. Toạ độ = `(lane - 1) × LANE_WIDTH_M` |
| Vị trí thật của nhân vật | `Player.x` | — | Nội suy giữa `laneFrom` và `laneTo`. Va chạm đọc cái này (`invariants.md` §1) |
| Đường chạy | `Track` | — | Pool chướng ngại · xu · power-up |
| Cụm chướng ngại | `Pattern` | — | Một lưới ô × làn, có nhãn `tier`. Dữ liệu, không phải code |
| Ô trong cụm | `slot` | — | Cách nhau `PATTERN_SLOT_GAP_M` mét |
| Chướng ngại thấp | `'low'` | — | Nhảy qua |
| Chướng ngại cao | `'high'` | — | Trượt dưới |
| Khối chắn | `'block'` | — | Chỉ đổi làn được |
| Bộ sinh | `Spawner` | — | Quyết định khi nào đặt cụm tiếp theo |
| Bộ chứng minh giải được | `PatternSolver` | — | Chạy chính `Player` và `Collision` của bản phát hành |
| Xu | `Coin`, `scoring.coins` | biểu tượng xu + số | Vừa nạp thanh vừa vào ví (`invariants.md` §11) |
| Ví xu | `SaveData.coins` | **Ví** | Cộng vào cuối lượt |
| Thanh nạp | `chargeCoins`, `chargePct` | thanh ngang dưới HUD | Đầy ở `CHARGE_COINS` xu |
| Kỹ năng nhân vật | `SkillDef`, `useSkill()` | **Kỹ năng** | Chủ động, người chơi chọn thời điểm |
| Kỹ năng Ủi | `'ram'` | **Ủi** | Húc vỡ chướng ngại |
| Kỹ năng Chậm | `'slow'` | **Chậm** | Giảm tốc độ thế giới |
| Kỹ năng Bay | `'fly'` | **Bay** | Bay qua và hút xu |
| Power-up | `PowerUp`, `PowerUpKind` | chip trong HUD | Bị động, nhặt trên đường |
| Nam châm | `'magnet'` | **Nam châm** | Mở rộng bán kính hút xu |
| Khiên | `'shield'` | **Khiên** | Đếm **lần**, không đếm giờ |
| Tua nhanh | `'rush'` | **Tua nhanh** | Bất tử và tăng tốc |
| Hiệu ứng có thời hạn | `ActiveEffects` | — | Dùng chung cho kỹ năng và power-up |
| Bất tử | `effects.invincible` | — | Gộp mọi nguồn vào một câu hỏi |
| Bất tử ngắn sau vỡ khiên | `graceUntilMs` | — | Xem `specs/coins-and-skills/design.md` §5 |
| Đồng hồ mô phỏng | `SimClock` | — | Tạm dừng dừng nó (`invariants.md` §5) |
| Quãng đường | `scoring.distanceM` | số kèm **m** | Tính theo tốc độ **thế giới**, không theo tốc độ danh nghĩa |
| Kỷ lục | `SaveData.bestDistanceM` | **Kỷ lục** | Lưu trên máy, không có bảng xếp hạng |
| Hình bóng | `Silhouette`, `SILHOUETTES` | — | Thứ duy nhất phân biệt các nhân vật (`ADR-0009`, `ADR-0010`) |
| Viền ấm | `PLAYER_RIM`, `outlineOf` | — | Chỉ nhân vật được có; màu **ấm** duy nhất trong cảnh (`MASTER §1`) |
| Luật hai lớp | `HAZARD` + `HAZARD_EDGE` | — | Thân tối + cạnh sáng (`invariants.md` §14, `ADR-0009`) |
| Sương | `MIST_FAR`, `MIST_NEAR`, `THREE.Fog` | — | Điểm sáng nhất của cảnh; là thứ bảo đảm mọi vật thể có nền sáng |
| Tán lá | `CANOPY`, `canopyTexture` | — | Mặt phẳng alpha trên đầu, cuộn chậm hơn mặt đường |
| Vực | `CHASM` | — | **Hình ảnh, không phải luật chơi**: không rơi xuống được (`FR-34`) |
| Gờ đường | `LIP_M`, `causewayFaces` | — | Dải sáng ở mép cộng mặt đứng — thứ khiến con đường đọc ra là một cây cầu |
| Cạnh sáng | `HAZARD_EDGE` | — | Đặt đúng ở đường biên người chơi phải vượt |
| Tầng lá xa | `jungle-far.webp` | — | Ảnh CC0 thật, chỉ vẽ **trên** đường chân trời (`ADR-0010`) |
