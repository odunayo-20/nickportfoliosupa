"use client"

import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Loader2, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { checkEmailExists } from '@/actions/auth';
import Link from 'next/link';
import { z } from 'zod';


const ForgotPasswordPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ email?: string }>({});

    const schema = z.object({
        email: z.string().email("Invalid email address"),
    });

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = schema.safeParse({ email });

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
            // Check if email exists in whitelist
            const { exists, error: checkError } = await checkEmailExists(email);
            
            if (!exists) {
                setErrors({ email: checkError || "Email not found in our records." });
                setIsSubmitting(false);
                return;
            }

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
            });


            if (error) throw error;
            
            toast.success("Password reset link sent to your email!");
            setEmail('');
        } catch (error: any) {
            console.error('Reset error:', error.message);
            toast.error(error.message || "Failed to send reset link");
        } finally {
            setIsSubmitting(false);
        }
    };

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

                .back-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 1.5rem;
                    color: #6b7280;
                    font-size: 0.875rem;
                    text-decoration: none;
                    transition: color 0.15s;
                }

                .back-link:hover {
                    color: #111;
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
                    <Mail size={24} />
                </div>
                <div className="auth-form-header">
                    <h2 className="auth-form-title">Reset your password</h2>
                    <p className="auth-form-subtitle">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleResetRequest}>
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="reset-email">Email</label>
                        <div className="auth-input-wrap">
                            <input
                                className="auth-input"
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                            {errors.email && <div className="error-text">{errors.email}</div>}
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
                                Sending...
                            </>
                        ) : (
                            <>
                                Send reset link
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <Link href="/auth/login" className="back-link">
                    <ArrowLeft size={16} />
                    Back to sign in
                </Link>
            </div>
        </div>
    )
}

export default ForgotPasswordPage
