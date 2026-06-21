import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import type { CardStyle, Language, Word } from '../types'
import { speak } from '../lib/speech'
import Flashcard from './Flashcard'
import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon } from './icons'

interface Props {
  deck: Word[]
  learned: Set<number>
  language: Language
  cardStyle: CardStyle
  onToggleLearned: (id: number) => void
  onReview: () => void
}

const SWIPE_THRESHOLD = 70

export default function Flashcards({ deck, learned, language, cardStyle, onToggleLearned, onReview }: Props) {
  const learnedRef = useRef(learned)
  learnedRef.current = learned

  // Stable per-visit snapshot of unlearned words. Marking a card during the
  // visit keeps it in the stack (so the toggle works both ways); learned words
  // drop out the next time the deck is (re)built — e.g. re-entering this tab.
  const [stack, setStack] = useState<Word[]>(() => deck.filter((w) => !learned.has(w.id)))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef({ x: 0, y: 0 })
  const moved = useRef(false)

  useEffect(() => {
    setStack(deck.filter((w) => !learnedRef.current.has(w.id)))
    setIndex(0)
    setRevealed(false)
  }, [deck])

  const total = deck.length
  const learnedCount = deck.reduce((n, w) => (learned.has(w.id) ? n + 1 : n), 0)
  const progressPct = total ? Math.round((learnedCount / total) * 100) : 0

  function go(delta: number) {
    setRevealed(false)
    setDragX(0)
    setIndex((i) => (i + delta + stack.length) % stack.length)
  }

  function onPointerDown(e: ReactPointerEvent) {
    if ((e.target as HTMLElement).closest('button')) return
    setDragging(true)
    moved.current = false
    start.current = { x: e.clientX, y: e.clientY }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (!dragging) return
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    if (Math.abs(dx) > Math.abs(dy)) {
      setDragX(dx)
      if (Math.abs(dx) > 6) moved.current = true
    }
  }

  function onPointerUp(e: ReactPointerEvent) {
    if (!dragging) return
    setDragging(false)
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1)
    } else if (!moved.current) {
      setRevealed((r) => !r)
      setDragX(0)
    } else {
      setDragX(0)
    }
  }

  const card = stack.length ? stack[Math.min(index, stack.length - 1)] : undefined

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* progress */}
      <div style={{ padding: '12px 24px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>
            <span style={{ color: 'var(--text)', fontWeight: 700 }}>{learnedCount}</span> / {total} learned
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

      {!card ? (
        <AllCaughtUp total={total} onReview={onReview} />
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 0, padding: '6px 26px' }}>
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              setDragging(false)
              setDragX(0)
            }}
            style={{
              width: '100%',
              maxWidth: 320,
              touchAction: 'pan-y',
              cursor: dragging ? 'grabbing' : 'grab',
              transform: `translateX(${dragX}px) rotate(${dragX * 0.03}deg)`,
              transition: dragging ? 'none' : 'transform .3s cubic-bezier(.2,.7,.3,1)',
            }}
          >
            <Flashcard
              key={card.id}
              word={card}
              language={language}
              cardStyle={cardStyle}
              revealed={revealed}
              learned={learned.has(card.id)}
              onToggleLearned={() => onToggleLearned(card.id)}
              onSpeak={() => speak(card.word)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20 }}>
            <button onClick={() => go(-1)} style={roundBtn} aria-label="Previous">
              <ChevronLeftIcon size={20} strokeWidth={2.4} />
            </button>
            <button onClick={() => go(1)} style={nextBtn}>
              Next
              <ChevronRightIcon size={18} strokeWidth={2.6} />
            </button>
            <button onClick={() => go(1)} style={roundBtn} aria-label="Next">
              <ChevronRightIcon size={20} strokeWidth={2.4} />
            </button>
          </div>
          <div style={{ marginTop: 11, fontSize: 12, fontWeight: 500, color: 'var(--muted)' }}>
            {Math.min(index, stack.length - 1) + 1} of {stack.length} · tap card to reveal
          </div>
        </div>
      )}
    </div>
  )
}

function AllCaughtUp({ total, onReview }: { total: number; onReview: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 34px', animation: 'vbUp .4s ease' }}>
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: '50%',
          background: 'var(--accent-soft)',
          color: 'var(--ok)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
        }}
      >
        <CheckCircleIcon size={36} strokeWidth={2.2} />
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.3px', marginBottom: 8 }}>All caught up!</div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--muted)', maxWidth: 260, marginBottom: 24 }}>
        You've learned all {total} words at this level. Lower your level in Settings for more, or review what you know.
      </div>
      <button onClick={onReview} style={revealBtn}>
        Review learned
      </button>
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

const nextBtn: CSSProperties = {
  ...revealBtn,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
}
