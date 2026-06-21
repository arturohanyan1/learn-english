import type { CSSProperties } from 'react'
import { CardsIcon, CheckCircleIcon, SearchIcon, ZapIcon } from './icons'

export type Tab = 'cards' | 'game' | 'search' | 'learned'

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
        padding: '10px 14px 22px',
        gap: 2,
        borderTop: '1px solid var(--border)',
        background: 'var(--bg)',
      }}
    >
      <button onClick={() => onTab('cards')} style={navBtn(tab === 'cards')}>
        <CardsIcon size={24} />
        <span style={navLabel}>Flashcards</span>
      </button>
      <button onClick={() => onTab('game')} style={navBtn(tab === 'game')}>
        <ZapIcon size={24} />
        <span style={navLabel}>Game</span>
      </button>
      <button onClick={() => onTab('search')} style={navBtn(tab === 'search')}>
        <SearchIcon size={24} />
        <span style={navLabel}>Search</span>
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
        <span style={navLabel}>Learned</span>
      </button>
    </div>
  )
}

const navLabel: CSSProperties = {
  fontSize: 10.5,
  fontWeight: 600,
  whiteSpace: 'nowrap',
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
