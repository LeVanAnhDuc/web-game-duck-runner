# Thiết kế · Rừng sương sớm

> **Liên quan:** FR-34 … FR-40 · NFR-A11Y-07 · NFR-PERF-05 · NFR-PERF-07 · NFR-PERF-08 ·
> NFR-PERF-09 · NFR-PERF-10 · ADR-0009 · ADR-0010 · bất biến #14
> **Thay thế:** ADR-0006 (ngược sáng hoàng hôn) · ADR-0007 (chỉ dùng hình khối)

## 1. Vấn đề, đo được

Người chơi báo: chướng ngại khó nhìn. Đo tương phản độ sáng WCAG giữa chướng ngại
`#120E1F` và thứ nằm ngay sau nó:

| Chướng ngại trên… | Tương phản |
| --- | --- |
| mặt đường **gần** `#241A3D` | **1.16 : 1** |
| mặt đường xa `#5D3550` | 1.89 : 1 |
| trời thấp `#F5A15C` | 9.14 : 1 |

`ADR-0006` xây trên tiền đề "nguy hiểm đọc bằng độ sáng". Tiền đề đó **chỉ đúng khi
chướng ngại in bóng trên nền trời**. Ngay khi nó tụt xuống dưới đường chân trời — tức
khoảng 1,5 giây cuối, lúc người chơi cần thấy nó nhất — tương phản sụp còn 1.16:1. Xu
trên cùng nền đó được 10.62:1, nên mắt đọc xu rõ mà không đọc được vật phải tránh.

`nfr.md` không có ngưỡng nào bắt được lỗi này: `NFR-A11Y-01` chỉ áp cho **chữ trong
HUD**. Đây là khoảng trống, không phải một lần cài đặt sai.

## 2. Nguyên tắc trung tâm — luật hai lớp

**Mọi vật thể người chơi phải đọc trong một phần giây đều có thân tối và cạnh sáng.**

- Nền tối → **cạnh** đọc được.
- Nền sáng → **thân** đọc được.
- Không tồn tại nền nào làm nó biến mất.

Đây là mã hoá kép bằng độ sáng, và nó thay quy tắc một chiều của `ADR-0006`. Nó cũng
là thứ kiểm được bằng unit test trên bảng màu, nên nó trở thành cổng CI chứ không phải
một điều cần nhớ (`NFR-A11Y-07`).

Xu đi theo chiều ngược lại vì thân xu vốn đã sáng: **thân vàng + vòng tối**. Cùng một
luật, đảo hai lớp.

## 3. Bối cảnh: rừng rậm lúc sương sớm

Chọn sương sớm chứ không phải hoàng hôn hay ban ngày vì một lý do kỹ thuật, không phải
vì gu: **sương sáng nằm sau mọi thứ ở mọi khoảng cách**. Cấu trúc cảnh tự bảo đảm mọi
vật thể xa đều có nền sáng để in bóng lên, thay vì phải áp một nội quy lên từng vật.

Ban ngày rừng xanh sáng đều là trường hợp tệ nhất cho việc đọc chướng ngại — nền ồn,
nhiều chi tiết, và không có hướng sáng nào để tách vật thể ra.

## 4. Bảng màu — 12/12 cặp đo đạt

| Token | Hex | Độ sáng | Là gì |
| --- | --- | --- | --- |
| `--mist-far` | `#CBD6C6` | 65% | sương xa, điểm sáng nhất của cảnh |
| `--mist-near` | `#93A896` | 36% | sương giữa các tầng cây |
| `--canopy` | `#0D1512` | 1% | tán lá và thân cây |
| `--road-near` | `#6F6A5D` | 14% | đá ướt dưới chân |
| `--road-far` | `#A8AC9E` | 40% | mặt đường hoà vào sương |
| `--hazard` | `#191410` | 1% | thân chướng ngại |
| `--hazard-edge` | `#EAF0E6` | 86% | cạnh chướng ngại |
| `--chasm` | `#05070A` | 0% | vực |
| `--player-rim` | `#FFD9A8` | 74% | viền vịt |
| `--coin` | `#FFC94A` | 64% | xu |
| `--coin-ring` | `#171208` | 1% | vòng tối quanh xu |
| `--skill` | `#5BE0C8` | 60% | kỹ năng sẵn sàng |

Đo bằng công thức tương phản WCAG 2.1, ngày 2026-09-10:

| Cặp | Ngưỡng | Đo được |
| --- | --- | --- |
| chướng ngại vs mặt đường gần | ≥ 3 | **3.39** |
| chướng ngại vs mặt đường xa | ≥ 3 | **7.89** |
| chướng ngại vs sương xa | ≥ 4.5 | **12.16** |
| cạnh sáng vs thân chướng ngại | ≥ 3 | **15.76** |
| cạnh sáng vs mặt đường gần | ≥ 3 | **4.65** |
| xu vs mặt đường gần | ≥ 3 | **3.52** |
| vòng xu vs sương xa | ≥ 4.5 | **12.40** |
| vòng xu vs thân xu | ≥ 3 | **12.17** |
| kỹ năng vs mặt đường gần | ≥ 3 | **3.32** |
| vực vs mặt đường gần | ≥ 3 | **3.74** |
| tán cây vs sương xa | ≥ 4.5 | **12.33** |
| tán cây vs sương gần | ≥ 3 | **7.31** |
| viền vịt vs mặt đường gần | ≥ 3 | **4.04** |

`--road-near` là token bị ràng buộc hai đầu và không được đổi tự do: sáng hơn thì xu và
kỹ năng tụt dưới 3:1, tối hơn thì chướng ngại tụt dưới 3:1. Khoảng hợp lệ của độ sáng
là **13%–16.7%**, và `#6F6A5D` nằm giữa ở 14.5%.

**Viền vịt phải sáng lên**, không giữ `#F5A15C` cũ: màu đó chỉ đạt **2.60:1** trên mặt
đường mới. `#FFD9A8` đạt 4.04:1 và vẫn là màu **ấm** duy nhất trong cảnh, nên "chỉ nhân
vật có viền ấm" vẫn đúng.

**Scrim HUD đổi từ alpha 0.45 → 0.55.** Trên điểm sáng nhất của cảnh, 0.45 chỉ còn
**3.75:1**, dưới ngưỡng `NFR-A11Y-01`. Đo được 0.55 cho **4.99:1**. Đây là ràng buộc
cứng, không phải gợi ý — giống hệt vai trò của 0.45 trong `ADR-0006`.

## 5. Cấu trúc cảnh

```
        ╱╲    ╱╲  ╱╲        tán lá: 1 mặt phẳng alpha trên đầu, cuộn
    ────────────────────
      ▓▓        ▓▓          tầng cây XA   (parallax 0.35×)
     ░░░░░░░░░░░░░░░░       SƯƠNG lấp mọi khe hở
      ██   ██    ██         tầng cây GẦN  (parallax 1.0×)
     ░░░░░░░░░░░░░░░░
  ▁▁▁▁▁              ▁▁▁▁▁  VỰC — tối tuyệt đối
  ═════╤══════╤══════╤════  gờ đường: dải sáng ở đúng mép
       │ ▄▄▄  │  ◆   │      mặt đường gần → xa
  ═════╧══════╧══════╧════
  ▔▔▔▔▔              ▔▔▔▔▔
```

| Thành phần | Cách dựng | Chi phí |
| --- | --- | --- |
| Sương | `THREE.Fog` màu `--mist-far` | 0 draw call |
| Nền cảnh | texture dọc vẽ bằng canvas: sương sáng ở chân trời, tối dần lên tán | 0 draw call |
| Mặt đường + vực + gờ | thêm nhánh vào **shader mặt đường đang có** | 0 draw call |
| Thân cây gần | `InstancedMesh` + pool, cuộn theo thế giới | 1 |
| Tầng cây xa | 2 mặt phẳng alpha mỗi bên, cuộn chậm hơn | 4 |
| Tán trên đầu | 1 mặt phẳng alpha | 1 |
| Cạnh sáng chướng ngại | 1 `InstancedMesh` mỗi loại chướng ngại | 3 |

Dự tính **~29–31 draw call** (hiện 20, ngưỡng `NFR-PERF-08` là 100). Con số này **chưa
đo** — phải đo lại và ghi vào `nfr.md` trước khi coi là xong.

**Vực là hình ảnh, không phải luật chơi.** Làn vẫn bị kẹp trong ba làn (`clampLane`);
rơi xuống vực không phải một cách chết mới. `game/` không thay đổi một dòng nào trong
toàn bộ thiết kế này — đó cũng là phép thử `ADR-0002` vẫn còn hiệu lực.

## 6. Ba loại chướng ngại

| Loại | Hình | Đọc ra sao trong 1/10 giây |
| --- | --- | --- |
| `low` — nhảy qua | khúc gỗ mục nằm ngang, cạnh **trên** bắt sáng | một vạch sáng ngang, THẤP |
| `high` — trượt dưới | chùm dây leo rủ từ trên, cạnh **dưới** bắt sáng | vạch sáng ngang, CAO, có khe hở dưới |
| `block` — đổi làn | cột đá đứng, viền sáng cả bốn phía | khối BÍT kín cả làn |

Hộp bao va chạm **không đổi**: `OBSTACLE_LOW_H_M`, `OBSTACLE_HIGH_CLEAR_M`,
`OBSTACLE_BLOCK_H_M` giữ nguyên giá trị, nên độ khó và mọi pattern đã được solver chứng
minh vẫn đúng. Đây chỉ là đổi hình hiển thị cho cùng một hộp.

**Luật ngôn ngữ hình khối:** nguy hiểm = cạnh thẳng, đối xứng, chắn ngang. Trang trí =
cạnh mềm, bất đối xứng. Nhờ vậy mắt tách chướng ngại khỏi cây cối mà không cần đọc màu
— bắt buộc, vì rừng rậm là môi trường ồn nhất về thị giác và đây là môi trường ta vừa
tự chọn.

## 7. Màn hình 2D

Bố cục **giữ nguyên** — nó đã qua rà soát và đạt 44px, focus thấy được, 4.5:1. Đổi:

- token màu sang bảng ở §4,
- scrim 0.45 → 0.55,
- yếu tố đặc trưng "đường chân trời" giữ **cấu trúc** (dải 3px, thanh 6px) nhưng đổi
  gradient tím→hổ phách thành sương→mực rừng,
- đợt 2: thêm một ảnh rừng thật sau panel.

## 8. Hai đợt

**Đợt 1 — không tải gì từ mạng.** Bảng màu, vực, sương, tầng cây, chướng ngại, texture
mặt đường vẽ bằng canvas. Sau đợt này lỗi đã hết và cảnh đã là rừng lúc rạng đông.

**Đợt 2 — ảnh CC0 thật.** Tải **sau frame đầu**, thay `map` vào vật liệu đang chạy.

Lý do tách: một texture chọn sai làm cảnh **xấu hơn** hình khối phẳng dứt khoát, và đợt
1 phải đứng vững một mình để đợt 2 là lựa chọn chứ không phải phụ thuộc.

Ràng buộc của đợt 2:

- `NFR-PERF-07` còn **321 ms** dư (đo được 2 679 ms trên ngưỡng 3 000 ms, với 181.5 KB
  truyền). Nên **không một byte ảnh nào được nằm trên đường tải tới frame đầu.**
- Chỉ nguồn **CC0 / phạm vi công cộng**. Ghi nguồn và giấy phép từng file vào
  `docs/assets/CREDITS.md`.
- `navigator.connection.saveData` bật thì bỏ qua hoàn toàn: bản hình khối vẫn chơi được.

## 9. Cái phải trả

- Tagline "chạy về phía mặt trời lặn" chết. Thay bằng **"Ba làn. Một kỹ năng. Một con
  đường qua vực."**
- README (đầu đề và ảnh chụp) phải viết lại và chụp lại.
- `ADR-0006` và `ADR-0007` chuyển `superseded`, giữ nguyên nội dung — không xoá.
- Trần thẩm mỹ của `ADR-0007` được nới nhưng **hình khối vẫn là mặc định**: nhân vật
  vẫn dựng bằng khối, vì không có model vịt CC0 nào khớp bốn hình bóng đã có, và vịt là
  vật duy nhất có viền ấm.
