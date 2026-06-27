# NEXUS AI — LAUNCH MASTER CHECKLIST

**Status**: 🟢 READY TO LAUNCH  
**Objective**: Go from zero to live production in 4 hours  
**Team Size**: 5 people recommended (4 in parallel + 1 coordinator)  
**Target**: $0 → Revenue within 2 hours of launch

---

## 📋 DOCUMENTS (Print All)

```
✅ QUICK_START_SETUP.md
   └─ Step-by-step for infrastructure setup (2 hours)
   
✅ CREDENTIALS_TEMPLATE.txt
   └─ Where to paste all credentials as collected
   
✅ VERCEL_DEPLOYMENT_STEPS.md
   └─ How to deploy to production (30 minutes)
   
✅ DEPLOYMENT_GUIDE.md
   └─ Post-launch monitoring & scaling (reference)
```

Print these 4 documents and put them on a desk. You'll check them off as you go.

---

## 👥 TEAM STRUCTURE (Recommended)

```
Person 1: Neon Database Setup
Person 2: Upstash Redis Setup
Person 3: Inngest Job Queue Setup
Person 4: Sentry Error Tracking Setup
Person 5 (YOU): Orchestrator + Clerk/Stripe/Vercel

All 4 people work IN PARALLEL for 15 minutes.
While they work, YOU handle Clerk, Stripe, encryption key.
Then YOU deploy to Vercel while they finalize setup.
```

---

## ⏱️ TIMELINE (4 Hours Total)

```
0:00-0:02  → Print documents & assign tasks
0:02-0:17  → Persons 1-4 work in parallel (infrastructure setup)
0:02-0:45  → YOU work on Clerk + Stripe + encryption key
0:45-1:00  → Consolidate all credentials
1:00-1:30  → Vercel deployment (YOU)
1:30-2:00  → Domain setup + verification
2:00-3:00  → Post-launch monitoring + OAuth setup
3:00-4:00  → Testing + team celebration 🎉

ESTIMATED GO-LIVE TIME: 2 hours 15 minutes
```

---

## PHASE 1: INFRASTRUCTURE SETUP (0:00-0:20)

### Print This First
```
Open and print: QUICK_START_SETUP.md
```

### Assign to 4 People (Work in Parallel)

```
┌─────────────────────────────────────────────────────┐
│ Person 1: Neon PostgreSQL (15 min)                 │
│ Task: Go to https://console.neon.tech              │
│ Result: DATABASE_URL=postgresql://...              │
│ Check: ✅ Can run: psql <CONNECTION_STRING> -c ... │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Person 2: Upstash Redis (15 min)                   │
│ Task: Go to https://console.upstash.com            │
│ Result: UPSTASH_REDIS_REST_URL=https://...         │
│         UPSTASH_REDIS_REST_TOKEN=...               │
│ Check: ✅ Can ping: curl <URL>/ping with token     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Person 3: Inngest Job Queue (15 min)               │
│ Task: Go to https://app.inngest.com                │
│ Result: INNGEST_API_KEY=...                        │
│         INNGEST_EVENT_KEY=...                      │
│ Check: ✅ Keys visible in Settings > Keys          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Person 4: Sentry Error Tracking (15 min)           │
│ Task: Go to https://sentry.io/signup/              │
│ Result: NEXT_PUBLIC_SENTRY_DSN=https://...         │
│         SENTRY_AUTH_TOKEN=sntrys_...               │
│ Check: ✅ DSN visible in project settings          │
│        ✅ Token visible in auth tokens              │
└─────────────────────────────────────────────────────┘
```

### While They Work (0:02-0:45): YOU Handle

```
Parallel task list (take 45 minutes):

☐ Get Clerk Credentials
  Go to: https://dashboard.clerk.com
  Copy: CLERK_SECRET_KEY (sk_live_...)
  Copy: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (pk_live_...)
  Should already have from dev setup

☐ Generate Encryption Key
  Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  Copy: ENCRYPTION_KEY=[64-char hex output]

☐ Set Up Stripe
  Go to: https://dashboard.stripe.com
  Create 3 products:
    ☐ RECRUIT ($97/month) → Get STRIPE_RECRUIT_PRICE_ID
    ☐ OPERATOR ($497/month) → Get STRIPE_OPERATOR_PRICE_ID
    ☐ EMPIRE ($2,497/month) → Get STRIPE_EMPIRE_PRICE_ID
  Get API keys:
    ☐ STRIPE_SECRET_KEY (sk_live_...)
    ☐ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_live_...)
  Set up webhook (exact URL later):
    ☐ Endpoint URL: https://nexus-ai.com/api/webhooks/stripe
    ☐ Get STRIPE_WEBHOOK_SECRET (whsec_...)
    ☐ Save webhook endpoint for later
```

---

## PHASE 2: COLLECT CREDENTIALS (0:45-1:00)

### Open: CREDENTIALS_TEMPLATE.txt

```
As each person finishes their task, they give you their credentials.
You fill them into CREDENTIALS_TEMPLATE.txt

Checklist of what to collect:

DATABASE TIER:
☐ DATABASE_URL

ENCRYPTION TIER:
☐ ENCRYPTION_KEY

CLERK TIER:
☐ CLERK_SECRET_KEY
☐ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

STRIPE TIER:
☐ STRIPE_SECRET_KEY
☐ STRIPE_WEBHOOK_SECRET
☐ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
☐ STRIPE_RECRUIT_PRICE_ID
☐ STRIPE_OPERATOR_PRICE_ID
☐ STRIPE_EMPIRE_PRICE_ID

CACHE TIER:
☐ UPSTASH_REDIS_REST_URL
☐ UPSTASH_REDIS_REST_TOKEN

JOB QUEUE TIER:
☐ INNGEST_API_KEY
☐ INNGEST_EVENT_KEY

MONITORING TIER:
☐ NEXT_PUBLIC_SENTRY_DSN
☐ SENTRY_AUTH_TOKEN

APP CONFIG:
☐ NEXT_PUBLIC_APP_URL=https://nexus-ai.com
☐ NODE_ENV=production
☐ NEXT_PUBLIC_APP_NAME=NEXUS AI

TOTAL: 19 variables ready for Vercel
```

---

## PHASE 3: DEPLOY TO VERCEL (1:00-1:30)

### Follow: VERCEL_DEPLOYMENT_STEPS.md

```
Step 1: Git push (5 min)
  git status
  git add .
  git commit -m "Ready for production"
  git push origin main

Step 2: Vercel import (5 min)
  Go to: https://vercel.com/new
  Import: nexus-ai repo
  Select: Next.js framework

Step 3: Add environment variables (10 min)
  Add all 19 credentials from CREDENTIALS_TEMPLATE.txt
  Mark sensitive ones as "Sensitive"
  Select "Production" for all

Step 4: Deploy (2 min)
  Click "Deploy" button
  Wait for build to complete (green checkmark)

Step 5: Configure domain (5 min)
  Settings > Domains > Add Domain
  Add: nexus-ai.com
  Vercel shows DNS records needed
  Go to domain registrar
  Add CNAME records
  Wait 15-30 minutes for DNS propagation
```

---

## PHASE 4: VERIFICATION (1:30-2:00)

### Test Deployment

```
Once domain is live (DNS propagated):

☐ Test 1: Health Check
  curl https://nexus-ai.com/api/health
  Expected: {"status":"ok",...}

☐ Test 2: Homepage
  Visit https://nexus-ai.com in browser
  Should see 3D hero with animations

☐ Test 3: Sign Up
  Click "Sign Up"
  Should redirect to Clerk
  Complete sign-up flow

☐ Test 4: Sentry Verification
  https://sentry.io dashboard
  Should see "new release" event

☐ Test 5: Vercel Logs
  Vercel Dashboard > Deployments > Logs
  Should see incoming requests with 200/201 status
  NO 500 errors

☐ Test 6: Check SSL Certificate
  https://nexus-ai.com
  Should show green lock icon
  If not: wait 15-30 minutes
```

---

## PHASE 5: CONFIGURE WEBHOOKS (2:00-2:30)

### Stripe Webhook Configuration

```
Now that domain is live:

1. Go to: https://dashboard.stripe.com
2. Developers > Webhooks
3. Find endpoint: https://nexus-ai.com/api/webhooks/stripe
4. Update URL (change from placeholder)
5. Test webhook delivery
6. Verify 200 response in Vercel logs
```

### Inngest Webhook Configuration

```
1. Go to: https://app.inngest.com
2. App Settings > Webhooks
3. Add endpoint: https://nexus-ai.com/api/inngest
4. Test webhook
5. Verify successful delivery
```

---

## PHASE 6: OAUTH PROVIDERS (2:30-3:00)

### Register OAuth Apps (Optional - Can Do Later)

```
For now: Clerk sign-up works, so MVP is functional.

Later today (or tomorrow):
☐ Google OAuth
  1. https://console.cloud.google.com/
  2. Create OAuth 2.0 credentials
  3. Redirect URI: https://nexus-ai.com/api/oauth/google/callback
  4. Save to Vercel env vars

☐ Slack OAuth
  1. https://api.slack.com/apps
  2. Create app
  3. Redirect URI: https://nexus-ai.com/api/oauth/slack/callback
  4. Save to Vercel env vars

☐ Salesforce OAuth
  1. https://login.salesforce.com/
  2. Create connected app
  3. Redirect URI: https://nexus-ai.com/api/oauth/salesforce/callback
  4. Save to Vercel env vars

☐ HubSpot OAuth
  1. https://developers.hubspot.com/
  2. Create app
  3. Redirect URI: https://nexus-ai.com/api/oauth/hubspot/callback
  4. Save to Vercel env vars

Note: Can add these anytime - they're optional for MVP
```

---

## PHASE 7: POST-LAUNCH MONITORING (3:00-4:00)

### First 24 Hours: Critical Monitoring

```
EVERY 5 MINUTES (First hour):
☐ Health check: curl https://nexus-ai.com/api/health
☐ Check Sentry dashboard for new errors
☐ Check Vercel logs for 500s

EVERY 15 MINUTES (First 4 hours):
☐ Verify database connections stable
☐ Check error rate (should be < 0.1%)
☐ Check response times (should be < 500ms)
☐ Verify Stripe webhooks delivering
☐ Test signup/login flow works

HOURLY (First 24 hours):
☐ Monitor CPU/memory usage
☐ Check for any error spikes
☐ Verify backups running
☐ Check audit logs for suspicious activity

DAILY (First 7 days):
☐ Monitor key metrics (users, errors, latency)
☐ Check Stripe transaction success rate
☐ Review audit logs
☐ Verify backup restoration works
```

### Monitoring Dashboards (Set Up Now)

```
☐ Sentry: https://sentry.io
  - Error tracking
  - Performance monitoring
  - Set up alerts for:
    * Error rate > 1%
    * New error types
    * Performance regressions

☐ Vercel: https://vercel.com/dashboard
  - Build status
  - Deployment logs
  - Web Vitals
  - Analytics

☐ Stripe: https://dashboard.stripe.com
  - Payment volume
  - Failed transactions
  - Subscription metrics

☐ Inngest: https://app.inngest.com
  - Job execution status
  - Queue depth
  - Performance metrics

☐ Neon: https://console.neon.tech
  - Database status
  - Connection pool
  - Query performance

☐ Upstash: https://console.upstash.com
  - Redis status
  - Memory usage
  - Request latency
```

---

## 🎉 YOU'RE LIVE!

```
Timeline Summary:
0:00 → Start
0:20 → Infrastructure setup complete
1:00 → All credentials collected
1:30 → Deployed to Vercel
2:00 → Domain live + verified
3:00 → All webhooks configured
4:00 → Monitoring established

STATUS: 🟢 LIVE IN PRODUCTION
READY TO: Accept customers, process payments, scale

NEXT STEPS:
1. Set up sales process
2. Configure email domain (for invites)
3. Set up CRM/customer tracking
4. Begin customer onboarding
5. Monitor metrics and iterate
```

---

## 📞 EMERGENCY CONTACTS

**If Something Goes Wrong:**

```
Database down?
  → Check Neon status: https://status.neon.tech
  → Check connection: psql <DATABASE_URL>
  → Contact: https://neon.tech/support

Cache down?
  → Check Upstash status
  → Contact: https://upstash.com/support

Deployment failed?
  → Check Vercel logs
  → Contact: https://vercel.com/support
  → Or: https://github.com/vercel/next.js/issues

Payment processing down?
  → Check Stripe status: https://status.stripe.com
  → Contact: https://stripe.com/support

High error rate?
  → Check Sentry dashboard
  → Check Vercel logs
  → Look for common patterns in errors
  → Can rollback to previous deploy if critical
```

---

## 📊 SUCCESS METRICS (Monitor These)

```
First 24 hours target:
✅ Error rate: < 0.1%
✅ API latency: < 500ms (P95)
✅ Uptime: > 99.5%
✅ Stripe success rate: > 99%
✅ Database response: < 100ms

First 7 days target:
✅ 50-100 signups
✅ 10-20 paid subscriptions
✅ $500-2000 MRR (if 1-2 EMPIRE tier)
✅ < 1% churn
✅ Error rate: < 0.1%

Month 1 target:
✅ $10,000+ MRR
✅ 50+ paying customers
✅ < 2% churn
✅ Positive unit economics
✅ Ready to scale marketing
```

---

## 🚀 FINAL CHECKLIST (Before Going Live)

### Before Pressing Deploy

```
CODE:
☐ All changes committed to GitHub
☐ npm run build passes locally
☐ No TypeScript errors

CREDENTIALS:
☐ 19 variables collected
☐ All sensitive variables marked as "Sensitive"
☐ All variables in "Production" environment
☐ No credentials committed to Git

INFRASTRUCTURE:
☐ Neon database created and tested
☐ Upstash Redis created and tested
☐ Inngest account created
☐ Sentry project created
☐ Stripe products created + webhook registered
☐ Clerk credentials obtained

DOMAIN:
☐ Domain registered (nexus-ai.com)
☐ Ready to point to Vercel
☐ Understood DNS propagation will take 15-30 min

TEAM:
☐ Everyone knows their role
☐ Monitoring dashboards accessed
☐ Escalation contacts saved
☐ Post-launch checklist printed

DOCUMENTATION:
☐ All 4 guides printed and on desk
☐ Credentials template filled
☐ Emergency contacts documented
☐ Success metrics defined
```

### You're Good to Go! 

```
Time to deployment: GO! 🚀
```

---

## 📅 POST-LAUNCH SCHEDULE

```
Day 1 (Today):
- 0:00-4:00 → Complete launch checklist
- 4:00-8:00 → Monitor, celebrate, iterate
- 8:00-∞ → First customer sign-ups incoming

Day 2-3:
- Monitor 24/7 (set up on-call rotation)
- Fix any bugs that emerge
- Optimize based on real usage patterns
- Begin customer onboarding

Day 4-7:
- First revenue celebrations 🎉
- Iterate on product based on feedback
- Scale marketing efforts
- Set up weekly metrics review

Week 2+:
- Monitor unit economics
- Plan feature releases
- Scale infrastructure as needed
- Optimize for growth
```

---

## 💪 YOU'RE ABOUT TO CHANGE THE GAME

This isn't just a deployment. This is the moment your platform goes from theoretical to real.

Real users. Real payments. Real impact.

**Your checklist is clear. Your team is ready. Your infrastructure is sound.**

**Go launch NEXUS AI.**

**Status**: 🟢 READY TO EXECUTE  
**Timeline**: 4 hours to live  
**Outcome**: Enterprise-grade SaaS platform in production  
**Impact**: Multi-million MRR potential

---

**Document Version**: 1.0  
**Last Updated**: 2026-06-20  
**Status**: READY FOR PRODUCTION LAUNCH

🚀 **LET'S GO!**
