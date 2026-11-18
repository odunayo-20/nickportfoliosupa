'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { setThemeChoice, useTheme, type ThemeChoice } from './theme'

/** Proposal T1 — round toggle: sun sets, moon rises; the new theme grows from the button. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setThemeChoice(dark ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className={`relative w-10 h-10 rounded-full bg-surface-alt text-ink flex items-center justify-center overflow-hidden hover:bg-surface-2 transition-colors ${className}`}
    >
      <Sun className={`absolute w-[18px] h-[18px] transition-[translate,rotate,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${dark ? '-translate-y-8 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'}`} />
      <Moon className={`absolute w-[18px] h-[18px] transition-[translate,rotate,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${dark ? 'translate-y-0 rotate-0 opacity-100' : 'translate-y-8 -rotate-45 opacity-0'}`} />
    </button>
  )
}

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
]

/** Three-way control (mobile drawer, footer): light / dark / follow the system. */
export function ThemeSegmented({ className = '' }: { className?: string }) {
  const { choice } = useTheme()
  return (
    <div role="radiogroup" aria-label="Colour theme" className={`inline-flex p-1 rounded-full bg-surface-alt border border-line ${className}`}>
      {OPTIONS.map(({ value, label, Icon }) => {
        const on = choice === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setThemeChoice(value, { x: r.left + r.width / 2, y: r.top + r.height / 2 })
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${on ? 'bg-ink text-surface' : 'text-ink-muted hover:text-ink'}`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        )
      })}
    </div>
  )
}
