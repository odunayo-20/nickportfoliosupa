"use client";

import React from "react";
import { Trash2, Globe, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionsBarProps {
    count: number;
    onClear: () => void;
    onBulkDelete: () => void;
    onBulkStatus: (status: "draft" | "published") => void;
}

export function BulkActionsBar({ count, onClear, onBulkDelete, onBulkStatus }: BulkActionsBarProps) {
    if (count === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-6 border border-slate-800">
                <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[11px] font-black">
                        {count}
                    </div>
                    <span className="text-[13px] font-bold tracking-tight">
                        {count > 1 ? "Projects" : "Project"} selected
                    </span>
                    <button 
                        onClick={onClear}
                        className="p-1 hover:bg-slate-800 rounded-full transition-colors ml-2"
                        title="Deselect all"
                    >
                        <X size={14} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white hover:bg-slate-800 h-9 px-4 gap-2 font-bold text-[12px]"
                        onClick={() => onBulkStatus("published")}
                    >
                        <Globe size={14} /> Publish
                    </Button>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white hover:bg-slate-800 h-9 px-4 gap-2 font-bold text-[12px]"
                        onClick={() => onBulkStatus("draft")}
                    >
                        <FileText size={14} /> Unpublish
                    </Button>
                    <div className="w-px h-4 bg-slate-700 mx-1" />
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-9 px-4 gap-2 font-bold text-[12px]"
                        onClick={onBulkDelete}
                    >
                        <Trash2 size={14} /> Batch Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
