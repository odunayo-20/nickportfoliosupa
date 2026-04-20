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
        <div className="max-w-6xl mx-auto px-6 py-8 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MessageSquare size={20} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Comments</h1>
                        <p className="text-sm text-slate-500">Moderate your blog discussions</p>
                    </div>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center border-b border-slate-100 px-4">
                    <div className="flex items-center -mb-px">
                        <button
                            onClick={() => setStatusFilter("pending")}
                            className={`px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors ${
                                statusFilter === "pending"
                                    ? "border-amber-500 text-amber-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            Pending Review <span className="text-slate-400 ml-1 font-normal">({pendingCount})</span>
                        </button>
                        <button
                            onClick={() => setStatusFilter("approved")}
                            className={`px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors ${
                                statusFilter === "approved"
                                    ? "border-green-500 text-green-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            Approved <span className="text-slate-400 ml-1 font-normal">({approvedCount})</span>
                        </button>
                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors ${
                                statusFilter === "all"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            All Comments <span className="text-slate-400 ml-1 font-normal">({comments.length})</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-[300px]">
                    {isLoading ? (
                        <div className="p-6 space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-4 p-4 border rounded-lg">
                                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                    <div className="space-y-2 flex-grow">
                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-3 w-1/5" />
                                        <Skeleton className="h-10 w-full mt-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredComments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="text-slate-400" size={28} />
                            </div>
                            <h3 className="text-base font-bold text-slate-800">
                                {statusFilter === "pending" ? "No pending comments" : "No comments found"}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                {statusFilter === "pending" ? "You're all caught up!" : ""}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {paginatedComments.map(comment => (
                                <div key={comment.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-slate-50/50 transition-colors">
                                    {/* Author Info */}
                                    <div className="flex gap-4 md:w-1/4 shrink-0">
                                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 shrink-0 uppercase">
                                            {comment.author_name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-slate-900">{comment.author_name}</div>
                                            {comment.author_email && (
                                                <div className="text-xs text-slate-500 truncate max-w-[150px]">{comment.author_email}</div>
                                            )}
                                            <div className="text-[11px] font-medium text-slate-400 mt-1">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-grow">
                                        <div className="text-xs font-semibold text-primary/70 mb-2 flex items-center gap-1">
                                            On Post: <span className="text-slate-700">{comment.post?.title || "Unknown Post"}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{comment.content}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
                                        {comment.is_approved ? (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full text-amber-600 border-amber-200 hover:bg-amber-50 gap-1.5"
                                                onClick={() => handleToggleStatus(comment.id, comment.is_approved)}
                                            >
                                                <X size={14} /> Hide Comment
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full text-green-600 border-green-200 hover:bg-green-50 gap-1.5 bg-green-50/50"
                                                onClick={() => handleToggleStatus(comment.id, comment.is_approved)}
                                            >
                                                <Check size={14} /> Approve
                                            </Button>
                                        )}
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="w-full text-slate-400 hover:text-red-600 hover:bg-red-50 gap-1.5"
                                            onClick={() => handleDelete(comment.id)}
                                        >
                                            <Trash2 size={14} /> Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer with Pagination */}
                {filteredComments.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-xl">
                        <p className="text-[12px] text-slate-500 font-medium">
                            Showing <span className="font-bold text-slate-900">{Math.min(filteredComments.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}</span> to <span className="font-bold text-slate-900">{Math.min(filteredComments.length, currentPage * ITEMS_PER_PAGE)}</span> of <span className="font-bold text-slate-900">{filteredComments.length}</span> comments
                        </p>
                        
                        {totalPages > 1 && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft size={16} />
                                </Button>
                                
                                <div className="flex items-center gap-1 mx-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        const isVisible = totalPages <= 7 || 
                                            page === 1 || 
                                            page === totalPages || 
                                            (page >= currentPage - 1 && page <= currentPage + 1);
                                        
                                        if (!isVisible) {
                                            if (page === 2 || page === totalPages - 1) {
                                                return <span key={page} className="text-slate-300 px-1">...</span>;
                                            }
                                            return null;
                                        }

                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`min-w-[32px] h-8 px-2 text-[12px] font-bold rounded-lg transition-all ${
                                                    currentPage === page 
                                                        ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                                                        : "text-slate-500 hover:bg-slate-100"
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
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
