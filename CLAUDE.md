# NEXUS AI — Project Documentation

## Overview
NEXUS AI is an enterprise-grade SaaS platform for selling AI Agents as automated employees. Built with Next.js 15, TypeScript, and a carefully curated tech stack optimized for AI orchestration.

## Project Structure

```
nexus-ai/
├── app/                    # Next.js 15 App Router
│   ├── (marketing)/       # Public pages (hero, pricing, integrations)
│   ├── (auth)/           # Sign-in/sign-up pages (Clerk)
│   ├── (app)/            # Authenticated app pages (dashboard, agents, etc)
│   ├── api/
│   │   └── trpc/         # tRPC API endpoint
│   └── layout.tsx        # Root layout with Clerk + Tailwind theme
├── server/               # Backend logic
│   ├── trpc.ts          # tRPC instance and middleware
│   └── routers/         # tRPC routers (agents, tasks, integrations, subscription)
├── components/          # React components
│   ├── 3d/             # Three.js 3D scenes (Phase 2+)
│   ├── marketing/      # Landing page sections
│   ├── app/            # Dashboard components
│   └── ui/             # Design system components (button, card, etc)
├── lib/                 # Utilities
│   ├── cn.ts           # Tailwind merge utility
│   ├── agents/         # LangChain agent setup (Phase 4+)
│   ├── integrations/   # Tool connector clients (Phase 5+)
│   └── db.ts           # Prisma client (Phase 3+)
├── prisma/
│   └── schema.prisma   # Database schema (PostgreSQL)
├── tailwind.config.ts  # Design tokens (colors, spacing, fonts)
├── app/globals.css     # Global styles + utilities
└── .env.local          # Local environment variables

```

## Tech Stack

**Frontend:**
- Next.js 15 with App Router
- React 18 with TypeScript strict mode
- Tailwind CSS v4 (customized with design tokens)
- Three.js + React Three Fiber (3D scenes)
- Framer Motion + GSAP (animations)
- Radix UI (headless components)

**Backend:**
- tRPC for end-to-end type-safe APIs
- Prisma ORM (PostgreSQL)
- Clerk for authentication
- Stripe for payments & subscriptions

**AI & Orchestration:**
- LangChain.js for agent framework
- LangGraph for agentic workflows
- Inngest for durable job execution
- Support for 15+ AI models

**Infrastructure:**
- Vercel (deployment)
- Neon (serverless PostgreSQL)
- Upstash (Redis + QStash)
- Stripe (payments)

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add your Clerk, Stripe, and database credentials

3. **Setup Database**
   - Create a PostgreSQL database (use Neon for serverless)
   - Update `DATABASE_URL` in `.env.local`
   - Run: `npx prisma migrate dev --name init`

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## Key Features

### Phase 1 ✅ - Foundation
- [x] Next.js 15 scaffold with TypeScript strict mode
- [x] Design system (colors, typography, spacing)
- [x] Prisma schema (users, orgs, agents, tasks, subscriptions)
- [x] Clerk authentication integration
- [x] tRPC API routes with middleware
- [x] Base layouts (marketing, app, auth)
- [x] Placeholder pages for all main routes

### Phase 2 - Marketing Site
- [ ] 3D neural network hero (Three.js)
- [ ] Agent showcase with animations
- [ ] Pricing page (3-tier fast food menu)
- [ ] Integrations grid
- [ ] Scroll-driven GSAP animations
- [ ] Responsive design
- [ ] SEO optimization

### Phase 3 - Core App
- [ ] Dashboard with metrics
- [ ] Agent CRUD (create, configure, activate)
- [ ] Agent builder UI
- [ ] Stripe subscription management
- [ ] Tier-based feature gating
- [ ] Billing portal

### Phase 4 - AI Engine
- [ ] LangChain agent setup
- [ ] Model routing (Claude, GPT-4o, Gemini, etc)
- [ ] Tool connectors (stubs → real implementations)
- [ ] Inngest job runner for agent execution
- [ ] Memory system (conversation history + vector store)
- [ ] Task execution and logging

### Phase 5 - Integrations
- [ ] OAuth flows (Google, Slack, Salesforce, HubSpot)
- [ ] Real API integrations
- [ ] AI tool connections (Perplexity, ElevenLabs, Imagen)
- [ ] Webhook handlers
- [ ] Tool execution within agents

## Design System

**Colors:**
- `--primary: #6C63FF` (electric violet)
- `--secondary: #00D4FF` (cyan neon)
- `--accent: #FF6B35` (ember orange)
- `--gold: #C9A84C` (empire tier)
- `--bg-primary: #08090A` (void black)

**Typography:**
- Brand: Geist Sans + Space Grotesk accent
- System: Geist family throughout

**Theme:**
- Sleek minimalist with underground tech coloring
- Glass morphism effects
- Neon accents on dark backgrounds

## Important Notes

1. **TypeScript Strict Mode**: All code must pass strict TypeScript checks
2. **Tailwind Configuration**: Design tokens are in `tailwind.config.ts` - use these consistently
3. **3D Scenes**: Use Three.js for hero and interactive elements, degrade gracefully on mobile
4. **Authentication**: Clerk handles user management and org/team support
5. **Database**: PostgreSQL via Neon. Run Prisma migrations after schema changes.
6. **API**: tRPC provides type-safe endpoints. Add new routes in `server/routers/`

## Subscription Tiers

| Tier | Price | Agents | Tools | Models | Monthly Runs |
|------|-------|--------|-------|--------|--------------|
| RECRUIT | $97 | 1 | 3 | 2 | 500 |
| OPERATOR | $497 | 5 | 10 | 5 | 5,000 |
| EMPIRE | $2,497 | ∞ | ∞ | ∞ | ∞ |

## Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build
npm run lint                   # Run ESLint

# Database
npx prisma migrate dev        # Create and apply migrations
npx prisma studio            # Open Prisma database browser
npx prisma generate          # Generate Prisma client

# Type checking
npm run type-check           # Full TypeScript check
```

## Next Steps

1. Set up database connection (Neon PostgreSQL)
2. Configure Clerk authentication (clerk.com)
3. Move to Phase 2: Build marketing site with 3D hero
4. Phase 3: Implement dashboard and subscription management
5. Phase 4: Build AI engine with LangChain
6. Phase 5: Implement tool integrations
