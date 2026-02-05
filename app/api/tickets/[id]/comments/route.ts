/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import Comment from '@/models/Comment';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = verifyToken(token || '');
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const ticket = await Ticket.findById(id);
    if (!ticket) return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });

    // RBAC: Customer can only comment on their own tickets
    if (decoded.role === 'customer' && ticket.createdBy.toString() !== decoded.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const comment = await Comment.create({
      ticket: id,
      author: decoded.id,
      message,
    });

    // Populate author for the response
    const populatedComment = await Comment.findById(comment._id).populate('author', 'name role');

    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
