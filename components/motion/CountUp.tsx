'use client'

import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

type CountUpProps = {
  /** e.g. "20+", "5+", "70%" — the leading number animates, the rest is kept as a suffix. */
  value: string
  duration?: number
  className?: string
}

/**
 * Counts up from 0 to the number in `value` when scrolled into view.
 * Server-renders the final value (good for SEO / no-JS) and writes to the DOM directly
 * while animating, so it doesn't re-render React every frame.
 */
export function CountUp({ value, duration = 1.6, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()

  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
  const prefix = match?.[1] ?? ''
  const target = match ? parseFloat(match[2]) : 0
  const suffix = match?.[3] ?? ''
  const decimals = match?.[2].split('.')[1]?.length ?? 0

  useEffect(() => {
    const el = ref.current
    if (!el || !match || !inView || reduce) return
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, target])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
