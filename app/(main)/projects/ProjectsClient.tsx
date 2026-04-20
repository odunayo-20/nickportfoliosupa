"use client";
import { useState, useMemo } from 'react'
import { ArrowRight, Fingerprint, Plus } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

type Category = { id: string; name: string; slug: string };

interface ProjectsClientProps {
  projects: any[];
  categories: Category[];
}

export default function ProjectsClient({ projects, categories }: ProjectsClientProps) {
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const filteredProjects = useMemo(() => {
        if (activeCategory === "all") return projects;
        return projects.filter(p => p.category === activeCategory);
    }, [projects, activeCategory]);

    const featuredProjects = filteredProjects.filter(p => p.is_featured);
    const regularProjects = filteredProjects.filter(p => !p.is_featured);

  return (
    <>
    <motion.header 
        className="bg-brand-offwhite pt-24 pb-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6 text-center reveal">
            <motion.span variants={fadeInUp} className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-6">
                <span className="w-4 h-[2px] bg-brand-orange"></span> Selected Works
            </motion.span>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tighter text-brand-dark mb-6">
                Building <span className="text-brand-orange italic font-normal">digital products</span><br/>that scale.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-brand-muted text-lg max-w-2xl mx-auto leading-relaxed mb-12">
                A collection of high-performance mobile applications, enterprise architectures, and robust web systems I've engineered over the past 8 years.
            </motion.p>
            
            {/* Category Filter Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
                <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-6 py-2 text-sm font-bold rounded-full transition-all duration-200 ${
                        activeCategory === "all"
                            ? "bg-brand-dark text-white shadow-md"
                            : "bg-white text-brand-muted border border-gray-200 hover:border-brand-orange hover:text-brand-orange"
                    }`}
                >
                    All Projects
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeCategory === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {projects.length}
                    </span>
                </button>
                {categories.map(cat => {
                    const count = projects.filter(p => p.category === cat.name).length;
                    if (count === 0) return null;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`px-6 py-2 text-sm font-bold rounded-full transition-all duration-200 ${
                                activeCategory === cat.name
                                    ? "bg-brand-dark text-white shadow-md"
                                    : "bg-white text-brand-muted border border-gray-200 hover:border-brand-orange hover:text-brand-orange"
                            }`}
                        >
                            {cat.name}
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat.name ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </motion.div>
        </div>
    </motion.header>

    <AnimatePresence mode="wait">
        <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {filteredProjects.length === 0 && (
                <div className="max-w-7xl mx-auto px-6 py-32 text-center">
                    <p className="text-brand-muted text-lg font-medium">No projects in this category yet.</p>
                </div>
            )}

            {featuredProjects.length > 0 && (
            <motion.section 
                className="py-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="max-w-7xl mx-auto px-6">
                    {featuredProjects.map((project) => (
                    <motion.div key={project.id} variants={fadeInUp} className="grid lg:grid-cols-2 gap-12 items-center bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-shadow project-card mb-12 last:mb-0">
                        <Link href={`/projects/${project.slug}`} className="block overflow-hidden bg-brand-offwhite h-full min-h-[400px] relative hover:opacity-90 transition-opacity">
                            {project.imageUrl || project.image_url ? (
                                <img src={project.imageUrl || project.image_url} 
                                     alt={project.title} 
                                     className="project-image absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-brand-green/10 flex items-center justify-center">
                                    <span className="text-brand-green text-opacity-50 text-xl font-bold">{project.title}</span>
                                </div>
                            )}
                        </Link>
                        <div className="p-10 lg:p-16">
                            <div className="flex gap-2 mb-6">
                                <span className="text-xs font-bold text-brand-dark bg-brand-orange px-3 py-1 rounded-full uppercase tracking-widest">Featured</span>
                                {project.category && (
                                    <span className="text-xs font-bold text-brand-green border border-brand-green/20 px-3 py-1 rounded-full uppercase tracking-widest">{project.category}</span>
                                )}
                            </div>
                            <Link href={`/projects/${project.slug}`}>
                                <h2 className="text-4xl font-extrabold tracking-tight text-brand-dark mb-6 hover:text-brand-orange transition-colors">{project.title}</h2>
                            </Link>
                            <p className="text-brand-muted leading-relaxed mb-8">
                                {project.description}
                            </p>
                            
                            {project.tech_stack && project.tech_stack.length > 0 && (
                                <div className="flex flex-wrap gap-3 mb-10 border-l-2 border-brand-orange pl-4">
                                    {project.tech_stack.map((tech: string, i: number) => (
                                        <span key={i} className="text-sm font-semibold text-brand-dark flex items-center">
                                            {tech}
                                            {i < project.tech_stack.length - 1 && <span className="ml-3 text-sm text-brand-muted">•</span>}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-3 px-8 py-4 bg-brand-green text-white font-bold rounded-full hover:bg-brand-dark transition-colors">
                                View Case Study <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center"><ArrowRight className="w-3 h-3 text-brand-green" /></div>
                            </Link>
                        </div>
                    </motion.div>
                    ))}
                </div>
            </motion.section>
            )}

            <motion.section 
                className={`py-16 pb-32 ${featuredProjects.length === 0 ? 'pt-16' : ''}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-10">
                        {regularProjects.map((project) => (
                        <motion.div key={project.id} variants={fadeInUp} className="project-card flex flex-col bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-shadow reveal">
                            <Link href={`/projects/${project.slug}`} className="aspect-[4/3] overflow-hidden relative bg-brand-offwhite block hover:opacity-90 transition-opacity">
                                {project.imageUrl || project.image_url ? (
                                    <img src={project.imageUrl || project.image_url} 
                                         alt={project.title} 
                                         className="project-image absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 bg-brand-green/90 flex items-center justify-center project-image">
                                        <Fingerprint className="w-24 h-24 text-brand-orange opacity-50" />
                                    </div>
                                )}
                            </Link>
                            <div className="p-8 flex-grow flex flex-col">
                                {project.category && (
                                    <span className="text-xs font-bold text-brand-orange mb-3 uppercase tracking-widest">{project.category}</span>
                                )}
                                <Link href={`/projects/${project.slug}`}>
                                    <h3 className="text-2xl font-bold text-brand-dark mb-4 hover:text-brand-orange transition-colors">{project.title}</h3>
                                </Link>
                                <p className="text-brand-muted text-sm leading-relaxed mb-8 flex-grow">
                                    {project.description}
                                </p>
                                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                                    <div className="flex gap-2 flex-wrap max-w-[60%]">
                                        {project.tech_stack?.slice(0, 3).map((tech: string, i: number) => (
                                            <span key={i} className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded truncate max-w-[80px]" title={tech}>{tech}</span>
                                        ))}
                                        {project.tech_stack && project.tech_stack.length > 3 && (
                                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">+{project.tech_stack.length - 3}</span>
                                        )}
                                    </div>
                                    <Link href={`/projects/${project.slug}`} className="text-sm font-bold text-brand-green flex items-center gap-2 hover:text-brand-orange transition-colors cursor-pointer block z-10 shrink-0">
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                        ))}

                        {regularProjects.length % 2 === 0 && (
                        <motion.div variants={fadeInUp} className="flex flex-col bg-brand-offwhite border-2 border-dashed border-gray-300 rounded-sharp overflow-hidden hover:border-brand-orange transition-colors reveal items-center justify-center text-center p-12 h-full min-h-[400px]">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                                <Plus className="w-8 h-8 text-brand-orange" />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-dark mb-4">Your Project Here</h3>
                            <p className="text-brand-muted text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                                Currently accepting new freelance opportunities and full-time senior engineering roles. Let's build something phenomenal.
                            </p>
                            <Link href="/contact" className="px-8 py-3 bg-brand-dark text-white font-bold rounded-full hover:bg-brand-orange transition-colors cursor-pointer z-10">
                                Start a Conversation
                            </Link>
                        </motion.div>
                        )}

                    </div>
                </div>
            </motion.section>
        </motion.div>
    </AnimatePresence>

    </>
  )
}
