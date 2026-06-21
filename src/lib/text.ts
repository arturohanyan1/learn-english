/**
 * Scale a display font size down for long words so they fit the card.
 * Returns `base` for words up to `maxChars`, otherwise shrinks proportionally
 * down to `min`.
 */
export function fitFontSize(text: string, base: number, maxChars: number, min: number): number {
  if (!text || text.length <= maxChars) return base
  return Math.max(min, Math.round(base * (maxChars / text.length)))
}
