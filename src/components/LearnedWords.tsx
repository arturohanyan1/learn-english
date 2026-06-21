import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import type { Language, Word } from '../types'
import { LEVEL_ORDER } from '../lib/levels'
import { speak } from '../lib/speech'
import { CheckCircleIcon, SpeakerIcon } from './icons'

interface Props {
  words: Word[]
  language: Language
  onUnlearn: (id: number) => void
}

export default function LearnedWords({ words, language, onUnlearn }: Props) {
  const sorted = useMemo(
    () =>
      [...words].sort((a, b) => {
        const d = LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)
        return d !== 0 ? d : a.word.localeCompare(b.word)
      }),
    [words],
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: '14px 24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.3px' }}>Learned words</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>{sorted.length}</span>
      </div>

      {sorted.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--muted)', padding: '0 20px' }}>
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
            <CheckCircleIcon size={26} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>No learned words yet</div>
          <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>Tap the green check on a flashcard to add it here.</div>
        </div>
      ) : (
        <div className="vb-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 9, paddingBottom: 8 }}>
          {sorted.map((w) => {
            const translation = language === 'ru' ? w.ru : w.hy
            return (
              <div key={w.id} style={row}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.3px' }}>{w.word}</span>
                    <span style={levelPill}>{w.level}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--muted)',
                      marginTop: 2,
                      fontFamily: translation ? "'Noto Sans Armenian','Noto Sans',sans-serif" : 'inherit',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {translation || w.pos || '—'}
                  </div>
                </div>
                <button onClick={() => speak(w.word)} style={iconBtn} aria-label={`Pronounce ${w.word}`}>
                  <SpeakerIcon size={17} />
                </button>
                <button onClick={() => onUnlearn(w.id)} style={unlearnBtn} aria-label={`Remove ${w.word} from learned`}>
                  <CheckCircleIcon size={18} strokeWidth={2.4} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const row: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: '11px 13px',
}

const levelPill: CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: '.5px',
  color: 'var(--accent2)',
  background: 'var(--accent-soft)',
  padding: '2px 7px',
  borderRadius: 999,
}

const iconBtn: CSSProperties = {
  flex: 'none',
  width: 34,
  height: 34,
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  background: 'var(--accent-soft)',
  color: 'var(--accent2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const unlearnBtn: CSSProperties = {
  flex: 'none',
  width: 34,
  height: 34,
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  background: 'var(--ok)',
  color: '#05140d',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
