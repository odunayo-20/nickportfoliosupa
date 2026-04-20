"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
    getFolders, 
    getMediaByFolder, 
    createFolder as createFolderAction, 
    deleteFolder as deleteFolderAction, 
    renameFolder as renameFolderAction,
    createMedia as createMediaAction,
    deleteMedia as deleteMediaAction
} from "@/actions/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
    Folder, 
    Image as ImageIcon, 
    FileText, 
    Video, 
    UploadCloud, 
    MoreVertical, 
    Plus, 
    ChevronRight, 
    Grid, 
    List, 
    Check, 
    Link as LinkIcon, 
    Trash2, 
    Home, 
    FolderPlus 
} from "lucide-react";

interface MediaLibraryProps {
    onSelect?: (mediaIds: string[]) => void;
    selectionMode?: boolean;
    multiple?: boolean;
    initialSelection?: string[];
    confirmButtonText?: string;
    showTypeFilters?: boolean;
    externalSelectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
    hideConfirmBar?: boolean;
    hideHeader?: boolean;
}

export function MediaLibrary({ 
    onSelect, 
    selectionMode = false, 
    multiple = false,
    initialSelection = [],
    confirmButtonText = "Confirm Selection",
    showTypeFilters = true,
    externalSelectedIds,
    onSelectionChange,
    hideConfirmBar = false,
    hideHeader = false
}: MediaLibraryProps) {
    const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
    const [folderPath, setFolderPath] = useState<{ id: string, name: string }[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set(initialSelection));

    // Data State
    const [folders, setFolders] = useState<any[]>([]);
    const [media, setMedia] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [foldersData, mediaData] = await Promise.all([
                getFolders(currentFolderId),
                getMediaByFolder(currentFolderId)
            ]);
            setFolders(foldersData);
            setMedia(mediaData);
        } catch (error) {
            console.error("Failed to fetch media data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentFolderId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Synchronize if external control is used
    useEffect(() => {
        if (externalSelectedIds) {
            setSelectedMedia(new Set(externalSelectedIds));
        }
    }, [externalSelectedIds]);

    const handleSelectionChange = (newSet: Set<string>) => {
        setSelectedMedia(newSet);
        if (onSelectionChange) {
            onSelectionChange(Array.from(newSet));
        }
    };
    const [isUploading, setIsUploading] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [renameFolderDetails, setRenameFolderDetails] = useState<{ id: string, name: string } | null>(null);
    const [activeMediaDetails, setActiveMediaDetails] = useState<any | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        await createFolderAction(newFolderName, currentFolderId);
        setNewFolderName("");
        setIsNewFolderOpen(false);
        fetchData();
    };

    const handleRenameFolder = async () => {
        if (!renameFolderDetails || !renameFolderDetails.name.trim()) return;
        await renameFolderAction(renameFolderDetails.id, renameFolderDetails.name);
        setRenameFolderDetails(null);
        fetchData();
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        setIsUploading(true);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                const storagePath = currentFolderId ? `${currentFolderId}/${fileName}` : fileName;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("media")
                    .upload(storagePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from("media")
                    .getPublicUrl(storagePath);

                await createMediaAction({
                    name: file.name,
                    storage_path: storagePath,
                    url: publicUrl,
                    type: file.type.split('/')[0],
                    size: file.size,
                    folder_id: currentFolderId,
                    hash: file.name + file.size,
                });
            } catch (err) {
                console.error("Upload failed", err);
            }
        }
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchData();
    };

    const navigateToFolder = (folderId: string, name: string) => {
        setCurrentFolderId(folderId);
        setFolderPath(prev => [...prev, { id: folderId, name }]);
        setActiveMediaDetails(null);
    };

    const navigateToBreadcrumb = (index: number) => {
        if (index === -1) {
            setCurrentFolderId(undefined);
            setFolderPath([]);
        } else {
            const dest = folderPath[index];
            setCurrentFolderId(dest.id);
            setFolderPath(folderPath.slice(0, index + 1));
        }
        setActiveMediaDetails(null);
    };

    const toggleMediaSelection = (mediaId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSet = new Set(selectedMedia);
        if (newSet.has(mediaId)) {
            newSet.delete(mediaId);
        } else {
            if (!multiple && selectionMode) {
                newSet.clear();
            }
            newSet.add(mediaId);
        }
        handleSelectionChange(newSet);
    };

    // Render logic
    const isDataLoading = isLoading;

    return (
        <div className="flex flex-col gap-6 w-full h-full p-4 sm:p-6 md:p-8">
            {/* Header Toolbar */}
            {!hideHeader && (
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Media Library</h1>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">Manage and optimize your portfolio assets.</p>
                </div>
                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg self-end sm:self-auto">
                    <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("grid")} className="h-8 w-8 sm:h-10 sm:w-10">
                        <Grid size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </Button>
                    <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("list")} className="h-8 w-8 sm:h-10 sm:w-10">
                        <List size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </Button>
                </div>
            </div>
            )}

            {/* Actions & Path */}
            <div className="flex flex-col gap-4 bg-card p-4 rounded-2xl shadow-sm border">
                <div className="flex items-center justify-between gap-4">
                    {/* Breadcrumbs - Scrollable on mobile */}
                    <div className="flex items-center gap-1 text-sm font-medium overflow-x-auto no-scrollbar pb-1">
                        <button onClick={() => navigateToBreadcrumb(-1)} className="hover:bg-muted p-1.5 rounded-md flex items-center transition-colors flex-shrink-0">
                            <Home size={16} />
                        </button>
                        {folderPath.map((folder, idx) => (
                            <React.Fragment key={folder.id}>
                                <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
                                <button 
                                    onClick={() => navigateToBreadcrumb(idx)}
                                    className="hover:bg-muted px-2 py-1.5 rounded-md transition-colors whitespace-nowrap flex-shrink-0"
                                >
                                    {folder.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 px-3 gap-2">
                                    <FolderPlus size={16} /> <span className="hidden sm:inline">New Folder</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Folder</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <Input 
                                        placeholder="Folder name" 
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsNewFolderOpen(false)}>Cancel</Button>
                                    <Button onClick={handleCreateFolder}>Create</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button size="sm" className="h-9 px-3 gap-2" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                            <UploadCloud size={16} /> <span className="hidden sm:inline">{isUploading ? "Uploading..." : "Upload Media"}</span>
                            <span className="sm:hidden">{isUploading ? "..." : "Upload"}</span>
                        </Button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            multiple 
                            onChange={handleFileUpload} 
                            accept="image/*,video/*,.pdf"
                        />
                    </div>
                </div>

                {/* Rename Folder Dialog */}
                <Dialog open={!!renameFolderDetails} onOpenChange={(open) => !open && setRenameFolderDetails(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rename Folder</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <Input 
                                placeholder="Folder name" 
                                value={renameFolderDetails?.name || ""}
                                onChange={(e) => setRenameFolderDetails(prev => prev ? { ...prev, name: e.target.value } : null)}
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setRenameFolderDetails(null)}>Cancel</Button>
                            <Button onClick={handleRenameFolder}>Rename</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 min-h-[500px]">
                {/* Grid Area */}
                <div className={`${activeMediaDetails ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'} flex flex-col gap-6 order-2 lg:order-1`}>
                    {isDataLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
                        </div>
                    ) : (
                        <ScrollArea className="h-full">
                            {/* Folders */}
                            {folders && folders.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-[10px] font-bold mb-4 text-muted-foreground uppercase tracking-[0.2em] px-1">Folders</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                                        {folders.map(folder => (
                                            <div 
                                                key={folder.id} 
                                                onClick={() => navigateToFolder(folder.id, folder.name)}
                                                className="group flex items-center justify-between p-3.5 bg-card rounded-xl border hover:border-primary/40 hover:shadow-sm cursor-pointer transition-all active:scale-95"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="p-2 bg-primary/5 rounded-lg">
                                                        <Folder className="text-primary/70 fill-primary/10" size={20} />
                                                    </div>
                                                    <span className="font-semibold text-sm truncate">{folder.name}</span>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                                                            e.stopPropagation();
                                                            setRenameFolderDetails({ id: folder.id, name: folder.name });
                                                        }}>
                                                            <Folder className="mr-2" size={16} /> Rename
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={async (e) => {
                                                            e.stopPropagation();
                                                            await deleteFolderAction(folder.id);
                                                            fetchData();
                                                        }}>
                                                            <Trash2 size={16} className="mr-2"/> Delete Folder
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Media Files */}
                            <div className="pb-24 lg:pb-10">
                                <h3 className="text-[10px] font-bold mb-4 text-muted-foreground uppercase tracking-[0.2em] px-1">Files</h3>
                                {media && media.length === 0 && folders?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-3xl border-muted bg-slate-50/10">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                                            <ImageIcon size={32} className="text-slate-200" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800">This folder is empty</h3>
                                        <p className="text-muted-foreground text-sm mt-1 mb-6 max-w-[240px]">Upload media or create a new folder to get started</p>
                                        <Button onClick={() => fileInputRef.current?.click()} className="rounded-xl shadow-lg border-2 border-primary/20">Upload Files</Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
                                        {media?.map(file => {
                                            const isSelected = selectedMedia.has(file.id);
                                            const isImage = file.type === "image";
                                            return (
                                                <div 
                                                    key={file.id}
                                                    onClick={() => setActiveMediaDetails(file)}
                                                    className={`group relative aspect-square bg-white rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${isSelected ? 'border-primary ring-2 ring-primary/20 transform scale-[0.98]' : 'border-transparent hover:border-primary/20'}`}
                                                >
                                                    {isImage ? (
                                                        <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-slate-50" />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
                                                            {file.type === "video" ? <Video size={40} className="text-slate-300" /> : <FileText size={40} className="text-slate-300" />}
                                                            <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{file.type}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Selection Checkbox */}
                                                    <div className={`absolute top-3 left-3 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all bg-white/90 backdrop-blur-sm z-10 ${isSelected ? 'border-primary bg-primary text-white scale-110 shadow-lg' : 'opacity-0 group-hover:opacity-100 border-white/50 shadow-sm'}`} onClick={(e) => toggleMediaSelection(file.id, e)}>
                                                        {isSelected && <Check size={14} strokeWidth={4} />}
                                                    </div>

                                                    {/* Gradient Overlay & Name */}
                                                    <div className="absolute inset-x-0 bottom-0 p-3 pb-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                        <p className="text-[11px] text-white font-bold truncate">{file.name}</p>
                                                        <p className="text-[9px] text-white/70 font-medium uppercase tracking-tighter mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {/* Sidebar Details Pane */}
                {activeMediaDetails && (
                    <div className="lg:col-span-4 xl:col-span-3 order-1 lg:order-2">
                        <div className="sticky top-6 bg-card rounded-3xl p-5 md:p-6 border shadow-xl flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold">Asset Details</h3>
                                <Button variant="ghost" size="icon" onClick={() => setActiveMediaDetails(null)} className="h-8 w-8 rounded-full hover:bg-slate-100">
                                    <span className="sr-only">Close</span>
                                    ✕
                                </Button>
                            </div>

                            <div className="aspect-square bg-slate-50 rounded-2xl mb-6 overflow-hidden flex flex-col items-center justify-center relative border border-slate-100 shadow-inner">
                                {activeMediaDetails.type === "image" ? (
                                    <img src={activeMediaDetails.url} alt={activeMediaDetails.name} className="w-full h-full object-contain p-2" />
                                ) : (
                                    <FileText size={48} className="text-slate-200" />
                                )}
                            </div>

                            <div className="space-y-5 flex-1">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-0.5 mb-1">Size</p>
                                        <p className="text-xs font-bold text-slate-700">{(activeMediaDetails.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-0.5 mb-1">Type</p>
                                        <p className="text-xs font-bold text-slate-700 capitalize">{activeMediaDetails.type}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">File Name</label>
                                    <div className="p-3 bg-slate-50 rounded-xl text-xs font-medium text-slate-600 border border-slate-100 break-all">
                                        {activeMediaDetails.name}
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col gap-2 mt-auto">
                                    <Button variant="secondary" className="w-full gap-2 rounded-xl h-11 text-xs font-bold shadow-sm" onClick={() => {
                                        navigator.clipboard.writeText(activeMediaDetails.url);
                                    }}>
                                        <LinkIcon size={16} /> Copy Direct Link
                                    </Button>
                                    <Button variant="destructive" className="w-full gap-2 rounded-xl h-11 text-xs font-bold shadow-sm" onClick={async () => {
                                        await deleteMediaAction(activeMediaDetails.id, activeMediaDetails.storage_path);
                                        setActiveMediaDetails(null);
                                        fetchData();
                                    }}>
                                        <Trash2 size={16} /> Delete Permanently
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Selection Toolbar (if in selection mode and items selected) */}
            {selectionMode && selectedMedia.size > 0 && !hideConfirmBar && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-5">
                    <span className="font-semibold text-sm">{selectedMedia.size} asset(s) selected</span>
                    <Button variant="secondary" onClick={() => {
                        if (onSelect) onSelect(Array.from(selectedMedia));
                    }}>
                        {confirmButtonText}
                    </Button>
                </div>
            )}
        </div>
    );
}
