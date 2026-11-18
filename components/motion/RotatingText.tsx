'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/utils'

type RotatingTextProps = {
  phrases: string[]
  /** Milliseconds each phrase stays visible. */
  interval?: number
  className?: string
}

/**
 * Cycles through phrases with a masked vertical slide.
 * All phrases are stacked invisibly in one grid cell so the box always reserves the
 * tallest/widest phrase — no layout shift when the text changes.
 * Decorative: pair it with an sr-only version of the text for screen readers.
 */
export function RotatingText({ phrases, interval = 2800, className }: RotatingTextProps) {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || phrases.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), interval)
    return () => clearInterval(id)
  }, [reduce, phrases.length, interval])

  return (
    <span className={cn('relative inline-grid overflow-hidden pb-[0.12em] align-bottom', className)} aria-hidden="true">
      {/* Size reservers */}
      {phrases.map((p) => (
        <span key={`reserve-${p}`} className="invisible col-start-1 row-start-1">
          {p}
        </span>
      ))}

      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={phrases[index]}
          className="col-start-1 row-start-1"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1, transition: { duration: 0.5, ease: EASE_OUT } }}
          exit={{ y: '-100%', opacity: 0, transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] } }}
        >
          {phrases[index]}
        </m.span>
      </AnimatePresence>
    </span>
  )
}
