'use client'

import { useRef, type ReactNode } from 'react'
import { m, useInView, useScroll, useSpring } from 'motion/react'
import { useHydratedReducedMotion } from '@/components/motion/useHydratedReducedMotion'

/**
 * Proposal S3 — an orange line draws down the timeline with scroll; each item lights up when
 * the line reaches it (both keyed to the 60% viewport line). Use <Timeline> around <TimelineItem>s.
 */
export function Timeline({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.6'] })
  const draw = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })

  return (
    <div ref={ref} className={`relative pl-10 md:pl-14 ${className}`}>
      <div aria-hidden="true" className="absolute left-[11px] md:left-[19px] top-2 bottom-2 w-[2px] bg-line rounded-full" />
      <m.div
        aria-hidden="true"
        style={{ scaleY: reduce ? 1 : draw }}
        className="absolute left-[11px] md:left-[19px] top-2 bottom-2 w-[2px] bg-brand-orange rounded-full origin-top"
      />
      {children}
    </div>
  )
}

export function TimelineItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useHydratedReducedMotion()
  // "In view" = top edge has passed the 60% line (bottom margin -40%); stays lit above it.
  const passed = useInView(ref, { margin: '100000px 0px -40% 0px' })
  const on = reduce || passed
  return (
    <div ref={ref} data-on={on ? '1' : '0'} className={`timeline-item relative ${className}`}>
      <span aria-hidden="true" className="absolute -left-10 md:-left-14 top-2 w-6 h-6 md:w-10 md:h-10 flex items-center justify-center">
        <span className="timeline-dot block w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border-2" />
      </span>
      {children}
    </div>
  )
}
