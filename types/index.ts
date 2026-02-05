export type UserRole = 'customer' | 'agent' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  ticket: string;
  author: {
    _id: string;
    name: string;
    role: UserRole;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
}

export type TicketCategory = 'Technical' | 'Billing' | 'General';
export type TicketPriority = 'Low' | 'Medium' | 'High';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: User;
  assignedTo?: User;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalTickets: number;
  statusBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
}
