import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
  <nav className="fixed top-0 w-full z-50 bg-[#0e0e0e]/60 backdrop-blur-xl border-b border-white/15 shadow-[0_0_40px_rgba(153,247,255,0.05)]">
<div className="flex justify-between items-center px-8 h-20 w-full mx-auto">
<div className="text-xl font-bold tracking-tighter text-white font-headline">ETHER_DEV</div>
<div className="hidden md:flex gap-12">
<a className="font-headline uppercase tracking-[0.1em] text-xs transition-all duration-300 text-white/70 hover:text-[#d575ff] hover:drop-shadow-[0_0_8px_rgba(213,117,255,0.8)]" href="#">Work</a>
<a className="font-headline uppercase tracking-[0.1em] text-xs transition-all duration-300 text-white/70 hover:text-[#d575ff] hover:drop-shadow-[0_0_8px_rgba(213,117,255,0.8)]" href="#">Tech</a>
<a className="font-headline uppercase tracking-[0.1em] text-xs transition-all duration-300 text-white/70 hover:text-[#d575ff] hover:drop-shadow-[0_0_8px_rgba(213,117,255,0.8)]" href="#">Process</a>
<a className="font-headline uppercase tracking-[0.1em] text-xs transition-all duration-300 text-[#99f7ff] border-b border-[#99f7ff] pb-1" href="#">Contact</a>
</div>
<div className="flex items-center gap-4">
<button className="material-symbols-outlined text-white/70 hover:text-primary transition-colors">dark_mode</button>
</div>
</div>
</nav>
  );
}
