"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { MediaLibrary } from "./MediaLibrary";
import { X, CheckCircle } from "lucide-react";

interface MediaModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (ids: string | string[]) => void;
    initialSelection?: string | string[];
    multiple?: boolean;
}

export function MediaModal({ open, onClose, onSelect, initialSelection, multiple = false }: MediaModalProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    // Portal mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset selection + animate in/out
    useEffect(() => {
        if (open) {
            if (initialSelection) {
                const initial = Array.isArray(initialSelection) 
                    ? initialSelection
                    : [initialSelection];
                setSelectedIds(initial);
            } else {
                setSelectedIds([]);
            }
            // Trigger enter animation next frame
            requestAnimationFrame(() => setVisible(true));
            // Lock body scroll
            document.body.style.overflow = "hidden";
        } else {
            setVisible(false);
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open, initialSelection]);

    // Escape key
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    const handleConfirm = useCallback(() => {
        if (selectedIds.length > 0) {
            onSelect(multiple ? selectedIds : selectedIds[0]);
            onClose();
        }
    }, [selectedIds, onSelect, onClose, multiple]);

    if (!mounted || !open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-10">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div
                className={`relative w-full h-full sm:h-auto sm:max-h-[90vh] max-w-7xl bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                    visible 
                        ? "opacity-100 scale-100 translate-y-0" 
                        : "opacity-0 scale-[0.97] translate-y-8"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="min-w-0 pr-4">
                        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 truncate">Asset Library</h2>
                        <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
                            {multiple 
                                ? "Select multiple assets to add to your gallery."
                                : "Pick a featured image for your project."}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-900 active:scale-95"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Media Library Content - CRITICAL: flex-1 and min-h-0 for internal scrolling */}
                <div className="flex-1 min-h-0 bg-slate-50/20 overflow-auto">
                    <MediaLibrary
                        selectionMode={true}
                        multiple={multiple}
                        externalSelectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        hideConfirmBar={true}
                        hideHeader={true}
                    />
                </div>

                {/* Footer */}
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t bg-white gap-3 sm:gap-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
                        {selectedIds.length > 0 ? (
                            <span className="flex items-center gap-1.5 text-primary font-bold">
                                <CheckCircle size={14} className="fill-primary/10" /> {selectedIds.length} {selectedIds.length > 1 ? "items" : "item"} selected
                            </span>
                        ) : (
                            <span className="hidden sm:inline">Click to select an asset</span>
                        )}
                    </div>
                    <div className="flex w-full sm:w-auto gap-2 sm:gap-3 order-1 sm:order-2">
                        <Button variant="outline" onClick={onClose} className="flex-1 sm:px-6 h-9 sm:h-10 text-xs font-bold rounded-xl transition-all active:scale-95">
                            Cancel
                        </Button>
                        <Button
                            disabled={selectedIds.length === 0}
                            onClick={handleConfirm}
                            className="flex-[1.5] sm:px-8 h-9 sm:h-10 text-xs font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            Confirm Selection
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}