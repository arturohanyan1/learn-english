import type { ThemeId } from '../types'

export interface Theme {
  id: ThemeId
  name: string
  /** Swatch shown in Settings. */
  swatch: string
  /** CSS custom properties applied to the app root. */
  vars: Record<string, string>
}

/**
 * Dark is taken verbatim from the design tokens. Light / Midnight / Sepia keep
 * the same token structure with palettes built around each theme's background.
 */
export const THEMES: Theme[] = [
  {
    id: 'dark',
    name: 'Dark',
    swatch: 'linear-gradient(135deg,#17171d,#7c5cff)',
    vars: {
      '--bg': '#0e0e12',
      '--text': '#f4f5f8',
      '--surface': '#17171d',
      '--surface2': '#20202a',
      '--accent': '#7c5cff',
      '--accent2': '#9d86ff',
      '--muted': '#8a8a99',
      '--border': 'rgba(255,255,255,0.08)',
      '--border-strong': 'rgba(255,255,255,0.12)',
      '--ok': '#34d399',
      '--accent-soft': 'rgba(124,92,255,0.16)',
      'color-scheme': 'dark',
    },
  },
  {
    id: 'light',
    name: 'Light',
    swatch: 'linear-gradient(135deg,#ffffff,#7c5cff)',
    vars: {
      '--bg': '#efeff4',
      '--text': '#1a1a22',
      '--surface': '#ffffff',
      '--surface2': '#e6e6ee',
      '--accent': '#7c5cff',
      '--accent2': '#6b4ef0',
      '--muted': '#71717f',
      '--border': 'rgba(0,0,0,0.08)',
      '--border-strong': 'rgba(0,0,0,0.14)',
      '--ok': '#16a34a',
      '--accent-soft': 'rgba(124,92,255,0.12)',
      'color-scheme': 'light',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    swatch: 'linear-gradient(135deg,#111a2e,#4f8cff)',
    vars: {
      '--bg': '#080c18',
      '--text': '#e8ecf8',
      '--surface': '#111a2e',
      '--surface2': '#1b263f',
      '--accent': '#4f8cff',
      '--accent2': '#7ba9ff',
      '--muted': '#7a86a8',
      '--border': 'rgba(255,255,255,0.08)',
      '--border-strong': 'rgba(255,255,255,0.12)',
      '--ok': '#34d399',
      '--accent-soft': 'rgba(79,140,255,0.16)',
      'color-scheme': 'dark',
    },
  },
  {
    id: 'sepia',
    name: 'Sepia',
    swatch: 'linear-gradient(135deg,#f5eee0,#a4673c)',
    vars: {
      '--bg': '#ebe0ce',
      '--text': '#3a3326',
      '--surface': '#f5eee0',
      '--surface2': '#ddd0b8',
      '--accent': '#a4673c',
      '--accent2': '#c2864e',
      '--muted': '#897c64',
      '--border': 'rgba(0,0,0,0.08)',
      '--border-strong': 'rgba(0,0,0,0.14)',
      '--ok': '#5e8c4e',
      '--accent-soft': 'rgba(164,103,60,0.15)',
      'color-scheme': 'light',
    },
  },
]

export function getTheme(id: ThemeId): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}
