'use client'

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

/**
 * Proposal S2 — the section pins while vertical scroll moves a row of cards sideways, with a
 * progress line underneath. Desktop (lg+) only; on smaller screens and under reduced motion
 * it's a native swipeable row with scroll-snap.
 */
export function HorizontalPin({ children, header }: { children: ReactNode; header?: ReactNode }) {
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [dist, setDist] = useState(0)
  const [pin, setPin] = useState(false)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const measure = () => {
      const t = track.current
      if (!t) return
      setPin(mq.matches && !reduce)
      setDist(Math.max(0, t.scrollWidth - t.clientWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    mq.addEventListener('change', measure)
    return () => { ro.disconnect(); mq.removeEventListener('change', measure) }
  }, [reduce])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const x = useTransform(smooth, [0, 1], [0, -dist])

  if (!pin) {
    return (
      <div ref={section}>
        {header}
        <div ref={track} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 pb-6 px-6 [scrollbar-width:thin]">
          {children}
        </div>
      </div>
    )
  }

  return (
    // Height = one screen + the horizontal distance, so scrolling it reads at 1:1 speed.
    <div ref={section} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {header}
        <m.div ref={track} style={{ x }} className="flex gap-8 will-change-transform">
          {children}
        </m.div>
        <div className="max-w-7xl w-full mx-auto px-6 mt-10">
          <div className="h-[3px] bg-line rounded-full overflow-hidden max-w-xs">
            <m.div style={{ scaleX: smooth }} className="h-full bg-brand-orange origin-left" />
          </div>
        </div>
      </div>
    </div>
  )
}
