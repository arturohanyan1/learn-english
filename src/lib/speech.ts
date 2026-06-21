/** Speak a word using the browser's speech synthesis (no network / CORS needed). */
export function speak(text: string, lang = 'en-US'): void {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = 0.95
    u.pitch = 1
    window.speechSynthesis.speak(u)
  } catch {
    /* speech not available — ignore */
  }
}
