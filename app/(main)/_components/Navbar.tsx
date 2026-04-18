'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { name: 'Home',     path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About',    path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog',     path: '/blog' },
]

const Navbar = () => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close drawer whenever the route changes (link was tapped)
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)

  return (
    <>
      {/* ── Desktop / Mobile navbar bar ─────────────────────── */}
      <nav className="sticky top-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center text-brand-dark font-black italic shadow-md shadow-brand-orange/20 group-hover:-translate-y-0.5 transition-transform duration-300">
              N
            </div>
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tighter text-brand-dark group-hover:text-brand-green transition-colors duration-300"
            >
              Nikola<span className="text-brand-orange">.</span>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex gap-8 lg:gap-10 text-[15px] font-bold tracking-wide">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`relative group py-2 transition-colors duration-300 ${
                  isActive(item.path)
                    ? 'text-brand-dark'
                    : 'text-brand-muted hover:text-brand-dark'
                }`}
              >
                {item.name}
                {/* Animated underline — solid when active, animates in on hover */}
                <span
                  className={`absolute left-0 bottom-0 h-[3px] rounded-t-full bg-brand-orange transition-all duration-300 ${
                    isActive(item.path)
                      ? 'w-full scale-x-100'
                      : 'w-full origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right side: CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={`hidden sm:inline-flex px-5 py-2.5 border-2 text-sm font-bold rounded-full transition-all duration-200 ${
                isActive('/contact')
                  ? 'bg-brand-green border-brand-green text-white'
                  : 'bg-brand-light border-brand-green text-brand-green hover:bg-brand-green hover:text-white'
              }`}
            >
              Contact Me
            </Link>

            {/* Hamburger — visible below md */}
            <button
              id="navbar-hamburger"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(prev => !prev)}
              className="md:hidden w-11 h-11 bg-brand-offwhite rounded-full flex items-center justify-center text-brand-dark hover:bg-gray-200 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer overlay ────────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`md:hidden fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`md:hidden fixed top-0 right-0 z-[100] h-full w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <span className="text-lg font-extrabold tracking-tighter text-brand-dark">
            Nikola<span className="text-brand-orange">.</span>
          </span>
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 rounded-full bg-brand-offwhite flex items-center justify-center text-brand-dark hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex flex-col gap-1 px-4 py-6 flex-grow">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-sharp text-[15px] font-bold transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-brand-dark text-white'
                  : 'text-brand-muted hover:text-brand-dark hover:bg-brand-offwhite'
              }`}
            >
              {isActive(item.path) && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
              )}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Drawer CTA */}
        <div className="px-6 py-6 border-t border-gray-100">
          <Link
            href="/contact"
            className="block w-full text-center px-6 py-3.5 bg-brand-green text-white text-sm font-bold rounded-full hover:bg-brand-dark transition-all duration-200 shadow-sm"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </>
  )
}

export default Navbar