/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search, ExternalLink, FilterX, Ticket } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useToast } from '@/context/ToastContext';

export default function CustomerDashboard() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  // Filters
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  // New Ticket Form
  const [newTicket, setNewTicket] = useState({ title: '', description: '', category: 'General', priority: 'Low' });
  const [createLoading, setCreateLoading] = useState(false);

  const fetchTickets = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        status,
        priority,
        category,
        search
      });
      const res = await fetch(`/api/tickets?${query}`);
      const data = await res.json();
      if (res.ok) {
        setTickets(data.tickets);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    } finally {
      setLoading(false);
    }
  }, [status, priority, category, search]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket),
      });
      if (res.ok) {
        showToast('Ticket created successfully', 'success');
        setIsModalOpen(false);
        setNewTicket({ title: '', description: '', category: 'General', priority: 'Low' });
        fetchTickets();
      } else {
        showToast('Failed to create ticket', 'error');
      }
    } catch (error) {
      console.error('Failed to create ticket', error);
      showToast('An error occurred', 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Open': return 'info';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const clearFilters = () => {
    setStatus('');
    setPriority('');
    setCategory('');
    setSearch('');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] animate-blob -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-blob -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Badge variant="info" className="mb-4">Customer Portal</Badge>
            <h1 className="text-4xl font-black text-white tracking-tight">My Tickets</h1>
            <p className="text-slate-300 font-medium mt-2 text-lg">Manage and track your support requests in real-time.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="shadow-indigo-500/20 shadow-lg">
            <Plus className="h-5 w-5 mr-2" />
            Raise New Ticket
          </Button>
        </div>

        <div className="glass-panel p-6 rounded-[24px] border border-white/10 shadow-xl mb-10 animate-slide-up">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-grow min-w-[300px] relative">
              <Input
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 bg-slate-900/50 border-slate-700 hover:border-slate-500 focus:border-indigo-500 text-white placeholder:text-slate-400"
              />
              <Search className="h-5 w-5 absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-40">
                <Select
                  options={[
                    { label: 'All Status', value: '' },
                    { label: 'Open', value: 'Open' },
                    { label: 'In Progress', value: 'In Progress' },
                    { label: 'Resolved', value: 'Resolved' },
                    { label: 'Closed', value: 'Closed' },
                  ]}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-slate-900"
                />
              </div>
              <div className="w-full sm:w-40">
                <Select
                  options={[
                    { label: 'All Priorities', value: '' },
                    { label: 'Low', value: 'Low' },
                    { label: 'Medium', value: 'Medium' },
                    { label: 'High', value: 'High' },
                  ]}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="bg-slate-900"
                />
              </div>
              {(status || priority || category || search) && (
                <Button variant="ghost" onClick={clearFilters} className="text-slate-300 hover:text-white">
                  <FilterX className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Tickets</p>
          </div>
        ) : tickets.length > 0 ? (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Table headers={['Ticket ID', 'Issue Title', 'Category', 'Priority', 'Status', 'Last Activity', '']}>
              {tickets.map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell className="font-mono text-[11px] font-bold text-indigo-400">#{ticket._id.substring(ticket._id.length - 6).toUpperCase()}</TableCell>
                  <TableCell className="font-bold text-white max-w-xs truncate">{ticket.title}</TableCell>
                  <TableCell><Badge variant="default" className="bg-slate-800 text-slate-300 border-slate-700">{ticket.category}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(ticket.priority)}>{ticket.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 font-medium">{format(new Date(ticket.updatedAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Link href={`/tickets/${ticket._id}`}>
                      <Button variant="ghost" size="sm" className="hover:bg-indigo-500/20 hover:text-indigo-300 rounded-lg text-slate-300">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </Table>

            <div className="flex items-center justify-between mt-10">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Page <span className="text-white">{pagination.page}</span> of {pagination.pages}
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchTickets(pagination.page - 1)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchTickets(pagination.page + 1)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 glass-panel rounded-[32px] border border-dashed border-slate-700/50 animate-slide-up flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 text-slate-400">
              <Ticket className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No tickets found</h3>
            <p className="text-slate-300 max-w-sm mx-auto mb-8 font-medium text-lg">Create your first support ticket to get assistance.</p>
            <Button onClick={() => setIsModalOpen(true)} size="lg" className="shadow-xl">
              <Plus className="h-5 w-5 mr-2" />
              Create First Ticket
            </Button>
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Support Request">
          <form onSubmit={handleCreateTicket} className="space-y-6">
            <Input
              label="Subject"
              required
              value={newTicket.title}
              onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
              placeholder="Briefly describe the issue"
            />
            <div className="w-full">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Details</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-500"
                required
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Provide as much context as possible..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Category"
                options={[
                  { label: 'Technical', value: 'Technical' },
                  { label: 'Billing', value: 'Billing' },
                  { label: 'General', value: 'General' },
                ]}
                value={newTicket.category}
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
              />
              <Select
                label="Priority"
                options={[
                  { label: 'Low', value: 'Low' },
                  { label: 'Medium', value: 'Medium' },
                  { label: 'High', value: 'High' },
                ]}
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-800">
              <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={createLoading} className="shadow-lg shadow-indigo-500/20">Submit Ticket</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
