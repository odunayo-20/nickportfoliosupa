"use client";
import { ArrowLeft, Clock, Calendar, Copy, Link as LinkIcon, ArrowRight, MailOpen, ThumbsUp, MessageSquare, Send } from 'lucide-react'
import { motion, Variants } from 'motion/react'
import Link from 'next/link'
import { useState, useTransition, useRef } from 'react'
import { likePost, addComment, unlikePost } from '@/actions/interactions'
import { toast } from 'sonner'
import Image from 'next/image';

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

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12.5 3 11c-1.2.6-2.5.5-3.5-.5 1-1.3 2.8-1.5 4-1.5-1-1.5-1.5-3.5-.5-5 1.5 2 3.5 3.5 6 4-.5-3.5 4-5.5 6.5-3 1.5-.5 3-1.5 4-2.5-1 1.5-2.5 3-4 3.5z"></path>
  </svg>
)

export default function BlogPostClient({ 
  post, 
  relatedPosts = [], 
  initialComments = [],
  initialLikes = { count: 0, hasLiked: false }
}: { 
  post: any, 
  relatedPosts?: any[],
  initialComments?: any[],
  initialLikes?: { count: number, hasLiked: boolean }
}) {
  if (!post) {
      return (
          <div className="pt-32 pb-20 text-center">
              <h1 className="text-2xl font-bold text-brand-dark mb-4">Post not found</h1>
              <Link href="/blog" className="text-brand-orange inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Blog
              </Link>
          </div>
      );
  }

  // Calculate read time (naive approach: 200 words per minute)
  const calculateReadTime = (htmlContent: string) => {
    if (!htmlContent) return 1;
    const text = htmlContent.replace(/<[^>]*>?/gm, '');
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const readTime = calculateReadTime(post.content || "");

  const [likes, setLikes] = useState(initialLikes.count);
  const [hasLiked, setHasLiked] = useState(initialLikes.hasLiked);
  const [isLiking, startLiking] = useTransition();

  const [comments, setComments] = useState(initialComments);
  const [isCommenting, startCommenting] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [commentError, setCommentError] = useState("");

  const handleLike = () => {
      if (isLiking) return;
      
      const isUnliking = hasLiked;

      // Optimistic update
      setLikes(prev => isUnliking ? prev - 1 : prev + 1);
      setHasLiked(!isUnliking);
      
      startLiking(async () => {
          if (isUnliking) {
              const res = await unlikePost(post.id);
              if (!res.success) {
                  // Revert on error
                  setLikes(prev => prev + 1);
                  setHasLiked(true);
                  toast.error(res.error || "Failed to unlike post");
              }
          } else {
              const res = await likePost(post.id);
              if (!res.success && res.message !== "Already liked") {
                  // Revert on error
                  setLikes(prev => prev - 1);
                  setHasLiked(false);
                  toast.error(res.error || "Failed to like post");
              }
          }
      });
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setCommentError("");
      const formData = new FormData(e.currentTarget);
      
      const name = formData.get("name") as string;
      const content = formData.get("content") as string;
      
      if (!name.trim() || !content.trim()) {
          setCommentError("Name and comment are required.");
          return;
      }

      startCommenting(async () => {
          const res = await addComment(post.id, formData);
          if (res.success) {
              toast.success(res.message || "Comment submitted successfully.");
              formRef.current?.reset();
          } else {
              setCommentError(res.error || "Failed to post comment");
          }
      });
  };

  return (
    <>
    <motion.header 
        className="pt-20 pb-12 bg-brand-light"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
    >
        <motion.div variants={fadeInUp} className="max-w-4xl mx-auto px-6 reveal">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-brand-orange transition-colors mb-10">
                <ArrowLeft className="w-4 h-4" /> Back to Journal
            </Link>
            
            <div className="flex items-center gap-4 mb-6 flex-wrap">
                {post.category && (
                    <span className="text-xs font-bold text-brand-dark bg-brand-orange px-3 py-1 rounded-full uppercase tracking-widest">{post.category}</span>
                )}
                <span className="text-sm font-medium text-brand-muted flex items-center gap-1 ml-auto"><Clock className="w-4 h-4" /> {readTime} min read</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-brand-dark leading-[1.1] mb-8">
                {post.title}
            </h1>
            
            <div className="flex items-center justify-between py-6 border-y border-gray-100 border">
                <div className="flex items-center gap-4">
                    <Image src={post.author?.avatar_url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=150"} alt={post.author?.name || "Author"}
                    width={150}
                    height={150}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-green/10" />
                    <div>
                        <div className="font-bold text-brand-dark">{post.author?.name || "Nikola"}</div>
                        <div className="text-sm text-brand-muted">{post.author?.role || "Senior App Developer"}</div>
                    </div>
                </div>
                <div className="text-sm font-medium text-brand-muted flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Published {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>
        </motion.div>
    </motion.header>

    {post.image_url && (
        <motion.div 
            className="max-w-6xl mx-auto px-6 mb-16 reveal"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
        >
            <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-brand-offwhite rounded-sharp overflow-hidden border border-gray-100">
                <Image src={post.image_url} 
                     alt={post.title} 
                     fill
                     className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
        </motion.div>
    )}

    <motion.article 
        className="max-w-3xl mx-auto px-6 pb-20 reveal article-body prose prose-lg prose-slate"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
    >
        <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />

        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 not-prose">
            <div className="flex gap-2">
                {post.category && (
                    <span className="text-xs font-bold text-brand-muted bg-brand-offwhite px-3 py-1 rounded-full">#{post.category.toLowerCase()}</span>
                )}
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-brand-dark uppercase tracking-widest">Share:</span>
                <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')} className="w-10 h-10 rounded-full bg-brand-offwhite flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all text-brand-muted">
                    <TwitterIcon className="w-4 h-4" />
                </button>
                <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')} className="w-10 h-10 rounded-full bg-brand-offwhite flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all text-brand-muted">
                    <LinkedinIcon className="w-4 h-4" />
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }} className="w-10 h-10 rounded-full bg-brand-offwhite flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all text-brand-muted">
                    <LinkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    </motion.article>

    <motion.div 
        className="max-w-3xl mx-auto px-6 mb-16 reveal"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
    >
        <div className="flex items-center gap-6 py-6 border-b border-gray-200">
            <button 
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${hasLiked ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-offwhite text-brand-dark hover:bg-gray-100'}`}
            >
                <ThumbsUp className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} /> 
                {hasLiked ? 'Liked' : 'Like'} ({likes})
            </button>
            <div className="flex items-center gap-2 text-brand-muted font-bold">
                <MessageSquare className="w-5 h-5" /> {comments.length} Comments
            </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-brand-dark mb-8">Discussion</h3>
            
            {/* Comment Form */}
            <form ref={formRef} onSubmit={handleCommentSubmit} className="mb-12 bg-brand-offwhite p-6 md:p-8 rounded-sharp border border-gray-100">
                <h4 className="text-lg font-bold text-brand-dark mb-6">Leave a comment</h4>
                {commentError && <p className="text-red-500 text-sm mb-4 font-bold">{commentError}</p>}
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-bold text-brand-dark mb-2">Name *</label>
                        <input type="text" name="name" required disabled={isCommenting} className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-brand-orange bg-white disabled:opacity-50" placeholder="Your name" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-brand-dark mb-2">Email (optional)</label>
                        <input type="email" name="email" disabled={isCommenting} className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-brand-orange bg-white disabled:opacity-50" placeholder="Your email (will not be published)" />
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-bold text-brand-dark mb-2">Comment *</label>
                    <textarea name="content" required disabled={isCommenting} rows={4} className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:border-brand-orange bg-white resize-none disabled:opacity-50" placeholder="Join the discussion..."></textarea>
                </div>
                <button type="submit" disabled={isCommenting} className="flex items-center gap-2 px-8 py-3 bg-brand-dark text-white font-bold rounded-full hover:bg-brand-orange transition-colors disabled:opacity-75 shadow-sm">
                    {isCommenting ? 'Posting...' : <><Send className="w-4 h-4" /> Post Comment</>}
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-8">
                {comments.length > 0 ? comments.map((comment, i) => (
                    <div key={comment.id || i} className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-brand-muted shrink-0 text-xl overflow-hidden uppercase">
                            {comment.author_name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-baseline gap-2 mb-2">
                                <h5 className="font-bold text-brand-dark">{comment.author_name}</h5>
                                <span className="text-xs text-brand-muted">{new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <p className="text-brand-muted leading-relaxed">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                )) : (
                    <p className="text-brand-muted italic py-6">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    </motion.div>

    <motion.section 
        className="max-w-3xl mx-auto px-6 mb-24 reveal"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
    >
        <div className="bg-[#f0f4f1] border border-brand-green/10 p-8 md:p-10 rounded-sharp flex flex-col md:flex-row gap-8 items-center md:items-start">
            <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200" alt="Nikola" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm shrink-0" />
            <div>
                <h4 className="text-xl font-extrabold text-brand-dark mb-2">Written by Nikola.</h4>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                    Senior App Developer based in Nigeria. I specialize in building high-performance native architectures and solving complex engineering bottlenecks for global startups and enterprises.
                </p>
                <Link href="/about" className="inline-flex items-center gap-2 text-sm font-bold text-brand-green hover:text-brand-orange transition-colors">
                    More about me <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    </motion.section>

    {relatedPosts && relatedPosts.length > 0 && (
    <motion.section 
        className="py-24 bg-brand-offwhite border-t border-gray-200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
    >
        <div className="max-w-7xl mx-auto px-6">
            <motion.div variants={fadeInUp} className="flex justify-between items-end mb-10 reveal">
                <h2 className="text-3xl font-extrabold tracking-tighter text-brand-dark">Keep Reading</h2>
                <Link href="/blog" className="text-sm font-bold text-brand-orange flex items-center gap-2 hover:gap-3 transition-all">
                    View all posts <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8 reveal">
                {relatedPosts.slice(0, 2).map((relPost: any) => (
                    <Link href={`/blog/${relPost.slug}`} key={relPost.id} className="flex flex-col bg-white border border-gray-100 rounded-sharp overflow-hidden hover:shadow-xl transition-all group">
                        <div className="aspect-[16/9] overflow-hidden relative bg-brand-offwhite">
                            <Image src={relPost.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"} fill alt={relPost.title} className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="p-8 flex-grow flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                {relPost.category && (
                                    <span className="text-[10px] font-bold text-brand-green border border-brand-green/20 px-2 py-1 rounded-full uppercase tracking-widest">{relPost.category}</span>
                                )}
                                <span className="text-xs font-medium text-brand-muted">{new Date(relPost.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-green transition-colors">{relPost.title}</h3>
                            <p className="text-brand-muted text-sm leading-relaxed flex-grow line-clamp-3">
                                {relPost.excerpt}
                            </p>
                        </div>
                    </Link>
                ))}
            </motion.div>
        </div>
    </motion.section>
    )}

    <motion.section 
        className="py-24 bg-brand-green text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
    >
        <div className="max-w-4xl mx-auto px-6 text-center reveal">
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
        </div>
    </motion.section>
    </>
  )
}
