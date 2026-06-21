import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Language, Word } from '../types'
import { speak } from '../lib/speech'
import { fitFontSize } from '../lib/text'
import { useTranslation } from '../hooks/useTranslation'
import { SearchIcon, SpeakerIcon } from './icons'

interface Props {
  words: Word[]
  language: Language
}

const FALLBACK: Record<Language, string> = {
  ru: 'Перевод появится позже',
  hy: 'Թարգմանությունը՝ շուտով',
}

export default function Search({ words, language }: Props) {
  const [query, setQuery] = useState('')

  // Suggestion chips: prefer words we have translations for, so taps land on rich cards.
  const suggestions = useMemo(() => {
    const rich = words.filter((w) => w.ru)
    return (rich.length >= 6 ? rich : words).slice(0, 6).map((w) => w.word)
  }, [words])

  const trimmed = query.trim().toLowerCase()
  const result = useMemo(() => {
    if (!trimmed) return null
    const exact = words.find((w) => w.word.toLowerCase() === trimmed)
    if (exact) return exact
    return words.find((w) => w.word.toLowerCase().startsWith(trimmed)) ?? null
  }, [trimmed, words])

  const langLabel = language.toUpperCase()
  const seed = result ? (language === 'ru' ? result.ru : result.hy) : undefined
  const t = useTranslation(result?.word ?? '', language, seed, Boolean(result), 400)
  const showText = t.status === 'done' && Boolean(t.text)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '18px 24px 0', minHeight: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '0 14px',
          height: 52,
        }}
      >
        <SearchIcon size={20} stroke="var(--muted)" strokeWidth={2.2} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type an English word…"
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: 16,
            fontWeight: 500,
            color: 'var(--text)',
          }}
        />
      </div>

      <div className="vb-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, paddingTop: 20, overflowY: 'auto' }}>
        {!trimmed && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
              Try one of these
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {suggestions.map((s) => (
                <button key={s} onClick={() => setQuery(s)} style={chip}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {trimmed && !result && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--muted)' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <SearchIcon size={26} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>No match found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Try another English word.</div>
          </div>
        )}

        {result && (
          <div
            style={{
              position: 'relative',
              borderRadius: 26,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 26px 54px -24px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04)',
              padding: 24,
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, var(--accent), var(--accent2))' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', gap: 7 }}>
                {result.pos && <span style={posPill}>{result.pos}</span>}
                <span style={pill}>{result.level}</span>
              </div>
              <span style={pill}>{langLabel}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 4px' }}>
              <span style={{ fontSize: fitFontSize(result.word, 34, 11, 20), fontWeight: 700, letterSpacing: '-.8px', overflowWrap: 'anywhere', minWidth: 0 }}>{result.word}</span>
              <button onClick={() => speak(result.word)} style={speakBtn} aria-label="Pronounce">
                <SpeakerIcon size={19} />
              </button>
            </div>
            {result.phon && <div style={{ fontSize: 15, color: 'var(--muted)', fontWeight: 500, marginBottom: 16 }}>{result.phon}</div>}
            {t.status === 'loading' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, minHeight: 36 }}>
                <span style={spinner} />
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)' }}>Translating…</span>
              </div>
            ) : (
              <div
                style={{
                  fontFamily: "'Noto Sans Armenian','Noto Sans',sans-serif",
                  fontSize: fitFontSize(showText ? (t.text as string) : FALLBACK[language], 30, 16, 18),
                  fontWeight: 700,
                  letterSpacing: '-.5px',
                  marginBottom: 12,
                  overflowWrap: 'anywhere',
                  color: showText ? 'var(--text)' : 'var(--muted)',
                  fontStyle: showText ? 'normal' : 'italic',
                  opacity: showText ? 1 : 0.7,
                }}
              >
                {showText ? t.text : FALLBACK[language]}
              </div>
            )}
            {result.def && <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--muted)', marginBottom: 14 }}>{result.def}</div>}
            {result.ex && (
              <div
                style={{
                  background: 'var(--surface2)',
                  borderLeft: '3px solid var(--accent)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                “{result.ex}”
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const chip: CSSProperties = {
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--text)',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 999,
  padding: '9px 16px',
}

const pill: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '.5px',
  color: 'var(--accent2)',
  background: 'var(--accent-soft)',
  padding: '4px 9px',
  borderRadius: 999,
}

const posPill: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '.5px',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  border: '1px solid var(--border)',
  padding: '3px 9px',
  borderRadius: 999,
}

const speakBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 38,
  height: 38,
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  background: 'var(--accent-soft)',
  color: 'var(--accent2)',
}

const spinner: CSSProperties = {
  width: 16,
  height: 16,
  flex: 'none',
  borderRadius: '50%',
  border: '2px solid var(--surface2)',
  borderTopColor: 'var(--accent)',
  animation: 'vbSpin .7s linear infinite',
  display: 'inline-block',
}
