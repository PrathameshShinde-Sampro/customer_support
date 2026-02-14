/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { ArrowLeft, User, Tag, Send, Shield, UserCheck, MessageSquare, Clock } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

export default function TicketDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { showToast } = useToast();

  const fetchTicket = useCallback(async () => {
    try {
      const res = await fetch(`/api/tickets/${id}`);
      if (res.ok) {
        setTicket(await res.json());
      } else if (res.status === 403) {
        router.push('/unauthorized');
      }
    } catch (error) {
      console.error('Failed to fetch ticket', error);
    }
  }, [id, router]);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);

        if (userData.user.role === 'admin') {
          const agentsRes = await fetch('/api/admin/users');
          if (agentsRes.ok) {
            const usersData = await agentsRes.json();
            setAgents(usersData.filter((u: any) => u.role === 'agent' || u.role === 'admin'));
          }
        }
      }
      await fetchTicket();
    } catch (error) {
      console.error('Failed to fetch initial data', error);
    } finally {
      setLoading(false);
    }
  }, [fetchTicket]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setCommentLoading(true);
    try {
      const res = await fetch(`/api/tickets/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: comment }),
      });
      if (res.ok) {
        showToast('Message sent', 'success');
        setComment('');
        fetchTicket();
      } else {
        showToast('Failed to send message', 'error');
      }
    } catch (_error) {
      showToast('An error occurred', 'error');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUpdateTicket = async (updates: any) => {
    setUpdateLoading(true);
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        showToast('Properties updated', 'success');
        fetchTicket();
      } else {
        showToast('Failed to update ticket', 'error');
      }
    } catch (_error) {
      showToast('An error occurred', 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] animate-fade-in bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 font-black uppercase tracking-widest text-[10px]">Accessing Vault</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-3xl mx-auto px-4 py-24 text-center animate-fade-in">
          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Resource Not Found</h1>
          <p className="text-slate-400 mb-10 font-medium">The ticket you are looking for does not exist or has been archived.</p>
          <Link href="/">
            <Button size="lg">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAgent = currentUser?.role === 'agent';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl opacity-20">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <Link href="/" className="inline-flex items-center text-sm font-black uppercase tracking-widest text-slate-400 hover:text-indigo-400 transition-colors group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <Badge variant="default" className="bg-slate-800 border-slate-700 text-slate-300">Ticket #{ticket._id.substring(ticket._id.length - 6).toUpperCase()}</Badge>
            <Badge variant={ticket.status === 'Resolved' ? 'success' : 'info'} className="px-4 py-1.5 rounded-full">{ticket.status}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* Ticket Header Card */}
            <div className="glass-panel rounded-[40px] shadow-2xl border border-white/5 overflow-hidden animate-slide-up bg-slate-900/50">
              <div className="p-10 border-b border-white/5 bg-white/5">
                <h1 className="text-3xl font-black text-white mb-6 tracking-tight leading-tight">{ticket.title}</h1>
                <div className="flex flex-wrap gap-y-4 gap-x-8 text-sm font-bold text-slate-400">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center mr-3 text-indigo-400 border border-indigo-500/20">
                      <User className="h-4 w-4" />
                    </div>
                    {ticket.createdBy?.name}
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 text-slate-400 text-[10px] font-black border border-slate-700">
                      <Clock className="h-4 w-4" />
                    </div>
                    {format(new Date(ticket.createdAt), 'MMM d, h:mm a')}
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3 text-emerald-400 border border-emerald-500/20">
                      <Tag className="h-4 w-4" />
                    </div>
                    {ticket.category}
                  </div>
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Initial Report</h3>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-lg font-medium">{ticket.description}</p>
              </div>
            </div>

            {/* Conversation History */}
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white flex items-center tracking-tight">
                  <MessageSquare className="h-6 w-6 mr-3 text-indigo-400" />
                  Communication History
                </h3>
                <span className="bg-slate-800 text-slate-400 text-[10px] font-black py-1 px-3 rounded-full uppercase tracking-wider border border-slate-700">
                  {ticket.comments?.length || 0} Entries
                </span>
              </div>

              <div className="space-y-6">
                {ticket.comments?.map((c: any) => (
                  <div key={c._id} className={`flex ${c.author?._id === currentUser?.id ? 'justify-end' : 'justify-start'} group animate-fade-in`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] rounded-[28px] p-6 shadow-xl transition-transform hover:scale-[1.01] border ${c.author?._id === currentUser?.id
                        ? 'bg-indigo-600 text-white shadow-indigo-500/20 border-indigo-500 rounded-tr-none'
                        : 'glass-panel bg-slate-900/80 text-slate-300 shadow-slate-900/50 border-white/10 rounded-tl-none'
                      }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`font-black text-sm ${c.author?._id === currentUser?.id ? 'text-white' : 'text-white'}`}>{c.author?.name}</span>
                          <Badge variant={c.author?.role === 'customer' ? 'default' : 'info'} className="text-[9px] px-2 py-0.5 rounded-lg font-black uppercase backdrop-blur-none bg-black/20 border-white/10 text-white/90">
                            {c.author?.role}
                          </Badge>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${c.author?._id === currentUser?.id ? 'text-white/60' : 'text-slate-500'}`}>
                          {format(new Date(c.createdAt), 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-[15px] leading-relaxed font-medium text-white/90">{c.message}</p>
                    </div>
                  </div>
                ))}

                {(!ticket.comments || ticket.comments.length === 0) && (
                  <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-slate-800">
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Awaiting response</p>
                  </div>
                )}
              </div>

              {/* Input Box */}
              <form onSubmit={handleAddComment} className="mt-10 glass-panel p-2 rounded-[32px] shadow-2xl border border-white/10 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all bg-slate-900/80">
                <textarea
                  className="w-full min-h-[140px] bg-transparent border-none focus:ring-0 text-[15px] font-medium text-white placeholder:text-slate-600 p-6 resize-none"
                  placeholder="Compose your reply here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={commentLoading}
                />
                <div className="flex justify-end p-4 bg-white/5 rounded-[24px] border-t border-white/5">
                  <Button type="submit" isLoading={commentLoading} disabled={!comment.trim()} className="px-8 shadow-indigo-500/20">
                    <Send className="h-4 w-4 mr-2" />
                    Post Reply
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Info Area */}
          <div className="lg:col-span-4 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-panel rounded-[40px] shadow-xl border border-white/10 p-10 bg-slate-900/50">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Intelligence</h3>
              <div className="space-y-8">
                <div className="group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 group-hover:text-indigo-400 transition-colors">Priority Matrix</label>
                  {(isAdmin || isAgent) ? (
                    <Select
                      options={[
                        { label: 'Low', value: 'Low' },
                        { label: 'Medium', value: 'Medium' },
                        { label: 'High', value: 'High' },
                      ]}
                      value={ticket.priority}
                      onChange={(e) => handleUpdateTicket({ priority: e.target.value })}
                      disabled={updateLoading}
                      className="bg-slate-800 border-slate-700 font-bold text-white"
                    />
                  ) : (
                    <div className="flex items-center text-sm font-black text-white">
                      <div className={`w-2 h-2 rounded-full mr-3 ${ticket.priority === 'High' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <Badge variant={ticket.priority === 'High' ? 'error' : ticket.priority === 'Medium' ? 'warning' : 'success'} className="px-4 py-1.5 rounded-full">
                        {ticket.priority}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 group-hover:text-indigo-400 transition-colors">Ticket Status</label>
                  {(isAdmin || isAgent) ? (
                    <Select
                      options={[
                        { label: 'Open', value: 'Open' },
                        { label: 'In Progress', value: 'In Progress' },
                        { label: 'Resolved', value: 'Resolved' },
                        { label: 'Closed', value: 'Closed' },
                      ]}
                      value={ticket.status}
                      onChange={(e) => handleUpdateTicket({ status: e.target.value })}
                      disabled={updateLoading}
                      className="bg-slate-800 border-slate-700 font-bold text-white"
                    />
                  ) : (
                    <div className="flex items-center text-sm font-black text-white">
                      <Badge variant={ticket.status === 'Open' ? 'info' : ticket.status === 'Resolved' ? 'success' : 'warning'} className="px-4 py-1.5 rounded-full">
                        {ticket.status}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 group-hover:text-indigo-400 transition-colors">Assigned Personnel</label>
                  {isAdmin ? (
                    <Select
                      options={[
                        { label: 'Unassigned', value: '' },
                        ...agents.map(a => ({ label: a.name, value: a._id }))
                      ]}
                      value={ticket.assignedTo?._id || ''}
                      onChange={(e) => handleUpdateTicket({ assignedTo: e.target.value })}
                      disabled={updateLoading}
                      className="bg-slate-800 border-slate-700 font-bold text-white"
                    />
                  ) : (
                    <div className="flex items-center text-sm font-bold bg-white/5 p-4 rounded-2xl border border-white/10 text-slate-300">
                      <UserCheck className="h-4 w-4 mr-3 text-emerald-400" />
                      {ticket.assignedTo?.name || 'Awaiting Assignment'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="bg-rose-900/10 backdrop-blur-sm rounded-[40px] border border-rose-500/20 p-10 animate-pulse-slow">
                <h3 className="text-[11px] font-black text-rose-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Restriction Zone
                </h3>
                <p className="text-xs text-rose-300 mb-8 font-bold leading-relaxed">Permanent deletion is irreversible. Exercise caution.</p>
                <Button
                  variant="danger"
                  size="lg"
                  className="w-full h-14"
                  onClick={async () => {
                    if (confirm('Permanently wipe this ticket from records?')) {
                      const res = await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
                      if (res.ok) router.push('/admin');
                    }
                  }}
                >
                  Execute Deletion
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
