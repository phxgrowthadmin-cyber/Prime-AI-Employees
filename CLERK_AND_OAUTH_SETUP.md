# CLERK & OAUTH SETUP — Final Credentials

**Status**: Clerk should already be configured from development  
**Time**: 5 minutes to get keys + 30 minutes for OAuth (can do after launch)

---

## CLERK AUTHENTICATION (Already Have)

### Get Your Existing Clerk Keys

```
These should already be in your .env.local from development.

1. Open terminal:
   cat /Users/sm/nexus-ai/.env.local | grep CLERK

2. You should see:
   CLERK_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...

3. Copy these values to use in Vercel
```

### If You Don't Have Them

```
1. Go to: https://dashboard.clerk.com
2. Sign in
3. Select your NEXUS AI application
4. Go to "API Keys" (left sidebar)
5. Copy:
   - Secret Key (sk_live_...)
   - Publishable Key (pk_live_...)
```

---

## OAUTH PROVIDERS (Optional - Can Do After Launch)

### Status: Skip for Now

**For MVP launch**, users can sign up with Clerk directly.

OAuth provider integrations (Google, Slack, Salesforce, HubSpot) are optional and can be added anytime after launch.

### When Ready (After deployment is live and stable):

---

## OPTIONAL: Add OAuth Providers Later

### Google OAuth Setup

```
1. Go to: https://console.cloud.google.com/

2. Create new project:
   Project name: NEXUS AI
   Organization: (leave default)

3. Enable APIs:
   - Search: "OAuth 2.0"
   - Click "OAuth 2.0 Client IDs"
   - Create new Credential > OAuth Client ID
   - Application type: Web application
   
4. Configure OAuth consent screen:
   - User type: External
   - App name: NEXUS AI
   - Support email: your-email@company.com
   - Developer contact: your-email@company.com

5. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     https://nexus-ai.com/api/oauth/google/callback
   - Click "Create"

6. Copy credentials:
   Client ID: ...
   Client Secret: ...
   
   Add to Vercel:
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
```

### Slack OAuth Setup

```
1. Go to: https://api.slack.com/apps

2. Create new app:
   From scratch
   App name: NEXUS AI
   Workspace: Your workspace

3. Go to "OAuth & Permissions" (left sidebar)

4. Redirect URLs:
   Add: https://nexus-ai.com/api/oauth/slack/callback

5. Scopes:
   - chat:write
   - users:read
   - channels:read

6. Install app to workspace
   Copy:
   Client ID: ...
   Client Secret: ...
   
   Add to Vercel:
   SLACK_CLIENT_ID=...
   SLACK_CLIENT_SECRET=...
```

### Salesforce OAuth Setup

```
1. Go to: https://login.salesforce.com/

2. Create developer account if needed

3. Setup > Apps > App Manager
   Create new "Connected App"
   
4. Basic information:
   Connected App Name: NEXUS AI
   API Name: nexus_ai
   Contact Email: your-email@company.com

5. API (Enable OAuth Settings):
   Check: "Enable OAuth Settings"
   Callback URL:
   https://nexus-ai.com/api/oauth/salesforce/callback
   
   OAuth Scopes:
   ☑️ Full access (full)
   ☑️ Refresh token, offline access (refresh_token, offline_access)

6. Save > Copy:
   Client ID: ...
   Client Secret: ...
   
   Add to Vercel:
   SALESFORCE_CLIENT_ID=...
   SALESFORCE_CLIENT_SECRET=...
```

### HubSpot OAuth Setup

```
1. Go to: https://developers.hubspot.com/

2. Create app:
   My apps > Create new app
   App name: NEXUS AI

3. Scopes:
   Add scopes:
   ☑️ crm.objects.contacts.read
   ☑️ crm.objects.deals.read
   ☑️ crm.objects.companies.read

4. Redirect URL:
   https://nexus-ai.com/api/oauth/hubspot/callback

5. Copy:
   Client ID: ...
   Client Secret: ...
   
   Add to Vercel:
   HUBSPOT_CLIENT_ID=...
   HUBSPOT_CLIENT_SECRET=...
```

---

## After Adding OAuth Credentials

```
1. Add to Vercel:
   Settings > Environment Variables
   Add each OAuth credential

2. Redeploy:
   Deployments > Redeploy

3. Test OAuth flow:
   Dashboard > Integrations > Click OAuth provider
   Should redirect to provider sign-in
```

---

## Summary

```
✅ CLERK: Already configured
   Get keys from Clerk dashboard or .env.local
   Add to Vercel

⏳ OAUTH: Optional, can add anytime after MVP
   Google, Slack, Salesforce, HubSpot
   Setup when you want to enable provider connections
   Each takes ~10 minutes to configure
```

---

## Total OAuth Setup Time

**If doing all 4 providers**: ~40 minutes  
**Per provider**: ~10 minutes

Can be done in parallel with someone else if needed.

---

**Next**: Follow VERCEL_AUTO_DEPLOY.md to get everything live
