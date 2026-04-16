"use client"

import React, { useEffect, useState } from 'react'
import { FolderHeart, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient';
import { myAppHook } from '@/context/AppUtils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AuthPage = () => {
    const router = useRouter();
    const { isLoggedIn, isLoading: contextLoading } = myAppHook();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!contextLoading && isLoggedIn) {
            router.push("/admin/dashboard");
        }
    }, [isLoggedIn, contextLoading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
            toast.success("Welcome back!");
            router.push("/admin/dashboard");
        } catch (error: any) {
            console.error('Login error:', error.message);
            toast.error(error.message || "Invalid credentials");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialOauth = async (provider: "github" | "google") => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) {
            toast.error(`Error signing in with ${provider}`);
        }
    }

    if (contextLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className='bg-background font-body text-on-background flex min-h-screen items-center justify-center relative overflow-hidden'>
            {/* <!-- Ambient Background Blobs --> */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-surface-dim/30 blur-[120px] rounded-full"></div>
            
            <main className="w-full max-w-md px-6 z-10">
                <div className="surface-container-lowest glass-panel rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] p-8 md:p-12 border border-white/20 backdrop-blur-md">
                    <header className="flex flex-col items-center mb-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dim rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                            <FolderHeart className="text-white w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-slate-900">Architect</h1>
                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">Executive Portfolio Control</p>
                    </header>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black tracking-widest text-slate-400 uppercase ml-1" htmlFor="email">Security Identifier</label>
                            <input 
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all duration-300 placeholder:text-slate-300" 
                                id="email" 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="architect@portfolio.dev" 
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-[10px] font-black tracking-widest text-slate-400 uppercase ml-1" htmlFor="password">Access Key</label>
                            </div>
                            <input 
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all duration-300 placeholder:text-slate-300" 
                                id="password" 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" 
                                required
                            />
                        </div>

                        <button 
                            disabled={isSubmitting}
                            className="w-full bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-4 px-6 rounded-xl shadow-2xl hover:bg-primary active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50" 
                            type="submit"
                        >
                            {isSubmitting ? "Authenticating..." : "Establish Session"}
                            {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300"><span className="bg-white px-4">External Verification</span></div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <button 
                            onClick={() => handleSocialOauth("github")}
                            className="w-full bg-slate-50 border border-slate-100 hover:border-slate-300 text-slate-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            Connect via GitHub
                        </button>
                    </div>

                    <footer className="mt-10 pt-8 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Authorized Access Only <br />
                        </p>
                        <div className="mt-6 flex justify-center gap-6 opacity-40">
                            <ShieldCheck className="w-5 h-5 text-slate-400" />
                        </div>
                    </footer>
                </div>
            </main>

            <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
                <img alt="" className="w-full h-full object-cover" data-alt="abstract minimalist 3D flowing shapes with soft studio lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4R7E-Fv7s1782_YdLut_fp3YjwjYh178Wb-bXCAGXTFmxmeti93xvSeqaclbXLx2HzD2bDLyq8ETAx_PTe968jeaSfs9l51SBC3R0mZeIxA8fBJem5_xOv9nsy9LCilRBGD1YmVdCf9eW9sMHybpLjmDtHZvKBiJuukdnEDIjyH-iy2DadQL2axdMWJeXu9bpuJIsYrRSViaI1JRL1LaAPGSAr02Gz_87DUM0-hFnP-C0Qqc9QiVv-VV88DYcDoK5aJURWHsXAKc" />
            </div>
        </div>
    )
}

export default AuthPage
