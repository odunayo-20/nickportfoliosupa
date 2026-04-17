import React from 'react'
import {
  Globe,
  Search,
  Upload,
  Palette,
  Sun,
  Moon,
  Shield,
  Bell,
  Check
} from 'lucide-react'

const Setting = () => {
  return (
    <>
      <div className="p-10 max-w-6xl mx-auto space-y-12">
        {/* <!-- Hero Header Actions --> */}
        <div className="flex justify-between items-end pb-4 border-b-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">Settings</h2>
            <p className="text-on-surface-variant mt-2 max-w-lg">Manage your portfolio and workspace preferences.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-all rounded-xl">Discard changes</button>
            <button className="px-6 py-2.5 text-sm font-bold text-on-primary bg-gradient-to-br from-primary to-on-primary-fixed-variant shadow-lg shadow-primary/20 rounded-xl hover:scale-[1.02] active:scale-95 transition-all">Save Changes</button>
          </div>
        </div>
        {/* <!-- Settings Grid --> */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* <!-- Left Column: General & Theme --> */}
          <div className="lg:col-span-7 space-y-8">
            {/* <!-- General Settings --> */}
            <section className="bg-surface-container-lowest p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">General Settings</h3>
              </div>
              <div className="space-y-5">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-on-surface/70 ml-1">Site title</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-medium" type="text" value="Rivera Portfolio" readOnly />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-on-surface/70 ml-1">Tagline</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-medium" placeholder="Design-led software engineering" type="text" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-on-surface/70 ml-1">Portfolio URL</label>
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface-variant text-sm font-medium px-3 py-3 bg-surface-container-high rounded-xl">https://</span>
                    <input className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-medium" type="text" value="arivera.design" readOnly />
                  </div>
                </div>
              </div>
            </section>
            {/* <!-- SEO Settings --> */}
            <section className="bg-surface-container-lowest p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">SEO Settings</h3>
              </div>
              <div className="space-y-5">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-on-surface/70 ml-1">Meta description</label>
                  {/* <textarea className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-medium resize-none" rows="3">Showcasing the intersection of architecture and digital design through high-performance software solutions.</textarea> */}
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-on-surface/70 ml-1">Keywords</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-medium" type="text" value="UX Design, Software Architect, React, Tailwind, Cloud Systems" readOnly />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-on-surface/70 ml-1">Open Graph Image</label>
                  <div className="relative group cursor-pointer border-2 border-dashed border-outline-variant/30 rounded-2xl overflow-hidden hover:border-primary/50 transition-all h-40 flex flex-col items-center justify-center bg-surface-container-low">
                    <div className="relative z-10 flex flex-col items-center">
                      <Upload className="text-primary mb-2 w-5 h-5" />
                      <span className="text-sm font-bold text-on-surface">Update OG Image</span>
                      <span className="text-xs text-on-surface-variant mt-1">Recommended: 1200 x 630px</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* <!-- Right Column: Account, Security, Notifications --> */}
          <div className="lg:col-span-5 space-y-8">
            {/* <!-- Theme Settings --> */}
            <section className="bg-surface-container-lowest p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Theme Settings</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center p-4 rounded-2xl bg-surface-container-low border-2 border-primary transition-all">
                  <Sun className="text-primary mb-2 w-5 h-5" />
                  <span className="text-sm font-bold">Light Mode</span>
                </button>
                <button className="flex flex-col items-center p-4 rounded-2xl hover:bg-surface-container-low transition-all">
                  <Moon className="text-on-surface-variant mb-2 w-5 h-5" />
                  <span className="text-sm font-semibold text-on-surface-variant">Dark Mode</span>
                </button>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-on-surface/70 ml-1">Accent color</label>
                <div className="flex gap-3">
                  <button className="w-8 h-8 rounded-full bg-[#4d44e3] ring-2 ring-offset-2 ring-primary"></button>
                  <button className="w-8 h-8 rounded-full bg-emerald-500"></button>
                  <button className="w-8 h-8 rounded-full bg-rose-500"></button>
                  <button className="w-8 h-8 rounded-full bg-amber-500"></button>
                  <button className="w-8 h-8 rounded-full bg-slate-800"></button>
                </div>
              </div>
            </section>
            {/* <!-- Account & Security --> */}
            <section className="bg-surface-container-lowest p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Security</h3>
              </div>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder="Current password" type="password" />
                </div>
                <div className="grid gap-2">
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder="New password" type="password" />
                </div>
                <div className="grid gap-2">
                  <input className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder="Confirm new password" type="password" />
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-on-surface leading-tight">Two-factor Auth</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Secure your account with 2FA</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-primary relative transition-all">
                  <div className="w-4 h-4 rounded-full bg-white absolute right-1 top-1"></div>
                </button>
              </div>
            </section>
            {/* <!-- Notification Preferences --> */}
            <section className="bg-surface-container-lowest p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Alerts</h3>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center text-white bg-primary">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Email alerts for new messages</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="w-5 h-5 rounded border-2 border-outline-variant flex items-center justify-center">
                  </div>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Notify of blog comments</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center text-white bg-primary">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Weekly analytics digest</span>
                </label>
              </div>
            </section>
          </div>
        </div>
      </div>


    </>
  );
}

export default Setting
