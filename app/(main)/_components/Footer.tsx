'use client'

import { useEffect, useRef } from 'react'
import { ArrowUp, ArrowUpRight, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { m, useScroll, useTransform } from 'motion/react'
import { useHydratedReducedMotion } from '@/components/motion/useHydratedReducedMotion'
import { useLenis } from 'lenis/react'
import { Magnetic } from '@/components/motion/Magnetic'
import { FlowField } from '@/components/motion/FlowField'
import { RollText } from '@/components/motion/RollText'
import { NewsletterForm } from '@/components/NewsletterForm'
import { LinkedinIcon, GithubIcon, XIcon } from '@/components/Icons'
import { myAppHook } from '@/context/AppUtils'
import { useGDPR } from '@/context/GDPRContext'


/**
 * Oversized "let's build something great together" band. The two lines slide in from opposite
 * sides and settle fully in view; the font size is fitted so the widest line always fits the
 * container (no clipped letters at any viewport width).
 */
const FooterCta = () => {
  const ref = useRef<HTMLDivElement>(null)
  const fitRef = useRef<HTMLDivElement>(null)
  const reduce = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const x1 = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['12%', '0%'])
  const x2 = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-12%', '0%'])

  useEffect(() => {
    const box = fitRef.current
    if (!box) return
    const fit = () => {
      // Measure each line's natural width at a known size, then scale to the container.
      box.style.fontSize = '100px'
      const widest = Math.max(...Array.from(box.children, (l) => (l as HTMLElement).scrollWidth))
      if (!widest) return
      box.style.fontSize = `${Math.min(160, (100 * box.clientWidth * 0.97) / widest)}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    let lastW = box.clientWidth
    const ro = new ResizeObserver(() => { if (box.clientWidth !== lastW) { lastW = box.clientWidth; fit() } })
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative isolate border-b border-white/10 pb-16 mb-16 overflow-hidden">
      {/* Flow field streaming toward the "Get in touch" button, faded toward the edges */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-80 [mask-image:radial-gradient(ellipse_75%_90%_at_75%_60%,black_30%,transparent_85%)]">
        <FlowField density={180} max={600} tone="dark" target='[data-flow-target="footer"]' />
      </div>
      <p className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-6">
        <span className="w-4 h-[2px] bg-brand-orange"></span> Have a project in mind?
      </p>
      <div ref={fitRef} aria-hidden="true" className="select-none font-extrabold tracking-tighter leading-[0.95] text-[clamp(2.5rem,8vw,7rem)] whitespace-nowrap">
        <m.div style={{ x: x1 }} className="w-max">Let&apos;s build something</m.div>
        <m.div style={{ x: x2 }} className="w-max pb-[0.08em] text-transparent [-webkit-text-stroke:2px_var(--color-brand-orange)]">
          great together.
        </m.div>
      </div>
      <h2 className="sr-only">Let&apos;s build something great together</h2>

      <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:justify-between">
        <p className="text-gray-400 max-w-md">
          Freelance projects, partnerships or a full-time role — tell me what you&apos;re building and I&apos;ll get back to you within a day.
        </p>
        <Magnetic strength={0.4}>
          <Link
            href="/contact"
            data-flow-target="footer"
            className="group relative w-36 h-36 rounded-full bg-brand-orange text-brand-dark font-extrabold flex flex-col items-center justify-center gap-1 shadow-2xl transition-[scale,background-color] duration-300 hover:scale-105 hover:bg-white"
          >
            <ArrowUpRight className="w-7 h-7 transition-transform duration-300 group-hover:rotate-45" />
            Get in touch
          </Link>
        </Magnetic>
      </div>
    </div>
  )
}

const Footer = () => {
  const pathname = usePathname()
  const lenis = useLenis()
  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const { siteSettings, profile } = myAppHook()
  const { setPreferenceModalOpen } = useGDPR()

  const socialLinks = profile?.social_links || {

  }

  return (
    <>
     <footer className="bg-[#1e3628] text-white pt-20 pb-10 border-t-8 border-brand-orange">
        <div className="max-w-7xl mx-auto px-6">
            {pathname !== '/contact' && <FooterCta />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                
                <div className="lg:col-span-3">
                    <div className="flex items-center gap-2 mb-6 cursor-pointer">
                        <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-brand-dark font-bold italic overflow-hidden">
                            {siteSettings?.logo ? (
                                <img src={siteSettings.logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                siteSettings?.site_title?.[0] || 'N'
                            )}
                        </div>

                        <span className="text-xl font-extrabold tracking-tighter text-white">
                            {siteSettings?.site_title || 'Nikola'}.
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        {siteSettings?.meta_description || 'Expert Kotlin Multiplatform & Mobile Developer specializing in high-performance shared architectures and robust Supabase backends.'}
                    </p>
                    <div className="flex gap-3">
                        {socialLinks.linkedin && (
                            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all">
                                <LinkedinIcon className="w-4 h-4" />
                            </a>
                        )}
                        {socialLinks.github && (
                            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all">
                                <GithubIcon className="w-4 h-4" />
                            </a>
                        )}
                        {(socialLinks.twitter || socialLinks.x) && (
                            <a href={socialLinks.twitter || socialLinks.x} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all">
                                <XIcon className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <h4 className="text-white font-bold mb-6 text-lg tracking-tight">Navigation</h4>
                    <ul className="space-y-4 text-sm font-medium text-gray-400">
                        <li><Link href="/" className="inline-block"><RollText>Home</RollText></Link></li>
                        <li><Link href="/services" className="inline-block"><RollText>Services</RollText></Link></li>
                        <li><Link href="/about" className="inline-block"><RollText>About Me</RollText></Link></li>
                        <li><Link href="/projects" className="inline-block"><RollText>Featured Projects</RollText></Link></li>
                        <li><Link href="/blog" className="inline-block"><RollText>Blog</RollText></Link></li>
                    </ul>
                </div>

                <div className="lg:col-span-3">
                    <h4 className="text-white font-bold mb-6 text-lg tracking-tight">Contact</h4>
                    <ul className="space-y-6 text-sm">
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <Mail className="w-4 h-4 text-brand-orange" />
                            </div>
                            <div>
                                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Email Me</span>
                                <span className="font-medium">{profile?.email || 'nikola.srdoc@gmail.com'}</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-brand-orange" />
                            </div>
                            <div>
                                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Location</span>
                                <span className="font-medium">Zadar, Croatia</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="lg:col-span-4">
                    <NewsletterForm />
                </div>

            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
               <p>
  © {new Date().getFullYear()} {siteSettings?.site_title || 'Nikola Portfolio'}. All Rights Reserved.
</p>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                    <button 
                        onClick={() => setPreferenceModalOpen(true)}
                        className="hover:text-white transition-colors cursor-pointer"
                    >
                        Cookie Preferences
                    </button>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
                <button
                    onClick={scrollToTop}
                    className="group inline-flex items-center gap-2 text-gray-400 hover:text-brand-orange transition-colors"
                >
                    Back to top
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-[translate,background-color] duration-300 group-hover:-translate-y-1 group-hover:bg-brand-orange group-hover:text-brand-dark">
                        <ArrowUp className="w-4 h-4" />
                    </span>
                </button>
            </div>
        </div>
    </footer>

    </>
  )
}

export default Footer