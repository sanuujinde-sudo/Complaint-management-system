# Online Complaint Registration and Management System

This workspace contains a MERN complaint management system for submitting, routing, tracking, and resolving issues.

Folders:
- `backend` - Express API server
- `frontend` - React client

See `.env.example` in `backend` for environment variables.

## Features

- JWT authentication with user, agent, and admin roles
- Complaint creation, assignment, status workflow, and secure detail access
- Interactive dashboard with search, status/category filters, sorting, metrics, and responsive cards
- Admin operations desk with agent assignment and live summary metrics
- Resolution timeline for every complaint
- Feedback submission after resolution with duplicate-feedback protection
- Dedicated administrator login and administrator provisioning command
- Separate role workspaces: users submit and track complaints; administrators assign, resolve, and update status
- Three default agents are seeded automatically: Aarav Sharma, Meera Patel, and Daniel Wilson
- MongoDB indexes for status, ownership, assignment, and email queries
- Responsive Bootstrap-based UI with toast notifications and mobile navigation

## API overview

- `POST /api/auth/register` and `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/complaints`, `POST /api/complaints`
- `GET /api/complaints/:id`, `PUT /api/complaints/:id`
- `GET /api/complaints/stats/summary` (admin)
- `GET /api/agents` (admin)
- `POST /api/feedback`, `GET /api/feedback`

Run backend:

```powershell
cd "c:\Users\svc\Documents\Complain management system\backend"
npm install
npm run dev
```

Create or update the administrator account before starting the server. First copy `.env.example` to `.env`, set the admin values, then run:

```powershell
cd "c:\Users\svc\Documents\Complain management system\backend"
npm run create-admin
```

Use the **Admin login** button in the frontend or open `/admin/login`. The administrator registration page is `/admin/register`. Public user registration creates a `USER` account, while administrator registration creates an `ADMIN` account.

On first startup, the backend creates these agent accounts if they do not already exist. Set `AGENT_DEFAULT_PASSWORD` in `.env` to choose their shared initial password. They then appear in the administrator assignment selector.

Run frontend:

```powershell
cd "c:\Users\svc\Documents\Complain management system\frontend"
npm install
npm start
```
