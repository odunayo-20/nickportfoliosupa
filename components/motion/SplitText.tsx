'use client'

import { Children, cloneElement, isValidElement, useRef, type ElementType, type ReactElement, type ReactNode } from 'react'
import { useInView } from 'motion/react'
import { useHydratedReducedMotion } from '@/components/motion/useHydratedReducedMotion'

/** Turns text children into per-character spans (words kept together), preserving wrapper elements like <span className="text-brand-orange">. */
function splitNode(node: ReactNode, counter: { i: number }): ReactNode {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
      .split(/(\s+)/)
      .map((part, wi) => {
        if (!part) return null
        if (/^\s+$/.test(part)) return ' '
        return (
          <span key={`w${counter.i}-${wi}`} className="split-word">
            {[...part].map((ch) => (
              <span key={counter.i} className="split-char" style={{ ['--i' as string]: counter.i++ }}>
                {ch}
              </span>
            ))}
          </span>
        )
      })
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>
    if (el.type === 'br') return el
    return cloneElement(el, undefined, Children.map(el.props.children, (c) => splitNode(c, counter)))
  }
  if (Array.isArray(node)) return Children.map(node, (c) => splitNode(c, counter))
  return node
}

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>
    return el.type === 'br' ? ' ' : textOf(el.props.children)
  }
  return ''
}

/**
 * Proposal T2 — letters rise out of a mask with a slight tilt when the heading scrolls into view.
 * Screen readers get the plain text (aria-label on the element, split spans are aria-hidden).
 * Pure CSS transitions (.split-char in main.css), so the cost is one IntersectionObserver.
 */
export function SplitText({
  as: Tag = 'h2',
  children,
  className = '',
  delay = 0,
  stagger = 0.022,
  immediate = false,
  id,
}: {
  as?: ElementType
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
  /** Animate on mount instead of on scroll-in (above-the-fold headings). */
  immediate?: boolean
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useHydratedReducedMotion()
  const shown = reduce || immediate || inView

  return (
    <Tag
      ref={ref}
      id={id}
      aria-label={textOf(children)}
      data-split={shown ? 'in' : 'out'}
      className={`split ${className}`}
      style={{ ['--split-delay' as string]: `${delay}s`, ['--split-stagger' as string]: `${stagger}s` }}
    >
      <span aria-hidden="true">{splitNode(children, { i: 0 })}</span>
    </Tag>
  )
}
