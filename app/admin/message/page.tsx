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

const MessagesPage = () => {
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
        <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] overflow-hidden bg-[#fafafa]">
            {/* Header */}
            <header className="px-8 py-6 bg-white border-b border-slate-200 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <MessageCircle size={20} />
                        </div>
                        Inquiries
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                        onClick={fetchMessages}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all rounded-xl"
                        title="Refresh"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all w-48 lg:w-72 placeholder:text-slate-400 border border-slate-100 focus:bg-white focus:border-indigo-100"
                            placeholder="Find inquiry..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar List */}
                <aside className={`absolute inset-0 z-20 bg-white md:relative md:flex md:flex-col md:w-96 border-r border-slate-100 transition-transform duration-300 ${selectedId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                    <div className="p-4 border-b border-slate-50 flex items-center gap-2 overflow-x-auto scroller-hide">
                        {(['all', 'unread', 'read'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${
                                    filter === f 
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto scroller">
                        {loading && messages.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <MessageCircle size={22} />
                                </div>
                                <p className="text-sm font-medium text-slate-400">No messages found</p>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto scroller">
                                    {paginatedMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    onClick={() => handleSelect(msg.id)}
                                    className={`group p-5 cursor-pointer border-b border-slate-50 transition-all ${
                                        selectedId === msg.id 
                                        ? "bg-indigo-50/50 border-l-4 border-l-indigo-600" 
                                        : "hover:bg-slate-50/50"
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-1.5">
                                        <div className="flex items-center gap-2 min-w-0">
                                            {!msg.is_read && <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
                                            <h3 className={`text-sm tracking-tight truncate ${msg.is_read ? 'font-semibold text-slate-600' : 'font-black text-slate-900'}`}>
                                                {msg.name}
                                            </h3>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
                                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: false })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                        {msg.message}
                                    </p>
                                </div>
                                ))}
                                </div>
                                
                                {/* Pagination Footer */}
                                {totalPages > 1 && (
                                    <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                            PG {currentPage} OF {totalPages}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-sm"
                                            >
                                                <ChevronLeft size={14} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-sm"
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
                <main className={`flex-1 flex flex-col bg-white overflow-hidden transition-all duration-300 ${!selectedId ? 'translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                    {selectedMessage ? (
                        <div className="flex flex-col h-full">
                            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                                <button 
                                    onClick={() => setSelectedId(null)}
                                    className="md:hidden p-2 -ml-2 text-slate-400 hover:text-indigo-600"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-slate-900">{selectedMessage.name}</h2>
                                        <p className="text-xs text-slate-400 font-medium">{selectedMessage.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleDelete(selectedMessage.id)}
                                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl"
                                        title="Delete inquiry"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                                <div className="max-w-2xl mx-auto space-y-8">
                                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                            <MessageCircle size={100} />
                                        </div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="px-3 py-1 bg-white rounded-full border border-slate-100 flex items-center gap-2 shadow-sm">
                                                <Clock size={12} className="text-indigo-500" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                                                    Sent {new Date(selectedMessage.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            {selectedMessage.is_read && (
                                                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-2">
                                                    <CheckCircle2 size={12} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Read</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-slate-700 text-sm md:text-base font-medium leading-[1.8] whitespace-pre-wrap selection:bg-indigo-100">
                                            {selectedMessage.message}
                                        </p>
                                    </div>

                                    {/* Reply Area */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Response</h3>
                                            <div className="flex-1 h-px bg-slate-100" />
                                        </div>
                                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-200 transition-all overflow-hidden">
                                            <textarea 
                                                className="w-full p-6 text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 resize-none leading-relaxed placeholder:text-slate-300 min-h-[160px]"
                                                placeholder={`Type your response to ${selectedMessage.name}...`}
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    Replying as {selectedMessage.email}
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleSendReply}
                                                        disabled={isSending || !replyText.trim()}
                                                        className={`px-6 py-2.5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-lg transition-all ${isSending || !replyText.trim() ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                                                    >
                                                        {isSending ? (
                                                            <>
                                                                <Loader2 size={14} className="animate-spin" />
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Mail size={14} />
                                                                Send Response
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#fafafa]">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 text-slate-100 group">
                                <MessageCircle size={32} className="text-slate-200 group-hover:scale-110 transition-transform" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Select an inquiry to read</h2>
                            <p className="text-xs text-slate-400 font-medium mt-2 max-w-xs leading-relaxed">
                                Pick a message from the list to view the full content and respond to your visitors.
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
            `}</style>
        </div>
    )
}

export default MessagesPage