"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Check, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAllCommentsAdmin, toggleCommentApproval, deleteComment } from '@/actions/interactions';

export default function CommentsManagementPage() {
    const [comments, setComments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("pending");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const fetchComments = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllCommentsAdmin();
            setComments(data || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Failed to fetch comments");
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Filter logic
    const filteredComments = comments.filter(comment => {
        if (statusFilter === "pending") return !comment.is_approved;
        if (statusFilter === "approved") return comment.is_approved;
        return true; // "all"
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredComments.length / ITEMS_PER_PAGE);
    const paginatedComments = React.useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredComments.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredComments, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await toggleCommentApproval(id, currentStatus);
            if (res.success) {
                toast.success(`Comment ${!currentStatus ? "approved" : "hidden"}`);
                fetchComments();
            } else {
                toast.error(res.error || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleDelete = (id: string) => {
        toast("Delete Comment?", {
            description: "Are you sure you want to permanently delete this comment?",
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        const res = await deleteComment(id);
                        if (res.success) {
                            toast.success("Comment deleted");
                            fetchComments();
                        } else {
                            toast.error(res.error || "Failed to delete comment");
                        }
                    } catch (error) {
                        toast.error("An error occurred");
                    }
                }
            },
            cancel: {
                label: "Cancel",
                onClick: () => {}
            }
        });
    };

    const pendingCount = comments.filter(c => !c.is_approved).length;
    const approvedCount = comments.filter(c => c.is_approved).length;

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6 md:space-y-8 pb-24">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                        <MessageSquare size={22} className="text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-none">Comments</h1>
                        <p className="text-sm text-slate-500 mt-1.5 font-medium">Moderate your blog discussions</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                    <div className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">{pendingCount} PENDING</span>
                    </div>
                </div>
            </div>

            {/* Status Tabs - Scrollable on mobile */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="flex items-center border-b border-slate-100 px-4 md:px-6 bg-slate-50/20 overflow-x-auto no-scrollbar">
                    <div className="flex items-center -mb-px whitespace-nowrap">
                        <button
                            onClick={() => setStatusFilter("pending")}
                            className={`px-4 py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                                statusFilter === "pending"
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            Pending Review 
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${statusFilter === "pending" ? "bg-indigo-100" : "bg-slate-100"}`}>
                                {pendingCount}
                            </span>
                        </button>
                        <button
                            onClick={() => setStatusFilter("approved")}
                            className={`px-4 py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                                statusFilter === "approved"
                                    ? "border-emerald-600 text-emerald-600"
                                    : "border-transparent text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            Approved
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${statusFilter === "approved" ? "bg-emerald-100" : "bg-slate-100"}`}>
                                {approvedCount}
                            </span>
                        </button>
                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-4 py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                                statusFilter === "all"
                                    ? "border-slate-900 text-slate-900"
                                    : "border-transparent text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            All Discussions
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${statusFilter === "all" ? "bg-slate-200 text-slate-700" : "bg-slate-100"}`}>
                                {comments.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    {isLoading ? (
                        <div className="p-6 space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 border border-slate-100 rounded-3xl bg-slate-50/30">
                                    <div className="flex gap-4 sm:w-1/4">
                                        <Skeleton className="w-12 h-12 rounded-2xl shrink-0 shadow-sm" />
                                        <div className="space-y-2 flex-grow">
                                            <Skeleton className="h-4 w-3/4 rounded-lg" />
                                            <Skeleton className="h-3 w-1/2 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="flex-grow space-y-3">
                                        <Skeleton className="h-3 w-1/5 rounded-md" />
                                        <Skeleton className="h-16 w-full rounded-2xl" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredComments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 py-20 px-8 text-center bg-slate-50/10">
                            <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                                <MessageSquare className="text-slate-200" size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">
                                {statusFilter === "pending" ? "Zero pending reviews" : "No comments found"}
                            </h3>
                            <p className="text-slate-400 text-sm mt-2 max-w-[280px] font-medium mx-auto">
                                {statusFilter === "pending" ? "The inbox is clear. You've moderated every single thought!" : "Try adjusting your filters to see more activity."}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {paginatedComments.map(comment => (
                                <div key={comment.id} className="p-5 md:p-8 flex flex-col lg:flex-row gap-6 lg:gap-10 hover:bg-slate-50/50 transition-all group">
                                    {/* Author & Context Info */}
                                    <div className="flex gap-4 lg:w-[220px] shrink-0 border-b lg:border-b-0 pb-4 lg:pb-0 border-slate-100 italic">
                                        <div className="w-12 h-12 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-center font-black text-indigo-600 shrink-0 uppercase shadow-sm group-hover:scale-105 transition-transform">
                                            {comment.author_name?.charAt(0) || "U"}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-bold text-[15px] text-slate-900 truncate leading-tight">{comment.author_name}</div>
                                            {comment.author_email && (
                                                <div className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">{comment.author_email}</div>
                                            )}
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-widest leading-none">
                                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Comment Text */}
                                    <div className="flex-grow space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${comment.is_approved ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]'}`} />
                                            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 min-w-0">
                                                ON: <span className="text-slate-800 truncate font-black tracking-tight">{comment.post?.title || "ARCHIVED POST"}</span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/50 p-4 md:p-5 rounded-2xl border border-slate-100 relative group-hover:bg-white transition-colors">
                                            <p className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-medium">{comment.content}</p>
                                        </div>
                                    </div>

                                    {/* Right Action Stack */}
                                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-center lg:justify-start gap-2 shrink-0 lg:w-[160px] pt-2 lg:pt-0">
                                        {comment.is_approved ? (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1 lg:w-full h-11 text-xs font-bold rounded-xl border-amber-200 text-amber-700 bg-amber-50/20 hover:bg-amber-50 transition-all active:scale-95 shadow-sm shadow-amber-500/5 group/btn"
                                                onClick={() => handleToggleStatus(comment.id, comment.is_approved)}
                                            >
                                                <X size={14} className="group-hover/btn:scale-125 transition-transform" /> Hide
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1 lg:w-full h-11 text-xs font-bold rounded-xl border-emerald-200 text-emerald-700 bg-emerald-50 border-2 hover:bg-emerald-100 transition-all active:scale-95 shadow-sm shadow-emerald-500/10 group/btn"
                                                onClick={() => handleToggleStatus(comment.id, comment.is_approved)}
                                            >
                                                <Check size={14} strokeWidth={3} className="group-hover/btn:scale-125 transition-transform" /> Approve
                                            </Button>
                                        )}
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="flex-1 lg:w-full h-11 text-xs font-bold rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group/btn"
                                            onClick={() => handleDelete(comment.id)}
                                        >
                                            <Trash2 size={14} className="group-hover/btn:scale-125 transition-transform" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer with Pagination */}
                {filteredComments.length > 0 && (
                    <div className="px-4 md:px-8 py-5 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="text-slate-900 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                                {Math.min(filteredComments.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}—{Math.min(filteredComments.length, currentPage * ITEMS_PER_PAGE)}
                            </span>
                            OF {filteredComments.length} CONTRIBUTIONS
                        </div>
                        
                        {totalPages > 1 && (
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="h-10 w-10 p-0 rounded-xl shadow-sm border-slate-200 transition-all hover:bg-white active:scale-90"
                                >
                                    <ChevronLeft size={18} />
                                </Button>
                                
                                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[150px] xs:max-w-none px-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        const isVisible = totalPages <= 5 || 
                                            page === 1 || 
                                            page === totalPages || 
                                            (page >= currentPage - 1 && page <= currentPage + 1);
                                        
                                        if (!isVisible) {
                                            if (page === 2 || page === totalPages - 1) {
                                                return <span key={page} className="text-slate-300 mx-0.5">.</span>;
                                            }
                                            return null;
                                        }

                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`min-w-[36px] h-10 px-3 text-[11px] font-black rounded-xl transition-all shadow-sm ${
                                                    currentPage === page 
                                                        ? "bg-slate-900 text-white shadow-slate-200 border-transparent" 
                                                        : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-10 w-10 p-0 rounded-xl shadow-sm border-slate-200 transition-all hover:bg-white active:scale-90"
                                >
                                    <ChevronRight size={18} />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

