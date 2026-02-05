/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search, ExternalLink } from 'lucide-react';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Support Tickets</h1>
          <p className="text-gray-600">Track and manage your support requests</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Ticket
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by title or description..."
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
          <Select
            options={[
              { label: 'All Categories', value: '' },
              { label: 'Technical', value: 'Technical' },
              { label: 'Billing', value: 'Billing' },
              { label: 'General', value: 'General' },
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
          <Table headers={['Ticket ID', 'Title', 'Category', 'Priority', 'Status', 'Last Updated', 'Actions']}>
            {tickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell className="font-mono text-xs uppercase">#{ticket._id.substring(ticket._id.length - 6)}</TableCell>
                <TableCell className="font-medium">{ticket.title}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>
                  <Badge variant={getPriorityVariant(ticket.priority)}>{ticket.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                </TableCell>
                <TableCell>{format(new Date(ticket.updatedAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Link href={`/tickets/${ticket._id}`}>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
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
          <p className="text-gray-600">No tickets found. Create your first ticket to get started!</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Ticket">
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Title"
            required
            value={newTicket.title}
            onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
            placeholder="Summarize your issue"
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              placeholder="Provide detailed information about your issue"
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
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createLoading}>Create Ticket</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
