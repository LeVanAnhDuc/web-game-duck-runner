/**
 * Âm thanh, tổng hợp toàn bộ bằng Web Audio — ADR-0008.
 *
 * Không file, không thư viện. Một endless runner cần bốn âm ngắn và một lớp pad, và
 * tất cả đều là thứ bộ dao động dựng ra chính xác.
 *
 * Hai điều dễ sai và cả hai đều im lặng:
 *
 * 1. `AudioContext` **chỉ được tạo ở tương tác đầu tiên**. Tạo lúc tải trang thì mọi
 *    trình duyệt hiện đại để nó ở trạng thái `suspended`, không âm nào phát ra, và
 *    không có lỗi nào được ném.
 * 2. Nhạc nền lập lịch theo **đồng hồ của AudioContext**, không theo `setInterval`.
 *    `setInterval` bị giảm nhịp khi tab mất focus, và nhạc sẽ giật khi quay lại.
 */

export type Sfx = 'jump' | 'slide' | 'coin' | 'hit' | 'skill' | 'shield' | 'powerup' | 'deny'

export interface AudioSettings {
  muted: boolean
  musicVolume: number
  sfxVolume: number
}

/** Bậc của thang ngũ cung trên nền La thứ — nghe hợp với trời hoàng hôn. */
const PENTATONIC = [220, 261.63, 293.66, 349.23, 392]

export class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private musicGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private musicTimer: number | null = null
  private nextNoteTime = 0
  private step = 0
  private coinStreak = 0
  private lastCoinAt = 0
  private settings: AudioSettings = { muted: false, musicVolume: 0.5, sfxVolume: 0.8 }
  private musicWanted = false

  /**
   * Gọi ở tương tác đầu tiên của người dùng. Gọi nhiều lần là an toàn.
   * Trả về false nếu trình duyệt không có Web Audio — game vẫn chơi được, chỉ im.
   */
  unlock(): boolean {
    if (this.ctx) {
      void this.ctx.resume()
      return true
    }
    const Ctor =
      globalThis.AudioContext ??
      (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return false

    const ctx = new Ctor()
    this.ctx = ctx
    this.master = ctx.createGain()
    this.musicGain = ctx.createGain()
    this.sfxGain = ctx.createGain()
    this.musicGain.connect(this.master)
    this.sfxGain.connect(this.master)
    this.master.connect(ctx.destination)
    this.applySettings()
    if (this.musicWanted) this.startMusic()
    return true
  }

  setSettings(s: AudioSettings): void {
    this.settings = s
    this.applySettings()
  }

  private applySettings(): void {
    const { master, musicGain, sfxGain, ctx } = this
    if (!master || !musicGain || !sfxGain || !ctx) return
    const t = ctx.currentTime
    master.gain.setTargetAtTime(this.settings.muted ? 0 : 1, t, 0.05)
    musicGain.gain.setTargetAtTime(this.settings.musicVolume * 0.28, t, 0.05)
    sfxGain.gain.setTargetAtTime(this.settings.sfxVolume * 0.7, t, 0.05)
  }

  play(kind: Sfx): void {
    const ctx = this.ctx
    const out = this.sfxGain
    if (!ctx || !out || this.settings.muted) return
    const t = ctx.currentTime

    switch (kind) {
      case 'jump':
        this.sweep(t, 300, 640, 0.16, 'triangle', 0.4)
        break
      case 'slide':
        this.noise(t, 0.22, 1400, 0.22)
        break
      case 'coin': {
        // Cao độ tăng dần theo chuỗi nhặt liên tiếp — đây là thứ chỉ âm thanh
        // THAM SỐ HOÁ làm được, một bộ file cố định thì không.
        if (t - this.lastCoinAt > 0.9) this.coinStreak = 0
        else this.coinStreak = Math.min(7, this.coinStreak + 1)
        this.lastCoinAt = t
        const base = PENTATONIC[this.coinStreak % PENTATONIC.length]! * 2
        this.blip(t, base, 0.07, 'square', 0.22)
        this.blip(t + 0.05, base * 1.5, 0.08, 'square', 0.18)
        break
      }
      case 'hit':
        this.noise(t, 0.3, 700, 0.5)
        this.sweep(t, 180, 48, 0.36, 'sawtooth', 0.5)
        break
      case 'skill':
        this.sweep(t, 220, 880, 0.42, 'sawtooth', 0.35)
        this.blip(t + 0.1, 660, 0.3, 'triangle', 0.22)
        break
      case 'shield':
        this.blip(t, 523.25, 0.26, 'sine', 0.3)
        this.blip(t + 0.06, 784, 0.3, 'sine', 0.24)
        break
      case 'powerup':
        this.blip(t, 440, 0.12, 'triangle', 0.28)
        this.blip(t + 0.08, 587.33, 0.12, 'triangle', 0.28)
        this.blip(t + 0.16, 880, 0.2, 'triangle', 0.24)
        break
      case 'deny':
        this.blip(t, 150, 0.12, 'square', 0.25)
        break
    }
  }

  setMusicEnabled(on: boolean): void {
    this.musicWanted = on
    if (on) this.startMusic()
    else this.stopMusic()
  }

  private startMusic(): void {
    if (!this.ctx || this.musicTimer !== null) return
    this.nextNoteTime = this.ctx.currentTime + 0.1
    this.step = 0
    const tick = (): void => {
      this.scheduleMusic()
    }
    // Bộ hẹn giờ chỉ để NẠP TRƯỚC; thời điểm phát do đồng hồ AudioContext quyết định
    this.musicTimer = globalThis.setInterval(tick, 120)
    this.scheduleMusic()
  }

  private stopMusic(): void {
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer)
      this.musicTimer = null
    }
  }

  /** Nạp trước 0.4 giây nhạc mỗi lần được gọi. */
  private scheduleMusic(): void {
    const ctx = this.ctx
    const out = this.musicGain
    if (!ctx || !out) return
    const beat = 0.46
    while (this.nextNoteTime < ctx.currentTime + 0.4) {
      const t = this.nextNoteTime
      const bar = Math.floor(this.step / 8) % 4
      const rootIdx = [0, 2, 4, 2][bar]!
      const root = PENTATONIC[rootIdx]! / 2

      if (this.step % 8 === 0) this.pad(t, root, beat * 8 * 0.95, out)
      if (this.step % 2 === 0) this.bass(t, root / 2, beat * 0.9, out)
      if (this.step % 4 === 1) {
        const arp = PENTATONIC[(rootIdx + this.step) % PENTATONIC.length]! * 2
        this.arp(t, arp, beat * 0.6, out)
      }

      this.step++
      this.nextNoteTime += beat
    }
  }

  // ── Khối tổng hợp cơ bản ───────────────────────────────────────────────────

  private env(gainNode: GainNode, t: number, dur: number, peak: number, attack = 0.008): void {
    const g = gainNode.gain
    g.setValueAtTime(0, t)
    g.linearRampToValueAtTime(peak, t + attack)
    g.exponentialRampToValueAtTime(0.0001, t + dur)
  }

  private blip(t: number, freq: number, dur: number, type: OscillatorType, peak: number): void {
    const ctx = this.ctx
    const out = this.sfxGain
    if (!ctx || !out) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    this.env(gain, t, dur, peak)
    osc.connect(gain).connect(out)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  }

  private sweep(
    t: number, from: number, to: number, dur: number, type: OscillatorType, peak: number,
  ): void {
    const ctx = this.ctx
    const out = this.sfxGain
    if (!ctx || !out) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(from, t)
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur)
    this.env(gain, t, dur, peak)
    osc.connect(gain).connect(out)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  }

  private noise(t: number, dur: number, cutoff: number, peak: number): void {
    const ctx = this.ctx
    const out = this.sfxGain
    if (!ctx || !out) return
    const frames = Math.ceil(ctx.sampleRate * dur)
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames)
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(cutoff, t)
    const gain = ctx.createGain()
    this.env(gain, t, dur, peak, 0.004)
    src.connect(filter).connect(gain).connect(out)
    src.start(t)
  }

  private pad(t: number, root: number, dur: number, out: GainNode): void {
    const ctx = this.ctx
    if (!ctx) return
    for (const [i, mult] of [1, 1.5, 2.005].entries()) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(root * mult, t)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.12 / (i + 1), t + 0.6)
      gain.gain.linearRampToValueAtTime(0.0001, t + dur)
      osc.connect(gain).connect(out)
      osc.start(t)
      osc.stop(t + dur + 0.05)
    }
  }

  private bass(t: number, freq: number, dur: number, out: GainNode): void {
    const ctx = this.ctx
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)
    this.env(gain, t, dur, 0.3, 0.02)
    osc.connect(gain).connect(out)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  }

  private arp(t: number, freq: number, dur: number, out: GainNode): void {
    const ctx = this.ctx
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, t)
    this.env(gain, t, dur, 0.055)
    osc.connect(gain).connect(out)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  }

  dispose(): void {
    this.stopMusic()
    void this.ctx?.close()
    this.ctx = null
  }
}
