'use client'

import { useRef } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { useHydratedReducedMotion } from '@/components/motion/useHydratedReducedMotion'

/**
 * Proposal T4 — a statement that brightens word by word as it scrolls through the viewport.
 * `highlight` words (matched without punctuation, case-insensitive) turn orange when lit.
 * Text is real DOM text, so it's readable/indexable regardless of scroll position.
 */
export function ScrollHighlight({ text, highlight = [], className = '' }: { text: string; highlight?: string[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const hl = new Set(highlight.map((w) => w.toLowerCase()))
  const words = text.split(/\s+/)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const el = ref.current
    if (!el || reduce) return
    const n = Math.round(p * words.length)
    el.querySelectorAll<HTMLSpanElement>('[data-w]').forEach((s, i) => { s.dataset.on = i < n ? '1' : '0' })
  })

  return (
    <p ref={ref} className={`scroll-highlight ${reduce ? 'is-static' : ''} ${className}`}>
      {words.map((w, i) => (
        <span key={i}>
          <span data-w="" data-on="0" data-hl={hl.has(w.replace(/[^\p{L}\p{N}+#-]/gu, '').toLowerCase()) ? '1' : undefined}>{w}</span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}
