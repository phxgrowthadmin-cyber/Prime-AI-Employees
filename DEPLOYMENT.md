# NEXUS AI — Production Deployment & Team Collaboration Guide

---

## Part 1: Deploy to Vercel (10 min)

### Step 1: Connect to Vercel
1. Go to **vercel.com** → Sign in with GitHub
2. Click **Add New...** → **Project**
3. Select **phxgrowthadmin-cyber/Prime-AI-Employees** repository
4. Click **Import**

### Step 2: Configure Environment Variables
Vercel will ask for environment variables. Add these exactly:

```
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:npg_B9VoUh4EgGsf@ep-withered-frog-a6khp3yq.us-west-2.aws.neon.tech/neondb?sslmode=require

# Clerk Authentication (TEST KEYS - update for production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZnVsbC1iYWJvb24tNzYuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_AdQ7sljFo7Xvgi701tATPxM7CeQFmFAsYBZoFBDyBx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe (Placeholder - Phase 4)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_test_placeholder

# App
NEXT_PUBLIC_APP_URL=<your-vercel-url-after-deploy>
NODE_ENV=production
```

Click **Deploy** → Wait 2-3 min

### Step 3: Update Clerk Dashboard
1. Go to **clerk.com** dashboard
2. **Settings** → **Domains**
3. Add your Vercel deployment URL (e.g., `prime-ai-employees.vercel.app`)
4. Update **Allowed Origins** to your Vercel URL
5. Update **OAuth Redirect URIs** if using social login

### Step 4: Verify Deployment
- Vercel shows your live URL
- Visit it → should see home page
- Try signing up → should work
- Dashboard should load with live database

**✅ App is now live in production**

---

## Part 2: Invite Partner to GitHub

### Step 1: Add as Repository Collaborator
1. Go to **github.com/phxgrowthadmin-cyber/Prime-AI-Employees**
2. Click **Settings** tab
3. Left sidebar → **Collaborators and teams**
4. Click **Add people**
5. Enter your partner's GitHub username
6. Select **Maintain** or **Admin** role
7. Click **Add**

Your partner will get an email invite.

### Step 2: Partner Accepts Invite
They click the link in the email → **Accept invitation**

Now they have access to:
- All code
- Ability to push commits
- Ability to create branches
- CI/CD pipeline (auto-deploys on push to main)

---

## Part 3: Partner's Local Setup (5 min)

### Your Partner Runs These Commands

```bash
# 1. Clone the repository
git clone https://github.com/phxgrowthadmin-cyber/Prime-AI-Employees.git
cd Prime-AI-Employees

# 2. Install dependencies
npm install

# 3. Create .env.local with same variables
# (Copy from the DEPLOYMENT.md file above or get from you)
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://neondb_owner:npg_B9VoUh4EgGsf@ep-withered-frog-a6khp3yq.us-west-2.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_ZnVsbC1iYWJvb24tNzYuY2xlcmsuYWNjb3VudHMuZGV2JA"
CLERK_SECRET_KEY="sk_test_AdQ7sljFo7Xvgi701tATPxM7CeQFmFAsYBZoFBDyBx"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_placeholder"
STRIPE_SECRET_KEY="sk_test_placeholder"
STRIPE_WEBHOOK_SECRET="whsec_test_placeholder"
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF

# 4. Start dev server
npm run dev

# 5. Visit http://localhost:3000
# App runs locally with LIVE database (same Neon connection)
```

**Done!** They now have the full dev environment running.

---

## Part 4: Real-Time Collaboration Options

### Option A: GitHub Codespaces (RECOMMENDED - Same Tab)
**This is what you want: both on the same tab, editing simultaneously**

#### Setup (5 min)
1. **You**: Go to repo → Click **Code** → **Codespaces** tab → **Create codespace on main**
2. Waits ~30 sec → VS Code opens in browser
3. **Share with Partner**: Click **Share** button (top right) → generates shareable link
4. **Partner**: Clicks link → sees your workspace in real-time
5. Both can edit, both see each other's cursors

#### In Codespaces
```bash
# Automatically runs npm install + builds
# Then run:
npm run dev

# Both partners see live app at localhost:3000
# Both see each other editing code in real-time
```

**Benefits**:
- No local setup needed
- Same tab = true real-time collaboration
- See each other's cursors
- Shared terminal
- Can both run dev server on same port

---

### Option B: VS Code Live Share (If using local machines)
**If partners are on their own computers but want real-time editing**

1. Both install VS Code + Live Share extension
2. You: Open the repo folder → Click Live Share icon → **Start collaboration session**
3. Copy link → send to partner
4. Partner clicks link → joins your session
5. Both see same code, same cursors, can edit simultaneously

---

### Option C: Traditional Git Workflow (Basic)
**If you want separate local machines with git syncing**

```
Partner works locally:
  git pull origin main
  Create feature branch: git checkout -b feature/my-feature
  Make changes
  Commit: git commit -m "..."
  Push: git push origin feature/my-feature
  Create Pull Request on GitHub
  You review → Merge to main

Your turn:
  git pull origin main (gets their changes)
  Make your changes
  Push
  Rinse repeat
```

This works but no real-time editing.

---

## Best Practice Workflow (You + Partner)

### Communication
1. **Slack/Discord**: Coordinate what you're working on
2. **GitHub Issues**: Create issues for features/bugs
3. **Pull Requests**: Review each other's code before merging

### Feature Development
```
Partner: "I'm working on Phase 4 AI engine"
  → git checkout -b feature/langchain-setup
  → Make commits
  → git push origin feature/langchain-setup
  → Open PR on GitHub
  
You: Review PR
  → Leave comments
  → Request changes if needed
  → Approve & merge

Auto Deploy:
  → Vercel sees push to main
  → Runs npm run build
  → Deploys to production if successful
```

### Avoid Conflicts
- **Don't both edit same file** at the same time (use branches)
- Pull before you start: `git pull origin main`
- Push often: `git push origin feature/my-feature`
- Use descriptive branch names: `feature/`, `fix/`, `docs/`

---

## Commands Your Partner Needs to Know

```bash
# First time setup
git clone https://github.com/phxgrowthadmin-cyber/Prime-AI-Employees.git
cd Prime-AI-Employees
npm install

# Daily workflow
git status                          # See what changed
git pull origin main               # Get latest code
git checkout -b feature/my-feature # Start working on feature
npm run dev                         # Test locally
git add .                          # Stage changes
git commit -m "description"        # Commit
git push origin feature/my-feature # Push to GitHub
# Then open PR on GitHub.com

# After your code is merged
git checkout main
git pull origin main               # Get merged code
git branch -d feature/my-feature   # Delete old branch

# Useful
git log --oneline                  # See recent commits
git diff                           # See what you changed
git stash                          # Save work temporarily
git reset --hard origin/main       # DANGER: undo all changes
```

---

## Troubleshooting

### "I can't push"
```bash
# Check you're on correct branch
git branch

# You need collaborator access
# Ask repo owner to add you in GitHub Settings

# Or check SSH keys
ssh -T git@github.com
```

### "I'm getting merge conflicts"
```bash
# Pull main first
git pull origin main

# Conflicts appear in files - fix them manually
# Then:
git add .
git commit -m "resolve conflicts"
git push origin feature/my-feature
```

### "Vercel deploy failed"
- Check Vercel dashboard → Deployments → View logs
- Usually: missing env vars or type errors
- Fix locally, push, auto-redeploy

### "Changes aren't showing on production"
- Vercel only deploys from `main` branch
- Make sure your PR is merged
- Check Vercel dashboard for build status
- Might take 1-2 min to redeploy

---

## Security Notes

### Don't Commit Secrets
- `.env.local` is in `.gitignore` (already ignored)
- Never commit API keys, passwords, tokens
- Vercel has secrets panel for production env vars

### GitHub Personal Access Token
- If using HTTPS (recommended), GitHub might ask for token
- Generate at github.com/settings/tokens
- Use classic token with `repo` + `workflow` scopes
- Save as password manager entry

### Clerk/Stripe Keys
- Test keys are safe to commit (they're marked `pk_test_`, `sk_test_`)
- Production keys go in Vercel env vars only
- Never share production secrets in code

---

## Summary

**Your Partner Can Now:**

1. **Clone the repo** → Get full codebase
2. **Run locally** → `npm run dev` → Develops on same database
3. **Push changes** → Automatically deploys to production
4. **Collaborate in real-time** → GitHub Codespaces with shared link
5. **Review PRs** → Both review each other's code

**Deployment is automatic:**
- Every push to `main` → Vercel auto-builds + deploys
- Takes 1-2 min
- If build fails, deployment is skipped
- Check dashboard for logs

---

## Next: Add More Team Members

Whenever you hire devs, just:
1. Add to GitHub (repo settings → collaborators)
2. Send them this guide + the SETUP.md
3. They clone, install, run `npm run dev`
4. Start assigning GitHub issues

**Everyone develops on the same Neon database, same Clerk auth, same Vercel deployment.**

All in sync. No friction.
