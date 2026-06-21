const COLORS = ['#7c5cff', '#9d86ff', '#34d399', '#38bdf8', '#f472b6', '#fbbf24']

/** Burst of falling confetti into an absolutely-positioned layer element. */
export function fireConfetti(layer: HTMLElement | null): void {
  if (!layer) return
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div')
    const size = 6 + Math.random() * 7
    el.style.position = 'absolute'
    el.style.top = '26%'
    el.style.left = `${50 + (Math.random() * 2 - 1) * 38}%`
    el.style.width = `${size}px`
    el.style.height = `${size * 0.6}px`
    el.style.background = COLORS[i % COLORS.length]
    el.style.borderRadius = '2px'
    el.style.transform = `rotate(${Math.random() * 360}deg)`
    const dur = 0.9 + Math.random() * 0.8
    el.style.animation = `vbConfetti ${dur}s cubic-bezier(.2,.6,.4,1) forwards`
    el.style.animationDelay = `${Math.random() * 0.12}s`
    layer.appendChild(el)
    setTimeout(() => el.remove(), (dur + 0.3) * 1000)
  }
}
