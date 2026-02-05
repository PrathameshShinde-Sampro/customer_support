/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import { Search, ExternalLink, Headphones, Inbox, Briefcase } from 'lucide-react';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-12">
        <Badge variant="success" className="mb-2">Support Agent Portal</Badge>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
          Agent Workspace
          <Headphones className="ml-4 h-8 w-8 text-indigo-600" />
        </h1>
        <p className="text-slate-500 font-medium mt-1">Manage and resolve customer requests efficiently.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 shadow-inner">
          <button
            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${viewMode === 'all' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            onClick={() => setViewMode('all')}
          >
            <div className="flex items-center">
              <Inbox className="h-4 w-4 mr-2" />
              All Tickets
            </div>
          </button>
          <button
            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${viewMode === 'assigned' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            onClick={() => setViewMode('assigned')}
          >
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Assigned to Me
            </div>
          </button>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-2 rounded-[24px] border border-slate-200/50 shadow-sm flex-grow md:max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-1 relative">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 bg-transparent border-none ring-0 focus:ring-0"
              />
              <Search className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
            </div>
            <Select
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Open', value: 'Open' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Resolved', value: 'Resolved' },
                { label: 'Closed', value: 'Closed' },
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 bg-transparent border-none focus:ring-0"
            />
            <Select
              options={[
                { label: 'All Priorities', value: '' },
                { label: 'Low', value: 'Low' },
                { label: 'Medium', value: 'Medium' },
                { label: 'High', value: 'High' },
              ]}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="h-10 bg-transparent border-none focus:ring-0"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Fetching Records</p>
        </div>
      ) : tickets.length > 0 ? (
        <div className="animate-slide-up">
          <Table headers={['Customer', 'Issue', 'Priority', 'Status', 'Assigned', 'Actions']}>
            {tickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                      {ticket.createdBy?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{ticket.createdBy?.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{ticket.createdBy?.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs overflow-hidden text-ellipsis font-bold text-slate-700">
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
                    <div className="flex items-center text-slate-600 font-bold text-xs">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                      {ticket.assignedTo.name}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-300 font-bold italic tracking-wider">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/tickets/${ticket._id}`}>
                    <Button variant="secondary" size="sm" className="rounded-lg h-9 shadow-sm hover:scale-105 transition-transform active:scale-95">
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
              Workload <span className="text-slate-900">{tickets.length}</span> tickets visible
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchTickets(pagination.page - 1)}
                className="bg-white"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchTickets(pagination.page + 1)}
                className="bg-white"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-[32px] border-2 border-dashed border-slate-200 animate-slide-up">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-300">
            <Inbox className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No tickets to display</h3>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">Sit back and relax, or change your filters to see more tickets.</p>
        </div>
      )}
    </div>
  );
}
