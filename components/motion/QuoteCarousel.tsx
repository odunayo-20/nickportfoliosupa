'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { useHydratedReducedMotion } from '@/components/motion/useHydratedReducedMotion'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import type { Testimonial } from '@/lib/content'

const INTERVAL = 6000

/**
 * Proposal C4 — one testimonial at a time; a thin progress line shows when the next arrives,
 * quotes slide in the direction you navigate, hover/focus pauses, arrows/keys/swipe navigate.
 */
export function QuoteCarousel({ items }: { items: Testimonial[] }) {
  const reduce = useHydratedReducedMotion()
  const [[index, dir], setState] = useState<[number, number]>([0, 1])
  const [paused, setPaused] = useState(false)
  const [cycle, setCycle] = useState(0) // restarts the progress bar
  const touch = useRef(0)
  const auto = items.length > 1 && !reduce

  const go = useCallback((next: number, d: number) => {
    setState([(next + items.length) % items.length, d])
    setCycle((c) => c + 1)
  }, [items.length])

  useEffect(() => {
    if (!auto || paused) return
    const t = window.setTimeout(() => go(index + 1, 1), INTERVAL)
    return () => window.clearTimeout(t)
  }, [auto, paused, index, cycle, go])

  if (!items.length) return null
  const q = items[index]

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(index - 1, -1); if (e.key === 'ArrowRight') go(index + 1, 1) }}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1) }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
    >
      <Quote className="w-10 h-10 text-brand-orange mb-6" aria-hidden="true" />
      <div className="relative min-h-[220px] md:min-h-[180px]" aria-live={paused ? 'polite' : 'off'}>
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <m.figure
            key={index}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 40 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -40 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
          >
            <blockquote className="text-2xl md:text-3xl font-bold tracking-tight leading-snug text-ink">“{q.quote}”</blockquote>
            <figcaption className="mt-6 text-sm text-muted">
              <span className="font-bold text-ink">{q.name}</span>
              {q.role && <> · {q.role}</>}
            </figcaption>
          </m.figure>
        </AnimatePresence>
      </div>

      {items.length > 1 && (
        <div className="mt-8 flex items-center gap-4">
          <button type="button" onClick={() => go(index - 1, -1)} aria-label="Previous testimonial" className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:border-brand-orange transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-muted tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
          <div className="flex-1 h-[2px] bg-line rounded-full overflow-hidden">
            {auto && (
              <span
                key={cycle}
                className="quote-progress block h-full bg-brand-orange origin-left"
                style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: paused ? 'paused' : 'running' }}
              />
            )}
          </div>
          <button type="button" onClick={() => go(index + 1, 1)} aria-label="Next testimonial" className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:border-brand-orange transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
