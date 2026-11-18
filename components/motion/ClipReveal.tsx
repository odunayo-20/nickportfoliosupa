'use client'

import type { ReactNode } from 'react'
import { m } from 'motion/react'

const EASE: [number, number, number, number] = [0.77, 0, 0.18, 1]

/**
 * Proposal C1 — the content uncovers from the bottom with a curtain wipe while the inner
 * picture settles from a slight zoom. Wrap an image container; give it the sizing classes.
 * Under reduced motion MotionConfig skips the transform/clip animation.
 */
export function ClipReveal({ children, className = '', delay = 0, radius = '0px' }: { children: ReactNode; className?: string; delay?: number; radius?: string }) {
  return (
    <m.div
      className={className}
      initial={{ clipPath: `inset(100% 0% 0% 0% round ${radius})` }}
      whileInView={{ clipPath: `inset(0% 0% 0% 0% round ${radius})` }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      <m.div
        className="relative w-full h-full"
        initial={{ scale: 1.3 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </m.div>
    </m.div>
  )
}
