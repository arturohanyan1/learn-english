import type { CSSProperties } from 'react'
import type { CardStyle, Language, Word } from '../types'
import { CheckIcon, SpeakerIcon } from './icons'

interface Props {
  word: Word
  language: Language
  cardStyle: CardStyle
  revealed: boolean
  learned: boolean
  onReveal: () => void
  onToggleLearned: () => void
  onSpeak: () => void
}

const FALLBACK: Record<Language, string> = {
  ru: 'Перевод появится позже',
  hy: 'Թարգմանությունը՝ շուտով',
}

export default function Flashcard({
  word,
  language,
  cardStyle,
  revealed,
  learned,
  onReveal,
  onToggleLearned,
  onSpeak,
}: Props) {
  const translation = language === 'ru' ? word.ru : word.hy
  const hasTranslation = Boolean(translation)
  const langLabel = language.toUpperCase()
  const isAura = cardStyle === 1
  const isBold = cardStyle === 2
  const faceBase = cardFace()

  return (
    <div
      onClick={onReveal}
      style={{ position: 'relative', width: '100%', maxWidth: 320, height: 360, perspective: 1500, cursor: 'pointer' }}
    >
      {isAura && (
        <div
          style={{
            position: 'absolute',
            inset: 8,
            borderRadius: 32,
            background: 'radial-gradient(circle at 50% 35%, var(--accent), transparent 70%)',
            filter: 'blur(34px)',
            opacity: 0.55,
            pointerEvents: 'none',
          }}
        />
      )}

      {learned && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            zIndex: 20,
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'var(--ok)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px -4px var(--ok)',
          }}
        >
          <CheckIcon size={16} stroke="#05140d" strokeWidth={3.2} />
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transition: 'transform .62s cubic-bezier(.45,.05,.2,1)',
          transform: revealed ? 'rotateY(180deg)' : 'none',
        }}
      >
        {/* FRONT */}
        <div style={faceBase}>
          {isBold && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 140,
                  background: 'linear-gradient(180deg, var(--accent-soft), transparent)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 5,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                }}
              />
            </>
          )}
          <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 7 }}>
            {word.pos && <span style={posPill}>{word.pos}</span>}
            <span style={levelPill}>{word.level}</span>
          </div>
          <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: '-1.2px', lineHeight: 1.05, textAlign: 'center', marginBottom: 14 }}>
            {word.word}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {word.phon && <span style={{ fontSize: 17, color: 'var(--muted)', fontWeight: 500 }}>{word.phon}</span>}
            <button onClick={stop(onSpeak)} style={speakBtn} aria-label="Pronounce">
              <SpeakerIcon size={20} />
            </button>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 12.5,
              fontWeight: 500,
              color: 'var(--muted)',
              animation: 'vbHint 2.4s ease-in-out infinite',
            }}
          >
            Tap card or Reveal ↓
          </div>
        </div>

        {/* BACK */}
        <div style={{ ...faceBase, transform: 'rotateY(180deg)', alignItems: 'stretch', justifyContent: 'flex-start', padding: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}>{word.word}</span>
            <span style={levelPill}>{langLabel}</span>
          </div>
          <div
            style={{
              fontFamily: "'Noto Sans Armenian','Noto Sans',sans-serif",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: '-.5px',
              lineHeight: 1.1,
              marginBottom: 14,
              color: hasTranslation ? 'var(--text)' : 'var(--muted)',
              fontStyle: hasTranslation ? 'normal' : 'italic',
              opacity: hasTranslation ? 1 : 0.7,
            }}
          >
            {hasTranslation ? translation : FALLBACK[language]}
          </div>
          {word.def && (
            <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--muted)', marginBottom: 14 }}>{word.def}</div>
          )}
          {word.ex && (
            <div
              style={{
                marginTop: 'auto',
                background: 'var(--surface2)',
                borderLeft: '3px solid var(--accent)',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: 13.5,
                lineHeight: 1.5,
                fontStyle: 'italic',
                color: 'var(--text)',
              }}
            >
              “{word.ex}”
            </div>
          )}
          <div style={{ marginTop: 14 }}>
            <button onClick={stop(onToggleLearned)} style={learned ? learnedBtn : markBtn}>
              {learned ? (
                <>
                  <CheckIcon size={16} strokeWidth={3} /> Learned
                </>
              ) : (
                'Mark as learned'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function stop(fn: () => void) {
  return (e: React.MouseEvent) => {
    e.stopPropagation()
    fn()
  }
}

function cardFace(): CSSProperties {
  return {
    position: 'absolute',
    inset: 0,
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
    borderRadius: 30,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    boxShadow: '0 30px 60px -24px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    overflow: 'hidden',
  }
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
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  background: 'var(--accent-soft)',
  color: 'var(--accent2)',
}

const baseLearnBtn: CSSProperties = {
  width: '100%',
  height: 42,
  borderRadius: 12,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
}

const learnedBtn: CSSProperties = {
  ...baseLearnBtn,
  border: 'none',
  background: 'var(--ok)',
  color: '#05140d',
}

const markBtn: CSSProperties = {
  ...baseLearnBtn,
  background: 'transparent',
  color: 'var(--text)',
  border: '1px solid var(--border-strong)',
}
