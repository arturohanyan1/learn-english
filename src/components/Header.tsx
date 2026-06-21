import type { Language, Level } from '../types'
import { levelName } from '../lib/levels'
import { BookIcon, SettingsIcon } from './icons'

interface Props {
  level: Level
  language: Language
  onOpenSettings: () => void
  onLanguage: (lang: Language) => void
}

export default function Header({ level, language, onOpenSettings, onLanguage }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '10px 22px 4px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              flex: 'none',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 14px -5px var(--accent)',
            }}
          >
            <BookIcon size={18} stroke="#fff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, lineHeight: 1 }}>
            <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.5px', color: 'var(--text)' }}>Oxford</span>
            <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.5px', color: 'var(--accent2)' }}>5000</span>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            marginTop: 6,
            cursor: 'pointer',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 999,
            padding: '5px 11px',
            fontFamily: 'inherit',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent2)' }}>{level}</span>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--muted)' }}>{levelName(level)}</span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 2 }}>
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            cursor: 'pointer',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <SettingsIcon size={18} />
        </button>
        <LanguageToggle language={language} onLanguage={onLanguage} />
      </div>
    </div>
  )
}

function LanguageToggle({ language, onLanguage }: { language: Language; onLanguage: (l: Language) => void }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        background: 'var(--surface2)',
        borderRadius: 12,
        padding: 3,
        border: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: 3,
          width: 'calc(50% - 3px)',
          height: 'calc(100% - 6px)',
          background: 'var(--accent)',
          borderRadius: 9,
          transition: 'transform .28s cubic-bezier(.4,1.2,.4,1)',
          boxShadow: '0 4px 12px -2px var(--accent)',
          transform: language === 'ru' ? 'translateX(0)' : 'translateX(100%)',
        }}
      />
      {(['ru', 'hy'] as const).map((l) => (
        <button
          key={l}
          onClick={() => onLanguage(l)}
          style={{
            position: 'relative',
            zIndex: 2,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            width: 42,
            height: 30,
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 700,
            color: language === l ? '#fff' : 'var(--muted)',
            transition: 'color .2s',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
