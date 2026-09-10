# Kế hoạch · Rừng sương sớm

> Đọc `design.md` cùng thư mục trước. Ô tick ở đây là phòng tuyến chống nén context:
> đọc lại file này là biết đang ở task nào, không phải đoán từ diff.

## Đợt 1 — không tải gì từ mạng

- [x] **T1 · Bảng màu** — `src/render/palette.ts` nhận token mới ở `design.md` §4.
      Xoá `SKY_*` và `INK` khỏi phần dùng cho cảnh 3D. `RIM` thành `PLAYER_RIM`.
- [x] **T2 · Test tương phản là cổng CI** — `tests/render/contrast.test.ts` tính tương
      phản WCAG trên chính các hằng trong `palette.ts` và đòi 13 cặp ở `design.md` §4.
      Viết TRƯỚC T1 để nó đỏ trước.
- [x] **T3 · Sương và nền cảnh** — `Scene.ts`: `Fog` màu `--mist-far`, texture nền dọc
      vẽ bằng canvas (sương sáng ở chân trời, tối dần lên tán).
- [x] **T4 · Vực và gờ đường** — thêm nhánh vào shader mặt đường: `|x| < ROAD_HALF_M`
      là đường, ngoài ra là vực, và một dải sáng ở đúng mép. Không thêm draw call.
- [x] **T5 · Texture mặt đường** — noise + đốm sỏi vẽ bằng canvas, nhân vào màu đường.
- [x] **T6 · Thân cây gần** — `src/render/Scenery.ts`: pool + `InstancedMesh`, cuộn
      theo thế giới, vị trí suy ra từ hàm băm của khoảng cách (không cấp phát trong
      vòng lặp — bất biến #9).
- [x] **T7 · Tầng cây xa và tán** — mặt phẳng alpha vẽ bằng canvas, parallax chậm hơn.
- [x] **T8 · Chướng ngại mới** — `Shapes.ts`: khúc gỗ / dây leo / cột đá. Hộp bao
      **không đổi**. Test: hình mới vẫn nằm trong hộp bao cũ.
- [x] **T9 · Cạnh sáng** — `InstancedMesh` thứ hai mỗi loại chướng ngại, và vòng tối
      quanh xu. `Renderer.ts` phải set `count` cho từng mesh mới (bất biến #13 cũ).
- [x] **T10 · Viền vịt sáng lên** — `PLAYER_RIM = #FFD9A8`.
- [x] **T11 · Màn hình 2D** — `styles.css`: token mới, scrim 0.55, gradient đặc trưng
      đổi màu. Bố cục không đổi.
- [x] **T12 · Tagline và chuỗi** — `strings.ts`.
- [x] **T13 · Đo lại** — draw call, fps, bundle, thời gian tới lúc chơi được. Ghi số
      thật vào `nfr.md`. Không được ghi số chưa chạy ra.
- [x] **T14 · Xem bằng mắt** — chụp 375 / 768 / 1024 / 1440 trên app thật, kiểm cả
      `prefers-reduced-motion`.

## Đợt 2 — ảnh CC0 thật

- [x] **T15 · Tìm nguồn** — chỉ CC0 / phạm vi công cộng. Ghi
      `docs/assets/CREDITS.md`: nguồn, tác giả, giấy phép, kích thước.
- [x] **T16 · Tải sau frame đầu** — `src/render/TextureStream.ts`: chỉ chạy sau khi
      frame đầu đã vẽ, thay `map` vào vật liệu đang chạy, bỏ qua khi
      `navigator.connection.saveData`.
- [x] **T17 · Ảnh nền cho màn 2D.**
- [x] **T18 · Đo lại `NFR-PERF-07`** — phải chứng minh ảnh KHÔNG nằm trên đường tải
      tới frame đầu, không chỉ nói vậy.

## Tài liệu — viết ngay lúc làm, không để cuối

- [x] `ADR-0009` hướng nghệ thuật mới, `ADR-0006` → `superseded`
- [x] `ADR-0010` ảnh thật tải sau, `ADR-0007` → `superseded`
- [x] `MASTER.md` bảng màu, scrim 0.55, yếu tố đặc trưng, luật hai lớp
- [x] `scope.md` FR-34 … FR-40, mốc M5
- [x] `nfr.md` thêm `NFR-A11Y-07`, `NFR-PERF-10`, cập nhật số đo
- [x] `invariants.md` bất biến #14 (luật hai lớp)
- [x] `glossary.md` sương · vực · tán · gờ đường · cạnh sáng
- [x] `README.md` đầu đề, `## Features`, ảnh chụp mới
- [x] `backlog.md` §Đang làm
