Admin Dashboard (JWT Protected)
This project includes a secure admin dashboard that allows authenticated users to manage website content through a clean, modern interface.

Features
- Admin login using email & password
- JWT-based authentication (Bearer token)
- Edit website content (hero title, subtitle, about text, services)
- Save changes via protected API routes
- Logout with token invalidation on client
- Modern, responsive “glass” UI design

Tech Stack

- Frontend
- React (Vite)
- CSS (custom glassmorphism UI)
- Fetch API

Backend

- Node.js
- Express
- JWT authentication
- PostgreSQL

How It Works:

- Admin logs in using email/password
- Server validates credentials and issues a JWT
- JWT is stored client-side and attached to requests
- Protected API routes verify the token before allowing updates
- Content updates are persisted to PostgreSQL
- UI-based access control is handled client-side for UX,
security is enforced server-side via JWT verification.

1) Server
- cd server
- npm install
- cp .env.example .env
- npm run dev

Server runs on:
- http://localhost:4000

2) Client
- cd client
- npm install
- npm run dev

Client runs on:
- http://localhost:5173

server/.env
- PORT=4000
- JWT_SECRET=your_secret_here
- DATABASE_URL=postgres://user:password@localhost:5432/dbname
- .env is gitignored.
- Use .env.example as a reference.

Security Notes
- All write operations are protected by JWT middleware
- JWT verification happens server-side
- Frontend token checks are for routing only (UX)
- No credentials or secrets are committed to the repository

Status

✅ Login working
✅ JWT auth implemented
✅ PostgreSQL persistence
✅ Admin UI complete

Possible Improvements / Roadmap

- Role-based access (admin / editor)
- Rich-text editor for content fields
- Toast notifications for save status
- Token refresh / httpOnly cookies
- Deployment (Vercel + Render / Fly.io)

UPDATE:
- [ ] Refactor dashboard into reusable components
- [ ] Add keyboard shortcuts + accessibility
- [ ] Extract content editor logic into custom hook


<img width="521" height="815" alt="Login" src="https://github.com/user-attachments/assets/3f19b21e-3c09-477a-aba3-241241724957" />
<img width="515" height="883" alt="Login successful" src="https://github.com/user-attachments/assets/a1f3d320-0908-476f-a164-0ab55f5e5dbc" />
<img width="443" height="951" alt="admin dashboard" src="https://github.com/user-attachments/assets/08e41866-0efa-42eb-a724-c68142e39230" />

<img width="1069" height="277" alt="server running" src="https://github.com/user-attachments/assets/9910265a-3e53-4cbf-bc3f-06618eb59a32" />
<img width="345" height="144" alt="Screenshot 2026-01-15 163634" src="https://github.com/user-attachments/assets/d6fae247-9b37-4047-866c-82cbc127f852" />
<img width="896" height="328" alt="Screenshot 2026-01-15 163705" src="https://github.com/user-attachments/assets/4ab5405e-6167-44ca-aa13-01e4c1494723" />
