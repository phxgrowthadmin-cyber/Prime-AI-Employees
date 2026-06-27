# Partner Quick Start — Get Running in 5 Min

**You just got invited to the Prime-AI-Employees GitHub repo. Here's how to start developing immediately.**

---

## Copy These Commands (Run in Terminal)

```bash
# 1. Clone repo
git clone https://github.com/phxgrowthadmin-cyber/Prime-AI-Employees.git
cd Prime-AI-Employees

# 2. Install
npm install

# 3. Create .env.local (ask your lead for this - it has database + auth keys)
# Or if they gave you the file, just move it to the root folder

# 4. Start dev server
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

**Done.** You're running the same live app as everyone else, connected to the same database.

---

## For Real-Time Collaboration (Same Tab)

Your lead will:
1. Open the repo in **GitHub Codespaces**
2. Click **Share** button
3. Send you the link

You click it → Work together in real-time in the browser. No setup needed.

---

## First Task: Edit Something

1. Create a new branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make changes (edit any file)

3. Save and commit:
   ```bash
   git add .
   git commit -m "Added cool thing"
   git push origin feature/my-feature
   ```

4. Go to **github.com** → your repo → **Pull Requests** → **Create PR**

5. Your lead reviews → Merges to `main`

6. **Auto-deploys to production** in 2 min

---

## Key Points

- **Database**: Everyone uses the same Neon PostgreSQL (live)
- **Auth**: Everyone uses the same Clerk (live)
- **Deployment**: Every merge to `main` auto-deploys via Vercel
- **Branches**: Create a branch for each feature (never push directly to main)
- **PRs**: Always open a PR for review before merging

---

## You Need These 3 Things

1. **GitHub Access** ← Your lead adds you as collaborator
2. **.env.local file** ← Ask your lead for database + Clerk keys
3. **Node.js installed** ← If you don't have it: nodejs.org

---

## Common Commands

```bash
# See your current branch
git branch

# Switch branch
git checkout branch-name

# See what changed
git status

# See your changes
git diff

# Save work without committing
git stash

# Get latest code
git pull origin main

# After merge, clean up old branch
git branch -d feature/my-feature
```

---

## Questions?

Check **DEPLOYMENT.md** (full guide) or ask your lead.

**You're ready to ship.** 🚀
