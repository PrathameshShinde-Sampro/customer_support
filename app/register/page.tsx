'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowRight, ShieldCheck, User, Mail, Lock } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') router.replace('/admin');
      else if (user.role === 'agent') router.replace('/agent');
      else router.replace('/customer');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Registration successful. You can now log in.', 'success');
        router.push('/login');
      } else {
        const msg = data.message || 'Registration failed';
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
      {/* Abstract Background */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10 animate-blob" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 animate-blob [animation-delay:2s]" />

      <div className="w-full max-w-lg p-10 space-y-10 glass-panel rounded-[40px] border-white/10 animate-fade-in relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-slate-800 rounded-[24px] border border-slate-700 shadow-xl mb-8 animate-float">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-3">Join SupportHub</h2>
          <p className="text-slate-300 font-bold uppercase tracking-[0.2em] text-xs">Initialize your customer account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 text-sm font-bold text-rose-300 bg-rose-900/20 border border-rose-500/30 rounded-2xl animate-shake">
              {error}
            </div>
          )}
          <div className="space-y-5">
            <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.1s]">
              <Input
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="h-14 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-400 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                icon={<User className="h-5 w-5 text-indigo-400" />}
              />
            </div>
            <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.2s]">
              <Input
                label="Personnel Email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-14 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-400 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                icon={<Mail className="h-5 w-5 text-indigo-400" />}
              />
            </div>
            <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.3s]">
              <Input
                label="Create Password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-14 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-400 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                icon={<Lock className="h-5 w-5 text-indigo-400" />}
              />
            </div>
          </div>

          <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.4s]">
            <Button type="submit" className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-500 border-0 shadow-[0_0_20px_rgba(99,102,241,0.4)] group rounded-xl transition-all duration-300" isLoading={loading}>
              Create Account
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>

        <p className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest">
          Existing user?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors border-b-2 border-indigo-500/20 hover:border-indigo-400">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
