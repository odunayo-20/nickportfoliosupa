'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { RollText } from '@/components/motion/RollText'
import { ThemeToggle, ThemeSegmented } from '@/components/theme/ThemeToggle'
import { openCommandPalette } from '@/components/CommandPalette'
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react'
import { myAppHook } from '@/context/AppUtils'
import { EASE_OUT, spring } from '@/lib/motion'
import { useScrollLock } from '@/components/motion/SmoothScroll'

const NAV_LINKS = [
  { name: 'Home',     path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About',    path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog',     path: '/blog' },
]

/** Pixels scrolled before the bar is allowed to hide. */
const HIDE_AFTER = 160

const drawerList = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
}
const drawerItem = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } },
}

const Navbar = () => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const { siteSettings } = myAppHook()

  // Hide on scroll down, reveal on scroll up; compact style once scrolled.
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 8)
    if (y > prev && y > HIDE_AFTER) setHidden(true)
    else if (y < prev) setHidden(false)
  })

  // Close drawer & reveal the bar whenever the route changes (adjusting state during render)
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    setMobileOpen(false)
    setHidden(false)
  }

  // Lock page scroll while the drawer is open; close on Escape
  useScrollLock(mobileOpen)

  // Drawer links: let the drawer finish its exit before navigating, so the page View
  // Transition doesn't snapshot a half-unmounted fixed drawer (crashed WebKit in QA).
  const router = useRouter()
  const navigateFromDrawer = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    setMobileOpen(false)
    if (path !== pathname) window.setTimeout(() => router.push(path), 280)
  }
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)

  const siteTitle = siteSettings?.site_title || 'Nikola'

  return (
    <>
      {/* ── Desktop / Mobile navbar bar ─────────────────────── */}
      <m.nav
        id="site-header"
        style={{ viewTransitionName: 'site-header' }}
        initial={false}
        animate={{ y: hidden && !mobileOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className={`sticky top-0 w-full z-[100] backdrop-blur-xl border-b transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled
            ? 'bg-surface/85 border-line/80 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)]'
            : 'bg-surface/60 border-transparent'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center transition-[padding] duration-300 ${
            scrolled ? 'py-2.5' : 'py-4'
          }`}
        >
          {/* Logo */}
          <Link href="/" aria-label={`${siteTitle} — home`} className="flex items-center gap-3 group">
            <m.div
              whileHover={{ rotate: -12, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={spring}
              className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center text-brand-dark font-black italic shadow-md shadow-brand-orange/20 overflow-hidden"
            >
              {siteSettings?.logo ? (
                <img src={siteSettings.logo} alt="" className="w-full h-full object-cover" />
              ) : (
                siteTitle[0]
              )}
            </m.div>

            <span className="text-2xl font-extrabold tracking-tighter text-ink group-hover:text-accent-green transition-colors duration-300">
              {siteTitle}<span className="text-brand-orange">.</span>
            </span>
          </Link>

          {/* Desktop links — hover pill + active underline both slide between items */}
          <div
            className="hidden md:flex gap-1 lg:gap-2 text-[15px] font-bold tracking-wide"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV_LINKS.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onMouseEnter={() => setHovered(item.path)}
                  onFocus={() => setHovered(item.path)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative isolate px-4 py-2 rounded-full transition-colors duration-300 ${
                    active ? 'text-ink' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {hovered === item.path && (
                    <m.span
                      layoutId="nav-hover"
                      className="absolute inset-0 -z-10 rounded-full bg-surface-alt"
                      transition={spring}
                    />
                  )}
                  <RollText>{item.name}</RollText>
                  {active && (
                    <m.span
                      layoutId="nav-active"
                      className="absolute left-4 right-4 -bottom-0.5 h-[3px] rounded-full bg-brand-orange"
                      transition={spring}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side: search, theme, CTA, hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label="Search the site (Ctrl+K)"
              title="Search (⌘K)"
              className="hidden sm:flex items-center gap-2 h-10 pl-3 pr-2 rounded-full bg-surface-alt text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors"
            >
              <Search className="w-4 h-4" />
              <kbd className="hidden lg:inline font-mono text-[10px] font-semibold border border-line rounded px-1.5 py-0.5">⌘K</kbd>
            </button>
            <ThemeToggle className="hidden sm:flex" />
            <m.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={spring} className="hidden sm:inline-flex">
              <Link
                href="/contact"
                aria-current={isActive('/contact') ? 'page' : undefined}
                className={`btn-fill px-5 py-2.5 border-2 text-sm font-bold rounded-full transition-colors duration-300 [--fill:var(--color-brand-green)] [--fill-ink:#fff] ${
                  isActive('/contact')
                    ? 'bg-brand-green border-brand-green text-white'
                    : 'bg-surface border-accent-green text-accent-green hover:border-brand-green'
                }`}
              >
                Contact Me
              </Link>
            </m.div>

            {/* Hamburger — visible below md */}
            <button
              id="navbar-hamburger"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              onClick={() => setMobileOpen(prev => !prev)}
              className="md:hidden w-11 h-11 bg-surface-alt rounded-full flex items-center justify-center text-ink hover:bg-surface-2 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </m.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </m.nav>

      {/* ── Mobile drawer ────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <m.div
              key="backdrop"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            <m.div
              key="drawer"
              id="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0, transition: { type: 'spring', stiffness: 320, damping: 34 } }}
              exit={{ x: '100%', transition: { duration: 0.25, ease: EASE_OUT } }}
              className="md:hidden fixed top-0 right-0 z-[100] h-full w-72 max-w-[85vw] bg-surface shadow-2xl flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-line">
                <span className="text-lg font-extrabold tracking-tighter text-ink">
                  {siteTitle}<span className="text-brand-orange">.</span>
                </span>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-ink hover:bg-surface-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer links */}
              <m.nav
                initial="hidden"
                animate="visible"
                variants={drawerList}
                className="flex flex-col gap-1 px-4 py-6 flex-grow"
              >
                {NAV_LINKS.map((item) => (
                  <m.div key={item.name} variants={drawerItem}>
                    <Link
                      href={item.path}
                      onClick={(e) => navigateFromDrawer(e, item.path)}
                      aria-current={isActive(item.path) ? 'page' : undefined}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-sharp text-[15px] font-bold transition-colors duration-200 ${
                        isActive(item.path)
                          ? 'bg-ink text-surface'
                          : 'text-ink-muted hover:text-ink hover:bg-surface-alt'
                      }`}
                    >
                      {isActive(item.path) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                      )}
                      {item.name}
                    </Link>
                  </m.div>
                ))}
              </m.nav>

              {/* Drawer: search + theme */}
              <div className="px-6 pb-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); window.setTimeout(openCommandPalette, 280) }}
                  aria-label="Search the site"
                  className="shrink-0 w-10 h-10 rounded-full bg-surface-alt border border-line flex items-center justify-center text-ink-muted hover:text-ink"
                >
                  <Search className="w-4 h-4" />
                </button>
                <ThemeSegmented className="min-w-0" />
              </div>

              {/* Drawer CTA */}
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.4, ease: EASE_OUT } }}
                className="px-6 py-6 border-t border-line"
              >
                <Link
                  href="/contact"
                  onClick={(e) => navigateFromDrawer(e, '/contact')}
                  className="block w-full text-center px-6 py-3.5 bg-brand-green text-white text-sm font-bold rounded-full hover:bg-brand-dark transition-colors duration-200 shadow-sm"
                >
                  Contact Me
                </Link>
              </m.div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
