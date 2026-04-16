"use client";

import React from "react";
import Link from "next/link";
import { Image as ImageIcon, Pencil, Trash2, Eye, Calendar, Tag } from "lucide-react";

type BlogPostWithImage = any;

interface BlogTableProps {
    posts: BlogPostWithImage[];
    onToggleStatus: (id: string, status: string) => void;
    onDeleteRequest: (id: string) => void;
}

export function BlogTable({ posts, onToggleStatus, onDeleteRequest }: BlogTableProps) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="divide-y divide-slate-100">
            {posts.map((post) => {
                const dateStr = isMounted ? new Date(post.created_at || post.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                }) : "";
                const isPublished = post.status === "published";

                return (
                    <div 
                        key={post.id} 
                        className="group flex items-start gap-5 px-6 py-4 hover:bg-slate-50/80 transition-colors"
                    >
                        {/* Thumbnail */}
                        <div className="w-[72px] h-[72px] rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center mt-0.5">
                            {post.imageUrl ? (
                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={24} className="text-slate-300" />
                            )}
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Title Row */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <Link 
                                        href={`/admin/blog/edit/${post.id}`}
                                        className="text-[15px] font-bold text-slate-900 hover:text-primary transition-colors line-clamp-1 block"
                                    >
                                        {post.title}
                                    </Link>
                                    {post.excerpt && (
                                        <p className="text-[13px] text-slate-500 mt-0.5 line-clamp-1 max-w-xl">
                                            {post.excerpt}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Meta Row */}
                            <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                                {/* Status */}
                                <button
                                    onClick={() => onToggleStatus(post.id, post.status)}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                                        isPublished
                                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                    }`}
                                    title={`Click to ${isPublished ? "unpublish" : "publish"}`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
                                    {isPublished ? "Published" : "Draft"}
                                </button>

                                {/* Date */}
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                    <Calendar size={11} /> {dateStr}
                                </span>

                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                        <Tag size={11} />
                                        {post.tags.slice(0, 3).join(", ")}
                                        {post.tags.length > 3 && `, +${post.tags.length - 3}`}
                                    </span>
                                )}

                                {/* Inline Actions — WP style row actions */}
                                <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link 
                                        href={`/admin/blog/${post.id}`}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-primary px-1.5 py-0.5 rounded hover:bg-primary/5 transition-colors"
                                    >
                                        <Eye size={12} /> View
                                    </Link>
                                    <span className="text-slate-200">|</span>
                                    <Link 
                                        href={`/admin/blog/edit/${post.id}`}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-primary px-1.5 py-0.5 rounded hover:bg-primary/5 transition-colors"
                                    >
                                        <Pencil size={12} /> Edit
                                    </Link>
                                    <span className="text-slate-200">|</span>
                                    <button
                                        onClick={() => onDeleteRequest(post.id)}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={12} /> Trash
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
