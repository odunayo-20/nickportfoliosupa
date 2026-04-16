"use client";

import React from "react";
import { Search, Filter, ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProjectFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    categoryFilter: string;
    setCategoryFilter: (category: string) => void;
    categories: string[];
    sortBy: string;
    setSortBy: (sort: string) => void;
}

export function ProjectFilters({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
    sortBy,
    setSortBy
}: ProjectFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 px-6 bg-white border-b border-slate-100">
            {/* Search */}
            <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                <Input
                    placeholder="Search titles, descriptions, stack..."
                    className="pl-10 h-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all ring-offset-0 focus:ring-2 focus:ring-primary/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-slate-400" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-10 w-[130px] bg-white border-slate-200 text-xs font-bold text-slate-600">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" className="text-xs font-semibold">Any Status</SelectItem>
                            <SelectItem value="published" className="text-xs font-semibold">Published</SelectItem>
                            <SelectItem value="draft" className="text-xs font-semibold">Drafts</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-10 w-[140px] bg-white border-slate-200 text-xs font-bold text-slate-600">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all" className="text-xs font-semibold">All Categories</SelectItem>
                        {categories.map(cat => (
                            <SelectItem key={cat} value={cat} className="text-xs font-semibold">{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

                <div className="flex items-center gap-2">
                    <ArrowUpDown size={14} className="text-slate-400" />
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-10 w-[150px] bg-white border-slate-200 text-xs font-bold text-slate-600">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date-desc" className="text-xs font-semibold">Newest First</SelectItem>
                            <SelectItem value="date-asc" className="text-xs font-semibold">Oldest First</SelectItem>
                            <SelectItem value="title-asc" className="text-xs font-semibold">Title (A-Z)</SelectItem>
                            <SelectItem value="title-desc" className="text-xs font-semibold">Title (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
