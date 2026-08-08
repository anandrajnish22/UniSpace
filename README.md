# 🚀 UniSpace

> **Study. Work. Connect. Discover.**

UniSpace is a modern student-centric digital ecosystem — not a traditional college management system. It combines professional profiles, marketplace, jobs, events, communities, study resources, roommate discovery, real-time messaging, and more into a single premium platform.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎓 **Student Profiles** | Build your digital student identity with skills, projects, and achievements |
| 🛍️ **UniMarket** | Buy & sell books, electronics, and more within your campus community |
| 💼 **UniJobs** | Discover internships, jobs, and freelance opportunities |
| 📅 **UniEvents** | Find and register for hackathons, workshops, and campus events |
| 👥 **Communities** | Join academic and interest-based groups |
| 📚 **UniStudy** | Access study resources, notes, and create study groups |
| 🏠 **UniRoom** | Find roommates and PGs with smart compatibility matching |
| 💬 **Real-time Chat** | One-to-one and group messaging with Socket.IO |
| 🔔 **Notifications** | Centralized notification system |
| 🛡️ **Admin Dashboard** | Moderation, analytics, and user management |

---

## 🛠️ Tech Stack

### Frontend
- React.js + Vite + TypeScript
- Tailwind CSS v3
- React Router v6
- Zustand (state management)
- Framer Motion (animations)
- React Hook Form + Zod (forms & validation)
- Lucide React (icons)
- Axios + React Query (data fetching)

### Backend
- Node.js + Express.js + TypeScript
- Prisma ORM
- PostgreSQL / SQLite (development)
- JWT Authentication
- Socket.IO (real-time)
- Zod (validation)

---

## 📁 Project Structure

```
unispace/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── features/         # Feature modules
│   │   ├── hooks/            # Custom React hooks
│   │   ├── layouts/          # Page layouts
│   │   ├── lib/              # API client, utilities
│   │   ├── pages/            # Route pages
│   │   ├── routes/           # Router config
│   │   ├── store/            # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   └── ...
├── backend/                  # Express + TypeScript backend
│   ├── src/
│   │   ├── config/           # Environment config
│   │   ├── middleware/       # Express middleware
│   │   ├── modules/          # Feature modules
│   │   ├── socket/           # Socket.IO handlers
│   │   └── utils/            # Helpers
│   ├── prisma/               # Database schema & migrations
│   └── ...
└── docs/                     # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn
- PostgreSQL (or SQLite for development)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd unispace

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Set up environment variables
cp ../.env.example .env
# Edit .env with your values

# Start development servers
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Environment Variables

See `.env.example` for all required variables.

---

## 📖 API Documentation

API health check:
```
GET /api/health
```

Full API documentation will be available at `/api/docs` (coming in Sprint 18).

---

## 📝 Development Sprints

- [x] Sprint 1: Project setup
- [ ] Sprint 2: Database + Prisma
- [ ] Sprint 3: Authentication
- [ ] Sprint 4: User profiles
- [ ] Sprint 5-20: See implementation plan

---

## 📄 License

MIT

---

Built with ❤️ for university students everywhere.
