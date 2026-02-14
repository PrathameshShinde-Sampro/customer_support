import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  // Force expire with explicit options to match login
  cookieStore.set('token', '', { maxAge: 0, path: '/' });

  return NextResponse.json({ message: 'Logged out successfully' });
}
