# Yêu cầu phi chức năng

> **Trả lời:** Ngưỡng nào áp cho **mọi** feature, để không phải nhắc lại từng lần?
> **Trạng thái:** 🟡 đã rà và đã đo; còn thiếu một lần xác nhận trên máy mobile thật
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** thêm loại tài nguyên mới · thêm nhóm người dùng · sau sự cố sinh ra ngưỡng mới

<!-- CÁCH ĐIỀN
Đây là file AI BỎ QUA ÂM THẦM nếu nó trống — code vẫn chạy, test vẫn xanh, và
không có cảnh báo nào.

Mỗi dòng phải ĐO ĐƯỢC. Không viết được cách kiểm thì chưa phải yêu cầu.

ID không tái dùng. Bỏ một ngưỡng thì đổi thành (bỏ), không xoá dòng.
Tài liệu thiết kế của feature tham chiếu ID ở dòng `Liên quan:` — KHÔNG chép nội dung sang.
-->

Các dòng `~~(bỏ)~~` là ngưỡng mặc định của bộ khung, không áp dụng cho dự án này vì
**không có backend** (xem `01-product/overview.md` §Non-Goals). Giữ số ID để không
tái dùng nhầm.

Lệnh đo lại: `npm run build` cho kích thước bundle · `npx vite-node
scripts/measure-economy.ts` cho nhịp kiếm xu · `__duckRunner.stats()` ở bản dev cho fps
và draw call.

## Performance

Bốn ngưỡng dưới đã **được đo thật** ngày 2026-09-08, không còn là mục tiêu. Điều kiện
đo ghi rõ ở từng dòng — một con số không kèm điều kiện thì không kiểm lại được.

| ID | Ngưỡng | Số đo | Cách kiểm |
| --- | --- | --- | --- |
| NFR-PERF-01 | ~~(bỏ)~~ — không có endpoint | — | — |
| NFR-PERF-02 | ~~(bỏ)~~ — không có endpoint | — | — |
| NFR-PERF-03 | ~~(bỏ)~~ — không có truy vấn | — | — |
| NFR-PERF-04 | ~~(bỏ)~~ — không có bảng dữ liệu | — | — |
| NFR-PERF-05 | 60fps trên desktop; không tụt dưới 45fps trên mobile tầm trung | **120 fps** (trần màn hình) sau khi đổi sang cảnh rừng — không throttle, tab ở tiền cảnh, DPR 1.25. Số cũ **103–104 fps ở CPU throttle 4×** là của cảnh hoàng hôn và **không còn mô tả cảnh này**; lần đo lại ở throttle 4× chưa chạy được, xem §Giới hạn. **Chưa đo trên máy thật** | Chrome DevTools, `__duckRunner.stats()` ở bản dev |
| NFR-PERF-06 | Không rò bộ nhớ khi chơi liên tục | **Heap phẳng qua 2 phút**: 17.7MB → GC → dao động 9.1–9.7MB, không có xu hướng tăng | `performance.memory` lấy mẫu mỗi 5 giây |
| NFR-PERF-07 | Từ lúc mở trang tới lúc bấm chơi được: dưới 3 giây trên mạng 4G mô phỏng | **2 679 ms** (FCP 2 672 ms), tải nguội, Slow 4G + CPU 4×, bản build production, 181.5 KB truyền — **đo trên cảnh hoàng hôn, chưa đo lại**. Phần việc MỚI nằm trên đường tới frame đầu là sinh texture bằng canvas, đo được **3.9 ms** (tán lá 2.1 ms + nhiễu mặt đường 1.8 ms) không throttle, tức ~16 ms ở throttle 4× — trong 321 ms dư | `MutationObserver` cài trước khi trang tải, trong browser context sạch |
| NFR-PERF-08 | Dưới 100 draw call mỗi frame ở cảnh dày nhất | **28** (4 chướng ngại + 8 xu, có rừng · tán lá · thành cầu), lấy max qua 96 lần lấy mẫu. Số này gần như **không tăng theo số vật thể** mà theo số LOẠI vật thể, vì mỗi loại là một `InstancedMesh`: trần lý thuyết là 3 loại chướng ngại + 1 xu + 3 power-up cùng xuất hiện, tức ~31 | `renderer.info.render.calls` |
| NFR-PERF-10 | Ảnh tải về **không được nằm trên đường tới frame đầu**: người chơi bấm chơi được trước khi một byte ảnh nào về. Tổng payload ảnh ≤ 200 KB | chưa đo — đợt 2 của `docs/specs/jungle-dawn/plan.md` |
| NFR-PERF-09 | Bundle JS dưới 250 KB gzip | **183.5 KB gzip** (668 KB thô), gần như toàn bộ là Three.js. Cả cảnh rừng — sương, vực, tán lá, thân cây, texture mặt đường, hai lớp màu — cộng thêm **2.7 KB gzip**, vì mọi texture đều VẼ bằng canvas chứ không tải về | `npm run build` |

**Giới hạn của phép đo fps.** Chrome hạ `requestAnimationFrame` xuống ~1fps khi cửa
sổ bị che, kể cả khi `visibilityState` vẫn báo `visible`. Số 103–104 fps là lần đo khi
tab thật sự hoạt động; những lần đo tự động sau đó cho 1 fps và **là nhiễu, không phải
hồi quy**. Ngưỡng mobile tầm trung vì vậy vẫn cần một lần xác nhận trên máy thật.

## Security

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-SEC-01 | ~~(bỏ)~~ — không có mutation phía server | — |
| NFR-SEC-02 | ~~(bỏ)~~ — không thu thập PII, không có log phía server | — |
| NFR-SEC-03 | ~~(bỏ)~~ — không có đăng nhập | — |
| NFR-SEC-04 | ~~(bỏ)~~ — không có secret nào trong dự án | — |
| NFR-SEC-05 | Dependency không có lỗ hổng mức high trở lên | `npm audit`, chạy trong CI |
| NFR-SEC-06 | ~~(bỏ)~~ — không có lỗi phía server để rò rỉ | — |
| NFR-SEC-07 | Không nhúng script bên thứ ba (analytics, quảng cáo) vào trang chơi | review `index.html` |

## Accessibility

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-A11Y-01 | Tương phản chữ thường ≥ 4.5:1, chữ lớn ≥ 3:1 — áp cho **mọi chữ trong HUD chồng trên cảnh 3D** | devtools, chụp frame ở cảnh sáng nhất và tối nhất |
| NFR-A11Y-02 | Mọi màn hình ngoài lúc chơi thao tác được bằng bàn phím, focus luôn thấy được | thử tay |
| NFR-A11Y-03 | Vùng bấm ≥ 44×44px trên thiết bị cảm ứng — gồm nút kỹ năng và nút tạm dừng | review mockup + đo trên máy thật |
| NFR-A11Y-04 | Mọi input trong màn cài đặt có label liên kết | review |
| NFR-A11Y-05 | Tôn trọng `prefers-reduced-motion`: tắt rung camera, vệt tốc độ, particle. Vòng chơi giữ nguyên | thử tay với cờ bật |
| NFR-A11Y-06 | Toàn bộ vòng chơi chơi được **chỉ bằng bàn phím** và **chỉ bằng cảm ứng**, không cái nào là phụ | thử tay cả hai đường |
| NFR-A11Y-07 | **Mọi vật thể trong cảnh ≥ 3:1 so với nền nằm ngay sau nó**, ở mọi khoảng cách — không chỉ chữ. Kèm luật hai lớp: thân và cạnh phải nằm HAI PHÍA của nền về độ sáng (`ADR-0009`, bất biến #14) | **18 test trong `tests/render/contrast.test.ts`** tính tương phản WCAG trên chính các hằng trong `palette.ts`. Cặp yếu nhất **3.32:1**; cặp từng hỏng (chướng ngại/mặt đường gần) từ **1.16:1** lên **3.39:1**. CI đỏ nếu một cặp tụt |

## i18n

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-I18N-01 | Không hardcode chuỗi hiển thị trong code; gom vào một nơi | grep |
| NFR-I18N-02 | ~~(bỏ)~~ — không lưu mốc thời gian nào | — |
| NFR-I18N-03 | ~~(bỏ)~~ — không có tiền tệ thật; xu hiển thị dạng số nguyên thuần | — |

## Reliability

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-REL-01 | ~~(bỏ)~~ — không gọi ra ngoài | — |
| NFR-REL-02 | ~~(bỏ)~~ — không có ghi từ xa để retry | — |
| NFR-REL-03 | Tải tài nguyên có trạng thái nhìn thấy được và có nhánh lỗi; không có màn hình trắng vô hạn | thử tay với mạng chặn |
| NFR-REL-04 | Thiếu WebGL hoặc context bị mất: báo bằng chữ, không để canvas đen | thử tay bằng cách ép mất context |
| NFR-REL-05 | Chơi liên tục không rò bộ nhớ và không tụt fps theo thời gian | **Đo 2 phút, heap phẳng** — xem `NFR-PERF-06`. Mốc 10 phút chưa chạy |

## Data & Privacy

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-DATA-01 | ~~(bỏ)~~ — dự án không thu thập PII nào | — |
| NFR-DATA-02 | ~~(bỏ)~~ — không có tài khoản để xoá | — |
| NFR-DATA-03 | ~~(bỏ)~~ — dữ liệu chỉ nằm trên máy người chơi, không có backup | — |
| NFR-DATA-04 | Dữ liệu lưu có `version`; đọc phải validate, hỏng hoặc thiếu thì về mặc định thay vì crash | unit test với JSON hỏng, thiếu field, và version cũ |
| NFR-DATA-05 | Không gửi bất kỳ dữ liệu nào ra khỏi máy người chơi | review network tab: không có request nào ngoài tài nguyên tĩnh |

**Trường PII trong dự án này:** không có. Toàn bộ dữ liệu lưu là điểm cao, ví xu,
quyền sở hữu nhân vật và cài đặt âm thanh — không có gì định danh được người chơi.
