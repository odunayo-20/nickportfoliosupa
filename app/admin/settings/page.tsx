"use client";

import React, { useState, useEffect, useCallback } from 'react'
import {
  Globe,
  Search,
  Upload,
  Palette,
  Sun,
  Moon,
  Shield,
  Bell,
  Check,
  ChevronRight,
  Loader2,
  X,
  Image as ImageIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { getSettings, updateSettings } from '@/actions/settings'
import { MediaLibrary } from "@/components/admin/media/MediaLibrary"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getMediaByIds } from "@/actions/media"

const Setting = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    site_title: '',
    site_tagline: '',
    portfolio_url: '',
    meta_description: '',
    keywords: [] as string[],
    theme_mode: 'light',
    accent_color: 'indigo-600',
    logo: '',
    og_image_url: '',
    notifications: {
      email_inquiries: true,
      blog_comments: false,
      analytics_digest: true
    },
    security: {
      two_factor: true,
      ip_whitelist: false
    }
  });

  const [newKeyword, setNewKeyword] = useState("");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"logo" | "og_image">("logo");

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSettings();
      if (data) {
        setSettings(data);
        setFormData({
          site_title: data.site_title || '',
          site_tagline: data.site_tagline || '',
          portfolio_url: data.portfolio_url || '',
          meta_description: data.meta_description || '',
          keywords: data.keywords || [],
          theme_mode: data.theme_mode || 'light',
          accent_color: data.accent_color || 'indigo-600',
          logo: data.logo || '',
          og_image_url: data.og_image_url || '',
          notifications: data.notifications || {
            email_inquiries: true,
            blog_comments: false,
            analytics_digest: true
          },
          security: data.security || {
            two_factor: true,
            ip_whitelist: false
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: 'notifications' | 'security', field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleLibrarySelect = async (ids: string[]) => {
    if (ids.length === 0) return;
    
    try {
        const mediaItems = await getMediaByIds(ids);
        if (mediaItems && mediaItems.length > 0) {
            const item = mediaItems[0];
            if (pickerTarget === "logo") {
                setFormData((prev) => ({ ...prev, logo: item.url }));
            } else {
                setFormData((prev) => ({ ...prev, og_image_url: item.url }));
            }
            setIsMediaPickerOpen(false);
            toast.success(`${pickerTarget === "logo" ? "Logo" : "OG Image"} selected. Save to apply!`);
        }
    } catch (error) {
        console.error("Error selecting from library:", error);
        toast.error("Failed to fetch asset details");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateSettings(formData);
      if (result.success) {
        toast.success("Settings updated successfully");
        setSettings({ ...settings, ...formData });
      } else {
        toast.error(result.error || "Failed to update settings");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (kw: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== kw)
    }));
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Architecting Workspace...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-8 sm:space-y-12 pb-32 animate-in fade-in duration-500">
      {/* <!-- Page Header --> */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">Settings</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">Manage your portfolio and workspace preferences.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => fetchSettings()}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-6 py-3 text-sm font-black text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 uppercase tracking-widest"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-8 py-3 text-sm font-black text-white bg-slate-900 shadow-xl shadow-slate-200 rounded-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* <!-- Settings Grid --> */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* <!-- Left Column: General & SEO --> */}
        <div className="lg:col-span-7 space-y-10">
          {/* <!-- General Settings --> */}
          <section className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">General</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Base configuration</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid flex-col md:flex-row gap-6 mb-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Logo / Favicon</label>
                    <div className="flex items-center gap-4">
                       <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                          {formData.logo ? (
                             <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                          ) : (
                             <div className="text-xs font-black text-slate-200 uppercase">None</div>
                          )}
                       </div>
                       <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => { setPickerTarget("logo"); setIsMediaPickerOpen(true); }}
                            className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg hover:bg-indigo-600 transition-all uppercase tracking-widest"
                          >
                            Set Logo
                          </button>
                          {formData.logo && (
                            <button 
                                onClick={() => handleInputChange('logo', '')}
                                className="px-4 py-2 bg-slate-50 text-slate-400 text-[10px] font-black rounded-lg hover:text-red-500 transition-all uppercase tracking-widest"
                            >
                                Clear
                            </button>
                          )}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Title</label>
                <input 
                  className="w-full bg-slate-50 border border-transparent focus:border-indigo-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900 font-bold outline-none" 
                  type="text" 
                  value={formData.site_title}
                  onChange={(e) => handleInputChange('site_title', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dynamic Tagline</label>
                <input 
                  className="w-full bg-slate-50 border border-transparent focus:border-indigo-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900 font-bold outline-none" 
                  type="text" 
                  value={formData.site_tagline}
                  onChange={(e) => handleInputChange('site_tagline', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Portfolio Canonical URL</label>
                <div className="flex items-center group">
                  <div className="h-[60px] flex items-center px-4 sm:px-5 bg-slate-100 rounded-l-2xl text-slate-400 text-[10px] sm:text-xs font-black border-r border-slate-200 uppercase">
                    HTTPS://
                  </div>
                  <input 
                    className="flex-1 h-[60px] bg-slate-50 border border-transparent focus:border-indigo-100 rounded-r-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900 font-bold outline-none min-w-0" 
                    type="text" 
                    value={formData.portfolio_url}
                    onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* <!-- SEO Settings --> */}
          <section className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">Visibility</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">SEO & Metadata</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search Meta Description</label>
                <textarea 
                  className="w-full bg-slate-50 border border-transparent focus:border-indigo-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-700 font-medium resize-none outline-none leading-relaxed" 
                  rows={4}
                  value={formData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Indexing Keywords</label>
                <div className="w-full bg-slate-50 border border-transparent rounded-3xl p-3 flex flex-wrap gap-2">
                   {formData.keywords.map(tag => (
                     <span key={tag} className="px-3 py-1.5 bg-white border border-slate-100 text-slate-900 text-[10px] font-black rounded-xl shadow-sm lowercase tracking-tight flex items-center gap-2">
                       #{tag}
                       <X className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform" onClick={() => removeKeyword(tag)} />
                     </span>
                   ))}
                   <input 
                    className="bg-transparent border-none outline-none px-2 py-1 text-xs font-bold text-slate-400 min-w-[80px]" 
                    placeholder="New tag…" 
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                   />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Open Graph Asset (Social Image)</label>
                <div className="flex flex-col gap-4">
                    {formData.og_image_url && (
                        <div className="w-full h-48 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative group">
                            <img src={formData.og_image_url} alt="OG Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button onClick={() => { setPickerTarget("og_image"); setIsMediaPickerOpen(true); }} className="p-3 bg-white rounded-full text-slate-900 shadow-xl hover:scale-110 transition-all">
                                    <ImageIcon size={20} />
                                </button>
                                <button onClick={() => handleInputChange('og_image_url', '')} className="p-3 bg-red-500 rounded-full text-white shadow-xl hover:scale-110 transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                    {!formData.og_image_url && (
                        <div 
                         onClick={() => { setPickerTarget("og_image"); setIsMediaPickerOpen(true); }}
                         className="relative group cursor-pointer bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] h-48 flex flex-col items-center justify-center hover:border-slate-900 hover:bg-white transition-all overflow-hidden"
                        >
                            <div className="relative z-10 flex flex-col items-center gap-3 text-slate-300 group-hover:text-slate-900 transition-colors">
                                <ImageIcon className="w-10 h-10" />
                                <div className="text-center">
                                    <span className="text-xs font-black uppercase block">Select social sharing image</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter mt-1">1200 x 630px Recommended</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* <!-- Right Column: Design, Security & Alerts --> */}
        <div className="lg:col-span-5 space-y-10">
          {/* <!-- Interface Settings --> */}
          <section className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">Interface</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Visual System</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleInputChange('theme_mode', 'light')}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all ${formData.theme_mode === 'light' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-slate-50 text-slate-400'}`}
              >
                <Sun className="mb-3 w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Sunlit</span>
              </button>
              <button 
                onClick={() => handleInputChange('theme_mode', 'dark')}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all ${formData.theme_mode === 'dark' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-slate-50 text-slate-400'}`}
              >
                <Moon className="mb-3 w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Midnight</span>
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Accent Signature</label>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: 'Indigo', color: 'bg-indigo-600', val: 'indigo-600' },
                  { name: 'Emerald', color: 'bg-emerald-500', val: 'emerald-500' },
                  { name: 'Rose', color: 'bg-rose-500', val: 'rose-500' },
                  { name: 'Amber', color: 'bg-amber-500', val: 'amber-500' },
                  { name: 'Slate', color: 'bg-slate-900', val: 'slate-900' }
                ].map((c) => (
                  <button 
                    key={c.val} 
                    onClick={() => handleInputChange('accent_color', c.val)}
                    className={`w-10 h-10 rounded-full ${c.color} transition-all relative ${formData.accent_color === c.val ? 'ring-4 ring-slate-100 scale-110' : 'hover:scale-105'}`}
                  >
                    {formData.accent_color === c.val && <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* <!-- Security & Toggles --> */}
          <section className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">Protection</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Security Layer</p>
              </div>
            </div>

            <div className="pt-4 space-y-6">
               <div className="flex items-center justify-between p-2">
                 <div className="min-w-0 pr-2">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">Two-Factor Auth</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Multi-device security</p>
                 </div>
                 <button 
                  onClick={() => handleNestedChange('security', 'two_factor', !formData.security.two_factor)}
                  className={`w-14 h-8 rounded-full relative transition-all shadow-lg ${formData.security.two_factor ? 'bg-indigo-600 shadow-indigo-100' : 'bg-slate-100'}`}
                 >
                    <div className={`w-6 h-6 rounded-full bg-white absolute top-1 shadow-sm transition-all ${formData.security.two_factor ? 'right-1' : 'left-1'}`}></div>
                 </button>
               </div>
               
               <div className="flex items-center justify-between p-2">
                 <div className="min-w-0 pr-2">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">IP protection</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Strict entry</p>
                 </div>
                 <button 
                  onClick={() => handleNestedChange('security', 'ip_whitelist', !formData.security.ip_whitelist)}
                  className={`w-14 h-8 rounded-full relative transition-all shadow-lg ${formData.security.ip_whitelist ? 'bg-indigo-600 shadow-indigo-100' : 'bg-slate-100'}`}
                 >
                    <div className={`w-6 h-6 rounded-full bg-white absolute top-1 shadow-sm transition-all ${formData.security.ip_whitelist ? 'right-1' : 'left-1'}`}></div>
                 </button>
               </div>
            </div>
          </section>

          {/* <!-- Communications --> */}
          <section className="bg-slate-900 p-6 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-400/30 space-y-8 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 text-white opacity-5">
               <Bell size={160} />
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white uppercase">Broadcasts</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Inbound Alerts</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              {[
                { id: 'email_inquiries', label: 'New Inquiry Notifications' },
                { id: 'blog_comments', label: 'Blog Comment Moderation' },
                { id: 'analytics_digest', label: 'Successive Login Alerts' }
              ].map((item) => (
                <label 
                  key={item.id} 
                  className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                  onClick={() => handleNestedChange('notifications', item.id, !(formData.notifications as any)[item.id])}
                >
                  <span className="text-[10px] font-black text-slate-300 uppercase group-hover:text-white transition-colors truncate pr-2">{item.label}</span>
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${(formData.notifications as any)[item.id] ? 'bg-white border-white text-slate-900' : 'border-white/20'}`}>
                    {(formData.notifications as any)[item.id] && <Check className="w-3.5 h-3.5" strokeWidth={4} />}
                  </div>
                </label>
              ))}
            </div>

            <div className="pt-4 relative z-10">
               <button className="w-full flex items-center justify-between px-6 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
                  Test Alert System
                  <ChevronRight size={16} />
               </button>
            </div>
          </section>
        </div>
      </div>

      {/* Media Picker Dialog */}
      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="!max-w-none !w-screen !h-screen !top-0 !left-0 !translate-x-0 !translate-y-0 fixed z-50 flex flex-col p-0 m-0 rounded-none border-none overflow-hidden">
            <DialogHeader className="px-10 pt-10 pb-4 border-b">
                <DialogTitle className="text-3xl font-black tracking-tighter">
                    Select {pickerTarget === "logo" ? "Brand Logo" : "Social OG Image"}
                </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden p-10 bg-slate-50/50">
                <MediaLibrary 
                    selectionMode 
                    multiple={false} 
                    onSelect={handleLibrarySelect}
                    confirmButtonText="Apply to Settings"
                    hideHeader={true}
                />
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Setting;
