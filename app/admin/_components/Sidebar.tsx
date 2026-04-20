"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileEdit,
  MessageCircle,
  User as UserIcon,
  Settings,
  LogOut,
  Image as ImageIcon,
  ShieldCheck,
  Mail,
  Tag,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { myAppHook } from "@/context/AppUtils";
import { signOut } from "@/actions/auth";
import { getProfile } from "@/actions/profile";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = myAppHook();
  const [profileName, setProfileName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile();
      if (data) {
        setProfileName(data.name);
        setAvatarUrl(data.avatar_url || "");
      }
    };
    fetchProfile();

    // Listen for profile updates from the profile page
    const handler = () => fetchProfile();
    window.addEventListener("profile-updated", handler);
    return () => window.removeEventListener("profile-updated", handler);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/project", icon: FolderKanban },
    { name: "Blog", href: "/admin/blog", icon: FileEdit },
    { name: "Categories", href: "/admin/categories", icon: Tag },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { name: "Messages", href: "/admin/message", icon: MessageCircle },
    { name: "Comments", href: "/admin/comments", icon: MessageCircle },
    { name: "Profile", href: "/admin/profile", icon: UserIcon },
    { name: "Invite Users", href: "/admin/whitelist", icon: ShieldCheck },
    { name: "Media", href: "/admin/media", icon: ImageIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const displayName = profileName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";

  return (
    <aside className="hidden md:flex flex-col h-full p-4 w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-200">
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none tracking-tight">
            Nick
          </h1>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            Portfolio Manager
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200 dark:shadow-none" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
              }`}
              href={item.href}
            >
              <item.icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : ""}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile Dropdown */}
      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 px-2 py-2 hover:bg-white dark:hover:bg-slate-900 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs border-2 border-white shadow-sm overflow-hidden shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={10}>
             <DropdownMenuLabel className="px-2 py-1.5 flex flex-col gap-0.5">
               <span className="text-sm font-semibold text-slate-900">{displayName}</span>
               <span className="text-xs text-slate-400">{user?.email}</span>
             </DropdownMenuLabel>
             <DropdownMenuSeparator />
             <DropdownMenuItem asChild>
                <Link href="/admin/profile" className="cursor-pointer font-medium">
                  <UserIcon className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>My Profile</span>
                </Link>
             </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="cursor-pointer font-medium">
                  <Settings className="mr-2 h-4 w-4 text-slate-400" />
                  <span>Settings</span>
                </Link>
             </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem 
               onClick={() => signOut()}
               className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer font-medium text-sm"
             >
               <LogOut size={16} className="mr-2" />
               <span>Log out</span>
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default Sidebar;