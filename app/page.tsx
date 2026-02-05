import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Ticket, ShieldCheck, Headphones, ArrowRight, Zap, Sparkles, Globe } from 'lucide-react';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const decoded = token ? verifyToken(token) : null;

  if (decoded) {
    if (decoded.role === 'admin') redirect('/admin');
    if (decoded.role === 'agent') redirect('/agent');
    redirect('/customer');
  }

  return (
    <div className="relative isolate overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-8 animate-float">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Reimagining Support</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[1.05]">
            Resolve with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Velocity</span>
          </h1>

          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            The next-generation command center for customer success. Empower your team with intelligent ticket management and real-time insights.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-64 h-16 text-lg shadow-2xl shadow-indigo-300 rounded-2xl group">
                Initialize System
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-64 h-16 text-lg bg-white/50 backdrop-blur-sm border-slate-200 rounded-2xl hover:bg-white transition-all">
                Staff Login
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-xs text-slate-400 font-black uppercase tracking-[0.2em]">
            <span className="flex items-center"><Zap className="h-4 w-4 mr-2 text-amber-500 fill-amber-500" /> Instant Setup</span>
            <span className="flex items-center"><ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" /> Bank-Level JWT</span>
            <span className="flex items-center"><Globe className="h-4 w-4 mr-2 text-emerald-500" /> Multi-Role Access</span>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Card 1 */}
          <div className="group relative bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-4 hover:shadow-indigo-200/40">
            <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-indigo-50 transition-colors">
              <Ticket className="h-24 w-24 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="p-4 bg-indigo-600 rounded-2xl inline-block mb-8 shadow-lg shadow-indigo-200 text-white">
                <Ticket className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-black mb-4 text-slate-900">Customers</h3>
              <p className="text-slate-500 leading-relaxed font-medium mb-8">Crystal-clear communication. Raise requests and track every update in a sleek, unified interface.</p>
              <div className="h-1 w-12 bg-indigo-600 rounded-full group-hover:w-24 transition-all duration-500" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl shadow-indigo-950/20 transition-all duration-500 hover:-translate-y-4 hover:shadow-indigo-500/20 overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="p-4 bg-emerald-500 rounded-2xl inline-block mb-8 shadow-lg shadow-emerald-200/20 text-white">
                <Headphones className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-black mb-4 text-white">Agents</h3>
              <p className="text-slate-400 leading-relaxed font-medium mb-8">A workspace built for speed. Manage queues, prioritize tasks, and resolve issues with built-in workflow tools.</p>
              <div className="h-1 w-12 bg-emerald-500 rounded-full group-hover:w-24 transition-all duration-500" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-4 hover:shadow-purple-200/40">
             <div className="relative z-10">
              <div className="p-4 bg-purple-600 rounded-2xl inline-block mb-8 shadow-lg shadow-purple-200 text-white">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-black mb-4 text-slate-900">Admins</h3>
              <p className="text-slate-500 leading-relaxed font-medium mb-8">The bird&apos;s-eye view. Manage users, oversee all activities, and drive decisions with deep behavioral analytics.</p>
              <div className="h-1 w-12 bg-purple-600 rounded-full group-hover:w-24 transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
}
