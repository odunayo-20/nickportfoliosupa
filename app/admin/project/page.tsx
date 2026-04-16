"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
    Plus, 
    LayoutGrid, 
    Lightbulb, 
    Sparkles, 
    Zap,
    Rocket,
    CheckCircle2,
    CircleDashed,
    Star
} from 'lucide-react';
import { toast } from "sonner";

import { ProjectTable } from "@/components/admin/project/ProjectTable";
import { ProjectFilters } from "@/components/admin/project/ProjectFilters";
import { BulkActionsBar } from "@/components/admin/project/BulkActionsBar";
import { DeleteProjectsModal } from "@/components/admin/project/DeleteProjectsModal";
import { supabase } from "@/lib/supabaseClient";
import { deleteProject, bulkDeleteProjects, bulkUpdateProjectStatus, updateProject, getAllProjects } from "@/actions/projects";

export default function ProjectManagementPage() {
    // State
    const [projects, setProjects] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date-desc");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllProjects();
            setProjects(data || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch projects");
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Derived Data
    const categories = useMemo(() => {
        if (!projects) return [];
        const cats = new Set(projects.map(p => p.category).filter(Boolean));
        return Array.from(cats) as string[];
    }, [projects]);

    const filteredProjects = useMemo(() => {
        if (!projects) return [];
        
        let result = projects.filter(project => {
            const matchesSearch = 
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tech_stack?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesStatus = statusFilter === "all" || project.status === statusFilter;
            const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
            
            return matchesSearch && matchesStatus && matchesCategory;
        });

        // Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.updated_at || a.created_at).getTime();
            const dateB = new Date(b.updated_at || b.created_at).getTime();
            switch (sortBy) {
                case "title-asc": return a.title.localeCompare(b.title);
                case "title-desc": return b.title.localeCompare(a.title);
                case "date-asc": return dateA - dateB;
                case "date-desc": default: return dateB - dateA;
            }
        });

        return result;
    }, [projects, searchQuery, statusFilter, categoryFilter, sortBy]);

    // Handlers
    const handleSelectRow = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const handleSelectAll = () => {
        if (selectedIds.size === filteredProjects.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredProjects.map(p => p.id)));
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = (currentStatus === "published" ? "draft" : "published") as "draft" | "published";
        try {
            await updateProject(id, { status: newStatus });
            toast.success(`Project ${newStatus === "published" ? "published" : "set to draft"}`);
            fetchProjects();
        } catch (error) {
            toast.error("Failed to update project status");
        }
    };

    const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
        try {
            await updateProject(id, { is_featured: !currentFeatured });
            toast.success(currentFeatured ? "Removed from featured" : "Marked as featured");
            fetchProjects();
        } catch (error) {
            toast.error("Failed to update featured status");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!idsToDelete) return;
        
        const isBulk = idsToDelete.length > 1;
        try {
            if (isBulk) {
                await bulkDeleteProjects(idsToDelete);
                setSelectedIds(new Set());
            } else {
                await deleteProject(idsToDelete[0]);
            }
            toast.success(isBulk ? `${idsToDelete.length} projects deleted` : "Project deleted");
            fetchProjects();
        } catch (error) {
            toast.error("Deletion failed");
        } finally {
            setIdsToDelete(null);
        }
    };

    const handleBulkStatus = async (status: "draft" | "published") => {
        try {
            await bulkUpdateProjectStatus(Array.from(selectedIds), status);
            toast.success(`${selectedIds.size} projects ${status === "published" ? "published" : "unpublished"}`);
            setSelectedIds(new Set());
            fetchProjects();
        } catch (error) {
            toast.error("Bulk update failed");
        }
    };

    // Stats
    const totalProjects = projects?.length || 0;
    const publishedCount = projects?.filter(p => p.status === "published").length || 0;
    const featuredCount = projects?.filter(p => p.is_featured || p.isFeatured).length || 0;

    return (
        <section className="flex-1 overflow-y-auto bg-slate-50/30">
            <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md">Admin</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                            Project Engine 
                            <Rocket className="text-primary" size={24} />
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">Deploy and manage your architectural masterpieces.</p>
                    </div>
                    
                    <Link href="/admin/project/create">
                        <button className="group relative inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 overflow-hidden">
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                            <Plus size={18} strokeWidth={3} className="text-primary group-hover:scale-110 transition-transform" />
                            New Project
                        </button>
                    </Link>
                </div>

                {/* Bento Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2 group hover:border-primary/20 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Total Build</span>
                            <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <LayoutGrid size={16} />
                            </div>
                        </div>
                        <p className="text-4xl font-black text-slate-900">{totalProjects}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2 group hover:border-emerald-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Live Projects</span>
                            <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <p className="text-4xl font-black text-emerald-500">{publishedCount}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2 group hover:border-amber-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Featured</span>
                            <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
                                <Star size={16} />
                            </div>
                        </div>
                        <p className="text-4xl font-black text-amber-500">{featuredCount}</p>
                    </div>

                    <div className="bg-gradient-to-br from-primary to-indigo-600 p-6 rounded-2xl shadow-lg shadow-primary/20 space-y-2 relative overflow-hidden hidden lg:block">
                        <div className="absolute -right-4 -top-4 opacity-10">
                            <Sparkles size={120} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-white/70">Optimization</span>
                        <p className="text-white font-bold text-sm leading-tight pt-2">Your portfolio is 85% complete. Add 2 more featured projects to boost visibility.</p>
                        <button className="flex items-center gap-1 text-[11px] font-black text-white bg-white/20 px-3 py-1 rounded-full mt-4 hover:bg-white/30 transition-colors">
                            View Insights <Zap size={10} className="fill-white" />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    <ProjectFilters 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        categories={categories}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />

                    <ProjectTable 
                        projects={filteredProjects}
                        selectedIds={selectedIds}
                        onSelectRow={handleSelectRow}
                        onSelectAll={handleSelectAll}
                        onEdit={(id) => window.location.href = `/admin/project/edit/${id}`}
                        onDelete={(id) => setIdsToDelete([id])}
                        onToggleStatus={handleToggleStatus}
                        onToggleFeatured={handleToggleFeatured}
                    />

                    {/* Footer Info */}
                    <div className="px-8 py-4 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
                        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">
                            Deployment Node Active <CheckCircle2 size={12} className="inline ml-1 text-emerald-500" />
                        </p>
                        <p className="text-[12px] text-slate-400 font-medium">
                            Showing {filteredProjects.length} of {totalProjects} projects
                        </p>
                    </div>
                </div>

                {/* Contextual Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <Lightbulb size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">Featured Strategy</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">Featured projects appear at the top of your landing page. Use the "Star" action to highlight your best work.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">Bulk Management</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">Select multiple projects to batch publish or delete. This saves time when managing large inventories.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals & Floating UI */}
            <BulkActionsBar 
                count={selectedIds.size}
                onClear={() => setSelectedIds(new Set())}
                onBulkDelete={() => setIdsToDelete(Array.from(selectedIds))}
                onBulkStatus={handleBulkStatus}
            />

            <DeleteProjectsModal 
                isOpen={idsToDelete !== null}
                onClose={() => setIdsToDelete(null)}
                onConfirm={handleDeleteConfirm}
                count={idsToDelete?.length || 0}
            />
        </section>
    );
}