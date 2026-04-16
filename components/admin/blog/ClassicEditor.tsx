"use client";

import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { MediaModal } from "@/components/admin/media/MediaModal";
import { supabase } from "@/lib/supabaseClient";

interface ClassicEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    height?: number;
}

export function ClassicEditor({ value, onChange, placeholder, className, height = 500 }: ClassicEditorProps) {
    const editorRef = useRef<any>(null);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [pendingMediaId, setPendingMediaId] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    const handleMediaSelect = (mediaId: string) => {
        setIsMediaModalOpen(false);
        setPendingMediaId(mediaId);
    };

    return (
        <div className={`rounded-xl overflow-hidden border bg-white shadow-sm ${className || ""}`}>
            {/* Loading state */}
            {!ready && (
                <div className="flex items-center justify-center bg-slate-50" style={{ height: height }}>
                    <div className="flex items-center gap-3 text-slate-400">
                        <div className="w-5 h-5 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
                        <span className="text-sm font-medium">Loading editor...</span>
                    </div>
                </div>
            )}

            <div className={ready ? "" : "hidden"}>
                <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    licenseKey="gpl"
                    onInit={(_evt, editor) => {
                        editorRef.current = editor;
                        setReady(true);
                    }}
                    value={value}
                    onEditorChange={(content) => onChange(content)}
                    init={{
                        height: height,
                        placeholder: placeholder || "Start writing...",
                        menubar: "file edit view insert format tools table",
                        plugins: [
                            "advlist", "autolink", "lists", "link", "image", "charmap",
                            "preview", "anchor", "searchreplace", "visualblocks", "code",
                            "fullscreen", "insertdatetime", "media", "table", "help",
                            "wordcount", "codesample", "emoticons"
                        ],
                        toolbar:
                            "undo redo | blocks | bold italic underline strikethrough | " +
                            "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
                            "bullist numlist outdent indent | link image medialibrary | " +
                            "table codesample emoticons | removeformat fullscreen code help",
                        content_style: `
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                                font-size: 16px;
                                line-height: 1.75;
                                color: #1e293b;
                                padding: 20px;
                                max-width: 100%;
                            }
                            img { max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0; }
                            pre { background: #f1f5f9; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 14px; }
                            blockquote { border-left: 4px solid #6366f1; padding-left: 16px; color: #64748b; font-style: italic; margin: 16px 0; }
                            a { color: #6366f1; text-decoration: underline; }
                            h1 { font-size: 2em; color: #0f172a; margin: 0.67em 0; }
                            h2 { font-size: 1.5em; color: #0f172a; margin: 0.75em 0; }
                            h3 { font-size: 1.17em; color: #0f172a; margin: 0.83em 0; }
                            table { border-collapse: collapse; width: 100%; }
                            td, th { border: 1px solid #e2e8f0; padding: 8px 12px; }
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
                                `<img src="${url}" alt="Media image" style="max-width:100%;height:auto;border-radius:8px;" />`
                            );
                        }
                        setPendingMediaId(null);
                    }}
                />
            )}
        </div>
    );
}

// Invisible component that resolves a media ID to its URL via Supabase
function MediaImageResolver({ mediaId, onResolved }: { mediaId: string; onResolved: (url: string | null) => void }) {
    useEffect(() => {
        const fetchMedia = async () => {
            const { data, error } = await supabase
                .from("media")
                .select("url")
                .eq("id", mediaId)
                .single();
            
            if (error) {
                console.error("Error fetching media for editor insertion:", error);
                onResolved(null);
            } else {
                onResolved(data?.url || null);
            }
        };
        fetchMedia();
    }, [mediaId, onResolved]);

    return null;
}
