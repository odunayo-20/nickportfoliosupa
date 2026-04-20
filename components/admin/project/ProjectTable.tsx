"use client";

import React from "react";
import Link from "next/link";
import { 
    Image as ImageIcon, 
    Star, 
    Calendar, 
    Layers, 
    ExternalLink,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectRowActions } from "./ProjectRowActions";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectTableProps {
    projects: any[] | undefined;
    selectedIds: Set<string>;
    onSelectRow: (id: string) => void;
    onSelectAll: () => void;
    onEdit: (id: string) => void;
    onView: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, status: string) => void;
    onToggleFeatured: (id: string, featured: boolean) => void;
}

export function ProjectTable({ 
    projects, 
    selectedIds, 
    onSelectRow, 
    onSelectAll,
    onEdit,
    onView,
    onDelete,
    onToggleStatus,
    onToggleFeatured
}: ProjectTableProps) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (projects === undefined) {
        return <LoadingSkeleton />;
    }

    if (projects.length === 0) {
        return <EmptyState />;
    }

    const allSelected = projects.length > 0 && selectedIds.size === projects.length;

    return (
        <div className="w-full overflow-hidden">
            <table className="w-full border-separate border-spacing-0">
                <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="w-12 px-6 py-4 text-left">
                            <input 
                                type="checkbox" 
                                checked={allSelected}
                                onChange={onSelectAll}
                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                            />
                        </th>
                        <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Project</th>
                        {/* <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Details</th> */}
                        <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Tech Stack</th>
                        <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {projects.map((project) => {
                        const isSelected = selectedIds.has(project.id);
                        const isPublished = project.status === "published";
                        const isFeatured = project.is_featured || project.isFeatured;
                        const dateStr = isMounted ? new Date(project.updated_at || project.updatedAt || project.created_at || project.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric"
                        }) : "";

                        return (
                            <tr 
                                key={project.id} 
                                className={`group hover:bg-slate-50/50 transition-all duration-200 ${isSelected ? 'bg-primary/5' : ''}`}
                            >
                                <td className="px-6 py-4">
                                    <input 
                                        type="checkbox" 
                                        checked={isSelected}
                                        onChange={() => onSelectRow(project.id)}
                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {project.imageUrl ? (
                                                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={20} className="text-slate-300" />
                                            )}
                                            {isFeatured && (
                                                <div className="absolute -top-1 -right-1 bg-amber-400 p-0.5 rounded-full border-2 border-white shadow-sm">
                                                    <Star size={8} className="text-white fill-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => onView(project.id)}
                                                    className="text-[14px] font-bold text-slate-900 hover:text-primary transition-colors truncate block text-left"
                                                >
                                                    {project.title}
                                                </button>
                                                {isFeatured && (
                                                    <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100 uppercase tracking-tight">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                                    <Layers size={10} /> {project.category || "General"}
                                                </span>
                                                <span className="text-slate-200">|</span>
                                                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                                    <Clock size={10} /> {dateStr}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                {/* <td className="px-6 py-4 hidden md:table-cell">
                                    <p className="text-[13px] text-slate-500 line-clamp-1 max-w-[200px]">
                                        {project.description}
                                    </p>
                                </td> */}
                                <td className="px-6 py-4 hidden lg:table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {console.log(project.tech_stack)}
                                        {project.tech_stack?.slice(0, 3).map((tech: string) => (
                                            <span 
                                                key={tech} 
                                                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-tight"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.techStack?.length > 3 && (
                                            <span className="text-[10px] text-slate-400 font-bold">+{project.techStack.length - 3}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => onToggleStatus(project.id, project.status)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                                            isPublished
                                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                                        {isPublished ? "Published" : "Draft"}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <ProjectRowActions 
                                        project={project}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onToggleStatus={onToggleStatus}
                                        onToggleFeatured={onToggleFeatured}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-6 px-6 py-4">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-200 mx-6 my-8">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No projects found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">
                Get started by creating your first showcase project.
            </p>
            <Link href="/admin/project/create">
                <button className="mt-6 px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-sm hover:bg-primary-dim transition-all active:scale-95">
                    Launch New Project
                </button>
            </Link>
        </div>
    );
}
