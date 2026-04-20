"use client";
import { ArrowLeft, ExternalLink, Layers, Zap, Database, Check, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
)


export default function ProjectDetailsClient({ project }: { project: any }) {
  if (!project) return null;

  return (
    <>
    <motion.header 
        className="pt-20 pb-16 bg-brand-light"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
    >
        <motion.div variants={fadeInUp} className="max-w-7xl mx-auto px-6 reveal">
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-brand-orange transition-colors mb-10">
                <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>
            
            <div className="flex flex-col mb-16 max-w-4xl">
                <div className="flex gap-3 mb-6">
                    <span className="text-xs font-bold text-brand-dark bg-brand-orange px-3 py-1 rounded-full uppercase tracking-widest">Case Study</span>
                    {project.category && (
                        <span className="text-xs font-bold text-brand-green border border-brand-green/20 px-3 py-1 rounded-full uppercase tracking-widest">{project.category}</span>
                    )}
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-brand-dark leading-[1.05] mb-8">
                    {project.title}
                </h1>
                <p className="text-brand-muted text-xl leading-relaxed whitespace-pre-wrap">
                    {project.description}
                </p>
            </div>

            <div className="flex flex-wrap gap-8 py-8 border-y border-gray-200 border mb-16 justify-between">
                {project.category && (
                <div>
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Category</span>
                    <span className="font-semibold text-brand-dark">{project.category}</span>
                </div>
                )}
                
                {project.tech_stack && project.tech_stack.length > 0 && (
                <div>
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Tech Stack</span>
                    <span className="font-semibold text-brand-dark">{project.tech_stack.join(', ')}</span>
                </div>
                )}
                
                {(project.live_url || project.github_url) && (
                <div>
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Links</span>
                    <div className="flex gap-4">
                        {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-orange flex items-center gap-1 hover:gap-2 transition-all">
                            Live App <ExternalLink className="w-4 h-4" />
                        </a>
                        )}
                        {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark flex items-center gap-1 hover:gap-2 transition-all hover:text-brand-orange">
                            Repository <GithubIcon className="w-4 h-4" />
                        </a>
                        )}
                    </div>
                </div>
                )}
                
                {(project.app_store_url || project.play_store_url) && (
                <div>
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Stores</span>
                    <div className="flex gap-4">
                        {project.app_store_url && (
                        <a href={project.app_store_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark flex items-center gap-1 hover:gap-2 transition-all hover:text-brand-orange">
                            App Store <ExternalLink className="w-4 h-4" />
                        </a>
                        )}
                        {project.play_store_url && (
                        <a href={project.play_store_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark flex items-center gap-1 hover:gap-2 transition-all hover:text-brand-orange">
                            Play Store <ExternalLink className="w-4 h-4" />
                        </a>
                        )}
                    </div>
                </div>
                )}
            </div>

            {(project.imageUrl || project.image_url) && (
            <div className="w-full aspect-[21/9] md:aspect-[21/9] bg-brand-offwhite rounded-sharp overflow-hidden relative border border-gray-100">
                <img src={project.imageUrl || project.image_url} 
                     alt={project.title} 
                     className="w-full h-full object-cover" />
            </div>
            )}
        </motion.div>
    </motion.header>

    {project.content && (
    <motion.section 
        className="py-24 bg-brand-offwhite"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-4xl mx-auto px-6">
            <motion.div variants={fadeInUp} className="prose prose-lg max-w-none text-brand-muted prose-headings:text-brand-dark prose-a:text-brand-orange hover:prose-a:text-brand-dark prose-img:rounded-sharp">
                <div dangerouslySetInnerHTML={{ __html: project.content }} />
            </motion.div>
        </div>
    </motion.section>
    )}

    {project.additionalImages && project.additionalImages.length > 0 && (
    <motion.section 
        className="py-12 bg-brand-offwhite"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6 mt-8">
            <motion.div variants={fadeInUp} className="mb-12">
                <h3 className="text-3xl font-extrabold text-brand-dark mb-4 tracking-tight">Project Gallery</h3>
                <div className="h-1 w-20 bg-brand-orange"></div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {project.additionalImages.map((img: string, idx: number) => (
                    <motion.div key={idx} variants={fadeInUp} className="rounded-sharp overflow-hidden border border-gray-200 bg-white aspect-video relative group shadow-sm transition-all hover:shadow-md">
                        <img 
                            src={img} 
                            alt={`${project.title} gallery image ${idx + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    </motion.section>
    )}

    <motion.section 
        className="py-24 bg-brand-light"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <motion.div variants={fadeInUp} className="max-w-7xl mx-auto px-6 text-center reveal">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4 block">Next Steps</span>
            <Link href="/contact" className="group inline-block">
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-brand-dark mb-6 group-hover:text-brand-orange transition-colors">
                    Let's work together.
                </h2>
                <div className="flex items-center justify-center gap-2 text-brand-green font-bold group-hover:gap-4 transition-all pr-4">
                    Start a Conversation <ArrowRight className="w-5 h-5" />
                </div>
            </Link>
        </motion.div>
    </motion.section>

    </>
  )
}
