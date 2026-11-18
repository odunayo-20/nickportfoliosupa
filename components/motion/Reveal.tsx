'use client'

import { createContext, useContext, useMemo } from 'react'
import { m, type HTMLMotionProps, type Variants } from 'motion/react'
import { fadeInUp, stagger, VIEWPORT } from '@/lib/motion'

type Trigger = { immediate?: boolean }

/** True inside <Stagger>: children then inherit the parent's trigger instead of their own. */
const InStagger = createContext(false)

const triggerProps = (immediate?: boolean) =>
  immediate ? { animate: 'visible' } : { whileInView: 'visible', viewport: VIEWPORT }

/** Merges a delay into the "visible" variant (variant transitions win over the `transition` prop). */
function withDelay(variants: Variants, delay?: number): Variants {
  if (!delay) return variants
  const visible = variants.visible
  if (!visible || typeof visible === 'function') return variants
  return { ...variants, visible: { ...visible, transition: { ...visible.transition, delay } } }
}

type RevealProps = Omit<HTMLMotionProps<'div'>, 'variants'> &
  Trigger & {
    variants?: Variants
    /** Extra delay in seconds before this element animates. */
    delay?: number
  }

/**
 * Scroll reveal for a single element. Inside <Stagger> it inherits the parent's
 * trigger and timing, so leave `immediate` off there.
 */
export function Reveal({ variants = fadeInUp, delay, immediate, ...props }: RevealProps) {
  const inStagger = useContext(InStagger)
  const v = useMemo(() => withDelay(variants, delay), [variants, delay])
  if (inStagger) return <m.div variants={v} {...props} />
  return <m.div initial="hidden" {...triggerProps(immediate)} variants={v} {...props} />
}

type StaggerProps = Omit<HTMLMotionProps<'div'>, 'variants'> &
  Trigger & {
    /** Seconds between each child. */
    gap?: number
    /** Seconds before the first child starts. */
    delay?: number
  }

/** Container that reveals its <Reveal> / variant children one after another. */
export function Stagger({ gap = 0.15, delay = 0, immediate, ...props }: StaggerProps) {
  const v = useMemo(() => stagger(gap, delay), [gap, delay])
  return (
    <InStagger.Provider value>
      <m.div initial="hidden" {...triggerProps(immediate)} variants={v} {...props} />
    </InStagger.Provider>
  )
}
