"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, User, LogOut, Settings as SettingsIcon } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { myAppHook } from "@/context/AppUtils";
import { signOut } from "@/actions/auth";
import { getProfile } from "@/actions/profile";
import Link from "next/link";

const TopNavBar = () => {
  const { user } = myAppHook();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const data = await getProfile();
      if (data) setProfile(data);
    };
    fetchProfileData();

    // Re-fetch when profile is updated anywhere in the app
    const handler = () => fetchProfileData();
    window.addEventListener("profile-updated", handler);
    return () => window.removeEventListener("profile-updated", handler);
  }, []);

  const displayName = profile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  return (
    <header className="flex justify-between items-center px-4 sm:px-6 py-3 w-full sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40 transition-all duration-200 shadow-sm border-b border-slate-100 dark:border-slate-800">
      
      {/* Left Section - Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-4 h-4" />
          <input
            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-4 focus:ring-indigo-500/10 focus:bg-white w-full sm:w-72 transition-all placeholder:text-slate-400 font-medium"
            placeholder="Search…"
            type="text"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        
        {/* Notification Button */}
        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 pl-3 pr-1 py-1 rounded-xl transition-all border border-transparent hover:border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                  {displayName}
                </p>
                <p className="text-xs text-slate-400 leading-tight">
                  {profile?.title || "Admin"}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs border-2 border-white shadow-sm overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2" align="end">
            <DropdownMenuLabel className="px-2 py-1.5 flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-slate-900">{displayName}</span>
              <span className="text-xs text-slate-400 truncate">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/admin/profile" className="cursor-pointer font-medium">
                  <User className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="cursor-pointer font-medium">
                  <SettingsIcon className="mr-2 h-4 w-4 text-slate-400" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => signOut()}
              className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer font-medium text-sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNavBar;