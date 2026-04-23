"use client"

import React, { useEffect, useState } from 'react'
import { ArrowRight, Loader2, Eye, EyeOff, Check, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient';
import { myAppHook } from '@/context/AppUtils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { z } from 'zod';

const SignUpPage = () => {
    const router = useRouter();
    const { isLoggedIn, isLoading: contextLoading } = myAppHook();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

    // Zod schema for validation
    const signUpSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

    // Password validation logic
    const passwordChecks = {
        length: password.length >= 8,
        match: password === confirmPassword && confirmPassword !== ''
    };

    useEffect(() => {
        if (!contextLoading && isLoggedIn) {
            router.push("/admin/dashboard");
        }
    }, [isLoggedIn, contextLoading, router]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        // Validate with Zod
        const result = signUpSchema.safeParse({ email, password, confirmPassword });
        
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
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create account');
            }
            
            toast.success("Account created successfully! Signing you in...");
            
            // Automatic Login after server-side signup
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                toast.error("Account created, but automatic sign-in failed. Please sign in manually.");
                router.push("/auth/login");
            } else {
                router.refresh();
                router.push("/admin/dashboard");
            }
        } catch (error: any) {
            console.error('Sign up error:', error.message);
            
            if (error.message?.includes("restricted") || error.message?.includes("Unauthorized")) {
                setErrors({ email: "This email is not on the invited list. Please contact the administrator." });
            } else if (error.message?.includes("already registered")) {
                setErrors({ email: "This email is already registered. Try signing in instead." });
            } else {
                toast.error(error.message || "Something went wrong");
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
        console.log("SignUpPage mounted, contextLoading:", contextLoading);
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

                /* ── Brand Panel ── */
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

                /* ── Mobile Header ── */
                .auth-mobile-header {
                    display: flex;
                    background: #0a0a0f;
                    padding: 2rem 1.5rem 1.75rem;
                    flex-direction: column;
                    gap: 1rem;
                    position: relative;
                    overflow: hidden;
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
                @media (min-width: 1024px) {
                    .auth-form-panel { align-items: center; padding: 3rem; }
                }

                .auth-form-wrapper { width: 100%; max-width: 400px; }

                .auth-form-title {
                    font-size: 1.375rem;
                    font-weight: 700;
                    color: #111;
                    margin-bottom: 0.375rem;
                }

                .auth-form-subtitle {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin-bottom: 1.5rem;
                }
                .auth-form-subtitle a { color: #6366f1; font-weight: 600; text-decoration: none; }

                .auth-social-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
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
                }

                .auth-divider {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }
                .auth-divider-line { flex: 1; height: 1px; background: #e5e7eb; }
                .auth-divider-text { font-size: 0.75rem; color: #9ca3af; }

                .auth-field { margin-bottom: 1.125rem; }
                .auth-label { display: block; font-size: 0.8125rem; font-weight: 600; color: #374151; margin-bottom: 0.375rem; }
                .auth-input-wrap { position: relative; }
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
                }
                .auth-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

                .auth-password-toggle {
                    position: absolute;
                    right: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #9ca3af;
                }

                .auth-pw-checks {
                    margin: -5px 0 15px 0;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .auth-pw-check {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                .auth-footer a:hover { color: #4f46e5; }

                .error-text {
                    color: #ef4444;
                    font-size: 0.75rem;
                    margin-top: 4px;
                    font-weight: 500;
                }
                .auth-pw-check.pass { color: #10b981; }
                .auth-pw-check.fail { color: #9ca3af; }
                .auth-pw-check svg { width: 12px; height: 12px; }

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
                }
                .auth-submit:hover { background: #1a1a2e; transform: translateY(-1px); }
                .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }

                .auth-footer { margin-top: 1.75rem; text-align: center; font-size: 0.8125rem; color: #9ca3af; }
                .auth-footer a { color: #6366f1; font-weight: 600; text-decoration: none; }
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
                        Start your<br />
                        journey.<br />
                        <span>Build your brand.</span>
                    </h1>
                    <p className="auth-brand-subtext">
                        Join common architects and developers managing their professional identity with ease.
                    </p>
                </div>
                <div className="auth-brand-footer">
                    <p className="auth-testimonial">
                        &ldquo;The best decision I made for my career was centralizing my portfolio.&rdquo;
                    </p>
                </div>
            </div>

            {/* ── Mobile Header ── */}
            <div className="auth-mobile-header">
                <div className="auth-brand-logo">
                    <div className="auth-brand-logo-mark">N</div>
                    <div className="auth-brand-logo-text">Nikola</div>
                </div>
                <h1 className="auth-brand-headline" style={{ fontSize: '1.75rem', margin: '0.5rem 0 0' }}>
                    Create account.<br /><span>Own your work.</span>
                </h1>
            </div>

            {/* ── Form Panel ── */}
            <div className="auth-form-panel">
                <div className="auth-form-wrapper">
                    <div className="auth-form-header">
                        <h2 className="auth-form-title">Create your account</h2>
                        <p className="auth-form-subtitle">
                            Already have an account?{' '}
                            <Link href="/auth/login">Sign in</Link>
                        </p>
                    </div>

                    {/* <div className="auth-social-row">
                        <button type="button" className="auth-social-btn" onClick={() => handleSocialOauth("github")}>
                            GitHub
                        </button>
                        <button type="button" className="auth-social-btn" onClick={() => handleSocialOauth("google")}>
                            Google
                        </button>
                    </div> */}

                    <div className="auth-divider">
                        <div className="auth-divider-line" />
                        <span className="auth-divider-text">or sign up with email</span>
                        <div className="auth-divider-line" />
                    </div>

                    <form onSubmit={handleSignUp}>
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="signup-email">Email</label>
                            <input
                                className="auth-input"
                                id="signup-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                            {errors.email && <div className="error-text">{errors.email}</div>}
                        </div>

                        <div className="auth-field">
                            <label className="auth-label" htmlFor="signup-password">Password</label>
                            <div className="auth-input-wrap">
                                <input
                                    className="auth-input"
                                    id="signup-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 8 characters"

                                    style={{ paddingRight: '2.75rem' }}
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <div className="error-text">{errors.password}</div>}
                        </div>

                        <div className="auth-field">
                            <label className="auth-label" htmlFor="signup-confirm">Confirm Password</label>
                            <div className="auth-input-wrap">
                                <input
                                    className="auth-input"
                                    id="signup-confirm"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"

                                    style={{ paddingRight: '2.75rem' }}
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
                        </div>

                        <div className="auth-pw-checks">
                            <div className={`auth-pw-check ${passwordChecks.length ? 'pass' : 'fail'}`}>
                                {passwordChecks.length ? <Check /> : <X />} 8+ characters
                            </div>
                            <div className={`auth-pw-check ${passwordChecks.match ? 'pass' : 'fail'}`}>
                                {passwordChecks.match ? <Check /> : <X />} Passwords match
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating account…
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage