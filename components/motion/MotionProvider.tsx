'use client'

import { LazyMotion, MotionConfig } from 'motion/react'

const loadFeatures = () => import('./features').then((mod) => mod.default)

/**
 * Global animation setup:
 * - LazyMotion + `m.*` components keep the motion bundle small. `strict` throws in dev
 *   if someone uses the full `motion.*` component, which would defeat the lazy loading.
 * - reducedMotion="user" disables transform/layout animations for visitors who
 *   enabled "reduce motion" in their OS (opacity fades still run).
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
