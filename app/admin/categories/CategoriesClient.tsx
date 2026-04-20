"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory, updateCategory, deleteCategory } from "@/actions/categories";

type Category = { id: string; name: string; slug: string; created_at: string };

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [newName, setNewName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
    const paginatedCategories = categories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    async function handleCreate() {
        if (!newName.trim()) return;
        setIsCreating(true);
        try {
            const created = await createCategory(newName);
            setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
            setNewName("");
            toast.success(`Category "${created.name}" created`);
        } catch (e: any) {
            toast.error(e.message || "Failed to create category");
        } finally {
            setIsCreating(false);
        }
    }

    async function handleUpdate(id: string) {
        if (!editingName.trim()) return;
        try {
            const updated = await updateCategory(id, editingName);
            setCategories((prev) =>
                prev.map((c) => (c.id === id ? updated : c)).sort((a, b) => a.name.localeCompare(b.name))
            );
            setEditingId(null);
            toast.success("Category updated");
        } catch (e: any) {
            toast.error(e.message || "Failed to update category");
        }
    }

    async function handleDelete(id: string) {
        setDeletingId(id);
        try {
            await deleteCategory(id);
            setCategories((prev) => prev.filter((c) => c.id !== id));
            if (paginatedCategories.length === 1 && currentPage > 1) {
                setCurrentPage((prev) => prev - 1);
            }
            toast.success("Category deleted");
        } catch (e: any) {
            toast.error(e.message || "Failed to delete category");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="w-full px-6 md:px-8 py-10 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                    <Tag className="w-6 h-6 text-indigo-500" /> Categories
                </h1>
                <p className="text-sm text-slate-400 mt-1">Manage categories used across Blog and Projects.</p>
            </div>

            {/* Create Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Add New Category</h2>
                <div className="flex gap-3">
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        placeholder="e.g. UI Design"
                        className="bg-slate-50 border-slate-200 border h-10"
                    />
                    <Button
                        onClick={handleCreate}
                        disabled={isCreating || !newName.trim()}
                        className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        {isCreating ? "Adding..." : "Add"}
                    </Button>
                </div>
            </div>

            {/* Category List */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        All Categories ({categories.length})
                    </h2>
                </div>
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                        <Tag className="w-10 h-10 mb-3" />
                        <p className="text-sm font-medium">No categories yet</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {paginatedCategories.map((cat) => (
                            <li key={cat.id} className="flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors group">
                                {editingId === cat.id ? (
                                    <>
                                        <Input
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleUpdate(cat.id);
                                                if (e.key === "Escape") setEditingId(null);
                                            }}
                                            className="flex-1 h-8 text-sm bg-slate-50 border-indigo-300 border focus:border-indigo-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleUpdate(cat.id)}
                                            className="text-green-600 hover:text-green-700 p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                                            title="Save"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                            title="Cancel"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800">{cat.name}</p>
                                            <p className="text-xs text-slate-400 font-mono">/{cat.slug}</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}
                                                className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                disabled={deletingId === cat.id}
                                                className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                
                {/* Pagination Controls */}
                {categories.length > 0 && (
                    <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/30">
                        <p className="text-[12px] text-slate-500 font-medium">
                            Showing <span className="font-bold text-slate-900">{Math.min(categories.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}</span> to <span className="font-bold text-slate-900">{Math.min(categories.length, currentPage * ITEMS_PER_PAGE)}</span> of <span className="font-bold text-slate-900">{categories.length}</span> categories
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
                )}
            </div>
        </div>
    );
}
