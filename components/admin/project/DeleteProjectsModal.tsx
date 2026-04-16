"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface DeleteProjectsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    count: number;
}

export function DeleteProjectsModal({ isOpen, onClose, onConfirm, count }: DeleteProjectsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <Trash2 className="text-red-600" size={24} />
                    </div>
                    <DialogTitle className="text-xl font-bold">Delete {count > 1 ? `${count} Projects` : "Project"}</DialogTitle>
                    <DialogDescription className="text-slate-500 pt-2">
                        Are you sure you want to delete {count > 1 ? "these projects" : "this project"}? This action is permanent and cannot be undone. 
                        {count > 1 && " All selected projects and their associated data will be removed."}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-8">
                    <Button variant="outline" onClick={onClose} className="border-slate-200">
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} className="gap-2 bg-red-600 hover:bg-red-700">
                        <Trash2 size={16} /> Delete {count > 1 ? "Projects" : "Project"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
