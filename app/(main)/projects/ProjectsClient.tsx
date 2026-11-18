"use client";
import { useState, useMemo, ViewTransition } from 'react'
import { ArrowRight, ArrowUpRight, Fingerprint, LayoutGrid, List, Plus } from 'lucide-react'
import { SplitText } from '@/components/motion/SplitText'
import { ClipReveal } from '@/components/motion/ClipReveal'
import { FloatingPreviewList } from '@/components/motion/FloatingPreviewList'
import Link from 'next/link'
import { m, AnimatePresence, LayoutGroup, type Variants } from 'motion/react'
import { EASE_OUT, fadeInUp, projectImageTransitionName, spring, staggerContainerFast as staggerContainer, VIEWPORT } from '@/lib/motion'
import Image from 'next/image';
import type { ProjectSummary } from '@/types/content'

type Category = { id: string; name: string; slug: string };

interface ProjectsClientProps {
  projects: ProjectSummary[];
  categories: Category[];
}

/** Card enter/exit for filtering: cards reveal when scrolled into view, and slide to new grid slots via `layout`. */
const card: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT, delay: (i % 3) * 0.08 } }),
    exit: { opacity: 0, scale: 0.92, transition: { duration: 0.25 } },
}

export default function ProjectsClient({ projects, categories }: ProjectsClientProps) {
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [view, setView] = useState<'grid' | 'list'>('grid');

    const filteredProjects = useMemo(() => {
        const ordered = [...projects].sort(
            (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
        );
        if (activeCategory === "all") return ordered;
        return ordered.filter(p => p.category === activeCategory);
    }, [projects, activeCategory]);

    const featuredProjects = filteredProjects.filter(p => p.is_featured);
    const regularProjects = filteredProjects.filter(p => !p.is_featured);

    const filters = [
        { key: "all", label: "All Projects", count: projects.length },
        ...categories
            .map(cat => ({ key: cat.name, label: cat.name, count: projects.filter(p => p.category === cat.name).length }))
            .filter(f => f.count > 0),
    ];

  return (
    <>
    <m.header
        className="bg-surface-alt pt-24 pb-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6 text-center">
            <m.span variants={fadeInUp} className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-6">
                <span className="w-4 h-[2px] bg-brand-orange"></span> Selected Works
            </m.span>
            <SplitText as="h1" immediate delay={0.2} className="text-5xl md:text-7xl font-extrabold tracking-tighter text-ink mb-6">
                Building <span className="text-brand-orange italic font-normal">digital products</span><br/>that scale.
            </SplitText>
            <m.p variants={fadeInUp} className="text-ink-muted text-lg max-w-2xl mx-auto leading-relaxed mb-12">
                A collection of high-performance mobile applications, enterprise architectures, and robust web systems I&apos;ve engineered over the past 8 years.
            </m.p>

            {/* Category filter — the dark pill slides to the active button */}
            <m.div variants={fadeInUp} role="group" aria-label="Filter projects by category" className="flex flex-wrap justify-center gap-3">
                {filters.map(f => {
                    const active = activeCategory === f.key;
                    return (
                        <button
                            key={f.key}
                            onClick={() => setActiveCategory(f.key)}
                            aria-pressed={active}
                            className={`relative isolate px-6 py-2 text-sm font-bold rounded-full transition-colors duration-200 ${
                                active
                                    ? "text-surface"
                                    : "bg-surface text-ink-muted border border-line hover:border-brand-orange hover:text-brand-orange"
                            }`}
                        >
                            {active && (
                                <m.span
                                    layoutId="project-filter-pill"
                                    transition={spring}
                                    className="absolute inset-0 -z-10 rounded-full bg-ink shadow-md"
                                />
                            )}
                            {f.label}
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full transition-colors ${active ? "bg-surface/20 text-surface" : "bg-surface-2 text-ink-muted"}`}>
                                {f.count}
                            </span>
                        </button>
                    );
                })}
            </m.div>

            {/* I3: grid / list view */}
            <m.div variants={fadeInUp} role="radiogroup" aria-label="Layout" className="mt-6 inline-flex p-1 rounded-full bg-surface border border-line">
                {([['grid', 'Grid', LayoutGrid], ['list', 'List', List]] as const).map(([key, label, Icon]) => (
                    <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={view === key}
                        onClick={() => setView(key)}
                        className={`relative isolate flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${view === key ? 'text-surface' : 'text-ink-muted hover:text-ink'}`}
                    >
                        {view === key && <m.span layoutId="project-view-pill" transition={spring} className="absolute inset-0 -z-10 rounded-full bg-ink" />}
                        <Icon className="w-3.5 h-3.5" /> {label}
                    </button>
                ))}
            </m.div>
        </div>
    </m.header>

    {view === 'list' ? (
        <section aria-label="Projects" className="max-w-7xl mx-auto px-6 pt-8 pb-32">
            {filteredProjects.length === 0 ? (
                <p className="py-24 text-center text-ink-muted text-lg font-medium">No projects in this category yet.</p>
            ) : (
                <FloatingPreviewList
                    items={filteredProjects.map((p) => ({
                        href: `/projects/${p.slug}`,
                        title: p.title,
                        meta: p.category ?? undefined,
                        tags: p.tech_stack ?? [],
                        image: p.imageUrl || p.image_url || null,
                    }))}
                />
            )}
        </section>
    ) : (
    <LayoutGroup>
        <AnimatePresence initial={false}>
            {filteredProjects.length === 0 && (
                <m.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-w-7xl mx-auto px-6 py-32 text-center"
                >
                    <p className="text-ink-muted text-lg font-medium">No projects in this category yet.</p>
                </m.div>
            )}
        </AnimatePresence>

        {featuredProjects.length > 0 && (
        <m.section layout="position" className="py-10">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-extrabold tracking-tighter text-ink mb-10 border-b border-line pb-4">Featured Projects</h2>
                <AnimatePresence mode="popLayout">
                    {featuredProjects.map((project) => {
                        const img = project.imageUrl || project.image_url;
                        return (
                    <m.div
                        key={project.id}
                        layout
                        variants={card}
                        initial="hidden"
                        whileInView="visible"
                        exit="exit"
                        viewport={VIEWPORT}
                        className="group flex flex-col lg:grid lg:grid-cols-2 gap-0 lg:gap-10 items-stretch lg:items-center bg-surface border border-line rounded-sharp overflow-hidden hover:shadow-xl transition-shadow project-card mb-8"
                    >
                        <Link href={`/projects/${project.slug}`} data-cursor="View" className="block overflow-hidden bg-surface-alt w-full h-[280px] sm:h-[350px] lg:h-full lg:min-h-[400px] relative p-4 lg:p-6">
                            {img ? (
                                <ClipReveal className="relative w-full h-full">
                                <ViewTransition name={projectImageTransitionName(project.slug)} share="project-morph">
                                    <div className="relative w-full h-full">
                                        <Image src={img}
                                             alt={project.title}
                                             fill
                                             sizes="(min-width: 1024px) 50vw, 100vw"
                                             className="project-image object-contain drop-shadow-3xl" />
                                    </div>
                                </ViewTransition>
                                </ClipReveal>
                            ) : (
                                <div className="absolute inset-0 bg-brand-green/10 flex items-center justify-center">
                                    <span className="text-accent-green text-opacity-50 text-xl font-bold">{project.title}</span>
                                </div>
                            )}
                        </Link>
                        <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                                <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-brand-dark bg-brand-orange px-3 py-1 rounded-full uppercase tracking-wider sm:tracking-widest shrink-0 self-start">
                                    Featured
                                </span>
                                {project.category && (
                                    <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-accent-green border border-accent-green/20 px-3 py-1 rounded-full uppercase tracking-wider sm:tracking-widest self-start">
                                        {project.category}
                                    </span>
                                )}
                            </div>
                            <Link href={`/projects/${project.slug}`}>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink mb-4 sm:mb-6 hover:text-brand-orange transition-colors leading-tight">{project.title}</h2>
                            </Link>

                            {project.tech_stack && project.tech_stack.length > 0 && (
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-8 sm:mb-10 border-l-2 border-brand-orange pl-4">
                                    {project.tech_stack.map((tech: string, i: number, list: string[]) => (
                                        <span key={i} className="text-xs sm:text-sm font-semibold text-ink flex items-center">
                                            {tech}
                                            {i < list.length - 1 && <span className="ml-3 text-xs sm:text-sm text-ink-muted">•</span>}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <Link href={`/projects/${project.slug}`} className="group/btn inline-flex items-center justify-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 bg-brand-green text-white font-bold rounded-full hover:bg-brand-dark transition-colors text-sm sm:text-base w-full sm:w-auto">
                                View Case Study
                                <span className="w-6 h-6 bg-surface rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1">
                                    <ArrowRight className="w-3 h-3 text-accent-green" />
                                </span>
                            </Link>
                        </div>
                    </m.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </m.section>
        )}

        <m.section
            layout="position"
            className={`py-16 pb-32 ${featuredProjects.length === 0 ? 'pt-16' : ''}`}
        >
            <div className="max-w-7xl mx-auto px-6">
                {regularProjects.length > 0 && (
                    <h2 className="text-2xl font-extrabold tracking-tighter text-ink mb-10 border-b border-line pb-4">All Projects</h2>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                    {regularProjects.map((project, i) => {
                        const img = project.imageUrl || project.image_url;
                        return (
                        <m.div
                            key={project.id}
                            layout
                            custom={i}
                            variants={card}
                            initial="hidden"
                            whileInView="visible"
                            exit="exit"
                            viewport={VIEWPORT}
                            className="project-card flex flex-col h-full bg-surface border border-line rounded-sharp overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-motion-safe duration-300 group"
                        >
                            <Link href={`/projects/${project.slug}`} className="aspect-[16/9] overflow-hidden relative bg-surface-alt block" data-cursor="View" aria-label={`View case study: ${project.title}`}>
                                {img ? (
                                    <ClipReveal className="absolute inset-0" delay={(i % 3) * 0.08}>
                                    <ViewTransition name={projectImageTransitionName(project.slug)} share="project-morph">
                                        <Image src={img}
                                             alt={project.title}
                                             fill
                                             sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                             className="project-image absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter,transform] duration-700" />
                                    </ViewTransition>
                                    </ClipReveal>
                                ) : (
                                    <div className="absolute inset-0 bg-brand-green/10 flex items-center justify-center">
                                        <Fingerprint className="w-16 h-16 text-brand-orange opacity-30" />
                                    </div>
                                )}
                                {/* Hover overlay */}
                                <span className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="translate-y-3 group-hover:translate-y-0 transition-transform duration-300 inline-flex items-center gap-2 px-5 py-2.5 bg-surface text-ink text-sm font-bold rounded-full shadow-lg">
                                        View case study <ArrowUpRight className="w-4 h-4" />
                                    </span>
                                </span>
                            </Link>
                            <div className="p-6 flex-grow flex flex-col">
                                {project.category && (
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">{project.category}</span>
                                    </div>
                                )}
                                <Link href={`/projects/${project.slug}`}>
                                    <h3 className="text-xl font-bold text-ink mb-4 group-hover:text-accent-green transition-colors">{project.title}</h3>
                                </Link>

                                {project.tech_stack && project.tech_stack.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-2 mb-6">
                                        {project.tech_stack?.slice(0, 3).map((tech: string, i: number) => (
                                            <span key={i} className="text-[10px] font-bold text-ink-muted bg-surface-2 px-2.5 py-1 rounded-full uppercase self-start">{tech}</span>
                                        ))}
                                        {project.tech_stack && project.tech_stack.length > 3 && (
                                            <span className="text-[10px] font-bold text-ink-muted bg-surface-2 px-2.5 py-1 rounded-full uppercase self-start">+{project.tech_stack.length - 3}</span>
                                        )}
                                    </div>
                                )}
                                <Link
                                    href={`/projects/${project.slug}`}
                                    className="mt-auto text-sm font-bold text-brand-orange flex items-center gap-2 group-hover:text-accent-green group-hover:gap-3 transition-[color,gap] w-fit"
                                >
                                    View Details <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </m.div>
                        );
                    })}

                    {regularProjects.length % 2 !== 0 && (
                    <m.div
                        key="cta"
                        layout
                        variants={card}
                        initial="hidden"
                        whileInView="visible"
                        exit="exit"
                        viewport={VIEWPORT}
                        className="project-card flex flex-col h-full bg-surface-alt border border-dashed border-line rounded-sharp overflow-hidden hover:border-brand-orange transition-colors hover:shadow-lg items-center justify-center text-center p-8"
                    >
                        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <Plus className="w-8 h-8 text-brand-orange" />
                        </div>
                        <h3 className="text-xl font-bold text-ink mb-3">Your Project Here</h3>
                        <p className="text-ink-muted text-sm leading-relaxed mb-6 flex-grow max-w-xs">
                            Currently accepting new freelance opportunities and full-time senior engineering roles. Let&apos;s build something phenomenal.
                        </p>
                        <Link href="/contact" className="px-6 py-2 bg-ink text-surface font-bold rounded-full hover:bg-brand-orange transition-colors">
                            Start a Conversation
                        </Link>
                    </m.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </m.section>
    </LayoutGroup>
    )}
    </>
  )
}
