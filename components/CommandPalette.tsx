'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, m } from 'motion/react'
import { ArrowRight, FileText, FolderGit2, Moon, Search, Sun, LayoutGrid } from 'lucide-react'
import type { SearchEntry } from '@/lib/search-index'
import { useScrollLock } from '@/components/motion/SmoothScroll'
import { setThemeChoice, useTheme } from '@/components/theme/theme'

const KIND_LABEL = { page: 'Page', project: 'Project', post: 'Article' } as const
const KIND_ICON = { page: LayoutGrid, project: FolderGit2, post: FileText } as const

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Opens the palette from anywhere (e.g. the navbar search button). */
export const openCommandPalette = () => window.dispatchEvent(new Event('open-command-palette'))

/**
 * Phase 4 — ⌘K / Ctrl+K / "/" site search: pages, projects, articles, plus a theme action.
 * Index is built on the server (lib/search-index.ts) and filtered locally.
 */
export function CommandPalette({ index }: { index: SearchEntry[] }) {
  const router = useRouter()
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)
  useScrollLock(open)

  const show = () => { setQ(''); setSel(0); setOpen(true) }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      const typing = /^(input|textarea|select)$/i.test(t.tagName) || t.isContentEditable
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        show()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-command-palette', show)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('open-command-palette', show) }
  }, [])

  type Item = (SearchEntry & { action?: undefined }) | { kind: 'action'; title: string; hint: string; action: () => void; href?: undefined }
  const results: Item[] = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean)
    const themeAction: Item = {
      kind: 'action',
      title: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      hint: 'Theme',
      action: () => setThemeChoice(theme === 'dark' ? 'light' : 'dark'),
    }
    if (!terms.length) return [...index.filter((e) => e.kind === 'page'), themeAction]
    const scored = index
      .map((e) => {
        const title = norm(e.title)
        const hay = `${title} ${norm(e.hint ?? '')} ${norm(e.keywords ?? '')}`
        if (!terms.every((t) => hay.includes(t))) return null
        const score = terms.reduce((s, t) => s + (title.startsWith(t) ? 6 : title.includes(t) ? 3 : 1), 0) + (e.kind === 'page' ? 1 : 0)
        return { e, score }
      })
      .filter((x): x is { e: SearchEntry; score: number } => !!x)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.e as Item)
    if (terms.some((t) => 'theme dark light mode'.includes(t))) scored.push(themeAction)
    return scored
  }, [q, index, theme])

  const run = (item: Item | undefined) => {
    if (!item) return
    setOpen(false)
    if (item.kind === 'action') item.action()
    else router.push(item.href)
  }

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${sel}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [sel])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search the site" data-lenis-prevent>
          <m.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <m.div
            className="relative w-full max-w-xl rounded-2xl bg-surface border border-line shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onAnimationStart={() => input.current?.focus()}
          >
            <div className="flex items-center gap-3 px-5 border-b border-line">
              <Search className="w-5 h-5 text-ink-muted shrink-0" aria-hidden="true" />
              <input
                ref={input}
                autoFocus
                value={q}
                onChange={(e) => { setQ(e.target.value); setSel(0) }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') { e.preventDefault(); setOpen(false) }
                  else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)) }
                  else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)) }
                  else if (e.key === 'Enter') { e.preventDefault(); run(results[sel]) }
                }}
                placeholder="Search projects, articles, pages…"
                aria-label="Search"
                aria-controls="palette-results"
                aria-activedescendant={results[sel] ? `palette-${sel}` : undefined}
                className="flex-1 h-14 bg-transparent text-ink placeholder:text-ink-muted outline-none text-base"
              />
              <kbd className="hidden sm:inline text-[10px] font-mono font-semibold text-ink-muted border border-line rounded px-1.5 py-0.5">ESC</kbd>
            </div>

            <ul ref={list} id="palette-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-4 py-10 text-center text-sm text-ink-muted">No results for “{q}”.</li>
              )}
              {results.map((r, i) => {
                const Icon = r.kind === 'action' ? (theme === 'dark' ? Sun : Moon) : KIND_ICON[r.kind]
                const active = i === sel
                return (
                  <li key={`${r.kind}-${r.title}-${i}`} id={`palette-${i}`} role="option" aria-selected={active} data-i={i}>
                    <button
                      type="button"
                      onMouseMove={() => setSel(i)}
                      onClick={() => run(r)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${active ? 'bg-surface-alt' : ''}`}
                    >
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-brand-orange text-brand-dark' : 'bg-surface-2 text-ink-muted'}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-ink truncate">{r.title}</span>
                        <span className="block text-xs text-ink-muted truncate">
                          {r.kind === 'action' ? r.hint : [KIND_LABEL[r.kind], r.hint].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                      <ArrowRight className={`w-4 h-4 transition-[opacity,translate] ${active ? 'opacity-100 text-brand-orange' : 'opacity-0 -translate-x-1'}`} />
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="hidden sm:flex items-center gap-4 px-5 py-3 border-t border-line text-[11px] text-ink-muted">
              <span><kbd className="font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="font-mono">↵</kbd> open</span>
              <span className="ml-auto"><kbd className="font-mono">⌘K</kbd> / <kbd className="font-mono">/</kbd> anytime</span>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}
