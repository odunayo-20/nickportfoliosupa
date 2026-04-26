"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Pencil,
  FileText,
  File,
  Download,
  Trash2,
  Upload,
  Terminal,
  X,
  PlusCircle,
  Link as LinkIcon,
  Code,
  Briefcase,
  Share2,
  Globe,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/actions/profile";
import { signOut, changePassword } from "@/actions/auth";

import { Mail, LogOut, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRef } from "react";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getMediaByIds } from "@/actions/media";
import { formatDistanceToNow } from "date-fns";

interface ProfileFormData {
    name: string;
    email: string;
    title: string;
    bio: string;
    avatar_url: string;
    resume_url: string;
    resume_name: string;
    skills: string[];
    social_links: {
        github: string;
        linkedin: string;
        twitter: string;
        website: string;
        [key: string]: string;
    };
}

export default function ProfilePage() {
    const [profileData, setProfileData] = useState<any>(null);
    const [formData, setFormData] = useState<ProfileFormData>({
        name: "",
        email: "",
        title: "",
        bio: "",
        avatar_url: "",
        resume_url: "",
        resume_name: "",
        skills: [],
        social_links: {
            github: "",
            linkedin: "",
            twitter: "",
            website: "",
        }
    });

    const [newSkill, setNewSkill] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [pickerTarget, setPickerTarget] = useState<"avatar" | "resume">("avatar");
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isDownloadingCv, setIsDownloadingCv] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleLibrarySelect = async (ids: string[]) => {
        if (ids.length === 0) return;
        
        try {
            const mediaItems = await getMediaByIds(ids);
            if (mediaItems && mediaItems.length > 0) {
                const item = mediaItems[0];
                if (pickerTarget === "avatar") {
                    setFormData((prev) => ({ ...prev, avatar_url: item.url }));
                } else {
                    setFormData((prev) => ({
                        ...prev,
                        resume_url: item.url,
                        resume_name: item.name || item.url.split('/').pop() || "document",
                    }));
                }
                setIsMediaPickerOpen(false);
                toast.success(`${pickerTarget === "avatar" ? "Avatar" : "Resume"} selected. Save to apply!`);
            }
        } catch (error) {
            console.error("Error selecting from library:", error);
            toast.error("Failed to fetch asset details");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { data, error } = await supabase.storage
                .from("media")
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from("media")
                .getPublicUrl(filePath);

            setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
            toast.success("Image uploaded. Remember to save changes!");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        const data = await getProfile();
        if (data) {
            setProfileData(data);
            const sl = (data.social_links as any) || {};
            setFormData({
                name: data.name || "",
                email: data.email || "",
                title: data.title || "",
                bio: data.bio || "",
                avatar_url: data.avatar_url || "",
                resume_url: data.resume_url || sl.resume_url || "",
                resume_name: data.resume_name || sl.resume_name || "",
                skills: data.skills || [],
                social_links: {
                    github: sl.github || "",
                    linkedin: sl.linkedin || "",
                    twitter: sl.twitter || "",
                    website: sl.website || "",
                }
            });
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSocialChange = (network: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            social_links: { ...prev.social_links, [network]: value }
        }));
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill("");
        }
    };

    const handleKeyDownSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const { email, ...rest } = formData;
            // Send the formData directly without embedding resume_url and resume_name into social_links
            const dataToSave = {
                ...rest
            };
            const result = await updateProfile(dataToSave);
            
            if (result?.error) {
                if (result.error === "Unauthorized") {
                    toast.error("Session expired. Please log in again.");
                    window.location.href = "/auth/login";
                } else {
                    toast.error(result.error);
                }
                return;
            }

            // Notify Sidebar and TopNavBar to refresh their avatar/name
            window.dispatchEvent(new CustomEvent("profile-updated"));
            // Refresh local profile data so avatar preview updates instantly
            await fetchProfile();
            toast.success("Profile updated successfully");
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.newPassword) {
            toast.error("Please enter a new password");
            return;
        }
        if (passwordData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setIsChangingPassword(true);
            const result = await changePassword(passwordData.newPassword);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Password changed successfully");
                setIsPasswordDialogOpen(false);
                setPasswordData({ newPassword: "", confirmPassword: "" });
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to change password");
        } finally {
            setIsChangingPassword(false);
        }
    };
    
    const handleDownloadCv = () => {
        if (!formData.resume_url) return;
        setIsDownloadingCv(true);
        const link = document.createElement('a');
        link.href = formData.resume_url;
        link.setAttribute('download', formData.resume_name || 'resume.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => setIsDownloadingCv(false), 2000);
    };


    const handleDiscard = () => {
        fetchProfile();
    };

    if (isLoading) {
        return (
            <div className="p-8 max-w-5xl mx-auto w-full flex justify-center items-center h-64">
                <div className="animate-pulse text-slate-500 font-medium text-sm">Loading…</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-slate-50/30">
            {/* <!-- Content Area --> */}
            <div className="p-8 max-w-5xl mx-auto w-full space-y-10 pb-32">
                {/* <!-- Page Header --> */}
                <section className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
                    <p className="text-slate-500 font-medium text-sm">Manage your personal info, skills, and social links.</p>
                </section>

                {/* <!-- Bento Layout Sections --> */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* <!-- Personal Information (Spans 2 columns) --> */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <User size={120} />
                            </div>
                            
                            <div className="flex items-center justify-between mb-8 relative">
                                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                   <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                       <User size={16} />
                                   </div>
                                    Personal Info
                                </h2>
                            </div>

                            <div className="flex flex-col md:flex-row gap-10 items-start relative">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-xl shadow-slate-200/50 rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-slate-100 flex items-center justify-center">
                                        {formData.avatar_url ? (
                                            <img alt="Profile" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" src={formData.avatar_url} />
                                        ) : (
                                            <User size={48} className="text-slate-300" />
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 flex gap-1">
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            title="Upload new image"
                                            className="bg-slate-900 text-white p-2 rounded-xl shadow-xl hover:scale-110 transition-transform border-4 border-white disabled:opacity-50"
                                        >
                                            <Upload className="w-3 h-3" />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setPickerTarget("avatar");
                                                setIsMediaPickerOpen(true);
                                            }}
                                            title="Choose from Library"
                                            className="bg-indigo-600 text-white p-2 rounded-xl shadow-xl hover:scale-110 transition-transform border-4 border-white"
                                        >
                                            <ImageIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleImageUpload} 
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                </div>

                                <div className="flex-1 w-full space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 ml-1">Full name</label>
                                            <input 
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300" 
                                                type="text" 
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                placeholder="Alex Rivera"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 ml-1">Email</label>
                                            <div className="relative group">
                                                <input 
                                                    className="w-full bg-slate-100/50 border border-slate-100 rounded-xl p-3.5 text-sm font-bold text-slate-400 cursor-not-allowed transition-all" 
                                                    type="email" 
                                                    disabled
                                                    value={formData.email}
                                                    placeholder="architect@portfolio.dev"
                                                />
                                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                                                    <Mail size={14} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500 ml-1">Title</label>
                                            <input 
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300" 
                                                type="text" 
                                                value={formData.title}
                                                onChange={(e) => handleInputChange("title", e.target.value)}
                                                placeholder="Full-Stack Developer & UI Architect"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-500 ml-1">Bio</label>
                                        <textarea 
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm font-medium text-slate-600 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all resize-none leading-relaxed placeholder:text-slate-300" 
                                            rows={4}
                                            value={formData.bio}
                                            onChange={(e) => handleInputChange("bio", e.target.value)}
                                            placeholder="Crafting digital experiences through elegant code..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Assets & Resume Management --> */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-sm font-semibold text-slate-900 mb-8 flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                     <FileText size={16} />
                                 </div>
                                Resume
                            </h2>
                            <div className="group flex flex-col gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-primary/20 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white text-red-500 rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-slate-100">
                                           <File className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                                                {formData.resume_name || (formData.resume_url ? formData.resume_url.split('/').pop() : "No document attached")}
                                            </p>
                                            <p className="text-[11px] text-slate-400 font-medium">
                                                {formData.resume_url ? (
                                                    <>Valid Document • {profileData?.updated_at ? `Updated ${formatDistanceToNow(new Date(profileData.updated_at), { addSuffix: true })}` : "Recently updated"}</>
                                                ) : (
                                                    "No resume attached"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {formData.resume_url && (
                                            <>
                                                <button 
                                                    onClick={handleDownloadCv}
                                                    disabled={isDownloadingCv}
                                                    className="w-9 h-9 flex items-center justify-center bg-white hover:bg-slate-900 hover:text-white rounded-lg text-slate-400 shadow-sm border border-slate-100 transition-all disabled:opacity-50"
                                                >
                                                    {isDownloadingCv ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download size={16} />}
                                                </button>
                                                <button 
                                                    onClick={() => setFormData((prev) => ({ ...prev, resume_url: "", resume_name: "" }))}
                                                    className="w-9 h-9 flex items-center justify-center bg-white hover:bg-red-500 hover:text-white rounded-lg text-slate-400 shadow-sm border border-slate-100 transition-all font-bold"
                                                >
                                                     <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                {formData.resume_url && (
                                    <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                                        <input 
                                            className="w-full bg-white border border-slate-100 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all" 
                                            type="text" 
                                            value={formData.resume_name}
                                            onChange={(e) => handleInputChange("resume_name", e.target.value)}
                                            placeholder="e.g. My Professional CV"
                                        />
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => {
                                    setPickerTarget("resume");
                                    setIsMediaPickerOpen(true);
                                }}
                                className="mt-4 w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-sm font-medium hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all flex items-center justify-center gap-3 group"
                            >
                                <ImageIcon size={16} className="group-hover:-translate-y-1 transition-transform" />
                                {formData.resume_url ? "Replace resume" : "Pick resume from library"}
                            </button>
                        </div>
                    </div>

                    {/* <!-- Side Panels --> */}
                    <div className="space-y-8">
                        {/* <!-- Technical Skills --> */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-sm font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <Terminal size={16} />
                                </div>
                                Skills
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {formData.skills.map((skill: string, idx: number) => (
                                    <span key={idx} className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-primary transition-colors cursor-default">
                                        {skill}  
                                        <X 
                                          size={12}
                                          className="cursor-pointer hover:scale-125 transition-transform" 
                                          onClick={() => removeSkill(skill)} 
                                        />
                                    </span>
                                ))}
                            </div>
                            <div className="relative group">
                                <input 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all pr-12 placeholder:text-slate-300" 
                                    placeholder="Add a skill…" 
                                    type="text" 
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={handleKeyDownSkill}
                                />
                                <button 
                                    onClick={addSkill}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-md rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all scale-90 group-focus-within:scale-100"
                                >
                                    <PlusCircle size={18} />
                                </button>
                            </div>
                        </div>

                        {/* <!-- Social Presence --> */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-sm font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                                    <Globe size={16} />
                                </div>
                                Social Links
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 bg-slate-50 border border-slate-50 p-3 rounded-xl focus-within:bg-white focus-within:border-slate-200 transition-all">
                                    <Code size={16} className="text-slate-400" />
                                    <input 
                                        className="flex-1 bg-transparent border-none p-0 text-sm font-bold text-slate-700 focus:ring-0 placeholder:text-slate-300" 
                                        placeholder="github.com/..." 
                                        type="text" 
                                        value={formData.social_links.github}
                                        onChange={(e) => handleSocialChange("github", e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-4 bg-slate-50 border border-slate-50 p-3 rounded-xl focus-within:bg-white focus-within:border-slate-200 transition-all">
                                    <Briefcase size={16} className="text-slate-400" />
                                    <input 
                                        className="flex-1 bg-transparent border-none p-0 text-sm font-bold text-slate-700 focus:ring-0 placeholder:text-slate-300" 
                                        placeholder="linkedin.com/in/..." 
                                        type="text" 
                                        value={formData.social_links.linkedin}
                                        onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-4 bg-slate-50 border border-slate-50 p-3 rounded-xl focus-within:bg-white focus-within:border-slate-200 transition-all">
                                    <Share2 size={16} className="text-slate-400" />
                                    <input 
                                        className="flex-1 bg-transparent border-none p-0 text-sm font-bold text-slate-700 focus:ring-0 placeholder:text-slate-300" 
                                        placeholder="twitter.com/..." 
                                        type="text" 
                                        value={formData.social_links.twitter}
                                        onChange={(e) => handleSocialChange("twitter", e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-4 bg-slate-50 border border-slate-50 p-3 rounded-xl focus-within:bg-white focus-within:border-slate-200 transition-all">
                                    <Globe size={16} className="text-slate-400" />
                                    <input 
                                        className="flex-1 bg-transparent border-none p-0 text-sm font-bold text-slate-700 focus:ring-0 placeholder:text-slate-300" 
                                        placeholder="yourwebsite.com" 
                                        type="text" 
                                        value={formData.social_links.website}
                                        onChange={(e) => handleSocialChange("website", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* <!-- Security --> */}
                        <div className="bg-slate-900 rounded-2xl p-8 shadow-xl shadow-slate-200 shadow-inner overflow-hidden relative">
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <Lock size={120} className="text-white" />
                            </div>
                            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                 <Lock className="text-primary w-4 h-4" />
                                Account
                            </h2>
                            <p className="text-xs text-slate-400 mb-6 font-medium leading-relaxed">Manage your password and sign out.</p>
                            <button 
                                onClick={() => setIsPasswordDialogOpen(true)}
                                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-all border border-white/10"
                            >
                                Change password
                            </button>

                            <button 
                                onClick={() => signOut()}
                                className="mt-3 w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-xl transition-all border border-red-500/10 flex items-center justify-center gap-2"
                            >
                                <LogOut size={14} />
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Sticky Action Bar --> */}
            <footer className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white/80 backdrop-blur-xl px-10 py-6 z-40 border-t border-slate-100 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="hidden sm:flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                    <span className="text-xs font-medium text-slate-400">
                        {isSaving ? "Saving…" : "All changes saved"}
                    </span>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button 
                        onClick={handleDiscard}
                        disabled={isSaving}
                        className="flex-1 sm:flex-none px-8 py-3 text-slate-500 text-sm font-medium hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
                    >
                        Discard
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 sm:flex-none px-10 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] hover:bg-primary transition-all disabled:opacity-50"
                    >
                        {isSaving ? "Saving…" : "Save changes"}
                    </button>
                </div>
            </footer>

            {/* Media Picker Dialog */}
            <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
                <DialogContent className="!max-w-none !w-screen !h-screen !top-0 !left-0 !translate-x-0 !translate-y-0 fixed z-50 flex flex-col p-0 m-0 rounded-none border-none overflow-hidden">
                    <DialogHeader className="px-10 pt-10 pb-4 border-b">
                        <DialogTitle className="text-3xl font-black tracking-tighter">
                            Select {pickerTarget === "avatar" ? "Profile Image" : "Resume Document"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden p-10 bg-slate-50/50">
                        <MediaLibrary 
                            selectionMode 
                            multiple={false} 
                            onSelect={handleLibrarySelect}
                            confirmButtonText={pickerTarget === "avatar" ? "Use as Profile Picture" : "Use as Resume"}
                            hideHeader={true}
                        />
                    </div>
                </DialogContent>
            </Dialog>


            {/* Change Password Dialog */}
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white rounded-3xl p-8">
                    <DialogHeader className="space-y-4 text-center">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-primary">
                            <Lock size={24} />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-bold text-white">Change Password</DialogTitle>
                            <p className="text-xs text-slate-500 font-medium">Create a strong new password for your account.</p>
                        </div>
                    </DialogHeader>
                    <div className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New password</label>
                            <input 
                                className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm font-medium text-white focus:bg-white/10 focus:border-primary/50 transition-all outline-none" 
                                type="password"
                                placeholder="Min 8 characters"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm new password</label>
                            <input 
                                className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm font-medium text-white focus:bg-white/10 focus:border-primary/50 transition-all outline-none" 
                                type="password"
                                placeholder="Re-enter password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                        </div>
                        <div className="flex gap-4 pt-2">
                            <button 
                                onClick={() => setIsPasswordDialogOpen(false)}
                                className="flex-1 py-4 text-slate-400 text-sm font-bold hover:bg-white/5 rounded-2xl transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleChangePassword}
                                disabled={isChangingPassword}
                                className="flex-1 py-4 bg-white text-slate-900 text-sm font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isChangingPassword ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : "Update"}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>

    )
}
