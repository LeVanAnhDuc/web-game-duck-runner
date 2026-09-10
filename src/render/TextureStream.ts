/**
 * Anh that, tai SAU frame dau — ADR-0010.
 *
 * Rang buoc dat ra con so nay: `NFR-PERF-07` doi duoi 3 giay tu luc mo trang toi
 * luc bam choi duoc, va lan do gan nhat la **2 679 ms**. Con 321 ms. Mot texture
 * nam tren duong tai toi frame dau se an het cho do, nen khong mot byte anh nao
 * duoc phep o day: game khoi dong bang texture ve san trong code, va anh that
 * **thay vao khi da xong**, trong luc nguoi choi dang chay.
 *
 * Hai cai rAF long nhau la cach re nhat de biet frame dau da hien: rAF thu nhat
 * chay TRUOC khi frame duoc trinh bay, rAF thu hai chay sau do.
 */

/** Duong dan tuong doi so voi trang. `vite.config.ts` dung `base: './'`. */
const FAR_FOLIAGE = 'textures/jungle-far.webp'
const SCREEN_PHOTO = 'textures/jungle-screen.webp'

interface Connection {
  saveData?: boolean
}

/**
 * Nguoi dung bat tiet kiem du lieu thi bo qua HOAN TOAN.
 *
 * Khong phai giam chat luong, khong phai tai ban nho hon: ban hinh khoi choi duoc
 * day du, va do la ban ho nen nhan.
 */
function saveDataOn(): boolean {
  const c = (navigator as Navigator & { connection?: Connection }).connection
  return c?.saveData === true
}

function load(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`khong tai duoc ${src}`))
    img.src = src
  })
}

/**
 * Bat dau nap anh sau khi frame dau da hien.
 *
 * Moi loi deu **im lang co y**: anh that la mot lop them vao, khong phai dieu
 * kien de choi. Mang chet, chan tai, trinh duyet khong doc duoc WebP — tat ca
 * deu ra cung mot ket qua, la game giu nguyen ban hinh khoi.
 */
export function streamTextures(onFarFoliage: (img: HTMLImageElement) => void): void {
  if (saveDataOn()) return
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      void load(FAR_FOLIAGE).then(onFarFoliage).catch(() => undefined)
      /**
       * Anh nen cho man hinh 2D di qua mot bien CSS chu khong viet thang trong
       * stylesheet: `url()` trong file CSS duoc giai theo vi tri cua chinh file
       * CSS (`assets/`), nen tren GitHub Pages no se tro sai cho. Dat tu day thi
       * duong dan la duong dan cua TRANG, va co dinh cua "chi sau frame dau"
       * nam cung mot cho.
       */
      void load(SCREEN_PHOTO)
        .then(() => {
          document.body.style.setProperty('--screen-photo', `url(${SCREEN_PHOTO})`)
          document.body.dataset.textures = 'on'
        })
        .catch(() => undefined)
    })
  })
}
