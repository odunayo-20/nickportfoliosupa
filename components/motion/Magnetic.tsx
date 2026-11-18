'use client'

import { useRef } from 'react'
import { m, useReducedMotion, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

type MagneticProps = {
  children: React.ReactNode
  /** 0–1: how far the element follows the cursor relative to its offset from center. */
  strength?: number
  className?: string
}

const SPRING = { stiffness: 220, damping: 15, mass: 0.4 }

/** Wraps an element so it gently pulls toward the mouse cursor while hovered. */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={cn('inline-flex', className)}
    >
      {children}
    </m.div>
  )
}
