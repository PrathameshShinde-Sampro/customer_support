/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import Comment from '@/models/Comment';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = verifyToken(token || '');
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const ticket = await Ticket.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name role' },
        options: { sort: { createdAt: 1 } }
      });

    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    // RBAC: Customer can only see their own tickets
    if (decoded.role === 'customer' && ticket.createdBy._id.toString() !== decoded.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(ticket);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = verifyToken(token || '');
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const ticket = await Ticket.findById(id);
    if (!ticket) return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });

    // RBAC checks
    if (decoded.role === 'customer') {
      if (ticket.createdBy.toString() !== decoded.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
      if (ticket.status !== 'Open') {
        return NextResponse.json({ message: 'Cannot edit ticket after it is no longer Open' }, { status: 400 });
      }
      // Customer can only update title, description, category
      const { title, description, category } = body;
      if (title) ticket.title = title;
      if (description) ticket.description = description;
      if (category) ticket.category = category;
    } else if (decoded.role === 'agent') {
      // Agent can update status and priority
      const { status, priority } = body;
      if (status) ticket.status = status;
      if (priority) ticket.priority = priority;
    } else if (decoded.role === 'admin') {
      // Admin can update anything, including assignment
      const { title, description, category, status, priority, assignedTo } = body;
      if (title) ticket.title = title;
      if (description) ticket.description = description;
      if (category) ticket.category = category;
      if (status) ticket.status = status;
      if (priority) ticket.priority = priority;
      if (assignedTo !== undefined) ticket.assignedTo = assignedTo || null;
    }

    await ticket.save();
    return NextResponse.json(ticket);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = verifyToken(token || '');
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const ticket = await Ticket.findById(id);
    if (!ticket) return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });

    // RBAC checks
    if (decoded.role === 'admin') {
      // Admin can delete any ticket
    } else if (decoded.role === 'customer') {
      if (ticket.createdBy.toString() !== decoded.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
      if (ticket.status !== 'Open') {
        return NextResponse.json({ message: 'Only Open tickets can be deleted by customers' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await Ticket.findByIdAndDelete(id);
    // Also delete associated comments
    await Comment.deleteMany({ ticket: id });

    return NextResponse.json({ message: 'Ticket deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
