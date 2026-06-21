let ctx: AudioContext | null = null

function audioCtx(): AudioContext | null {
  if (!ctx) {
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new Ctor()
    } catch {
      ctx = null
    }
  }
  return ctx
}

/** Short ascending three-note chime when a word is learned. */
export function playWin(enabled: boolean): void {
  if (!enabled) return
  const c = audioCtx()
  if (!c) return
  if (c.state === 'suspended') c.resume()
  const now = c.currentTime
  ;[523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.connect(gain)
    gain.connect(c.destination)
    const t = now + i * 0.09
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
    osc.start(t)
    osc.stop(t + 0.3)
  })
}
