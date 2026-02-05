import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-6 text-center animate-fade-in relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-100/30 rounded-full blur-[120px] -z-10" />

      <div className="inline-flex items-center justify-center p-6 bg-rose-50 rounded-[32px] border border-rose-100 mb-8 animate-float shadow-2xl shadow-rose-100">
        <ShieldAlert className="h-16 w-16 text-rose-500" />
      </div>

      <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Security Restriction</h1>
      <p className="text-slate-500 max-w-lg mb-12 text-lg font-medium leading-relaxed">
        Your current credentials do not grant access to this secure perimeter. Please contact system administrators for elevated privileges.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.2s]">
        <Link href="/">
          <Button size="lg" variant="outline" className="px-10 border-slate-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Safety
          </Button>
        </Link>
        <Link href="/login">
          <Button size="lg" className="px-10 bg-slate-900">
            Switch Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
