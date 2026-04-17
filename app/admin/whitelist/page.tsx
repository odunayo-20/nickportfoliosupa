"use client";

import React, { useEffect, useState, useTransition } from "react";
import { UserPlus, Trash2, Mail, Loader2, ShieldCheck, Search, Users, Plus } from "lucide-react";
import { myAppHook } from "@/context/AppUtils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAllowedUsers, addAllowedUser, removeAllowedUser } from "@/actions/whitelist";

const WhitelistPage = () => {
    const router = useRouter();
    const { isLoggedIn, isLoading: authLoading } = myAppHook();
    const [isPending, startTransition] = useTransition();
    
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newEmail, setNewEmail] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

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
        if (!confirm(`Are you sure you want to remove ${email} from the whitelist?`)) return;

        startTransition(async () => {
            const result = await removeAllowedUser(id);
            if (result.success) {
                toast.success("User removed from whitelist");
                fetchUsers();
            } else {
                toast.error(result.error || "Failed to remove user");
            }
        });
    };

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading || (isLoggedIn && isLoading && users.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-indigo-600" />
                        Signup Whitelist
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium text-sm">
                        Manage which email addresses are authorized to create accounts.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add User Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <UserPlus className="w-4 h-4 text-indigo-600" />
                            Add Authorized Email
                        </h3>
                        
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="email"
                                        placeholder="user@example.com"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={isPending || !newEmail}
                                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:scale-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Authorize Email
                            </button>
                        </form>
                    </div>
                </div>

                {/* Whitelist Table */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="Search emails..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold px-2 py-1 bg-white border border-slate-100 rounded-lg">
                                <Users className="w-3 h-3" />
                                {users.length} TOTAL
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-50">Email</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-50">Authorized Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 border-b border-slate-50/50">
                                                    <div className="font-semibold text-slate-900">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 border-b border-slate-50/50">
                                                    <div className="text-sm text-slate-500">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 border-b border-slate-50/50 text-right">
                                                    <button 
                                                        onClick={() => handleRemoveUser(user.id, user.email)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90"
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
                                                    <Users className="w-12 h-12 text-slate-100 mb-4" />
                                                    <p className="font-semibold text-slate-500">No emails on the whitelist</p>
                                                    <p className="text-xs mt-1">Authorized emails will appear here</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhitelistPage;
