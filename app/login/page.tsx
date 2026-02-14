'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ticket, ArrowRight, Sparkles, Lock, Mail } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { refreshUser } = useAuth();

  React.useEffect(() => {
    // Only check session if we want to auto-redirect logged in users
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          const role = data.user.role;
          if (role === 'admin') router.replace('/admin');
          else if (role === 'agent') router.replace('/agent');
          else router.replace('/customer');
        }
      } catch (error) {
        console.error('Session check failed', error);
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Access granted. Welcome back.', 'success');
        await refreshUser(); // Update global auth state
        router.push('/');
        router.refresh();
      } else {
        const msg = data.message || 'Authentication failed';
        setError(msg);
        showToast(msg, 'error');
      }
    } catch (_err) {
      setError('A connection error occurred.');
      showToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-950 relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 animate-blob" />

      <div className="w-full max-w-lg p-10 space-y-10 glass-panel rounded-[40px] border-white/10 animate-fade-in relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-500/20 rounded-[24px] border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)] mb-8 animate-float">
            <Ticket className="h-10 w-10 text-indigo-400" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-3">Welcome Back</h2>
          <p className="text-slate-300 font-bold uppercase tracking-[0.2em] text-xs">Enter your security credentials</p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 text-sm font-bold text-rose-300 bg-rose-900/20 border border-rose-500/30 rounded-2xl flex items-center animate-shake">
              <Sparkles className="h-4 w-4 mr-3 text-rose-400" />
              {error}
            </div>
          )}
          <div className="space-y-6">
            <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.1s]">
              <Input
                label="Personnel Email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="h-14 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-400 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                icon={<Mail className="h-5 w-5 text-indigo-400" />}
              />
            </div>
            <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.2s]">
              <Input
                label="Access Password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-14 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-400 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                icon={<Lock className="h-5 w-5 text-indigo-400" />}
              />
              <div className="flex justify-end mt-2">
                <Link href="/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.3s]">
            <Button type="submit" className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-500 border-0 shadow-[0_0_20px_rgba(99,102,241,0.4)] group rounded-xl transition-all duration-300" isLoading={loading}>
              Authorize
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>

        <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
          No access?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors border-b-2 border-indigo-500/20 hover:border-indigo-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
