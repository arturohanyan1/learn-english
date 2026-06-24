import type { Level, LevelCount, Word } from '../types'
import { shuffle } from '../lib/shuffle'
import { SEED_TRANSLATIONS } from './seedTranslations'

/** Raw entry shape as stored in public/words/<level>.json. */
interface RawEntry {
  id: number
  value: {
    word: string
    type?: string
    level: Level
    phonetics?: { us?: string; uk?: string }
    us?: { mp3?: string }
    uk?: { mp3?: string }
    examples?: string[]
  }
}

function adapt(entry: RawEntry): Word {
  const v = entry.value
  const seed = SEED_TRANSLATIONS[(v.word || '').toLowerCase()]
  return {
    id: entry.id,
    word: v.word,
    level: v.level,
    pos: v.type || '',
    phon: v.phonetics?.uk || v.phonetics?.us || '',
    ex: v.examples?.[0] || '',
    audio: v.uk?.mp3 || v.us?.mp3,
    ru: seed?.ru,
    hy: seed?.hy,
    def: seed?.def,
  }
}

export interface LoadedWords {
  words: Word[]
  levels: LevelCount[]
}

/**
 * Load the manifest then every per-level file in parallel, returning one
 * normalized, level-sorted list plus the available levels with counts.
 */
export async function loadWords(): Promise<LoadedWords> {
  const levels: LevelCount[] = await fetch('/words/index.json').then((r) => {
    if (!r.ok) throw new Error(`Failed to load word index (${r.status})`)
    return r.json()
  })

  const files = await Promise.all(
    levels.map((l) =>
      fetch(`/words/${l.level}.json`).then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${l.level} words (${r.status})`)
        return r.json() as Promise<RawEntry[]>
      }),
    ),
  )

  // Shuffle once per load so flashcards aren't always in the same order.
  const words = shuffle(files.flat().map(adapt))
  return { words, levels }
}
