# Naano Clone

Naano Clone is a full-stack creator/brand marketplace application built with React, Vite, TypeScript, Node.js, and SQLite.

The project is split into:

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js HTTP server + TypeScript
- **Database:** SQLite via `better-sqlite3`
- **Authentication:** Email/password, email OTP, and Google OAuth
- **Frontend deployment:** Netlify
- **Backend deployment:** Render

## Live deployment

- Frontend: https://jocular-longma-0f9c9d.netlify.app
- Backend: https://nano-clone-lo9q.onrender.com

> The backend URL is an API service. Open the frontend URL to use the application.

---

## Requirements

Install these before starting development:

- Node.js 22+
- npm
- Git

Check your versions:

```bash
node -v
npm -v
git --version
```

---

## Clone the repository

```bash
git clone https://github.com/chaitanya-92/nano-clone.git
cd nano-clone
```

---

## Install dependencies

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
cd ..
```

---

## Environment variables

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

### Local development

Use values similar to:

```env
PORT=8787
APP_ORIGIN=http://localhost:8787
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
DATABASE_PATH=./data/naano.sqlite

VITE_API_URL=http://localhost:8787

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:8787/api/auth/google/callback

RESEND_API_KEY=
RESEND_FROM_EMAIL=
EMAIL_OTP_SECRET=
```

Never commit real API keys, OAuth client secrets, or other credentials to Git.

---

## Run locally

You need the frontend and backend running at the same time.

### Terminal 1 — backend

From the repository root:

```bash
npm run dev:api
```

The backend runs on:

```text
http://localhost:8787
```

### Terminal 2 — frontend

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Open:

http://localhost:5173

---

## Google OAuth setup

For local Google sign-in, configure your Google OAuth Web Client with:

### Authorized JavaScript origins

```text
http://localhost:5173
```

### Authorized redirect URIs

```text
http://localhost:8787/api/auth/google/callback
```

For production, also add:

### Authorized JavaScript origins

```text
https://jocular-longma-0f9c9d.netlify.app
```

### Authorized redirect URIs

```text
https://nano-clone-lo9q.onrender.com/api/auth/google/callback
```

Google OAuth redirect URIs must exactly match the callback URL configured by the backend.

---

## Available scripts

From the repository root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite frontend development server |
| `npm run dev:api` | Start the backend in watch mode |
| `npm run build` | Type-check and build the frontend |
| `npm run build:backend` | Build the backend TypeScript |
| `npm run build:all` | Build frontend and backend |
| `npm run lint` | Run ESLint on the frontend |
| `npm run preview` | Preview the production frontend build |
| `npm run start` | Start the backend |

Backend scripts can also be run from `backend/`:

```bash
cd backend
npm run dev
npm run build
npm run start
```

---

## Production deployment

### Frontend — Netlify

The frontend is configured with `netlify.toml`.

Build settings:

```text
Build command: npm run build
Publish directory: dist
```

Set this Netlify environment variable:

```env
VITE_API_URL=https://nano-clone-lo9q.onrender.com
```

After changing a `VITE_*` variable, trigger a new Netlify deploy because Vite embeds these values into the frontend build.

### Backend — Render

Render should use:

```text
Branch: main
Root directory: backend
Build command: npm install && npm run build
Start command: npm run start
```

Production environment variables:

```env
NODE_ENV=production
APP_ORIGIN=https://nano-clone-lo9q.onrender.com
FRONTEND_ORIGIN=https://jocular-longma-0f9c9d.netlify.app
DATABASE_PATH=./data/naano.sqlite

GOOGLE_CLIENT_ID=<your Google client ID>
GOOGLE_CLIENT_SECRET=<your Google client secret>
GOOGLE_CALLBACK_URL=https://nano-clone-lo9q.onrender.com/api/auth/google/callback

RESEND_API_KEY=<your Resend API key>
RESEND_FROM_EMAIL=onboarding@resend.dev
EMAIL_OTP_SECRET=<your OTP secret>
```

Do not commit production secrets to the repository.

Render supplies the `PORT` environment variable for the web service. The backend binds to `0.0.0.0` so it can receive public traffic.

---

## Application flow

The production application uses this architecture:

```text
Browser
   |
   v
Netlify frontend
https://jocular-longma-0f9c9d.netlify.app
   |
   | VITE_API_URL
   v
Render backend
https://nano-clone-lo9q.onrender.com
   |
   +---- SQLite database
   |
   +---- Google OAuth
   |
   +---- Resend email/OTP
```

---

## Main application areas

The project includes functionality for:

- Creator and brand registration
- Email/password authentication
- Email OTP verification
- Google OAuth authentication
- Creator onboarding
- Brand onboarding
- Social account connections
- Creator profiles and public creator cards
- Dashboard workflows
- Campaigns and applications
- Collaborations
- Messaging
- Notifications
- Community features
- Analytics
- Earnings
- Affiliate features
- Company website analysis
- AI assistant functionality

---

## API

The backend exposes API routes under:

```text
/api/*
```

Useful endpoints include:

```text
GET  /api/health
GET  /api/auth/me
GET  /api/auth/google
GET  /api/auth/google/callback
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/email/request-otp
POST /api/auth/email/verify-otp
```

The frontend uses `VITE_API_URL` as the backend base URL and appends the API path automatically.

---

## Database

The application uses SQLite:

```text
./data/naano.sqlite
```

For local development, the database is created/initialized by the backend.

When deploying SQLite to a hosting provider, make sure the service has persistent storage if data must survive service replacement or redeployment. Otherwise, use a managed database such as PostgreSQL for production workloads.

---

## Project structure

```text
nano-clone/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.ts
│   └── package.json
├── public/
├── src/
│   ├── auth/
│   ├── components/
│   ├── dashboard/
│   ├── data/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   └── store/
├── netlify.toml
├── package.json
├── vite.config.ts
└── .env.example
```

---

## Troubleshooting

### Frontend shows API errors

Check that Netlify has:

```env
VITE_API_URL=https://nano-clone-lo9q.onrender.com
```

Then redeploy the frontend.

### Google OAuth fails

Check all three locations:

1. Netlify `VITE_API_URL`
2. Render `GOOGLE_CALLBACK_URL`
3. Google Cloud OAuth Client redirect URI

Production callback:

```text
https://nano-clone-lo9q.onrender.com/api/auth/google/callback
```

### Backend returns 500

Open the Render service logs and check the first application error after startup. Also verify that the required production environment variables are configured.

### Local OAuth redirects to localhost

Make sure you are using the production frontend URL and that `VITE_API_URL` is set to the Render backend URL in Netlify. Local development intentionally uses `localhost:5173` and `localhost:8787`.

---

## Security

- Do not commit `.env` files.
- Do not expose Google client secrets in frontend code.
- Do not put Resend API keys or OTP secrets in `VITE_*` variables.
- Rotate credentials immediately if they are accidentally exposed.
- Use environment variables/secrets for production credentials.

---

## Development workflow

Typical development flow:

```bash
git pull --ff-only origin main

npm install
cd backend && npm install && cd ..

npm run build:all
npm run dev:api
# In another terminal:
npm run dev
```

Before pushing changes:

```bash
npm run build
npm run build:backend
npm run lint
```

Then commit and push to `main`:

```bash
git add .
git commit -m "your change"
git push origin main
```

Netlify and Render can be configured to deploy from the `main` branch automatically.

---

## License

This project is currently private and does not define a public open-source license.
