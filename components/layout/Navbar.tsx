'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LogOut, Ticket, LayoutDashboard, User } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const Navbar = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'agent': return '/agent';
      default: return '/customer';
    }
  };

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 transition-transform group-hover:scale-110 group-active:scale-95">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tight text-slate-900">Support<span className="text-indigo-600">Hub</span></span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link href={getDashboardLink()} className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center space-x-2 font-semibold text-sm">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="capitalize">{user.role} Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center space-x-3 bg-slate-100/50 px-4 py-2 rounded-2xl border border-slate-200/30">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 hidden md:inline">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-rose-500 hover:bg-rose-50 hover:text-rose-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Join SupportHub</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
