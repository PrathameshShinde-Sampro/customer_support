/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Users, Ticket, BarChart3, UserPlus, Trash2, ArrowUpRight, TrendingUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'tickets'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // User Form
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'agent' });
  const [userLoading, setUserLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, ticketsRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/users'),
        fetch('/api/tickets?limit=100')
      ]);

      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (ticketsRes.ok) {
        const data = await ticketsRes.json();
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        setIsUserModalOpen(false);
        setNewUser({ name: '', email: '', password: '', role: 'agent' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create user', error);
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    try {
      const res = await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Failed to delete ticket', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] rounded-bl-full group-hover:opacity-[0.06] transition-opacity`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 ${color.replace('bg-', 'text-')}`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className="flex items-center text-emerald-500 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-lg">
            <TrendingUp className="h-3.5 w-3.5 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-400 font-black uppercase tracking-widest">{title}</p>
        <p className="text-4xl font-black mt-2 text-slate-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <Badge variant="error" className="mb-2">System Administrator</Badge>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Global Oversight</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time control and performance metrics.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
          <button
            className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'users' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'tickets' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            onClick={() => setActiveTab('tickets')}
          >
            Tickets
          </button>
        </div>
      </div>

      {loading && activeTab === 'analytics' && !analytics ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8 animate-slide-up">
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.1s]">
                  <StatCard title="Total Tickets" value={analytics.totalTickets} icon={Ticket} color="bg-indigo-600" trend="+12%" />
                </div>
                <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.2s]">
                  <StatCard title="Open Work" value={analytics.statusBreakdown?.Open || 0} icon={AlertCircle} color="bg-amber-500" />
                </div>
                <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.3s]">
                  <StatCard title="Resolved" value={analytics.statusBreakdown?.Resolved || 0} icon={ArrowUpRight} color="bg-emerald-500" trend="+5%" />
                </div>
                <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.4s]">
                  <StatCard title="Staff Count" value={users.filter(u => u.role === 'agent').length} icon={Users} color="bg-purple-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-slate-900">Priority Distribution</h3>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <BarChart3 className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  <div className="space-y-8">
                    {['High', 'Medium', 'Low'].map(p => (
                      <div key={p} className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-black uppercase tracking-widest">
                          <span className="text-slate-400">{p} Priority</span>
                          <span className="text-slate-900">{analytics.priorityBreakdown?.[p] || 0}</span>
                        </div>
                        <div className="h-4 bg-slate-50 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${p === 'High' ? 'bg-rose-500' : p === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${(analytics.priorityBreakdown?.[p] || 0) / (analytics.totalTickets || 1) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl shadow-indigo-900/20 flex flex-col justify-between">
                  <div>
                    <TrendingUp className="h-10 w-10 text-indigo-400 mb-6" />
                    <h3 className="text-2xl font-black mb-4">Top Categories</h3>
                    <p className="text-slate-400 font-medium mb-10">Identify trends in customer requests.</p>
                  </div>
                  <div className="space-y-6">
                    {['Technical', 'Billing', 'General'].map(c => (
                      <div key={c} className="flex items-center justify-between group cursor-default">
                        <span className="text-slate-400 group-hover:text-white transition-colors font-bold">{c}</span>
                        <div className="flex items-center">
                          <div className="h-1.5 w-12 bg-indigo-500/20 rounded-full mr-4 overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 transition-all duration-1000"
                              style={{ width: `${(analytics.categoryBreakdown?.[c] || 0) / (analytics.totalTickets || 1) * 100}%` }}
                            />
                          </div>
                          <span className="font-black text-xl">{analytics.categoryBreakdown?.[c] || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">User Management</h3>
                  <p className="text-slate-400 font-medium">Control access levels and manage staff.</p>
                </div>
                <Button onClick={() => setIsUserModalOpen(true)} className="w-full sm:w-auto shadow-indigo-200">
                  <UserPlus className="h-5 w-5 mr-3" />
                  Onboard Agent
                </Button>
              </div>
              <Table headers={['Identity', 'Authentication', 'Privileges', 'Created']}>
                {users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${user.role === 'admin' ? 'bg-rose-100 text-rose-600' : user.role === 'agent' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 text-base">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'error' : user.role === 'agent' ? 'info' : 'default'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 font-bold text-xs uppercase">
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-50">
                <h3 className="text-2xl font-black text-slate-900">Master Ticket List</h3>
                <p className="text-slate-400 font-medium">Audit and manage every request in the system.</p>
              </div>
              <Table headers={['Reference', 'Subject', 'Priority', 'Status', 'Involved Parties', '']}>
                {tickets.map(ticket => (
                  <TableRow key={ticket._id}>
                    <TableCell className="font-mono text-[11px] font-black text-slate-300">
                      #{ticket._id.substring(ticket._id.length-6).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-bold text-slate-800 max-w-xs overflow-hidden text-ellipsis">{ticket.title}</TableCell>
                    <TableCell>
                      <Badge variant={ticket.priority === 'High' ? 'error' : 'default'}>{ticket.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ticket.status === 'Resolved' ? 'success' : 'info'}>{ticket.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-400" title={`Creator: ${ticket.createdBy?.name}`}>
                          {ticket.createdBy?.name.charAt(0)}
                        </div>
                        {ticket.assignedTo && (
                          <div className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-emerald-400" title={`Agent: ${ticket.assignedTo.name}`}>
                            {ticket.assignedTo.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-3">
                        <Link href={`/tickets/${ticket._id}`}>
                          <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg bg-white border-slate-100">Review</Button>
                        </Link>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteTicket(ticket._id)} className="h-9 w-9 p-0 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="System Onboarding">
        <form onSubmit={handleCreateUser} className="space-y-6">
          <Input
            label="Full Name"
            required
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="e.g. Sarah Connor"
          />
          <Input
            label="Work Email"
            type="email"
            required
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="staff@supporthub.com"
          />
          <Input
            label="Security Password"
            type="password"
            required
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="••••••••"
          />
          <Select
            label="System Role"
            options={[
              { label: 'Support Agent', value: 'agent' },
              { label: 'Administrator', value: 'admin' },
            ]}
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          />
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-50">
            <Button variant="ghost" type="button" onClick={() => setIsUserModalOpen(false)}>Dismiss</Button>
            <Button type="submit" isLoading={userLoading}>Authorize Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
