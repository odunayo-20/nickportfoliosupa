"use client";
import { Calendar, ArrowRight, MailOpen } from 'lucide-react'
import { m, AnimatePresence } from 'motion/react'
import { fadeInUp, staggerContainerFast as staggerContainer } from '@/lib/motion'
import { SplitText } from '@/components/motion/SplitText'
import { ClipReveal } from '@/components/motion/ClipReveal'
import Image from 'next/image';
import Link from 'next/link'
import React, { useState, useMemo } from 'react'
import { formatDate, type PostSummary } from '@/types/content'



type Category = { id: string; name: string; slug: string };

interface BlogClientProps {
  posts: PostSummary[];
  categories: Category[];
}

export default function BlogClient({ posts, categories }: BlogClientProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const filteredPosts = useMemo(() => {
        if (activeCategory === "all") return posts;
        return posts.filter(p => p.category === activeCategory);
  }, [posts, activeCategory]);

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const otherPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <>
        <m.header 
            className="bg-surface-alt pt-24 pb-20 border-b border-line"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
        <div className="max-w-7xl mx-auto px-6 text-center">
            <m.span variants={fadeInUp} className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-6">
                <span className="w-4 h-[2px] bg-brand-orange"></span> My Technical Journal
            </m.span>
            <SplitText as="h1" immediate delay={0.2} className="text-5xl md:text-7xl font-extrabold tracking-tighter text-ink mb-6">
                Thoughts on <span className="text-brand-orange italic font-normal">architecture</span><br/> &amp; clean code.
            </SplitText>
            <m.p variants={fadeInUp} className="text-ink-muted text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                A collection of articles detailing my experiences with Java, Kotlin, React Native, and the realities of scaling systems for enterprise clients.
            </m.p>
            
            <m.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
                <button
                    onClick={() => { setActiveCategory("all"); setVisibleCount(6); }}
                    className={`px-6 py-2 text-sm font-bold rounded-full transition-all duration-200 ${
                        activeCategory === "all"
                            ? "bg-ink text-surface shadow-md"
                            : "bg-surface text-ink-muted border border-line hover:border-brand-orange hover:text-brand-orange"
                    }`}
                >
                    All Posts
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeCategory === "all" ? "bg-white/20 text-white" : "bg-surface-2 text-ink-muted"}`}>
                        {posts.length}
                    </span>
                </button>
                {categories.map(cat => {
                    const count = posts.filter(p => p.category === cat.name).length;
                    if (count === 0) return null;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.name); setVisibleCount(6); }}
                            className={`px-6 py-2 text-sm font-bold rounded-full transition-all duration-200 ${
                                activeCategory === cat.name
                                    ? "bg-ink text-surface shadow-md"
                                    : "bg-surface text-ink-muted border border-line hover:border-brand-orange hover:text-brand-orange"
                            }`}
                        >
                            {cat.name}
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat.name ? "bg-white/20 text-white" : "bg-surface-2 text-ink-muted"}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </m.div>
        </div>
    </m.header>

    <AnimatePresence mode="wait">
        <m.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="bg-surface pb-32"
        >
            <section className="py-12 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-ink-muted text-lg font-medium">No posts in this category yet.</p>
                        </div>
                    )}
                    
                    {featuredPost && (
                        <>
                            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tighter text-ink mb-6 sm:mb-10 border-b border-line pb-4">Featured Article</h2>
                            <Link href={`/blog/${featuredPost.slug}`} data-cursor="Read" className="group flex flex-col lg:grid lg:grid-cols-2 gap-0 lg:gap-10 items-stretch bg-surface border border-line rounded-sharp overflow-hidden hover:shadow-xl transition-shadow article-card block">
                                <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[380px] overflow-hidden bg-surface-alt relative flex-shrink-0">
                                    <ClipReveal className="absolute inset-0">
                                    <Image
                                        src={featuredPost.cover_image_url || featuredPost.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200"}
                                        fill
                                        alt={featuredPost.title}
                                        className="article-image absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                                    />
                                    </ClipReveal>
                                </div>
                                <div className="p-5 sm:p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6">
                                        {featuredPost.category && (
                                            <span className="text-[10px] sm:text-xs font-bold text-brand-dark bg-brand-orange px-3 py-1 rounded-full uppercase tracking-widest">{featuredPost.category}</span>
                                        )}
                                        <span className="text-xs sm:text-sm font-medium text-ink-muted flex items-center gap-1">
                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {formatDate(featuredPost.created_at, 'long')}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4 sm:mb-6 group-hover:text-accent-green transition-colors leading-tight">
                                        {featuredPost.title}
                                    </h3>
                                    <p className="text-ink-muted text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 line-clamp-3">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-accent-green font-bold group-hover:gap-4 transition-all text-sm sm:text-base">
                                        Read Full Article <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                            </Link>
                        </>
                    )}
                </div>
            </section>
 
            {otherPosts.length > 0 && (
                <section className="pb-16 sm:pb-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tighter text-ink mb-6 sm:mb-10 border-b border-line pb-4">Latest Posts</h2>
                        
                        <div className="glow-group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                            {otherPosts.slice(0, visibleCount).map((post, index) => (
                                <m.div variants={fadeInUp} key={post.id || index} initial="hidden" animate="visible" custom={index}>
                                    <Link href={`/blog/${post.slug}`} data-cursor="Read" className="glow-card article-card flex flex-col h-full bg-surface border border-line rounded-sharp overflow-hidden hover:shadow-xl transition-shadow group block">
                                        <div className="aspect-[4/3] overflow-hidden relative bg-surface-alt flex-shrink-0">
                                            <ClipReveal className="absolute inset-0" delay={(index % 3) * 0.08}>
                                            <Image
                                                src={post.cover_image_url || post.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"}
                                                fill
                                                alt={post.title}
                                                className="article-image absolute inset-0 w-full h-full object-cover transition-all duration-700"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                            </ClipReveal>
                                        </div>
                                        <div className="p-5 sm:p-6 flex-grow flex flex-col">
                                            <div className="flex items-center justify-between mb-3">
                                                {post.category ? (
                                                    <span className="text-[10px] font-bold text-accent-green border border-accent-green/20 px-2 py-1 rounded-full uppercase tracking-widest">{post.category}</span>
                                                ) : (
                                                    <span className="hidden" />
                                                )}
                                                <span className="text-xs font-medium text-ink-muted ml-auto">
                                                    {formatDate(post.created_at)}
                                                </span>
                                            </div>
                                            <h3 className="text-base sm:text-lg font-bold text-ink mb-3 group-hover:text-accent-green transition-colors leading-snug">{post.title}</h3>
                                            <p className="text-ink-muted text-sm leading-relaxed mb-5 flex-grow line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                            <div className="text-sm font-bold text-brand-orange flex items-center gap-2 mt-auto">
                                                Read More <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </Link>
                                </m.div>
                            ))}
                        </div>
                        
                        {visibleCount < otherPosts.length && (
                            <div className="mt-12 sm:mt-16 text-center">
                                <button 
                                    onClick={() => setVisibleCount(prev => prev + 6)}
                                    className="px-8 py-3 bg-surface-alt border border-line text-ink font-bold rounded-full hover:bg-brand-green hover:text-white hover:border-accent-green transition-all shadow-sm"
                                >
                                    Load More Articles
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </m.div>
    </AnimatePresence>

 
    </>
  )
}
