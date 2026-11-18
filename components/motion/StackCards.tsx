'use client'

import { Children, useRef, type ReactNode } from 'react'
import { m, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useHydratedReducedMotion } from '@/components/motion/useHydratedReducedMotion'

function StackItem({ children, index, total, progress, top }: { children: ReactNode; index: number; total: number; progress: MotionValue<number>; top: number }) {
  // Card i starts shrinking once the next card begins to cover it.
  const start = index / total
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index - 1) * 0.04])
  const brightness = useTransform(progress, [start, 1], [1, 1 - (total - index - 1) * 0.08])
  const filter = useTransform(brightness, (b) => `brightness(${b})`)
  return (
    <div className="md:sticky" style={{ top: top + index * 18 }}>
      <m.div style={{ scale, filter, transformOrigin: 'center top' }} className="will-change-transform">
        {children}
      </m.div>
    </div>
  )
}

/**
 * Proposal S1 — cards pin one after another; the ones underneath shrink back like a deck.
 * Each child is one card. Falls back to a normal list under reduced motion.
 */
export function StackCards({ children, className = '', top = 112, gap = 'gap-8' }: { children: ReactNode; className?: string; top?: number; gap?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const items = Children.toArray(children)

  if (reduce) return <div className={`flex flex-col ${gap} ${className}`}>{items}</div>
  return (
    <div ref={ref} className={`relative flex flex-col ${gap} ${className}`}>
      {items.map((child, i) => (
        <StackItem key={i} index={i} total={items.length} progress={scrollYProgress} top={top}>
          {child}
        </StackItem>
      ))}
    </div>
  )
}
