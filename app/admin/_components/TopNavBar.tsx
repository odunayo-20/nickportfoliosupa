import { Search, Bell } from "lucide-react";

const TopNavBar = () => {
  return (
    <header className="flex justify-between items-center px-6 py-3 w-full sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40 transition-all duration-200 shadow-sm">
      
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {/* Lucide Search Icon */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />

          <input
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 w-64 placeholder:text-slate-400"
            placeholder="Search projects or logs..."
            type="text"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        {/* Notification Button */}
        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded-lg transition-colors">
          <span className="text-sm font-semibold text-indigo-600">
            Profile
          </span>
          <img
            alt="User Avatar"
            className="w-8 h-8 rounded-lg object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy-TWzwaVaf10IOiSVORXJpl_z6F9DJ3lOR6-xVZ3yo6smgnkRViRJGJH2rJraK1nUGK4r_H_UIJKSCPtHaUKLvUFclG0jsZgZFGGzk61Xgc-Ar52tK43wWj2DPSHnIHpLZPD05iIrakLw3z0jK9UuMZBY3rG5Eo96bYka6wKzcPxaxA4TeWWpJbA0UF25tM3r3HJLCCiLgmHgk5A1GO6SkQ1aG4KjJKTCYmnYLTU4f7999OGUzxpBgvBmIwXr5uySEQQTDiHEtmo"
          />
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;