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

export default function ProfilePage() {
    const [formData, setFormData] = useState<any>({
        name: "",
        title: "",
        bio: "",
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

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        const data = await getProfile();
        if (data) {
            setFormData({
                name: data.name || "",
                title: data.title || "",
                bio: data.bio || "",
                skills: data.skills || [],
                social_links: (data.social_links as any) || {
                    github: "",
                    linkedin: "",
                    twitter: "",
                    website: "",
                }
            });
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSocialChange = (network: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            social_links: { ...prev.social_links, [network]: value }
        }));
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData((prev: any) => ({
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
        setFormData((prev: any) => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await updateProfile(formData);
            toast.success("Profile updated successfully");
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDiscard = () => {
        fetchProfile();
    };

    if (isLoading) {
        return (
            <div className="p-8 max-w-5xl mx-auto w-full flex justify-center items-center h-64">
                <div className="animate-pulse text-slate-500 font-medium text-sm tracking-widest uppercase">Initializing Interface...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-slate-50/30">
            {/* <!-- Content Area --> */}
            <div className="p-8 max-w-5xl mx-auto w-full space-y-10 pb-32">
                {/* <!-- Page Header --> */}
                <section className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md">Identity</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brand Settings</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Profile Architect</h1>
                    <p className="text-slate-500 font-medium text-sm">Design your digital presence and professional identity.</p>
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
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                                   <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                       <User size={16} />
                                   </div>
                                    Genesis Details
                                </h2>
                            </div>

                            <div className="flex flex-col md:flex-row gap-10 items-start relative">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-xl shadow-slate-200/50 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                        <img alt="Profile" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYX9M182RG1NbmrqwYvZGz4N-dw_ybpVQPWJG-GYO7pWH7Z_1QNuOqg3814P5dElApHPunDezRgmgqAT_ntSe3Ys9fgN5he3SZaacRIxb69GjB9J9od5vxK-3bVyzb1298sXgIN55cNb--C0RrwR_xIj7AEKQt1FeXh_zHEHSy9chEvItz-Zdpv1G3hzeMwv6oy1El0X7YDfyuaPA2xV9XdiG9wvphIz91tGt7C23om1eu63YM_AxHEudijYD_c5LfNbjaaPFWqck" />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2 rounded-xl shadow-xl hover:scale-110 transition-transform border-4 border-white">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1 w-full space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Universal Name</label>
                                            <input 
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300" 
                                                type="text" 
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                placeholder="Alex Rivera"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Title</label>
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
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Strategic Bio</label>
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
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                     <FileText size={16} />
                                 </div>
                                Verifiable Assets
                            </h2>
                            <div className="group flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-primary/20 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white text-red-500 rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-slate-100">
                                       <File className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">resume_main_2024.pdf</p>
                                        <p className="text-[11px] text-slate-400 font-medium">Valid PDF • 2.4 MB • Updated 12 days ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-9 h-9 flex items-center justify-center bg-white hover:bg-slate-900 hover:text-white rounded-lg text-slate-400 shadow-sm border border-slate-100 transition-all">
                                        <Download size={16} />
                                    </button>
                                    <button className="w-9 h-9 flex items-center justify-center bg-white hover:bg-red-500 hover:text-white rounded-lg text-slate-400 shadow-sm border border-slate-100 transition-all">
                                         <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all flex items-center justify-center gap-3 group">
                                <Upload size={16} className="group-hover:-translate-y-1 transition-transform" />
                                Replace Professional Record
                            </button>
                        </div>
                    </div>

                    {/* <!-- Side Panels --> */}
                    <div className="space-y-8">
                        {/* <!-- Technical Skills --> */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <Terminal size={16} />
                                </div>
                                Skill Vector
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {formData.skills.map((skill: string, idx: number) => (
                                    <span key={idx} className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight flex items-center gap-2 hover:bg-primary transition-colors cursor-default">
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
                                    placeholder="Add capability..." 
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
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                                    <Globe size={16} />
                                </div>
                                Digital Matrix
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
                            <h2 className="text-sm font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
                                 <Lock className="text-primary w-4 h-4" />
                                System Access
                            </h2>
                            <p className="text-[11px] text-slate-400 mb-6 font-medium leading-relaxed">Modify your core credentials and authentication protocols here.</p>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-white/10">
                                Update Passkey
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Sticky Action Bar --> */}
            <footer className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white/80 backdrop-blur-xl px-10 py-6 z-40 border-t border-slate-100 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="hidden sm:flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                        {isSaving ? "Syncing Identity..." : "System Synchronized"}
                    </span>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button 
                        onClick={handleDiscard}
                        disabled={isSaving}
                        className="flex-1 sm:flex-none px-8 py-3 text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
                    >
                        Discard
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 sm:flex-none px-12 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] hover:bg-primary transition-all disabled:opacity-50"
                    >
                        {isSaving ? "Syncing..." : "Update Identity"}
                    </button>
                </div>
            </footer>
        </div>
    )
}
