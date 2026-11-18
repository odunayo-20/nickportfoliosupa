"use client";
import { useEffect, useRef, useState, ViewTransition } from 'react';
import { SplitText } from '@/components/motion/SplitText';
import { ArrowLeft, ExternalLink, Layers, Zap, Database, Check, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { m, AnimatePresence, useScroll, useTransform } from 'motion/react'
import { useHydratedReducedMotion } from '@/components/motion/useHydratedReducedMotion'
import { useScrollLock } from '@/components/motion/SmoothScroll'
import { fadeInUp, staggerContainer, projectImageTransitionName } from '@/lib/motion'
import Image from 'next/image';
import Link from 'next/link'
import type { ProjectDetail } from '@/types/content'



const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
)

// Image Lightbox Component
function ImageLightbox({ images, initialIndex, isOpen, onClose }: { images: string[], initialIndex: number, isOpen: boolean, onClose: () => void }) {
  useScrollLock(isOpen);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [wasOpen, setWasOpen] = useState(isOpen);

  // The lightbox stays mounted, so re-sync to the clicked image each time it opens
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setCurrentIndex(initialIndex);
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Window-level keys: the overlay div never reliably receives focus, so onKeyDown didn't fire
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, images.length, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          data-lenis-prevent
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        >
          <m.div
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
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}


type AdjacentProject = { slug: string; title: string; imageUrl: string | null; category: string | null } | null

/** Hero image: morphs in from the /projects card (View Transition) and drifts inside its frame on scroll. */
function HeroImage({ src, alt, slug, onOpen }: { src: string; alt: string; slug: string; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%'])

  return (
    <m.div
      ref={ref}
      variants={fadeInUp}
      className="w-full aspect-video md:aspect-[16/9] bg-surface-alt rounded-lg overflow-hidden relative border border-line shadow-lg hover:shadow-2xl transition-motion-safe cursor-pointer group"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label="Open image viewer"
      data-cursor="Zoom"
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
    >
      <ViewTransition name={projectImageTransitionName(slug)} share="project-morph">
        <m.div style={{ y, scale: 1.14 }} className="absolute inset-0">
          <Image src={src}
               alt={alt}
               fill
               preload
               sizes="(max-width: 1280px) 100vw, 1280px"
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </m.div>
      </ViewTransition>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
        <div className="bg-surface/90 p-4 rounded-full backdrop-blur-sm opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-[opacity,scale] duration-300">
          <ExternalLink className="w-6 h-6 text-brand-orange" />
        </div>
      </div>
    </m.div>
  )
}

/** Previous / next project cards at the bottom of the case study. */
function ProjectNav({ prev, next }: { prev: AdjacentProject; next: AdjacentProject }) {
  if (!prev && !next) return null
  const items = [
    prev && { ...prev, dir: 'prev' as const, label: 'Previous project' },
    next && { ...next, dir: 'next' as const, label: 'Next project' },
  ].filter(Boolean) as (NonNullable<AdjacentProject> & { dir: 'prev' | 'next'; label: string })[]

  return (
    <m.nav
      aria-label="More projects"
      className="py-20 bg-surface-alt border-t border-line"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className={`max-w-7xl mx-auto px-6 grid gap-6 ${items.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {items.map((p) => (
          <m.div key={p.dir} variants={fadeInUp}>
            <Link
              href={`/projects/${p.slug}`}
              className={`group relative flex items-center gap-6 p-6 md:p-8 bg-surface rounded-sharp border border-line overflow-hidden hover:shadow-xl hover:border-brand-orange/30 transition-[box-shadow,border-color] duration-300 ${p.dir === 'next' ? 'md:flex-row-reverse md:text-right' : ''}`}
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-md overflow-hidden bg-surface-alt">
                {p.imageUrl && (
                  <Image src={p.imageUrl} alt="" fill sizes="128px" className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-[filter,transform] duration-700" />
                )}
              </div>
              <div className="min-w-0">
                <span className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-muted mb-2 ${p.dir === 'next' ? 'md:justify-end' : ''}`}>
                  {p.dir === 'prev' && <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />}
                  {p.label}
                  {p.dir === 'next' && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-ink group-hover:text-brand-orange transition-colors line-clamp-2">{p.title}</h3>
                {p.category && <span className="text-sm text-accent-green font-semibold">{p.category}</span>}
              </div>
            </Link>
          </m.div>
        ))}
      </div>
    </m.nav>
  )
}

export default function ProjectDetailsClient({ project, adjacent = { prev: null, next: null } }: { project: ProjectDetail; adjacent?: { prev: AdjacentProject; next: AdjacentProject } }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!project) return null;

  const mainImage = project.imageUrl || project.image_url;
  const allImages = [
    mainImage,
    ...(project.additionalImages || [])
  ].filter((src): src is string => !!src);
  const galleryOffset = mainImage ? 1 : 0;

  return (
    <>
    <ImageLightbox 
      images={allImages} 
      initialIndex={lightboxIndex} 
      isOpen={lightboxOpen} 
      onClose={() => setLightboxOpen(false)} 
    />

    <m.header 
        className="pt-16 sm:pt-20 pb-4 sm:pb-8 md:pb-12 bg-gradient-to-b from-surface-alt to-surface"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
    >
        <m.div variants={fadeInUp} className="max-w-7xl mx-auto px-6">
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-brand-orange transition-colors mb-8 sm:mb-12">
                <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>
            
            <div className="flex flex-col mb-10 sm:mb-16 md:mb-20 max-w-5xl">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <span className="inline-flex items-center text-xs font-bold text-brand-dark bg-brand-orange px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full uppercase tracking-wider sm:tracking-widest shrink-0 self-start">Case Study</span>
                    {project.category && (
                        <span className="inline-flex items-center text-xs font-bold text-accent-green border border-accent-green/20 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full uppercase tracking-wider sm:tracking-widest self-start">{project.category}</span>
                    )}
                </div>
                <SplitText as="h1" immediate delay={0.15} stagger={0.018} className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-ink leading-[1.05] mb-6 sm:mb-8">
                    {project.title}
                </SplitText>
                <p className="text-ink-muted text-lg sm:text-xl leading-relaxed whitespace-pre-wrap max-w-3xl">
                    {project.description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 py-6 border-t border-b border-line mb-8 sm:mb-14 md:mb-20">
                {project.category && (
                <div className="group">
                    <span className="block text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">Category</span>
                    <span className="font-semibold text-lg text-ink group-hover:text-brand-orange transition-colors">{project.category}</span>
                </div>
                )}
                
                {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="group">
                    <span className="block text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">Tech Stack</span>
                    <span className="font-semibold text-lg text-ink group-hover:text-brand-orange transition-colors">{project.tech_stack.slice(0, 3).join(', ')}{project.tech_stack.length > 3 ? '...' : ''}</span>
                </div>
                )}
                
                {(project.live_url || project.github_url) && (
                <div className="group">
                    <span className="block text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">Links</span>
                    <div className="flex flex-col gap-3">
                        {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-orange flex items-center gap-2 hover:gap-3 transition-all w-fit">
                            Live App <ExternalLink className="w-4 h-4" />
                        </a>
                        )}
                        {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink flex items-center gap-2 hover:gap-3 transition-all hover:text-brand-orange w-fit">
                            Repository <GithubIcon className="w-4 h-4" />
                        </a>
                        )}
                    </div>
                </div>
                )}
                
                {(project.app_store_url || project.play_store_url) && (
                <div className="group">
                    <span className="block text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">Stores</span>
                    <div className="flex flex-col gap-3">
                        {project.app_store_url && (
                        <a href={project.app_store_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink flex items-center gap-2 hover:gap-3 transition-all hover:text-brand-orange w-fit">
                            App Store <ExternalLink className="w-4 h-4" />
                        </a>
                        )}
                        {project.play_store_url && (
                        <a href={project.play_store_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink flex items-center gap-2 hover:gap-3 transition-all hover:text-brand-orange w-fit">
                            Play Store <ExternalLink className="w-4 h-4" />
                        </a>
                        )}
                    </div>
                </div>
                )}
            </div>

            {mainImage && (
              <HeroImage
                src={mainImage}
                alt={project.title}
                slug={project.slug}
                onOpen={() => {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
              />
            )}
        </m.div>
    </m.header>

    {project.content && (
    <m.section 
        className="pt-4 sm:pt-8 md:pt-12 pb-16 sm:pb-20 md:pb-24 bg-surface"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
  <m.div
    variants={fadeInUp}
    className="max-w-3xl mx-auto px-2 sm:px-6 pb-12 sm:pb-20 article-body prose prose-slate dark:prose-invert max-w-none"
  >
    <div className='' dangerouslySetInnerHTML={{ __html: project.content }} />
  </m.div>
</div>
    </m.section>
    )}

    {project.additionalImages && project.additionalImages.length > 0 && (
    <m.section 
        className="py-14 bg-surface"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6">
            <m.div variants={fadeInUp} className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight">Project Gallery</h2>
                  <div className="h-1 flex-grow max-w-20 bg-gradient-to-r from-brand-orange to-transparent rounded-full"></div>
                </div>
                <p className="text-ink-muted text-lg">Click any image to view in full screen</p>
            </m.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.additionalImages.map((img: string, idx: number) => (
                    <m.div 
                      key={idx} 
                      variants={fadeInUp} 
                      className="group rounded-lg overflow-hidden border border-line bg-surface aspect-video md:aspect-square relative shadow-md hover:shadow-xl transition-motion-safe duration-500 cursor-pointer"
                      data-cursor="Zoom"
                      onClick={() => {
                        setLightboxIndex(idx + galleryOffset); // main image (if any) is at index 0
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
                          <div className="bg-surface/95 p-4 rounded-full backdrop-blur-sm shadow-lg opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-[opacity,scale] duration-300">
                            <ExternalLink className="w-6 h-6 text-brand-orange" />
                          </div>
                        </div>
                    </m.div>
                ))}
            </div>
        </div>
    </m.section>
    )}

    <ProjectNav prev={adjacent.prev} next={adjacent.next} />

    </>
  )
}
