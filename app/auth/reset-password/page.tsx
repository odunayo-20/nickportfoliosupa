"use client"

import React, { useState, useEffect } from 'react'
import { ArrowRight, Loader2, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

const ResetPasswordPage = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

    const schema = z.object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

    useEffect(() => {
        // Check if user is actually authenticated
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast.error("Session expired or invalid. Please request a new reset link.");
                router.push("/auth/forgot-password");
            }
        };
        checkUser();
    }, [router]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = schema.safeParse({ password, confirmPassword });

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
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            
            setIsSuccess(true);
            toast.success("Password updated successfully!");
            
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        } catch (error: any) {
            console.error('Update error:', error.message);
            toast.error(error.message || "Failed to update password");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="auth-page">
                <style>{`
                    .auth-page {
                        display: flex;
                        min-height: 100vh;
                        min-height: 100dvh;
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        flex-direction: column;
                        width: 100%;
                        background: #fafafa;
                        align-items: center;
                        justify-content: center;
                    }
                    .success-card {
                        width: 100%;
                        max-width: 400px;
                        padding: 3rem 2rem;
                        background: white;
                        border-radius: 24px;
                        text-align: center;
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
                    }
                    .success-icon {
                        color: #10b981;
                        margin-bottom: 1.5rem;
                    }
                    .success-title {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #111;
                        margin-bottom: 0.75rem;
                    }
                    .success-text {
                        color: #6b7280;
                        font-size: 0.9375rem;
                        line-height: 1.5;
                        margin-bottom: 1.5rem;
                    }
                `}</style>
                <div className="success-card">
                    <CheckCircle2 size={64} className="success-icon mx-auto" style={{ margin: '0 auto 1.5rem' }} />
                    <h2 className="success-title">Success!</h2>
                    <p className="success-text">
                        Your password has been reset. You'll be redirected to the login page in a few seconds.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <style>{`
                .auth-page {
                    display: flex;
                    min-height: 100vh;
                    min-height: 100dvh;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    flex-direction: column;
                    width: 100%;
                    background: #fafafa;
                    align-items: center;
                    justify-content: center;
                }

                .auth-form-wrapper {
                    width: 100%;
                    max-width: 400px;
                    padding: 2.5rem;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
                }

                .auth-form-header {
                    margin-bottom: 2rem;
                    text-align: center;
                }

                .auth-form-title {
                    font-size: 1.625rem;
                    font-weight: 700;
                    color: #111;
                    letter-spacing: -0.025em;
                    margin: 0 0 0.5rem 0;
                }

                .auth-form-subtitle {
                    color: #6b7280;
                    font-size: 0.9375rem;
                    margin: 0;
                    line-height: 1.5;
                }

                .auth-field {
                    margin-bottom: 1.25rem;
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
                    padding: 0.6875rem 0.875rem;
                    background: white;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 0.875rem;
                    color: #111;
                    outline: none;
                    transition: all 0.15s ease;
                }

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
                }

                .auth-submit {
                    width: 100%;
                    padding: 0.75rem 1.5rem;
                    background: #111;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.15s ease;
                    margin-top: 1rem;
                }

                .auth-submit:hover {
                    background: #1a1a2e;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .auth-submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .error-text {
                    color: #ef4444;
                    font-size: 0.75rem;
                    margin-top: 4px;
                    font-weight: 500;
                }

                .icon-container {
                    width: 48px;
                    height: 48px;
                    background: #f3f4f6;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6366f1;
                    margin: 0 auto 1.5rem;
                }
            `}</style>

            <div className="auth-form-wrapper">
                <div className="icon-container">
                    <Lock size={24} />
                </div>
                <div className="auth-form-header">
                    <h2 className="auth-form-title">Set new password</h2>
                    <p className="auth-form-subtitle">
                        Please choose a strong password to protect your account.
                    </p>
                </div>

                <form onSubmit={handleUpdatePassword}>
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="new-password">New Password</label>
                        <div className="auth-input-wrap">
                            <input
                                className="auth-input"
                                id="new-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 8 characters"
                                required
                                style={{ paddingRight: '2.75rem' }}
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            {errors.password && <div className="error-text">{errors.password}</div>}
                        </div>
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="confirm-password">Confirm Password</label>
                        <div className="auth-input-wrap">
                            <input
                                className="auth-input"
                                id="confirm-password"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                            {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                Reset password
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordPage
