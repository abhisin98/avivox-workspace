# Workflow Guide

Learn how our CI/CD pipeline automatically builds, tests, and deploys code. This guide is for everyone—developers, QA, and DevOps team members.

---

## 1. What This Directory Is For

The `.github/workflows/` directory contains **automation files** that run automatically when you push code or open pull requests. Think of it as a robot that:

- Checks if your code has errors (linting)
- Verifies types are correct (TypeScript)
- Runs tests
- Deploys to staging and production
- Publishes packages to npm

These files help your team catch bugs early and deploy safely.

---

## 2. Simple Overview of the CI/CD Pipeline

Here's how code flows from development to production:

```
Your Code → Branch Check → Tests Pass? → Deploy → Live ✅
```

**In more detail:**

1. **You push code** to a branch (like `dev/my-feature`)
2. **Automated checks run** (lint, type-check, tests)
3. **If tests pass** ✅ → You can promote to QA
4. **QA tests it** (in staging)
5. **Create a PR to main** → Deploy to beta (preview)
6. **Merge PR to main** → Deploy to production
7. **Live and visible to users** 🎉

**Tools we use:**
- **pnpm**: Package manager (like npm, but faster)
- **Turbo**: Build tool that caches results (faster builds)
- **Railway**: Where we deploy the web app
- **GitHub Actions**: Automation engine

---

## 3. What Each Reusable Action Does

We have **4 main reusable actions** that every workflow uses:

### **Setup Action** (`.github/actions/setup`)
- Gets the environment ready
- Installs Node.js and pnpm
- Installs all dependencies
- Builds packages
- Sets up cache (make future runs faster)

**Used by:** All workflows

---

### **CI Action** (`.github/actions/ci`)
- Checks for code errors: `pnpm lint` ✅
- Checks TypeScript types: `pnpm type-check` 📝
- Runs tests: `pnpm test` 🧪
- Builds everything: `pnpm build` 🏗️

**Used by:** All workflows

---

### **Railway Deploy Action** (`.github/actions/railway-deploy`)
- Deploys the web app to Railway (cloud hosting)
- Can create temporary **preview environments** for testing PRs
- Posts deployment URL in PR comments
- Cleans up preview environments when PR is closed

**Used by:** beta.yml, prod.yml, patch.yml, beta-cleanup.yml

---

### **Changelogs Action** (`.github/actions/changelogs`)
- Automatically updates package versions (e.g., 1.0.0 → 1.0.1)
- Generates CHANGELOG.md files
- Creates git tags and GitHub releases
- Publishes packages to npm

**Used by:** beta.yml, prod.yml, patch.yml

---

### **Promotion Engine** (`.github/workflows/_promotion-engine.yml`)
- A helper workflow that automates creating branches and PRs
- Validates branch names (enforces naming rules)
- Used by: create-qa.yml and create-beta.yml

---

## 4. How GitHub App Identity and Fallback Bot Work

When workflows make commits, tags, or releases, they use a "bot identity" (like a user but automated).

### **Best Option: GitHub App Bot (Recommended for Production)**

If you set up `APP_CLIENT_ID` and `APP_PRIVATE_KEY` secrets:

- Commits are made by your custom GitHub App bot
- Shows up as `your-app-name[bot]` in git history
- More secure and professional
- Required for: production releases, branch promotion

**Example commit message shows:**
```
Author: release-bot[bot] <12345+release-bot[bot]@users.noreply.github.com>
```

### **Fallback Option: Default GitHub Actions Bot**

If GitHub App secrets are **not** set up:

- Commits are made by `github-actions[bot]`
- Works automatically—no extra setup needed
- Good for small teams or development

**Example commit message shows:**
```
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
```

### **How It Works:**

1. If GitHub App secrets exist → use GitHub App bot ✅
2. If GitHub App secrets missing → use github-actions[bot] ✅
3. No errors—it's automatic!

---

## 5. Which Secrets Are Required and Optional

### **🔴 REQUIRED Secrets** (must have to deploy)

You must add these in **Settings → Secrets and variables → Actions**:

- `RAILWAY_API_TOKEN` — Your Railway account token (get from Railway settings)
- `RAILWAY_PROJECT_ID` — Your Railway project ID
- `RAILWAY_ENVIRONMENT_ID` — The Railway environment to deploy to
- `RAILWAY_SERVICE_ID` — Which service to deploy
- `NPM_TOKEN` — To publish packages to npm

### **🟢 RECOMMENDED Secrets** (makes workflows smoother)

Add these for better security and automatic branch promotion:

- `APP_CLIENT_ID` — GitHub App ID (for git commits)
- `APP_PRIVATE_KEY` — GitHub App private key (for git commits)

### **How to Get These Secrets:**

**Railway Tokens:**
1. Go to railway.com and log in
2. Click your profile → Account settings
3. Copy the API token and project ID
4. Go to GitHub → Repo Settings → Secrets → Add each one

**NPM Token:**
1. Go to npmjs.com and log in
2. Click your avatar → Access tokens
3. Create a new token (select "Granular access token")
4. Copy and add to GitHub secrets

**GitHub App (optional but recommended):**
- See **Setup GitHub App** section below

---

## 6. How Developers Use Dev, QA, Beta, Prod, and Patch Flow

### **🟦 Dev Branch — Daily Development**

```bash
# What to do:
git checkout -b dev/my-feature
# Make changes, commit, push
git push origin dev/my-feature
```

**What happens automatically:**
- CI checks run (lint, tests)
- If tests fail → see error messages in GitHub
- If tests pass ✅ → ready to promote

**NOTE:** Beta branch deployments are disabled for dev branches (we keep it light for speed).

---

### **🟩 QA Branch — Quality Assurance Testing**

**Step 1: Create a QA branch from dev** (automatic promotion)

In GitHub UI:
1. Go to **Actions** tab
2. Click **Create QA Branch** workflow
3. Enter: `dev/my-feature`
4. Click **Run workflow**

Behind the scenes:
- `dev/my-feature` → Creates `qa/my-feature` automatically
- QA branch is pushed to GitHub

**Step 2: Test on QA branch**

```bash
# Pull the new QA branch
git fetch origin
git checkout qa/my-feature
# Run tests locally if needed
```

**What happens automatically:**
- CI checks run (same as dev)
- QA branch is now ready for review

**NOTE:** Deployments are disabled for QA branches too (we keep it fast).

---

### **🟪 Beta Branch — Staging Preview (via Pull Request)**

**Step 1: Create a beta PR** (automatic promotion)

In GitHub UI:
1. Go to **Actions** tab
2. Click **Create Beta Release PR** workflow
3. Enter: `qa/my-feature`
4. Click **Run workflow**

Behind the scenes:
- Creates a PR from `qa/my-feature` → `main`
- PR title: "Beta Release: qa/my-feature"

**Step 2: Review and test the PR**

1. Go to **Pull Requests** tab
2. Find the new PR called "Beta Release: qa/my-feature"
3. Review the code changes
4. **Wait for automatic comment** with deployment URL
5. Click the URL to test in staging
6. Run final QA tests

**What happens automatically:**
- Web app deploys to **Railway beta environment**
- Package publishes to npm with `beta` tag (for testing)
- Preview URL posted in PR comments
- You can click and test live

**⚠️ Important:** Don't merge yet unless everything is tested and approved!

---

### **🟥 Production — Live Release**

**Step 1: Merge the beta PR to main**

When you're ready to go live:
1. In the PR, click **Merge pull request**
2. Confirm the merge

**What happens automatically:**
- All CI checks run again
- Web app deploys to **production (Railway)**
- Packages publish to npm with `latest` tag
- Version is auto-bumped (e.g., 1.0.0 → 1.0.1)
- GitHub releases created
- Live for all users! 🎉

**NOTE:** This is the only way to deploy to production (no manual pushes to main allowed).

---

### **🟠 Patch Branches — Emergency Hotfixes**

Use this **only for critical production bugs** that can't wait for the normal flow.

```bash
# Create patch branch
git checkout main
git pull
git checkout -b patch/critical-bug
# Fix the bug, commit, push
git push origin patch/critical-bug
```

**What happens automatically:**
- CI checks run
- Web app deploys directly to **production**
- Package version bumped as patch (e.g., 1.0.0 → 1.0.1)

**⚠️ Important:** Only use patch for true emergencies. Normal fixes should go through dev → qa → beta → prod flow.

---

## 7. How QA and Release Promotion Work

### **QA Testing Flow**

**Who is involved:** QA team members, developers

**The process:**

1. Developer creates a feature branch: `dev/my-feature` and pushes
2. Developer or QA triggers: **Create QA Branch** workflow
3. Workflow automatically creates: `qa/my-feature`
4. QA pulls the branch and tests locally/in staging
5. QA gives approval

**Notes:**
- QA branches mirror dev branches (same code, new branch)
- Branch names are validated (must be `qa/something`)
- If you try to create when branch already exists → workflow fails (safe)

### **Release Promotion Flow (Dev → QA → Prod)**

**The 4-step flow:**

```
Step 1           Step 2              Step 3              Step 4
Dev Branch       Create QA Branch    Create Beta PR      Merge PR to Prod
dev/feature  →   qa/feature       →  PR to main       →  main (AUTO DEPLOY)
```

**Detailed steps:**

| Step | Action | What Runs | Output |
|------|--------|-----------|--------|
| 1 | Push to `dev/feature` | CI checks | Pass/Fail messages |
| 2 | Run "Create QA Branch" workflow | Automatically creates `qa/feature` | QA branch ready |
| 3 | Run "Create Beta Release PR" workflow | Auto-creates PR from `qa/feature` → `main` | PR with preview URL |
| 4 | Merge the PR | Beta deploy + final CI checks | Production deploy ✅ |

**Key point:** Each step is automatic—just click "Run workflow" and it handles the rest.

---

## 8. What Happens on Branch Pushes, PRs, and Manual Triggers

### **Automatic Workflows (No action needed)**

| Event | Branch | Workflow | What Happens |
|-------|--------|----------|--------------|
| Push | `dev/*` | dev.yml | CI checks run |
| Push | `qa/*` | qa.yml | CI checks run |
| Push | `main` | prod.yml | CI + Deploy prod + Publish packages |
| Push | `patch/*` | patch.yml | CI + Deploy prod + Publish patch |
| PR opened/updated | → `main` | beta.yml | CI + Deploy staging + Publish beta |
| PR closed | from any → `main` | beta-cleanup.yml | Delete staging environment |

### **Manual Workflows (You trigger them)**

In GitHub UI → **Actions** tab → Select workflow → **Run workflow**

| Workflow | When to Use | What It Does |
|----------|------------|--------------|
| Create QA Branch | After pushing to `dev/*` | Creates `qa/*` automatically |
| Create Beta Release PR | After pushing to `qa/*` | Creates PR to `main` automatically |

---

## 9. What the Beta Cleanup Workflow Does

**When it runs:** Automatically when a PR to `main` is closed (merged or cancelled)

**What it does:**

1. **Cleanup Web** → Deletes the preview/staging environment from Railway
   - This stops the temporary preview URL from staying live
   - Saves Railway resources

2. **Cleanup Packages** → Placeholder for future cleanup (not active yet)
   - Currently just says "Hello World"
   - Will eventually unpublish beta packages from npm

**Why?** To avoid leaving behind test environments and packages after a PR is done.

---

## 10. How Branch Naming Conventions Affect Workflows

Branch names **must follow patterns** or workflows fail. This keeps things organized.

### **Required Naming Patterns**

| Branch Type | Pattern | Example | Validation |
|---|---|---|---|
| Dev | `dev/*` | `dev/login-feature` | Any name after `dev/` |
| QA | `qa/*` | `qa/login-feature` | Any name after `qa/` |
| Patch | `patch/*` | `patch/critical-bug` | Any name after `patch/` |
| Main | `main` | N/A | Fixed name (production) |

### **Allowed Characters**

✅ Allowed: lowercase letters, numbers, hyphens (`-`), underscores (`_`), dots (`.`)

❌ Not allowed: spaces, uppercase, special characters like `!@#$%`

**Examples:**

- ✅ `dev/user-auth` → Good
- ✅ `qa/v1.1-fixes` → Good
- ❌ `dev/User Auth` → Bad (spaces + uppercase)
- ❌ `qa/feature!` → Bad (special character)

### **How Validation Works**

When you run **Create QA Branch** or **Create Beta Release PR** workflows:

1. Workflow checks the branch name
2. If it doesn't match the pattern → **Workflow fails** with error message
3. If it matches → **Workflow succeeds**

This prevents mistakes like creating `QA/my-feature` instead of `qa/my-feature`.

---

## 11. Full Release Flow From Dev to Prod Summary

### **The Complete Journey**

```
┌─ Developer creates feature branch
│
├─ dev/my-feature
│  (push)
│  ↓
│  ✅ CI checks run
│  (lint, test, build)
│
├─ Ready? Run "Create QA Branch"
│  ↓
│  qa/my-feature
│  ✅ CI checks run
│
├─ QA tests it...
│
├─ Ready for production? Run "Create Beta Release PR"
│  ↓
│  Pull Request: qa/my-feature → main
│  ✅ CI checks run
│  ✅ Preview deployed at staging URL
│  ✅ Beta packages published to npm
│
├─ Review PR and test staging...
│
├─ Ready to go live? Merge the PR
│  ↓
│  main (auto-merged)
│  ✅ CI checks run (final!)
│  ✅ Deployed to production
│  ✅ Packages published to npm latest
│  ✅ GitHub release created
│
└─ 🎉 Live for all users!
```

### **Time Estimate**

- Dev branch → QA branch: 1-2 minutes (automatic)
- QA testing: Hours or days (depends on complexity)
- QA → Beta PR: 1-2 minutes (automatic)
- Staging tests: 5-30 minutes (team tests)
- Merge to prod: 3-5 minutes (automatic deploy)

---

## 12. Important Warnings, Limitations, and Disabled Jobs

### **⚠️ Currently Disabled Features**

These jobs are commented out and don't run:

- `dev.yml` → Deploy Web & Publish Packages (disabled)
- `qa.yml` → Deploy Web & Publish Packages (disabled)

**Why?** To avoid accidentally deploying broken dev/QA code. Only beta and production deployments are active.

### **⚠️ Important Warnings**

| Warning | What It Means | What To Do |
|---------|---------------|-----------|
| **Don't push to `main` directly** | Pushing to main bypasses QA flow | Always use PRs. Use the "Create Beta Release PR" workflow. |
| **GitHub App secrets optional but recommended** | Workflows work without them but are less secure | Set up APP_CLIENT_ID and APP_PRIVATE_KEY for production. |
| **Patch branches go straight to prod** | No PR review step for patches | Use patch/* only for real emergencies. |
| **Preview environments auto-delete** | Staging URLs disappear when PR closes | Test before merging! URLs not permanent. |
| **Beta packages are temporary** | Beta npm packages are not meant for long-term use | Use `latest` tag for real packages. |
| **CI must pass before deploy** | If any CI check fails, deployment stops | Fix tests first, then retry. |

### **🔴 Limitations**

1. **Only one concurrent workflow per branch** → If you push twice quickly, the second run cancels the first
2. **Preview environments limited** → Railway has storage limits; cleanup important
3. **npm publishing requires token** → NPM_TOKEN must be configured or publishing fails
4. **Git identity fallback only** → If GitHub App secret is wrong, it auto-falls back but logs won't be clean

---

## 13. How to Trigger Workflows From the GitHub UI

### **For Manual Workflows (Create QA Branch, Create Beta Release PR)**

1. Go to your GitHub repository
2. Click the **Actions** tab (top menu)
3. On the left sidebar, find the workflow (e.g., "Create QA Branch")
4. Click on it
5. Click the **Run workflow** button (right side)
6. Enter the required input(s):
   - For "Create QA Branch": enter `dev/my-feature`
   - For "Create Beta Release PR": enter `qa/my-feature`
7. Click **Run workflow** (the green button)
8. Wait for it to complete (1-2 minutes usually)

### **For Automatic Workflows**

You don't trigger these—they run automatically:

- When you push to `dev/*`, `qa/*`, `patch/*`, or `main`
- When a PR is opened/updated to `main`
- When a PR to `main` is closed

Check progress in the **Actions** tab.

---

## 14. Simple Step-by-Step Instructions for Developers and QA

### **Developer: Adding a New Feature**

**Step 1: Create a dev branch**
```bash
git checkout -b dev/my-cool-feature
# Make your changes
git add .
git commit -m "feat: add cool feature"
git push origin dev/my-cool-feature
```

**Step 2: Check that tests pass**
- Go to GitHub → Actions tab
- Find your branch in the list
- Wait for CI to complete
- ✅ Green = Ready to promote
- ❌ Red = Fix the errors

**Step 3: Share for QA testing**
- Tell your team: "dev/my-cool-feature is ready"
- They'll run "Create QA Branch" workflow

---

### **QA: Testing a Feature**

**Step 1: Get the QA branch ready**

Option A (if dev branch already exists):
- Go to Actions → "Create QA Branch"
- Enter: `dev/my-cool-feature`
- Click "Run workflow"
- Wait 1-2 minutes

Option B (if someone already created the qa branch):
- Pull it: `git fetch origin && git checkout qa/my-cool-feature`

**Step 2: Test locally**
```bash
# Get latest code
git pull origin qa/my-cool-feature
# Install deps if needed
pnpm i
# Run tests
pnpm test
# Start dev server if needed
pnpm dev
```

**Step 3: Give approval**
- Comment on the code: "Looks good! Ready for beta." ✅
- Or: "Found bug: X doesn't work" ❌

---

### **Release Manager: Promoting to Production**

**Step 1: Create beta PR for staging**
- Go to Actions → "Create Beta Release PR"
- Enter: `qa/my-cool-feature`
- Click "Run workflow"

**Step 2: Wait for deployment**
- Check Actions tab
- Beta workflow will deploy to staging
- A comment on the PR will have the preview URL

**Step 3: Test in staging**
- Click the preview URL from the PR comment
- Test the feature in staging
- Verify everything works

**Step 4: Merge to production**
- When ready, click "Merge pull request" button
- Confirm merge
- Production workflow starts automatically
- Check Actions tab for progress
- 🎉 Live in 3-5 minutes!

---

## 15. Non-Confusing Summary: How Everything Fits Together

### **The Big Picture**

Think of your release process like a **quality checkpoint system**:

```
✅ DEV BRANCH
   ↓ (CI checks)
✅ QA BRANCH
   ↓ (manual testing)
✅ BETA PR (Preview in staging)
   ↓ (final review)
✅ MAIN (Production)
   ↓
🎉 LIVE
```

**Each checkpoint:**
1. Automatically runs tests
2. Waits for human approval
3. Moves to next step

**If any step fails:**
- Error message appears in GitHub UI
- Developer fixes it
- Re-run the workflow
- Continue

### **Who Does What**

| Role | Their Tasks |
|------|---|
| **Developer** | Create `dev/*` branches, write code, commit |
| **QA** | Run "Create QA Branch" workflow, test on `qa/*` |
| **Release Mgr** | Run "Create Beta Release PR", merge to main |
| **GitHub Actions** | Run CI, deploy, publish packages (automatic) |

### **The Three Commands You Need to Know**

1. **Create QA Branch**: `dev/feature` → `qa/feature`
2. **Create Beta Release PR**: `qa/feature` → PR to main
3. **Merge PR**: Triggers production deploy

That's it! Everything else is automatic.

### **When in Doubt**

- Check the **Actions** tab to see what's running
- Read the error messages (they're usually clear)
- Ask your team for help
- Refer back to this guide

---

## Helpful Quick Reference

### **Branch Name Pattern Cheat Sheet**

```
✅ dev/login
✅ dev/auth-fix-v2
✅ qa/user-dashboard
✅ qa/search-improvements
✅ patch/critical-issue
❌ Dev/login (capital D)
❌ dev/login feature (space)
```

### **Workflow Status Meanings**

| Status | Meaning | What To Do |
|--------|---------|-----------|
| 🟡 In Progress | Running now | Wait for completion |
| ✅ Success | Completed successfully | Next step! |
| ❌ Failed | Something went wrong | Click to see error message, fix it |
| 🟡 Cancelled | Someone stopped it | Re-run if needed |

### **When Deployments Happen**

| Event | Deploys To | Auto-publish npm? |
|-------|-----------|---|
| Push to `main` | Production | Yes (`latest` tag) |
| PR merge to `main` | Production | Yes (`latest` tag) |
| PR open to `main` | Staging (preview) | Yes (`beta` tag) |
| Push to `patch/*` | Production | Yes (`latest` tag, patch version) |
| Push to `dev/*` | Nowhere (disabled) | No |
| Push to `qa/*` | Nowhere (disabled) | No |

### **Contact & Questions**

- GitHub Issues: Report problems
- Slack / Team Chat: Ask for help
- This guide: Refer back anytime

**Happy deploying! 🚀**

---

## Additional: Setting Up GitHub App (Recommended)

### **Why You Need This**

- Professional commit attribution
- Better security for production
- Automatic branch promotion works better

### **Steps**

1. Go to repo → **Settings** → **Developer settings** → **GitHub Apps**
2. Click **New GitHub App**
3. Fill in:
   - Name: `release-bot`
   - Homepage URL: Your repo URL
   - Uncheck **Webhook**
4. Set Permissions:
   - **Contents**: Read & write
   - **Pull requests**: Read & write
5. Click **Create GitHub App**
6. Generate private key and copy secret values
7. Add to repo secrets:
   - `APP_CLIENT_ID` (the Client ID)
   - `APP_PRIVATE_KEY` (the private key content)
   - Go back to the GitHub App settings page
   - Click **Install App** (or go to **Install App** on the left sidebar)
   - Select your repository
   - Click **Install**

Your GitHub App is now configured for all CI/CD operations including branch promotion, deployments, PR comments, and changelog generation!

---

## Related Documentation

- **Branch Protection**: See [BRANCH-PROTECTION.md](BRANCH-PROTECTION.md) for setting up branch protection rules
- **Branching**: All workflows are in `.github/workflows/`
- **CI/CD**: Our pipeline is built on GitHub Actions
