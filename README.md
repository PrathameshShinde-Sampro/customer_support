# Customer Support Ticket Management System

A robust, role-based customer support system built with Next.js, React, and MongoDB.

## Features

- **Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for Customers, Support Agents, and Admins.
- **Authentication**: Secure JWT-based authentication with password hashing and protected routes.
- **Ticket Management**: Full lifecycle management from creation to resolution and closure.
- **Real-time Communication**: Chronological conversation history on each ticket.
- **Advanced Filtering**: Search, sort, and filter tickets by status, priority, and category.
- **Admin Insights**: Comprehensive analytics dashboard for system oversight.
- **Responsive UI**: Clean, modern interface built with Tailwind CSS and Lucide icons.

## Tech Stack

- **Frontend**: Next.js (App Router), React Hooks, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (jsonwebtoken & jose), bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add the following:
   ```env
   MONGODB_URI=mongodb://localhost:27017/support_system
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Seed the database with initial roles:
   ```bash
   npm run seed
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Default Credentials

After running the seed script, you can use these accounts to test the system:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `adminpassword` |
| **Support Agent** | `agent@example.com` | `agentpassword` |
| **Customer** | `customer@example.com` | `customerpassword` |

## User Roles

### Customer
- Register and log in.
- Create support tickets with category and priority.
- View and filter own tickets.
- Add comments to tickets.
- Edit or delete tickets ONLY while they are in "Open" status.

### Support Agent
- Access agent dashboard.
- View all tickets or focus on assigned ones.
- Update ticket status (Open -> In Progress -> Resolved -> Closed).
- Update ticket priority.
- Respond to customers via comments.

### Admin
- Full system oversight.
- Manage users and create new Support Agents/Admins.
- Assign tickets to specific agents.
- Delete any ticket if required.
- View system-wide analytics (total tickets, status/priority breakdown).

## API Endpoints

### Auth
- `POST /api/auth/register`: Register a new customer.
- `POST /api/auth/login`: Authenticate user and set cookie.
- `POST /api/auth/logout`: Clear authentication cookie.
- `GET /api/auth/me`: Get current user details.

### Tickets
- `GET /api/tickets`: List tickets (with search, filter, pagination).
- `POST /api/tickets`: Create a new ticket.
- `GET /api/tickets/[id]`: Get ticket details and comments.
- `PATCH /api/tickets/[id]`: Update ticket (RBAC enforced).
- `DELETE /api/tickets/[id]`: Delete ticket (RBAC enforced).
- `POST /api/tickets/[id]/comments`: Add a comment to a ticket.

### Admin
- `GET /api/admin/users`: List all system users.
- `POST /api/admin/users`: Create a new Agent or Admin.
- `GET /api/admin/analytics`: Get system-wide statistics.

## Project Structure

- `/app`: Next.js pages and API routes.
- `/components`: Reusable UI components and layout.
- `/context`: Global state management (Toasts).
- `/lib`: Utility functions (DB connection, Auth logic).
- `/models`: Mongoose schemas.
- `/types`: TypeScript interfaces.
- `middleware.ts`: Role-based route protection.
