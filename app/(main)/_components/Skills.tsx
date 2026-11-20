"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Database, Globe, Layers, Settings, Smartphone } from 'lucide-react'
import { m, useInView } from 'motion/react'
import { SplitText } from '@/components/motion/SplitText'
import { TiltCard } from '@/components/motion/TiltCard'
import { useHydratedReducedMotion } from '@/components/motion/useHydratedReducedMotion'
import { fadeInUp, staggerContainer, VIEWPORT } from '@/lib/motion'

const LINE_MS = 300 // delay between typed lines; keep in step with .sked-code.type in main.css
const HOLD_MS = 3200 // how long a finished file stays before the editor opens the next one

// Syntax colours: keyword, skill (the part worth reading) and dimmed punctuation.
const K = ({ children }: { children: ReactNode }) => <span className="k">{children}</span>
const S = ({ children }: { children: ReactNode }) => <span className="s">{children}</span>
const D = ({ children }: { children: ReactNode }) => <span className="d">{children}</span>

/** Skills joined by a dimmed separator; `wrap` puts each one in quotes, brackets and so on. */
const list = (skills: string[], wrap: (s: string) => ReactNode, sep = ', ') =>
    skills.map((s, i) => (
        <span key={s}>
            {i > 0 && <D>{sep}</D>}
            {wrap(s)}
        </span>
    ))

const quoted = (s: string) => <S>&quot;{s}&quot;</S>
const sqlRow = (s: string) => <><D>(</D><S>&apos;{s}&apos;</S><D>)</D></>
// Shell words only need quotes when they contain a space.
const shellWord = (s: string) => <S>{s.includes(' ') ? `"${s}"` : s}</S>

type SkillFile = {
    file: string
    lang: string
    icon: React.ComponentType<{ className?: string }>
    /** Number of skills in the file, shown in the status bar */
    count: number
    /** One entry per line of code */
    lines: ReactNode[]
}

// One file per discipline, each written in the language that fits it.
const FILES: SkillFile[] = [
    {
        file: 'Mobile.kt',
        lang: 'Kotlin',
        icon: Smartphone,
        count: 8,
        lines: [
            <><K>val</K> mobile = listOf<D>(</D></>,
            <>{'    '}{list(['Kotlin', 'Java', 'Swift'], quoted)}<D>,</D></>,
            <>{'    '}{list(['Android SDK', 'Jetpack Compose'], quoted)}<D>,</D></>,
            <>{'    '}{list(['Compose Multiplatform'], quoted)}<D>,</D></>,
            <>{'    '}{list(['Kotlin Multiplatform', 'Xcode'], quoted)}<D>,</D></>,
            <><D>)</D></>,
        ],
    },
    {
        file: 'Web.tsx',
        lang: 'TypeScript JSX',
        icon: Globe,
        count: 7,
        lines: [
            <><K>export const</K> web = <D>[</D></>,
            <>{'  '}{list(['Next.js', 'React', 'TypeScript'], quoted)}<D>,</D></>,
            <>{'  '}{list(['Tailwind CSS', 'Motion'], quoted)}<D>,</D></>,
            <>{'  '}{list(['Server Actions', 'SEO & Web Vitals'], quoted)}<D>,</D></>,
            <><D>] </D><K>as const</K></>,
        ],
    },
    {
        file: 'Architecture.kt',
        lang: 'Kotlin',
        icon: Layers,
        count: 6,
        lines: [
            <><K>sealed interface</K> Architecture <D>{'{'}</D></>,
            ...['MVVM', 'CleanArchitecture', 'Coroutines', 'SQLDelight', 'OfflineFirst', 'RepositoryPattern'].map(name => (
                <>{'    '}<K>object</K> <S>{name}</S></>
            )),
            <><D>{'}'}</D></>,
        ],
    },
    {
        file: 'Backend.sql',
        lang: 'PostgreSQL',
        icon: Database,
        count: 8,
        lines: [
            <><K>insert into</K> backend <D>(</D>skill<D>)</D> <K>values</K></>,
            <>{'  '}{list(['Supabase', 'Edge Functions'], sqlRow)}<D>,</D></>,
            <>{'  '}{list(['PostgreSQL', 'PostGIS', 'pg_cron'], sqlRow)}<D>,</D></>,
            <>{'  '}{list(['Spring', 'REST APIs', 'WebSockets'], sqlRow)}<D>;</D></>,
        ],
    },
    {
        file: 'tools.sh',
        lang: 'Shell',
        icon: Settings,
        count: 7,
        lines: [
            <><D>#!/bin/sh</D></>,
            <>tools=<D>(</D></>,
            <>{'  '}{list(['Git', 'Android Studio', 'Xcode'], shellWord, ' ')}</>,
            <>{'  '}{list(['VS Code', 'Postman', 'Figma', 'Gradle'], shellWord, ' ')}</>,
            <><D>)</D></>,
        ],
    },
]

const Skills = () => {
    const [active, setActive] = useState(0)
    const [hovered, setHovered] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null)
    const inView = useInView(editorRef, { amount: 0.4 })
    const seen = useInView(editorRef, { amount: 0.4, once: true })
    const reduceMotion = useHydratedReducedMotion()
    const current = FILES[active]

    // Autoplay: once a file has typed itself out and been read, open the next one.
    // Waits while the pointer is over the editor or the section is off screen; off for reduced motion.
    useEffect(() => {
        if (reduceMotion || hovered || !inView) return
        const t = setTimeout(
            () => setActive(i => (i + 1) % FILES.length),
            FILES[active].lines.length * LINE_MS + HOLD_MS,
        )
        return () => clearTimeout(t)
    }, [active, hovered, inView, reduceMotion])

    return (
        <m.section
            id="skills"
            className="bg-surface-alt py-24"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={staggerContainer}
        >
            <div className="max-w-7xl mx-auto px-6">
                {/* heading */}
                <m.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-2">
                            <span className="w-4 h-[2px] bg-brand-orange"></span> My Skills
                        </span>
                        <SplitText className="text-4xl md:text-5xl font-extrabold tracking-tighter text-ink">
                            Technologies &amp; Tools<br className="hidden md:block" /> I Work With
                        </SplitText>
                    </div>
                    <p className="text-ink-muted text-sm max-w-xs leading-relaxed">
                        A curated stack refined over years of shipping production-grade mobile and web products.
                    </p>
                </m.div>

                {/* The skills as code: a small editor with one file per discipline. Each file types itself out,
                    then the editor opens the next. The window tilts toward the cursor like the cards elsewhere. */}
                <div ref={editorRef} className="glow-group [perspective:1400px]">
                    <TiltCard
                        variants={fadeInUp}
                        max={2.5}
                        spotlight="rgba(255, 184, 0, 0.08)"
                        className="glow-card sked"
                        onPointerEnter={() => setHovered(true)}
                        onPointerLeave={() => setHovered(false)}
                    >
                        <div className="sked-bar">
                            <i /><i /><i />
                            <span>skills / {current.file}</span>
                        </div>

                        <div className="sked-main">
                            <div className="sked-side">
                                <small>Explorer</small>
                                {FILES.map(({ file, icon: Icon }, i) => (
                                    <button
                                        key={file}
                                        type="button"
                                        className="sked-file"
                                        data-active={i === active}
                                        aria-pressed={i === active}
                                        onClick={() => setActive(i)}
                                    >
                                        <Icon className="w-[15px] h-[15px] shrink-0" />
                                        {file}
                                    </button>
                                ))}
                            </div>

                            <div className="sked-scroll">
                                {/* Keyed so the typing restarts for every file, and once more when the editor first scrolls into view. */}
                                <pre key={`${active}-${seen}`} className={`sked-code ${seen ? 'type' : ''}`}>
                                    {current.lines.map((line, n) => (
                                        <span key={n} className="ln">
                                            <span style={{ '--i': n } as CSSProperties}>
                                                {line}
                                                {n === current.lines.length - 1 && <span className="caret" aria-hidden="true" />}
                                            </span>
                                        </span>
                                    ))}
                                </pre>
                            </div>
                        </div>

                        <div className="sked-foot">
                            <span>{current.lang}</span>
                            <span>UTF-8</span>
                            <b>{current.count} skills</b>
                        </div>
                    </TiltCard>
                </div>
            </div>
        </m.section>
    )
}

export default Skills
