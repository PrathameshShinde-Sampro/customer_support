'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { KeyRound, Sparkles } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Logic for real API would go here

            setSubmitted(true);
            showToast('Password reset link sent to your email.', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to send reset link. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-50 relative overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-[120px] -z-10" />

                <div className="w-full max-w-lg p-10 space-y-8 bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-indigo-100 border border-white animate-fade-in text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-green-100 text-green-600 rounded-full mb-4">
                        <Sparkles className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Check your email</h2>
                    <p className="text-slate-600 mb-8">
                        We've sent password reset instructions to <strong className="text-slate-900">{email}</strong>.
                    </p>
                    <Link href="/login" className="block w-full">
                        <Button variant="outline" className="w-full h-12">
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-50 relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-[120px] -z-10" />

            <div className="w-full max-w-lg p-10 space-y-10 bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-indigo-100 border border-white animate-fade-in">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-[24px] shadow-xl shadow-indigo-200 mb-8 animate-float">
                        <KeyRound className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Forgot Password?</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Reset your access credentials</p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.1s]">
                            <Input
                                label="Personnel Email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="h-14 bg-slate-50/50"
                            />
                        </div>
                    </div>

                    <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.2s]">
                        <Button type="submit" className="w-full h-14 text-lg shadow-indigo-300 group" isLoading={loading}>
                            Send Reset Link
                        </Button>
                    </div>
                </form>

                <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Remember your password?{' '}
                    <Link href="/login" className="text-indigo-600 hover:text-indigo-700 transition-colors border-b-2 border-indigo-100 hover:border-indigo-600">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
