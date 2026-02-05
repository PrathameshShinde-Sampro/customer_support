import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4 text-center">
      <div className="p-4 bg-red-100 rounded-full mb-6">
        <ShieldAlert className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600 max-w-md mb-8">
        You do not have the necessary permissions to access this page. If you believe this is an error, please contact your administrator.
      </p>
      <Link href="/">
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
}
