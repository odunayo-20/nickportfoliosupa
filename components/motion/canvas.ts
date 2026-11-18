/** Shared helpers for the decorative canvas effects (FlowField, DotStream). */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isDarkTheme = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark'

/** Size a canvas to its box at device pixel ratio (capped at 2, or 1.25 on small screens where fill cost dominates). */
export function fitCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 2)
  const r = canvas.getBoundingClientRect()
  canvas.width = Math.max(1, Math.round(r.width * dpr))
  canvas.height = Math.max(1, Math.round(r.height * dpr))
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { ctx, w: r.width, h: r.height }
}

/**
 * Runs `frame` on requestAnimationFrame only while `el` is on screen and the tab is visible.
 * Returns a cleanup function.
 */
export function visibleLoop(el: Element, frame: (t: number) => void) {
  let on = false
  let raf = 0
  const tick = (t: number) => {
    frame(t)
    raf = on ? requestAnimationFrame(tick) : 0
  }
  const start = () => { if (on && !raf) raf = requestAnimationFrame(tick) }
  const io = new IntersectionObserver(([e]) => { on = e.isIntersecting && !document.hidden; start() })
  io.observe(el)
  const onVis = () => {
    if (document.hidden) on = false
    else { const r = el.getBoundingClientRect(); on = r.bottom > 0 && r.top < innerHeight; start() }
  }
  document.addEventListener('visibilitychange', onVis)
  return () => {
    on = false
    cancelAnimationFrame(raf)
    io.disconnect()
    document.removeEventListener('visibilitychange', onVis)
  }
}

/** Calls `fn` whenever the site theme changes (data-theme attribute on <html>). */
export function onThemeChange(fn: () => void) {
  const mo = new MutationObserver(fn)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => mo.disconnect()
}
