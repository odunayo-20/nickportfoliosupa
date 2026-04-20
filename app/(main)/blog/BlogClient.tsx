"use client";
import { Calendar, ArrowRight, MailOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import React, { useState, useMemo } from 'react'

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

interface BlogClientProps {
  posts: any[];
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
        <motion.header 
            className="bg-brand-offwhite pt-24 pb-20 border-b border-gray-200"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
        <div className="max-w-7xl mx-auto px-6 text-center reveal">
            <motion.span variants={fadeInUp} className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-6">
                <span className="w-4 h-[2px] bg-brand-orange"></span> My Technical Journal
            </motion.span>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tighter text-brand-dark mb-6">
                Thoughts on <span className="text-brand-orange italic font-normal">architecture</span><br/> & clean code.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-brand-muted text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                A collection of articles detailing my experiences with Java, Kotlin, React Native, and the realities of scaling systems for enterprise clients.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
                <button
                    onClick={() => { setActiveCategory("all"); setVisibleCount(6); }}
                    className={`px-6 py-2 text-sm font-bold rounded-full transition-all duration-200 ${
                        activeCategory === "all"
                            ? "bg-brand-dark text-white shadow-md"
                            : "bg-white text-brand-muted border border-gray-200 hover:border-brand-orange hover:text-brand-orange"
                    }`}
                >
                    All Posts
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeCategory === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
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
            className="bg-brand-light pb-32"
        >
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 reveal">
                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-brand-muted text-lg font-medium">No posts in this category yet.</p>
                        </div>
                    )}
                    
                    {featuredPost && (
                        <>
                            <h2 className="text-2xl font-extrabold tracking-tighter text-brand-dark mb-10 border-b border-gray-200 pb-4">Featured Article</h2>
                            <Link href={`/blog/${featuredPost.slug}`} className="group grid lg:grid-cols-2 gap-10 items-center bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-all article-card block">
                                <div className="overflow-hidden bg-brand-offwhite h-full min-h-[350px] relative">
                                    <img src={featuredPost.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200"} 
                                        alt={featuredPost.title} 
                                        className="article-image absolute inset-0 w-full h-full object-cover grayscale" />
                                </div>
                                <div className="p-8 lg:p-12">
                                    <div className="flex items-center gap-4 mb-6">
                                        {featuredPost.category && (
                                            <span className="text-xs font-bold text-brand-dark bg-brand-orange px-3 py-1 rounded-full uppercase tracking-widest">{featuredPost.category}</span>
                                        )}
                                        <span className="text-sm font-medium text-brand-muted flex items-center gap-1">
                                            <Calendar className="w-4 h-4" /> 
                                            {new Date(featuredPost.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-dark mb-6 group-hover:text-brand-green transition-colors">
                                        {featuredPost.title}
                                    </h3>
                                    <p className="text-brand-muted text-lg leading-relaxed mb-8 line-clamp-3">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-brand-green font-bold group-hover:gap-4 transition-all">
                                        Read Full Article <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {otherPosts.length > 0 && (
                <section>
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl font-extrabold tracking-tighter text-brand-dark mb-10 border-b border-gray-200 pb-4">Latest Posts</h2>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {otherPosts.slice(0, visibleCount).map((post: any, index: number) => (
                                <motion.div variants={fadeInUp} key={post.id || index} initial="hidden" animate="visible" custom={index}>
                                    <Link href={`/blog/${post.slug}`} className="article-card flex flex-col h-full bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-all reveal group delay-100 block">
                                        <div className="aspect-[16/9] overflow-hidden relative bg-brand-offwhite">
                                            <img src={post.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"} 
                                                alt={post.title} 
                                                className="article-image absolute inset-0 w-full h-full object-cover grayscale" />
                                        </div>
                                        <div className="p-8 flex-grow flex flex-col">
                                            <div className="flex items-center justify-between mb-4">
                                                {post.category ? (
                                                    <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">{post.category}</span>
                                                ) : (
                                                    <span className="hidden"></span>
                                                )}
                                                <span className="text-xs font-medium text-brand-muted">
                                                    {new Date(post.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-green transition-colors">{post.title}</h3>
                                            <p className="text-brand-muted text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                            <div className="text-sm font-bold text-brand-orange flex items-center gap-2">
                                                Read More <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        
                        {visibleCount < otherPosts.length && (
                            <div className="mt-16 text-center reveal">
                                <button 
                                    onClick={() => setVisibleCount(prev => prev + 6)}
                                    className="px-8 py-3 bg-brand-offwhite border border-gray-200 text-brand-dark font-bold rounded-full hover:bg-brand-green hover:text-white hover:border-brand-green transition-all shadow-sm"
                                >
                                    Load More Articles
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </motion.div>
    </AnimatePresence>

    <motion.section 
        className="py-24 bg-brand-green text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <motion.div variants={fadeInUp} className="max-w-4xl mx-auto px-6 text-center reveal">
            <MailOpen className="w-12 h-12 text-brand-orange mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-6">Stay in the Loop</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
                Join 2,500+ other developers receiving my monthly insights on software architecture, Kotlin patterns, and scaling mobile apps.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input type="email" placeholder="Enter your email address" required 
                       className="flex-grow px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all" />
                <button type="submit" className="px-8 py-4 bg-brand-orange text-brand-dark font-bold rounded-full hover:bg-white transition-colors whitespace-nowrap shadow-lg">
                    Subscribe Now
                </button>
            </form>
            <p className="text-xs text-gray-400 mt-4">No spam. Unsubscribe at any time.</p>
        </motion.div>
    </motion.section>
    </>
  )
}
