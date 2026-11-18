'use client'

import { ViewTransition } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Animates route changes with the View Transitions API (React <ViewTransition>,
 * enabled by experimental.viewTransition in next.config.ts).
 *
 * Keyed by pathname so ONLY navigations play the exit/enter animation — other
 * transitions inside the page (form submits, likes, router.refresh) don't.
 * Styles: ::view-transition-old/new(.page) in app/main.css.
 * Browsers without support simply swap pages instantly.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <ViewTransition key={pathname} enter="page" exit="page" default="none">
      {children}
    </ViewTransition>
  )
}
