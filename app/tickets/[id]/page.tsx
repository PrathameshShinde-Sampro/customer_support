/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { ArrowLeft, User, Calendar, Tag, AlertCircle, Send, Shield, UserCheck } from 'lucide-react';
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
        showToast('Comment added', 'success');
        setComment('');
        fetchTicket();
      } else {
        showToast('Failed to add comment', 'error');
      }
    } catch (error) {
      console.error('Failed to add comment', error);
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
        showToast('Ticket updated', 'success');
        fetchTicket();
      } else {
        showToast('Failed to update ticket', 'error');
      }
    } catch (error) {
      console.error('Failed to update ticket', error);
      showToast('An error occurred', 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Ticket not found</h1>
        <Link href="/">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isAgent = currentUser?.role === 'agent';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 group">
        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <span className="font-mono text-sm text-gray-500 uppercase tracking-wider">Ticket #{ticket._id}</span>
                <Badge variant={ticket.status === 'Open' ? 'info' : ticket.status === 'Resolved' ? 'success' : 'warning'}>
                  {ticket.status}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
              <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1.5 text-gray-400" />
                  {ticket.createdBy?.name}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                  {format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Description</h3>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              Conversation History
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs py-0.5 px-2 rounded-full">
                {ticket.comments?.length || 0}
              </span>
            </h3>

            <div className="space-y-4">
              {ticket.comments?.map((c: any) => (
                <div key={c._id} className={`flex ${c.author?._id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm border ${
                    c.author?._id === currentUser?.id
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-white text-gray-900 border-gray-100'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm">{c.author?.name}</span>
                        <Badge variant={c.author?.role === 'customer' ? 'default' : 'info'} className="text-[10px] py-0 px-1.5">
                          {c.author?.role}
                        </Badge>
                      </div>
                      <span className={`text-[10px] ${c.author?._id === currentUser?.id ? 'text-blue-100' : 'text-gray-400'}`}>
                        {format(new Date(c.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{c.message}</p>
                  </div>
                </div>
              ))}

              {(!ticket.comments || ticket.comments.length === 0) && (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed">
                  <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            <form onSubmit={handleAddComment} className="mt-6 bg-white p-4 rounded-xl shadow-sm border focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
              <textarea
                className="w-full min-h-[100px] bg-transparent border-none focus:ring-0 text-sm placeholder:text-gray-400 resize-none"
                placeholder="Type your message here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={commentLoading}
              />
              <div className="flex justify-end mt-2 pt-2 border-t">
                <Button type="submit" size="sm" isLoading={commentLoading} disabled={!comment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Ticket Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Category</label>
                <div className="flex items-center text-sm font-medium">
                  <Tag className="h-4 w-4 mr-2 text-gray-400" />
                  {ticket.category}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Priority</label>
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
                  />
                ) : (
                  <div className="flex items-center text-sm font-medium">
                    <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                    <Badge variant={ticket.priority === 'High' ? 'error' : ticket.priority === 'Medium' ? 'warning' : 'success'}>
                      {ticket.priority}
                    </Badge>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Status</label>
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
                  />
                ) : (
                  <div className="flex items-center text-sm font-medium">
                    <Badge variant={ticket.status === 'Open' ? 'info' : ticket.status === 'Resolved' ? 'success' : 'warning'}>
                      {ticket.status}
                    </Badge>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Assigned Agent</label>
                {isAdmin ? (
                  <Select
                    options={[
                      { label: 'Unassigned', value: '' },
                      ...agents.map(a => ({ label: a.name, value: a._id }))
                    ]}
                    value={ticket.assignedTo?._id || ''}
                    onChange={(e) => handleUpdateTicket({ assignedTo: e.target.value })}
                    disabled={updateLoading}
                  />
                ) : (
                  <div className="flex items-center text-sm font-medium">
                    <UserCheck className="h-4 w-4 mr-2 text-gray-400" />
                    {ticket.assignedTo?.name || 'Unassigned'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="bg-red-50 rounded-xl border border-red-100 p-6">
              <h3 className="text-sm font-bold text-red-800 uppercase tracking-widest mb-4 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Admin Actions
              </h3>
              <p className="text-xs text-red-600 mb-4">Dangerous actions for this ticket</p>
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                onClick={async () => {
                  if (confirm('Delete this ticket permanently?')) {
                    const res = await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
                    if (res.ok) router.push('/admin');
                  }
                }}
              >
                Delete Ticket
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
