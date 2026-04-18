import React from "react";
import { getProjectById } from "@/actions/projects";
import { 
    AlertCircle, 
    ChevronLeft, 
    Calendar, 
    Layers, 
    Star, 
    Globe, 
    Code, 
    ExternalLink, 
    Clock, 
    CheckCircle2, 
    FileText,
    Pencil,
    Layout
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { getMediaByIds } from "@/actions/media";

export default async function ShowProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProjectById(id);

    if (project === null) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 text-red-500">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Project Not Found</h2>
                <p className="text-slate-500 font-medium text-sm mt-2">The project you're looking for doesn't exist or has been removed.</p>
                <div className="mt-8">
                    <Link 
                        href="/admin/project"
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                    >
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    const isPublished = project.status === "published";
    const isFeatured = project.is_featured || project.isFeatured;
    const galleryItems = project.media_ids ? await getMediaByIds(project.media_ids) : [];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header / Navigation */}
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
                            Project Details
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={`/admin/project/edit/${id}`}>
                            <Button variant="outline" size="sm" className="font-bold gap-2">
                                <Pencil size={16} /> Edit Project
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Content (Left 2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Summary Card */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            {project.imageUrl && (
                                <div className="aspect-video w-full relative group">
                                    <img 
                                        src={project.imageUrl} 
                                        alt={project.title} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    {isFeatured && (
                                        <div className="absolute top-6 left-6 px-4 py-2 bg-amber-400 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                                            <Star size={14} className="fill-white" /> Featured
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <div className="p-8 md:p-10 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full uppercase tracking-wider">
                                            {project.category || "General"}
                                        </span>
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                                            isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                                            {isPublished ? "Published" : "Draft"}
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                        {project.title}
                                    </h2>
                                    
                                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>

                                {project.tech_stack && project.tech_stack.length > 0 && (
                                    <div className="pt-4 flex flex-wrap gap-2">
                                        {project.tech_stack.map((tech: string) => (
                                            <span 
                                                key={tech} 
                                                className="px-3 py-1.5 bg-slate-50 text-slate-900 text-xs font-bold rounded-xl border border-slate-100 shadow-sm"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rich Content Card */}
                        {project.content && (
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30">
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <FileText size={16} className="text-slate-400" /> Project Narrative
                                    </h3>
                                </div>
                                <div 
                                    className="p-8 md:p-10 prose prose-slate max-w-none prose-headings:font-black prose-a:text-primary prose-img:rounded-2xl"
                                    dangerouslySetInnerHTML={{ __html: project.content }}
                                />
                            </div>
                        )}

                        {/* Gallery Card */}
                        {galleryItems.length > 0 && (
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30">
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <Layout size={16} className="text-slate-400" /> Visual Gallery
                                    </h3>
                                </div>
                                <div className="p-8">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {galleryItems.map((item: any) => (
                                            <div key={item.id} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 group cursor-zoom-in">
                                                <img 
                                                    src={item.url} 
                                                    alt="Gallery Item" 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Right 1/3) */}
                    <div className="space-y-6">
                        
                        {/* Meta Info Card */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Created On</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {format(new Date(project.created_at), "MMMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Modified</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {format(new Date(project.updated_at), "MMM d, yyyy 'at' h:mm a")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Globe size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Public Slug</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">
                                            /{project.slug}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">External Assets</h3>
                                
                                {project.github_url && (
                                    <a 
                                        href={project.github_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Code size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                                            <span className="text-sm font-bold text-slate-700">Source Code</span>
                                        </div>
                                        <ExternalLink size={14} className="text-slate-300" />
                                    </a>
                                )}

                                {project.live_url && (
                                    <a 
                                        href={project.live_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Globe size={18} className="text-primary" />
                                            <span className="text-sm font-bold text-primary">Live Preview</span>
                                        </div>
                                        <ExternalLink size={14} className="text-primary/40" />
                                    </a>
                                )}
                                
                                {!project.github_url && !project.live_url && (
                                    <p className="text-xs text-slate-400 font-medium italic">No external links provided.</p>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats / Info */}
                        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6 shadow-xl shadow-slate-200">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                <CheckCircle2 size={24} className="text-emerald-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Project Audit</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    All data points have been verified. This project is ready for showcase in your public portfolio.
                                </p>
                            </div>
                            <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold h-12 rounded-2xl">
                                Share Externally
                            </Button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
