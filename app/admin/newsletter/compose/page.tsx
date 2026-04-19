"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendNewsletter } from "../actions";

export default function ComposeNewsletterPage() {
    const router = useRouter();
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [isSending, setIsSending] = useState(false);

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

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Compose Newsletter</h1>
                        <p className="text-slate-500">Draft and broadcast an email to your active subscribers.</p>
                    </div>
                </div>

                <Button 
                    onClick={handleSend} 
                    disabled={isSending}
                    className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                >
                    {isSending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-4 w-4" />
                    )}
                    Send to All
                </Button>
            </div>

            <div className="grid gap-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="grid gap-2">
                    <Label htmlFor="subject" className="text-sm font-black uppercase tracking-widest text-slate-400">Subject Line</Label>
                    <Input 
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Major Project Update and New Blog Post"
                        className="text-lg font-semibold py-6 border-slate-200 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid gap-2">
                    <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Email Body</Label>
                    <RichTextEditor 
                        value={content}
                        onChange={setContent}
                        placeholder="Hello subscribers! I have some exciting news to share..."
                        height={500}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button 
                    onClick={handleSend} 
                    disabled={isSending}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    {isSending ? "Sending..." : "Publish Newsletter"}
                </Button>
            </div>
        </div>
    );
}
