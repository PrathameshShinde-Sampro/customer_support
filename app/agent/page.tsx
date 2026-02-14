/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import { Search, ExternalLink, Headphones, Inbox, Briefcase, FilterX } from 'lucide-react';
import Link from 'next/link';

export default function AgentDashboard() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  // Filters
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'assigned'

  const fetchTickets = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        status,
        priority,
        search
      });
      const res = await fetch(`/api/tickets?${query}`);
      const data = await res.json();
      if (res.ok) {
        let filteredTickets = data.tickets;
        if (viewMode === 'assigned') {
          const meRes = await fetch('/api/auth/me');
          const meData = await meRes.json();
          if (meRes.ok) {
            filteredTickets = filteredTickets.filter((t: any) => t.assignedTo?._id === meData.user.id);
          }
        }
        setTickets(filteredTickets);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    } finally {
      setLoading(false);
    }
  }, [status, priority, search, viewMode]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

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
    setSearch('');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in relative z-10">
        <div className="mb-12">
          <Badge variant="success" className="mb-4">Support Agent Portal</Badge>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center">
            Agent Workspace
            <Headphones className="ml-4 h-8 w-8 text-emerald-400" />
          </h1>
          <p className="text-slate-300 font-medium mt-2 text-lg">Manage and resolve customer requests efficiently.</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-inner w-fit">
            <button
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${viewMode === 'all' ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => setViewMode('all')}
            >
              <div className="flex items-center">
                <Inbox className="h-4 w-4 mr-2" />
                All Tickets
              </div>
            </button>
            <button
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${viewMode === 'assigned' ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => setViewMode('assigned')}
            >
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Assigned to Me
              </div>
            </button>
          </div>

          <div className="glass-panel p-2 rounded-[24px] border border-white/10 shadow-xl flex-grow md:max-w-xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-grow relative">
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 bg-transparent border-none ring-0 focus:ring-0 text-white placeholder:text-slate-400"
                />
                <Search className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="w-full sm:w-32">
                <Select
                  options={[
                    { label: 'Status', value: '' },
                    { label: 'Open', value: 'Open' },
                    { label: 'In Progress', value: 'In Progress' },
                    { label: 'Resolved', value: 'Resolved' },
                    { label: 'Closed', value: 'Closed' },
                  ]}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-10 bg-transparent border-none focus:ring-0 text-xs text-white"
                />
              </div>
              <div className="w-full sm:w-32">
                <Select
                  options={[
                    { label: 'Priority', value: '' },
                    { label: 'Low', value: 'Low' },
                    { label: 'Medium', value: 'Medium' },
                    { label: 'High', value: 'High' },
                  ]}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="h-10 bg-transparent border-none focus:ring-0 text-xs text-white"
                />
              </div>
              {(status || priority || search) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 w-10 p-0 text-slate-400 hover:text-white">
                  <FilterX className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <p className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching Records</p>
          </div>
        ) : tickets.length > 0 ? (
          <div className="animate-slide-up">
            <Table headers={['Customer', 'Issue', 'Priority', 'Status', 'Assigned', 'Actions']}>
              {tickets.map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase border border-slate-700">
                        {ticket.createdBy?.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white max-w-[150px] truncate">{ticket.createdBy?.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium max-w-[150px] truncate">{ticket.createdBy?.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-bold text-slate-200">
                    {ticket.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(ticket.priority)}>{ticket.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {ticket.assignedTo ? (
                      <div className="flex items-center text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 w-fit">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                        {ticket.assignedTo.name}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold italic tracking-wider">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/tickets/${ticket._id}`}>
                      <Button variant="outline" size="sm" className="rounded-lg h-9 hover:border-indigo-500 hover:text-indigo-400 hover:bg-slate-900 border-slate-700 bg-transparent text-slate-300">
                        <ExternalLink className="h-3.5 w-3.5 mr-2" />
                        Manage
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </Table>

            <div className="flex items-center justify-between mt-10">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Workload <span className="text-white">{tickets.length}</span> tickets visible
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
              <Inbox className="h-10 w-10 text-emerald-500/50" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No tickets to display</h3>
            <p className="text-slate-300 max-w-sm mx-auto font-medium text-lg">Good job! You've cleared the queue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
