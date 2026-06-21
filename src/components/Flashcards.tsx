import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { CardStyle, Language, Word } from '../types'
import { speak } from '../lib/speech'
import Flashcard from './Flashcard'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

interface Props {
  deck: Word[]
  learned: Set<number>
  language: Language
  cardStyle: CardStyle
  onToggleLearned: (id: number) => void
}

export default function Flashcards({ deck, learned, language, cardStyle, onToggleLearned }: Props) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  // Keep index valid if the deck changes (e.g. level switch).
  useEffect(() => {
    setIndex(0)
    setRevealed(false)
  }, [deck])

  if (deck.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 14 }}>
        No words for this level yet.
      </div>
    )
  }

  const card = deck[Math.min(index, deck.length - 1)]
  const learnedCount = deck.reduce((n, w) => (learned.has(w.id) ? n + 1 : n), 0)
  const progressPct = Math.round((learnedCount / deck.length) * 100)

  function go(delta: number) {
    setRevealed(false)
    setIndex((i) => (i + delta + deck.length) % deck.length)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* progress */}
      <div style={{ padding: '12px 24px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>
            <span style={{ color: 'var(--text)', fontWeight: 700 }}>{learnedCount}</span> / {deck.length} learned
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent2)' }}>{progressPct}%</span>
        </div>
        <div style={{ height: 7, borderRadius: 999, background: 'var(--surface2)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              borderRadius: 999,
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              boxShadow: '0 0 12px var(--accent)',
              transition: 'width .6s cubic-bezier(.4,1,.3,1)',
              width: `${progressPct}%`,
            }}
          />
        </div>
      </div>

      {/* card stage */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 0, padding: '6px 26px' }}>
        <Flashcard
          key={card.id}
          word={card}
          language={language}
          cardStyle={cardStyle}
          revealed={revealed}
          learned={learned.has(card.id)}
          onReveal={() => setRevealed((r) => !r)}
          onToggleLearned={() => onToggleLearned(card.id)}
          onSpeak={() => speak(card.word)}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20 }}>
          <button onClick={() => go(-1)} style={roundBtn} aria-label="Previous">
            <ChevronLeftIcon size={20} strokeWidth={2.4} />
          </button>
          <button onClick={() => setRevealed((r) => !r)} style={revealBtn}>
            {revealed ? 'Hide' : 'Reveal'}
          </button>
          <button onClick={() => go(1)} style={roundBtn} aria-label="Next">
            <ChevronRightIcon size={20} strokeWidth={2.4} />
          </button>
        </div>
        <div style={{ marginTop: 11, fontSize: 12, fontWeight: 500, color: 'var(--muted)' }}>
          {Math.min(index, deck.length - 1) + 1} of {deck.length}
        </div>
      </div>
    </div>
  )
}

const roundBtn: CSSProperties = {
  width: 50,
  height: 50,
  borderRadius: '50%',
  cursor: 'pointer',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const revealBtn: CSSProperties = {
  height: 50,
  minWidth: 148,
  padding: '0 26px',
  borderRadius: 25,
  cursor: 'pointer',
  border: 'none',
  fontFamily: 'inherit',
  fontSize: 15,
  fontWeight: 700,
  background: 'var(--accent)',
  color: '#fff',
  boxShadow: '0 12px 28px -8px var(--accent)',
}
