/** Diem theo quang duong. Khong he so nhan o M1. */
export class Scoring {
  distanceM = 0
  coins = 0

  reset(): void {
    this.distanceM = 0
    this.coins = 0
  }

  advance(speedMps: number, dtS: number): void {
    this.distanceM += speedMps * dtS
  }

  addCoin(n = 1): void {
    this.coins += n
  }

  /** So hien thi. Lam tron xuong de con so khong nhay lui khi doi so thuc. */
  get displayDistance(): number {
    return Math.floor(this.distanceM)
  }
}
