"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProject, updateProject } from "@/actions/projects";
import { getMediaById, getMediaByIds } from "@/actions/media";
import { getCategories } from "@/actions/categories";
import { 
    Save, 
    Send, 
    Image as ImageIcon, 
    Plus, 
    X, 
    ExternalLink, 
    Code2, 
    Globe, 
    Smartphone,
    LayoutPanelLeft,
    Settings2,
    Check,
    Loader2,
    Trash2,
    GripVertical,
    ChevronLeft,
    Eye,
    History,
    Calendar,
    Tag,
    Star,
    Layers
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MediaModal } from "@/components/admin/media/MediaModal";
import Link from "next/link";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

// Form Schema
const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    content: z.string().optional(),
    category: z.string().optional(),
    techStack: z.array(z.string()),
    githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    appStoreUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    playStoreUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    status: z.enum(["draft", "published"]),
    isFeatured: z.boolean(),
    featuredImage: z.string().optional(),
    mediaIds: z.array(z.string()),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectEditorProps {
    initialData?: any;
    id?: string;
}

export function ProjectEditor({ initialData, id }: ProjectEditorProps) {
    const router = useRouter();
    const isEditing = !!id;

    // Form State
    const [isSaving, setIsSaving] = useState(false);
    const [activeMediaModal, setActiveMediaModal] = useState<"featured" | "gallery" | null>(null);
    const [tagInput, setTagInput] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [isEditingSlug, setIsEditingSlug] = useState(false);

    // Media Previews State
    const [featuredImageDoc, setFeaturedImageDoc] = useState<any>(null);
    const [galleryItems, setGalleryItems] = useState<any[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

    useEffect(() => {
        setIsMounted(true);
        getCategories().then(setCategories);
    }, []);

    const defaultValues: ProjectFormValues = {
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        content: initialData?.content || "",
        category: initialData?.category || "",
        techStack: initialData?.tech_stack || initialData?.techStack || [],
        githubUrl: initialData?.githubUrl || "",
        liveUrl: initialData?.liveUrl || "",
        appStoreUrl: initialData?.appStoreUrl || "",
        playStoreUrl: initialData?.playStoreUrl || "",
        status: (initialData?.status === "published" ? "published" : "draft") as "draft" | "published",
        isFeatured: initialData?.is_featured || initialData?.isFeatured || false,
        featuredImage: initialData?.featured_image || initialData?.featured_image_id || initialData?.featuredImage || undefined,
        mediaIds: initialData?.media_ids || initialData?.mediaIds || [],
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema as any),
        defaultValues,
    });

    const values = watch();
    const techStack = watch("techStack");
    const mediaIds = watch("mediaIds");
    const featuredImageId = watch("featuredImage");
    const status = watch("status");

    // Fetch media previews
    useEffect(() => {
        const fetchMedia = async () => {
            if (featuredImageId) {
                const doc = await getMediaById(featuredImageId);
                setFeaturedImageDoc(doc);
            } else {
                setFeaturedImageDoc(null);
            }
        };
        fetchMedia();
    }, [featuredImageId]);

    useEffect(() => {
        const fetchGallery = async () => {
            if (mediaIds && mediaIds.length > 0) {
                const docs = await getMediaByIds(mediaIds);
                // Sort docs to match mediaIds order
                const sorted = mediaIds.map(mid => docs.find(d => d.id === mid)).filter(Boolean);
                setGalleryItems(sorted);
            } else {
                setGalleryItems([]);
            }
        };
        fetchGallery();
    }, [mediaIds]);

    // Live slug generation if creating
    useEffect(() => {
        if (!isEditing && values.title) {
            const slug = values.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/[\s_-]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setValue("slug", slug, { shouldValidate: true });
        }
    }, [values.title, isEditing, setValue]);

    // Handlers
    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!techStack.includes(tagInput.trim())) {
                setValue("techStack", [...techStack, tagInput.trim()], { shouldDirty: true });
            }
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setValue("techStack", techStack.filter(t => t !== tag), { shouldDirty: true });
    };

    const handleMediaSelect = (ids: string | string[]) => {
        if (activeMediaModal === "featured") {
            setValue("featuredImage", Array.isArray(ids) ? ids[0] : ids, { shouldDirty: true });
        } else if (activeMediaModal === "gallery") {
            const newIds = Array.isArray(ids) ? ids : [ids];
            // Merge unique
            const current = getValues("mediaIds");
            const merged = [...new Set([...current, ...newIds])];
            setValue("mediaIds", merged, { shouldDirty: true });
        }
        setActiveMediaModal(null);
    };

    const removeGalleryImage = (id: string) => {
        setValue("mediaIds", mediaIds.filter(mid => mid !== id), { shouldDirty: true });
    };

    // Simple drag and drop for gallery reordering
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const onDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        
        const newMediaIds = [...mediaIds];
        const item = newMediaIds[draggedIndex];
        newMediaIds.splice(draggedIndex, 1);
        newMediaIds.splice(index, 0, item);
        
        setDraggedIndex(index);
        setValue("mediaIds", newMediaIds, { shouldDirty: true });
    };

    const onSubmit = async (data: ProjectFormValues) => {
        setIsSaving(true);
        try {
            const payload = {
                title: data.title,
                slug: data.slug,
                description: data.description,
                content: data.content,
                category: data.category || undefined,
                tech_stack: data.techStack,
                github_url: data.githubUrl || undefined,
                live_url: data.liveUrl || undefined,
                app_store_url: data.appStoreUrl || undefined,
                play_store_url: data.playStoreUrl || undefined,
                status: data.status,
                is_featured: data.isFeatured,
                featured_image: data.featuredImage || undefined,
                media_ids: data.mediaIds,
            };

            if (isEditing && id) {
                await updateProject(id, payload);
                toast.success("Project updated successfully");
            } else {
                const newProject = await createProject(payload);
                toast.success("Project created successfully");
                router.push(`/admin/project/edit/${newProject.id}`);
            }
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Failed to save project");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-[#F8FAFC]">
            {/* Top Navigation / Toolbar */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/admin/project" 
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 border border-slate-100 transition-colors text-slate-500"
                        >
                            <ChevronLeft size={18} />
                        </Link>
                        <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />
                        <h1 className="text-sm font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-md">
                            {isEditing ? `Editing: ${initialData?.title}` : "Create New Project"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            className="text-slate-500 hover:text-slate-900 font-medium hidden sm:flex gap-2"
                        >
                            <Eye size={16} /> Preview
                        </Button>
                        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
                        <Button 
                            type="submit"
                            disabled={isSaving}
                            variant={status === "published" ? "default" : "outline"}
                            className={`min-w-[120px] font-bold ${status === "published" ? "bg-slate-900 hover:bg-slate-800" : ""}`}
                        >
                            {isSaving ? (
                                <Loader2 size={16} className="animate-spin mr-2" />
                            ) : isEditing ? (
                                <Save size={16} className="mr-2" />
                            ) : (
                                <Send size={16} className="mr-2" />
                            )}
                            {isEditing ? (status === "published" ? "Update" : "Save Draft") : "Publish"}
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* LEFT COLUMN: Main Content */}
                    <div className="flex-1 space-y-6 w-full lg:max-w-[calc(100%-380px)]">
                        
                        {/* Title Section */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-8 space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Title</Label>
                                    <input 
                                        {...register("title")}
                                        placeholder="Enter project title..."
                                        className="w-full text-4xl font-extrabold tracking-tight border-none p-0 focus:ring-0 placeholder:text-slate-200 bg-transparent text-slate-900"
                                    />
                                    {errors.title && <p className="text-xs text-red-500 font-medium mt-1">{errors.title.message}</p>}
                                </div>

                                <div className="flex items-center gap-2 text-[13px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 max-w-fit">
                                    <Globe size={12} className="text-slate-400" />
                                    <span className="text-slate-400 font-medium">Permalink:</span>
                                    {isEditingSlug ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400">/project/</span>
                                            <input 
                                                {...register("slug")}
                                                className="bg-white border border-slate-200 rounded px-1 h-6 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary w-40"
                                                autoFocus
                                                onBlur={() => setIsEditingSlug(false)}
                                                onKeyDown={(e) => e.key === 'Enter' && setIsEditingSlug(false)}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-slate-600 font-semibold truncate">/project/{values.slug || "..."}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => setIsEditingSlug(true)}
                                                className="text-primary hover:underline ml-2 font-bold"
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-8 space-y-4 border-b border-slate-50">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brief Overview</Label>
                                    <Textarea 
                                        {...register("description")}
                                        placeholder="A concise summary of the project goals and outcome..."
                                        className="text-lg font-medium border-none p-0 focus-visible:ring-0 placeholder:text-slate-300 resize-none min-h-[100px] bg-transparent shadow-none"
                                    />
                                    {errors.description && <p className="text-xs text-red-500 font-medium mt-1">{errors.description.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Rich Text Editor */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <Layers size={14} /> Full Content
                                </h3>
                                <div className="flex items-center gap-4">
                                    {!isMounted && (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Loader2 size={12} className="animate-spin" />
                                            <span className="text-[10px] font-medium">Initializing...</span>
                                        </div>
                                    )}
                                    <span className="text-[10px] text-slate-400 font-medium">Rich HTML supported</span>
                                </div>
                            </div>
                            <div className="min-h-[600px] tinymce-custom-container relative">
                                {isMounted ? (
                                <RichTextEditor
                                    value={values.content || ""}
                                    onChange={(content) => setValue("content", content, { shouldDirty: true })}
                                    placeholder="Enter full project description and technical details..."
                                    height={600}
                                />
                                ) : (
                                    <div className="h-[600px] bg-slate-50 flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
                                            <p className="text-xs font-bold text-slate-400">Loading editor...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gallery Section */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h3 className="text-sm font-bold text-slate-900">Project Gallery</h3>
                                    <p className="text-[11px] text-slate-500 font-medium">Reorder by dragging. Best for process shots and details.</p>
                                </div>
                                <Button 
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setActiveMediaModal("gallery")}
                                    className="border-slate-200 hover:bg-slate-50 font-bold gap-2 text-primary"
                                >
                                    <Plus size={16} /> Add Media
                                </Button>
                            </div>

                            <div className="p-8">
                                {mediaIds.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {mediaIds.map((mid, index) => {
                                            const doc = galleryItems?.find(d => d?.id === mid);
                                            return (
                                                <div 
                                                    key={mid} 
                                                    draggable
                                                    onDragStart={(e) => onDragStart(e, index)}
                                                    onDragOver={(e) => onDragOver(e, index)}
                                                    onDragEnd={() => setDraggedIndex(null)}
                                                    className={`group relative aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200 cursor-move transition-all ${draggedIndex === index ? "opacity-50 scale-95" : "hover:shadow-md"}`}
                                                >
                                                    {doc?.url ? (
                                                        <img src={doc.url} alt="Gallery" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full">
                                                            <Loader2 size={18} className="animate-spin text-slate-300" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeGalleryImage(mid)}
                                                            className="w-8 h-8 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-sm">
                                                            <GripVertical size={14} />
                                                        </div>
                                                    </div>
                                                    {index === 0 && (
                                                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-slate-900/80 text-white text-[9px] font-black uppercase tracking-tighter rounded">
                                                            Cover
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div 
                                        onClick={() => setActiveMediaModal("gallery")}
                                        className="aspect-[4/1] rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 bg-slate-50/30 hover:bg-slate-50/80 cursor-pointer transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors border border-slate-100">
                                            <ImageIcon size={20} />
                                        </div>
                                        <p className="text-xs font-bold text-slate-400">Upload or select images for the gallery</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar Panels */}
                    <div className="w-full lg:w-[340px] space-y-6">
                        
                        {/* 1. Status Panel (WordPress Publish Style) */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700">Project Status</h3>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                }`}>
                                    {status}
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <History size={16} className="text-slate-400" />
                                        <div className="text-[13px] font-medium">
                                            Status: <span className="font-bold text-slate-900 capitalize">{status}</span>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setValue("status", status === "published" ? "draft" : "published", { shouldDirty: true })}
                                            className="ml-auto text-primary hover:underline text-xs font-bold"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Eye size={16} className="text-slate-400" />
                                        <div className="text-[13px] font-medium">
                                            Visibility: <span className="font-bold text-slate-900">Public</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Calendar size={16} className="text-slate-400" />
                                        <div className="text-[13px] font-medium leading-tight">
                                            Last Updated: <br/>
                                            <span className="font-bold text-slate-900">
                                                {isMounted && (initialData?.updated_at || initialData?.updatedAt)
                                                    ? format(new Date(initialData?.updated_at || initialData?.updatedAt), "MMM d, yyyy 'at' h:mm a") 
                                                    : "Not saved yet"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col gap-2">
                                    <Button 
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 shadow-lg shadow-slate-200"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : status === "published" ? "Update Project" : "Publish Project"}
                                    </Button>
                                    {status === "published" && (
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={() => setValue("status", "draft", { shouldDirty: true })}
                                            className="w-full text-slate-600 font-bold h-10 border-slate-200"
                                        >
                                            Switch to Draft
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Featured Image Panel */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700">Cover Image</h3>
                            </div>
                            <div className="p-6">
                                {featuredImageId ? (
                                    <div className="space-y-4">
                                        <div className="relative aspect-video rounded-xl overflow-hidden group border border-slate-200 shadow-sm">
                                            {featuredImageDoc?.url ? (
                                                <img src={featuredImageDoc.url} alt="Featured" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-slate-50">
                                                    <Loader2 size={18} className="animate-spin text-primary" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button 
                                                    type="button" 
                                                    size="sm" 
                                                    variant="secondary"
                                                    className="font-bold"
                                                    onClick={() => setActiveMediaModal("featured")}
                                                >
                                                    Replace Image
                                                </Button>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setValue("featuredImage", undefined, { shouldDirty: true })}
                                            className="text-[11px] font-bold text-red-500 hover:underline w-full text-center"
                                        >
                                            Remove Cover Image
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        type="button"
                                        onClick={() => setActiveMediaModal("featured")}
                                        className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-100 hover:border-primary/40 hover:bg-slate-50/50 transition-all flex flex-col items-center justify-center gap-2 group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors border border-slate-100">
                                            <ImageIcon size={20} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 tracking-tight">Set featured image</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 3. Settings & Tags */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700">Project Settings</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</Label>
                                    <Select 
                                        defaultValue={initialData?.category || ""} 
                                        onValueChange={(val) => setValue("category", val, { shouldDirty: true })}
                                    >
                                        <SelectTrigger className="w-full bg-slate-50 border-slate-100 rounded-xl h-11 text-[13px] font-bold">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.length === 0 ? (
                                                <SelectItem value="__none" disabled>
                                                    No categories yet
                                                </SelectItem>
                                            ) : (
                                                categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.name}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tech Stack / Tools</Label>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {techStack.map(tag => (
                                            <div key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold border border-slate-200 group">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <Input 
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleAddTag}
                                            placeholder="Add tool (e.g. Revit)..."
                                            className="h-10 bg-slate-50 border-slate-100 rounded-xl pr-10 text-[13px] font-medium"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                                            <Tag size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="space-y-0.5">
                                        <div className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                                            <Star size={14} className={values.isFeatured ? "text-amber-500 fill-amber-500" : "text-slate-300"} />
                                            Featured Project
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium">Highlight this on homepage</p>
                                    </div>
                                    <Switch 
                                        checked={values.isFeatured}
                                        onCheckedChange={(checked) => setValue("isFeatured", checked, { shouldDirty: true })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 4. External Links */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700">Project Links</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                        <Code2 size={12} /> GitHub
                                    </Label>
                                    <Input 
                                        {...register("githubUrl")}
                                        placeholder="https://github.com/..."
                                        className="h-9 bg-slate-50 border-slate-100 rounded-lg text-xs"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                        <Globe size={12} /> Live Site
                                    </Label>
                                    <Input 
                                        {...register("liveUrl")}
                                        placeholder="https://..."
                                        className="h-9 bg-slate-50 border-slate-100 rounded-lg text-xs"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                            <Smartphone size={10} /> App Store
                                        </Label>
                                        <Input 
                                            {...register("appStoreUrl")}
                                            placeholder="URL"
                                            className="h-9 bg-slate-50 border-slate-100 rounded-lg text-[10px]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                            <Smartphone size={10} /> Play Store
                                        </Label>
                                        <Input 
                                            {...register("playStoreUrl")}
                                            placeholder="URL"
                                            className="h-9 bg-slate-50 border-slate-100 rounded-lg text-[10px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Media Modal */}
            <MediaModal 
                open={activeMediaModal !== null}
                onClose={() => setActiveMediaModal(null)}
                onSelect={handleMediaSelect}
                multiple={activeMediaModal === "gallery"}
                initialSelection={
                    activeMediaModal === "featured" 
                        ? (featuredImageId || undefined) 
                        : (mediaIds.length > 0 ? mediaIds : undefined)
                }
            />


        </form>
    );
}
