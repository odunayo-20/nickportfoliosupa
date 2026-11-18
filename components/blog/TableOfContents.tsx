'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { useLenis } from 'lenis/react'
import { ChevronDown, List } from 'lucide-react'
import type { TocHeading } from '@/lib/toc'
import { spring } from '@/lib/motion'

/** Tracks which heading is currently being read (the last one above ~25% of the viewport). */
function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    if (!ids.length) return
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const update = () => {
      const line = window.innerHeight * 0.25
      let current = els[0]?.id ?? null
      for (const el of els) {
        if (el.getBoundingClientRect().top - line <= 0) current = el.id
        else break
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids])

  return active
}

const NAV_OFFSET = 88

function TocList({ headings, active, onNavigate, indicatorId }: { headings: TocHeading[]; active: string | null; onNavigate?: () => void; indicatorId: string }) {
  const lenis = useLenis()

  // Handle the scroll here instead of Lenis' global anchor handler: lazy images above the
  // target can change the layout mid-scroll, so re-check the landing spot and correct it.
  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    e.stopPropagation()
    history.replaceState(null, '', `#${id}`)
    // Article headings carry scroll-margin-top: 88px (main.css); both native scrollIntoView
    // and Lenis apply it, so no extra offset here.
    const off = () => Math.abs(el.getBoundingClientRect().top - NAV_OFFSET) > 4
    const scroll = () => {
      if (!lenis) {
        el.scrollIntoView({ block: 'start' })
        window.setTimeout(() => off() && el.scrollIntoView({ block: 'start' }), 500)
        return
      }
      lenis.scrollTo(el, {
        onComplete: () => { if (off()) lenis.scrollTo(el, { duration: 0.5 }) },
      })
    }
    // Mobile box: collapse first (it sits above the article, so collapsing shifts the
    // content), then scroll once the 300ms height animation has finished.
    if (onNavigate) {
      onNavigate()
      window.setTimeout(scroll, 320)
    } else scroll()
  }

  return (
    <ul className="space-y-1 border-l border-line">
      {headings.map((h) => {
        const isActive = h.id === active
        return (
          <li key={h.id} className="relative">
            {isActive && (
              <m.span
                layoutId={indicatorId}
                transition={spring}
                className="absolute -left-px top-0 bottom-0 w-[2px] bg-brand-orange rounded-full"
              />
            )}
            {/* Plain #hash links: Lenis (anchors option) turns them into smooth scrolls with a navbar offset */}
            <a
              href={`#${h.id}`}
              onClick={(e) => go(e, h.id)}
              aria-current={isActive ? 'location' : undefined}
              className={`block py-1.5 text-sm leading-snug transition-colors duration-200 ${h.level === 3 ? 'pl-7' : 'pl-4'} ${
                isActive ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {h.text}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Desktop (xl+): sticky sidebar next to the article.
 * Below xl: collapsible "On this page" box above the article.
 */
export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const active = useActiveHeading(headings.map((h) => h.id))
  const [open, setOpen] = useState(false)
  if (headings.length < 2) return null

  return (
    <>
      {/* Desktop sidebar — sits in the left gutter of the 3xl article column */}
      <aside className="hidden xl:block absolute top-0 bottom-0 right-full mr-12 w-60 not-prose">
        <nav aria-label="Table of contents" className="sticky top-28">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink mb-4">
            <List className="w-4 h-4 text-brand-orange" /> On this page
          </p>
          <TocList headings={headings} active={active} indicatorId="toc-active-desktop" />
        </nav>
      </aside>

      {/* Mobile / tablet collapsible */}
      <nav aria-label="Table of contents" className="xl:hidden mb-10 rounded-sharp border border-line bg-surface-alt not-prose">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-ink"
        >
          <span className="flex items-center gap-2"><List className="w-4 h-4 text-brand-orange" /> On this page</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5">
                <TocList headings={headings} active={active} onNavigate={() => setOpen(false)} indicatorId="toc-active-mobile" />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
