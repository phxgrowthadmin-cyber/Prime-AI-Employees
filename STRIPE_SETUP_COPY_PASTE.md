# STRIPE SETUP — Copy & Paste Instructions

**Time**: 10 minutes  
**What You'll Get**: 6 credentials to add to Vercel

---

## ✅ Your Encryption Key (Already Generated)

```
ENCRYPTION_KEY=5558f233fb391f8d7e5eb9b86ce43c5f34f664069e2ebfbc0eb519d9896cad59
```

**Copy this exactly** → You'll paste into Vercel later.

---

## STRIPE SETUP (Copy & Paste Steps)

### Step 1: Log In to Stripe

```
1. Go to: https://dashboard.stripe.com
2. Sign in with your account
   (If you don't have Stripe: go to https://stripe.com and create account first)
```

### Step 2: Create Product 1 — RECRUIT

```
In Stripe Dashboard:
1. Click "Products" (left sidebar)
2. Click "+ Add Product" (blue button)

FILL IN:
   Product name: RECRUIT
   Description: (leave blank or add: "1 AI Agent - $97/month plan")
   Image: (optional, skip)
   
3. Click "Save product"

4. Now you'll see "Pricing" section
   Click "Add price"
   
FILL IN:
   Price: 97
   Currency: USD
   Billing period: Monthly (not one-time)
   Recurring: YES
   
5. Click "Save price"

6. You'll see screen with "Price ID: price_..."
   
   ⭐️ COPY THIS: price_XXXXXX
   SAVE AS: STRIPE_RECRUIT_PRICE_ID=price_XXXXXX
```

### Step 3: Create Product 2 — OPERATOR

```
Repeat Step 2, but:
   Product name: OPERATOR
   Price: 497
   
Get the price ID and SAVE AS:
   STRIPE_OPERATOR_PRICE_ID=price_XXXXXX
```

### Step 4: Create Product 3 — EMPIRE

```
Repeat Step 2, but:
   Product name: EMPIRE
   Price: 2497
   
Get the price ID and SAVE AS:
   STRIPE_EMPIRE_PRICE_ID=price_XXXXXX
```

### Step 5: Get API Keys

```
In Stripe Dashboard:
1. Click "Developers" (top right corner)
2. Click "API keys" (left sidebar)

You should see:
   "Publishable key" (starts with pk_live_)
   "Secret key" (starts with sk_live_)

⭐️ COPY Secret Key
   SAVE AS: STRIPE_SECRET_KEY=sk_live_XXXXXX

⭐️ COPY Publishable Key
   SAVE AS: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXX
```

### Step 6: Create Webhook Endpoint

```
In Stripe Dashboard:
1. Click "Developers" (top right)
2. Click "Webhooks" (left sidebar)
3. Click "+ Add endpoint" (blue button)

FILL IN:
   Endpoint URL: https://nexus-ai.com/api/webhooks/stripe
   
   (NOTE: We'll update this to the actual domain after Vercel deploy)
   (For now, use this placeholder)

4. Click "Select events"
5. Check these events:
   ☑️ customer.subscription.created
   ☑️ customer.subscription.updated
   ☑️ customer.subscription.deleted
   ☑️ invoice.payment_succeeded
   ☑️ invoice.payment_failed

6. Click "Add endpoint"

7. You'll see endpoint created
   Click on it to view details
   
   Look for: "Signing secret" (starts with whsec_)
   
   ⭐️ COPY THIS: whsec_XXXXXX
   SAVE AS: STRIPE_WEBHOOK_SECRET=whsec_XXXXXX
```

---

## 📝 Summary: Your 6 Stripe Credentials

```
After completing above steps, you should have:

1. STRIPE_SECRET_KEY=sk_live_...
2. STRIPE_WEBHOOK_SECRET=whsec_...
3. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
4. STRIPE_RECRUIT_PRICE_ID=price_...
5. STRIPE_OPERATOR_PRICE_ID=price_...
6. STRIPE_EMPIRE_PRICE_ID=price_...

PLUS (from earlier):
7. ENCRYPTION_KEY=5558f233fb391f8d7e5eb9b86ce43c5f34f664069e2ebfbc0eb519d9896cad59
```

---

## ✅ You're Done with Stripe

Now move to: **VERCEL_AUTO_DEPLOY.md**
