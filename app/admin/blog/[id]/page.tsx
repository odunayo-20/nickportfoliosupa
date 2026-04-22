"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Edit,
    ExternalLink,
    Eye,
    Globe,
    Lock,
    Tag,
    Trash2,
    Image as ImageIcon,
    FileText,
    Copy,
    CheckCircle,
    CircleDashed,
    Loader2
} from "lucide-react";
import { DeleteConfirmModal } from "@/components/admin/blog/DeleteConfirmModal";
import { getPostById, updatePost, deletePost as deletePostAction } from "@/actions/blog";
import Image from "next/image";

export default function BlogShowPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [post, setPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [slugCopied, setSlugCopied] = useState(false);

    const fetchPost = useCallback(async () => {
        setIsLoading(true);
        const data = await getPostById(id);
        setPost(data);
        setIsLoading(false);
    }, [id]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-6 py-10">
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-8 space-y-6">
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                    <div className="col-span-4 space-y-6">
                        <Skeleton className="h-48 w-full rounded-xl" />
                        <Skeleton className="h-48 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <FileText size={32} className="text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Post not found</h2>
                <p className="text-slate-500 text-sm mt-1 mb-6">This post may have been deleted or doesn't exist.</p>
                <Link href="/admin/blog">
                    <Button variant="outline" className="gap-2"><ArrowLeft size={14} /> Back to Posts</Button>
                </Link>
            </div>
        );
    }

    const isPublished = post.status === "published";
    const createdDate = new Date(post.created_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    const updatedDate = new Date(post.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const publishedDate = post.published_at
        ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : null;

    const toggleStatus = async () => {
        const newStatus = isPublished ? "draft" : "published";
        try {
            await updatePost(post.id, { status: newStatus });
            toast.success(isPublished ? "Reverted to draft" : "Post published!");
            fetchPost();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async () => {
        try {
            await deletePostAction(post.id);
            toast.success("Post deleted");
            router.push("/admin/blog");
        } catch {
            toast.error("Failed to delete post");
        }
    };

    const copySlug = () => {
        const url = `${window.location.origin}/blog/${post.slug}`;
        navigator.clipboard.writeText(url);
        setSlugCopied(true);
        setTimeout(() => setSlugCopied(false), 2000);
    };

    const renderContent = (content: string) => {
        // If content is HTML (from TinyMCE), inject it safely
        if (content.trim().startsWith("<")) {
            return <div className="prose prose-slate max-w-none prose-img:rounded-xl prose-pre:bg-slate-900 prose-pre:text-slate-100" dangerouslySetInnerHTML={{ __html: content }} />;
        }

        // Fallback for simple markdown
        return content.split("\n").map((line, i) => {
            if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-bold text-slate-800 mt-6 mb-2">{line.slice(4)}</h3>;
            if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-slate-800 mt-8 mb-3">{line.slice(3)}</h2>;
            if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-3">{line.slice(2)}</h1>;
            if (line.startsWith("- ")) return <li key={i} className="text-slate-700 leading-relaxed ml-4 list-disc">{line.slice(2)}</li>;
            if (line.match(/^\d+\. /)) return <li key={i} className="text-slate-700 leading-relaxed ml-4 list-decimal">{line.replace(/^\d+\. /, "")}</li>;
            if (line.trim() === "") return <br key={i} />;
            let html = line
                .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                .replace(/_(.+?)_/g, "<em>$1</em>");
            return <p key={i} className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
        });
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Link href="/admin/blog">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-slate-500 hover:text-slate-800">
                            <ArrowLeft size={15} /> Posts
                        </Button>
                    </Link>
                    <div className="w-px h-5 bg-slate-200" />
                    <span className="text-sm text-slate-400 font-medium truncate max-w-[200px]">{post.title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/blog/edit/${post.id}`}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <Edit size={14} /> Edit
                        </Button>
                    </Link>
                    <Button
                        variant={isPublished ? "outline" : "default"}
                        size="sm"
                        className="gap-1.5"
                        onClick={toggleStatus}
                    >
                        {isPublished ? <><CircleDashed size={14} /> Unpublish</> : <><CheckCircle size={14} /> Publish</>}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => {
                        toast(`Delete "${post.title}"?`, {
                            description: "This action cannot be undone.",
                            action: {
                                label: "Delete",
                                onClick: handleDelete
                            }
                        });
                    }}>
                        <Trash2 size={14} />
                    </Button>
                </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-12 gap-8">
                {/* Article Content */}
                <article className="col-span-12 lg:col-span-8">
                    {/* Featured Image */}
                    {post.image_url ? (
                        <div className="aspect-[2/1] rounded-xl overflow-hidden mb-8 bg-slate-100 border">
                            <Image src={post.image_url} alt={post.title} className="w-full h-full object-cover" width={1200} height={630} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                        </div>
                    ) : (
                        <div className="aspect-[3/1] rounded-xl mb-8 bg-gradient-to-br from-slate-100 to-slate-50 border border-dashed border-slate-200 flex items-center justify-center">
                            <div className="text-center">
                                <ImageIcon size={36} className="text-slate-300 mx-auto mb-2" />
                                <p className="text-xs text-slate-400 font-medium">No featured image</p>
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                        {post.title}
                    </h1>

                    {/* Meta bar */}
                    <div className="flex items-center gap-4 flex-wrap text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100">
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-slate-400" /> {createdDate}
                        </span>
                        {post.category && (
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold text-slate-600">
                                {post.category}
                            </span>
                        )}
                        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold ${isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
                            {isPublished ? "Published" : "Draft"}
                        </span>
                    </div>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <div className="mb-8 p-5 bg-slate-50 border-l-4 border-primary/30 rounded-r-lg">
                            <p className="text-[15px] text-slate-600 italic leading-relaxed">{post.excerpt}</p>
                        </div>
                    )}

                    {/* Content */}
                    <div className="mb-12">
                        {renderContent(post.content)}
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="col-span-12 lg:col-span-4 space-y-5">
                    {/* Status Card */}
                    <div className="bg-white rounded-xl border p-5 space-y-4 shadow-sm">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
                                <span className="text-sm font-semibold text-slate-700">{isPublished ? "Published" : "Draft"}</span>
                            </div>
                            <button onClick={toggleStatus} className="text-xs font-semibold text-primary hover:underline">
                                {isPublished ? "Switch to Draft" : "Publish Now"}
                            </button>
                        </div>
                        {post.visibility && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                {post.visibility === "public" ? <Globe size={14} /> : <Lock size={14} />}
                                <span className="capitalize">{post.visibility}</span>
                            </div>
                        )}
                    </div>

                    {/* Details Card */}
                    <div className="bg-white rounded-xl border p-5 space-y-4 shadow-sm">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-start justify-between text-sm">
                                <span className="text-slate-500 flex items-center gap-1.5"><Calendar size={13} /> Created</span>
                                <span className="text-slate-700 font-medium text-right text-xs">{createdDate}</span>
                            </div>
                            <div className="flex items-start justify-between text-sm">
                                <span className="text-slate-500 flex items-center gap-1.5"><Clock size={13} /> Updated</span>
                                <span className="text-slate-700 font-medium text-right text-xs">{updatedDate}</span>
                            </div>
                            {publishedDate && (
                                <div className="flex items-start justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-1.5"><Eye size={13} /> Published</span>
                                    <span className="text-slate-700 font-medium text-right text-xs">{publishedDate}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Permalink Card */}
                    <div className="bg-white rounded-xl border p-5 space-y-3 shadow-sm">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Permalink</h3>
                        <div className="flex items-center gap-2 bg-slate-50 border rounded-lg p-2.5">
                            <code className="text-xs text-slate-600 truncate flex-1">/blog/{post.slug}</code>
                            <button
                                onClick={copySlug}
                                className="p-1 rounded hover:bg-slate-200 transition-colors text-slate-500 flex-shrink-0"
                                title="Copy URL"
                            >
                                {slugCopied ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Tags Card */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="bg-white rounded-xl border p-5 space-y-3 shadow-sm">
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag: string) => (
                                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                                        <Tag size={10} /> {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SEO Card */}
                    {post.seo && (post.seo.metaTitle || post.seo.metaDescription) && (
                        <div className="bg-white rounded-xl border p-5 space-y-3 shadow-sm">
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">SEO Preview</h3>
                            <div className="bg-slate-50 rounded-lg p-4 space-y-1 border">
                                <p className="text-sm font-semibold text-blue-700 line-clamp-1">
                                    {post.seo.metaTitle || post.title}
                                </p>
                                <p className="text-xs text-emerald-700 truncate">/blog/{post.slug}</p>
                                <p className="text-xs text-slate-500 line-clamp-2">
                                    {post.seo.metaDescription || post.excerpt || "No description."}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl border p-5 space-y-3 shadow-sm">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Actions</h3>
                        <div className="space-y-2">
                            <Link href={`/admin/blog/edit/${post.id}`} className="block">
                                <Button variant="outline" className="w-full justify-start gap-2 text-sm px-4 py-3 h-auto font-bold rounded-xl" size="sm">
                                    <Edit size={14} /> Edit Post
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 px-4 py-3 h-auto font-bold rounded-xl"
                                size="sm"
                                onClick={() => {
                                    toast(`Delete "${post.title}"?`, {
                                        description: "This action cannot be undone.",
                                        action: {
                                            label: "Delete",
                                            onClick: handleDelete
                                        }
                                    });
                                }}
                            >
                                <Trash2 size={14} /> Delete Post
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>

        </div>
    );
}
