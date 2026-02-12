/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email: rawEmail, password } = await req.json();
    const email = rawEmail?.trim().toLowerCase();

    console.log(`Login attempt for: ${email}, password length: ${password?.length}`);

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found in DB');
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    console.log(`User found: ${user.email}, Role: ${user.role}, Hash length: ${user.password?.length}`);

    const isMatch = await comparePassword(password, user.password);
    console.log(`Password match result: ${isMatch}`);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    });

    return NextResponse.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
