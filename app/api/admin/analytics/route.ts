/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ticket from '@/models/Ticket';

export async function GET() {
  try {
    await dbConnect();

    const totalTickets = await Ticket.countDocuments();

    const statusBreakdown = await Ticket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const priorityBreakdown = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const categoryBreakdown = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    return NextResponse.json({
      totalTickets,
      statusBreakdown: statusBreakdown.reduce((acc: any, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      priorityBreakdown: priorityBreakdown.reduce((acc: any, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      categoryBreakdown: categoryBreakdown.reduce((acc: any, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
