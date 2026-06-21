import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Level, Word } from '../../types'
import { LEVELS, levelIndex, levelName } from '../../lib/levels'
import { speak } from '../../lib/speech'
import { BookIcon, CheckIcon, ChevronLeftIcon, CloseIcon, HelpIcon, SpeakerIcon } from '../icons'

interface Props {
  words: Word[]
  availableLevels: Level[]
  onDone: (level: Level) => void
}

type Phase = 'select' | 'test' | 'result'

function sample<T>(arr: T[], n: number): T[] {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

const Logo = ({ size = 22 }: { size?: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 11,
        flex: 'none',
        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px -6px var(--accent)',
      }}
    >
      <BookIcon size={22} stroke="#fff" />
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, lineHeight: 1 }}>
      <span style={{ fontSize: size, fontWeight: 700, letterSpacing: '-.6px', color: 'var(--text)' }}>Oxford</span>
      <span style={{ fontSize: size, fontWeight: 700, letterSpacing: '-.6px', color: 'var(--accent2)' }}>5000</span>
    </div>
  </div>
)

export default function Onboarding({ words, availableLevels, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('select')
  const [selected, setSelected] = useState<Level>(availableLevels[0] ?? 'A1')

  // Placement test state
  const quiz = useMemo(
    () => availableLevels.flatMap((lvl) => sample(words.filter((w) => w.level === lvl), 2)),
    [words, availableLevels],
  )
  const [qIndex, setQIndex] = useState(0)
  const [known, setKnown] = useState<Word[]>([])

  const levelCards = LEVELS.filter((l) => availableLevels.includes(l.id))

  function startTest() {
    setQIndex(0)
    setKnown([])
    setPhase('test')
  }

  function answer(isKnown: boolean) {
    const current = quiz[qIndex]
    const nextKnown = isKnown ? [...known, current] : known
    if (isKnown) setKnown(nextKnown)
    if (qIndex + 1 >= quiz.length) {
      // Estimate: hardest level among known words, default to easiest available.
      let est = availableLevels[0] ?? 'A1'
      for (const w of nextKnown) {
        if (levelIndex(w.level) > levelIndex(est)) est = w.level
      }
      setSelected(est)
      setPhase('result')
    } else {
      setQIndex(qIndex + 1)
    }
  }

  /* ---------- SELECT ---------- */
  if (phase === 'select') {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          padding: '20px 24px 22px',
          animation: 'vbUp .4s ease',
        }}
      >
        <div style={{ marginBottom: 22 }}>
          <Logo />
        </div>
        <div style={{ fontSize: 27, fontWeight: 700, letterSpacing: '-.6px', lineHeight: 1.15, marginBottom: 8 }}>
          What's your English level?
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--muted)', marginBottom: 20 }}>
          We'll show you words at your level and above. You can change this anytime.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
          {levelCards.map((lv) => {
            const active = selected === lv.id
            return (
              <button key={lv.id} onClick={() => setSelected(lv.id)} style={levelCardStyle(active)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px' }}>{lv.id}</span>
                  {active && (
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckIcon size={12} stroke="#fff" strokeWidth={3.4} />
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--muted)', textAlign: 'left', marginTop: 4 }}>
                  {lv.name}
                </span>
              </button>
            )
          })}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <button onClick={() => onDone(selected)} style={primaryBtn}>
            Start learning
          </button>
          <button onClick={startTest} style={ghostBtn}>
            <HelpIcon size={16} />
            Not sure? Take a 1-minute placement test
          </button>
        </div>
      </div>
    )
  }

  /* ---------- TEST ---------- */
  if (phase === 'test') {
    const current = quiz[qIndex]
    const pct = Math.round((qIndex / Math.max(quiz.length, 1)) * 100)
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: '18px 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <button onClick={() => setPhase('select')} style={iconBtn}>
            <ChevronLeftIcon size={18} strokeWidth={2.4} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Placement test</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>
                {qIndex + 1} / {quiz.length}
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: 'var(--surface2)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                  transition: 'width .4s ease',
                  width: `${pct}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--muted)', marginBottom: 14 }}>
          Do you know what this word means?
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              borderRadius: 26,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 26px 54px -24px rgba(0,0,0,.7)',
              padding: '40px 26px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-1px', textAlign: 'center', marginBottom: 14 }}>
              {current.word}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 500 }}>{current.phon}</span>
              <button onClick={() => speak(current.word)} style={speakBtn}>
                <SpeakerIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
          <button onClick={() => answer(false)} style={answerBtn(false)}>
            <CloseIcon size={18} strokeWidth={2.4} />
            Don't know
          </button>
          <button onClick={() => answer(true)} style={answerBtn(true)}>
            <CheckIcon size={18} strokeWidth={2.6} />
            I know it
          </button>
        </div>
      </div>
    )
  }

  /* ---------- RESULT ---------- */
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px 30px',
        animation: 'vbUp .45s ease',
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '.6px',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: 18,
        }}
      >
        Your estimated level
      </div>
      <div
        style={{
          position: 'relative',
          width: 150,
          height: 150,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 40%, var(--accent-soft), transparent 70%)',
          marginBottom: 22,
        }}
      >
        <div
          style={{
            width: 118,
            height: 118,
            borderRadius: '50%',
            background: 'var(--surface)',
            border: '2px solid var(--accent)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px -6px var(--accent)',
          }}
        >
          <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1 }}>{selected}</span>
        </div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.4px', marginBottom: 8 }}>{levelName(selected)}</div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--muted)', maxWidth: 280, marginBottom: 28 }}>
        You answered{' '}
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>
          {known.length} of {quiz.length}
        </span>{' '}
        correctly. We'll start you here — you can always change it.
      </div>
      <button onClick={() => onDone(selected)} style={{ ...primaryBtn, height: 54 }}>
        Start learning
      </button>
      <button onClick={() => setPhase('select')} style={{ ...ghostBtn, marginTop: 12 }}>
        Choose level manually
      </button>
    </div>
  )
}

/* ---------- shared styles ---------- */
function levelCardStyle(active: boolean): CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    padding: '16px 15px',
    borderRadius: 16,
    background: active ? 'var(--accent-soft)' : 'var(--surface)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    color: 'var(--text)',
    transition: 'background .2s, border-color .2s',
  }
}

const primaryBtn: CSSProperties = {
  width: '100%',
  height: 52,
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

const ghostBtn: CSSProperties = {
  width: '100%',
  marginTop: 12,
  height: 44,
  borderRadius: 14,
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  fontFamily: 'inherit',
  fontSize: 13.5,
  fontWeight: 600,
  color: 'var(--muted)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
}

const iconBtn: CSSProperties = {
  width: 36,
  height: 36,
  flex: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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

function answerBtn(primary: boolean): CSSProperties {
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
