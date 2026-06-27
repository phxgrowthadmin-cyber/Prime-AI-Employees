# VERCEL DEPLOYMENT — Automated Step-by-Step (15 minutes)

**Prerequisites**: 
- ✅ All credentials collected (Neon, Upstash, Inngest, Sentry, Stripe)
- ✅ Encryption key generated: `5558f233fb391f8d7e5eb9b86ce43c5f34f664069e2ebfbc0eb519d9896cad59`
- ✅ Clerk keys obtained from .env.local

**Time**: 15 minutes  
**Result**: Live at https://nexus-ai.com

---

## STEP 1: Push Code to GitHub (2 min)

```bash
# In terminal:
cd /Users/sm/nexus-ai

# Verify everything is clean
git status

# If you see changes:
git add .
git commit -m "Production-ready: monitoring, security, deployment"

# Push to GitHub
git push origin main

# ✅ Done - your latest code is on GitHub
```

---

## STEP 2: Go to Vercel & Import Project (3 min)

```
1. Open: https://vercel.com/new
   (Log in with GitHub if asked)

2. You should see your nexus-ai repo in the list
   If not, use search box to find it
   
3. Click on nexus-ai repo to import
```

**You'll see import screen:**

```
Project name: nexus-ai
Framework: Next.js ✅ (should auto-detect)
Root directory: ./ ✅ (default is fine)

DON'T change build/start commands - defaults are correct

Click: "Import"
```

**Vercel creates your project and shows environment variables screen**

---

## STEP 3: Add Environment Variables (10 min)

**You're now on "Environment Variables" screen in Vercel**

### Add Variables One by One:

For each variable below:
1. Type name in "Key" field
2. Type value in "Value" field
3. Check boxes: ☑️ Sensitive (for secrets), ☑️ Production
4. Click "Add another" or just type next variable

---

### GROUP 1: Core Application

```
NODE_ENV
Value: production
Sensitive: ☐ NO
Production: ☑️ YES

NEXT_PUBLIC_APP_URL
Value: https://nexus-ai.com
Sensitive: ☐ NO
Production: ☑️ YES

NEXT_PUBLIC_APP_NAME
Value: NEXUS AI
Sensitive: ☐ NO
Production: ☑️ YES
```

---

### GROUP 2: Encryption

```
ENCRYPTION_KEY
Value: 5558f233fb391f8d7e5eb9b86ce43c5f34f664069e2ebfbc0eb519d9896cad59
Sensitive: ☑️ YES
Production: ☑️ YES
```

---

### GROUP 3: Database (From Person 1 - Neon)

```
DATABASE_URL
Value: postgresql://user:password@db.neon.tech:5432/nexus?sslmode=require
Sensitive: ☑️ YES
Production: ☑️ YES
```

---

### GROUP 4: Clerk (From your .env.local)

```
CLERK_SECRET_KEY
Value: sk_live_...
Sensitive: ☑️ YES
Production: ☑️ YES

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_live_...
Sensitive: ☐ NO
Production: ☑️ YES
```

---

### GROUP 5: Stripe (From STRIPE_SETUP_COPY_PASTE.md)

```
STRIPE_SECRET_KEY
Value: sk_live_...
Sensitive: ☑️ YES
Production: ☑️ YES

STRIPE_WEBHOOK_SECRET
Value: whsec_...
Sensitive: ☑️ YES
Production: ☑️ YES

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_live_...
Sensitive: ☐ NO
Production: ☑️ YES

STRIPE_RECRUIT_PRICE_ID
Value: price_... (from Stripe)
Sensitive: ☐ NO
Production: ☑️ YES

STRIPE_OPERATOR_PRICE_ID
Value: price_... (from Stripe)
Sensitive: ☐ NO
Production: ☑️ YES

STRIPE_EMPIRE_PRICE_ID
Value: price_... (from Stripe)
Sensitive: ☐ NO
Production: ☑️ YES
```

---

### GROUP 6: Cache (From Person 2 - Upstash)

```
UPSTASH_REDIS_REST_URL
Value: https://...upstash.io
Sensitive: ☐ NO
Production: ☑️ YES

UPSTASH_REDIS_REST_TOKEN
Value: AYjc1YtASzz8...
Sensitive: ☑️ YES
Production: ☑️ YES
```

---

### GROUP 7: Job Queue (From Person 3 - Inngest)

```
INNGEST_API_KEY
Value: ...
Sensitive: ☑️ YES
Production: ☑️ YES

INNGEST_EVENT_KEY
Value: ...
Sensitive: ☑️ YES
Production: ☑️ YES
```

---

### GROUP 8: Monitoring (From Person 4 - Sentry)

```
NEXT_PUBLIC_SENTRY_DSN
Value: https://...@sentry.io/...
Sensitive: ☐ NO
Production: ☑️ YES

SENTRY_AUTH_TOKEN
Value: sntrys_...
Sensitive: ☑️ YES
Production: ☑️ YES
```

---

## Summary: Variable Count

```
You should have added 19 variables total:

✅ 3 app config
✅ 1 encryption
✅ 1 database
✅ 2 clerk
✅ 6 stripe
✅ 2 upstash
✅ 2 inngest
✅ 2 sentry

= 19 total
```

---

## STEP 4: Deploy (1 min)

```
After all variables added:

1. Scroll down to bottom of form
2. Click blue "Deploy" button
3. Vercel starts building...

You'll see:
✓ Building...
✓ Optimizing...
✓ Finalizing...
✓ Generating...

Wait 2-3 minutes for completion
```

---

## STEP 5: Confirm Deployment Success (2 min)

```
When build completes, you'll see:
✅ "Deployment successful!"

Green checkmark = YOU'RE DEPLOYED! 🎉

You'll see a "Visit" button with a URL like:
nexus-ai.vercel.app

Click to test it's working
```

---

## STEP 6: Configure Domain (DNS) (5 min - Can do later)

```
In Vercel Dashboard (after successful deploy):

1. Click "Settings" (top navigation)
2. Click "Domains" (left sidebar)
3. Click "Add Domain"
4. Type: nexus-ai.com
5. Click "Add"

Vercel shows DNS instructions:
Either:
  A) Point root domain to Vercel IP, OR
  B) Add CNAME record to vercel.com

Go to your domain registrar:
(GoDaddy, Namecheap, Route53, etc.)

Add the DNS records Vercel shows
(Varies by registrar, but follow their UI)

Wait 15-30 minutes for DNS to propagate
Vercel will show "Verified" when ready

MEANWHILE: Your app works at nexus-ai.vercel.app
```

---

## ✅ You're Live!

```
Status: 🟢 DEPLOYED TO VERCEL

Your app is now live!

Where to access:
- During DNS setup: https://nexus-ai.vercel.app
- After DNS setup: https://nexus-ai.com

Next: Verify everything works
```

---

## STEP 7: Verify Everything Works (Follow Next Document)

See: **VERIFY_DEPLOYMENT.md**

---

**Total Time from Start to Live: ~30 minutes**

Congratulations! 🚀
