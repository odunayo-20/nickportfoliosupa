"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { unsubscribeFromNewsletter } from "@/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

export default function UnsubscribeClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleUnsubscribe = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!email) {
            setStatus("error");
            setMessage("Please provide a valid email address.");
            return;
        }

        setStatus("loading");
        try {
            const result = await unsubscribeFromNewsletter(email);
            if (result.success) {
                setStatus("success");
                setMessage("You have been successfully unsubscribed from my newsletter.");
            } else {
                setStatus("error");
                setMessage(result.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("An unexpected error occurred.");
        }
    };

    // Auto-trigger if email is present in URL? Maybe better to have a confirmation button to avoid accidental unsubscribes from crawlers.
    // Let's stick with a "Confirm Unsubscribe" button for better UX and security.

    return (
        <div className="max-w-md w-full mx-auto">
            <AnimatePresence mode="wait">
                {status === "idle" || status === "loading" ? (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-white">Unsubscribe</h1>
                            <p className="text-muted-foreground">
                                We're sorry to see you go. Enter your email to confirm.
                            </p>
                        </div>

                        <form onSubmit={handleUnsubscribe} className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    disabled={status === "loading"}
                                    required
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 text-base font-semibold"
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Unsubscribing...
                                    </>
                                ) : (
                                    "Unsubscribe me"
                                )}
                            </Button>
                        </form>
                    </motion.div>
                ) : status === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 shadow-2xl text-center space-y-6"
                    >
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Unsubscribed</h2>
                            <p className="text-muted-foreground">
                                {message}
                            </p>
                        </div>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">Back to Portfolio</Link>
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-2xl text-center space-y-6"
                    >
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Oops!</h2>
                            <p className="text-muted-foreground">
                                {message}
                            </p>
                        </div>
                        <Button 
                            variant="secondary" 
                            className="w-full"
                            onClick={() => setStatus("idle")}
                        >
                            Try Again
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
