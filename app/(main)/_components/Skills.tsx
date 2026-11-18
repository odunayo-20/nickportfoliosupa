"use client"

import { Database, Layers, Settings, Smartphone } from 'lucide-react'
import { m } from 'motion/react'
import { SplitText } from '@/components/motion/SplitText'
import { TiltCard } from '@/components/motion/TiltCard'
import { fadeInUp, fadeInUpStagger, popIn, staggerContainer, VIEWPORT } from '@/lib/motion'

type SkillGroup = {
    title: string
    icon: React.ComponentType<{ className?: string }>
    skills: string[]
    /** Tailwind classes per theme */
    card: string
    iconBox: string
    iconColor: string
    heading: string
    chip: string
    spotlight: string
}

const GROUPS: SkillGroup[] = [
    {
        title: "Mobile",
        icon: Smartphone,
        skills: ["Kotlin", "Java", "Android SDK", "Jetpack Compose", "Compose Multiplatform", "Kotlin Multiplatform"],
        card: "bg-surface hover:border-brand-orange/30",
        iconBox: "bg-brand-orange/10 group-hover/tilt:bg-brand-orange/20",
        iconColor: "text-brand-orange",
        heading: "text-ink",
        chip: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
        spotlight: "rgba(255, 184, 0, 0.14)",
    },
    {
        title: "Architecture",
        icon: Layers,
        skills: ["MVVM", "Clean Architecture", "Coroutines", "SQLDelight", "Offline-First", "Repository Pattern"],
        card: "bg-surface hover:border-accent-green/30",
        iconBox: "bg-brand-green/10 group-hover/tilt:bg-brand-green/20",
        iconColor: "text-accent-green",
        heading: "text-ink",
        chip: "bg-brand-green/10 text-accent-green border-accent-green/20",
        spotlight: "rgba(42, 71, 54, 0.10)",
    },
    {
        title: "Backend / Services",
        icon: Database,
        skills: ["Supabase", "Edge Functions", "PostgreSQL", "PostGIS", "pg_cron", "REST APIs", "WebSockets"],
        card: "bg-surface hover:border-ink/20",
        iconBox: "bg-ink/8 group-hover/tilt:bg-ink/15",
        iconColor: "text-ink",
        heading: "text-ink",
        chip: "bg-ink/8 text-ink border-ink/15",
        spotlight: "rgba(26, 26, 26, 0.07)",
    },
    {
        title: "Tools",
        icon: Settings,
        skills: ["Git", "Android Studio", "Xcode", "Figma", "Gradle"],
        card: "bg-brand-green",
        iconBox: "bg-white/15 group-hover/tilt:bg-white/25",
        iconColor: "text-white",
        heading: "text-white",
        chip: "bg-white/15 text-white border-white/25",
        spotlight: "rgba(255, 255, 255, 0.14)",
    },
]

const cardVariants = fadeInUpStagger(0.05, 0.25)

const Skills = () => {
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

                {/* grid of category cards — tilt toward the cursor, chips pop in after each card */}
                <div className="glow-group grid sm:grid-cols-2 lg:grid-cols-4 gap-6 [perspective:1200px]">
                    {GROUPS.map(({ title, icon: Icon, skills, ...t }) => (
                        <TiltCard
                            key={title}
                            variants={cardVariants}
                            spotlight={t.spotlight}
                            className={`glow-card ${t.card} rounded-sharp p-8 border border-transparent hover:shadow-xl transition-motion-safe duration-300`}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-10 h-10 ${t.iconBox} rounded-md flex items-center justify-center transition-[background-color,scale,rotate] duration-300 group-hover/tilt:scale-110 group-hover/tilt:-rotate-6`}>
                                    <Icon className={`w-5 h-5 ${t.iconColor}`} />
                                </div>
                                <h3 className={`text-lg font-bold ${t.heading}`}>{title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(s => (
                                    <m.span
                                        key={s}
                                        variants={popIn}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${t.chip}`}
                                    >
                                        {s}
                                    </m.span>
                                ))}
                            </div>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </m.section>
    )
}

export default Skills
