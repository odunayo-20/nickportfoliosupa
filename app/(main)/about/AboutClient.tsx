"use client";
import { Microscope, Code2, Gauge } from 'lucide-react'
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



const AboutClient = () => {
  return (
    <>
     <motion.header 
        className="bg-brand-green text-white pt-20 pb-32"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
     >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center reveal">
            <motion.div variants={fadeInUp}>
                <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-6">
                    <span className="w-4 h-[2px] bg-brand-orange"></span> My Journey
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-8">
                    Bridging the gap between <span className="text-brand-orange italic font-normal">design</span> & <span className="text-brand-orange italic font-normal">logic.</span>
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed max-w-lg mb-8">
                    With over 8+ years of engineering experience, I don't just build apps — I architect scalable, high-performance systems across Android and iOS. I specialize in Kotlin Multiplatform (KMP), real-time WebSocket integrations, and offline-first architectures. From building fan apps for premier football clubs to maintaining mission-critical IT infrastructure, I bridge the gap between design and solid engineering.
                </p>
                <div className="flex gap-4">
                    <a href="#timeline" className="px-8 py-3.5 bg-brand-orange text-brand-dark font-bold rounded-full hover:bg-white transition-all">
                        View Experience
                    </a>
                </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="relative">
                <div className="absolute inset-0 bg-brand-orange -translate-x-4 translate-y-4 rounded-sharp -z-10"></div>
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                     alt="Nikola Collaboration" 
                     className="w-full aspect-[4/3] object-cover rounded-sharp border-4 border-brand-green grayscale hover:grayscale-0 transition-all duration-700" />
            </motion.div>
        </div>
    </motion.header>

    <motion.section 
        className="py-24 bg-brand-offwhite"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6 reveal">
            <motion.div variants={fadeInUp} className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-4xl font-extrabold tracking-tighter text-brand-dark mb-6">My Engineering Philosophy</h2>
                <p className="text-brand-muted text-lg">I approach every project with three core pillars in mind. This ensures that the final product is not only beautiful but built to last.</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <motion.div variants={fadeInUp} className="bg-white p-10 rounded-sharp border border-gray-100 hover:border-brand-orange/30 hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 bg-brand-offwhite rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-orange/10 transition-colors">
                        <Microscope className="w-6 h-6 text-brand-green group-hover:text-brand-orange transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-4">1. Investigate & Architect</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Before writing a single line of code, I map out the data flow, state management, and edge cases to ensure the foundation is rock solid.</p>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="bg-white p-10 rounded-sharp border border-gray-100 hover:border-brand-orange/30 hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 bg-brand-offwhite rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-orange/10 transition-colors">
                        <Code2 className="w-6 h-6 text-brand-green group-hover:text-brand-orange transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-4">2. Clean Execution</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Utilizing Kotlin, Java, and modern web frameworks to write DRY, modular, and heavily documented code that other developers love to read.</p>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="bg-white p-10 rounded-sharp border border-gray-100 hover:border-brand-orange/30 hover:shadow-xl transition-all group">
                    <div className="w-12 h-12 bg-brand-offwhite rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-orange/10 transition-colors">
                        <Gauge className="w-6 h-6 text-brand-green group-hover:text-brand-orange transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-4">3. Zero-Latency Focus</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Performance is a feature. I strictly monitor memory allocation and network payloads to ensure native-level speeds across all devices.</p>
                </motion.div>
            </div>
        </div>
    </motion.section>

    <motion.section 
        id="timeline" 
        className="py-32 bg-brand-light"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-4xl mx-auto px-6 reveal">
            <motion.span variants={fadeInUp} className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-4">
                <span className="w-4 h-[2px] bg-brand-orange"></span> Professional Timeline
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold tracking-tighter text-brand-dark mb-16">10+ Years of Building.</motion.h2>
            
            <div className="relative border-l-2 border-brand-green/20 pl-8 ml-4 space-y-16">
                
                <motion.div variants={fadeInUp} className="relative group">
                    <div className="absolute -left-[41px] top-1 w-5 h-5 bg-brand-light border-4 border-brand-orange rounded-full group-hover:bg-brand-orange transition-colors"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-brand-dark">IT Equipment Repair Technician</h3>
                        <span className="text-brand-orange font-bold text-sm bg-brand-orange/10 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">Aug 2024 – May 2025</span>
                    </div>
                    <h4 className="text-brand-green font-semibold mb-4 text-lg">Hrvatski Telekom (Full-time) • Zadar, Croatia</h4>
                    <ul className="text-brand-muted leading-relaxed list-disc list-inside space-y-2">
                        <li>Repair and maintenance of IT equipment for large customers like INA, Tisak, Lidl, MUP, Carina, Zaba, and McDonalds.</li>
                        <li>Maintenance of Diebold ATMs and POS systems in the Zadarska, Šibensko-kninska, and Ličko-senjska regions.</li>
                    </ul>
                </motion.div>

                <motion.div variants={fadeInUp} className="relative group">
                    <div className="absolute -left-[41px] top-1 w-5 h-5 bg-brand-light border-4 border-brand-green rounded-full group-hover:bg-brand-green transition-colors"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-brand-dark">Android Developer</h3>
                        <span className="text-brand-muted font-bold text-sm bg-gray-100 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">Oct 2021 – Jun 2024</span>
                    </div>
                    <h4 className="text-brand-green font-semibold mb-4 text-lg">Meritum Soft (Full-time)</h4>
                    <ul className="text-brand-muted leading-relaxed list-disc list-inside space-y-2">
                        <li><span className="font-bold">Sports Fan Apps:</span> Core developer for ~10 modular sports engagement applications built natively in Android (Java 8, Kotlin), including América de Cali.</li>
                        <li><span className="font-bold">Tech & Integrations:</span> Integrated ExoPlayer (RTMP streaming), STOMP/WebSockets (live stats), ARCore/SceneForm (avatars), Firebase Suite, and location-based check-ins.</li>
                        <li><span className="font-bold">Subcontract (Feb–Mar 2021):</span> Worked on a financial app for a Dutch client utilizing Kotlin, MVVM, and Coroutines.</li>
                    </ul>
                </motion.div>

                <motion.div variants={fadeInUp} className="relative group">
                    <div className="absolute -left-[41px] top-1 w-5 h-5 bg-brand-light border-4 border-brand-green rounded-full group-hover:bg-brand-green transition-colors"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-brand-dark">Android Developer</h3>
                        <span className="text-brand-muted font-bold text-sm bg-gray-100 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">Mar 2021 – Jun 2021</span>
                    </div>
                    <h4 className="text-brand-green font-semibold mb-4 text-lg">Mathcode (Full-time)</h4>
                    <p className="text-brand-muted leading-relaxed">
                        Handled end-to-end development of Android applications.
                    </p>
                </motion.div>

                <motion.div variants={fadeInUp} className="relative group">
                    <div className="absolute -left-[41px] top-1 w-5 h-5 bg-brand-light border-4 border-brand-green rounded-full group-hover:bg-brand-green transition-colors"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-brand-dark">Freelance Android Developer (Xamarin)</h3>
                        <span className="text-brand-muted font-bold text-sm bg-gray-100 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">2015 – 2016</span>
                    </div>
                    <h4 className="text-brand-green font-semibold mb-4 text-lg">Road Pal (Egyptian Startup) & Grasshopper (Ri Startup)</h4>
                    <p className="text-brand-muted leading-relaxed">
                        Sole developer for a ride-sharing Android app (Parse.com, Google Autocomplete, Real-time chat). Re-platformed field service apps with location-aware services.
                    </p>
                </motion.div>
                
            </div>
        </div>
    </motion.section>
    
    </>
  )
}

export default AboutClient


