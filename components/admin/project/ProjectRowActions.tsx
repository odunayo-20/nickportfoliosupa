"use client";

import React from "react";
import { 
    MoreHorizontal, 
    Pencil, 
    Trash2, 
    Eye, 
    Globe, 
    Star, 
    StarOff,
    ArrowUpRight
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProjectRowActionsProps {
    project: any;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, status: string) => void;
    onToggleFeatured: (id: string, featured: boolean) => void;
}

export function ProjectRowActions({ 
    project, 
    onEdit, 
    onDelete, 
    onToggleStatus,
    onToggleFeatured 
}: ProjectRowActionsProps) {
    const isPublished = project.status === "published";
    const isFeatured = project.is_featured || project.isFeatured;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] p-1 shadow-lg border-slate-200">
                <DropdownMenuItem 
                    onClick={() => onEdit(project.id)}
                    className="gap-2 text-[13px] font-medium cursor-pointer"
                >
                    <Pencil size={14} className="text-slate-400" /> Edit Project
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                    onClick={() => window.location.href = `/admin/project/show/${project.id}`}
                    className="gap-2 text-[13px] font-medium cursor-pointer"
                >
                    <Eye size={14} className="text-slate-400" /> View Details
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                    onClick={() => onToggleStatus(project.id, project.status)}
                    className="gap-2 text-[13px] font-medium cursor-pointer"
                >
                    <Globe size={14} className="text-slate-400" /> 
                    {isPublished ? "Set to Draft" : "Publish Project"}
                </DropdownMenuItem>

                <DropdownMenuItem 
                    onClick={() => onToggleFeatured(project.id, !!project.isFeatured)}
                    className="gap-2 text-[13px] font-medium cursor-pointer"
                >
                    {isFeatured ? (
                        <>
                            <StarOff size={14} className="text-amber-500 fill-amber-500" /> Unmark Featured
                        </>
                    ) : (
                        <>
                            <Star size={14} className="text-amber-500" /> Mark as Featured
                        </>
                    )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                    className="gap-2 text-[13px] font-medium cursor-pointer"
                >
                    <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer">
                        <ArrowUpRight size={14} className="text-slate-400" /> Live Preview
                    </a>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem 
                    onClick={() => onDelete(project.id)}
                    className="gap-2 text-[13px] font-medium text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                    <Trash2 size={14} /> Delete Project
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
