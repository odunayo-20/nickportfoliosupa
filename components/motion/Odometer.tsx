'use client'

import { useRef, useSyncExternalStore } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

/**
 * Proposal C3 — digits roll into place like a mechanical counter, columns landing one after
 * another. Accepts values like "20+", "8y", "5+". The real value is the accessible name and
 * the server-rendered resting state (columns already at their digit), so no flash and good SEO.
 */
const noop = () => () => {}

export function Odometer({ value, className = '', suffixClassName = 'text-brand-orange' }: { value: string; className?: string; suffixClassName?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  // Server HTML shows the final digits; only after hydration are columns "armed" at 0,
  // waiting to roll when scrolled into view.
  const mounted = useSyncExternalStore(noop, () => true, () => false)
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  if (!match) return <span className={className}>{value}</span>
  const [, prefix, digits, suffix] = match
  const armed = mounted && !reduce

  return (
    <span ref={ref} role="img" aria-label={value} className={`odo ${armed ? 'odo-armed' : ''} ${inView || !armed ? 'odo-in' : ''} ${className}`}>
      {prefix && <span aria-hidden="true">{prefix}</span>}
      {[...digits].map((d, i) => (
        <span key={i} aria-hidden="true" className="odo-col">
          <span className="odo-strip" style={{ ['--d' as string]: d, ['--i' as string]: i }}>
            {'0123456789'.split('').map((n) => <span key={n}>{n}</span>)}
          </span>
        </span>
      ))}
      {suffix && <span aria-hidden="true" className={suffixClassName}>{suffix}</span>}
    </span>
  )
}
