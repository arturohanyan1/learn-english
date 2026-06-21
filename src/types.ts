export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type Language = 'ru' | 'hy'
export type ThemeId = 'dark' | 'light' | 'midnight' | 'sepia'
/** 0 = Minimal, 1 = Aura, 2 = Bold */
export type CardStyle = 0 | 1 | 2

/** Normalized word used across the UI. */
export interface Word {
  id: number
  word: string
  level: Level
  pos: string
  phon: string
  ex: string
  audio?: string
  /** Translations / definition — only present for words we have data for. */
  ru?: string
  hy?: string
  def?: string
}

export interface LevelCount {
  level: Level
  count: number
}
