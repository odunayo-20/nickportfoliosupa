"use client";

import React, { useState } from "react";
import { MediaModal } from "@/components/admin/media/MediaModal";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Plus } from "lucide-react";

/**
 * Example snippet showcasing how to integrate the MediaModal
 * into a typical post editor or block.
 */
export function BlogEditorExample() {
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

    const handleSelectImage = (id: string) => {
        console.log("Image selected:", id);
        setSelectedMediaId(id);
    };

    return (
        <div className="p-10 border-2 border-dashed rounded-3xl bg-slate-50 flex flex-col items-center gap-6">
            <h3 className="font-bold text-slate-800 tracking-tight">Post Editor Block Example</h3>
            
            <div className="w-full max-w-lg aspect-video rounded-2xl bg-white border shadow-sm flex flex-col items-center justify-center p-8 text-center group">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform cursor-pointer" onClick={() => setIsMediaModalOpen(true)}>
                    <ImageIcon className="text-slate-400" size={32} />
                </div>
                
                <p className="text-sm font-medium text-slate-500 mb-6">
                    {selectedMediaId ? `Selected Media: ${selectedMediaId}` : "Select an image for this block"}
                </p>

                <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => setIsMediaModalOpen(true)}
                >
                    <Plus size={16} /> Open Media Library
                </Button>
            </div>

            {/* The Modal */}
            <MediaModal 
                open={isMediaModalOpen}
                initialSelection={selectedMediaId || undefined}
                onClose={() => setIsMediaModalOpen(false)}
                onSelect={handleSelectImage}
            />
        </div>
    );
}
