/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email: rawEmail, password } = await req.json();
    const email = rawEmail?.trim().toLowerCase();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    console.log(`Registering user: ${email}, password length: ${password.length}`);

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(`User already exists: ${email}`);
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    console.log(`Hashed password length: ${hashedPassword.length}`);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'customer', // Default role for registration
    });

    return NextResponse.json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
