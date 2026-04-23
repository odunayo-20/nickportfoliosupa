import { ArrowRight, Layers, Cpu, Layout } from 'lucide-react'
import { motion, Variants } from 'motion/react'
import Link from 'next/link';

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




const Services = () => {
  return (
    <>
    
    <motion.section
                    id="services"
                    className="max-w-7xl mx-auto px-6 py-24"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 reveal">
                        <div>
                            <span className="text-brand-orange font-semibold flex items-center gap-2 text-sm mb-2">
                                <span className="w-4 h-[2px] bg-brand-orange"></span> Services
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-brand-dark">Services I Provide</h2>
                        </div>
                        <Link href="/services" className="px-6 py-2.5 bg-brand-green text-white text-sm font-semibold rounded-full flex items-center gap-3 hover:bg-brand-dark transition-colors">
                               
                            View All Services <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <ArrowRight className="w-3 h-3 text-brand-green" />
                                </div>
                               
                        </Link>
                    </motion.div>
    
                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div variants={fadeInUp} className="p-8 bg-brand-offwhite rounded-sharp hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal border border-transparent hover:border-brand-orange/20">
                            <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mb-6 shadow-sm">
                                <Layers className="w-6 h-6 text-brand-green" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-brand-dark">UI/UX Implementation</h3>
                            <p className="text-brand-muted text-sm mb-6 leading-relaxed">Translating complex designs into pixel-perfect, performant native mobile interfaces with zero layout shift.</p>
                            <a href="#" className="text-sm font-semibold text-brand-orange flex items-center gap-2 hover:gap-3 transition-all">
                                Learn more <ArrowRight className="w-4 h-4" />
                            </a>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="p-8 bg-brand-offwhite rounded-sharp hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal border border-transparent hover:border-brand-orange/20">
                            <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mb-6 shadow-sm">
                                <Cpu className="w-6 h-6 text-brand-green" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-brand-dark">Application Design</h3>
                            <p className="text-brand-muted text-sm mb-6 leading-relaxed">Architecting robust Android applications focusing on Kotlin Coroutines, clean architecture, and memory safety.</p>
                            <a href="#" className="text-sm font-semibold text-brand-orange flex items-center gap-2 hover:gap-3 transition-all">
                                Learn more <ArrowRight className="w-4 h-4" />
                            </a>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="p-8 bg-brand-offwhite rounded-sharp hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal border border-transparent hover:border-brand-orange/20">
                            <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mb-6 shadow-sm">
                                <Layout className="w-6 h-6 text-brand-green" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-brand-dark">Website Design</h3>
                            <p className="text-brand-muted text-sm mb-6 leading-relaxed">Developing robust web backends and high-performance frontends that scale seamlessly to millions of users.</p>
                            <a href="#" className="text-sm font-semibold text-brand-orange flex items-center gap-2 hover:gap-3 transition-all">
                                Learn more <ArrowRight className="w-4 h-4" />
                            </a>
                        </motion.div>
                    </div>
                </motion.section>
    
    </>
  )
}

export default Services