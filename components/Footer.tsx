import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
   <footer className="bg-[#131313] w-full py-16 px-8 border-t border-white/5">
<div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto w-full gap-8">
<div className="flex flex-col items-center md:items-start gap-4">
<div className="font-['Space_Grotesk'] font-bold text-[#99f7ff] text-2xl tracking-tighter">ETHER_DEV</div>
<p className="font-['Inter'] text-sm leading-relaxed text-white/40 text-center md:text-left max-w-xs">© 2024 KINETIC ETHER. ENGINEERED FOR THE VOID.</p>
</div>
<div className="flex flex-col items-center md:items-end gap-6">
<div className="flex gap-8">
<a className="text-white/40 hover:text-[#99f7ff] transition-colors font-['Inter'] text-sm" href="#">GitHub</a>
<a className="text-white/40 hover:text-[#99f7ff] transition-colors font-['Inter'] text-sm" href="#">LinkedIn</a>
<a className="text-white/40 hover:text-[#99f7ff] transition-colors font-['Inter'] text-sm" href="#">Layers</a>
</div>
<div className="text-white/40 text-[10px] uppercase tracking-[0.3em]">Built with Neon &amp; Caffeine</div>
</div>
</div>
</footer>
  );
}
