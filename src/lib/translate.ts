import type { Language } from '../types'

interface MyMemoryResponse {
  responseData?: { translatedText?: string }
  responseStatus?: number | string
  responseDetails?: string
  quotaFinished?: boolean
}

/** localStorage key for a cached translation, e.g. translation:journey:ru */
function cacheKey(word: string, target: Language): string {
  return `translation:${word.trim().toLowerCase()}:${target}`
}

/** Read a previously cached translation, or null if none. */
export function getCachedTranslation(word: string, target: Language): string | null {
  try {
    return window.localStorage.getItem(cacheKey(word, target))
  } catch {
    return null
  }
}

function setCachedTranslation(word: string, target: Language, text: string): void {
  try {
    window.localStorage.setItem(cacheKey(word, target), text)
  } catch {
    /* storage full / unavailable — translation just won't be cached */
  }
}

// De-duplicate concurrent requests for the same word+target (e.g. React
// StrictMode double-invokes effects, or rapid language toggles).
const inflight = new Map<string, Promise<string>>()

/**
 * Translate an English word into the target language (ru | hy) via MyMemory.
 *
 * Caching: checks localStorage first and never hits the network for a word it
 * has already translated. Successful results are written back to the cache.
 * Throws on network failure, rate limiting, or an empty/invalid result so the
 * caller can fall back to the placeholder.
 */
export async function translateWord(word: string, target: Language): Promise<string> {
  const cached = getCachedTranslation(word, target)
  if (cached !== null) return cached

  const key = cacheKey(word, target)
  const existing = inflight.get(key)
  if (existing) return existing

  const request = (async () => {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${target}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`)

    const data = (await res.json()) as MyMemoryResponse
    const status = Number(data?.responseStatus)
    if (status && status !== 200) {
      throw new Error(data?.responseDetails || `MyMemory status ${status}`)
    }
    if (data?.quotaFinished) throw new Error('MyMemory daily quota reached')

    const text = data?.responseData?.translatedText?.trim()
    if (!text) throw new Error('Empty translation')
    // MyMemory sometimes returns a quota/usage warning as the "translation"
    // with status 200 — treat that as a failure, not a result.
    if (/MYMEMORY WARNING|YOU USED ALL AVAILABLE FREE TRANSLATIONS/i.test(text)) {
      throw new Error(text)
    }

    setCachedTranslation(word, target, text)
    return text
  })()

  inflight.set(key, request)
  try {
    return await request
  } finally {
    inflight.delete(key)
  }
}
