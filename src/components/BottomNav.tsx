import type { CSSProperties } from 'react'
import { CardsIcon, SearchIcon } from './icons'

export type Tab = 'cards' | 'search'

interface Props {
  tab: Tab
  onTab: (tab: Tab) => void
}

export default function BottomNav({ tab, onTab }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '10px 30px 22px',
        gap: 10,
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
