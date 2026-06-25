import { useEffect, useMemo, useRef, useState } from 'react'
import type { CardStyle, Language, Level, LevelCount, ThemeId, Word } from './types'
import { loadWords } from './data/words'
import { getTheme } from './lib/themes'
import { fireConfetti } from './lib/confetti'
import { playWin } from './lib/sound'
import { KEYS } from './lib/storage'
import { useLocalStorage } from './hooks/useLocalStorage'
import Loading from './components/Loading'
import Onboarding from './components/onboarding/Onboarding'
import Header from './components/Header'
import Flashcards from './components/Flashcards'
import GameMode from './components/GameMode'
import Search from './components/Search'
import LearnedWords from './components/LearnedWords'
import Settings from './components/Settings'
import BottomNav, { type Tab } from './components/BottomNav'

export default function App() {
  const [words, setWords] = useState<Word[]>([])
  const [levels, setLevels] = useState<LevelCount[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  // Persisted settings
  const [level, setLevel] = useLocalStorage<Level | null>(KEYS.level, null)
  const [learned, setLearned] = useLocalStorage<number[]>(KEYS.learned, [])
  const [theme, setTheme] = useLocalStorage<ThemeId>(KEYS.theme, 'dark')
  const [language, setLanguage] = useLocalStorage<Language>(KEYS.lang, 'ru')
  const [cardStyle, setCardStyle] = useLocalStorage<CardStyle>(KEYS.style, 0)
  const [sound, setSound] = useLocalStorage<boolean>(KEYS.sound, true)

  // Session UI state
  const [tab, setTab] = useState<Tab>('cards')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const fxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive = true
    loadWords()
      .then(({ words, levels }) => {
        if (!alive) return
        setWords(words)
        setLevels(levels)
        setStatus('ready')
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [])

  const themeDef = getTheme(theme)
  const cssVars = useMemo(
    () => Object.fromEntries(Object.entries(themeDef.vars).filter(([k]) => k.startsWith('--'))),
    [themeDef],
  )
  const colorScheme = themeDef.vars['color-scheme'] as 'dark' | 'light' | undefined

  useEffect(() => {
    document.body.style.background = themeDef.vars['--bg']
  }, [themeDef])

  const availableLevels = useMemo(() => levels.map((l) => l.level), [levels])
  const learnedSet = useMemo(() => new Set(learned), [learned])
  const learnedWords = useMemo(() => words.filter((w) => learnedSet.has(w.id)), [words, learnedSet])
  // Flashcards / game show the selected level only (progress is per level).
  const deck = useMemo(() => (level ? words.filter((w) => w.level === level) : []), [words, level])

  // Learned / total per level, for the progress bars on the settings level cards.
  const levelProgress = useMemo(() => {
    const map: Record<string, { learned: number; total: number }> = {}
    for (const l of levels) map[l.level] = { learned: 0, total: l.count }
    for (const w of learnedWords) {
      const m = map[w.level]
      if (m) m.learned++
    }
    return map
  }, [levels, learnedWords])

  function toggleLearned(id: number) {
    const isLearned = learnedSet.has(id)
    if (!isLearned) {
      fireConfetti(fxRef.current)
      playWin(sound)
    }
    setLearned((prev) => (isLearned ? prev.filter((x) => x !== id) : prev.includes(id) ? prev : [...prev, id]))
  }

  // Game mode marks words known without the per-card confetti/sound.
  function markLearned(id: number) {
    setLearned((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  return (
    <div
      style={{
        ...(cssVars as React.CSSProperties),
        colorScheme,
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 460,
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg)',
          color: 'var(--text)',
        }}
      >
        {/* ambient blobs */}
        <div style={{ position: 'absolute', top: -60, right: -50, width: 220, height: 220, borderRadius: '50%', background: 'var(--accent)', filter: 'blur(70px)', opacity: 0.22, animation: 'vbBlob 9s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 60, left: -70, width: 200, height: 200, borderRadius: '50%', background: '#38BDF8', filter: 'blur(80px)', opacity: 0.1, animation: 'vbBlob 11s ease-in-out infinite reverse', pointerEvents: 'none' }} />

        {/* content */}
        <div style={{ position: 'relative', zIndex: 5, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, paddingTop: 'env(safe-area-inset-top)' }}>
          {status === 'loading' && <Loading />}

          {status === 'error' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 30, textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Couldn't load words</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Check that /words/*.json is served, then reload.</div>
            </div>
          )}

          {status === 'ready' && !level && (
            <Onboarding words={words} availableLevels={availableLevels} onDone={(lvl) => setLevel(lvl)} />
          )}

          {status === 'ready' && level && (
            <>
              <Header
                level={level}
                language={language}
                onOpenSettings={() => setSettingsOpen(true)}
                onLanguage={setLanguage}
              />
              {tab === 'cards' && (
                <Flashcards
                  deck={deck}
                  learned={learnedSet}
                  language={language}
                  cardStyle={cardStyle}
                  onToggleLearned={toggleLearned}
                  onReview={() => setTab('learned')}
                />
              )}
              {tab === 'game' && <GameMode deck={deck} learned={learnedSet} language={language} onLearn={markLearned} />}
              {tab === 'search' && <Search words={words} language={language} />}
              {tab === 'learned' && <LearnedWords words={learnedWords} language={language} onUnlearn={toggleLearned} />}
              <BottomNav tab={tab} onTab={setTab} learnedCount={learnedSet.size} />
            </>
          )}
        </div>

        {/* confetti layer */}
        <div ref={fxRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30, overflow: 'hidden' }} />

        {/* settings */}
        {settingsOpen && level && (
          <Settings
            onClose={() => setSettingsOpen(false)}
            level={level}
            availableLevels={availableLevels}
            levelProgress={levelProgress}
            onLevel={setLevel}
            language={language}
            onLanguage={setLanguage}
            cardStyle={cardStyle}
            onCardStyle={setCardStyle}
            theme={theme}
            onTheme={setTheme}
            sound={sound}
            onSound={setSound}
          />
        )}
      </div>
    </div>
  )
}
