import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Ticket, ShieldCheck, Headphones, ArrowRight, Zap, Sparkles, Globe, Server, Database, MessageSquare, Clock, Layout, Fingerprint, Layers } from 'lucide-react';

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
    <div className="relative overflow-x-hidden min-h-screen bg-slate-950">

      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 bg-grid -z-20 opacity-30 pointer-events-none" />
      <div className="fixed top-20 left-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-blob -z-10" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-blob -z-10 [animation-delay:2s]" />
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-blob -z-10 [animation-delay:4s]" />

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 sm:pt-48 sm:pb-32">
        <div className="text-center max-w-5xl mx-auto relative z-10 p-8">

          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-indigo-500/20 mb-10 animate-fade-in shadow-lg shadow-indigo-500/10 hover:border-indigo-400/50 transition-colors cursor-default">
            <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Next-Gen Support System v2.0</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-8 leading-[0.9] animate-slide-up opacity-0 relative">
            <span className="relative inline-block hover:scale-105 transition-transform duration-500 ease-out cursor-default">Resolve</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-shimmer bg-[size:200%_auto]">
              Velocity
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.2s]">
            Experience the pinnacle of customer success infrastructure. <br className="hidden md:block" /> Engineered for speed, security, and scale.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.4s]">
            <Link href="/register">
              <Button size="xl" className="w-full sm:w-64 h-16 text-lg bg-indigo-600 hover:bg-indigo-500 border-0 shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(99,102,241,0.7)] transition-all duration-300 group rounded-2xl">
                Initialize System
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="xl" variant="outline" className="w-full sm:w-64 h-16 text-lg border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl backdrop-blur-md transition-all">
                Staff Login
              </Button>
            </Link>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 text-xs text-slate-500 font-bold uppercase tracking-[0.2em] animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:0.6s]">
            <span className="flex items-center group cursor-help transition-all hover:text-indigo-400 hover:scale-105"><Zap className="h-5 w-5 mr-3 text-amber-500 group-hover:animate-bounce" /> Instant Setup</span>
            <span className="flex items-center group cursor-help transition-all hover:text-indigo-400 hover:scale-105"><ShieldCheck className="h-5 w-5 mr-3 text-emerald-500" /> Bank-Level JWT</span>
            <span className="flex items-center group cursor-help transition-all hover:text-indigo-400 hover:scale-105"><Globe className="h-5 w-5 mr-3 text-cyan-500" /> Global Edge</span>
          </div>
        </div>
      </div>

      {/* Features Grid with Glassmorphism */}
      <div className="relative py-32 px-6 lg:px-8 bg-slate-900/40 backdrop-blur-3xl border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.6s]">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Architected for <span className="text-indigo-400">Scale</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Every component is meticulously designed to provide a frictionless experience for both agents and customers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-10 rounded-[32px] group relative overflow-hidden animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.7s]">
              <div className="absolute top-0 right-0 p-8 text-slate-800 opacity-20 group-hover:text-indigo-500/20 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-125">
                <Database className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/30 group-hover:border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.1)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all">
                  <Database className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors">Secure Data</h3>
                <p className="text-slate-400 leading-relaxed font-medium">Role-based access control with encrypted sessions. Your data is isolated and protected at rest and in transit.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-10 rounded-[32px] group relative overflow-hidden animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.8s]">
              <div className="absolute top-0 right-0 p-8 text-slate-800 opacity-20 group-hover:text-emerald-500/20 group-hover:opacity-100 transition-all duration-500 transform group-hover:-rotate-12 group-hover:scale-125">
                <Layout className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/30 group-hover:border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all">
                  <Layers className="h-7 w-7 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-300 transition-colors">Unified Workspace</h3>
                <p className="text-slate-400 leading-relaxed font-medium">A single pane of glass for all your support needs. Manage tickets, users, and analytics from one intuitive dashboard.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-10 rounded-[32px] group relative overflow-hidden animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.9s]">
              <div className="absolute top-0 right-0 p-8 text-slate-800 opacity-20 group-hover:text-purple-500/20 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-125">
                <MessageSquare className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/30 group-hover:border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all">
                  <Fingerprint className="h-7 w-7 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">Threaded Identity</h3>
                <p className="text-slate-400 leading-relaxed font-medium">Keep context in every conversation. Rich text support for detailed issue description and resolution steps.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-24 border-y border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-bold text-slate-600 uppercase tracking-widest mb-16">Powering industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <span className="text-3xl font-black text-white tracking-tight hover:text-indigo-400 transition-colors cursor-pointer">ACME</span>
            <span className="text-3xl font-bold text-white flex items-center hover:text-emerald-400 transition-colors cursor-pointer"><div className="w-4 h-4 bg-current rounded-full mr-2"></div> Globex</span>
            <span className="text-3xl font-black text-white tracking-widest font-mono hover:text-purple-400 transition-colors cursor-pointer">SOYLENT</span>
            <span className="text-3xl font-bold text-white italic hover:text-pink-400 transition-colors cursor-pointer">Initech</span>
          </div>
        </div>
      </div>

      {/* Contact Section 2.0 */}
      <div className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="glass-panel rounded-[48px] p-8 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Decorative blob inside card */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -mr-32 -mt-32 transition-all duration-1000 group-hover:bg-indigo-600/30"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">transform</span> your workflow?</h2>
                <p className="text-lg text-slate-400 mb-10 leading-relaxed">Join thousands of high-growth companies utilizing SupportHub's advanced infrastructure. Get started in minutes, not months.</p>

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4 text-slate-300">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Clock className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="font-semibold">99.99% Uptime Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-4 text-slate-300">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <Server className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="font-semibold">Dedicated Infrastructure</span>
                  </div>
                </div>

                <div className="mt-12">
                  <Link href="/register">
                    <Button size="lg" className="h-14 px-8 text-lg bg-white text-slate-900 hover:bg-indigo-50 hover:text-indigo-700 shadow-xl shadow-white/5 border-0">Start Free Trial</Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="glass-card p-8 rounded-3xl border border-white/10 bg-slate-900/50">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Contact Sales</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Work Email</label>
                      <input type="email" className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium" placeholder="ceo@startup.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inquiry</label>
                      <textarea className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all h-32 font-medium" placeholder="Tell us about your team size..."></textarea>
                    </div>
                    <button type="button" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transform hover:-translate-y-0.5">Send Request</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
