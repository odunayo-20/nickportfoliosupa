"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendNewsletter, sendTestNewsletter } from "../actions";

export default function ComposeNewsletterPage() {
    const router = useRouter();
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [editorHeight, setEditorHeight] = useState(550);

    useEffect(() => {
        const handleResize = () => setEditorHeight(window.innerWidth < 640 ? 400 : 550);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSend = async () => {
        if (!subject.trim()) {
            toast.error("Please enter a subject.");
            return;
        }
        if (!content.trim() || content === "<p></p>") {
            toast.error("Please enter some content.");
            return;
        }

        setIsSending(true);
        try {
            const result = await sendNewsletter({ subject, content });
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Newsletter sent to ${result.count} subscribers!`);
                router.push("/admin/newsletter/history");
            }
        } catch (error) {
            toast.error("Failed to send newsletter.");
        } finally {
            setIsSending(false);
        }
    };

    const handleSendTest = async () => {
        if (!subject.trim()) {
            toast.error("Please enter a subject.");
            return;
        }
        const testEmail = prompt("Enter email address for the test:");
        if (!testEmail) return;

        setIsSending(true);
        try {
            const result = await sendTestNewsletter({ subject, content, email: testEmail });
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Test email sent!");
            }
        } catch (error) {
            toast.error("Failed to send test email.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.back()}
                        className="rounded-full hover:bg-slate-100 transition-colors shrink-0"
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">Compose</h1>
                        <p className="text-[13px] sm:text-sm text-slate-500 font-medium truncate sm:whitespace-normal">Broadcast to your active audience</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button 
                        variant="outline"
                        onClick={handleSendTest} 
                        disabled={isSending}
                        className="flex-1 md:flex-none h-11 rounded-xl font-bold border-slate-200"
                    >
                        Test Run
                    </Button>
                    <Button 
                        onClick={handleSend} 
                        disabled={isSending}
                        className="flex-1 md:flex-none h-11 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-slate-200 border-none transition-all active:scale-95"
                    >
                        {isSending ? (
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-3.5 w-3.5" />
                        )}
                        Broadcast
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 bg-white p-5 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                <div className="grid gap-3">
                    <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1">Subject Line</Label>
                    <Input 
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Major Project Update and New Blog Post"
                        className="text-base sm:text-xl font-bold py-6 sm:py-7 px-4 sm:px-6 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 transition-all rounded-2xl placeholder:text-slate-200"
                    />
                </div>

                <div className="grid gap-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1">Email Body</Label>
                    <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
                        <RichTextEditor 
                            value={content}
                            onChange={setContent}
                            placeholder="Hello subscribers! I have some exciting news to share..."
                            height={editorHeight}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="h-12 rounded-xl font-bold text-slate-400 hover:text-slate-600 sm:px-8"
                >
                    Discard Draft
                </Button>
                <Button 
                    onClick={handleSend} 
                    disabled={isSending}
                    className="h-12 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-900/10 sm:px-10"
                >
                    {isSending ? "Processing..." : "Publish Newsletter"}
                </Button>
            </div>
        </div>
    );
}
