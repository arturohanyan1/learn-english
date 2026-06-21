import { useCallback, useState } from 'react'
import { readJSON, writeJSON } from '../lib/storage'

/** State persisted to localStorage under `key`, JSON-encoded. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readJSON(key, initial))

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        writeJSON(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, set] as const
}
