/** localStorage keys (kept identical to the design's keys). */
export const KEYS = {
  level: 'vocab_cefr_level',
  learned: 'vocab_learned',
  theme: 'vocab_theme',
  lang: 'vocab_lang',
  sound: 'vocab_sound',
  style: 'vocab_style',
} as const

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable / quota — ignore */
  }
}
