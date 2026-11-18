"use client"

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { m, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useHydratedReducedMotion } from '@/components/motion/useHydratedReducedMotion'
import { Magnetic } from '@/components/motion/Magnetic'
import { ScrambleText } from '@/components/motion/ScrambleText'
import { FlowField } from '@/components/motion/FlowField'
import { AVAILABILITY } from '@/lib/content'
import { fadeInUp, popIn, scaleIn, slideInRight, stagger, wordReveal } from '@/lib/motion'

interface HeroProps {
    profile?: {
        name?: string | null;
        title?: string | null;
        bio?: string | null;
        avatar_url?: string | null;
        resume_url?: string | null;
    } | null;
}

/** Extra phrases cycled after the profile title. Edit freely. */
const EXTRA_ROLES = [
    "Android Engineer",
    "iOS & KMP Architect",
    "Supabase Backend Builder",
]

const textColumn = stagger(0.12, 0.1)
const headline = stagger(0.08)
const visualColumn = stagger(0.12, 0.25)

/** Proposal T3 — cycles phrases, each one decoding from glyphs. Reserves the widest phrase so the h1 never reflows. */
function ScrambleRotate({ phrases, interval = 3200 }: { phrases: string[]; interval?: number }) {
    const [i, setI] = useState(0)
    const reduce = useHydratedReducedMotion()
    useEffect(() => {
        if (reduce || phrases.length < 2) return
        const t = window.setInterval(() => setI((n) => (n + 1) % phrases.length), interval)
        return () => window.clearInterval(t)
    }, [reduce, phrases.length, interval])
    return (
        <span className="relative inline-grid align-bottom">
            {phrases.map((p) => (
                <span key={p} aria-hidden="true" className="invisible col-start-1 row-start-1">{p}</span>
            ))}
            {/* Positioned over the reserved box so decoding glyphs can never change the layout (CLS). */}
            <ScrambleText text={phrases[i]} decodeOnView={false} className="absolute inset-x-0 top-0" duration={800} />
        </span>
    )
}

/** Maps a -0.5…0.5 pointer value to a pixel offset for parallax layers. */
const useLayer = (v: MotionValue<number>, px: number) => useTransform(v, (n) => n * px)

const Hero = ({ profile }: HeroProps) => {
    // Fallback data
    const name = profile?.name || "Nikola";
    const title = profile?.title || "Kotlin Multiplatform & Native Expert";
    const bio = profile?.bio || "I architect high-performance mobile systems for startups, sharing up to 70% of code between Android and iOS without sacrificing native speed.";
    const avatarUrl = profile?.avatar_url || "/nikola.jpeg";
    const [chipA, chipB] = title.split(' & ');
    const roles = [title, ...EXTRA_ROLES.filter(r => r !== title)];

    const ref = useRef<HTMLElement>(null)
    const reduce = useHydratedReducedMotion()

    // ── Mouse parallax (desktop pointers only) ──
    const pointerX = useMotionValue(0)
    const pointerY = useMotionValue(0)
    const sx = useSpring(pointerX, { stiffness: 80, damping: 20, mass: 0.6 })
    const sy = useSpring(pointerY, { stiffness: 80, damping: 20, mass: 0.6 })

    const glowX = useLayer(sx, -60), glowY = useLayer(sy, -60)
    const blobX = useLayer(sx, -24), blobY = useLayer(sy, -24)
    const photoX = useLayer(sx, 12), photoY = useLayer(sy, 12)
    const chipX = useLayer(sx, 36), chipY = useLayer(sy, 36)
    const badgeX = useLayer(sx, -32), badgeY = useLayer(sy, -32)

    const onPointerMove = (e: React.PointerEvent) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        pointerX.set((e.clientX - r.left) / r.width - 0.5)
        pointerY.set((e.clientY - r.top) / r.height - 0.5)
    }
    const onPointerLeave = () => { pointerX.set(0); pointerY.set(0) }

    // ── Scroll parallax: text drifts up & fades, visual sinks slightly ──
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
    const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80])
    // NB: opacity maps are hardware-accelerated as native scroll-timeline animations, which do NOT
    // clamp — always end the range at progress 1, or the value drifts back to 1 past the last stop.
    const textOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0, 0])
    const visualY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120])
    const indicatorOpacity = useTransform(scrollYProgress, [0, 0.12, 1], [1, 0, 0])

    return (
        <section
            id="home"
            ref={ref}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            className="relative isolate overflow-hidden"
        >
            {/* ── Background: flow field (H1) + soft glow ── */}
            <div aria-hidden="true" className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,black_35%,transparent_85%)]">
                <FlowField />
            </div>
            <m.div
                aria-hidden="true"
                style={{ x: glowX, y: glowY }}
                className="absolute -z-10 top-[15%] right-[5%] w-[45vw] max-w-[640px] aspect-square rounded-full bg-brand-orange/20 blur-3xl"
            />

            <header className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center min-h-[85vh]">

                {/* ── Text column ── */}
                <m.div style={{ y: textY, opacity: textOpacity }}>
                    <m.div initial="hidden" animate="visible" variants={textColumn}>
                        <m.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-dashed border-ink-muted">
                                <span className="animate-wave" aria-hidden="true">👋</span>
                                <span className="text-ink-muted font-medium text-sm">Hello There!</span>
                            </span>
                            {AVAILABILITY.available && (
                                <Link href="/contact" className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface/80 backdrop-blur border border-line text-sm font-mono font-medium text-ink hover:border-brand-orange transition-colors">
                                    <span className="relative flex w-2 h-2" aria-hidden="true">
                                        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                                        <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
                                    </span>
                                    <ScrambleText text={AVAILABILITY.label} duration={1100} />
                                </Link>
                            )}
                        </m.div>

                        <m.h1 variants={headline} className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-6 text-ink">
                            <span className="sr-only">I&apos;m {name}, {title}</span>
                            <span aria-hidden="true">
                                <span className="inline-block overflow-hidden align-bottom pb-[0.12em]">
                                    <m.span variants={wordReveal} className="inline-block">I&apos;m&nbsp;</m.span>
                                </span>
                                <span className="inline-block overflow-hidden align-bottom pb-[0.12em]">
                                    <m.span variants={wordReveal} className="inline-block text-brand-orange">{name},</m.span>
                                </span>
                                <br />
                                <span className="inline-block overflow-hidden align-bottom">
                                    <m.span variants={wordReveal} className="inline-block">
                                        <ScrambleRotate phrases={roles} />
                                    </m.span>
                                </span>
                            </span>
                        </m.h1>

                        <m.p variants={fadeInUp} className="text-ink-muted text-lg max-w-md mb-10 leading-relaxed">
                            {bio}
                        </m.p>

                        <m.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
                            <Magnetic>
                                <Link href="/projects" aria-label='View My Portfolio' className="btn-fill group cursor-pointer px-8 py-3.5 bg-brand-green text-white font-bold rounded-full flex items-center gap-3 transition-[color,box-shadow] duration-300 shadow-lg hover:shadow-xl">
                                    View My Portfolio
                                    <span className="w-6 h-6 bg-surface rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[360deg]">
                                        <Play className="w-3 h-3 text-accent-green ml-0.5" />
                                    </span>
                                </Link>
                            </Magnetic>
                            <Magnetic>
                                <Link href="/contact" aria-label='Hire Me' className="btn-fill cursor-pointer px-8 py-3.5 border border-line font-bold rounded-full hover:border-ink transition-colors duration-300 bg-surface [--fill:var(--ink)] [--fill-ink:var(--surface)]">
                                    Hire Me
                                </Link>
                            </Magnetic>
                        </m.div>
                    </m.div>
                </m.div>

                {/* ── Visual column ── */}
                <m.div style={{ y: visualY }} className="relative">
                    <m.div
                        initial="hidden"
                        animate="visible"
                        variants={visualColumn}
                        className="relative flex justify-center items-center h-[500px]"
                    >
                        {/* Orange morphing blob */}
                        <m.div variants={scaleIn} style={{ x: blobX, y: blobY }} className="absolute right-0 w-[85%] h-[90%] -z-10">
                            <div className="w-full h-full bg-brand-orange blob-shape animate-blob" />
                        </m.div>

                        {/* Photo */}
                        <m.div variants={slideInRight} style={{ x: photoX, y: photoY }} className="relative w-[75%] h-[90%]">
                            <Image
                                src={avatarUrl}
                                alt={name}
                                width={800}
                                height={1000}
                                loading="eager"
                                fetchPriority="high"
                                sizes="(min-width: 768px) 40vw, 75vw"
                                className="w-full h-full object-cover object-top blob-shape animate-blob-slow shadow-2xl grayscale hover:grayscale-0 transition-[filter] duration-700"
                            />
                        </m.div>

                        {/* Spinning "Hire me" badge with text on a circular path */}
                        <Link href="/contact" aria-label="Hire me — get in touch" className="group absolute top-8 -right-2 md:-right-4 z-10">
                            <m.div variants={popIn} style={{ x: badgeX, y: badgeY }}>
                                <div className="relative w-28 h-28 rounded-full bg-brand-green border-4 border-surface shadow-xl flex items-center justify-center transition-[scale] duration-300 group-hover:scale-110">
                                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite]" aria-hidden="true">
                                        <defs>
                                            <path id="hero-badge-circle" d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" />
                                        </defs>
                                        <text className="fill-white font-bold uppercase" fontSize="10.5">
                                            <textPath href="#hero-badge-circle" textLength="212" lengthAdjust="spacing">
                                                Hire Me • Let&apos;s Talk • Hire Me •
                                            </textPath>
                                        </text>
                                    </svg>
                                    <ArrowUpRight className="w-7 h-7 text-brand-orange transition-transform duration-300 group-hover:rotate-45" />
                                </div>
                            </m.div>
                        </Link>

                        {/* Floating chips */}
                        <m.div variants={popIn} style={{ x: chipX, y: chipY }} className="absolute bottom-24 right-10">
                            <div className="animate-float bg-brand-orange text-brand-dark font-bold text-xs px-4 py-2 rounded-full shadow-lg border-2 border-surface">
                                {chipA || "Expert"}
                            </div>
                        </m.div>
                        <m.div variants={popIn} style={{ x: chipX, y: chipY }} className="absolute bottom-10 left-10">
                            <div className="animate-float [animation-delay:-2.5s] bg-brand-green text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
                                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-brand-orange border-b-[5px] border-b-transparent"></div>
                                {chipB || "Mobile Dev Expert"}
                            </div>
                        </m.div>
                    </m.div>
                </m.div>
            </header>

            {/* ── Scroll indicator ── */}
            <m.div style={{ opacity: indicatorOpacity }} className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2">
                <m.a
                    href="#services"
                    aria-label="Scroll to services"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 1.2, duration: 0.6 } }}
                    className="flex flex-col items-center gap-2 text-ink-muted hover:text-ink transition-colors"
                >
                    <span className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
                        <span className="w-1 h-2 rounded-full bg-current animate-scroll-dot" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll</span>
                </m.a>
            </m.div>
        </section>
    )
}

export default Hero
