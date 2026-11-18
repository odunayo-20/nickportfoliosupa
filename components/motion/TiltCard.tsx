'use client'

import { useRef } from 'react'
import { m, useReducedMotion, useSpring, type HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'

type TiltCardProps = HTMLMotionProps<'div'> & {
  /** Max tilt in degrees. */
  max?: number
  /** Colour of the cursor spotlight (any CSS colour), or false to disable it. */
  spotlight?: string | false
}

const SPRING = { stiffness: 220, damping: 22, mass: 0.5 }

/**
 * Card that tilts in 3D toward the cursor with a soft spotlight following it.
 * Mouse only; still for touch and reduced motion. Accepts all m.div props (variants etc.).
 */
export function TiltCard({
  children,
  className,
  style,
  max = 7,
  spotlight = 'rgba(255, 184, 0, 0.16)',
  onPointerMove,
  onPointerLeave,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const rotateX = useSpring(0, SPRING)
  const rotateY = useSpring(0, SPRING)

  return (
    <m.div
      ref={ref}
      {...props}
      onPointerMove={(e) => {
        onPointerMove?.(e)
        const el = ref.current
        if (reduce || e.pointerType !== 'mouse' || !el) return
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        rotateY.set((px - 0.5) * max * 2)
        rotateX.set(-(py - 0.5) * max * 2)
        el.style.setProperty('--mx', `${px * 100}%`)
        el.style.setProperty('--my', `${py * 100}%`)
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        rotateX.set(0)
        rotateY.set(0)
      }}
      style={{ rotateX, rotateY, transformPerspective: 900, ...style }}
      className={cn('group/tilt relative', className)}
    >
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{
            background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${spotlight}, transparent 45%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">{children as React.ReactNode}</div>
    </m.div>
  )
}
