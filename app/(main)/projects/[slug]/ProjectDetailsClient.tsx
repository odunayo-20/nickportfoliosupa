"use client";
import { useState } from 'react';
import { ArrowLeft, ExternalLink, Layers, Zap, Database, Check, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, Variants, AnimatePresence } from 'motion/react'
import Image from 'next/image';
import Link from 'next/link'

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

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
)

// Image Lightbox Component
function ImageLightbox({ images, initialIndex, isOpen, onClose }: { images: string[], initialIndex: number, isOpen: boolean, onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onKeyDown={handleKeyDown}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          tabIndex={0}
          autoFocus
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white hover:text-brand-orange transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Main Image */}
           <div className="relative w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] max-h-[90vh] bg-black rounded-lg overflow-hidden">
              <Image
                src={images[currentIndex]}
                alt={`Gallery image ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {currentIndex + 1} / {images.length}
                </div>

                {/* Thumbnail Navigation */}
                <div className="absolute -bottom-24 left-0 right-0 flex gap-3 justify-center flex-wrap px-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all ${
                        idx === currentIndex
                          ? 'ring-2 ring-brand-orange scale-105'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ProjectDetailsClient({ project }: { project: any }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!project) return null;

  const allImages = [
    project.imageUrl || project.image_url,
    ...(project.additionalImages || [])
  ].filter(Boolean);

  return (
    <>
    <ImageLightbox 
      images={allImages} 
      initialIndex={lightboxIndex} 
      isOpen={lightboxOpen} 
      onClose={() => setLightboxOpen(false)} 
    />

    <motion.header 
        className="pt-20 pb-24 bg-gradient-to-b from-brand-light to-white"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
    >
        <motion.div variants={fadeInUp} className="max-w-7xl mx-auto px-6 reveal">
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-brand-orange transition-colors mb-12">
                <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>
            
            <div className="flex flex-col mb-20 max-w-5xl">
                <div className="flex gap-3 mb-8 flex-wrap">
                    <span className="text-xs font-bold text-brand-dark bg-brand-orange px-4 py-2 rounded-full uppercase tracking-widest">Case Study</span>
                    {project.category && (
                        <span className="text-xs font-bold text-brand-green border border-brand-green/20 px-4 py-2 rounded-full uppercase tracking-widest">{project.category}</span>
                    )}
                </div>
                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-brand-dark leading-[1.05] mb-8">
                    {project.title}
                </h1>
                <p className="text-brand-muted text-xl leading-relaxed whitespace-pre-wrap max-w-3xl">
                    {project.description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-6 border-t border-b border-gray-200 mb-20">
                {project.category && (
                <div className="group">
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-3">Category</span>
                    <span className="font-semibold text-lg text-brand-dark group-hover:text-brand-orange transition-colors">{project.category}</span>
                </div>
                )}
                
                {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="group">
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-3">Tech Stack</span>
                    <span className="font-semibold text-lg text-brand-dark group-hover:text-brand-orange transition-colors">{project.tech_stack.slice(0, 3).join(', ')}{project.tech_stack.length > 3 ? '...' : ''}</span>
                </div>
                )}
                
                {(project.live_url || project.github_url) && (
                <div className="group">
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-3">Links</span>
                    <div className="flex flex-col gap-3">
                        {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-orange flex items-center gap-2 hover:gap-3 transition-all w-fit">
                            Live App <ExternalLink className="w-4 h-4" />
                        </a>
                        )}
                        {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark flex items-center gap-2 hover:gap-3 transition-all hover:text-brand-orange w-fit">
                            Repository <GithubIcon className="w-4 h-4" />
                        </a>
                        )}
                    </div>
                </div>
                )}
                
                {(project.app_store_url || project.play_store_url) && (
                <div className="group">
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-3">Stores</span>
                    <div className="flex flex-col gap-3">
                        {project.app_store_url && (
                        <a href={project.app_store_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark flex items-center gap-2 hover:gap-3 transition-all hover:text-brand-orange w-fit">
                            App Store <ExternalLink className="w-4 h-4" />
                        </a>
                        )}
                        {project.play_store_url && (
                        <a href={project.play_store_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark flex items-center gap-2 hover:gap-3 transition-all hover:text-brand-orange w-fit">
                            Play Store <ExternalLink className="w-4 h-4" />
                        </a>
                        )}
                    </div>
                </div>
                )}
            </div>

            {(project.imageUrl || project.image_url) && (
            <motion.div 
              variants={fadeInUp}
              className="w-full aspect-video md:aspect-[16/9] bg-brand-offwhite rounded-lg overflow-hidden relative border border-gray-200 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
              onClick={() => {
                setLightboxIndex(0);
                setLightboxOpen(true);
              }}
            >
                <Image src={project.imageUrl || project.image_url} 
                     alt={project.title} 
                     fill
                     sizes='(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="bg-white/90 p-4 rounded-full backdrop-blur-sm"
                  >
                    <ExternalLink className="w-6 h-6 text-brand-orange" />
                  </motion.div>
                </div>
            </motion.div>
            )}
        </motion.div>
    </motion.header>

    {project.content && (
    <motion.section 
        className="py-24 bg-brand-light"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-4xl mx-auto px-6">
  <motion.div
    variants={fadeInUp}
    className="max-w-3xl mx-auto px-6 pb-20 reveal article-body prose prose-lg prose-slate dark:prose-invert"
  >
    <div className='' dangerouslySetInnerHTML={{ __html: project.content }} />
  </motion.div>
</div>
    </motion.section>
    )}

    {project.additionalImages && project.additionalImages.length > 0 && (
    <motion.section 
        className="py-14 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6">
            <motion.div variants={fadeInUp} className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">Project Gallery</h2>
                  <div className="h-1 flex-grow max-w-20 bg-gradient-to-r from-brand-orange to-transparent rounded-full"></div>
                </div>
                <p className="text-brand-muted text-lg">Click any image to view in full screen</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.additionalImages.map((img: string, idx: number) => (
                    <motion.div 
                      key={idx} 
                      variants={fadeInUp} 
                      className="group rounded-lg overflow-hidden border border-gray-200 bg-white aspect-video md:aspect-square relative shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer"
                      onClick={() => {
                        setLightboxIndex(idx + 1); // +1 because main image is at index 0
                        setLightboxOpen(true);
                      }}
                    >
                        <Image 
                            src={img} 
                            alt={`${project.title} gallery image ${idx + 1}`} 
                            fill
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 0vw, 33vw'
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white/95 p-4 rounded-full backdrop-blur-sm shadow-lg"
                          >
                            <ExternalLink className="w-6 h-6 text-brand-orange" />
                          </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </motion.section>
    )}

    <motion.section 
        className="py-32 bg-gradient-to-b from-white to-brand-light relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <motion.div variants={fadeInUp} className="max-w-7xl mx-auto px-6 text-center reveal relative z-10">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-6 block">Let's Create Together</span>
            <Link href="/contact" className="group inline-block">
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-brand-dark mb-8 group-hover:text-brand-orange transition-colors duration-300 leading-tight">
                    Ready to build something <span className="text-brand-green italic font-normal">amazing?</span>
                </h2>
                <p className="text-brand-muted text-xl mb-12 max-w-2xl mx-auto">
                  I'm available for freelance projects, partnerships, and full-time opportunities. Let's discuss how we can work together.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-brand-orange to-brand-green text-white font-bold rounded-full hover:shadow-2xl transition-all text-lg group/btn"
                >
                    Start a Conversation 
                    <motion.div 
                      className="flex items-center justify-center"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                </motion.button>
            </Link>
        </motion.div>
    </motion.section>

    </>
  )
}
