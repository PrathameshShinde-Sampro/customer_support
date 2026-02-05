/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import { Search, ExternalLink } from 'lucide-react';
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
      // In a real app, 'assigned' view would be another filter
      const res = await fetch(`/api/tickets?${query}`);
      const data = await res.json();
      if (res.ok) {
        let filteredTickets = data.tickets;
        if (viewMode === 'assigned') {
          // This is a client-side filter for demonstration,
          // ideally the API would handle this more strictly.
          // For now, let's assume we fetch the current user first or use the 'me' endpoint
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agent Support Dashboard</h1>
        <p className="text-gray-600">Review and respond to customer support tickets</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setViewMode('all')}
          >
            All Tickets
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'assigned' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setViewMode('assigned')}
          >
            Assigned to Me
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by title, description, or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 relative"
            />
            <Search className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
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
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading tickets...</p>
        </div>
      ) : tickets.length > 0 ? (
        <>
          <Table headers={['Customer', 'Title', 'Priority', 'Status', 'Assigned To', 'Actions']}>
            {tickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell>
                  <div className="font-medium">{ticket.createdBy?.name}</div>
                  <div className="text-xs text-gray-500">{ticket.createdBy?.email}</div>
                </TableCell>
                <TableCell className="max-w-xs overflow-hidden text-ellipsis font-medium">
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
                    <span className="text-sm">{ticket.assignedTo.name}</span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/tickets/${ticket._id}`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </Table>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchTickets(pagination.page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchTickets(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <p className="text-gray-600">No tickets matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
