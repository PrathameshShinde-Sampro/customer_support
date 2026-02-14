'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { User, Lock, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, refreshUser, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
        } else if (!authLoading) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password: password || undefined }),
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Profile updated successfully', 'success');
                await refreshUser();
                setPassword('');
                setConfirmPassword('');
            } else {
                showToast(data.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">

                <div className="mb-6">
                    <Link href="/" className="text-slate-500 hover:text-indigo-600 flex items-center transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-white">
                    <div className="bg-slate-900 px-8 py-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-indigo-900/50">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                            <p className="text-indigo-300 font-mono text-sm mt-1">{user.email}</p>
                            <div className="mt-4 inline-flex px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {user.role} Account
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Profile Settings</h2>

                                <div className="grid gap-2">
                                    <Input
                                        label="Display Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                        icon={<User className="h-4 w-4 text-slate-400" />}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Security</h2>
                                <div className="grid gap-4">
                                    <Input
                                        label="New Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Leave blank to keep current"
                                        icon={<Lock className="h-4 w-4 text-slate-400" />}
                                    />
                                    {password && (
                                        <div className="animate-fade-in">
                                            <Input
                                                label="Confirm New Password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm new password"
                                                icon={<Lock className="h-4 w-4 text-slate-400" />}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6">
                                <Button type="submit" isLoading={loading} className="w-full h-12 text-lg shadow-xl shadow-indigo-100">
                                    <Save className="h-5 w-5 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
