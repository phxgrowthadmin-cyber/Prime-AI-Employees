# NEXUS AI — Setup & Deployment Guide

## Phase 3 Status: ✅ COMPLETE
Authentication, database, and core dashboard fully functional.

---

## Quick Start (5 min)

### 1. Clone & Install
```bash
git clone <repo>
cd nexus-ai
npm install
```

### 2. Environment Variables
Create `.env.local`:
```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_B9VoUh4EgGsf@ep-withered-frog-a6khp3yq.us-west-2.aws.neon.tech/neondb?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_ZnVsbC1iYWJvb24tNzYuY2xlcmsuYWNjb3VudHMuZGV2JA"
CLERK_SECRET_KEY="sk_test_AdQ7sljFo7Xvgi701tATPxM7CeQFmFAsYBZoFBDyBx"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe (placeholder for Phase 4)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_placeholder"
STRIPE_SECRET_KEY="sk_test_placeholder"
STRIPE_WEBHOOK_SECRET="whsec_test_placeholder"

# AI Models (Phase 4)
ANTHROPIC_API_KEY=""
OPENAI_API_KEY=""
GOOGLE_AI_API_KEY=""

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database Setup
```bash
npx prisma migrate deploy
npx prisma db seed  # (optional - future)
```

### 4. Run Dev Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind v4
- **Backend**: tRPC, Prisma ORM
- **Database**: PostgreSQL (Neon serverless)
- **Auth**: Clerk
- **Payments**: Stripe (Phase 4)
- **AI**: LangChain (Phase 4)

### Key Files
```
app/
  ├── (marketing)/      # Public pages
  ├── (auth)/          # Sign-in/sign-up (Clerk)
  ├── (app)/           # Authenticated dashboard
  │   ├── dashboard/
  │   ├── agents/
  │   ├── integrations/
  │   ├── tasks/
  │   └── billing/
  └── api/trpc/        # tRPC endpoint
  
server/
  ├── trpc.ts          # Context + middleware
  └── routers/         # API routes
      ├── agents.ts
      ├── tasks.ts
      ├── integrations.ts
      ├── subscription.ts
      └── organizations.ts
      
components/
  ├── providers/       # tRPC + Clerk setup
  └── ui/             # Design system
  
lib/
  ├── trpc.ts         # React tRPC client
  ├── db.ts           # Prisma client
  └── cn.ts           # Tailwind merge
```

---

## Features Implemented

### Phase 3 ✅
- [x] Clerk authentication (sign-up, sign-in, auto org creation)
- [x] Database schema (users, orgs, agents, tasks, etc)
- [x] tRPC API with type-safe endpoints
- [x] Dashboard with live stats
- [x] Agent CRUD (create, list, update, delete)
- [x] Task history tracking
- [x] Integration management (connect/disconnect)
- [x] Billing page (tier display, usage meters)
- [x] Auto organization creation on first sign-up

### Phase 4 (TODO)
- [ ] LangChain agent execution
- [ ] Model routing (Claude, GPT-4o, Gemini)
- [ ] Tool connectors (real OAuth flows)
- [ ] Inngest job runner
- [ ] Memory system

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # Run ESLint
npm run type-check       # TypeScript check

# Database
npx prisma migrate dev   # Create migration
npx prisma studio       # Open database UI
npx prisma generate     # Regenerate client

# Git
git add .
git commit -m "message"
git push origin main
```

---

## Troubleshooting

### UNAUTHORIZED errors
- Check DATABASE_URL in .env.local
- Verify Neon connection is active
- User must be signed in with Clerk
- Organization auto-creates on first API call

### Clerk buttons not working
- Verify NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- Check browser console for Clerk errors
- Restart dev server after env changes

### Prisma migration errors
```bash
# Reset local database (development only)
npx prisma migrate reset
```

---

## Deployment (Vercel)

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Connect to Vercel
- Go to vercel.com
- Import this repo
- Add environment variables (from .env.local)
- Deploy

### 3. Update Clerk
- In Clerk dashboard, update allowed origins to your Vercel URL
- Update OAuth redirect URIs

---

## Important Notes

1. **Clerk Setup**: Test keys work for development. Replace with production keys before deploying.
2. **Neon Database**: Free tier includes 3GB storage and good performance. Upgrade as needed.
3. **Stripe**: Payment integration is stubbed. Wire it up in Phase 4.
4. **Multi-session**: Clerk is in single-session mode. Change in dashboard if needed.

---

## Support

For issues, check:
- Browser console (F12)
- Server logs (`npm run dev` output)
- Prisma Studio: `npx prisma studio`
- Clerk dashboard for user/auth issues

Questions? Check CLAUDE.md for detailed architecture docs.
