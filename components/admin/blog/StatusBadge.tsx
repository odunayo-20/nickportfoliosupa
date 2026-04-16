"use client";

import React from "react";
import { CheckCircle2, CircleDashed } from "lucide-react";

interface StatusBadgeProps {
    status: string;
    onToggle?: () => void;
}

export function StatusBadge({ status, onToggle }: StatusBadgeProps) {
    const isPublished = status === "published";

    return (
        <button
            onClick={onToggle}
            type="button"
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-[1.03] outline-offset-2 ${
                isPublished 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100" 
                : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
            }`}
            title={`Click to mark as ${isPublished ? "Draft" : "Published"}`}
        >
            {isPublished ? <CheckCircle2 size={12} className="text-indigo-600" /> : <CircleDashed size={12} className="text-slate-500" />}
            {status}
        </button>
    );
}
