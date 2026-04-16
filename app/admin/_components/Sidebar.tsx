import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileEdit,
  MessageCircle,
  User,
  Settings,
  Building2,
} from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col h-full p-4 w-64 bg-slate-50 dark:bg-slate-950 border-r-0 transition-all duration-200">
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Building2 className="text-white w-4 h-4" />
        </div>
        <div>
          <h1 className="text-xl font-black text-indigo-600 dark:text-indigo-400 leading-none">
            Architect
          </h1>
          <p className="text-[10px] font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Portfolio Manager
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        
        {/* Active */}
        <Link
          className="flex items-center gap-3 px-3 py-2 bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium transition-colors duration-200"
          href="/admin/dashboard"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        <Link
          className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-colors duration-200"
          href="/admin/project"
        >
          <FolderKanban className="w-4 h-4" />
          <span>Projects</span>
        </Link>

        <Link
          className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-colors duration-200"
          href="/admin/blog"
        >
          <FileEdit className="w-4 h-4" />
          <span>Blog</span>
        </Link>

        <Link
          className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-colors duration-200"
          href="/admin/message"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Messages</span>
        </Link>

        <Link
          className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-colors duration-200"
          href="/admin/profile"
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </Link>
        <Link
          className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-colors duration-200"
          href="/admin/media"
        >
          <User className="w-4 h-4" />
          <span>Media</span>
        </Link>

        <Link
          className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-colors duration-200"
          href="/admin/settings"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Footer Profile */}
      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <img
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwHTqbwqZXJHQup_6IMVF2qJtsxehiJeF2oorr4SO_Zc7jYsNlJPkQUnOrlUs4nkX8RL1s_NSnK2AA9dXFCxf2tLm2b0HIFZRci3SW3abpXIYBdqHhWzs0eDkhJ6DuUpiaXD9krhqvkBDIikA-UDtAbRk-OhXpzyQZsU8i3jr8PFHSUw68kTijhFqlz8sG-BzItak8HsowezVx_jYNnoqZmoM3s0jeMkC7BebWZGLc_VTXyC7uhcDT4-PrDdlRdfvalqWoI5B3e30"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              Alex Rivera
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              alex@architect.dev
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;