'use client'

import { useLayoutEffect } from 'react'
import { SITE_CLASS } from './theme-script'

/**
 * Keeps `html.site` in sync during client-side navigation between the public site and
 * /admin or /auth (the inline head script only covers full page loads).
 */
export function SiteMarker() {
  useLayoutEffect(() => {
    const html = document.documentElement
    html.classList.add(SITE_CLASS)
    return () => html.classList.remove(SITE_CLASS)
  }, [])
  return null
}
