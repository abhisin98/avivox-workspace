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
- If tests pass ✅ → run the Create QA Branch workflow to start QA testing

**NOTE:** Dev branches are for development only. QA team handles testing on separate qa/ branches.

---

### **🟩 QA Branch — Quality Assurance Testing**

**Step 1: Developer pushes dev branch and runs the QA workflow**

Developer:
1. Creates `dev/my-feature` branch and writes code
2. Self-tests the code locally
3. Runs the **Create QA Branch** workflow with `dev/my-feature`

**What happens automatically:**
- The workflow creates `qa/my-feature` from `dev/my-feature`
- If the QA branch already exists and there are changes, it opens a PR from `dev/my-feature` → `qa/my-feature`
- CI checks run on the branch and on the PR if it is created
- QA team gets notified for review

**Note:** The bypass permission on `qa/*` is only for automation, not for manual QA team approvals. QA must still review and merge PRs through the protected branch workflow.

**Step 2: QA team reviews and tests**

QA team:
- Reviews the code changes in the PR
- Tests the feature manually
- Reports any bugs found back to developer

**Step 3: Developer fixes bugs and updates PR**

Developer:
- Fixes reported bugs in `dev/my-feature` branch
- Updates the same PR (or creates new PR if needed)
- QA team re-reviews and retests

**Step 4: QA team approves and merges**

QA team:
- Once testing passes, approves the PR
- Merges the PR to create/update `qa/my-feature` branch
- The qa branch now has tested, approved code

**Step 5: QA team creates production PR**

QA team:
- Creates PR from `qa/my-feature` → `main` for production deployment
- Code review happens on this PR
- After approval, merge to `main`

---

### **🟪 Beta Branch — Staging Preview (via Pull Request)**

**Step 1: QA creates beta PR** (after QA testing passes)

QA team member:
1. Go to **Actions** tab
2. Click **Create Beta Release PR** workflow
3. Enter: `qa/my-feature`
4. Click **Run workflow**

Behind the scenes:
- Creates a PR from `qa/my-feature` → `main`
- PR title: "Beta Release: qa/my-feature"

**Step 2: Code review and final testing**

1. Go to **Pull Requests** tab
2. Find the new PR called "Beta Release: qa/my-feature"
3. **Code review** by development team
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

When code review and testing is complete:
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

**⚠️ Important:** Only use patch/* for true emergencies. Normal fixes should go through dev → qa → beta → prod flow.
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

1. Developer creates `dev/my-feature` branch and writes code
2. Developer self-tests and creates PR: `dev/my-feature` → `qa/my-feature`
3. QA team reviews the PR, tests the code, and reports bugs
4. **If bugs found:**
   - Developer fixes bugs in `dev/my-feature`
   - Developer updates the same PR (or creates new PR)
   - QA team re-reviews and retests until approved
5. **If testing passes:** QA team merges the PR to `qa/my-feature`
6. QA team creates PR: `qa/my-feature` → `main` for production
7. Code review by development team
8. Merge to `main` → production deploy

**Notes:**
- Developers create PRs proactively from dev to qa branches
- QA team controls the merge to qa branches after thorough testing
- Only QA team creates PRs to `main` after qa testing is complete

### **Release Promotion Flow (Dev → QA → Prod)**

**The 6-step flow:**

```
Step 1           Step 2              Step 3              Step 4              Step 5              Step 6
Dev Branch       Create PR Dev→QA    QA Testing          Bug Fixes          QA Approval        Create Beta PR
dev/feature  →   PR dev→qa        →  QA tests        →  Update PR       →  QA merges       →  PR qa→main
```

**Detailed steps:**

| Step | Action | Who Does It | What Runs | Output |
|------|--------|-------------|-----------|--------|
| 1 | Push to `dev/feature` | Developer | CI checks | Pass/Fail messages |
| 2 | Create PR `dev/feature` → `qa/feature` | Developer | CI checks on PR | PR ready for review |
| 3 | Review & test PR | QA Team | Manual testing | Bug reports or approval |
| 4 | Fix bugs, update PR | Developer | CI checks on PR | Updated PR |
| 5 | Approve & merge PR to `qa/feature` | QA Team | CI checks | QA branch updated |
| 6 | Run "Create Beta Release PR" | QA Team | Auto-creates PR to `main` | PR with preview URL |
| 7 | Code review + merge PR | Dev Team | Beta deploy + final CI checks | Production deploy ✅ |

**Key point:** QA team controls the testing and release process. Developers provide fixes but don't create production PRs directly.

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
| Create QA Branch | After pushing to `dev/*` | Creates `qa/*` from `dev/*`, and opens a QA review PR when changes exist |
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
├─ dev/login-feature
│  (push)
│  ↓
│  ✅ CI checks run
│  (lint, test, build)
│
├─ Developer creates PR: dev/login-feature → qa/login-feature
│  ↓
│  Pull Request created
│  ✅ CI checks run on PR
│
├─ QA team reviews and tests
│  ↓
│  🐛 Bugs found?
│     ├─ YES → Developer fixes in dev/login-feature
│     │         ↓
│     │         Update PR with fixes
│     │         ↓
│     │         QA re-reviews and retests
│     └─ NO → Continue
│
├─ QA testing passes
│  ↓
│  QA merges PR → qa/login-feature updated
│
├─ QA creates PR: qa/login-feature → main
│  ↓
│  Pull Request: qa/login-feature → main
│  ✅ CI checks run
│  ✅ Preview deployed at staging URL
│  ✅ Beta packages published to npm
│
├─ Code review by dev team + test staging...
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

- Dev branch creation + PR: 30 minutes - 2 hours (developer work)
- QA review + testing: 1-4 hours (depends on complexity)
- Bug fixes: 30 minutes - few hours (dev fixes + QA retest cycles)
- QA → Beta PR: 1-2 minutes (QA team action)
- Code review + staging tests: 5-30 minutes (dev team)
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

**Step 1: Create a dev branch and write code**
```bash
git checkout -b dev/my-cool-feature
# Make your changes
git add .
git commit -m "feat: add cool feature"
git push origin dev/my-cool-feature
```

**Step 2: Self-test and create PR to QA**
- Test your code locally
- Create PR: `dev/my-cool-feature` → `qa/my-cool-feature`
- Wait for QA team review

**Step 3: Fix bugs reported by QA**
- QA team will review and test your PR
- If bugs found, fix them in your `dev/my-cool-feature` branch
- Update the same PR with fixes
- QA team will retest until approved

---

### **QA Team: Testing a Feature**

**Step 1: Review the developer PR**
- Go to Pull Requests tab
- Find the PR from `dev/my-cool-feature` → `qa/my-cool-feature`
- Review the code changes

**Step 2: Test the feature**
```bash
# Check out the PR branch
git fetch origin
git checkout qa/my-cool-feature
# Or test via the PR interface
# Run tests and manual testing
pnpm test
# Manual testing as needed
```

**Step 3: Report bugs or approve**
- If bugs found: Comment on PR with detailed bug reports
- Wait for developer to fix and update PR
- Retest fixes until satisfied
- When everything works: Approve and merge the PR

**Step 4: Create production PR**
- After merging to `qa/my-cool-feature`
- Go to Actions → "Create Beta Release PR"
- Enter: `qa/my-cool-feature`
- Click "Run workflow"

---

### **Dev Team: Code Review and Production Release**

**Step 1: Review the production PR**
- Go to Pull Requests tab
- Find the PR from `qa/my-cool-feature` → `main`
- Review the code changes thoroughly
- Check the staging deployment URL in PR comments
- Test in staging environment

**Step 2: Approve and merge**
- If everything looks good, approve the PR
- Click "Merge pull request" button
- Confirm merge
- Production deployment starts automatically
- 🎉 Feature is live in 3-5 minutes!

---

## 15. Non-Confusing Summary: How Everything Fits Together

### **Example Workflow: login-feature**

```
1. Developer creates: dev/login-feature
   - Writes code, commits, pushes
   - Self-tests locally
   - CI checks pass ✅

2. Developer creates PR: dev/login-feature → qa/login-feature
   - PR created for QA review
   - CI checks run on PR

3. QA Team reviews, tests, and reports bugs
   - Code review + manual testing
   - Documents any issues found

4. Developer fixes bugs in dev/login-feature
   - Makes necessary fixes
   - Updates the same PR

5. Developer updates same PR (or new PR if needed)
   - Pushes fixes to dev/login-feature
   - PR gets updated automatically

6. QA Team retests until approved
   - Reviews fixes and retests
   - Approves when everything works

7. QA Team merges qa/login-feature
   - Merges the approved PR
   - qa/login-feature now has tested code

8. QA Team creates PR: qa/login-feature → main
   - Uses "Create Beta Release PR" workflow

9. Dev Lead / Main reviewers approve
   - Code review by development team
   - Tests staging environment

10. Merge to production
    - PR merged to main
    - Automatic production deployment ✅
```

### **Who Does What**

| Role | Their Tasks |
|------|---|
| **Developer** | Create `dev/*` branches, write code, self-test, create PRs to `qa/*` branches, fix bugs |
| **QA Team** | Review PRs to `qa/*` branches, test code, report bugs, approve/merge PRs to `qa/*`, create PRs to `main` |
| **Dev Team** | Code review PRs to `main`, merge approved PRs |
| **GitHub Actions** | Run CI, deploy, publish packages (automatic) |

### **The Key Workflows You Need to Know**

1. **Create PR**: Developer creates PR from `dev/feature` → `qa/feature`
2. **Create Beta Release PR**: QA team creates PR from `qa/feature` → `main`
3. **Bug Fix Updates**: Developer updates existing PR with fixes
4. **Merge PR**: QA team merges approved PRs to `qa/*`, Dev team merges to `main`

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
