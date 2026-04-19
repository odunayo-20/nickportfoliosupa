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
    RefreshCw
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

    const fetchCampaigns = async () => {
        setIsLoading(true);
        const data = await getNewsletterCampaigns();
        setCampaigns(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this campaign record? This will not undo the actual email delivery.")) return;
        
        setIsDeleting(id);
        const result = await deleteNewsletterCampaign(id);
        if (result.success) {
            toast.success("Campaign record deleted.");
            setCampaigns(campaigns.filter(c => c.id !== id));
        } else {
            toast.error(result.error || "Failed to delete.");
        }
        setIsDeleting(null);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.push("/admin/newsletter")}
                        className="rounded-full"
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Broadcast History</h1>
                        <p className="text-slate-500">View and manage previously sent newsletter campaigns.</p>
                    </div>
                </div>
                <Button variant="outline" onClick={fetchCampaigns} disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p className="text-slate-400 font-medium">Fetching your history...</p>
                </div>
            ) : campaigns.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300">
                        <Mail size={32} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-900">No campaigns found</h3>
                        <p className="text-slate-500">You haven't sent any newsletters yet.</p>
                    </div>
                    <Button onClick={() => router.push("/admin/newsletter/compose")} className="mt-2 bg-indigo-600">
                        Send Your First Newsletter
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {campaigns.map((campaign) => (
                        <Card key={campaign.id} className="overflow-hidden border-slate-200 group hover:border-indigo-200 transition-all hover:shadow-lg hover:shadow-indigo-50/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {campaign.subject}
                                        </CardTitle>
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-widest">
                                            {campaign.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} className="text-slate-400" />
                                            {format(new Date(campaign.created_at), "PPP")}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users size={14} className="text-slate-400" />
                                            {campaign.recipient_count} Recipients
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                                                <Eye size={18} />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-bold">{campaign.subject}</DialogTitle>
                                                <DialogDescription className="flex items-center gap-2">
                                                    Sent on {format(new Date(campaign.created_at), "MMMM d, yyyy")} to {campaign.recipient_count} users.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="mt-6 border rounded-xl p-8 bg-white prose prose-slate max-w-none shadow-inner">
                                                <div dangerouslySetInnerHTML={{ __html: campaign.content }} />
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDelete(campaign.id)}
                                        disabled={isDeleting === campaign.id}
                                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    >
                                        {isDeleting === campaign.id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={18} />
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
