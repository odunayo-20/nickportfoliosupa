"use client"

import { ArrowRight } from 'lucide-react'
import { motion, Variants } from 'motion/react'

import Image from 'next/image'


const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const About = () => {
  return (
    <>
    
       <motion.section
                id="about"
                className="bg-brand-green py-24 overflow-hidden text-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    <motion.div variants={scaleIn} className="relative w-full max-w-md mx-auto aspect-square reveal">
                        <div className="absolute inset-4 bg-brand-orange rounded-full -translate-x-6 -translate-y-6"></div>

                        <Image src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
                            alt="Nikola Working"
                            width={800}
                            height={800}
                            className="absolute inset-0 w-full h-full object-cover rounded-full z-10 border-8 border-brand-green grayscale" />

                        <motion.div variants={scaleIn} className="absolute z-20 top-1/4 -left-8 bg-brand-dark text-brand-orange text-xs font-bold px-4 py-2 rounded-full border-2 border-brand-green">UX/UI Design</motion.div>
                        <motion.div variants={scaleIn} className="absolute z-20 top-1/2 -left-12 bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-full border-2 border-brand-light">Mobile App Design</motion.div>
                        <motion.div variants={scaleIn} className="absolute z-20 bottom-1/4 -left-4 bg-brand-orange text-brand-dark text-xs font-bold px-4 py-2 rounded-full border-2 border-brand-green">Design System</motion.div>

                        <motion.div variants={scaleIn} className="absolute z-20 top-1/3 -right-6 bg-brand-orange text-brand-dark text-xs font-bold px-4 py-2 rounded-full border-2 border-brand-green">Website Design</motion.div>
                        <motion.div variants={scaleIn} className="absolute z-20 bottom-1/3 right-0 bg-brand-dark text-white text-xs font-bold px-4 py-2 rounded-full border-2 border-brand-green">Prototype</motion.div>
                        <motion.div variants={scaleIn} className="absolute z-20 bottom-12 right-12 bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-full border-2 border-brand-light">Dashboard</motion.div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="reveal">
                        <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-4">
                            <span className="w-4 h-[2px] bg-brand-orange"></span> About Me
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">
                            Who is <span className="text-brand-orange font-normal italic">Nikola?</span>
                        </h2>

                        <p className="text-gray-300 text-base leading-relaxed mb-10 max-w-lg">
                            I’m a mobile developer focused on Android and Kotlin Multiplatform. I’ve worked on commercial apps, startup products, and modern mobile systems using Kotlin, MVVM, APIs, Firebase, and cross-platform architecture. Currently building apps for both Android and iOS.
                        </p>

                        <div className="grid grid-cols-3 gap-6 mb-12 border-b border-gray-600/50 pb-10">
                            <div>
                                <div className="text-3xl font-bold text-brand-orange mb-1">600+</div>
                                <div className="text-xs text-gray-400 font-medium">Project Completed</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-brand-orange mb-1">50+</div>
                                <div className="text-xs text-gray-400 font-medium">Industry Covered</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-brand-orange mb-1">18+</div>
                                <div className="text-xs text-gray-400 font-medium">Years of Experience</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-8">
                            <button className="px-6 py-3 bg-brand-light text-brand-dark font-bold text-sm rounded-full flex items-center gap-3 hover:bg-brand-orange transition-colors">
                                Download CV <div className="w-6 h-6 bg-brand-dark rounded-full flex items-center justify-center"><ArrowRight className="w-3 h-3 text-brand-light" /></div>
                            </button>
                            <div className="font-serif italic text-2xl text-brand-orange opacity-90">
                                Nikola.
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
    
    </>
  )
}

export default About