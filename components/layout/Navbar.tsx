'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LogOut, Ticket, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'agent': return '/agent';
      default: return '/customer';
    }
  };

  return (
    <nav className="glass-panel sticky top-0 z-40 transition-all border-b-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-110 group-active:scale-95 animate-pulse-glow">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white">Support<span className="text-indigo-400">Hub</span></span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link href={getDashboardLink()} className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center space-x-2 font-semibold text-sm">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="capitalize">{user.role} Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-slate-700" />
                <Link href="/profile" className="flex items-center space-x-3 bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/50 transition-all group/profile">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center group-hover/profile:bg-indigo-600 transition-colors">
                    <User className="h-4 w-4 text-indigo-400 group-hover/profile:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-bold text-slate-200 hidden md:inline group-hover/profile:text-white">{user.name}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="shadow-lg shadow-indigo-500/30">Join SupportHub</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
