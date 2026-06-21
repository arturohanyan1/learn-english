import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 24, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  }
}

export function BookIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 6.5C10.3 5.2 7.8 4.6 4.8 4.85 4.3 4.9 4 5.25 4 5.75v10.9c0 .55.45.95 1 .9 2.6-.2 4.9.35 6.4 1.45 1.5-1.1 3.8-1.65 6.4-1.45.55.05 1-.35 1-.9V5.75c0-.5-.3-.85-.8-.9-3-.25-5.5.35-7.2 1.65z" />
      <path d="M12 6.5V18" />
    </svg>
  )
}

export function CheckIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function CloseIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}

export function ChevronLeftIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export function ChevronRightIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function SearchIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  )
}

export function CardsIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="13" rx="3" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export function SettingsIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7.7 1.6 1.6 0 01-3.2 0 1.6 1.6 0 00-2.7-.7l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00-1.3-2.7 1.6 1.6 0 010-3.2 1.6 1.6 0 001.3-2.7l-.1-.1A2 2 0 117.2 4.5l.1.1a1.6 1.6 0 002.7-.7V3.8a1.6 1.6 0 013.2 0 1.6 1.6 0 002.7.7l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00.6 2.6" />
    </svg>
  )
}

export function HelpIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12" y2="17" />
    </svg>
  )
}

export function CheckCircleIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </svg>
  )
}

/** Speaker / volume icon (filled cone + sound waves). */
export function SpeakerIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11 5 6 9H3a1 1 0 00-1 1v4a1 1 0 001 1h3l5 4z" />
      <path d="M16 8.5a4 4 0 010 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M18.5 6a7 7 0 010 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}
