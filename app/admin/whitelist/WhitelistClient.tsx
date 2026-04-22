"use client";

import React, { useEffect, useState, useTransition } from "react";
import { UserPlus, Trash2, Mail, Loader2, ShieldCheck, Search, Users, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { myAppHook } from "@/context/AppUtils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAllowedUsers, addAllowedUser, removeAllowedUser } from "@/actions/whitelist";

const WhitelistClient = () => {
    const router = useRouter();
    const { isLoggedIn, isLoading: authLoading } = myAppHook();
    const [isPending, startTransition] = useTransition();
    
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newEmail, setNewEmail] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE =10;

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/auth/login");
        }
    }, [isLoggedIn, authLoading, router]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getAllowedUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Failed to load whitelist");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchUsers();
        }
    }, [isLoggedIn]);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail) return;

        startTransition(async () => {
            const result = await addAllowedUser(newEmail);
            if (result.success) {
                toast.success("User added to whitelist");
                setNewEmail("");
                fetchUsers();
            } else {
                toast.error(result.error || "Failed to add user");
            }
        });
    };

    const handleRemoveUser = async (id: string, email: string) => {
        toast("Remove Authorized Email?", {
            description: `Are you sure you want to remove ${email} from the whitelist?`,
            action: {
                label: "Remove",
                onClick: () => {
                    startTransition(async () => {
                        const result = await removeAllowedUser(id);
                        if (result.success) {
                            toast.success("User removed from whitelist");
                            fetchUsers();
                        } else {
                            toast.error(result.error || "Failed to remove user");
                        }
                    });
                }
            },
        });
    };

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (authLoading || (isLoggedIn && isLoading && users.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 md:space-y-8 pb-24">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-indigo-600" />
                        Signup Whitelist
                    </h2>
                    <p className="text-slate-500 mt-1.5 font-medium text-sm">
                        Manage which email addresses are authorized to create accounts.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Add User Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 sticky top-24">
                        <div className="space-y-1">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-indigo-600" />
                                Add Authorized Email
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">Grant registration access to a new user.</p>
                        </div>
                        
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input 
                                        type="email"
                                        placeholder="user@example.com"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={isPending || !newEmail}
                                className="w-full py-3.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:scale-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" strokeWidth={3} />}
                                Authorize Email
                            </button>
                        </form>
                    </div>
                </div>

                {/* Whitelist Table */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="Search emails..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="flex items-center gap-2 self-end sm:self-auto text-slate-400 text-[10px] font-black px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                                <Users className="w-3 h-3 text-indigo-500" />
                                {users.length} <span className="opacity-50">AUTHORIZED</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-0">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 italic">User Email</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 italic hidden sm:table-cell">Date Added</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 italic text-right pl-0 px-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paginatedUsers.length > 0 ? (
                                        paginatedUsers.map((user) => (
                                            <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800 text-[14px]">{user.email}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium sm:hidden mt-0.5">
                                                        Added {new Date(user.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden sm:table-cell">
                                                    <div className="text-xs font-semibold text-slate-500 bg-slate-50 py-1 px-2.5 rounded-lg border border-slate-100 w-fit">
                                                        {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleRemoveUser(user.id, user.email)}
                                                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-red-100"
                                                        title="Revoke access"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-20 text-center text-slate-400">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                                                        <Users className="w-8 h-8 text-slate-200" />
                                                    </div>
                                                    <p className="font-bold text-slate-500 text-sm">No emails whitelisted</p>
                                                    <p className="text-[11px] mt-1 opacity-70">Start by adding an authorized email on the left.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        {filteredUsers.length > 0 && (
                            <div className="px-4 md:px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-col xs:flex-row items-center justify-between gap-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}—{Math.min(filteredUsers.length, currentPage * ITEMS_PER_PAGE)} <span className="opacity-40 mx-1">OF</span> {filteredUsers.length}
                                </p>
                                
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 disabled:opacity-30 hover:bg-slate-50 hover:shadow-sm transition-all"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>
                                        
                                        <div className="flex items-center gap-1 mx-1 overflow-x-auto no-scrollbar max-w-[120px] xs:max-w-none">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                const isVisible = totalPages <= 5 || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                                                if (!isVisible) return page === 2 || page === totalPages - 1 ? <span key={page} className="text-slate-300 px-0.5">.</span> : null;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`min-w-[32px] h-8 text-[11px] font-black rounded-xl transition-all ${
                                                            currentPage === page 
                                                                ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                                                                : "text-slate-400 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 disabled:opacity-30 hover:bg-slate-50 hover:shadow-sm transition-all"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhitelistClient;
