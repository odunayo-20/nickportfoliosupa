"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
    Plus, 
    LayoutGrid, 
    CheckCircle2,
    Star,
    ChevronLeft,
    ChevronRight,
    Search as SearchIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { ProjectTable } from "@/components/admin/project/ProjectTable";
import { ProjectFilters } from "@/components/admin/project/ProjectFilters";
import { BulkActionsBar } from "@/components/admin/project/BulkActionsBar";
import { DeleteProjectsModal } from "@/components/admin/project/DeleteProjectsModal";
import { supabase } from "@/lib/supabaseClient";
import { deleteProject, bulkDeleteProjects, bulkUpdateProjectStatus, updateProject, getAllProjects } from "@/actions/projects";
import { getCategories } from "@/actions/categories";

export default function ProjectManagementPage() {
    // State
    const [projects, setProjects] = useState<any[]>([]);
    const [dbCategories, setDbCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date-desc");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [projectsData, categoriesData] = await Promise.all([
                getAllProjects(),
                getCategories(),
            ]);
            setProjects(projectsData || []);
            setDbCategories(categoriesData || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data");
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Derived Data
    const categories = useMemo(() => {
        return dbCategories.map(c => c.name);
    }, [dbCategories]);

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

    // Pagination
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const paginatedProjects = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProjects, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, categoryFilter]);

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
            fetchData();
        } catch (error) {
            toast.error("Failed to update project status");
        }
    };

    const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
        try {
            await updateProject(id, { is_featured: !currentFeatured });
            toast.success(currentFeatured ? "Removed from featured" : "Marked as featured");
            fetchData();
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
            fetchData();
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
            fetchData();
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
                        projects={paginatedProjects}
                        selectedIds={selectedIds}
                        onSelectRow={handleSelectRow}
                        onSelectAll={handleSelectAll}
                        onEdit={(id) => window.location.href = `/admin/project/edit/${id}`}
                        onView={(id) => window.location.href = `/admin/project/show/${id}`}
                        onDelete={(id) => {
                            const project = projects.find(p => p.id === id);
                            toast(`Delete "${project?.title}"?`, {
                                description: "This will permanently remove the project.",
                                action: {
                                    label: "Delete",
                                    onClick: async () => {
                                        try {
                                            await deleteProject(id);
                                            toast.success("Project deleted");
                                            fetchData();
                                        } catch (error) {
                                            toast.error("Deletion failed");
                                        }
                                    }
                                }
                            });
                        }}
                        onToggleStatus={handleToggleStatus}
                        onToggleFeatured={handleToggleFeatured}
                    />

                    {/* Footer with Pagination */}
                    <div className="px-6 py-4 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                        <p className="text-[12px] text-slate-500 font-medium">
                            Showing <span className="font-bold text-slate-900">{Math.min(filteredProjects.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}</span> to <span className="font-bold text-slate-900">{Math.min(filteredProjects.length, currentPage * ITEMS_PER_PAGE)}</span> of <span className="font-bold text-slate-900">{filteredProjects.length}</span> projects
                        </p>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft size={16} />
                                </Button>

                                <div className="flex items-center gap-1 mx-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        const isVisible = totalPages <= 7 || 
                                            page === 1 || 
                                            page === totalPages || 
                                            (page >= currentPage - 1 && page <= currentPage + 1);
                                        
                                        if (!isVisible) {
                                            if (page === 2 || page === totalPages - 1) {
                                                return <span key={page} className="text-slate-300 px-1">...</span>;
                                            }
                                            return null;
                                        }

                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`min-w-[32px] h-8 px-2 text-[12px] font-bold rounded-lg transition-all ${
                                                    currentPage === page 
                                                        ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                                                        : "text-slate-500 hover:bg-slate-100"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        )}
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
