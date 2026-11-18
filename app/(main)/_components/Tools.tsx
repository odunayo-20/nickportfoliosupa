"use client"

import Image from 'next/image'
import { m } from 'motion/react'
import { Marquee } from '@/components/motion/Marquee'
import { SplitText } from '@/components/motion/SplitText'
import { fadeInUp, staggerContainer, VIEWPORT } from '@/lib/motion'

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'

const TOOLS = [
    { name: 'Kotlin', href: 'https://kotlinlang.org', icon: `${DEVICON}/kotlin/kotlin-original.svg` },
    { name: 'Java', href: 'https://www.java.com/en/', icon: `${DEVICON}/java/java-original.svg` },
    { name: 'Android Studio', href: 'https://developer.android.com/studio', icon: `${DEVICON}/android/android-original.svg` },
    { name: 'Xcode', href: 'https://developer.apple.com/xcode/', icon: `${DEVICON}/xcode/xcode-original.svg` },
    { name: 'Firebase', href: 'https://firebase.google.com/', icon: `${DEVICON}/firebase/firebase-original.svg` },
    { name: 'Supabase', href: 'https://supabase.com/', icon: `${DEVICON}/supabase/supabase-original.svg` },
    { name: 'Git', href: 'https://git-scm.com/', icon: `${DEVICON}/git/git-original.svg` },
]

const KEYWORDS = [
    'Kotlin Multiplatform', 'Jetpack Compose', 'Compose Multiplatform', 'Coroutines & Flow',
    'SQLDelight', 'Ktor', 'Offline-First', 'PostgreSQL', 'Edge Functions', 'Realtime', 'Clean Architecture',
]

const Tools = () => {
    return (
        <m.section
            id="tools"
            className="py-24 text-center overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={staggerContainer}
        >
            <div className="max-w-4xl mx-auto px-6">
                <m.span variants={fadeInUp} className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-2">
                    <span className="w-4 h-[2px] bg-brand-orange"></span> My Favorite Tools
                </m.span>
                <SplitText className="text-4xl md:text-5xl font-extrabold tracking-tighter text-ink mb-16">
                    Exploring the Tools<br />Behind My Designs
                </SplitText>
            </div>

            <m.div variants={fadeInUp} className="flex flex-col gap-6">
                {/* Row 1 — tool logos */}
                <Marquee duration={32} className="py-3">
                    {TOOLS.map((tool) => (
                        <a
                            key={tool.name}
                            href={tool.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 pl-2 pr-5 py-2 bg-surface rounded-full shadow-sm border border-line hover:border-brand-orange hover:shadow-md hover:-translate-y-1 transition-[translate,box-shadow,border-color] duration-300 whitespace-nowrap"
                        >
                            <span className="w-11 h-11 rounded-full bg-surface-alt flex items-center justify-center">
                                <Image src={tool.icon} alt="" width={28} height={28} className="w-7 h-7 grayscale group-hover:grayscale-0 transition-[filter] duration-300" />
                            </span>
                            <span className="text-sm font-bold text-ink">{tool.name}</span>
                        </a>
                    ))}
                </Marquee>

                {/* Row 2 — skills keywords, opposite direction */}
                <Marquee duration={40} reverse>
                    {KEYWORDS.map((k, i) => (
                        <span key={k} className="flex items-center gap-6 whitespace-nowrap">
                            <span className={`text-2xl md:text-4xl font-extrabold tracking-tighter ${i % 2 ? 'text-ink/15' : 'text-ink'}`}>
                                {k}
                            </span>
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-orange shrink-0" aria-hidden="true" />
                        </span>
                    ))}
                </Marquee>
            </m.div>
        </m.section>
    )
}

export default Tools
