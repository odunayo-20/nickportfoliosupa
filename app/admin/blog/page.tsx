"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search, FileText, LayoutList, Newspaper } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { BlogTable } from "@/components/admin/blog/BlogTable";
import { DeleteConfirmModal } from "@/components/admin/blog/DeleteConfirmModal";
import { supabase } from "@/lib/supabaseClient";
import { deletePost, updatePost, getAllPosts } from "@/actions/blog";

export default function BlogManagementPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllPosts();
            setPosts(data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Failed to fetch posts");
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Filter logic
    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        return posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || post.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [posts, searchQuery, statusFilter]);

    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            await deletePost(postToDelete);
            toast.success("Post moved to trash");
            fetchPosts();
        } catch (error) {
            toast.error("Failed to delete post");
        } finally {
            setPostToDelete(null);
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "published" ? "draft" : "published";
        try {
            await updatePost(id, { status: newStatus });
            toast.success(`Post ${newStatus === "published" ? "published" : "reverted to draft"}`);
            fetchPosts();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    // Derived Stats
    const totalPosts = posts?.length || 0;
    const publishedPosts = posts?.filter(p => p.status === 'published').length || 0;
    const draftPosts = posts?.filter(p => p.status === 'draft').length || 0;

    return (
        <div className="max-w-6xl mx-auto px-6 py-8 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Newspaper size={20} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Posts</h1>
                        <p className="text-sm text-slate-500">Manage all your blog content</p>
                    </div>
                </div>
                <Link href="/admin/blog/create">
                    <Button className="gap-2 font-semibold shadow-sm">
                        <Plus size={16} strokeWidth={2.5} />
                        Add New Post
                    </Button>
                </Link>
            </div>

            {/* Status Tabs + Search */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                {/* Tab Filters */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4">
                    <div className="flex items-center -mb-px">
                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors ${
                                statusFilter === "all"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            All <span className="text-slate-400 ml-1 font-normal">({totalPosts})</span>
                        </button>
                        <button
                            onClick={() => setStatusFilter("published")}
                            className={`px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors ${
                                statusFilter === "published"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            Published <span className="text-slate-400 ml-1 font-normal">({publishedPosts})</span>
                        </button>
                        <button
                            onClick={() => setStatusFilter("draft")}
                            className={`px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors ${
                                statusFilter === "draft"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            Drafts <span className="text-slate-400 ml-1 font-normal">({draftPosts})</span>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative w-64 hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            className="w-full pl-8 pr-3 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Column Headers */}
                <div className="flex items-center gap-5 px-6 py-2.5 border-b border-slate-100 bg-slate-50/50">
                    <div className="w-[72px] shrink-0" />
                    <div className="flex-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Title
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-[300px]">
                    {isLoading ? (
                        <div className="p-6 space-y-3">
                            {[1,2,3,4,5].map(i => (
                                <div key={i} className="flex items-center gap-5 px-6 py-4">
                                    <Skeleton className="w-[72px] h-[72px] rounded-lg shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-3 w-1/2" />
                                        <Skeleton className="h-3 w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <FileText className="text-slate-400" size={28} />
                            </div>
                            <h3 className="text-base font-bold text-slate-800">
                                {searchQuery || statusFilter !== "all"
                                    ? "No matching posts"
                                    : "No posts yet"}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1 max-w-xs">
                                {searchQuery || statusFilter !== "all"
                                    ? "Try a different search term or filter."
                                    : "Create your first blog post to get started."}
                            </p>
                            {!searchQuery && statusFilter === "all" && (
                                <Link href="/admin/blog/create" className="mt-5">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Plus size={14} /> Write your first post
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <BlogTable
                            posts={filteredPosts}
                            onToggleStatus={toggleStatus}
                            onDeleteRequest={setPostToDelete}
                        />
                    )}
                </div>

                {/* Footer */}
                {posts && posts.length > 0 && (
                    <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <p className="text-[12px] text-slate-400 font-medium">
                            Showing {filteredPosts.length} of {totalPosts} posts
                        </p>
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                isOpen={!!postToDelete}
                onClose={() => setPostToDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}