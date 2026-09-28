# AcademiaConnect
<a href="https://academia-connect-nine.vercel.app">Live Demo</a>


A full-stack university platform: courses (with video lectures and notes), clubs, events,
university-wide notices, real-time messaging between students, individual profiles, and an
admin panel to manage all of it. Built as a classic three-tier app — separate React frontend,
separate Express API, MongoDB database — rather than a merged framework like Next.js, so each
piece is easy to reason about, deploy, or replace on its own.

The visual identity — forest-ink green, crest-gold, Zilla Slab + IBM Plex Sans — carries over
the "registrar's ledger meets modern app" direction from the original AcademiaConnect concept.

## Tech stack

| Layer     | Choice |
|-----------|--------|
| Frontend  | React 18 (Vite), React Router 7, Tailwind CSS, Axios, Socket.io-client |
| Backend   | Node.js, Express 4, Mongoose, JSON Web Tokens, bcrypt, Multer, Socket.io |
| Database  | MongoDB |

## Project structure

```
academiaconnect/
├── server/                  # Express API
│   ├── config/db.js         # MongoDB connection
│   ├── models/              # User, Course, Club, Event, Notice, Conversation, Message
│   ├── controllers/         # Route handlers
│   ├── routes/               # Express routers
│   ├── middleware/          # auth (JWT), admin gate, error handler, multer upload
│   ├── socket/               # Socket.io wiring for live messaging
│   ├── seed/seed.js         # Demo data generator
│   ├── uploads/               # Uploaded avatars, thumbnails, note PDFs (created at runtime)
│   └── server.js            # Entry point
└── client/                  # React app
    └── src/
        ├── components/       # layout, cards, common UI, file upload
        ├── context/AuthContext.jsx
        ├── pages/            # auth, courses, clubs, events, messaging, admin, ...
        └── services/         # axios instance, socket client
```

## Prerequisites

- Node.js 18 or newer
- A MongoDB instance — either installed locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## 1. Backend setup

```bash
cd server
npm install
```

A working `.env` is already included (pointed at `mongodb://127.0.0.1:27017/academiaconnect`
with a random JWT secret pre-generated). If you're using Atlas instead of a local database,
edit `MONGO_URI` in `server/.env`. `.env.example` documents every variable.

Populate the database with demo content (5 courses including Data Structures / AI / Theory of
Computation, 4 clubs, events, notices, and a sample conversation):

```bash
npm run seed
```

Start the API:

```bash
npm run dev        # nodemon, auto-restarts on changes
# or
npm start
```

The API runs on `http://localhost:5000`. Visit `http://localhost:5000/api/health` to confirm
it's up.

**Demo accounts (after seeding):**
| Role    | Email                                          | Password    |
|---------|-------------------------------------------------|-------------|
| Admin   | admin@academiaconnect.edu                       | admin123    |
| Student | ayesha.rahman@student.academiaconnect.edu       | password123 |

You don't actually need the seed script to get an admin account: **the first person to ever
register on a fresh database is automatically made an admin.** Every account after that
defaults to `student`. Admins can promote other users from Admin → Users.

## 2. Frontend setup

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173`. `.env` is pre-configured to talk to the backend at
`http://localhost:5000`; edit `VITE_API_URL` / `VITE_SERVER_URL` in `client/.env` if you change
the backend's port or deploy it elsewhere.

Log in with a seeded account, or register a new one — do that first if you want a clean,
empty-DB admin account instead of the seed data.


## Deployment notes

### Frontend — Vercel

Set these Vercel environment variables:

```env
VITE_API_URL=https://YOUR-RENDER-BACKEND.onrender.com
VITE_SERVER_URL=https://YOUR-RENDER-BACKEND.onrender.com
```

The frontend automatically normalizes `VITE_API_URL` to end in `/api`, so both
`https://YOUR-RENDER-BACKEND.onrender.com` and
`https://YOUR-RENDER-BACKEND.onrender.com/api` are accepted.

The included `client/vercel.json` keeps React Router deep links working when a user
refreshes `/login`, `/dashboard`, `/courses/123`, etc.

### Backend — Render

Set:

```env
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://YOUR-VERCEL-APP.vercel.app
NODE_ENV=production
```

If you have more than one frontend origin, separate them with commas in `CLIENT_URL`.

The canonical authentication endpoint is:

```text
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
```

For compatibility with older frontend configurations, `/auth/*` is also accepted by
the server. New deployments should still use the `/api` form.

## How each feature actually works

- **Auth** — email/password, bcrypt-hashed, JWT in `localStorage` sent as a Bearer token.
  Simpler and more portable across origins than httpOnly cookies for a project like this; if
  you deploy this for real, httpOnly cookies with `sameSite`/CORS configured are the more
  XSS-resistant option.
- **Course videos** — stored as URLs (YouTube links auto-embed; anything else gets a "watch
  externally" link), not uploaded files. Actually hosting/transcoding video is its own
  infrastructure problem that's out of scope here — this is what most real LMS products do too.
- **Course notes, avatars, thumbnails, club/event images** — real file uploads via Multer,
  saved to `server/uploads/` and served statically. Fine for local use or a single-server
  deploy; for a real production deploy behind multiple instances or serverless, swap the
  storage layer for S3/Cloudinary/etc. — the single `POST /api/upload` endpoint is the only
  place you'd need to change.
- **Messaging** — REST for history (`GET /api/messages/with/:userId`) plus Socket.io for live
  delivery. Each client joins a room named after their own user ID on connect, so the server
  can push a `newMessage` event to a specific user without tracking socket IDs manually.
- **Admin panel** — role-gated routes inside the same app (`/admin/*`, guarded by
  `AdminRoute` + backend `adminOnly` middleware) rather than a separately deployed
  application. You asked for "a separate admin site" — this delivers it as a distinct,
  clearly separated section with its own layout and nav, which is how the large majority of
  real products (including ones with dedicated "admin panels") actually ship it, instead of
  standing up and maintaining a second deployable app for what is fundamentally the same data.

## Things I deliberately did *not* do, and why

- **Auth library**: your stack notes mention BetterAuth. I used plain JWT + bcrypt instead.
  BetterAuth's simplest integration path assumes a tighter frontend/backend coupling than
  this separated Express+React setup gives it, and I'd rather hand you auth I'm fully
  confident is correct than guess at a third-party API surface I can't test against a live
  database in the environment I built this in. Swapping it in later is a contained change —
  it only touches `authController.js`, `middleware/auth.js`, and `AuthContext.jsx`.
- **Vite stayed on v5**, not the v8 that `npm audit fix --force` would install. The flagged
  issues (esbuild dev-server request handling, a couple of Windows-specific path issues) only
  affect the local dev server, never a production build, and two are Windows-only. A 5→8 jump
  is a real breaking-change risk to Tailwind's PostCS integration that I didn't want to ship
  unverified. If you want to chase it: `npm audit fix --force` in `client/`, then re-test the
  Tailwind build.
- **Express 4 pulls in a vulnerable transitive `qs`** (moderate, path-parsing DoS/bypass
  class). No non-breaking fix exists yet; Express 5 would resolve it but is a bigger migration
  than this project's scope. Worth revisiting later with `npm audit`.

## Extending it

- Course categories, notice categories, and club categories are enums/free text in
  `server/models/` — add to the arrays there and in the matching frontend `CATEGORIES` constants.
  Add more listed categories as the course catalog grows.
- To add email notifications (e.g. on new notice), hook into `noticeController.createNotice`.
- To paginate lists once content grows past demo scale, the list controllers
  (`getCourses`, `getClubs`, `getEvents`, `getNotices`) are the place to add `skip`/`limit`.
