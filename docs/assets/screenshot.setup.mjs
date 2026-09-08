/**
 * Lai game vao khung hinh dang chup.
 *
 * Khong co file nay thi anh chup ra MAN HINH CHINH — dep, nhung khong cho biet
 * game choi ra sao. Anh can thay: duong ba lan, chuong ngai la bong den, xu vang,
 * va con vit co vien sang.
 *
 * Hai cai bay ma skill `readme-game` da canh, va cach file nay tranh:
 *
 * 1. **Game hanh dong thoi gian thuc.** Khi co file setup, script chi cho 120ms
 *    roi chup — nen setup phai KET THUC dung tai khung hinh muon chup, khong the
 *    tra ve som roi tin la script se doi.
 *
 *    Cho 2.6 giay la an toan: co mot test trong `tests/game/rules.test.ts` chay
 *    40 seed va khang dinh nguoi choi khong chet trong ba giay dau (cum chuong
 *    ngai dau tien luon de trong lan giua). Neu test do do, con so nay phai doi.
 *
 * 2. **Selector khong `exact`.** Man hinh chinh co ca "CHƠI" va "CỬA HÀNG";
 *    `name: 'CHƠI'` khong exact se khop ca hai va Playwright bao strict mode
 *    violation. Nut Choi la mot nut co icon, nen accessible name la "CHƠI".
 */
export default async function setup(page) {
  await page.getByRole('button', { name: 'CHƠI', exact: true }).click()
  // Du de cum chuong ngai dau tien vao khung hinh, va con xa de chua chet
  await page.waitForTimeout(2600)
}
