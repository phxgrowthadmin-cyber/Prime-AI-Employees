# VERIFY DEPLOYMENT — Post-Launch Tests (10 minutes)

**Prerequisites**: 
- ✅ Deployed to Vercel
- ✅ Waiting for DNS (or domain is live)

**Time**: 10 minutes  
**What You're Testing**: All critical systems are working

---

## ⏱️ Timeline for DNS

After you configured domain in Vercel:

```
0-5 min:   DNS propagating...
5-15 min:  DNS propagating...
15-30 min: Usually live by now

While waiting, test on .vercel.app domain
```

---

## TEST 1: Health Check Endpoint ✅

**This tests: Database + Cache + API**

```bash
# If using .vercel.app domain (before DNS live):
curl https://nexus-ai.vercel.app/api/health

# If using custom domain (after DNS live):
curl https://nexus-ai.com/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-20T12:34:56.789Z",
  "services": {
    "database": {
      "status": "ok",
      "latency": 45
    },
    "cache": {
      "status": "ok"
    }
  },
  "uptime": 3600000
}
```

**If you see this**: ✅ Database and cache are connected  
**If you see error**: ❌ Check environment variables in Vercel

---

## TEST 2: Homepage Loads ✅

**This tests: Frontend rendering + assets**

```
1. Open browser: https://nexus-ai.vercel.app
   (or https://nexus-ai.com if domain is live)

2. You should see:
   ✅ 3D neural network animation
   ✅ "NEXUS AI" heading
   ✅ Feature cards
   ✅ Pricing section
   ✅ Call-to-action buttons

3. Check browser console (F12):
   ✅ No red error messages
   ✅ Some network requests should succeed (200 status)
   ✅ No 500 errors
```

**If you see this**: ✅ Frontend is working  
**If you see blank page or errors**: ❌ Check Vercel logs

---

## TEST 3: Sign-Up Flow ✅

**This tests: Clerk authentication**

```
1. Homepage > Click "Sign Up" button
2. Should redirect to Clerk sign-up page
3. Enter test email: test@example.com
4. Enter password
5. Click "Sign up"
6. Should redirect to dashboard
```

**If you see this**: ✅ Clerk authentication is working  
**If you see error**: ❌ Check CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY

---

## TEST 4: Sentry Verification ✅

**This tests: Error tracking is working**

```
1. Open your Sentry dashboard: https://sentry.io
2. Go to your NEXUS AI project
3. Look for "Releases" section
4. You should see a new release with deployment timestamp

This confirms source maps were uploaded correctly
and errors will be properly tracked
```

**If you see this**: ✅ Sentry error tracking is active  
**If you don't see release**: ⏳ Wait 2 minutes for upload to complete

---

## TEST 5: Check Vercel Logs ✅

**This tests: No unexpected errors in production**

```
1. Go to: https://vercel.com/dashboard
2. Click your nexus-ai project
3. Click "Deployments" 
4. Click your latest deployment
5. Click "Logs"

Look for:
✅ Requests with 200/201 status codes
✅ No repeated 500 errors
✅ No database connection errors
✅ No authentication errors
```

**If you see this**: ✅ API is handling requests correctly  
**If you see 500s**: ❌ Check specific error in logs and environment variables

---

## TEST 6: Stripe Webhook Registration ✅

**This tests: Webhook endpoint is configured**

```
Once your domain is live (or using .vercel.app):

1. Go to Stripe Dashboard: https://dashboard.stripe.com
2. Click "Developers" > "Webhooks"
3. You should see endpoint: https://nexus-ai.com/api/webhooks/stripe
4. Update it to match your live domain:
   - If using: nexus-ai.com, update to that
   - If still using .vercel.app, update to that
5. Click "Send test webhook"
6. Check Vercel logs - should see 200 response

Expected in Vercel logs:
POST /api/webhooks/stripe 200
```

**If you see this**: ✅ Stripe webhooks will deliver correctly  
**If you see 400/401**: ❌ Check STRIPE_WEBHOOK_SECRET matches Stripe dashboard

---

## TEST 7: Monitor Error Rate ✅

**Do this 5-10 minutes after going live**

```
In Sentry Dashboard:

1. Check error count
   Should be 0 or very low (< 1%)

2. Check for any new issues
   Click each to see stack trace

3. If high error rate:
   Look at error messages
   Find common patterns
   Check Vercel logs for details
```

**If error rate < 1%**: ✅ Everything is stable  
**If error rate > 5%**: ❌ Investigate and find root cause

---

## TROUBLESHOOTING: Common Issues

### Issue 1: "Cannot reach server"

```
Cause: DNS not propagated yet
Solution: 
  1. Wait 15-30 minutes for DNS
  2. In the meantime, use .vercel.app domain
  3. Check DNS: nslookup nexus-ai.com
     Should resolve to Vercel IP
```

### Issue 2: Health check returns 503

```
Cause: Database not connecting
Solution:
  1. Verify DATABASE_URL in Vercel > Settings > Environment Variables
  2. Test connection locally: psql <DATABASE_URL>
  3. Check Neon console for project status
  4. Verify URL matches exactly (no extra spaces)
```

### Issue 3: Health check returns 401/500 on cache

```
Cause: Upstash credentials wrong
Solution:
  1. Verify UPSTASH_REDIS_REST_URL in Vercel
  2. Verify UPSTASH_REDIS_REST_TOKEN in Vercel
  3. Copy from Upstash console again
  4. Make sure token is marked as "Sensitive"
  5. Redeploy: Click "Redeploy" in Vercel Deployments
```

### Issue 4: Clerk sign-up shows "Error"

```
Cause: Clerk credentials wrong
Solution:
  1. Go to Clerk Dashboard: https://dashboard.clerk.com
  2. Copy CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY again
  3. Update in Vercel > Settings > Environment Variables
  4. Redeploy
```

### Issue 5: Lots of errors in Sentry

```
Cause: Misconfigured environment or bug
Solution:
  1. Check Sentry error messages
  2. Look at stack traces
  3. Check Vercel logs for details
  4. If database error: verify DATABASE_URL
  5. If API error: check specific route logic
  6. Can rollback to previous deploy from Vercel dashboard
```

---

## ✅ All Tests Passing?

```
If you see:
✅ Health check returns "ok"
✅ Homepage loads with 3D effects
✅ Sign-up flow works
✅ Sentry shows new release
✅ Vercel logs show 200 responses
✅ No obvious error patterns
✅ Error rate < 1%

THEN: 🎉 YOU'RE LIVE & OPERATIONAL
```

---

## 📊 Monitor These Metrics (First 24 hours)

```
Every 15 minutes:
□ Health check endpoint: https://nexus-ai.com/api/health
□ Error rate in Sentry
□ Database latency (should be < 100ms)
□ API response time (should be < 500ms)

Every hour:
□ Check for error spikes
□ Verify database connections stable
□ Check Stripe webhook deliveries

If anything looks wrong:
→ Check Vercel logs immediately
→ Check Sentry error details
→ Check environment variables
→ Verify all credentials match service dashboards
```

---

## Next Steps

1. ✅ All tests passing?
   → Continue to production monitoring setup

2. ❌ Some tests failing?
   → Follow troubleshooting steps above
   → Check Vercel logs for specific errors
   → Verify all credentials match exactly

3. 📊 Want to monitor metrics?
   → Set up alerts in Sentry
   → Set up uptime monitoring (UptimeRobot)
   → Monitor MRR in Stripe dashboard

---

**Status**: 🟢 READY FOR PRODUCTION  
**Next Document**: Post-launch monitoring setup (optional)

**Congratulations! Your app is live!** 🚀
