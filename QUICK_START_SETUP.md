# NEXUS AI — Quick Start Setup (2-Hour Launch)

**Objective**: Get all 4 critical services configured in parallel  
**Time Estimate**: 2 hours total (can be done by 4 people simultaneously)  
**Result**: All credentials ready to paste into Vercel

---

## 👥 Parallel Setup (Assign to 4 Team Members)

| Person | Task | Time | URL |
|--------|------|------|-----|
| **Person 1** | Neon Database | 15 min | https://console.neon.tech |
| **Person 2** | Upstash Redis | 15 min | https://console.upstash.com |
| **Person 3** | Inngest Job Queue | 15 min | https://app.inngest.com |
| **Person 4** | Sentry Error Tracking | 15 min | https://sentry.io |

**While these 4 work in parallel (15 min):**
- You handle Clerk (already integrated - just get keys)
- You handle Stripe (create price tiers)
- You handle OAuth providers (Google, Slack, Salesforce, HubSpot)

**Total time**: 2 hours, 1 person can do it all in 1 hour if needed.

---

# TASK 1: NEON POSTGRESQL DATABASE (Person 1)

## Step 1: Sign Up

```
👉 Go to: https://console.neon.tech/app/sign_up
   Email: your-team@nexus-ai.com
   Password: Strong password (save in 1Password)
   Accept terms
   Click "Sign up"
```

## Step 2: Create Project

```
After sign-up, you'll see "Create a project"
1. Click "Create a project"
2. Project name: "nexus-ai-production"
3. Database name: "nexus" (default)
4. Region: 
   - US: us-east-1 (lowest latency for North America)
   - EU: eu-central-1 (GDPR compliant for EU users)
   SELECT: US (unless you have EU mandate)
5. PostgreSQL version: 15 (default, recommended)
6. Click "Create project"
```

## Step 3: Get Connection String

```
After project created, you'll see the connection string at top.

Format will be:
postgresql://neon_user:password@db-name.neon.tech:5432/nexus?sslmode=require

⚠️  SAVE THIS IMMEDIATELY to 1Password or secure note:
   Label: DATABASE_URL (Production)
   Value: [Copy entire connection string]
```

## Step 4: Enable Connection Pooling

```
In Neon console:
1. Click "Connection pooling" (left sidebar)
2. Toggle "Enable connection pooling" ON
3. Pool size: 25 (default is fine)
4. Click "Save"
```

## Step 5: Verify Connection

```
In your terminal (if psql installed):
psql "postgresql://neon_user:password@db-name.neon.tech:5432/nexus?sslmode=require" -c "SELECT version();"

Expected output: "PostgreSQL 15.x on..."

If error: Check password, ensure connection string copied correctly
```

## ✅ Task 1 Complete

**Save to credentials file**:
```
DATABASE_URL=postgresql://neon_user:password@db-name.neon.tech:5432/nexus?sslmode=require
```

---

# TASK 2: UPSTASH REDIS CACHE (Person 2)

## Step 1: Sign Up

```
👉 Go to: https://console.upstash.com/signin
   Email: your-team@nexus-ai.com
   Password: Strong password (save in 1Password)
   Accept terms
   Click "Sign up"
```

## Step 2: Create Redis Database

```
After sign-up:
1. Click "Create Database" (red button, top right)
2. Name: "nexus-ai-cache"
3. Region: 
   - US: us-east-1 (default, good latency)
   - Global: for lowest latency everywhere
   SELECT: us-east-1
4. Eviction: allkeys-lru (default)
5. TLS: Enabled (default, security)
6. Click "Create"
```

## Step 3: Get REST API Credentials

```
After creation, you'll see database details:

Copy these values to 1Password:
Label: UPSTASH_REDIS (Production)

UPSTASH_REDIS_REST_URL=https://[region]-[name]-[number].upstash.io
UPSTASH_REDIS_REST_TOKEN=AYjc1YtASzz8...

You'll see them in the "REST API" section
Click to copy each value
```

## Step 4: Verify Connection

```
In your terminal:
curl --request GET \
  --url https://[region]-[name]-[number].upstash.io/ping \
  --header "Authorization: Bearer [TOKEN]"

Expected output: "PONG"

If error: Check URL and token exactly match
```

## ✅ Task 2 Complete

**Save to credentials file**:
```
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=AYjc1YtASzz8...
```

---

# TASK 3: INNGEST JOB QUEUE (Person 3)

## Step 1: Sign Up

```
👉 Go to: https://app.inngest.com/sign-up
   Email: your-team@nexus-ai.com
   Password: Strong password (save in 1Password)
   Accept terms
   Click "Sign up"
```

## Step 2: Create Organization

```
After sign-up:
1. Organization name: "NEXUS AI"
2. Website: https://nexus-ai.com
3. Role: Developer
4. Click "Create organization"
```

## Step 3: Create App Environment

```
In Inngest console:
1. Click "Apps" (left sidebar)
2. Click "Create app"
3. App name: "nexus-ai-production"
4. Environment: "Production"
5. Click "Create"
```

## Step 4: Get API Keys

```
After creation, click "Settings" (gear icon, top right):

Copy both values to 1Password:
Label: INNGEST (Production)

INNGEST_API_KEY=[Your API Key]
INNGEST_EVENT_KEY=[Your Event Key]

They're shown under "Keys" section
Click each to reveal and copy
```

## Step 5: Configure Webhook Endpoint

```
We'll do this AFTER deploying to Vercel.

For now, save this note:
When deployed to Vercel with URL https://nexus-ai.com
Add webhook to Inngest:
- URL: https://nexus-ai.com/api/inngest
- Events: All events
- This is done in Inngest dashboard later
```

## ✅ Task 3 Complete

**Save to credentials file**:
```
INNGEST_API_KEY=[Your API Key]
INNGEST_EVENT_KEY=[Your Event Key]
```

---

# TASK 4: SENTRY ERROR TRACKING (Person 4)

## Step 1: Sign Up

```
👉 Go to: https://sentry.io/signup/
   Email: your-team@nexus-ai.com
   Password: Strong password (save in 1Password)
   Create free account (can upgrade later)
```

## Step 2: Create Organization

```
After sign-up, you'll be prompted for organization:
1. Organization name: "NEXUS AI"
2. Time zone: Your timezone
3. Click "Create organization"
```

## Step 3: Create Project

```
After organization created:
1. Click "Create Project"
2. Platform: "Next.js"
3. Alert me on every new issue: Toggle OFF (too noisy initially)
4. Click "Create Project"
```

## Step 4: Get DSN

```
After project creation, you'll see the DSN prominently displayed:

https://[random]@sentry.io/[number]

Copy to 1Password:
Label: SENTRY (Production)

NEXT_PUBLIC_SENTRY_DSN=https://[random]@sentry.io/[number]
```

## Step 5: Generate Auth Token (for Source Maps)

```
In Sentry dashboard:
1. Click "Settings" (gear icon, bottom left)
2. Click "Auth Tokens" (left sidebar under API)
3. Click "Create New Token"
4. Name: "nexus-ai-vercel"
5. Scopes: Check "project:releases"
6. Click "Create"

Copy token (only shown once):
Label: SENTRY_AUTH_TOKEN

SENTRY_AUTH_TOKEN=sntrys_[rest of token]
```

## Step 6: Configure Upload Source Maps

```
In Sentry dashboard:
1. Click "Settings" (gear icon)
2. Click "Release Tracking"
3. Note the info (we'll configure this in Vercel)

For now, save this note:
- Vercel will automatically upload source maps
- Sentry will show readable stack traces with source code
```

## ✅ Task 4 Complete

**Save to credentials file**:
```
NEXT_PUBLIC_SENTRY_DSN=https://[random]@sentry.io/[number]
SENTRY_AUTH_TOKEN=sntrys_[rest of token]
```

---

# WHILE THOSE 4 WORK: YOU HANDLE THESE (15-30 min)

## CLERK AUTHENTICATION (Already Integrated)

```
👉 Go to: https://dashboard.clerk.com

You should already have Clerk set up from development.
Get these values:
- CLERK_SECRET_KEY=sk_live_...
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...

Already in your development .env.local - just copy to production list
```

## STRIPE PAYMENTS

```
👉 Go to: https://dashboard.stripe.com

1. Sign in with your Stripe account
2. Go to Products (left sidebar)
3. Create 3 products:

   RECRUIT ($97/month):
   - Name: "RECRUIT"
   - Price: $97 USD
   - Billing period: Monthly
   - Click "Create price"
   - SAVE: STRIPE_RECRUIT_PRICE_ID=price_...

   OPERATOR ($497/month):
   - Name: "OPERATOR"
   - Price: $497 USD
   - Billing period: Monthly
   - Click "Create price"
   - SAVE: STRIPE_OPERATOR_PRICE_ID=price_...

   EMPIRE ($2,497/month):
   - Name: "EMPIRE"
   - Price: $2,497 USD
   - Billing period: Monthly
   - Click "Create price"
   - SAVE: STRIPE_EMPIRE_PRICE_ID=price_...

4. Get API keys:
   - Go to "Developers" (top right)
   - Click "API keys"
   - SAVE: STRIPE_SECRET_KEY=sk_live_...
   - SAVE: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

5. Set up webhook:
   - Go to "Webhooks" (left sidebar)
   - Click "Add endpoint"
   - URL: https://nexus-ai.com/api/webhooks/stripe (we'll update after deploy)
   - Events: customer.subscription.created, customer.subscription.updated, 
             customer.subscription.deleted, invoice.payment_succeeded, 
             invoice.payment_failed
   - Click "Create endpoint"
   - SAVE: STRIPE_WEBHOOK_SECRET=whsec_... (shown in details)
```

## OAUTH PROVIDERS

**Skip for now** - you'll register these after confirming domain with Vercel.

For now, just note:
```
After Vercel deployment, you'll register:
- Google OAuth: https://console.cloud.google.com/
- Slack: https://api.slack.com/apps
- Salesforce: https://login.salesforce.com/
- HubSpot: https://developers.hubspot.com/

Redirect URIs will be:
- https://nexus-ai.com/api/oauth/google/callback
- https://nexus-ai.com/api/oauth/slack/callback
- https://nexus-ai.com/api/oauth/salesforce/callback
- https://nexus-ai.com/api/oauth/hubspot/callback
```

---

# ENCRYPTION KEY GENERATION

## Generate ENCRYPTION_KEY

```bash
# Run this command in your terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output: 64-character hex string (e.g., a1b2c3d4e5f6...)

SAVE: ENCRYPTION_KEY=[output from command]
```

---

# CONSOLIDATE ALL CREDENTIALS

## Master Credentials List

```
After all 4 tasks complete, you should have:

DATABASE:
DATABASE_URL=postgresql://...

ENCRYPTION:
ENCRYPTION_KEY=a1b2c3d4...

CLERK:
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...

STRIPE:
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_RECRUIT_PRICE_ID=price_...
STRIPE_OPERATOR_PRICE_ID=price_...
STRIPE_EMPIRE_PRICE_ID=price_...

CACHE:
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

JOB QUEUE:
INNGEST_API_KEY=...
INNGEST_EVENT_KEY=...

MONITORING:
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_...

APP:
NEXT_PUBLIC_APP_URL=https://nexus-ai.com
NODE_ENV=production
```

---

# NEXT: VERCEL DEPLOYMENT (30 minutes)

Once all credentials are collected:

```
1. Go to: https://vercel.com/new
2. Import GitHub repository
3. Select: Next.js framework
4. Add ALL environment variables above
5. Deploy!
6. Monitor deployment in Vercel dashboard
7. Verify: curl https://nexus-ai.com/api/health
```

---

# CHECKLIST: Print This & Check Off

```
INFRASTRUCTURE (15 min per person):
☐ Neon PostgreSQL created
  ☐ Connection string saved
  ☐ Connection pooling enabled

☐ Upstash Redis created
  ☐ REST URL saved
  ☐ REST Token saved

☐ Inngest account created
  ☐ API Key saved
  ☐ Event Key saved

☐ Sentry project created
  ☐ DSN saved
  ☐ Auth Token saved

CREDENTIALS (30 min):
☐ Clerk keys (from existing setup)
☐ Stripe account + 3 prices created
  ☐ RECRUIT price ID
  ☐ OPERATOR price ID
  ☐ EMPIRE price ID
  ☐ API keys saved
  ☐ Webhook endpoint added

☐ Encryption key generated (64 hex chars)

READY FOR DEPLOYMENT:
☐ All 15+ environment variables collected
☐ Credentials stored securely (1Password)
☐ Master list created
☐ Ready to add to Vercel

DEPLOYMENT:
☐ GitHub repository set up
☐ Vercel connected
☐ Environment variables added
☐ Deployed to production
☐ Health check verified
☐ Team celebrating 🎉
```

---

## Timeline

| Time | Task | Owner |
|------|------|-------|
| 0:00-0:15 | Neon + Upstash + Inngest + Sentry (parallel) | Persons 1-4 |
| 0:15-0:45 | Clerk + Stripe + Encryption key | You |
| 0:45-1:00 | Consolidate all credentials | You |
| 1:00-1:30 | Vercel setup + deployment | You |
| 1:30-2:00 | Verification + monitoring setup | You |
| **2:00** | **LIVE IN PRODUCTION** ✅ | 🎉 |

---

## Support During Setup

**If stuck on any step:**
1. Check the exact URL in this guide
2. Look for tooltips/help in the service dashboard
3. Service support links:
   - Neon: https://neon.tech/docs
   - Upstash: https://upstash.com/docs
   - Inngest: https://inngest.com/docs
   - Sentry: https://docs.sentry.io

**Common issues:**
- Connection string format wrong → copy exactly as shown
- Token not showing → refresh page and try again
- Password too weak → use 16+ chars with uppercase/numbers/symbols

---

## READY TO BEGIN?

✅ **Print this document**  
✅ **Assign 4 people to tasks 1-4**  
✅ **You handle 5-7 while they work**  
✅ **Reconvene in 2 hours with all credentials**  
✅ **Deploy to Vercel**  
✅ **Go live**

**Estimated time to revenue**: 2 hours from now.

---

**Last Updated**: 2026-06-20  
**Status**: 🟢 Ready to Execute
