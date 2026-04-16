import React from 'react'
import { LayoutDashboard, FolderHeart, MessageCircle, Settings, Plus } from 'lucide-react'

const MobileNav = () => {
  return (
    <>
    {/* <!-- Mobile Navigation Fallback --> */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-0 shadow-[0_-1px_15px_rgba(0,0,0,0.05)] flex items-center justify-around px-4 z-50">
<a className="flex flex-col items-center justify-center gap-1 text-indigo-600" href="#">
<LayoutDashboard className="w-5 h-5 fill-current" />
<span className="text-[10px] font-bold">Home</span>
</a>
<a className="flex flex-col items-center justify-center gap-1 text-slate-400" href="#">
<FolderHeart className="w-5 h-5" />
<span className="text-[10px] font-bold">Projects</span>
</a>
<a className="flex flex-col items-center justify-center gap-1 text-slate-400" href="#">
<MessageCircle className="w-5 h-5" />
<span className="text-[10px] font-bold">Inbox</span>
</a>
<a className="flex flex-col items-center justify-center gap-1 text-slate-400" href="#">
<Settings className="w-5 h-5" />
<span className="text-[10px] font-bold">Settings</span>
</a>
</nav>
{/* <!-- Floating Action Button for mobile --> */}
<button className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50">
<Plus className="w-6 h-6" />
</button>
    </>
  )
}

export default MobileNav