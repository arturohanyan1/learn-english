import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import type { Language, Word } from '../types'
import { speak } from '../lib/speech'
import { fitFontSize } from '../lib/text'
import { CheckIcon, CloseIcon, SpeakerIcon, ZapIcon } from './icons'

interface Props {
  deck: Word[]
  learned: Set<number>
  language: Language
  onLearn: (id: number) => void
}

const ROUND_SIZE = 20
const SWIPE_THRESHOLD = 80

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRound(deck: Word[], learned: Set<number>): Word[] {
  const pool = deck.filter((w) => !learned.has(w.id))
  return shuffle(pool.length ? pool : deck).slice(0, ROUND_SIZE)
}

export default function GameMode({ deck, learned, language, onLearn }: Props) {
  const learnedRef = useRef(learned)
  learnedRef.current = learned

  const [queue, setQueue] = useState<Word[]>(() => buildRound(deck, learned))
  const [pos, setPos] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [known, setKnown] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef({ x: 0, y: 0 })
  const moved = useRef(false)

  useEffect(() => {
    setQueue(buildRound(deck, learnedRef.current))
    setPos(0)
    setKnown(0)
    setRevealed(false)
  }, [deck])

  function restart() {
    setQueue(buildRound(deck, learnedRef.current))
    setPos(0)
    setKnown(0)
    setRevealed(false)
    setDragX(0)
  }

  function answer(isKnown: boolean) {
    const card = queue[pos]
    if (isKnown && card) {
      onLearn(card.id)
      setKnown((k) => k + 1)
    }
    setRevealed(false)
    setDragX(0)
    setPos((p) => p + 1)
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
      answer(dx > 0)
    } else if (!moved.current) {
      setRevealed((r) => !r)
      setDragX(0)
    } else {
      setDragX(0)
    }
  }

  if (queue.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 14, padding: 30, textAlign: 'center' }}>
        No words to play with at this level yet.
      </div>
    )
  }

  // round complete
  if (pos >= queue.length) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 34px', animation: 'vbUp .4s ease' }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <ZapIcon size={34} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.4px', marginBottom: 8 }}>Round complete!</div>
        <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--muted)', maxWidth: 260, marginBottom: 26 }}>
          You knew <span style={{ color: 'var(--text)', fontWeight: 700 }}>{known} of {queue.length}</span>. Known words are saved as learned.
        </div>
        <button onClick={restart} style={primaryBtn}>Play again</button>
      </div>
    )
  }

  const card = queue[pos]
  const translation = language === 'ru' ? card.ru : card.hy
  const pct = Math.round((pos / queue.length) * 100)
  const knowHint = Math.max(0, Math.min(1, dragX / 90))
  const skipHint = Math.max(0, Math.min(1, -dragX / 90))

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* progress */}
      <div style={{ padding: '12px 24px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>
            Quick review · <span style={{ color: 'var(--text)', fontWeight: 700 }}>{pos + 1}</span> / {queue.length}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ok)' }}>{known} known</span>
        </div>
        <div style={{ height: 7, borderRadius: 999, background: 'var(--surface2)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, var(--accent), var(--accent2))', transition: 'width .4s ease', width: `${pct}%` }} />
        </div>
      </div>

      {/* card stage */}
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
            position: 'relative',
            width: '100%',
            maxWidth: 320,
            touchAction: 'pan-y',
            cursor: dragging ? 'grabbing' : 'grab',
            transform: `translateX(${dragX}px) rotate(${dragX * 0.03}deg)`,
            transition: dragging ? 'none' : 'transform .3s cubic-bezier(.2,.7,.3,1)',
          }}
        >
          {/* swipe hints */}
          <span style={{ ...hintBadge, left: 16, color: 'var(--ok)', borderColor: 'var(--ok)', opacity: knowHint }}>KNOW</span>
          <span style={{ ...hintBadge, right: 16, color: '#F87171', borderColor: '#F87171', opacity: skipHint }}>SKIP</span>

          <div style={cardBox}>
            <div style={{ display: 'flex', gap: 7, marginBottom: 18 }}>
              {card.pos && <span style={posPill}>{card.pos}</span>}
              <span style={levelPill}>{card.level}</span>
            </div>
            <div style={{ fontSize: fitFontSize(card.word, 42, 9, 22), fontWeight: 700, letterSpacing: '-1px', textAlign: 'center', overflowWrap: 'anywhere', maxWidth: '100%' }}>
              {card.word}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
              {card.phon && <span style={{ fontSize: 15, color: 'var(--muted)', fontWeight: 500 }}>{card.phon}</span>}
              <button onClick={(e) => { e.stopPropagation(); speak(card.word) }} style={speakBtn} aria-label="Pronounce">
                <SpeakerIcon size={17} />
              </button>
            </div>

            <div style={{ height: 1, background: 'var(--border)', width: '100%', margin: '18px 0' }} />

            {revealed ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Noto Sans Armenian','Noto Sans',sans-serif", fontSize: fitFontSize(translation || '', 26, 12, 18), fontWeight: 700, color: translation ? 'var(--text)' : 'var(--muted)', fontStyle: translation ? 'normal' : 'italic' }}>
                  {translation || (language === 'ru' ? 'нет перевода' : 'թարգմանություն չկա')}
                </div>
                {card.ex && <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--muted)', fontStyle: 'italic', marginTop: 8 }}>“{card.ex}”</div>}
              </div>
            ) : (
              <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--muted)', animation: 'vbHint 2.4s ease-in-out infinite' }}>Tap to reveal</div>
            )}
          </div>
        </div>

        {/* actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, width: '100%', maxWidth: 320 }}>
          <button onClick={() => answer(false)} style={actionBtn(false)}>
            <CloseIcon size={18} strokeWidth={2.4} />
            Don't know
          </button>
          <button onClick={() => answer(true)} style={actionBtn(true)}>
            <CheckIcon size={18} strokeWidth={2.6} />
            Know it
          </button>
        </div>
        <div style={{ marginTop: 11, fontSize: 12, fontWeight: 500, color: 'var(--muted)' }}>swipe → know · ← skip</div>
      </div>
    </div>
  )
}

const cardBox: CSSProperties = {
  width: '100%',
  minHeight: 300,
  borderRadius: 28,
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  boxShadow: '0 26px 54px -24px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04)',
  padding: '30px 26px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

const hintBadge: CSSProperties = {
  position: 'absolute',
  top: 16,
  zIndex: 5,
  fontSize: 14,
  fontWeight: 800,
  letterSpacing: '1px',
  padding: '4px 10px',
  borderRadius: 8,
  border: '2px solid',
  pointerEvents: 'none',
  transition: 'opacity .1s',
}

const posPill: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '.5px',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  border: '1px solid var(--border)',
  padding: '4px 9px',
  borderRadius: 999,
}

const levelPill: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '.5px',
  color: 'var(--accent2)',
  background: 'var(--accent-soft)',
  padding: '4px 9px',
  borderRadius: 999,
}

const speakBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  background: 'var(--accent-soft)',
  color: 'var(--accent2)',
}

function actionBtn(primary: boolean): CSSProperties {
  return {
    flex: 1,
    height: 54,
    borderRadius: 16,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 15,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    color: primary ? '#fff' : 'var(--text)',
    background: primary ? 'var(--accent)' : 'var(--surface)',
    border: primary ? 'none' : '1px solid var(--border-strong)',
    boxShadow: primary ? '0 12px 28px -8px var(--accent)' : 'none',
  }
}

const primaryBtn: CSSProperties = {
  height: 52,
  minWidth: 180,
  padding: '0 26px',
  borderRadius: 16,
  cursor: 'pointer',
  border: 'none',
  fontFamily: 'inherit',
  fontSize: 15,
  fontWeight: 700,
  background: 'var(--accent)',
  color: '#fff',
  boxShadow: '0 14px 30px -8px var(--accent)',
}
