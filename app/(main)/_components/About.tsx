"use client";

import { useState } from "react";
import { ArrowRight } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { EASE_OUT, fadeInUp, staggerContainer, scaleIn } from '@/lib/motion'
import Image from 'next/image'
import { Odometer } from '@/components/motion/Odometer'
import { ScrollHighlight } from '@/components/motion/ScrollHighlight'
import { SplitText } from '@/components/motion/SplitText'

const DEFAULT_IMAGE = "/about/workspace.webp" // my desk; the topic pills swap in illustrations

const TOPICS = [
    { label: "Android App Development", image: "/about/android.png", position: "top-1/4 left-0 sm:-left-8", style: "bg-brand-dark text-brand-orange border-brand-green hover:bg-brand-orange hover:text-brand-dark" },
    { label: "Kotlin Multiplatform", image: "/about/kmp.png", position: "top-1/2 left-0 sm:-left-12", style: "bg-brand-green text-white border-white/20 hover:bg-surface hover:text-accent-green" },
    { label: "iOS App Development", image: "/about/ios.png", position: "bottom-1/4 left-0 sm:-left-4", style: "bg-brand-orange text-brand-dark border-brand-green hover:bg-brand-dark hover:text-brand-orange" },
    { label: "Backend Dev", image: "/about/backend.png", position: "top-1/3 right-0 sm:-right-6", style: "bg-brand-orange text-brand-dark border-brand-green hover:bg-brand-dark hover:text-brand-orange" },
    { label: "Mobile Apps UI/UX", image: "/about/ui.png", position: "bottom-1/3 right-0", style: "bg-brand-dark text-white border-brand-green hover:bg-surface hover:text-ink" },
    { label: "Web Apps Development", image: "/about/web.png", position: "bottom-12 right-12", style: "bg-brand-green text-white border-white/20 hover:bg-surface hover:text-accent-green" },
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
    const [currentImage, setCurrentImage] = useState(DEFAULT_IMAGE);
    const activeLabel = TOPICS.find(t => t.image === currentImage)?.label;
    
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

                    <m.div variants={scaleIn} className="relative w-full max-w-md mx-auto aspect-square">
                        <div className="absolute inset-4 bg-brand-orange rounded-full -translate-x-6 -translate-y-6 blob-shape animate-blob"></div>

                        {/* Crossfading image — the clicked topic's illustration blurs/zooms in over the old one */}
                        <div className="absolute inset-0 z-10 rounded-full overflow-hidden border-8 border-brand-green bg-brand-green">
                            <AnimatePresence initial={false}>
                                <m.div
                                    key={currentImage}
                                    className="absolute inset-0"
                                    initial={{ opacity: 0, scale: 1.12, filter: 'blur(8px)' }}
                                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE_OUT } }}
                                    exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.15 } }}
                                >
                                    <Image
                                        src={currentImage}
                                        alt={`${name} — ${activeLabel ?? 'working'}`}
                                        width={800}
                                        height={800}
                                        sizes="(min-width: 1024px) 448px, 90vw"
                                        className={`w-full h-full object-cover ${currentImage === DEFAULT_IMAGE ? "" : "grayscale"}`}
                                    />
                                </m.div>
                            </AnimatePresence>
                        </div>

                        {/* Topic pills: float gently, the active one gets a ring */}
                        {TOPICS.map((t, i) => {
                            const active = currentImage === t.image
                            return (
                                <m.button
                                    key={t.label}
                                    type="button"
                                    variants={scaleIn}
                                    onClick={() => setCurrentImage(t.image)}
                                    aria-pressed={active}
                                    whileHover={{ scale: 1.06 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`absolute z-20 ${t.position}`}
                                >
                                    <span
                                        className={`animate-float block text-xs font-bold px-4 py-2 rounded-full border-2 cursor-pointer transition-[background-color,color,box-shadow] duration-300 ${t.style} ${active ? 'ring-4 ring-brand-orange/60 shadow-lg' : ''}`}
                                        style={{ animationDelay: `${-i * 0.9}s`, animationDuration: `${4.5 + (i % 3)}s` }}
                                    >
                                        {t.label}
                                    </span>
                                </m.button>
                            )
                        })}
                    </m.div>

                    <m.div variants={fadeInUp}>
                        <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-4">
                            <span className="w-4 h-[2px] bg-brand-orange"></span> About Me
                        </span>
                        <SplitText className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">
                            Who is <span
                                className="text-brand-orange font-normal italic cursor-pointer hover:underline decoration-brand-light underline-offset-8"
                                onClick={() => setCurrentImage(DEFAULT_IMAGE)}
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