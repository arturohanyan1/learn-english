import type { CSSProperties } from 'react'
import type { CardStyle, Language, Level, ThemeId } from '../types'
import { LEVELS } from '../lib/levels'
import { THEMES } from '../lib/themes'
import { CheckIcon, CloseIcon } from './icons'

interface Props {
  onClose: () => void
  level: Level
  availableLevels: Level[]
  levelProgress: Record<string, { learned: number; total: number }>
  onLevel: (level: Level) => void
  language: Language
  onLanguage: (language: Language) => void
  cardStyle: CardStyle
  onCardStyle: (style: CardStyle) => void
  theme: ThemeId
  onTheme: (theme: ThemeId) => void
  sound: boolean
  onSound: (sound: boolean) => void
}

const CARD_STYLES = ['Minimal', 'Aura', 'Bold'] as const

export default function Settings(props: Props) {
  const { onClose, level, availableLevels, levelProgress, onLevel, language, onLanguage, cardStyle, onCardStyle, theme, onTheme, sound, onSound } = props
  const levelCards = LEVELS.filter((l) => availableLevels.includes(l.id))

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(2px)' }} />
      <div
        className="vb-scroll"
        style={{
          position: 'relative',
          background: 'var(--bg)',
          borderTop: '1px solid var(--border)',
          borderRadius: '28px 28px 0 0',
          padding: '18px 22px max(26px, calc(env(safe-area-inset-bottom) + 12px))',
          boxShadow: '0 -20px 50px -10px rgba(0,0,0,.6)',
          animation: 'vbUp .3s ease',
          maxHeight: '90%',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'var(--surface2)', margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.3px' }}>Settings</span>
          <button onClick={onClose} style={closeBtn} aria-label="Close">
            <CloseIcon size={16} strokeWidth={2.4} />
          </button>
        </div>

        {/* LEVEL */}
        <Section title="Your level" hint="Words you study come from the selected level.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>
            {levelCards.map((lv) => {
              const active = level === lv.id
              const prog = levelProgress[lv.id]
              const pct = prog && prog.total ? Math.round((prog.learned / prog.total) * 100) : 0
              return (
                <button key={lv.id} onClick={() => onLevel(lv.id)} style={levelCard(active)}>
                  <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.4px' }}>{lv.id}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--muted)', marginTop: 2 }}>{lv.name}</span>
                  <div style={{ width: '100%', height: 4, borderRadius: 999, background: active ? 'rgba(0,0,0,.25)' : 'var(--surface2)', overflow: 'hidden', marginTop: 6 }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: 'var(--ok)', transition: 'width .4s ease' }} />
                  </div>
                  <span style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--muted)', marginTop: 3 }}>{prog ? `${prog.learned}/${prog.total}` : ''}</span>
                </button>
              )
            })}
          </div>
        </Section>

        {/* LANGUAGE */}
        <Section title="Translation language">
          <Segmented
            active={language === 'ru' ? 0 : 1}
            count={2}
            onSelect={(i) => onLanguage(i === 0 ? 'ru' : 'hy')}
            labels={['Русский · RU', 'Հայերեն · HY']}
            armenianIndex={1}
          />
        </Section>

        {/* CARD STYLE */}
        <Section title="Card style">
          <Segmented active={cardStyle} count={3} onSelect={(i) => onCardStyle(i as CardStyle)} labels={[...CARD_STYLES]} />
        </Section>

        {/* THEME */}
        <Section title="Theme">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
            {THEMES.map((t) => {
              const active = theme === t.id
              return (
                <button key={t.id} onClick={() => onTheme(t.id)} style={themeCard(active)}>
                  <span style={{ width: 22, height: 22, borderRadius: 7, background: t.swatch, flex: 'none', border: '1px solid var(--border)' }} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', flex: 1, textAlign: 'left' }}>{t.name}</span>
                  {active && (
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                      <CheckIcon size={11} stroke="#fff" strokeWidth={3.4} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </Section>

        {/* SOUND */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Sound effects</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>Play a chime when you learn a word.</div>
          </div>
          <button onClick={() => onSound(!sound)} aria-label="Toggle sound" style={toggleTrack(sound)}>
            <span style={toggleKnob(sound)} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 4px' }}>{title}</div>
      {hint && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 12 }}>{hint}</div>}
      {!hint && <div style={{ height: 7 }} />}
      {children}
    </div>
  )
}

function Segmented({
  active,
  count,
  onSelect,
  labels,
  armenianIndex,
}: {
  active: number
  count: number
  onSelect: (i: number) => void
  labels: string[]
  armenianIndex?: number
}) {
  return (
    <div style={{ position: 'relative', display: 'flex', background: 'var(--surface2)', borderRadius: 13, padding: 4, border: '1px solid var(--border)' }}>
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          width: `calc((100% - 8px) / ${count})`,
          height: 'calc(100% - 8px)',
          background: 'var(--accent)',
          borderRadius: 10,
          boxShadow: '0 4px 12px -2px var(--accent)',
          transition: 'transform .26s cubic-bezier(.4,1.2,.4,1)',
          transform: `translateX(${active * 100}%)`,
        }}
      />
      {labels.map((label, i) => (
        <button
          key={label}
          onClick={() => onSelect(i)}
          style={{
            position: 'relative',
            zIndex: 2,
            flex: 1,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            height: 42,
            fontFamily: i === armenianIndex ? "'Noto Sans Armenian','Space Grotesk',sans-serif" : 'inherit',
            fontSize: 13,
            fontWeight: 700,
            color: active === i ? '#fff' : 'var(--muted)',
            transition: 'color .2s',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

const closeBtn: CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  cursor: 'pointer',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

function levelCard(active: boolean): CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: '8px 8px',
    borderRadius: 13,
    background: active ? 'var(--accent-soft)' : 'var(--surface)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    color: 'var(--text)',
  }
}

function themeCard(active: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    cursor: 'pointer',
    fontFamily: 'inherit',
    padding: '12px 13px',
    borderRadius: 13,
    background: active ? 'var(--accent-soft)' : 'var(--surface)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
  }
}

function toggleTrack(on: boolean): CSSProperties {
  return {
    position: 'relative',
    width: 50,
    height: 30,
    borderRadius: 999,
    cursor: 'pointer',
    border: 'none',
    flex: 'none',
    background: on ? 'var(--accent)' : 'var(--surface2)',
    transition: 'background .2s',
  }
}

function toggleKnob(on: boolean): CSSProperties {
  return {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#fff',
    transition: 'transform .22s cubic-bezier(.4,1.2,.4,1)',
    transform: on ? 'translateX(20px)' : 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,.3)',
  }
}
