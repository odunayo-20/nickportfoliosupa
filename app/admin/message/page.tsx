import React from 'react'
import { MessageCircle, Search, Filter } from 'lucide-react'

const MessagesPage = () => {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-1">Messages</h1>
        <p className="text-slate-500 font-medium text-sm">Inquiries from your portfolio contact form.</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all placeholder:text-slate-400"
              placeholder="Search messages…"
              type="text"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium text-sm rounded-lg transition-colors border border-slate-200">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-24 text-center px-6">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="text-slate-400" size={28} />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No messages yet</h3>
          <p className="text-sm text-slate-500 mt-1.5 max-w-sm">
            When visitors send messages through your portfolio contact form, they&apos;ll appear here.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MessagesPage