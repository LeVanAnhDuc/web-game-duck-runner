# POWERUP — Power-up trên đường: nam châm, khiên, tua nhanh

- **REQ-POWERUP-01** Chạy qua một power-up trên đường thì nhặt được nó, không cần bấm gì; HUD hiện ngay một chip mang tên power-up đó.
- **REQ-POWERUP-02** Nam châm có hiệu lực 7 giây: chip `Nam châm <n>s` đếm ngược số giây còn lại (làm tròn lên) và biến mất khi hết.
- **REQ-POWERUP-03** Trong lúc có nam châm, xu được hút từ bán kính rộng hơn: cùng một lượt nhặt được nhiều xu hơn khi không có nam châm.
- **REQ-POWERUP-04** Khiên đếm lần, không đếm giờ: chip `Khiên` không kèm số giây và đứng yên cho tới khi khiên được dùng.
- **REQ-POWERUP-05** Khiên bỏ qua đúng một lần va chạm: chạm chướng ngại thì khiên mất (chip biến mất) và lượt chạy tiếp; lần va chạm sau đó kết thúc lượt như bình thường.
- **REQ-POWERUP-06** Tua nhanh có hiệu lực 4,5 giây (chip `Tua nhanh <n>s` bắt đầu ở 5s, đếm ngược, biến mất khi hết); trong thời gian đó chạm chướng ngại không kết thúc lượt, hết tua nhanh thì va chạm lại kết thúc lượt.
- **REQ-POWERUP-07** Tua nhanh tăng tốc thế giới: quãng đường tăng nhanh hơn rõ rệt (hệ số 1,45) so với ngay trước khi nhặt.
- **REQ-POWERUP-08** Tạm dừng thì đồng hồ của power-up cũng dừng: số giây còn lại không đổi trong lúc tạm dừng và tiếp tục đếm từ đó khi chơi tiếp.
