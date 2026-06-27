# NEXUS AI — Architecture & Implementation Details

## System Overview

NEXUS AI is an enterprise SaaS platform for AI agents. Users sign up, create AI agents, connect integrations, and track execution.

```
┌─────────────────────────────────────────────────────┐
│          Next.js 15 Frontend (React 18)              │
│  ┌──────────────────────────────────────────────┐   │
│  │  Marketing Site  │  Auth Flow  │  Dashboard  │   │
│  └──────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────┘
                 │ tRPC Client (type-safe)
                 │ Clerk Session Headers
                 ▼
┌─────────────────────────────────────────────────────┐
│         tRPC API Server (Next.js Route Handler)      │
│  ┌──────────────────────────────────────────────┐   │
│  │  agents  │  tasks  │  integrations  │  billing   │
│  └──────────────────────────────────────────────┘   │
│         ↓ Clerk Auth Middleware                     │
│         ↓ Organization Context                      │
└────────────┬──────────────────────────────────────┘
             │ Prisma ORM (type-safe DB)
             ▼
┌─────────────────────────────────────────────────────┐
│   PostgreSQL (Neon Serverless)                      │
│   ┌──────────────────────────────────────────────┐  │
│   │ users  │ orgs  │ agents  │ tasks  │ subs    │  │
│   └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Authentication Flow

### Sign-Up
1. User visits `/sign-up`
2. Clerk's `<SignUp />` component handles registration
3. User provides email + password
4. Clerk creates user session
5. Redirect to `/dashboard` (via `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`)
6. **First tRPC call triggers auto org-creation** in `server/trpc.ts:createContext()`

### Authentication Context
```
Clerk Session (Browser)
  ↓ Sent via fetch credentials: 'include'
tRPC Client (lib/trpc.ts)
  ↓ httpBatchLink with Clerk headers
tRPC Server (server/trpc.ts)
  ↓ auth() from @clerk/nextjs/server
Extracts userId + creates User/Org
  ↓
Protected Procedures now have orgId
```

### Organization Auto-Creation
When a user makes their first authenticated API call:

```typescript
// server/trpc.ts:createContext()
1. Get userId from Clerk auth()
2. Look up User in database
3. If User doesn't exist:
   - Create User with email from Clerk
4. If User has no organizations:
   - Create Organization
   - Create default RECRUIT subscription
5. Return { userId, orgId } to procedure
```

All subsequent calls have `orgId` in context.

---

## API Routes (tRPC Routers)

### agents.ts
```typescript
agents.list              // Get all agents for org
agents.create            // Create new agent
agents.get              // Get single agent details
agents.update           // Update agent config
agents.delete           // Delete agent
agents.activate         // Change status to ACTIVE
agents.pause            // Change status to PAUSED
```

### tasks.ts
```typescript
tasks.list              // Get task history
tasks.getStats          // Count by status (PENDING, RUNNING, COMPLETED, FAILED)
tasks.get               // Get task details + output
```

### integrations.ts
```typescript
integrations.list       // Get connected integrations
integrations.create     // Connect new integration
integrations.disconnect // Remove integration
integrations.getAvailable // List available types
```

### subscription.ts
```typescript
subscription.getCurrent // Get org's current tier + billing info
subscription.getUsage   // Get usage vs limits (agents, integrations, tasks)
subscription.upgradeTier // Change tier (RECRUIT → OPERATOR → EMPIRE)
subscription.createCheckoutSession // Stripe (stubbed)
```

### organizations.ts
```typescript
organizations.getOrCreate // Auto-create org if missing
organizations.getCurrent  // Get org details
```

---

## Database Schema

### User
- `id` (PK)
- `clerkId` (from Clerk)
- `email` (synced from Clerk)
- `name` (optional)
- `createdAt`, `updatedAt`
- Relations: `organizations[]`

### Organization
- `id` (PK)
- `name`, `slug`, `logo`, `website`
- `createdAt`, `updatedAt`
- Relations: `users[]`, `agents[]`, `subscription`

### Agent
- `id` (PK)
- `organizationId` (FK)
- `name`, `description`, `role` (max 400 chars)
- `status` (DRAFT, ACTIVE, PAUSED, ARCHIVED)
- `model` (CLAUDE_OPUS, GPT_4O, etc)
- `systemPrompt`, `tools[]`
- `isRunning`, `lastRun`, `nextRun`
- Relations: `organization`, `tasks[]`

### Task
- `id` (PK)
- `organizationId`, `agentId` (FKs)
- `prompt`, `output`
- `status` (PENDING, RUNNING, COMPLETED, FAILED)
- `duration` (ms)
- `createdAt`

### Integration
- `id` (PK)
- `organizationId` (FK)
- `provider` (SLACK, DISCORD, HUBSPOT, etc)
- `name`, `credentials` (encrypted)
- `status`, `connectedAt`

### Subscription
- `id` (PK)
- `organizationId` (1:1)
- `tier` (RECRUIT, OPERATOR, EMPIRE)
- `status` (active, trialing, past_due, canceled)
- `maxAgents`, `maxConnectors`, `maxModels`, `monthlyRunLimit`
- `stripeCustomerId`, `stripeSubId` (for Phase 4)
- `currentPeriodEnd`

---

## Frontend Components

### Layout Hierarchy
```
RootLayout (app/layout.tsx)
  ├─ ClerkProvider (auth wrapper)
  ├─ TRPCProvider (type-safe API client)
  └─ Html
     ├─ (marketing) routes (public)
     ├─ (auth) routes (sign-in/up pages)
     └─ (app) layout
        ├─ Sidebar (navigation, active route highlighting)
        ├─ Main content
        └─ Dashboard, Agents, Integrations, Tasks, Billing pages
```

### Design System (components/ui/)
- `button.tsx` — CVA-based variants (primary, secondary, outline)
- `card.tsx` — Glass morphism surface
- `badge.tsx` — Status indicators (success, error, warning, primary)
- `input.tsx` — Form input with label
- `stat-card.tsx` — Metric display with icon + value

All use Tailwind with design tokens from `tailwind.config.ts`.

---

## Data Flow Example: Create Agent

```
User fills form:
  name: "Sales Bot"
  role: "Handle customer inquiries"
  model: "CLAUDE_OPUS"
  
User clicks "Create Agent"
  ↓
Form calls: trpc.agents.create.useMutation()
  ↓
tRPC Client sends POST /api/trpc with:
  {
    jsonrpc: "2.0",
    method: "agents.create",
    params: { input: {...} }
  }
  + Clerk session in cookies (credentials: 'include')
  ↓
tRPC Server: server/routers/agents.ts
  ├─ createContext() extracts userId from Clerk
  ├─ Looks up User.organizations[0].id → orgId
  ├─ isAuthed middleware checks orgId exists (if null → UNAUTHORIZED)
  ├─ Input validation (Zod)
  ├─ Prisma creates Agent with organizationId
  └─ Returns agent object
  ↓
tRPC Client:
  ├─ onSuccess callback invalidates agents.list query
  ├─ Fresh query refetches agent list from server
  ├─ UI updates with new agent
```

---

## Error Handling

### UNAUTHORIZED
Thrown by `isAuthed` middleware when `!ctx.orgId`.
```
Cause: User has no organization
Fix: First API call auto-creates org via createContext()
```

### Validation Errors
Thrown by Zod schema validation.
```
Example: role.max(400) 
→ "Too big: expected string to have <=100 characters"
Fix: Send shorter string or increase limit in schema
```

### Database Errors
Thrown by Prisma.
```
Example: unique constraint on email
Fix: Use unique identifier or handle in mutation
```

---

## Type Safety Flow

```
Database Schema (schema.prisma)
  ↓ Prisma generates TypeScript types
Prisma Client (node_modules/@prisma/client)
  ↓ Used in tRPC routers
tRPC Router (server/routers/agents.ts)
  ↓ Zod validates input, defines output type
tRPC AppRouter (server/routers/_app.ts)
  ↓ Combines all routers
tRPC Type Export (type AppRouter)
  ↓ Sent to frontend
React Query + tRPC Client (lib/trpc.ts)
  ↓ Fully typed hooks (useQuery, useMutation)
Components (app/dashboard/*.tsx)
  ↓ trpc.agents.list.useQuery() ← IntelliSense complete
```

---

## Performance Optimizations

### React Query Caching
- Mutations invalidate related queries
- Stale-while-revalidate for dashboard stats
- Batch requests via httpBatchLink

### Database Indexing
- Indexes on `organizationId` for filtering
- Indexes on `clerkId` for user lookup

### Next.js
- Image optimization
- Code splitting per route
- ISR for marketing pages (future)

---

## Security

### Authentication
- Clerk handles session management
- Proxy middleware (`proxy.ts`) validates requests
- Session tokens in secure HTTP-only cookies

### Authorization
- Organization context ensures data isolation
- All queries filter by `organizationId`
- No cross-org data leakage

### Secrets
- API keys in `.env.local` (not committed)
- Clerk keys for test environment
- Database password in Neon URL

---

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Update Clerk production keys
- [ ] Update DATABASE_URL to production Neon cluster
- [ ] Deploy to Vercel
- [ ] Update Clerk allowed origins
- [ ] Test sign-up → agent creation flow
- [ ] Enable HTTPS
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure Stripe (Phase 4)

---

## Next Steps (Phase 4+)

1. **AI Engine**: Wire LangChain for agent execution
2. **Model Routing**: Support multiple LLM providers
3. **Integrations**: Implement OAuth flows (Slack, HubSpot, etc)
4. **Job Queue**: Use Inngest for durable execution
5. **Payments**: Complete Stripe integration
6. **Memory**: Vector DB for agent conversation history
