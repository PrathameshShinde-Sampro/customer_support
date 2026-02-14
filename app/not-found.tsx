'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Ghost, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-slate-950 relative overflow-hidden text-center p-6">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 animate-pulse-slow" />

            <div className="glass-panel p-16 rounded-[48px] shadow-2xl shadow-indigo-500/10 border border-white/5 animate-fade-in relative z-10 max-w-2xl w-full">
                <div className="inline-flex items-center justify-center p-8 bg-slate-900 rounded-[32px] border border-slate-800 shadow-xl mb-10 animate-float">
                    <Ghost className="h-24 w-24 text-indigo-500" />
                </div>

                <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-indigo-500 to-purple-500 mb-2 tracking-tighter">404</h1>
                <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Page Not Found</h2>

                <p className="text-slate-300 text-lg mb-12 font-medium max-w-md mx-auto leading-relaxed">
                    The vector you are attempting to traverse does not exist in this dimension. It may have been moved or never existed.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.2s]">
                    <Link href="/">
                        <Button size="xl" className="w-full sm:w-auto px-10 shadow-indigo-500/20 shadow-lg group">
                            <Home className="mr-3 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                            Return Home
                        </Button>
                    </Link>
                    <Button variant="ghost" size="xl" className="w-full sm:w-auto px-10 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10" onClick={() => window.history.back()}>
                        Go Back
                        <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
