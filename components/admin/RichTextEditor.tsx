"use client";

import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { MediaModal } from "@/components/admin/media/MediaModal";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: number;
    className?: string;
}

export function RichTextEditor({ 
    value, 
    onChange, 
    placeholder = "Start writing...", 
    height = 500,
    className 
}: RichTextEditorProps) {
    const editorRef = useRef<any>(null);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [pendingMediaId, setPendingMediaId] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleMediaSelect = (mediaId: string | string[]) => {
        setIsMediaModalOpen(false);
        // If multiple are selected, just take the first one or handle as array
        const id = Array.isArray(mediaId) ? mediaId[0] : mediaId;
        setPendingMediaId(id);
    };

    return (
        <div className={`relative group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md ${className || ""}`}>
            {/* Loading Overlay */}
            {!isLoaded && (
                <div 
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-[2px]"
                    style={{ height }}
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-slate-100 rounded-full" />
                            <div className="absolute inset-0 w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                            Initializing Editor...
                        </p>
                    </div>
                </div>
            )}

            {isMounted ? (
                <div className={isLoaded ? "opacity-100 transition-opacity duration-500" : "opacity-0"}>
                    <Editor
                        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.0.0/tinymce.min.js"
                        licenseKey="gpl"
                        onInit={(_evt, editor) => {
                            editorRef.current = editor;
                            setIsLoaded(true);
                        }}
                        value={value}
                        onEditorChange={(content) => onChange(content)}
                        init={{
                            height: height,
                            placeholder: placeholder,
                            menubar: false,
                            plugins: [
                                "advlist", "autolink", "lists", "link", "image", "charmap",
                                "preview", "anchor", "searchreplace", "visualblocks", "code",
                                "fullscreen", "insertdatetime", "media", "table", "help",
                                "wordcount", "codesample", "emoticons", "accordion"
                            ],
                            toolbar:
                                "undo redo | blocks | " +
                                "bold italic underline strikethrough | " +
                                "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
                                "bullist numlist outdent indent | link image medialibrary | " +
                                "table codesample emoticons accordion | removeformat fullscreen code",
                            content_style: `
                                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                                body {
                                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                    font-size: 16px;
                                    line-height: 1.8;
                                    color: #334155;
                                    padding: 40px;
                                    max-width: 800px;
                                    margin: 0 auto;
                                    background-color: #ffffff;
                                }
                                h1, h2, h3, h4, h5, h6 {
                                    color: #0f172a;
                                    font-weight: 700;
                                    margin-top: 1.5em;
                                    margin-bottom: 0.5em;
                                }
                                h1 { font-size: 2.25rem; }
                                h2 { font-size: 1.875rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
                                h3 { font-size: 1.5rem; }
                                p { margin-bottom: 1.25rem; }
                                img { 
                                    max-width: 100%; 
                                    height: auto; 
                                    border-radius: 12px; 
                                    margin: 2rem 0;
                                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                                }
                                pre { 
                                    background: #1e293b; 
                                    color: #f8fafc;
                                    padding: 24px; 
                                    border-radius: 12px; 
                                    overflow-x: auto; 
                                    font-size: 14px;
                                    margin: 2rem 0;
                                }
                                code {
                                    background: #f1f5f9;
                                    color: #ef4444;
                                    padding: 0.2rem 0.4rem;
                                    border-radius: 4px;
                                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                                }
                                blockquote { 
                                    border-left: 4px solid #6366f1; 
                                    padding: 1rem 2rem;
                                    color: #475569; 
                                    font-style: italic; 
                                    background: #f8fafc;
                                    border-radius: 0 12px 12px 0;
                                    margin: 2rem 0;
                                }
                                a { color: #6366f1; text-decoration: none; font-weight: 500; }
                                a:hover { text-decoration: underline; }
                                table { 
                                    border-collapse: separate; 
                                    border-spacing: 0;
                                    width: 100%; 
                                    margin: 2rem 0;
                                    border: 1px solid #e2e8f0;
                                    border-radius: 8px;
                                    overflow: hidden;
                                }
                                th { background: #f8fafc; font-weight: 600; text-align: left; }
                                td, th { border: 1px solid #e2e8f0; padding: 12px 16px; }
                            `,
                            skin: "oxide",
                            content_css: false,
                            branding: false,
                            promotion: false,
                            resize: true,
                            statusbar: true,
                            elementpath: false,
                            // Custom Media Library button
                            setup: (editor: any) => {
                                editor.ui.registry.addButton("medialibrary", {
                                    icon: "gallery",
                                    tooltip: "Insert from Media Library",
                                    onAction: () => {
                                        setIsMediaModalOpen(true);
                                    },
                                });
                            },
                        }}
                    />
                </div>
            ) : (
                <div style={{ height }} className="bg-slate-50 flex items-center justify-center">
                    <p className="text-xs font-bold text-slate-300">PREPARING EDITOR...</p>
                </div>
            )}

            {/* Media Modal */}
            <MediaModal
                open={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                onSelect={handleMediaSelect}
            />

            {/* Resolve media ID → URL and insert into editor */}
            {pendingMediaId && (
                <MediaImageResolver
                    mediaId={pendingMediaId}
                    onResolved={(url) => {
                        if (editorRef.current && url) {
                            editorRef.current.insertContent(
                                `<img src="${url}" alt="Media image" style="max-width:100%;height:auto;border-radius:12px;" />`
                            );
                        }
                        setPendingMediaId(null);
                    }}
                />
            )}

            <style jsx global>{`
                .tox-tinymce {
                    border: none !important;
                    border-radius: 0 !important;
                }
                .tox-editor-header {
                    box-shadow: none !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                    padding: 8px 16px !important;
                    background: #ffffff !important;
                }
                .tox-toolbar__group {
                    padding: 0 8px !important;
                    border-right: 1px solid #f1f5f9 !important;
                }
                .tox-toolbar__group:last-child {
                    border-right: none !important;
                }
                .tox-statusbar {
                    border-top: 1px solid #f1f5f9 !important;
                    padding: 0 16px !important;
                    font-size: 11px !important;
                    color: #94a3b8 !important;
                    background: #f8fafc !important;
                }
                .tox-statusbar__path {
                    display: none !important;
                }
                .tox-promotion-link {
                    display: none !important;
                }
            `}</style>
        </div>
    );
}

// Invisible component that resolves a media ID to its URL via Supabase
function MediaImageResolver({ mediaId, onResolved }: { mediaId: string; onResolved: (url: string | null) => void }) {
    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const { data, error } = await supabase
                    .from("media")
                    .select("url")
                    .eq("id", mediaId)
                    .single();
                
                if (error) throw error;
                onResolved(data?.url || null);
            } catch (err) {
                console.error("Error fetching media for editor insertion:", err);
                onResolved(null);
            }
        };
        fetchMedia();
    }, [mediaId, onResolved]);

    return null;
}
