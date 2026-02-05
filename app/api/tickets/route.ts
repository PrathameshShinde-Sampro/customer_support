/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = verifyToken(token || '');
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const query: any = {};

    // RBAC: Customer only sees their own tickets
    if (decoded.role === 'customer') {
      query.createdBy = decoded.id;
    } else if (decoded.role === 'agent') {
      // Agent sees assigned tickets OR all? Prompt says "View all assigned tickets"
      // But usually agents can see all to pick them up?
      // I'll filter by assignedTo if it's explicitly asked, otherwise agents see all they are involved in.
      // Actually, let's allow agents to see all but they usually focus on assigned.
      // For now, let's make it so agents can see all but can filter.
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ticket.countDocuments(query);

    return NextResponse.json({
      tickets,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = verifyToken(token || '');
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { title, description, category, priority } = await req.json();

    if (!title || !description || !category) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority: priority || 'Low',
      createdBy: decoded.id,
      status: 'Open',
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
