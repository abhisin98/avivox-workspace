# Branch Protection Rules Guide

This guide explains how to set up branch protection rules for a small team.

---

## What Are Branch Protection Rules?

Branch protection rules are **safety guardrails** you set for your branches. They prevent mistakes like:

- Accidental pushes to production
- Merging broken code without review
- Pushing code that fails quality checks
- One person making all the decisions

Think of them as a checklist that must be completed before code can reach important branches.

**Why we use them:**
- Ensures code is reviewed before production
- Prevents broken code from going live
- Keeps history clean and safe
- Protects from accidental deletes

---

## Our Branching Strategy (Quick Overview)

We have **4 types of branches**:

| Branch | Purpose | What happens when you push | Protection level |
|--------|---------|---------------------------|------------------|
| `main` | Production (live app) | CI checks → Staging test → Production deploy | **STRICT** - needs review |
| `dev/*` | Development (daily work) | CI checks run | **MINIMAL** - for fast development |
| `qa/*` | Testing (before production) | CI checks run | **MINIMAL** - for testing |
| `patch/*` | Emergency fixes (urgent production fixes) | CI checks → Production deploy | **STRICT** |

**How code flows:**
```
dev/feature → PR dev→qa → QA review/tests → Bug fixes → QA merge → PR qa→main → main ✅ Live!
```

---

## Branch Protection Rules for a Small Team

### 1. Protect the `main` Branch (Production)

Your **production branch** needs the most protection. Here's the simple checklist:

#### Step-by-Step Setup

Navigate to **Settings → Rules → Rulesets** and click **New ruleset** for each of the following:

- **Ruleset Name:** `Protect Main Branch`
- **Enhancement Status:** Enabled
- **Target Branches:** Add pattern `main`

**Protect matching branches:**
- ✅ Check: **Restrict creations**

- ✅ Check: **Restrict updates**

- ✅ Check: **Restrict deletions**

- ✅ Check: **Require linear history** (optional, keeps git history clean)

- ✅ Check: **Require a pull request before merging**
  - ✅ Check: **Require approvals** (set to **1 or 2** for small teams)
  - ✅ Check: **Dismiss stale pull request approvals when new commits are pushed**
  - ✅ Check: **Require review from Code Owners** (optional for small teams)

- ✅ Check: **Require status checks to pass**
  - ✅ Check: **Require branches to be up to date before merging**
  - First, create one successful workflow run, then select it here
  - Look for: `CI` (the linting, testing, type-checking job), `Deploy Web (Beta)`, `Publish Packages (Beta)`

- ✅ Check: **Block force pushes**

- ✅ Check: **Require code scanning results** (optional, if you use code scanning tools)

**Allow bypassing the above settings:**
- ✅ Check: **Allow bypasses by:** → Select **Administrators** ✅

- ✅ Check: **Allow bypasses by:** → Select **GitHub Apps** ✅

  ⚠️ **Important:** See section "GitHub App Bypass Rules" below for why.

---

### 2. Protect `dev/*` Branches (Development)

Dev branches should be **quick and flexible** for your team. Minimal rules.

#### Step-by-Step Setup

Click **Add rule** (in the same Branch protection rules section)

- **Ruleset Name:** `Protect Dev Branch`
- **Enhancement Status:** Enabled
- **Target Branches:** Add pattern `dev/*`

**Protect matching branches:**

- ≈ **OPTIONAL**: Require status checks (does NOT block if checks fail)
  - This is just a warning, not a blocker, so developers can still push fast

**Allow bypasses by:**

- Leave this section **empty** (all team members should push to dev freely)

---

### 3. Protect `qa/*` Branches (Testing)

QA branches are for quality assurance testing. Developers create PRs from dev branches to qa branches, and QA team reviews, tests, and approves these PRs before merging.

#### Step-by-Step Setup

Click **Add rule**

- **Ruleset Name:** `Protect QA Branch`
- **Enhancement Status:** Enabled
- **Target Branches:** Add pattern `qa/*`

**Protect matching branches:**

- ✅ Check: **Restrict deletions**

- ✅ Check: **Require linear history** (optional, keeps git history clean)

- ✅ Check: **Require a pull request before merging**
  - ✅ Check: **Require approvals** (set to **1** - QA team approval required)
  - ✅ Check: **Dismiss stale pull request approvals when new commits are pushed**
  - ✅ Check: **Restrict merges** → Allow merging only when requirements are met

- ✅ Check: **Require status checks to pass**
  - First, create one successful workflow run, then select it here
  - Look for: `CI` (the linting, testing, type-checking job)

- ✅ Check: **Block force pushes**

**Allow bypasses by:**

- ✅ Check: **Allow bypasses by:** → Select **GitHub Apps** ✅

  ⚠️ **Important:** See section "GitHub App Bypass Rules" below for why.

**Note:** QA branches accept PRs from corresponding `dev/*` branches. QA team must approve all merges after thorough testing.

**Do not add QA team members or developers to the bypass list.** The bypass entry is for automation only, not for manual approval bypass.

---

### 4. Protect `patch/*` Branches (Hotfixes)

These are emergency fixes.

#### Step-by-Step Setup

Click **Add rule**

- **Ruleset Name:** `Protect Patch Hotfix Branch`
- **Enhancement Status:** Enabled
- **Target Branches:** Add pattern `patch/*`

**Protect matching branches:**

- ✅ Check: **Restrict creations**

- ✅ Check: **Restrict updates**

- ✅ Check: **Restrict deletions**

- ✅ Check: **Require linear history** (optional, keeps git history clean)

- ✅ Check: **Require status checks to pass**
  - ✅ Check: **Require branches to be up to date before merging**
  - First, create one successful workflow run, then select it here
  - Look for: `CI` (the linting, testing, type-checking job)

- ✅ Check: **Block force pushes**

- ❌ Do NOT require pull request before merging (patch branches deploy directly for emergencies)

**Allow bypasses by:**

- ✅ Check: **Allow bypasses by:** → Select **Administrators** ✅

**Why?** Because `patch/*` deploys directly to production, so strong protections are needed even without normal PR flow.

---

## GitHub App Bypass Rules (Important!)

### What is a GitHub App?

A **GitHub App** is an automated bot that your team uses to:

- Publish code changes (commits) automatically
- Create new branches (like `qa/*` from `dev/*`)
- Publish npm packages to the registry
- Keep your release history clean

**Common GitHub App bots in this project:**
- The app configured in your `.github/workflows/*yml` files via `APP_CLIENT_ID` and `APP_PRIVATE_KEY`

### Should We Add GitHub App to the Bypass List?

**YES ✅**

**Why add it?**

- It performs automated releases and branch promotions
- It may need permission for automated release commits or branch promotions
- Without bypass, your automation breaks

**How to add it?**

When editing the `main` branch protection rule:

1. Scroll to: **Allow bypasses by:**
2. ✅ Check: **GitHub Apps**

This allows **any GitHub App** configured in your repo to bypass the review requirement for automated workflows.

**Important:** This bypass is for automation only. Human QA or development team members should not be added to bypass lists for `qa/*` or `main` protections.

### Is This Safe?

**YES, it's safe because:**

- The GitHub App can only run predefined workflows (you control the code)
- It performs only specific tasks (releases, branches, deployments)
- Real code changes still need review (the app doesn't bypass code review)
- The app's actions are all logged in GitHub

**Example:** The app creates a release commit to `main`, but it only does this after all tests pass and a human merged the PR.

---

## Should Admins Bypass?

### Should We Add Administrators to the Bypass List?

**YES ✅ (but use sparingly)**

**Why add it?**

- Allows emergency fixes when systems are broken
- Lets you deploy critical security patches quickly
- Gives leadership final authority

**When should an admin bypass?**

- Production is down and needs immediate fix
- Critical security vulnerability discovered
- In emergency-only situations

**How to add it?**

When editing the `main` branch protection rule:

1. Scroll to: **Allow bypasses by:**
2. ✅ Check: **Administrators**

**Is this safe?**

- **Mostly yes**, but requires team trust
- All bypasses are logged in GitHub (you can see who bypassed and when)
- Best practice: Use sparingly and inform the team

---

## Team Roles and Permissions

### Who Should Have What Role

For a **small team of 3-5 people**, here's a simple breakdown:

| Role | GitHub Role | What they do | Can bypass `main` protection? |
|------|-------------|-------------|------------------------------|
| **Developer** | "Member" | Writes code in `dev/*` branches, creates PRs to `qa/*`, fixes bugs | No ❌ |
| **QA Team Member** | "Maintain" | Reviews PRs to `qa/*` branches, tests code, approves/merges to `qa/*`, creates PRs to `main` | No ❌ |
| **Dev Team Reviewer** | "Maintain" | Reviews PRs to `main`, merges approved production PRs | No ❌ |
| **Tech Lead / Admin** | "Admin" | Can override rules in emergencies, manages configs | Yes ✅ (emergency only) |
| **GitHub App Bot** | N/A | Automates releases and branches | Yes ✅ (for automation) |

**How to set roles:**

1. Go to **Settings** → **Collaborators and teams** (left sidebar)
2. Find each person
3. Click their current role (next to their name)
4. Select new role: `Triage`, `Write`, `Maintain`, or `Admin`

**For a small team:**
- Developers: `Write` or `Maintain` role (can create branches and PRs)
- QA team: `Maintain` role (can create branches, approve PRs)
- Tech lead: `Admin` role (for emergencies)
- Never give everyone admin (security risk)

---

## Checklist: What NOT to Do

❌ **Do NOT** add branch protection to `dev/*` branches that's too strict
- Development should be flexible for fast iteration

❌ **Do NOT** remove PR requirements from `qa/*` branches
- QA branches should require approval for bug fix merges

❌ **Do NOT** allow direct pushes to `qa/*` branches
- All changes to QA branches should come through approved PRs

❌ **Do NOT** enable "Require branches to be up to date" on dev branches
- It slows down development

❌ **Do NOT** dismiss the GitHub App from the bypass list for `main`
- Your automation will break

❌ **Do NOT** give everyone admin access
- Security risk; only for tech leads

✅ **DO** require pull request reviews on `qa/*` branches
- Ensures QA approval for all bug fixes

---

## Troubleshooting

### "I can't merge my PR to `main`"

**Check these:**

1. Does your PR have ✅ approvals? Need 1-2 reviews.
2. Did tests pass? ✅ Check the CI status.
3. Is your branch up to date? Click "Update branch" if needed.

### "The bot can't create releases on `main`"

**Fix:**

1. Go to `main` branch protection settings
2. Scroll to: **Allow bypasses by:**
3. ✅ Check: **GitHub Apps**
4. Save

### "I need to push a critical fix to `main` immediately"

**Do this:**

1. Contact your tech lead (the admin)
2. They can use their admin access to push directly
3. Document why in your team chat
4. Create a detailed PR after for record

---

## Questions?

If branch protection rules are confusing, ask your team lead. They can help or update this guide with more examples.

---

## Related Links

- **Workflows**: See [WORKFLOW-GUIDE.md](WORKFLOW-GUIDE.md) for CI/CD pipeline details
- **Branching**: All workflows are in `.github/workflows/`
- **CI/CD**: Our pipeline is built on GitHub Actions
