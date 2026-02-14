'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { KeyRound, Sparkles, Mail, ArrowLeft } from 'lucide-react';
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
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-950 relative overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />

                <div className="w-full max-w-lg p-10 space-y-8 glass-panel rounded-[40px] border-emerald-500/20 shadow-2xl animate-fade-in text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-6 bg-emerald-500/20 text-emerald-400 rounded-full mb-4 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                        <Sparkles className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-2">Check your inbox</h2>
                    <p className="text-slate-400 mb-8 font-medium">
                        We've dispatched secure reset instructions to <strong className="text-white">{email}</strong>.
                    </p>
                    <Link href="/login" className="block w-full">
                        <Button variant="outline" className="w-full h-12 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return to Login
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-950 relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />

            <div className="w-full max-w-lg p-10 space-y-10 glass-panel rounded-[40px] border-white/10 shadow-2xl animate-fade-in relative z-10">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-5 bg-indigo-500/20 rounded-[28px] border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] mb-8 animate-float">
                        <KeyRound className="h-10 w-10 text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-3">Forgot Password?</h2>
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
                                className="h-14 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50"
                                icon={<Mail className="h-5 w-5 text-indigo-400" />}
                            />
                        </div>
                    </div>

                    <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.2s]">
                        <Button type="submit" className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 group border-0 text-white" isLoading={loading}>
                            Send Reset Link
                        </Button>
                    </div>
                </form>

                <p className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest">
                    Remember your password?{' '}
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors border-b-2 border-indigo-500/20 hover:border-indigo-400">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
