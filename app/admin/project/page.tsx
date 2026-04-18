"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
    Plus, 
    LayoutGrid, 
    CheckCircle2,
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
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                            Projects
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">Manage your portfolio projects.</p>
                    </div>
                    
                    <Link href="/admin/project/create">
                        <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95">
                            <Plus size={16} strokeWidth={2.5} />
                            New Project
                        </button>
                    </Link>
                </div>

                {/* Bento Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2 group hover:border-primary/20 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">All Projects</span>
                            <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <LayoutGrid size={16} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{totalProjects}</p>
                    </div>
                    
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2 group hover:border-emerald-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">Published</span>
                            <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-emerald-600">{publishedCount}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2 group hover:border-amber-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">Featured</span>
                            <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
                                <Star size={16} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-amber-600">{featuredCount}</p>
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
                        onView={(id) => window.location.href = `/admin/project/show/${id}`}
                        onDelete={(id) => setIdsToDelete([id])}
                        onToggleStatus={handleToggleStatus}
                        onToggleFeatured={handleToggleFeatured}
                    />

                    {/* Footer Info */}
                    <div className="px-6 py-3 bg-slate-50/30 flex items-center justify-end border-t border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">
                            Showing {filteredProjects.length} of {totalProjects} projects
                        </p>
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