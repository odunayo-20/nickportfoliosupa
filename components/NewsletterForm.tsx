"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const result = await subscribeToNewsletter({ email });
      
      if (result.error) {
        setStatus("error");
        setMessage(result.error);
      } else {
        setStatus("success");
        setMessage(result.resubscribed ? "Welcome back! You've been re-subscribed." : "Thank you for subscribing!");
        setEmail("");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-4">
        <h3 className="font-['Space_Grotesk'] font-bold text-white text-xl tracking-tight">
          STAY IN THE LOOP
        </h3>
        <p className="font-['Inter'] text-sm text-white/50 leading-relaxed">
          Get the latest updates on projects, articles, and tech insights delivered straight to your void.
        </p>

        <form onSubmit={handleSubmit} className="relative mt-2">
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === "loading" || status === "success"}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#ffb800]/50 transition-all duration-300 font-['Inter']"
              required
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="absolute right-1 top-1 bottom-1 px-4 bg-[#ffb800] hover:bg-[#ffb800]/90 text-black rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-[0_0_15px_rgba(255,184,0,0.3)]"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : status === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {message && (
            <div 
              className={`mt-3 flex items-start gap-2 text-xs font-['Inter'] animate-in fade-in slide-in-from-top-2 duration-300 ${
                status === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {status === "success" ? (
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}
        </form>
        
        <p className="text-[10px] text-white/30 font-['Inter'] uppercase tracking-widest mt-1">
          No spam. Just pure signal.
        </p>
      </div>
    </div>
  );
}
