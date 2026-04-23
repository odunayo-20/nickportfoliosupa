"use client"

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



const Tools = () => {
  return (
    <>
    
            <motion.section
                id="tools"
                className="max-w-4xl mx-auto px-6 py-24 text-center reveal"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <motion.span variants={fadeInUp} className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-2">
                    <span className="w-4 h-[2px] bg-brand-orange"></span> My Favorite Tools
                </motion.span>
                <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold tracking-tighter text-brand-dark mb-16">
                    Exploring the Tools<br />Behind My Designs
                </motion.h2>

                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    <motion.div variants={fadeInUp} className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                        <a href="https://kotlinlang.org" target='_blank'>
                        
                        <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" alt="Kotlin" width={40} height={40} className="w-10 h-10 grayscale hover:grayscale-0 transition-all" />
                        </a>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                         <a href="https://www.java.com/en/" target='_blank'>
                        <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" width={40} height={40} className="w-10 h-10 grayscale hover:grayscale-0 transition-all" />
                         </a>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                         <a href="https://developer.android.com/studio" target='_blank'>
                        <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg" alt="Android Studio" width={40} height={40} className="w-10 h-10 grayscale hover:grayscale-0 transition-all" />
                         </a>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                         <a href="https://developer.apple.com/xcode/" target='_blank'>
                        <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xcode/xcode-original.svg" alt="Android Studio" width={40} height={40} className="w-10 h-10 grayscale hover:grayscale-0 transition-all" />
                         </a>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                         <a href="https://firebase.google.com/" target='_blank'>
                        <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg" alt="Firebase" width={40} height={40} className="w-10 h-10 grayscale hover:grayscale-0 transition-all" />
                         </a>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                        <a href='https://supabase.com/' target='_blank'>
                        <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" alt="Supabase" width={40} height={40} className="w-10 h-10 grayscale hover:grayscale-0 transition-all" />
                        </a>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                        <a href='https://git-scm.com/' target='_blank'>
                        <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" width={40} height={40} className="w-10 h-10 grayscale hover:grayscale-0 transition-all" />
                        </a>
                    </motion.div>
                    {/* <motion.div variants={fadeInUp} className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:-translate-y-2 hover:shadow-md hover:border-brand-orange transition-all cursor-pointer">
                        <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" alt="Figma" width={40} height={40} className="w-10 h-10 grayscale hover:grayscale-0 transition-all" />
                    </motion.div> */}
                  
                </div>
            </motion.section>
    
    </>
  )
}

export default Tools