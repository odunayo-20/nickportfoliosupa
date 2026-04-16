import React from 'react'
import { 
  MessagesSquare, 
  TrendingUp, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  ChevronDown, 
  Filter, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react'

const page = () => {
  return (
    <>
    {/* <!-- Page Header --> */}
<div className="mb-10">
<h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-1">Contact Messages</h2>
<p className="text-on-surface-variant font-medium">Manage inquiries from your portfolio website.</p>
</div>
{/* <!-- Stats Row: Tonal Layering --> */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
<div className="flex items-center justify-between mb-2">
<span className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">Total Messages</span>
<MessagesSquare className="text-primary w-5 h-5" />
</div>
<p className="text-3xl font-bold text-on-surface">1,284</p>
<div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
<TrendingUp className="w-4 h-4" />
<span>12% from last month</span>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
<div className="flex items-center justify-between mb-2">
<span className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">Unread</span>
<Mail className="text-error w-5 h-5" />
</div>
<p className="text-3xl font-bold text-on-surface">42</p>
<div className="mt-2 flex items-center gap-1 text-xs font-medium text-error">
<AlertCircle className="w-4 h-4" />
<span>8 Urgent inquiries</span>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
<div className="flex items-center justify-between mb-2">
<span className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">Responded</span>
<CheckCircle2 className="text-indigo-600 w-5 h-5" />
</div>
<p className="text-3xl font-bold text-on-surface">96.8%</p>
<div className="mt-2 flex items-center gap-1 text-xs font-medium text-on-surface-variant">
<span>Avg. response time: 4h 20m</span>
</div>
</div>
</div>
{/* <!-- Main Data Table Container --> */}
<div className="bg-surface-container-lowest rounded-2xl shadow-xl shadow-indigo-900/5 overflow-hidden border border-outline-variant/10">
{/* <!-- Table Controls --> */}
<div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-low/30">
<div className="relative w-full sm:w-96">
<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-5 h-5" />
<input className="w-full pl-12 pr-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" placeholder="Filter by sender or subject..." type="text"/>
</div>
<div className="flex items-center gap-3 w-full sm:w-auto">
<div className="relative flex-1 sm:flex-none">
<select className="appearance-none w-full sm:w-40 pl-4 pr-10 py-2.5 bg-surface-container-low border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer">
<option>All Status</option>
<option>Read</option>
<option>Unread</option>
</select>
<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-5 h-5" />
</div>
<button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-medium text-sm rounded-xl transition-colors">
<Filter className="w-4 h-4" />
                            More
                        </button>
</div>
</div>
{/* <!-- Table Content --> */}
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low/50 border-b border-outline-variant/5">
<th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">Sender</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">Subject &amp; Preview</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">Date</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">Status</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/5">
{/* <!-- Row 1: Unread --> */}
<tr className="group hover:bg-surface-container-low/40 transition-colors cursor-pointer">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="h-10 w-10 rounded-full bg-primary-container text-primary font-bold flex items-center justify-center text-sm shadow-sm">JD</div>
<div>
<p className="font-bold text-on-surface">Julianne Davies</p>
<p className="text-xs text-on-surface-variant">j.davies@agency.com</p>
</div>
</div>
</td>
<td className="px-6 py-5 max-w-xs">
<p className="font-semibold text-on-surface truncate">Project Inquiry: Urban Park Design</p>
<p className="text-sm text-on-surface-variant truncate">Hello! We loved your recent portfolio work and wanted to discuss...</p>
</td>
<td className="px-6 py-5">
<p className="text-sm text-on-surface-variant font-medium">Oct 24, 2023</p>
<p className="text-xs text-on-surface-variant/60">10:42 AM</p>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-error-container/10 text-on-error-container">
<span className="h-1.5 w-1.5 rounded-full bg-error mr-2"></span>
                                        Unread
                                    </span>
</td>
<td className="px-6 py-5 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-primary hover:bg-primary-container/30 rounded-lg transition-colors" title="View Message">
<Eye className="w-5 h-5" />
</button>
<button className="p-2 text-on-surface-variant hover:bg-error-container/10 hover:text-error rounded-lg transition-colors" title="Delete Message">
<Trash2 className="w-5 h-5" />
</button>
</div>
</td>
</tr>
{/* <!-- Row 2: Read --> */}
<tr className="group hover:bg-surface-container-low/40 transition-colors cursor-pointer">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
<img alt="Marcus Chen" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYGrsXIWphlWz8xsQ4fBmT4u5T0TiEtgeRX6w-Lae0y89a_DyEy7opkV_zxwkpXyOX55oArWQtt8-p0BrDqIsXx0bFuURH7qY9-iT5YGSYE-PdKeII4TTBnlDtJTyTcoEeET_B8eAhvT4zC2-ZF6xlHMDctrCUIMIbKyDKo-YGazSvpMxdKzcZHAtMCJ0WADEDhvKegE5C2E30AErfYv7_bhUAa7si2lmUR8XeiCN983POQRpSedBMt6OHXzngFWmhsQykmBRSfpo"/>
</div>
<div>
<p className="font-medium text-on-surface">Marcus Chen</p>
<p className="text-xs text-on-surface-variant">marcus.chen@studio.io</p>
</div>
</div>
</td>
<td className="px-6 py-5 max-w-xs">
<p className="font-medium text-on-surface truncate">Feedback on Residential Concept</p>
<p className="text-sm text-on-surface-variant truncate">The lighting studies you shared were incredibly insightful. I have some thoughts on...</p>
</td>
<td className="px-6 py-5">
<p className="text-sm text-on-surface-variant font-medium">Oct 23, 2023</p>
<p className="text-xs text-on-surface-variant/60">03:15 PM</p>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container-high text-on-surface-variant">
                                        Read
                                    </span>
</td>
<td className="px-6 py-5 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-primary hover:bg-primary-container/30 rounded-lg transition-colors">
<Eye className="w-5 h-5" />
</button>
<button className="p-2 text-on-surface-variant hover:bg-error-container/10 hover:text-error rounded-lg transition-colors">
<Trash2 className="w-5 h-5" />
</button>
</div>
</td>
</tr>
{/* <!-- Row 3: Read --> */}
<tr className="group hover:bg-surface-container-low/40 transition-colors cursor-pointer">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-sm">SW</div>
<div>
<p className="font-medium text-on-surface">Sarah Williams</p>
<p className="text-xs text-on-surface-variant">sarah.w@freelance.com</p>
</div>
</div>
</td>
<td className="px-6 py-5 max-w-xs">
<p className="font-medium text-on-surface truncate">Partnership Opportunity</p>
<p className="text-sm text-on-surface-variant truncate">I'm reaching out from the design collective to see if you'd be interested in...</p>
</td>
<td className="px-6 py-5">
<p className="text-sm text-on-surface-variant font-medium">Oct 22, 2023</p>
<p className="text-xs text-on-surface-variant/60">09:12 AM</p>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container-high text-on-surface-variant">
                                        Read
                                    </span>
</td>
<td className="px-6 py-5 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-primary hover:bg-primary-container/30 rounded-lg transition-colors">
<Eye className="w-5 h-5" />
</button>
<button className="p-2 text-on-surface-variant hover:bg-error-container/10 hover:text-error rounded-lg transition-colors">
<Trash2 className="w-5 h-5" />
</button>
</div>
</td>
</tr>
{/* <!-- Row 4: Read --> */}
<tr className="group hover:bg-surface-container-low/40 transition-colors cursor-pointer">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
<img alt="Elena Rodriguez" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNjL5NWBHvQgZx2krAo5A9YTzfJbJHZEEcYon9FV4x3dhitwQWazNruwgKU54TOnYbm7rjpfHUmlcK3gE5iDXsUQWA_lDnV6DVqBWndsQN5ddUKwoNk4C_aSbcU3idh-ZnXjF6Bchz8sh219wPWJaV_0Zhl2Jyjn47m6JA1ZVN-x0qY83bmrnNXBSAWkzFdX_NIZZGUbpwDRWTNhSA6dcbf0zk0vM3_TP0ESWM2xcZ2EfXWaWgvkBkiXOpVH9s1Iksop5OEsXd8Wg"/>
</div>
<div>
<p className="font-medium text-on-surface">Elena Rodriguez</p>
<p className="text-xs text-on-surface-variant">elena.rod@vanguard.com</p>
</div>
</div>
</td>
<td className="px-6 py-5 max-w-xs">
<p className="font-medium text-on-surface truncate">Speaking Engagement Invitation</p>
<p className="text-sm text-on-surface-variant truncate">We would be honored to have you as a keynote speaker for the upcoming...</p>
</td>
<td className="px-6 py-5">
<p className="text-sm text-on-surface-variant font-medium">Oct 21, 2023</p>
<p className="text-xs text-on-surface-variant/60">11:55 AM</p>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container-high text-on-surface-variant">
                                        Read
                                    </span>
</td>
<td className="px-6 py-5 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-primary hover:bg-primary-container/30 rounded-lg transition-colors">
<Eye className="w-5 h-5" />
</button>
<button className="p-2 text-on-surface-variant hover:bg-error-container/10 hover:text-error rounded-lg transition-colors">
<Trash2 className="w-5 h-5" />
</button>
</div>
</td>
</tr>
{/* <!-- Row 5: Unread --> */}
<tr className="group hover:bg-surface-container-low/40 transition-colors cursor-pointer">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="h-10 w-10 rounded-full bg-primary-container text-primary font-bold flex items-center justify-center text-sm shadow-sm">BK</div>
<div>
<p className="font-bold text-on-surface">Bradley Kemp</p>
<p className="text-xs text-on-surface-variant">bkemp@kempbuilders.com</p>
</div>
</div>
</td>
<td className="px-6 py-5 max-w-xs">
<p className="font-semibold text-on-surface truncate">Urgent: Supply Chain Update</p>
<p className="text-sm text-on-surface-variant truncate">Regarding the timber order for the lakehouse project, there's been a delay...</p>
</td>
<td className="px-6 py-5">
<p className="text-sm text-on-surface-variant font-medium">Oct 21, 2023</p>
<p className="text-xs text-on-surface-variant/60">08:30 AM</p>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-error-container/10 text-on-error-container">
<span className="h-1.5 w-1.5 rounded-full bg-error mr-2"></span>
                                        Unread
                                    </span>
</td>
<td className="px-6 py-5 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-primary hover:bg-primary-container/30 rounded-lg transition-colors">
<Eye className="w-5 h-5" />
</button>
<button className="p-2 text-on-surface-variant hover:bg-error-container/10 hover:text-error rounded-lg transition-colors">
<Trash2 className="w-5 h-5" />
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/* <!-- Pagination --> */}
<div className="px-6 py-5 bg-surface-container-low/20 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-outline-variant/10">
<p className="text-sm text-on-surface-variant">
                        Showing <span className="font-semibold text-on-surface">1</span> to <span className="font-semibold text-on-surface">10</span> of <span className="font-semibold text-on-surface">42</span> messages
                    </p>
<div className="flex items-center gap-1">
<button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors disabled:opacity-30">
<ChevronLeft className="w-5 h-5" />
</button>
<button className="h-8 w-8 flex items-center justify-center bg-primary text-on-primary rounded-lg text-sm font-bold shadow-md shadow-primary/20">1</button>
<button className="h-8 w-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded-lg text-sm font-medium transition-colors">2</button>
<button className="h-8 w-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded-lg text-sm font-medium transition-colors">3</button>
<span className="px-2 text-on-surface-variant/50">...</span>
<button className="h-8 w-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded-lg text-sm font-medium transition-colors">5</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
<ChevronRight className="w-5 h-5" />
</button>
</div>
</div>
</div>
{/* <!-- Contextual Footer Help --> */}
<div className="mt-12 flex items-center justify-center gap-8 py-8 opacity-40 grayscale">
<img alt="Logo 1" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw7Shps2kUwYV-6Umb-DX6z7UOAoigZ3pdGhfkgSbw_pAFsxra5qRpoSk5lYTvamQp9pEhuR7xQ7rkZMKY2g_lTibnHO38p-shImO1fQOZW4i__CosUkst0YbAN3mm2Xc_uW29S0U3gvoNqqXRL8l-3HMphrc0myAAH7_LcRDQEmRRvBDmNDVkbYrkTCjQXNkXUlHxEnsePfu0Q69Nm8taNqQ-wcY5RHoCE2ybgoMxnMfrRtXGtaUSj6r01yOQWT4xHMnH_AaA7oY"/>
<img alt="Logo 2" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBi6PC99ha5amY06vuFBZ9LWD7Xt6STyPm4V44ZbtFhQYky0FfFsweN2NE5J92XsMnyHvnUBVHe17xADlN8xzxW2CcE-QXUO96Zp3mv_tDdLrFH4cC2r_Y8fqkHv_yw2m2ZPcku8JrYzSzrNjtxx21Mv6PFNCYeLxu89dnysyn13qZGXJi6sA7wS3TnJ5gdZSTZG_7bX-xWr80XAo5ObYH8A5kVkhmWUW0OjkY68kglzaK2j1rx05M3vmaLS2u3JSQ4LvPbkCmhr8"/>
<img alt="Logo 3" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQwIdenncYaYkA1IPJOVDITql9nF26PwB3qXGcpteJgvciVAB1KBr4B0C8AxsF1J1n8Kwz0SgK-pbSM2x5Aioigi6prPfBZw9SrV8z6QmWjAUvmClcKDV7hEI18BbdVn3B1O1rz8BaM_ambHLsh87T98m337sUGtahMYBymlFBHk8QCKpnnWQ6CrWuLXHGKBEiAtM1r3cAsAPgQWjrX7ZnuGKLuxdW8xiB3RmExERFqLCaEAKv5j4VxWt1L2zKONvfQFpgVfFZIq4"/>
</div>
    </>
  )
}

export default page