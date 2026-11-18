'use client'

import { useSyncExternalStore } from 'react'

export type ThemeChoice = 'light' | 'dark' | 'system'
export type Theme = 'light' | 'dark'

import { THEME_STORAGE_KEY as KEY } from './theme-script'

const read = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
const readChoice = (): ThemeChoice => {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}
const systemTheme = (): Theme => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

// One shared subscription: <html data-theme> changes + choice changes + OS changes.
const listeners = new Set<() => void>()
let wired = false
function wire() {
  if (wired) return
  wired = true
  new MutationObserver(() => listeners.forEach((l) => l())).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (readChoice() === 'system') document.documentElement.dataset.theme = systemTheme()
  })
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) document.documentElement.dataset.theme = readChoice() === 'system' ? systemTheme() : (readChoice() as Theme)
    listeners.forEach((l) => l())
  })
}
const subscribe = (l: () => void) => { wire(); listeners.add(l); return () => listeners.delete(l) }

/**
 * Apply a theme choice. With `origin` (a click point) and View Transitions support, the new
 * palette grows as a circle from that point (proposal T1); otherwise it switches instantly.
 */
export function setThemeChoice(choice: ThemeChoice, origin?: { x: number; y: number }) {
  try {
    if (choice === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, choice)
  } catch {}
  const next: Theme = choice === 'system' ? systemTheme() : choice
  const root = document.documentElement
  const apply = () => { root.dataset.theme = next; listeners.forEach((l) => l()) }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (next === read() || !origin || reduce || !('startViewTransition' in document)) { apply(); return }

  const { x, y } = origin
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  root.classList.add('theme-vt')
  const vt = document.startViewTransition(apply)
  vt.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
    .catch(() => {})
  vt.finished.finally(() => root.classList.remove('theme-vt'))
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => 'light' as Theme)
  const choice = useSyncExternalStore(subscribe, readChoice, () => 'system' as ThemeChoice)
  return { theme, choice }
}
