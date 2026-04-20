"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
    Calendar as CalendarIcon, 
    ChevronLeft, 
    Eye, 
    Image as ImageIcon,
    Plus,
    Save,
    Trash2,
    X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { MediaModal } from "@/components/admin/media/MediaModal";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { cn } from "@/lib/utils";
import { createPost, updatePost } from "@/actions/blog";
import { getCategories } from "@/actions/categories";
import { supabase } from "@/lib/supabaseClient";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    excerpt: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    status: z.enum(["draft", "published"]),
    visibility: z.enum(["public", "private"]),
    category: z.string().optional(),
    tags: z.array(z.string()),
    published_at: z.string().optional(),
    featured_image_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogEditorProps {
    initialData?: any;
    isEditing?: boolean;
}

export function BlogEditor({ initialData, isEditing = false }: BlogEditorProps) {
    const router = useRouter();

    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

    useEffect(() => {
        setIsMounted(true);
        getCategories().then(setCategories);
    }, []);

    const defaultValues: FormValues = {
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        excerpt: initialData?.summary || "",
        content: initialData?.content || "",
        status: (initialData?.status === "published" ? "published" : "draft") as "draft" | "published",
        visibility: (initialData?.visibility === "private" ? "private" : "public") as "public" | "private",
        category: initialData?.category || "General",
        tags: initialData?.tags || [],
        published_at: initialData?.published_at || new Date().toISOString(),
        featured_image_id: initialData?.featured_image_id || undefined,
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema as any),
        defaultValues,
    });

    const { register, handleSubmit, watch, setValue, control, formState: { errors, isSubmitting } } = form;

    const titleWatcher = watch("title");
    const tagsWatcher = watch("tags");
    const pubDateWatcher = watch("published_at");
    const featuredImageIdWatcher = watch("featured_image_id");

    // Auto-slug
    useEffect(() => {
        if (!isEditing && titleWatcher) {
            const slug = titleWatcher
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            setValue("slug", slug, { shouldValidate: true });
        }
    }, [titleWatcher, setValue, isEditing]);

    const onSubmit = async (data: FormValues) => {
        try {
            if (isEditing && initialData?.id) {
                await updatePost(initialData.id, {
                    title: data.title,
                    slug: data.slug,
                    summary: data.excerpt || "",
                    content: data.content,
                    tags: data.tags,
                    status: data.status,
                    visibility: data.visibility,
                    category: data.category,
                    published_at: data.published_at,
                    featured_image_id: data.featured_image_id,
                    updated_at: new Date().toISOString()
                });
                toast.success("Post updated successfully");
            } else {
                await createPost({
                    title: data.title,
                    slug: data.slug,
                    summary: data.excerpt || "",
                    content: data.content,
                    tags: data.tags,
                    status: data.status,
                    visibility: data.visibility,
                    category: data.category,
                    published_at: data.published_at,
                    featured_image_id: data.featured_image_id,
                });
                toast.success("Post created successfully");
            }
            router.push("/admin/blog");
        } catch (error) {
            console.error(error);
            toast.error(isEditing ? "Failed to update post" : "Failed to create post");
        }
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const tag = tagInput.trim();
            if (tag && !tagsWatcher.includes(tag)) {
                setValue("tags", [...tagsWatcher, tag]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setValue("tags", tagsWatcher.filter(t => t !== tag));
    };

    // Featured Image Preview
    const FeaturedImagePreview = ({ mediaId }: { mediaId: string }) => {
        const [media, setMedia] = useState<any>(null);
        
        useEffect(() => {
            const fetchMedia = async () => {
                const { data } = await supabase.from("media").select("*").eq("id", mediaId).single();
                setMedia(data);
            };
            fetchMedia();
        }, [mediaId]);

        if (!media) return <div className="h-40 bg-slate-100 rounded-xl flex items-center justify-center animate-pulse"><ImageIcon className="text-slate-300" /></div>;
        return (
            <div className="relative group rounded-xl overflow-hidden border aspect-video">
                <img src={media.url} alt="Featured" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={() => setIsMediaModalOpen(true)}>Replace</Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => setValue("featured_image_id", undefined)}>Remove</Button>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
            {/* Main Area */}
            <div className="flex-1 space-y-8">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} type="button">
                        <ChevronLeft size={16} className="mr-2" /> Back
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                        {isEditing ? "Edit Blog Post" : "Add New Post"}
                    </h1>
                </div>

                {/* Title & Slug */}
                <div className="space-y-4">
                    <Input 
                        {...register("title")}
                        placeholder="Enter post title..." 
                        className="text-4xl font-black border-none bg-transparent p-0 focus-visible:ring-0 h-auto placeholder:text-slate-200"
                    />
                    {errors.title && <p className="text-red-500 text-sm font-medium">{errors.title.message}</p>}

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border rounded-lg text-sm font-medium w-fit">
                        <span className="text-slate-400">yourdomain.com/blog/</span>
                        <input 
                            {...register("slug")}
                            className="bg-transparent border-none p-0 focus:ring-0 text-primary font-bold min-w-[50px]"
                        />
                    </div>
                </div>

                {/* Rich Text Editor */}
                <div className="space-y-2">
                    <Label className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Content</Label>
                    {isMounted ? (
                        <Controller 
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor 
                                    value={field.value} 
                                    onChange={field.onChange} 
                                    placeholder="Start writing your masterpiece..."
                                />
                            )}
                        />
                    ) : (
                        <div className="h-[400px] bg-slate-50 border border-dashed rounded-xl flex items-center justify-center text-slate-300">
                            Loading editor...
                        </div>
                    )}
                    {errors.content && <p className="text-red-500 text-sm font-medium mt-1">{errors.content.message}</p>}
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <Label className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Excerpt</Label>
                    <Textarea 
                        {...register("excerpt")}
                        placeholder="A short summary of your post..."
                        className="bg-white p-4 h-24 border-slate-200 border resize-none rounded-xl"
                    />
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-[320px] space-y-6">
                {/* Publish Box */}
                <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[11px]">Post Settings</h3>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-500 text-xs">Status</Label>
                            <Controller 
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full bg-slate-50 border-none">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-500 text-xs">Visibility</Label>
                            <Controller 
                                name="visibility"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full bg-slate-50 border-none">
                                            <SelectValue placeholder="Select Visibility" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-500 text-xs">Publish Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className={cn(
                                            "flex items-center w-full justify-start text-left font-normal bg-slate-50 border rounded-md h-10 px-3 text-sm cursor-pointer hover:bg-slate-100 transition-colors",
                                            !pubDateWatcher && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {isMounted && pubDateWatcher ? format(new Date(pubDateWatcher), "PPP") : <span>Pick a date</span>}
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 border-none shadow-2xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={pubDateWatcher ? new Date(pubDateWatcher) : undefined}
                                        onSelect={(date) => setValue("published_at", date?.toISOString())}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-2">
                        <Button type="submit" disabled={isSubmitting} className="flex-1 shadow-lg shadow-primary/20 bg-primary font-bold">
                            <Save size={16} className="mr-2" /> 
                            {isEditing ? "Update" : "Publish"}
                        </Button>
                        {isEditing && (
                            <Button type="button" variant="outline" size="icon" className="text-red-500 hover:bg-red-50 border-red-100">
                                <Trash2 size={16} />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Categories & Tags */}
                <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[11px]">Category & Tags</h3>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-500 text-xs">Category</Label>
                            <Controller 
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full bg-slate-50 border-none">
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
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-500 text-xs">Tags</Label>
                            <Input 
                                placeholder="Add a tag..." 
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                className="bg-slate-50 border-none h-10"
                            />
                            <div className="flex flex-wrap gap-2 mt-3">
                                {tagsWatcher.map(tag => (
                                    <span key={tag} className="inline-flex items-center bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold group">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-slate-400 hover:text-red-500">
                                            <X size={10} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Image Box */}
                <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[11px]">Featured Image</h3>
                    
                    {featuredImageIdWatcher ? (
                        <FeaturedImagePreview mediaId={featuredImageIdWatcher} />
                    ) : (
                        <button 
                            type="button"
                            onClick={() => setIsMediaModalOpen(true)}
                            className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-slate-400 hover:text-primary"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                <Plus size={20} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">Select Image</span>
                        </button>
                    )}
                </div>
            </div>

            <MediaModal 
                open={isMediaModalOpen}
                initialSelection={featuredImageIdWatcher}
                onClose={() => setIsMediaModalOpen(false)}
                onSelect={(id) => setValue("featured_image_id", id as string)}
            />
        </form>
    );
}
