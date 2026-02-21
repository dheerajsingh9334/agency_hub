# Dheeraj Software Solutions — Company Management Portal

A role-based software company management portal with **Admin**, **Employee**, and **Client** roles.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI:** Tailwind CSS, shadcn/ui
- **Backend:** Express.js, Node.js
- **Database:** MongoDB (via Prisma ORM)
- **Auth:** JWT (JSON Web Tokens) + bcrypt
- **State Management:** TanStack React Query
- **Routing:** React Router v6

## Features

### Admin Portal

- Create/remove employees and client companies
- Create and manage services
- Approve client service requests
- Assign employees to projects
- Manage projects and view dashboard stats
- Messaging with employees and clients
- Edit profile

### Employee Portal

- View assigned projects
- Update project status
- Message admin and clients
- Edit profile

### Client Portal

- View projects
- Request new services
- Message admin and assigned employees
- Edit profile

### Service Request Flow

Client requests a service → Admin approves → Project is created

### Messaging

- Admin ↔ Employee
- Admin ↔ Client
- Client ↔ Employee

## Setup Instructions

### Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd dheeraj-software-solutions

# ── Backend setup ──
cd backend
cp .env.example .env          # Edit .env with your MongoDB URI and JWT secret
npm install
npx prisma generate
npx prisma db push
npm run seed                  # Seeds test users
npm run dev                   # Starts API on http://localhost:5000

# ── Frontend setup (in a new terminal) ──
cd frontend
cp .env.example .env
npm install
npm run dev                   # Starts UI on http://localhost:8080
```

### Environment Variables

**backend/.env**

```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/dheeraj-software?retryWrites=true&w=majority"
JWT_SECRET="your-secret-key-here"
PORT=5000
```

**frontend/.env**

```
VITE_API_URL="http://localhost:5000/api"
```

### Database Setup

1. Create a free MongoDB Atlas cluster at [mongodb.com](https://www.mongodb.com/atlas)
2. Get your connection string and add it to `backend/.env` as `DATABASE_URL`
3. Run `npm run prisma:push` to create collections
4. Run `npm run seed` to create test users

## Test Login Credentials

| Role     | Email                | Password    |
| -------- | -------------------- | ----------- |
| Admin    | admin@dheeraj.com    | admin123    |
| Employee | employee@dheeraj.com | employee123 |
| Client   | client@dheeraj.com   | client123   |

## Project Structure

```
├── package.json              # Root scripts (dev, build, seed, etc.)
├── backend/                  # Express.js API server
│   ├── package.json          # Backend dependencies
│   ├── tsconfig.json
│   ├── .env                  # Backend env vars (DB, JWT, PORT)
│   ├── prisma/
│   │   └── schema.prisma     # Prisma schema (MongoDB models)
│   └── src/
│       ├── index.ts          # Server entry point
│       ├── seed.ts           # Database seeder
│       ├── lib/
│       │   ├── prisma.ts     # Prisma client singleton
│       │   └── auth.ts       # JWT middleware
│       └── routes/
│           ├── auth.ts       # Login / signup / me
│           ├── users.ts      # User CRUD
│           ├── companies.ts  # Company CRUD
│           ├── services.ts   # Service CRUD
│           ├── serviceRequests.ts
│           ├── projects.ts   # Projects + employee assignment
│           ├── messages.ts   # Messaging
│           └── dashboard.ts  # Dashboard stats
└── frontend/                 # React + Vite client
    ├── package.json          # Frontend dependencies
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── .env                  # Frontend env vars (API URL)
    ├── public/
    └── src/
        ├── main.tsx          # App entry point
        ├── App.tsx           # Router + providers
        ├── lib/api.ts        # API client (fetch wrapper)
        ├── hooks/useAuth.tsx  # Auth context (JWT)
        ├── components/
        │   ├── layout/       # DashboardLayout
        │   └── ui/           # shadcn/ui components
        └── pages/
            ├── admin/        # Admin pages
            ├── client/       # Client pages
            └── employee/     # Employee pages
```

## API Endpoints

| Method | Endpoint                          | Description               |
| ------ | --------------------------------- | ------------------------- |
| POST   | /api/auth/login                   | Login                     |
| POST   | /api/auth/signup                  | Register                  |
| GET    | /api/auth/me                      | Current user profile      |
| GET    | /api/users                        | List users                |
| POST   | /api/users                        | Create user (admin)       |
| DELETE | /api/users/:id                    | Delete user (admin)       |
| PATCH  | /api/users/:id                    | Update profile            |
| GET    | /api/companies                    | List companies            |
| POST   | /api/companies                    | Create company (admin)    |
| DELETE | /api/companies/:id                | Delete company (admin)    |
| GET    | /api/services                     | List services             |
| POST   | /api/services                     | Create service (admin)    |
| DELETE | /api/services/:id                 | Delete service (admin)    |
| GET    | /api/service-requests             | List service requests     |
| POST   | /api/service-requests             | Create request (client)   |
| PATCH  | /api/service-requests/:id/approve | Approve request (admin)   |
| PATCH  | /api/service-requests/:id/reject  | Reject request (admin)    |
| GET    | /api/projects                     | List projects             |
| POST   | /api/projects                     | Create project (admin)    |
| PATCH  | /api/projects/:id/status          | Update status             |
| POST   | /api/projects/:id/assign          | Assign employee (admin)   |
| DELETE | /api/projects/:id/assign/:empId   | Unassign employee (admin) |
| GET    | /api/messages/contacts            | List contacts             |
| GET    | /api/messages/:contactId          | Get conversation          |
| POST   | /api/messages                     | Send message              |
| GET    | /api/dashboard                    | Dashboard stats           |

## Deployment

### Frontend

```bash
npm run build
```

Deploy `frontend/dist/` to Vercel, Netlify, or any static host.
Set `VITE_API_URL` to the deployed backend URL before building.

### Backend

Deploy the `backend/` directory to Render, Railway, or any Node.js host.
Start command: `npm run start`
Set `DATABASE_URL`, `JWT_SECRET`, and `PORT` environment variables.

## Live Demo

**Deployed URL:** _[Add your deployed link here]_

## Screenshots

_[Add screenshots here]_

## License

MIT
