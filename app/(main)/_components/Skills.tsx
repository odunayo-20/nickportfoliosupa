import { Database } from 'lucide-react'
import { motion, Variants } from 'motion/react'




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


const Skills = () => {
  return (
    <>
    
      <motion.section
                id="skills"
                className="bg-brand-offwhite py-24"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="max-w-7xl mx-auto px-6">
                    {/* heading */}
                    <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                        <div>
                            <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-2">
                                <span className="w-4 h-[2px] bg-brand-orange"></span> My Skills
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-brand-dark">
                                Technologies &amp; Tools<br className="hidden md:block" /> I Work With
                            </h2>
                        </div>
                        <p className="text-brand-muted text-sm max-w-xs leading-relaxed">
                            A curated stack refined over years of shipping production-grade mobile and web products.
                        </p>
                    </motion.div>

                    {/* grid of category cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Mobile */}
                        <motion.div
                            variants={fadeInUp}
                            className="bg-white rounded-sharp p-8 border border-transparent hover:border-brand-orange/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-brand-orange/10 rounded-md flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
                                    <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <rect x="7" y="2" width="10" height="20" rx="2" />
                                        <circle cx="12" cy="18" r="1" fill="currentColor" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark">Mobile</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["Kotlin", "Java", "Android SDK", "Jetpack Compose", "XML UI", "Kotlin Multiplatform"].map(s => (
                                    <span key={s} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange border border-brand-orange/20">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Architecture */}
                        <motion.div
                            variants={fadeInUp}
                            className="bg-white rounded-sharp p-8 border border-transparent hover:border-brand-green/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-brand-green/10 rounded-md flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                                    <svg className="w-5 h-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark">Architecture</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["MVVM", "Clean Architecture", "Coroutines", "LiveData", "Repository Pattern"].map(s => (
                                    <span key={s} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Backend / Services */}
                        <motion.div
                            variants={fadeInUp}
                            className="bg-white rounded-sharp p-8 border border-transparent hover:border-brand-dark/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-brand-dark/8 rounded-md flex items-center justify-center group-hover:bg-brand-dark/15 transition-colors">
                                    <Database className="w-5 h-5 text-brand-dark" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark">Backend / Services</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["Firebase", "Supabase", "REST APIs", "PostgreSQL", "Push Notifications"].map(s => (
                                    <span key={s} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-dark/8 text-brand-dark border border-brand-dark/15">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Tools */}
                        <motion.div
                            variants={fadeInUp}
                            className="bg-brand-green rounded-sharp p-8 border border-transparent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white/15 rounded-md flex items-center justify-center group-hover:bg-white/25 transition-colors">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Tools</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["Git", "Android Studio", "Xcode", "Gradle"].map(s => (
                                    <span key={s} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/25">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </motion.section>
    
    </>
  )
}

export default Skills