"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { 
  MessageCircle, 
  Search, 
  Filter, 
  Mail, 
  Trash2, 
  Eye, 
  Clock, 
  User, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  ArrowLeft,
  Loader2,
  RefreshCcw,
  ChevronLeft
} from 'lucide-react'
import { getMessages, markAsRead, deleteMessage } from '@/actions/message'
import { sendReply } from '@/actions/email'
import { toast } from 'sonner'

import { formatDistanceToNow } from 'date-fns'

const MessagesClient = () => {
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
    const [replyText, setReplyText] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;



    const fetchMessages = async () => {
        setLoading(true)
        const data = await getMessages()
        setMessages(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const filteredMessages = useMemo(() => {
        return messages.filter(m => {
            const matchesSearch = 
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                m.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                m.message.toLowerCase().includes(searchQuery.toLowerCase())
            
            const matchesFilter = 
                filter === 'all' || 
                (filter === 'unread' && !m.is_read) || 
                (filter === 'read' && m.is_read)
            
            return matchesSearch && matchesFilter
        })
    }, [messages, searchQuery, filter])

    // Pagination
    const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
    const paginatedMessages = filteredMessages.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filter]);

    const selectedMessage = messages.find(m => m.id === selectedId)

    const handleSelect = async (id: string) => {
        setSelectedId(id)
        setReplyText('') // Reset reply text on selection change
        const msg = messages.find(m => m.id === id)
        if (msg && !msg.is_read) {
            await markAsRead(id)
            setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m))
        }
    }

    const handleSendReply = async () => {
        if (!selectedMessage || !replyText.trim()) return;
        
        try {
            setIsSending(true);
            const res = await sendReply(selectedMessage.email, selectedMessage.name, replyText);
            
            if (res.success) {
                toast.success("Response sent successfully!");
                setReplyText('');
            } else {
                toast.error(res.error || "Failed to send response");
                // Fallback to mailto if server-side send fails (e.g. missing API key)
                if (res.error?.includes("API_KEY")) {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: Inquiry&body=${encodeURIComponent(replyText)}`;
                }
            }
        } catch (error: any) {
            toast.error("An error occurred while sending");
        } finally {
            setIsSending(false);
        }
    };

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation()

        toast("Delete inquiry?", {
            description: "Are you sure you want to permanently delete this message?",
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        const res = await deleteMessage(id)
                        if (res.success) {
                            setMessages(prev => prev.filter(m => m.id !== id))
                            if (selectedId === id) setSelectedId(null)
                            toast.success("Message deleted")
                        } else {
                            toast.error("Failed to delete")
                        }
                    } catch (error) {
                        toast.error("Error deleting message")
                    }
                }
            }
        })
    }

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] sm:h-[calc(100vh-theme(spacing.20))] overflow-hidden bg-[#fafafa]">
            {/* Header */}
            <header className="px-4 sm:px-8 py-4 sm:py-6 bg-white border-b border-slate-100 flex flex-col xs:flex-row items-center justify-between gap-4">
                <div className="flex items-center justify-between w-full xs:w-auto">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-100/50">
                            <MessageCircle size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        Inquiries
                    </h1>
                    <button 
                        onClick={fetchMessages}
                        className="xs:hidden p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all rounded-xl border border-transparent"
                        title="Refresh"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 w-full xs:w-auto">
                    <div className="relative group flex-1 xs:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            className="w-full xs:w-48 lg:w-72 pl-10 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs sm:text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all focus:bg-white focus:border-indigo-100 placeholder:text-slate-400"
                            placeholder="Search in history..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={fetchMessages}
                        className="hidden xs:flex p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all rounded-xl border border-slate-100"
                        title="Refresh"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar List */}
                <aside className={`absolute inset-0 z-20 bg-white md:relative md:flex md:flex-col md:w-[320px] lg:w-96 border-r border-slate-100 transition-transform duration-300 ${selectedId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                    <div className="p-3.5 border-b border-slate-50 flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-50/20">
                        {(['all', 'unread', 'read'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${
                                    filter === f 
                                    ? "bg-slate-900 border-slate-900 text-white shadow-slate-200" 
                                    : "bg-white border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto scroller">
                        {loading && messages.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 text-slate-200 border border-slate-100">
                                    <MessageCircle size={28} />
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No results found</p>
                            </div>
                        ) : (
                            <div className="flex flex-col min-h-full">
                                <div className="flex-1 overflow-y-auto scroller divide-y divide-slate-50">
                                    {paginatedMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    onClick={() => handleSelect(msg.id)}
                                    className={`group p-5 cursor-pointer transition-all border-l-4 ${
                                        selectedId === msg.id 
                                        ? "bg-indigo-50/30 border-l-indigo-600 shadow-inner" 
                                        : "hover:bg-slate-50/40 border-l-transparent"
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            {!msg.is_read && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)] shrink-0" />}
                                            <h3 className={`text-[13px] tracking-tight truncate ${msg.is_read ? 'font-bold text-slate-500' : 'font-black text-slate-900'}`}>
                                                {msg.name}
                                            </h3>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-300 shrink-0 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: false })}
                                        </span>
                                    </div>
                                    <p className={`text-[12px] font-medium leading-relaxed line-clamp-2 ${msg.is_read ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {msg.message}
                                    </p>
                                </div>
                                ))}
                                </div>
                                
                                {/* Pagination Footer */}
                                {totalPages > 1 && (
                                    <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between mt-auto">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">
                                            {currentPage} <span className="opacity-30">/</span> {totalPages}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 disabled:opacity-30 hover:bg-slate-50 hover:shadow-sm transition-all active:scale-90"
                                            >
                                                <ChevronLeft size={14} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 disabled:opacity-30 hover:bg-slate-50 hover:shadow-sm transition-all active:scale-90"
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Content Panel */}
                <main className={`flex-1 flex flex-col bg-white overflow-hidden transition-all duration-300 shadow-2xl md:shadow-none ${!selectedId ? 'translate-x-full md:translate-x-0' : 'translate-x-0 group'}`}>
                    {selectedMessage ? (
                        <div className="flex flex-col h-full">
                            <div className="px-4 sm:px-8 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setSelectedId(null)}
                                        className="md:hidden p-2 -ml-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-400 shadow-inner">
                                        <User size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-[13px] sm:text-[14px] font-black text-slate-900 truncate leading-tight">{selectedMessage.name}</h2>
                                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold truncate tracking-tight">{selectedMessage.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button 
                                        onClick={() => handleDelete(selectedMessage.id)}
                                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                                        title="Delete inquiry"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-12 scroller">
                                <div className="max-w-2xl mx-auto space-y-10">
                                    <div className="bg-slate-50/50 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm relative overflow-hidden group/message">
                                        <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] pointer-events-none group-hover/message:scale-110 transition-transform duration-700">
                                            <MessageCircle size={150} />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 mb-8">
                                            <div className="px-3.5 py-1.5 bg-white rounded-full border border-slate-100 flex items-center gap-2 shadow-sm italic">
                                                <Clock size={12} className="text-indigo-500" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                                    {new Date(selectedMessage.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                                </span>
                                            </div>
                                            {selectedMessage.is_read && (
                                                <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-2 shadow-sm shadow-emerald-500/5">
                                                    <CheckCircle2 size={12} strokeWidth={3} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Read Receipts</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-slate-700 text-[15px] sm:text-[17px] font-medium leading-[1.8] whitespace-pre-wrap selection:bg-indigo-100 tracking-tight">
                                            {selectedMessage.message}
                                        </p>
                                    </div>

                                    {/* Reply Area */}
                                    <div className="space-y-6 pb-20 md:pb-10">
                                        <div className="flex items-center gap-2 mb-2 px-2">
                                            <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">Quick Response</h3>
                                            <div className="flex-1 h-px bg-slate-100" />
                                        </div>
                                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/20 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-200 transition-all overflow-hidden group/reply">
                                            <textarea 
                                                className="w-full p-6 sm:p-8 text-[14px] sm:text-[15px] font-bold text-slate-700 bg-transparent border-none focus:ring-0 resize-none leading-relaxed placeholder:text-slate-200 min-h-[200px]"
                                                placeholder={`Draft your message to ${selectedMessage.name}...`}
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                            <div className="px-6 sm:px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 italic text-[10px] font-bold">@</div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                         {selectedMessage.email}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleSendReply}
                                                    disabled={isSending || !replyText.trim()}
                                                    className={`w-full sm:w-auto px-8 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2.5 shadow-2xl shadow-slate-900/10 transition-all ${isSending || !replyText.trim() ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:bg-indigo-600 hover:scale-[1.03] active:scale-95'}`}
                                                >
                                                    {isSending ? (
                                                        <>
                                                            <Loader2 size={16} className="animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Mail size={16} />
                                                            Send Email
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#fafafa]">
                            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-slate-200/50 text-slate-50 group hover:shadow-indigo-500/10 transition-all">
                                <MessageCircle size={40} className="text-slate-100 group-hover:text-indigo-100 transition-colors duration-500" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Zero inquiry selected</h2>
                            <p className="text-[13px] text-slate-400 font-medium mt-3 max-w-xs leading-relaxed italic">
                                Sift through your visitor inquiries and keep your discussions organized by picking a message from the list.
                            </p>
                        </div>
                    )}
                </main>
            </div>

            <style jsx>{`
                .scroller::-webkit-scrollbar {
                    width: 4px;
                }
                .scroller::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scroller::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .scroller-hide::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}

export default MessagesClient