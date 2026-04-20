"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getNewsletterCampaigns, deleteNewsletterCampaign, NewsletterCampaign } from "../actions";
import { Button } from "@/components/ui/button";
import { 
    ChevronLeft, 
    Trash2, 
    Calendar, 
    Users, 
    Eye,
    Mail,
    Loader2,
    RefreshCw,
    ChevronRight
} from "lucide-react";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle,
    CardDescription 
} from "@/components/ui/card";
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "sonner";

export default function NewsletterHistoryPage() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const totalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE);
    const paginatedCampaigns = React.useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return campaigns.slice(start, start + ITEMS_PER_PAGE);
    }, [campaigns, currentPage]);

    const fetchCampaigns = async () => {
        setIsLoading(true);
        const data = await getNewsletterCampaigns();
        setCampaigns(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleDelete = (id: string) => {
        toast("Delete Campaign Record?", {
            description: "This will remove the analytics record but won't undo actual email delivery.",
            action: {
                label: "Delete",
                onClick: async () => {
                    setIsDeleting(id);
                    const result = await deleteNewsletterCampaign(id);
                    if (result.success) {
                        toast.success("Campaign record deleted.");
                        setCampaigns(prev => prev.filter(c => c.id !== id));
                        if (paginatedCampaigns.length === 1 && currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                        }
                    } else {
                        toast.error(result.error || "Failed to delete.");
                    }
                    setIsDeleting(null);
                }
            },
            cancel: {
                label: "Cancel",
                onClick: () => {}
            }
        });
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 w-full space-y-8 animate-in fade-in duration-500 pb-24 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.push("/admin/newsletter")}
                        className="rounded-full hover:bg-slate-100 transition-colors shrink-0"
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">Broadcasts</h1>
                        <p className="text-[13px] sm:text-sm text-slate-500 font-medium truncate sm:whitespace-normal">Review your previous campaigns</p>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    onClick={fetchCampaigns} 
                    disabled={isLoading}
                    className="h-11 rounded-xl font-bold border-slate-200 px-6 shadow-sm active:scale-95 transition-all w-full sm:w-auto"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                    Sync List
                </Button>
            </div>

            {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl border-4 border-slate-100 border-t-slate-900 animate-spin" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Loading history...</p>
                </div>
            ) : campaigns.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[2.5rem] gap-6 p-8 text-center shadow-xl shadow-slate-200/20">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                        <Mail size={40} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900">Silent Waves</h3>
                        <p className="text-sm text-slate-400 font-medium max-w-[240px] mx-auto leading-relaxed">Your broadcast history is empty. Start a conversation with your audience.</p>
                    </div>
                    <Button 
                        onClick={() => router.push("/admin/newsletter/compose")} 
                        className="h-12 px-8 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
                    >
                        Draft First Email
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:gap-6">
                    {paginatedCampaigns.map((campaign) => (
                        <Card key={campaign.id} className="overflow-hidden border-slate-100 border shadow-sm group hover:border-slate-300 transition-all hover:shadow-xl hover:shadow-slate-200/30 rounded-[1.5rem] sm:rounded-[2rem] bg-white">
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8">
                                <div className="space-y-2 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 truncate leading-tight">
                                            {campaign.subject}
                                        </CardTitle>
                                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                            {campaign.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-tight">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-300" />
                                            {isMounted ? format(new Date(campaign.created_at), "MMM d, yyyy") : "..."}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-slate-300" />
                                            {campaign.recipient_count} SHIPPED
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 sm:pt-0">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                                <Eye size={18} />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-[95vw] sm:max-w-[80vw] max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl">
                                            <DialogHeader className="p-4 sm:p-6 pb-0">
                                                <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{campaign.subject}</DialogTitle>
                                                <DialogDescription className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest pt-2">
                                                    Shipped {isMounted ? format(new Date(campaign.created_at), "PPP") : "..."} • {campaign.recipient_count} Recipients
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="mt-6 border border-slate-50 rounded-2xl sm:rounded-[2rem] p-5 sm:p-10 bg-slate-50/30 prose prose-slate max-w-none shadow-inner overflow-x-hidden">
                                                <div 
                                                    className="text-slate-700 leading-relaxed break-words"
                                                    dangerouslySetInnerHTML={{ __html: campaign.content }} 
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDelete(campaign.id)}
                                        disabled={isDeleting === campaign.id}
                                        className="h-11 w-11 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                                    >
                                        {isDeleting === campaign.id ? (
                                            <Loader2 size={18} className="animate-spin text-rose-500" />
                                        ) : (
                                            <Trash2 size={18} />
                                        )}
                                    </Button>
                                    
                                    <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 sm:hidden">
                                         <ChevronRight size={18} />
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination Footer */}
            {!isLoading && campaigns.length > 0 && (
                <div className="px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-100 bg-white shadow-xl shadow-slate-200/20 rounded-[2rem] mt-8">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="bg-slate-900 text-white px-2.5 py-1 rounded-lg leading-none shadow-lg">
                             {Math.min(campaigns.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}—{Math.min(campaigns.length, currentPage * ITEMS_PER_PAGE)}
                        </span>
                        OF {campaigns.length} BROADCASTS
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-11 w-11 p-0 rounded-xl border-slate-200 hover:bg-slate-50 active:scale-90 transition-all shadow-sm"
                            >
                                <ChevronLeft size={18} />
                            </Button>

                            <div className="flex items-center gap-1.5 mx-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    const isVisible = totalPages <= 5 || 
                                        page === 1 || 
                                        page === totalPages || 
                                        (page >= currentPage - 1 && page <= currentPage + 1);
                                    
                                    if (!isVisible) {
                                        if (page === 2 || page === totalPages - 1) {
                                            return <span key={page} className="text-slate-200 font-black">.</span>;
                                        }
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`min-w-[40px] h-11 px-3 text-[11px] font-black rounded-xl transition-all shadow-sm ${
                                                currentPage === page 
                                                    ? "bg-slate-900 text-white shadow-slate-300 transform scale-105" 
                                                    : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100 hover:text-slate-800"
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
                                className="h-11 w-11 p-0 rounded-xl border-slate-200 hover:bg-slate-50 active:scale-90 transition-all shadow-sm"
                            >
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
