'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

const GLYPHS = '!<>-_\\/[]{}=+*^?#01'

/**
 * Proposal T3 — text resolves from random glyphs, like a terminal.
 * Scrambles the first time it scrolls into view and whenever `text` changes.
 * The real text is always available to assistive tech via the sr-only copy.
 */
export function ScrambleText({ text, className = '', duration = 900, decodeOnView = true }: { text: string; className?: string; duration?: number; /** false = show the real text on load and only scramble when `text` changes (keeps LCP text stable) */ decodeOnView?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const out = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [prev, setPrev] = useState(text)

  useEffect(() => {
    const el = out.current
    if (!el) return
    if (reduce || !inView) { el.textContent = text; return }
    if (!el.dataset.started && !decodeOnView) { el.dataset.started = '1'; return }
    const from = el.dataset.started ? prev : text.replace(/\S/g, ' ')
    el.dataset.started = '1'
    const len = Math.max(from.length, text.length)
    const queue = Array.from({ length: len }, (_, i) => ({
      from: from[i] ?? '',
      to: text[i] ?? '',
      start: Math.random() * duration * 0.4,
      end: duration * 0.4 + Math.random() * duration * 0.6,
    }))
    const t0 = performance.now()
    let raf = 0
    const frame = (now: number) => {
      const e = now - t0
      let html = ''
      let done = 0
      for (const c of queue) {
        if (e >= c.end) { html += c.to; done++ }
        else if (e >= c.start) html += `<span class="text-brand-orange/80">${GLYPHS[(Math.random() * GLYPHS.length) | 0]}</span>`
        else html += c.from
      }
      el.innerHTML = html
      if (done < queue.length) raf = requestAnimationFrame(frame)
      else setPrev(text)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `prev` is the previous text, read only when `text` changes
  }, [text, inView, reduce, duration, decodeOnView])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span ref={out} aria-hidden="true" className="whitespace-pre-wrap">{text}</span>
    </span>
  )
}
