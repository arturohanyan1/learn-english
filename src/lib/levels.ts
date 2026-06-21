import type { Level } from '../types'

export interface LevelMeta {
  id: Level
  name: string
}

/** CEFR levels, easiest → hardest, with the names used in the design. */
export const LEVELS: LevelMeta[] = [
  { id: 'A1', name: 'Beginner' },
  { id: 'A2', name: 'Elementary' },
  { id: 'B1', name: 'Intermediate' },
  { id: 'B2', name: 'Upper-Inter.' },
  { id: 'C1', name: 'Advanced' },
  { id: 'C2', name: 'Proficiency' },
]

export const LEVEL_ORDER: Level[] = LEVELS.map((l) => l.id)

export function levelName(id: Level): string {
  return LEVELS.find((l) => l.id === id)?.name ?? id
}

export function levelIndex(id: Level): number {
  return LEVEL_ORDER.indexOf(id)
}

/** Levels at or above the given level (the app shows words "at this level and above"). */
export function levelsAtOrAbove(id: Level): Level[] {
  const i = levelIndex(id)
  return i < 0 ? LEVEL_ORDER.slice() : LEVEL_ORDER.slice(i)
}
