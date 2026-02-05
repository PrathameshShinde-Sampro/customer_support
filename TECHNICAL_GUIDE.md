# Customer Support Ticket Management System - Technical Guide

This document provides a comprehensive overview of how the system functions, its architecture, and the logic behind its features.

## 1. System Architecture

The application is built using a modern **Next.js Full-Stack Architecture**.

- **Frontend**: React (Next.js App Router) with Tailwind CSS. State is managed locally within components or via React Hooks and Context (for Toasts).
- **Backend**: Next.js API Routes (Serverless functions) handling business logic and database interactions.
- **Database**: MongoDB (NoSQL) with Mongoose for Object Data Modeling (ODM).
- **Authentication**: JWT (JSON Web Tokens) stored in secure, HTTP-only cookies.

---

## 2. Core Functionalities

### A. Authentication & Authorization
- **Registration**: New users are registered as `customer` by default. Passwords are hashed using `bcryptjs` before storage.
- **Login**: Verifies credentials and generates a JWT containing the user's ID, email, and role. This token is sent to the client as an HTTP-only cookie.
- **Middleware (`middleware.ts`)**:
    - Intercepts every request.
    - Decodes the JWT using the `jose` library (edge-compatible).
    - Checks the user's role against the requested path (e.g., `/admin/**` requires `admin` role).
    - Redirects unauthorized users to the `/unauthorized` page or returns a 401/403 API response.

### B. Ticket Lifecycle
The system follows a strict state transition flow:
`Open` → `In Progress` → `Resolved` → `Closed`

- **Creation**: Customers can create tickets with a Title, Description, Category, and Priority.
- **Assignment**: Admins can assign tickets to specific Support Agents.
- **Updates**:
    - **Customers** can edit or delete their tickets only while the status is still `Open`.
    - **Agents** can change the status and priority.
    - **Admins** have full override authority over all fields.

### C. Communication System
- Each ticket has an associated `comments` collection.
- Conversation history is displayed in chronological order on the Ticket Details page.
- Role-based badges identify whether a message was sent by a Customer, Agent, or Admin.

### D. Admin Analytics
The Admin dashboard aggregates data from the `tickets` collection to provide:
- Total ticket counts.
- Status distribution (e.g., how many are Resolved vs. Open).
- Priority distribution (High, Medium, Low).
- Category breakdown (Technical, Billing, General).

---

## 3. API Walkthrough

### Ticket Retrieval (`GET /api/tickets`)
Supports complex querying:
- **Filtering**: By `status`, `priority`, or `category`.
- **Searching**: Full-text search on `title` and `description`.
- **Pagination**: Uses `limit` and `skip` to handle large datasets efficiently.
- **RBAC Enforcement**: Automatically filters results to show only the customer's own tickets if the user is a `customer`.

### Ticket Management (`PATCH /api/tickets/[id]`)
This single endpoint handles various updates based on the user's role:
- If `role === 'customer'`: Only allows updates to `title`, `description`, `category` (and only if `status === 'Open'`).
- If `role === 'agent'`: Allows updates to `status` and `priority`.
- If `role === 'admin'`: Allows updates to any field, including `assignedTo`.

---

## 4. UI/UX Features

- **Responsive Dashboards**: Custom views for each role ensure users only see what is relevant to them.
- **Toast Notifications**: Real-time feedback for actions like successful login, ticket creation, or errors.
- **Loading States**: Skeletons and spinners ensure a smooth user experience during data fetching.
- **Modals**: Used for non-intrusive data entry (e.g., creating a new ticket or adding a user).

---

## 5. Security Best Practices
1. **Password Hashing**: Uses Salt + Hash (10 rounds) via `bcryptjs`.
2. **JWT in HTTP-only Cookies**: Protects against Cross-Site Scripting (XSS).
3. **Database Projections**: Passwords and sensitive fields are excluded from queries by default (`select: false`).
4. **Server-side Validation**: All API routes validate user input and session state before performing database operations.
5. **Environment Variables**: Sensitive keys (MongoDB URI, JWT Secret) are never hardcoded and must be provided via `.env.local`.

---

## 6. How to Run & Test
1. **Seed**: Run `npm run seed` to create the default test accounts.
2. **Explore**:
    - Log in as a **Customer** (`customer@example.com`) to raise a ticket.
    - Log in as an **Admin** (`admin@example.com`) to assign that ticket to an agent.
    - Log in as an **Agent** (`agent@example.com`) to resolve the ticket and respond to the customer.
