"use client"

import React, { useEffect, useState } from 'react'
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient';
import { myAppHook } from '@/context/AppUtils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { z } from 'zod';

const LoginPage = () => {
    const router = useRouter();
    const { isLoggedIn, isLoading: contextLoading } = myAppHook();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    // Zod schema for login
    const loginSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required")
    });

    useEffect(() => {
        if (!contextLoading && isLoggedIn) {
            console.log("User is logged in, redirecting to dashboard");
            router.refresh();
            router.push("/admin/dashboard");
        }
        
        // Handle OAuth whitelist errors
        const query = new URLSearchParams(window.location.search);
        if (query.get('error') === 'unauthorized_email') {
            toast.error("This email is not authorized to access this site.");
            // Clean up the URL
            router.replace('/auth/login');
        }
    }, [isLoggedIn, contextLoading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validate with Zod
        const result = loginSchema.safeParse({ email, password });

        if (!result.success) {
            const fieldErrors: any = {};
            result.error.issues.forEach((issue) => {
                if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setIsSubmitting(true);
        
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
            toast.success("Welcome back!");
            router.refresh();
            router.push("/admin/dashboard");
        } catch (error: any) {
            console.error('Login error:', error.message);
            
            if (error.message?.includes("Invalid login credentials")) {
                setErrors({ 
                    email: "Invalid email or password",
                    password: " " // Using a space to trigger the red border without double text
                });
            } else {
                toast.error(error.message || "Invalid credentials");
            }
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

    useEffect(() => {
        console.log("LoginPage mounted, contextLoading:", contextLoading);
    }, [contextLoading]);

    if (contextLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0f]">
                <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <style>{`
                /* ── Reset & Base ── */
                .auth-page {
                    display: flex;
                    min-height: 100vh;
                    min-height: 100dvh;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    flex-direction: column;
                    width: 100%;
                }
                @media (min-width: 1024px) {
                    .auth-page { flex-direction: row; }
                }

                /* ── Brand Panel (Desktop only — left side) ── */
                .auth-brand-panel {
                    display: none;
                    width: 45%;
                    background: #0a0a0f;
                    position: relative;
                    overflow: hidden;
                    padding: 3rem;
                    flex-direction: column;
                    justify-content: space-between;
                    flex-shrink: 0;
                }
                @media (min-width: 1024px) {
                    .auth-brand-panel { display: flex; }
                }

                .auth-brand-panel::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 80% 60% at 20% 80%, rgba(99,102,241,0.15), transparent),
                        radial-gradient(ellipse 60% 50% at 80% 20%, rgba(168,85,247,0.1), transparent);
                }

                .auth-grid-pattern {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 60px 60px;
                }

                .auth-brand-logo {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .auth-brand-logo-mark {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 16px;
                    color: white;
                    letter-spacing: -0.5px;
                }

                .auth-brand-logo-text {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: white;
                    letter-spacing: -0.02em;
                }

                .auth-brand-content {
                    position: relative;
                    z-index: 2;
                }

                .auth-brand-headline {
                    font-size: 2.75rem;
                    font-weight: 800;
                    color: white;
                    line-height: 1.1;
                    letter-spacing: -0.03em;
                    margin-bottom: 1.25rem;
                }

                .auth-brand-headline span {
                    background: linear-gradient(135deg, #818cf8, #c084fc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .auth-brand-subtext {
                    color: rgba(255,255,255,0.4);
                    font-size: 1rem;
                    line-height: 1.7;
                    max-width: 380px;
                }

                .auth-brand-footer {
                    position: relative;
                    z-index: 2;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    padding-top: 1.5rem;
                }

                .auth-testimonial {
                    color: rgba(255,255,255,0.5);
                    font-size: 0.875rem;
                    line-height: 1.6;
                    font-style: italic;
                    margin-bottom: 1rem;
                }

                .auth-testimonial-author {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .auth-testimonial-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 700;
                    color: white;
                }

                .auth-testimonial-name {
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.7);
                }

                .auth-testimonial-role {
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.3);
                }

                /* ── Mobile Brand Header ── */
                .auth-mobile-header {
                    display: flex;
                    background: #0a0a0f;
                    padding: 2rem 1.5rem 1.75rem;
                    flex-direction: column;
                    gap: 1rem;
                    position: relative;
                    overflow: hidden;
                }
                @media (min-width: 480px) {
                    .auth-mobile-header { padding: 2.5rem 2rem 2rem; }
                }
                @media (min-width: 1024px) {
                    .auth-mobile-header { display: none; }
                }

                .auth-mobile-header::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 90% 80% at 50% 100%, rgba(99,102,241,0.12), transparent);
                }

                .auth-mobile-header-logo {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                }

                .auth-mobile-header-logo-mark {
                    width: 30px;
                    height: 30px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 13px;
                    color: white;
                }

                .auth-mobile-header-logo-text {
                    font-size: 0.9375rem;
                    font-weight: 700;
                    color: white;
                    letter-spacing: -0.02em;
                }

                .auth-mobile-header-title {
                    position: relative;
                    z-index: 2;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: white;
                    letter-spacing: -0.03em;
                    line-height: 1.15;
                    margin: 0;
                }
                @media (min-width: 480px) {
                    .auth-mobile-header-title { font-size: 1.75rem; }
                }

                .auth-mobile-header-title span {
                    background: linear-gradient(135deg, #818cf8, #c084fc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* ── Form Panel ── */
                .auth-form-panel {
                    flex: 1;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding: 2rem 1.25rem 3rem;
                    background: #fafafa;
                    position: relative;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
                @media (min-width: 480px) {
                    .auth-form-panel { padding: 2.5rem 2rem 3rem; }
                }
                @media (min-width: 640px) {
                    .auth-form-panel { padding: 3rem; }
                }
                @media (min-width: 1024px) {
                    .auth-form-panel {
                        align-items: center;
                        padding: 3rem;
                    }
                }

                .auth-form-wrapper {
                    width: 100%;
                    max-width: 400px;
                }

                .auth-form-header {
                    margin-bottom: 1.75rem;
                }
                @media (min-width: 640px) {
                    .auth-form-header { margin-bottom: 2rem; }
                }

                .auth-form-title {
                    font-size: 1.375rem;
                    font-weight: 700;
                    color: #111;
                    letter-spacing: -0.025em;
                    margin: 0 0 0.375rem 0;
                }
                @media (min-width: 480px) {
                    .auth-form-title { font-size: 1.5rem; }
                }
                @media (min-width: 640px) {
                    .auth-form-title { font-size: 1.625rem; margin-bottom: 0.5rem; }
                }

                .auth-form-subtitle {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin: 0;
                    line-height: 1.5;
                }
                @media (min-width: 640px) {
                    .auth-form-subtitle { font-size: 0.9375rem; }
                }

                .auth-form-subtitle a {
                    color: #6366f1;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .auth-form-subtitle a:hover { color: #4f46e5; }

                /* ── Social Buttons ── */
                .auth-social-row {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 0.625rem;
                    margin-bottom: 1.5rem;
                }
                @media (min-width: 380px) {
                    .auth-social-row {
                        grid-template-columns: 1fr 1fr;
                        gap: 0.75rem;
                    }
                }
                @media (min-width: 640px) {
                    .auth-social-row { margin-bottom: 1.75rem; }
                }

                .auth-social-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.6875rem 1rem;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: #374151;
                    cursor: pointer;
                    transition: all 0.15s ease;
                    -webkit-tap-highlight-color: transparent;
                }
                .auth-social-btn:hover {
                    border-color: #d1d5db;
                    background: #f9fafb;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                }
                .auth-social-btn:active {
                    transform: scale(0.985);
                    background: #f3f4f6;
                }

                .auth-social-btn svg {
                    width: 18px;
                    height: 18px;
                    flex-shrink: 0;
                }

                /* ── Divider ── */
                .auth-divider {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }
                @media (min-width: 640px) {
                    .auth-divider {
                        gap: 1rem;
                        margin-bottom: 1.75rem;
                    }
                }

                .auth-divider-line {
                    flex: 1;
                    height: 1px;
                    background: #e5e7eb;
                }

                .auth-divider-text {
                    font-size: 0.6875rem;
                    color: #9ca3af;
                    font-weight: 500;
                    white-space: nowrap;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                @media (min-width: 640px) {
                    .auth-divider-text {
                        font-size: 0.75rem;
                        text-transform: none;
                        letter-spacing: normal;
                    }
                }

                /* ── Form Fields ── */
                .auth-field {
                    margin-bottom: 1.125rem;
                }
                @media (min-width: 640px) {
                    .auth-field { margin-bottom: 1.25rem; }
                }

                .auth-label {
                    display: block;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.375rem;
                }

                .auth-input-wrap {
                    position: relative;
                }

                .auth-input {
                    width: 100%;
                    padding: 0.75rem 0.875rem;
                    background: white;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 1rem;
                    color: #111;
                    outline: none;
                    transition: all 0.15s ease;
                    font-family: inherit;
                    -webkit-appearance: none;
                    appearance: none;
                }
                @media (min-width: 640px) {
                    .auth-input {
                        padding: 0.6875rem 0.875rem;
                        font-size: 0.875rem;
                    }
                }
                .auth-input::placeholder { color: #c7cad0; }
                .auth-input:hover { border-color: #d1d5db; }
                .auth-input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }

                .auth-password-toggle {
                    position: absolute;
                    right: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #9ca3af;
                    padding: 0.375rem;
                    display: flex;
                    align-items: center;
                    transition: color 0.15s;
                    -webkit-tap-highlight-color: transparent;
                }
                .auth-password-toggle:hover { color: #6b7280; }

                /* ── Submit ── */
                .auth-submit {
                    width: 100%;
                    padding: 0.8125rem 1.5rem;
                    background: #111;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.15s ease;
                    font-family: inherit;
                    margin-top: 0.5rem;
                    -webkit-tap-highlight-color: transparent;
                    -webkit-appearance: none;
                }
                @media (min-width: 640px) {
                    .auth-submit {
                        padding: 0.75rem 1.5rem;
                        font-size: 0.875rem;
                    }
                }
                .auth-submit:hover {
                    background: #1a1a2e;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .auth-submit:active {
                    transform: translateY(0);
                    background: #000;
                }
                .auth-submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .auth-submit svg {
                    transition: transform 0.2s;
                }
                .auth-submit:hover svg {
                    transform: translateX(2px);
                }

                /* ── Footer ── */
                .auth-footer {
                    margin-top: 1.75rem;
                    text-align: center;
                    font-size: 0.8125rem;
                    color: #9ca3af;
                }
                @media (min-width: 640px) {
                    .auth-footer { margin-top: 2rem; }
                }
                .auth-footer a {
                    color: #6366f1;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .auth-footer a:hover { color: #4f46e5; }
                
                .error-text {
                    color: #ef4444;
                    font-size: 0.75rem;
                    margin-top: 4px;
                    font-weight: 500;
                }

                /* ── Subtle form panel accents ── */
                .auth-form-panel::before {
                    content: '';
                    position: absolute;
                    top: -20%;
                    right: -10%;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(99,102,241,0.04), transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }
                .auth-form-panel::after {
                    content: '';
                    position: absolute;
                    bottom: -15%;
                    left: -5%;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(168,85,247,0.03), transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }
                .auth-label-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 0.375rem;
                }
                .auth-forgot-link {
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #6366f1;
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .auth-forgot-link:hover {
                    color: #4f46e5;
                }
            `}</style>

            {/* ── Desktop Brand Panel ── */}
            <div className="auth-brand-panel">
                <div className="auth-grid-pattern" />

                <div className="auth-brand-logo">
                    <div className="auth-brand-logo-mark">N</div>
                    <div className="auth-brand-logo-text">Nikola</div>
                </div>

                <div className="auth-brand-content">
                    <h1 className="auth-brand-headline">
                        Build your<br />
                        portfolio.<br />
                        <span>Own your story.</span>
                    </h1>
                    <p className="auth-brand-subtext">
                        A purpose-built workspace for managing your projects, blog, and professional presence — all from one dashboard.
                    </p>
                </div>

                <div className="auth-brand-footer">
                    <p className="auth-testimonial">
                        &ldquo;Finally, a portfolio tool that doesn&apos;t get in my way. Clean, fast, and exactly what I needed.&rdquo;
                    </p>
                    <div className="auth-testimonial-author">
                        <div className="auth-testimonial-avatar">N</div>
                        <div>
                            <div className="auth-testimonial-name">Nick</div>
                            <div className="auth-testimonial-role">Developer & Designer</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mobile Brand Header ── */}
            <div className="auth-mobile-header">
                <div className="auth-mobile-header-logo">
                    <div className="auth-mobile-header-logo-mark">N</div>
                    <div className="auth-mobile-header-logo-text">Nikola</div>
                </div>
                <h1 className="auth-mobile-header-title">
                    Welcome back.<br />
                    <span>Let&apos;s build.</span>
                </h1>
            </div>

            {/* ── Form Panel ── */}
            <div className="auth-form-panel">
                <div className="auth-form-wrapper">
                    <div className="auth-form-header">
                        <h2 className="auth-form-title">Sign in to your account</h2>
                        <p className="auth-form-subtitle">
                            Don&apos;t have an account?{' '}
                            <Link href="/auth/sign-up">Sign up</Link>
                        </p>
                    </div>

                    {/* Social login */}
                    {/* <div className="auth-social-row">
                        <button type="button" className="auth-social-btn" onClick={() => handleSocialOauth("github")}>
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            GitHub
                        </button>
                        <button type="button" className="auth-social-btn" onClick={() => handleSocialOauth("google")}>
                            <svg viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                    </div> */}

                    <div className="auth-divider">
                        <div className="auth-divider-line" />
                        <span className="auth-divider-text">or continue with email</span>
                        <div className="auth-divider-line" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin}>
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="login-email">Email</label>
                            <div className="auth-input-wrap">
                                <input
                                    className="auth-input"
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                                {errors.email && <div className="error-text">{errors.email}</div>}
                            </div>
                        </div>

                        <div className="auth-field">
                            <div className="auth-label-row">
                                <label className="auth-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
                                <Link href="/auth/forgot-password" id="forgot-password-link" className="auth-forgot-link">Forgot password?</Link>
                            </div>
                            <div className="auth-input-wrap">
                                <input
                                    className="auth-input"
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    style={{ paddingRight: '2.75rem' }}
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <div className="error-text">{errors.password}</div>}
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don&apos;t have an account?{' '}
                            <Link href="/auth/sign-up">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
