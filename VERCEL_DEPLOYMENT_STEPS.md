# VERCEL DEPLOYMENT — Step-by-Step (30 Minutes)

**Prerequisites**: All credentials collected in `CREDENTIALS_TEMPLATE.txt`  
**Time**: 30 minutes  
**Result**: Live at https://nexus-ai.com

---

## Step 1: Prepare GitHub Repository (5 min)

```bash
# In your terminal:
cd /Users/sm/nexus-ai

# Ensure all changes are committed
git status
# Should show: "nothing to commit, working tree clean"

# If you see changes:
git add .
git commit -m "Pre-production: implement monitoring, security, deployment config"

# Push to GitHub main branch
git push origin main
```

---

## Step 2: Connect to Vercel (5 min)

```
1. Go to: https://vercel.com/new
   (If not logged in, click "Log in" and sign up with GitHub)

2. Find your repository:
   Search box at top: "nexus-ai"
   Should appear with your GitHub org

3. Click your repo to import

4. Framework preset: 
   Should auto-detect "Next.js"
   ✅ If yes, continue
   ❌ If no, select "Next.js" from dropdown

5. Project settings:
   Project name: nexus-ai
   Root directory: ./ (default)
   ✅ Don't need to override build/start commands
   ✅ Don't need to override output directory

6. Click "Import"
   (Vercel will create the project and show next screen)
```

---

## Step 3: Add Environment Variables (10 min)

```
After import, Vercel shows "Environment Variables" step.

You'll see a form with "Key" and "Value" columns.

IMPORTANT: Before filling in, check these 3 boxes:
☑️ Sensitive (for secrets)
☑️ Production
☑️ Preview (leave unchecked for now)

Add ALL 15+ credentials from CREDENTIALS_TEMPLATE.txt:

1. DATABASE_URL
   Value: [from Neon]
   ✅ Mark as Sensitive
   ✅ Select Production

2. ENCRYPTION_KEY
   Value: [64 hex characters]
   ✅ Mark as Sensitive
   ✅ Select Production

3. CLERK_SECRET_KEY
   Value: [from Clerk]
   ✅ Mark as Sensitive
   ✅ Select Production

4. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   Value: [from Clerk]
   ☐ NOT sensitive (public)
   ✅ Select Production

5. STRIPE_SECRET_KEY
   Value: [from Stripe]
   ✅ Mark as Sensitive
   ✅ Select Production

6. STRIPE_WEBHOOK_SECRET
   Value: [from Stripe webhooks]
   ✅ Mark as Sensitive
   ✅ Select Production

7. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   Value: [from Stripe]
   ☐ NOT sensitive (public)
   ✅ Select Production

8. STRIPE_RECRUIT_PRICE_ID
   Value: price_... (from Stripe products)
   ☐ NOT sensitive
   ✅ Select Production

9. STRIPE_OPERATOR_PRICE_ID
   Value: price_... (from Stripe products)
   ☐ NOT sensitive
   ✅ Select Production

10. STRIPE_EMPIRE_PRICE_ID
    Value: price_... (from Stripe products)
    ☐ NOT sensitive
    ✅ Select Production

11. UPSTASH_REDIS_REST_URL
    Value: https://...upstash.io
    ☐ NOT sensitive
    ✅ Select Production

12. UPSTASH_REDIS_REST_TOKEN
    Value: [from Upstash]
    ✅ Mark as Sensitive
    ✅ Select Production

13. INNGEST_API_KEY
    Value: [from Inngest]
    ✅ Mark as Sensitive
    ✅ Select Production

14. INNGEST_EVENT_KEY
    Value: [from Inngest]
    ✅ Mark as Sensitive
    ✅ Select Production

15. NEXT_PUBLIC_SENTRY_DSN
    Value: https://...@sentry.io/...
    ☐ NOT sensitive (public DSN)
    ✅ Select Production

16. SENTRY_AUTH_TOKEN
    Value: sntrys_... (from Sentry)
    ✅ Mark as Sensitive
    ✅ Select Production

17. NEXT_PUBLIC_APP_URL
    Value: https://nexus-ai.com
    ☐ NOT sensitive
    ✅ Select Production

18. NODE_ENV
    Value: production
    ☐ NOT sensitive
    ✅ Select Production

19. NEXT_PUBLIC_APP_NAME
    Value: NEXUS AI
    ☐ NOT sensitive
    ✅ Select Production

After adding each variable, click "Add another" or just continue typing.
```

---

## Step 4: Deploy (2 min)

```
After all variables added:

1. Scroll down
2. Click the blue "Deploy" button
3. Wait for deployment to complete:
   
   You'll see:
   ✓ Building...
   ✓ Optimizing...
   ✓ Finalizing...
   ✓ Generating...
   
   This typically takes 2-3 minutes

4. When complete, you'll see green checkmark:
   "Deployment successful!"
   with a preview link
```

---

## Step 5: Configure Custom Domain (5 min)

```
After deployment succeeds:

1. Click "Continue to Dashboard"
2. You're now in your Vercel project
3. Click "Settings" (top navigation)
4. Click "Domains" (left sidebar)
5. Click "Add Domain"
6. Enter: nexus-ai.com
7. Vercel shows DNS configuration needed:
   
   Add these CNAME records to your domain registrar:
   - www.nexus-ai.com → cname.vercel.com
   
   Or if using root domain:
   - nexus-ai.com → your-project.vercel.app

8. Go to your domain registrar (GoDaddy, Namecheap, etc.)
9. Add the DNS records shown
10. Wait 15-30 minutes for DNS propagation
11. Vercel will show "Verified" when DNS is active
```

---

## Step 6: Verify Deployment (3 min)

```
After DNS is active (usually 15-30 min):

Test 1: Health Check
   curl https://nexus-ai.com/api/health
   
   Expected output:
   {
     "status": "ok",
     "timestamp": "2026-06-20T...",
     "services": {
       "database": {"status": "ok", "latency": 45},
       "cache": {"status": "ok"}
     },
     "uptime": ...
   }

Test 2: Homepage
   Open https://nexus-ai.com in browser
   Should load homepage with 3D effects

Test 3: Authentication
   Click "Sign up" → test Clerk auth flow
   Should redirect to Clerk sign-up

Test 4: Check Sentry
   Go to https://sentry.io dashboard
   You should see "new release" event showing deployment
   This confirms source maps uploaded correctly

Test 5: Monitor Logs
   Vercel Dashboard > Deployments > Logs
   Should see requests coming in with 200/201 status codes
   No 500 errors
```

---

## Step 7: Set Up Stripe Webhook (2 min - After Domain is Live)

```
Now that you have live domain:

1. Go to Stripe Dashboard: https://dashboard.stripe.com
2. Click "Developers" (top right)
3. Click "Webhooks" (left sidebar)
4. You should see endpoint you created:
   https://nexus-ai.com/api/webhooks/stripe (PENDING)

5. Click on it to edit
6. Change URL from placeholder to live URL:
   https://nexus-ai.com/api/webhooks/stripe

7. Events to listen to (add if not already there):
   ✅ customer.subscription.created
   ✅ customer.subscription.updated
   ✅ customer.subscription.deleted
   ✅ invoice.payment_succeeded
   ✅ invoice.payment_failed

8. Click "Update endpoint"
9. Test webhook:
   In Stripe dashboard, click "Send test webhook"
   Check Vercel logs to see webhook received (200 response)
```

---

## Step 8: Set Up Inngest Webhook (2 min - After Domain is Live)

```
Now that you have live domain:

1. Go to Inngest Dashboard: https://app.inngest.com
2. Click "App Settings" (for your nexus-ai app)
3. Click "Webhooks" (if available)
4. Add webhook endpoint:
   URL: https://nexus-ai.com/api/inngest
   Events: All events (or select specific ones)

5. Save

6. Test webhook:
   In Inngest console, trigger a test event
   Check that it appears in logs
```

---

## 🎉 DEPLOYMENT COMPLETE!

Your app is now live!

```
✅ https://nexus-ai.com — Homepage
✅ https://nexus-ai.com/api/health — Health check
✅ https://nexus-ai.com/sign-up — Sign up with Clerk
✅ Error tracking in Sentry dashboard
✅ Webhook integration with Stripe
✅ Job queue with Inngest
✅ Analytics with PostHog (if configured)
```

---

## Post-Deployment Checklist

After going live, monitor for 24 hours:

```
Hour 1:
☐ Health check endpoint returning 200
☐ Homepage loads without errors
☐ No error spike in Sentry
☐ Database connections stable

Hour 1-4:
☐ Test signup → Clerk → dashboard flow
☐ Test agent creation flow
☐ Monitor error rate (target: < 0.1%)
☐ Check response latency (target: < 500ms)

Hour 4-24:
☐ Monitor Stripe webhook deliveries
☐ Check database backup triggers
☐ Review audit logs for suspicious activity
☐ Verify SSL certificate working (green lock icon)

Day 2-7:
☐ Monitor key metrics (MRR, users, errors)
☐ Test incident response procedures
☐ Verify backup restoration works
☐ Load test if needed
```

---

## Troubleshooting

### Deployment Failed

```
Common issues:

1. TypeScript error:
   Solution: Check npm run build locally
   Then: git push origin main (Vercel will retry)

2. Environment variable missing:
   Solution: Check Vercel > Settings > Environment Variables
   Make sure variable name matches exactly
   Then: Redeploy from Vercel dashboard

3. Build timeout:
   Solution: This is rare
   Check Vercel build logs for specific error
   Contact Vercel support if persists
```

### Deployment Succeeded But Site Not Working

```
1. Check health endpoint:
   curl https://nexus-ai.com/api/health
   
   If 503: Database connection issue
   - Check DATABASE_URL in Vercel env vars
   - Verify Neon project is running
   - Test connection: psql <DATABASE_URL>

2. Check Vercel logs:
   Vercel Dashboard > Deployments > Recent > Logs
   Look for errors

3. Check Sentry:
   Sentry Dashboard > Issues
   Look for error messages

4. Check DNS:
   nslookup nexus-ai.com
   Should resolve to Vercel IP

5. Check SSL certificate:
   Visit https://nexus-ai.com
   Should see green lock icon
   If not: wait 15-30 min for certificate to generate
```

### OAuth Redirect URIs Not Set Up Yet

```
If you haven't set up Google, Slack, etc. OAuth yet:

1. Don't worry - everything else works
2. Sign in via Clerk works (Clerk is already set up)
3. Agent creation works
4. Subscriptions work

Set up OAuth after you confirm:
- Domain is live (DNS working)
- Site is accessible
- Health check passes

Then:
1. Go to each OAuth provider (Google, Slack, etc.)
2. Register your app
3. Set redirect URIs to: https://nexus-ai.com/api/oauth/[provider]/callback
4. Copy credentials
5. Add to Vercel env vars
6. Redeploy (or just update env vars)
```

---

## Next: Configure OAuth Providers (Same Day)

Once domain is live and confirmed working:

```
1. Google Workspace OAuth
   - Go to https://console.cloud.google.com/
   - Create OAuth 2.0 credentials
   - Redirect URI: https://nexus-ai.com/api/oauth/google/callback
   - Save GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
   - Add to Vercel env vars

2. Slack OAuth
   - Go to https://api.slack.com/apps
   - Create new app
   - Redirect URI: https://nexus-ai.com/api/oauth/slack/callback
   - Save SLACK_CLIENT_ID and SLACK_CLIENT_SECRET
   - Add to Vercel env vars

3. Salesforce OAuth
   - Go to https://login.salesforce.com/
   - Create connected app
   - Redirect URI: https://nexus-ai.com/api/oauth/salesforce/callback
   - Save SALESFORCE_CLIENT_ID and SALESFORCE_CLIENT_SECRET
   - Add to Vercel env vars

4. HubSpot OAuth
   - Go to https://developers.hubspot.com/
   - Create app
   - Redirect URI: https://nexus-ai.com/api/oauth/hubspot/callback
   - Save HUBSPOT_CLIENT_ID and HUBSPOT_CLIENT_SECRET
   - Add to Vercel env vars
```

---

## 🚀 You're Live!

**Timeline Summary:**
- 0:00 - 0:05 → Push to GitHub + Vercel import
- 0:05 - 0:15 → Add environment variables
- 0:15 - 0:17 → Deploy
- 0:17 - 0:32 → DNS configuration (waiting for propagation)
- 0:32 - 0:35 → Verification tests

**Total Time**: 30-35 minutes from start to live production environment.

**Status**: 🟢 **LIVE & OPERATIONAL**

---

**Last Updated**: 2026-06-20 | **Document Version**: 1.0
