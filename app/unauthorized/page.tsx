import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-6 text-center animate-fade-in relative overflow-hidden bg-slate-950">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />

      <div className="glass-panel inline-flex items-center justify-center p-8 bg-rose-500/10 rounded-[32px] border border-rose-500/20 mb-10 animate-float shadow-2xl shadow-rose-900/20">
        <ShieldAlert className="h-20 w-20 text-rose-500" />
      </div>

      <h1 className="text-5xl font-black text-white mb-6 tracking-tight">Security Restriction</h1>
      <p className="text-slate-300 max-w-lg mb-12 text-lg font-medium leading-relaxed">
        Your current credentials do not grant access to this secure perimeter. Please contact system administrators for elevated privileges.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.2s]">
        <Link href="/">
          <Button size="lg" variant="outline" className="px-10 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Safety
          </Button>
        </Link>
        <Link href="/login">
          <Button size="lg" className="px-10 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
            Switch Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
