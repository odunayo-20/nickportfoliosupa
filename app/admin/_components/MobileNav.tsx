"use client"
import React from 'react'
import { LayoutDashboard, FolderKanban, FileEdit, MessageCircle, Settings, Image as ImageIcon, ShieldCheck } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"

const MobileNav = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/project", icon: FolderKanban },
    { name: "Blog", href: "/admin/blog", icon: FileEdit },
    { name: "Media", href: "/admin/media", icon: ImageIcon },
    { name: "Whitelist", href: "/admin/whitelist", icon: ShieldCheck },
    { name: "Messages", href: "/admin/message", icon: MessageCircle },
    { name: "Comments", href: "/admin/comments", icon: MessageCircle },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 shadow-[0_-1px_15px_rgba(0,0,0,0.05)] flex items-center justify-around px-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-lg transition-colors ${
              isActive ? "text-indigo-600" : "text-slate-400"
            }`}
            href={item.href}
          >
            <item.icon className={`w-5 h-5 ${isActive ? "fill-indigo-100" : ""}`} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  )
}

export default MobileNav
