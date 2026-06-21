import type { CSSProperties } from 'react'
import { CardsIcon, CheckCircleIcon, SearchIcon } from './icons'

export type Tab = 'cards' | 'search' | 'learned'

interface Props {
  tab: Tab
  onTab: (tab: Tab) => void
  learnedCount: number
}

export default function BottomNav({ tab, onTab, learnedCount }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '10px 24px 22px',
        gap: 6,
        borderTop: '1px solid var(--border)',
        background: 'var(--bg)',
      }}
    >
      <button onClick={() => onTab('cards')} style={navBtn(tab === 'cards')}>
        <CardsIcon size={24} />
        <span style={{ fontSize: 11, fontWeight: 600 }}>Flashcards</span>
      </button>
      <button onClick={() => onTab('search')} style={navBtn(tab === 'search')}>
        <SearchIcon size={24} />
        <span style={{ fontSize: 11, fontWeight: 600 }}>Search</span>
      </button>
      <button onClick={() => onTab('learned')} style={navBtn(tab === 'learned')}>
        <div style={{ position: 'relative' }}>
          <CheckCircleIcon size={24} />
          {learnedCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -5,
                right: -9,
                minWidth: 16,
                height: 16,
                padding: '0 4px',
                borderRadius: 999,
                background: 'var(--accent)',
                color: '#fff',
                fontSize: 9.5,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {learnedCount > 99 ? '99+' : learnedCount}
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600 }}>Learned</span>
      </button>
    </div>
  )
}

function navBtn(active: boolean): CSSProperties {
  return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
    padding: '8px 0',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: active ? 'var(--accent2)' : 'var(--muted)',
    transition: 'color .2s',
  }
}
