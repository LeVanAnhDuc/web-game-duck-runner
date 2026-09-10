# ADR-0007 · Dựng vật thể bằng hình khối trong code, không tải model ngoài

> **Ngày:** 2026-09-08
> **Trạng thái:** superseded bởi `ADR-0010` (2026-09-10)
>
> Lý do bị thay: điều kiện xem lại viết ở §4 đã xảy ra — `ADR-0006` bị `ADR-0009` thay.
> `ADR-0010` giữ **nguyên** lập luận của file này cho vật thể trong luồng chơi (nhân vật
> và chướng ngại vẫn là hình khối, vì dưới đường chân trời thứ quyết định là hình bóng),
> và chỉ mở ra đúng hai chỗ ảnh thật đóng góp được. Nội dung dưới đây giữ nguyên.
> **Liên quan:** ADR-0001 · ADR-0006 · FR-05 · FR-23 · NFR-PERF-07 · NFR-PERF-08 · NFR-SEC-07

## 1. Bối cảnh

`ADR-0001` chốt dùng bộ model low-poly CC0 của Kenney ở định dạng `.glb`, vì lúc đó
lựa chọn "asset pack miễn phí" là để tránh phải vẽ tay theo phối cảnh.

Sau đó `ADR-0006` chốt hướng nghệ thuật ngược sáng: **mọi chướng ngại là khối đen
không màu**, và nhân vật cũng là bóng, chỉ khác ở viền sáng.

Hai quyết định đó gặp nhau ở một chỗ không ai lường: nếu mọi vật thể đều được tô một
màu phẳng duy nhất, thì **toàn bộ giá trị của một file model đã biến mất** — texture
không dùng, bảng màu không dùng, chi tiết bề mặt không nhìn thấy. Còn lại chỉ là hình
bóng, mà hình bóng thì `BoxGeometry` dựng được.

## 2. Quyết định

Không tải model ngoài. Mọi vật thể dựng từ hình khối cơ bản của Three.js
(`BoxGeometry`, `CylinderGeometry`, `CapsuleGeometry`) hợp lại, tô `MeshBasicMaterial`
màu `--world-ink`, không đèn và không shadow map.

Nhân vật phân biệt nhau bằng **tỉ lệ và cấu trúc hình bóng** — cao gầy, thấp đậm, có
mũ, có đuôi — chứ không bằng màu hay texture.

Viền sáng của nhân vật dùng kỹ thuật outline cổ điển: một bản mesh phóng to `1.06` với
`side: THREE.BackSide` tô `--sky-low`. Không cần post-processing.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Tải bộ Kenney `.glb` như `ADR-0001` định | Thêm vài trăm KB tài nguyên, thêm `GLTFLoader`, thêm trạng thái tải — để rồi tô phẳng một màu và bỏ hết những gì file đó mang lại |
| Giữ model cho nhân vật, hình khối cho chướng ngại | Nửa vời: vẫn phải cõng loader và tài nguyên, mà nhân vật cũng là bóng nên vẫn không thấy chi tiết |
| Tự mô hình hoá trong Blender rồi export | Không có kỹ năng trong nhóm, và không giải quyết được gì mà hình khối không giải quyết được |

## 4. Hệ quả

**Được:**
- Không tài nguyên nhị phân nào trong repo. Không file giấy phép, không lệ thuộc bên
  ngoài, `NFR-SEC-07` khỏi phải nghĩ.
- Thời gian tải chỉ còn là thời gian tải bundle JS — có lợi trực tiếp cho `NFR-PERF-07`.
- Hình học đơn giản, dễ dùng `InstancedMesh` cho vật thể lặp, có lợi cho `NFR-PERF-08`.
- Thêm một nhân vật là thêm một hàm dựng hình khối, không phải thêm một file.

**Mất / phải chấp nhận:**
- Trần thẩm mỹ thấp hơn: nếu sau này muốn bỏ hướng ngược sáng, không có model nào để
  quay về — phải làm lại phần vật thể từ đầu.
- Nhân vật không có animation chạy theo khung xương. Chuyển động phải làm bằng cách
  quay/dịch các khối con — đủ cho hình bóng, nhưng không mượt như animation thật.
- Không tận dụng được các bộ asset CC0 sẵn có, tức là bỏ một lối đi nhanh nếu sau này
  cần nhiều loại chướng ngại.

**Điều kiện xem lại quyết định này:** nếu hướng nghệ thuật ở `ADR-0006` bị thay bằng
một hướng có chiếu sáng thật, thì quyết định này mất toàn bộ căn cứ và phải viết ADR
mới thay thế.
