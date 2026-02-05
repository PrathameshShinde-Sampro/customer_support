import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ticket, ShieldCheck, Headphones, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    <div className="relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/20 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-purple-200/20 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
          <Badge variant="info" className="mb-6 px-4 py-1.5 rounded-full">New: Version 2.0 is live</Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Support Experience</span>
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            The all-in-one platform for rapid resolution. Empowers customers, optimizes agents, and provides deep insights for administrators.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-14 text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 text-lg bg-white">
                View Demo
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-slate-400 font-bold uppercase tracking-widest">
            <span className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" /> Secure JWT</span>
            <span className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" /> Role-Based</span>
            <span className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" /> Analytics</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
          <div className="group bg-white/60 backdrop-blur-md p-10 rounded-[32px] border border-white shadow-xl shadow-indigo-100/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-200/50">
            <div className="p-4 bg-indigo-50 rounded-2xl inline-block mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
              <Ticket className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-slate-900">For Customers</h3>
            <p className="text-slate-600 leading-relaxed font-medium mb-6">Seamless ticket creation and real-time tracking. Communicating with support has never been this intuitive.</p>
            <ul className="space-y-3 text-sm font-bold text-slate-500">
              <li className="flex items-center"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2" /> One-click creation</li>
              <li className="flex items-center"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2" /> Live status updates</li>
            </ul>
          </div>

          <div className="group bg-white/60 backdrop-blur-md p-10 rounded-[32px] border border-white shadow-xl shadow-indigo-100/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-200/50">
            <div className="p-4 bg-emerald-50 rounded-2xl inline-block mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
              <Headphones className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-slate-900">For Agents</h3>
            <p className="text-slate-600 leading-relaxed font-medium mb-6">Optimized workflow to handle requests. Change priorities, update status, and respond in seconds.</p>
            <ul className="space-y-3 text-sm font-bold text-slate-500">
              <li className="flex items-center"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2" /> Task prioritization</li>
              <li className="flex items-center"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2" /> Direct communication</li>
            </ul>
          </div>

          <div className="group bg-white/60 backdrop-blur-md p-10 rounded-[32px] border border-white shadow-xl shadow-indigo-100/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-200/50">
            <div className="p-4 bg-purple-50 rounded-2xl inline-block mb-6 text-purple-600 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-slate-900">For Admins</h3>
            <p className="text-slate-600 leading-relaxed font-medium mb-6">Full control over users and tickets. Gain deep insights through an advanced analytics dashboard.</p>
            <ul className="space-y-3 text-sm font-bold text-slate-500">
              <li className="flex items-center"><div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2" /> Agent management</li>
              <li className="flex items-center"><div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2" /> Data visualization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
