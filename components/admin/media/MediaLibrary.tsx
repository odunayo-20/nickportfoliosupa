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
        <div className="flex flex-col gap-6 w-full h-full">
            {/* Header Toolbar */}
            {!hideHeader && (
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Media Library</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage and optimize your portfolio assets.</p>
                </div>
                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                    <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
                        <Grid size={18} />
                    </Button>
                    <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("list")}>
                        <List size={18} />
                    </Button>
                </div>
            </div>
            )}

            {/* Actions & Path */}
            <div className="flex items-center justify-between bg-card p-4 rounded-2xl shadow-sm border">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm font-medium">
                    <button onClick={() => navigateToBreadcrumb(-1)} className="hover:bg-muted p-1.5 rounded-md flex items-center transition-colors">
                        <Home size={16} />
                    </button>
                    {folderPath.map((folder, idx) => (
                        <React.Fragment key={folder.id}>
                            <ChevronRight size={14} className="text-muted-foreground" />
                            <button 
                                onClick={() => navigateToBreadcrumb(idx)}
                                className="hover:bg-muted px-2 py-1.5 rounded-md transition-colors"
                            >
                                {folder.name}
                            </button>
                        </React.Fragment>
                    ))}
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

                {/* Upload & Create Folder */}
                <div className="flex items-center gap-3">
                    <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <FolderPlus size={16} /> New Folder
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

                    <Button size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        <UploadCloud size={16} /> {isUploading ? "Uploading..." : "Upload Media"}
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

            {/* Main Content Area */}
            <div className="grid grid-cols-12 gap-6 min-h-[500px]">
                {/* Grid Area */}
                <div className={`${activeMediaDetails ? 'col-span-8' : 'col-span-12'} flex flex-col gap-6`}>
                    {isDataLoading ? (
                        <div className="grid grid-cols-4 gap-4">
                            {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
                        </div>
                    ) : (
                        <ScrollArea className="h-full">
                            {/* Folders */}
                            {folders && folders.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Folders</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {folders.map(folder => (
                                            <div 
                                                key={folder.id} 
                                                onClick={() => navigateToFolder(folder.id, folder.name)}
                                                className="group flex items-center justify-between p-4 bg-card rounded-xl border hover:border-primary/50 hover:shadow-sm cursor-pointer transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Folder className="text-primary/70 fill-primary/10" size={24} />
                                                    <span className="font-medium text-sm">{folder.name}</span>
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
                            <div>
                                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Files</h3>
                                {media && media.length === 0 && folders?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl border-muted">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                            <UploadCloud size={32} className="text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-bold">This folder is empty</h3>
                                        <p className="text-muted-foreground text-sm mt-1 mb-4">Upload media or create a new folder to get started</p>
                                        <Button onClick={() => fileInputRef.current?.click()}>Upload Files</Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {media?.map(file => {
                                            const isSelected = selectedMedia.has(file.id);
                                            const isImage = file.type === "image";
                                            return (
                                                <div 
                                                    key={file.id}
                                                    onClick={() => setActiveMediaDetails(file)}
                                                    className={`group relative aspect-square bg-card rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                                                >
                                                    {isImage ? (
                                                        <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-muted" />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
                                                            {file.type === "video" ? <Video size={48} className="text-muted-foreground/50" /> : <FileText size={48} className="text-muted-foreground/50" />}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Selection Checkbox */}
                                                    <div className={`absolute top-3 left-3 w-5 h-5 rounded-md border flex items-center justify-center transition-opacity bg-background/80 backdrop-blur-sm ${isSelected ? 'opacity-100 border-primary bg-primary text-primary-foreground' : 'opacity-0 group-hover:opacity-100 border-muted-foreground'}`} onClick={(e) => toggleMediaSelection(file.id, e)}>
                                                        {isSelected && <Check size={14} strokeWidth={3} />}
                                                    </div>

                                                    {/* Gradient Overlay & Name */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                                                        <p className="text-xs text-white font-medium truncate">{file.name}</p>
                                                        <p className="text-[10px] text-white/70 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
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
                    <div className="col-span-4 sticky top-0 h-fit bg-card rounded-3xl p-6 border shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold">Asset Details</h3>
                            <Button variant="ghost" size="icon" onClick={() => setActiveMediaDetails(null)}>
                                <span className="sr-only">Close</span>
                                ✕
                            </Button>
                        </div>

                        <div className="aspect-video bg-muted rounded-2xl mb-6 overflow-hidden flex flex-col items-center justify-center relative">
                            {activeMediaDetails.type === "image" ? (
                                <img src={activeMediaDetails.url} alt={activeMediaDetails.name} className="w-full h-full object-contain bg-black/5" />
                            ) : (
                                <FileText size={64} className="text-muted-foreground/30" />
                            )}
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted p-3 rounded-xl border">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">File Size</p>
                                    <p className="text-sm font-semibold">{(activeMediaDetails.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <div className="bg-muted p-3 rounded-xl border">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Type</p>
                                    <p className="text-sm font-semibold capitalize">{activeMediaDetails.type}</p>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Title</label>
                                <Input value={activeMediaDetails.name} readOnly className="bg-muted border-none" />
                            </div>

                            <div className="pt-4 flex flex-col gap-3 mt-auto">
                                <Button variant="secondary" className="w-full gap-2" onClick={() => {
                                    navigator.clipboard.writeText(activeMediaDetails.url);
                                    // toast.success("URL copied to clipboard");
                                }}>
                                    <LinkIcon size={16} /> Copy URL
                                </Button>
                                <Button variant="destructive" className="w-full gap-2" onClick={async () => {
                                    await deleteMediaAction(activeMediaDetails.id, activeMediaDetails.storage_path);
                                    setActiveMediaDetails(null);
                                    fetchData();
                                }}>
                                    <Trash2 size={16} /> Delete Asset
                                </Button>
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
