import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Ticket, ShieldCheck, Headphones } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Streamline Your <span className="text-blue-600">Customer Support</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          A centralized platform for customers to raise tickets, agents to handle them, and admins to oversee operations.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">Get Started as Customer</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">Login to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4 text-blue-600">
            <Ticket className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">For Customers</h3>
          <p className="text-gray-600">Easily create tickets, track status, and communicate with support agents in real-time.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="p-3 bg-green-100 rounded-lg inline-block mb-4 text-green-600">
            <Headphones className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">For Agents</h3>
          <p className="text-gray-600">Manage assigned tickets, update priorities, and provide efficient solutions to user problems.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4 text-purple-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">For Admins</h3>
          <p className="text-gray-600">Full system oversight, user management, agent creation, and detailed analytics dashboards.</p>
        </div>
      </div>
    </div>
  );
}
