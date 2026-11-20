"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowRight } from 'lucide-react'
import { AnimatePresence, m, useInView } from 'motion/react'
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/motion'
import { Odometer } from '@/components/motion/Odometer'
import { ScrollHighlight } from '@/components/motion/ScrollHighlight'
import { SplitText } from '@/components/motion/SplitText'
import { TopicScene, sceneImages, type TopicKey } from '@/components/about/TopicScene'
import { useHydratedReducedMotion } from '@/components/motion/useHydratedReducedMotion'

const SLIDE_MS = 6000 // how long each picture stays before autoplay moves on

// Topics in autoplay order. `tab` is the short name on the card's index tab, `color` its text colour.
const TOPICS: { key: TopicKey; label: string; tab: string; color: string }[] = [
    { key: "android", label: "Android App Development", tab: "Android", color: "#3ddc84" },
    { key: "kmp", label: "Kotlin Multiplatform", tab: "Kotlin Multiplatform", color: "#a97bff" },
    { key: "ios", label: "iOS App Development", tab: "iOS", color: "#4aa3ff" },
    { key: "backend", label: "Backend Dev", tab: "Backend", color: "#8f9bff" },
    { key: "ui", label: "Mobile Apps UI/UX", tab: "UI/UX", color: "#d06bff" },
    { key: "web", label: "Web Apps Development", tab: "Web", color: "#ff9d3b" },
]

const STATS = [
    { value: "20+", label: "Project Completed" },
    { value: "5+", label: "Industry Covered" },
    { value: "5+", label: "Years of Experience" },
]






interface AboutProps {
    profile?: {
        name?: string | null;
        resume_url?: string | null;
    } | null;
}

const About = ({ profile }: AboutProps) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [slide, setSlide] = useState<TopicKey>(TOPICS[0].key);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const stageRef = useRef<HTMLDivElement>(null);
    const inView = useInView(stageRef, { amount: 0.4 });
    const reduceMotion = useHydratedReducedMotion();
    const index = TOPICS.findIndex(t => t.key === slide);
    const activeTopic = TOPICS[index];
    const nextSlide = TOPICS[(index + 1) % TOPICS.length].key;

    // Warm the cache for the upcoming scene so its layers don't pop in mid-animation.
    useEffect(() => {
        sceneImages(nextSlide).forEach(src => { new window.Image().src = src; });
    }, [nextSlide]);

    // Hovering the square pauses autoplay; the pointer position (-1..1) drives the layers' parallax.
    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        e.currentTarget.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    };
    const handlePointerLeave = (e: PointerEvent<HTMLDivElement>) => {
        e.currentTarget.style.setProperty('--px', '0');
        e.currentTarget.style.setProperty('--py', '0');
        setHovered(false);
    };
    
    // Use profile data with fallbacks
    const name = profile?.name || "Nikola";
    const cvUrl = profile?.resume_url || "";

    const handleDownload = () => {
        if (!cvUrl) return;
        setIsDownloading(true);
        
        // Trigger download without opening a new tab
        const link = document.createElement('a');
        link.href = cvUrl;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset state after a delay to show the feedback
        setTimeout(() => setIsDownloading(false), 3000);
    };

  return (
    <>
    
       <m.section
                id="about"
                className="bg-brand-green py-24 overflow-hidden text-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    <m.div
                        ref={stageRef}
                        variants={scaleIn}
                        className="relative w-full max-w-md mx-auto aspect-square mt-24 lg:mt-28"
                        // Only keyboard focus pauses; a mouse click on a tab also focuses it but shouldn't hold autoplay.
                        onFocus={e => setFocused(e.target.matches(':focus-visible'))}
                        onBlur={() => setFocused(false)}
                    >
                        {/* The waiting pictures rise behind the frame like file dividers, each with its name on the tab.
                            A card's depth is how many steps it is from being shown, so the next picture sits right behind
                            the frame; cards slide to their new place on every change. Click a tab to jump to it. */}
                        {TOPICS.map((t, i) => {
                            const depth = (i - index + TOPICS.length) % TOPICS.length
                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    className="about-deck-card"
                                    style={{ '--d': depth, '--tab': t.color, zIndex: TOPICS.length - depth } as CSSProperties}
                                    data-front={depth === 0}
                                    tabIndex={depth === 0 ? -1 : 0}
                                    aria-label={`Show ${t.label}`}
                                    onClick={e => {
                                        setSlide(t.key)
                                        // This card now hides behind the frame, so drop focus from it (also resumes autoplay).
                                        e.currentTarget.blur()
                                    }}
                                >
                                    <span className="about-deck-pic" aria-hidden="true">
                                        <TopicScene topic={t.key} label={t.label} still />
                                    </span>
                                    <span className="about-deck-tab" aria-hidden="true">{t.tab}</span>
                                </button>
                            )
                        })}

                        {/* The current topic's layered illustration; the old one shrinks away as the new one assembles.
                            Hovering it pauses autoplay. */}
                        <div
                            className="absolute inset-0 z-10 rounded-[9%] overflow-hidden border-8 border-brand-green bg-brand-green"
                            onPointerEnter={() => setHovered(true)}
                            onPointerMove={handlePointerMove}
                            onPointerLeave={handlePointerLeave}
                        >
                            <AnimatePresence initial={false}>
                                <m.div
                                    key={activeTopic.key}
                                    className="absolute inset-0"
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.45 } }}
                                >
                                    <TopicScene topic={activeTopic.key} label={activeTopic.label} />
                                </m.div>
                            </AnimatePresence>
                        </div>

                        {/* Autoplay progress: an orange line runs around the frame, then the next picture starts.
                            Paused while the square is hovered, a tab has keyboard focus or the section is off screen;
                            off entirely for reduced motion. */}
                        {!reduceMotion && (
                            <svg
                                key={slide}
                                viewBox="0 0 100 100"
                                className="about-ring z-[11]"
                                style={{ '--ring-ms': `${SLIDE_MS}ms` } as CSSProperties}
                                data-paused={hovered || focused || !inView}
                                aria-hidden="true"
                            >
                                <rect className="track" x="0.9" y="0.9" width="98.2" height="98.2" rx="8.1" />
                                <rect className="fill" x="0.9" y="0.9" width="98.2" height="98.2" rx="8.1" pathLength={100} onAnimationEnd={() => setSlide(nextSlide)} />
                                <rect className="head" x="0.9" y="0.9" width="98.2" height="98.2" rx="8.1" pathLength={100} />
                            </svg>
                        )}
                    </m.div>

                    <m.div variants={fadeInUp}>
                        <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-4">
                            <span className="w-4 h-[2px] bg-brand-orange"></span> About Me
                        </span>
                        <SplitText className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">
                            Who is <span
                                className="text-brand-orange font-normal italic cursor-pointer hover:underline decoration-brand-light underline-offset-8"
                                onClick={() => setSlide(TOPICS[0].key)}
                            >
                                {name}?
                            </span>
                        </SplitText>

                        <ScrollHighlight
                            className="text-white text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-lg"
                            text="I specialize in Kotlin Multiplatform (KMP) and high-performance native Android development. I help businesses ship one codebase to both Android and iOS, sharing up to 70% of logic while maintaining native speed. Expert in architecting real-time systems with Supabase, SQLDelight, and offline-first state management."
                            highlight={['Kotlin', 'Multiplatform', 'Android', 'iOS', '70%', 'Supabase']}
                        />

                        <div className="grid grid-cols-3 gap-6 mb-12 border-b border-gray-600/50 pb-10">
                            {STATS.map(stat => (
                                <div key={stat.label}>
                                    <Odometer value={stat.value} suffixClassName="" className="block text-3xl md:text-4xl font-bold text-brand-orange mb-1" />
                                    <div className="text-xs text-white/60 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-8">
                            <button 
                                onClick={handleDownload}
                                disabled={isDownloading || !cvUrl}
                                className="px-6 py-3 bg-surface text-ink font-bold text-sm rounded-full flex items-center gap-3 hover:bg-brand-orange transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isDownloading ? "Downloading..." : "Download CV"} 
                                <div className="w-6 h-6 bg-brand-dark rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
                                    <ArrowRight className={`w-3 h-3 text-brand-light ${isDownloading ? "animate-pulse" : ""}`} />
                                </div>
                            </button>
                            <div className="font-serif italic text-2xl text-brand-orange opacity-90">
                                {name}.
                            </div>
                        </div>
                    </m.div>
                </div>
            </m.section>
    
    </>
  )
}

export default About