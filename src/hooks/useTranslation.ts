import { useEffect, useState } from 'react'
import type { Language } from '../types'
import { getCachedTranslation, translateWord } from '../lib/translate'

export type TranslationStatus = 'idle' | 'loading' | 'done' | 'error'

export interface TranslationState {
  status: TranslationStatus
  text?: string
}

/**
 * Resolve a word's translation for the current language.
 *
 * Order of resolution: local seed (from the bundled JSON) → localStorage cache
 * → MyMemory fetch. `enabled` gates the network call. `delayMs` debounces the
 * fetch so cards that are only briefly visible (fast swiping / typing) never hit
 * the API — only words the user lingers on are translated. Cached words and
 * seeds resolve instantly regardless of the delay. Re-runs on word/language.
 */
export function useTranslation(
  word: string,
  language: Language,
  seed: string | undefined,
  enabled: boolean,
  delayMs = 0,
): TranslationState {
  const [state, setState] = useState<TranslationState>(() =>
    seed ? { status: 'done', text: seed } : { status: 'idle' },
  )

  useEffect(() => {
    if (seed) {
      setState({ status: 'done', text: seed })
      return
    }
    if (!enabled || !word) {
      setState({ status: 'idle' })
      return
    }

    const cached = getCachedTranslation(word, language)
    if (cached !== null) {
      setState({ status: 'done', text: cached })
      return
    }

    let alive = true
    setState({ status: 'loading' })

    const run = () =>
      translateWord(word, language)
        .then((text) => alive && setState({ status: 'done', text }))
        .catch((err) => {
          if (!alive) return
          console.warn(`[translate] ${word} (en|${language}) failed:`, err)
          setState({ status: 'error' })
        })

    let timer: number | undefined
    if (delayMs > 0) timer = window.setTimeout(run, delayMs)
    else run()

    return () => {
      alive = false
      if (timer) window.clearTimeout(timer)
    }
  }, [word, language, seed, enabled, delayMs])

  return state
}
