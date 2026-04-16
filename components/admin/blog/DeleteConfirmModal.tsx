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

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Blog Post</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this post? This action cannot be undone and will permanently remove the post and its data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm} className="gap-2">
                        <Trash2 size={16} /> Delete Post
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
