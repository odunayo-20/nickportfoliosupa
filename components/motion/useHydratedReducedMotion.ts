'use client'

import { useSyncExternalStore } from 'react'
import { useReducedMotion } from 'motion/react'

const subscribe = () => () => {}

/**
 * `useReducedMotion()` is null on the server but true on a reduced-motion client, so using it to
 * pick markup/styles during render causes hydration mismatches. This returns false on the server
 * and during hydration, then the real preference right after. CSS `prefers-reduced-motion` rules
 * cover the first paint.
 */
export function useHydratedReducedMotion(): boolean {
  const reduce = useReducedMotion()
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false)
  return hydrated && !!reduce
}
