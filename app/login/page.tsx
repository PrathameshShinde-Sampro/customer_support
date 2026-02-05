'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ticket, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

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
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-50 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-lg p-10 space-y-10 bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-indigo-100 border border-white animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-[24px] shadow-xl shadow-indigo-200 mb-8 animate-float">
            <Ticket className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome Back</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Enter your security credentials</p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl flex items-center animate-shake">
              <Sparkles className="h-4 w-4 mr-3" />
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
                className="h-14 bg-slate-50/50"
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
                className="h-14 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.3s]">
            <Button type="submit" className="w-full h-14 text-lg shadow-indigo-300 group" isLoading={loading}>
              Authorize
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>

        <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
          No access?{' '}
          <Link href="/register" className="text-indigo-600 hover:text-indigo-700 transition-colors border-b-2 border-indigo-100 hover:border-indigo-600">
            Request an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
