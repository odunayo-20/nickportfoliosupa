'use client'

import { m, useScroll, useSpring } from 'motion/react'

/** Thin reading-progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  return (
    <m.div
      aria-hidden="true"
      data-testid="scroll-progress"
      style={{ scaleX, viewTransitionName: 'scroll-progress' }}
      className="fixed top-0 left-0 right-0 z-[110] h-[3px] origin-left bg-gradient-to-r from-brand-orange via-brand-orange to-brand-green pointer-events-none"
    />
  )
}
