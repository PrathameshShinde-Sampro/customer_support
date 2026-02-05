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
import { Users, Ticket, BarChart3, Shield, UserPlus, Trash2 } from 'lucide-react';
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

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Administrator Console</h1>
        <p className="text-gray-600">Complete system oversight and management</p>
      </div>

      <div className="flex border-b mb-8 space-x-8">
        <button
          className={`pb-4 px-2 font-medium transition-colors border-b-2 ${activeTab === 'analytics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('analytics')}
        >
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </div>
        </button>
        <button
          className={`pb-4 px-2 font-medium transition-colors border-b-2 ${activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('users')}
        >
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>User Management</span>
          </div>
        </button>
        <button
          className={`pb-4 px-2 font-medium transition-colors border-b-2 ${activeTab === 'tickets' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('tickets')}
        >
          <div className="flex items-center space-x-2">
            <Ticket className="h-4 w-4" />
            <span>All Tickets</span>
          </div>
        </button>
      </div>

      {loading && activeTab === 'analytics' && !analytics ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Tickets" value={analytics.totalTickets} icon={Ticket} color="bg-blue-100 text-blue-600" />
                <StatCard title="Open Tickets" value={analytics.statusBreakdown?.Open || 0} icon={Shield} color="bg-yellow-100 text-yellow-600" />
                <StatCard title="Resolved" value={analytics.statusBreakdown?.Resolved || 0} icon={Shield} color="bg-green-100 text-green-600" />
                <StatCard title="Agents" value={users.filter(u => u.role === 'agent').length} icon={Users} color="bg-purple-100 text-purple-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border">
                  <h3 className="text-lg font-bold mb-4">Tickets by Priority</h3>
                  <div className="space-y-4">
                    {['High', 'Medium', 'Low'].map(p => (
                      <div key={p} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${p === 'High' ? 'bg-red-500' : p === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                          <span className="text-gray-700">{p}</span>
                        </div>
                        <span className="font-bold">{analytics.priorityBreakdown?.[p] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border">
                  <h3 className="text-lg font-bold mb-4">Tickets by Category</h3>
                  <div className="space-y-4">
                    {['Technical', 'Billing', 'General'].map(c => (
                      <div key={c} className="flex items-center justify-between">
                        <span className="text-gray-700">{c}</span>
                        <span className="font-bold">{analytics.categoryBreakdown?.[c] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold">System Users</h3>
                <Button size="sm" onClick={() => setIsUserModalOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Agent/Admin
                </Button>
              </div>
              <Table headers={['Name', 'Email', 'Role', 'Joined Date']}>
                {users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'error' : user.role === 'agent' ? 'info' : 'default'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(user.createdAt), 'MMM d, yyyy')}</TableCell>
                  </TableRow>
                ))}
              </Table>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold">All System Tickets</h3>
              </div>
              <Table headers={['ID', 'Title', 'Priority', 'Status', 'Creator', 'Assigned To', 'Actions']}>
                {tickets.map(ticket => (
                  <TableRow key={ticket._id}>
                    <TableCell className="font-mono text-xs">#{ticket._id.substring(ticket._id.length-6)}</TableCell>
                    <TableCell className="font-medium">{ticket.title}</TableCell>
                    <TableCell>
                      <Badge variant={ticket.priority === 'High' ? 'error' : 'default'}>{ticket.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ticket.status === 'Resolved' ? 'success' : 'info'}>{ticket.status}</Badge>
                    </TableCell>
                    <TableCell>{ticket.createdBy?.name || 'Unknown'}</TableCell>
                    <TableCell>{ticket.assignedTo?.name || 'Unassigned'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/tickets/${ticket._id}`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteTicket(ticket._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </div>
          )}
        </>
      )}

      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Create New User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Name"
            required
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Agent Name"
          />
          <Input
            label="Email"
            type="email"
            required
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="agent@example.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="••••••••"
          />
          <Select
            label="Role"
            options={[
              { label: 'Support Agent', value: 'agent' },
              { label: 'Administrator', value: 'admin' },
            ]}
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={userLoading}>Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
