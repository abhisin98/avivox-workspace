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
| `patch/*` | Emergency fixes (urgent production fixes) | CI checks → Production deploy | **STRICT for main** |

**How code flows:**
```
dev/feature → Create QA Branch → qa/feature → Pull Request to main → main ✅ Live!
```

---

## Branch Protection Rules for a Small Team

### 1. Protect the `main` Branch (Production)

Your **production branch** needs the most protection. Here's the simple checklist:

#### Step-by-Step Setup

1. Go to your GitHub repository
2. Click **Settings** (top right menu)
3. Go to **Branches** (left sidebar)
4. Under "Branch protection rules", click **Add rule**
5. Fill in the following:

**Pattern name:** → Enter: `main`

**Protect matching branches:**
- ✅ Check: **Require a pull request before merging**
  - ✅ Check: **Require approvals** (set to **1 or 2** for small teams)
  - ✅ Check: **Dismiss stale pull request approvals when new commits are pushed**
  - ✅ Check: **Require review from Code Owners** (optional for small teams)

- ✅ Check: **Require status checks to pass before merging**
  - First, create one successful workflow run, then select it here
  - Look for: `CI` (the linting, testing, type-checking job)

- ✅ Check: **Require branches to be up to date before merging**

- ✅ Check: **Require linear history** (optional, keeps git history clean)

- ✅ Check: **Allow force pushes** → Choose **Allow force pushes** for: **Administrators only** (or leave disabled)

- ✅ Check: **Require code scanning results** (optional, if you use code scanning tools)

- ❌ **Do NOT check**: "Require pull request reviews to be stale"

**Allow bypassing the above settings:**

- ✅ Check: **Allow bypasses by:** → Select **Administrators** ✅

- ✅ Check: **Allow bypasses by:** → Select **GitHub Apps** ✅

  ⚠️ **Important:** See section "GitHub App Bypass Rules" below for why.

---

### 2. Protect `dev/*` Branches (Development)

Dev branches should be **quick and flexible** for your team. Minimal rules.

#### Step-by-Step Setup

1. Click **Add rule** (in the same Branch protection rules section)
2. Pattern name → Enter: `dev/*`

**Protect matching branches:**

- ✅ Check: **Require a pull request before merging** (optional for small teams)
  - If checked: Set **Require approvals** to **1** (not strict)
  - Uncheck: **Dismiss stale pull request approvals...** (not needed for dev)

- ≈ **OPTIONAL**: Require status checks (does NOT block if checks fail)
  - This is just a warning, not a blocker, so developers can still push fast

- ❌ **Do NOT check**: Require linear history (too strict for dev)

- ❌ **Do NOT check**: Administrator force pushes (allow team flexibility here)

**Allow bypasses by:**

- Leave this section **empty** (all team members should push to dev freely)

---

### 3. Protect `qa/*` Branches (Testing)

QA branches are for quality assurance. Similar to dev but can be slightly stricter.

#### Step-by-Step Setup

1. Click **Add rule**
2. Pattern name → Enter: `qa/*`

**Protect matching branches:**

- ≈ **OPTIONAL**: Same as dev rules (minimal)
  - You can copy the dev/* rules here

- ❌ **Do NOT** make this too strict. It's still a testing branch.

**Allow bypasses by:**

- Leave this section **empty** (all team members should be able to push here)

---

### 4. Protect `patch/*` Branches (Hotfixes)

These are emergency fixes. Use **main's protection rules**.

#### Step-by-Step Setup

1. Click **Add rule**
2. Pattern name → Enter: `patch/*`

**Protect matching branches:**

- Apply the **same rules as `main`** (strict review, CI checks required)

**Why?** Because `patch/*` goes straight to production. It's as critical as `main`.

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
- It must commit to `main` without being blocked
- Without bypass, your automation breaks

**How to add it?**

When editing the `main` branch protection rule:

1. Scroll to: **Allow bypasses by:**
2. ✅ Check: **GitHub Apps**

This allows **any GitHub App** configured in your repo to bypass the review requirement.

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
| **Developer** | "Member" | Writes code, creates PRs, reviews PRs | No ❌ |
| **Maintainer** | "Maintain" | Merges PRs, manages branches | No ❌ (unless needed) |
| **Tech Lead / Admin** | "Admin" | Can override rules in emergencies, manages configs | Yes ✅ (emergency only) |
| **GitHub App Bot** | N/A | Automates releases and branches | Yes ✅ (for automation) |

**How to set roles:**

1. Go to **Settings** → **Collaborators and teams** (left sidebar)
2. Find each person
3. Click their current role (next to their name)
4. Select new role: `Triage`, `Write`, `Maintain`, or `Admin`

**For a small team:**
- Most people: `Maintain` role (good balance)
- Tech lead: `Admin` role (for emergencies)
- Never give everyone admin (security risk)

---

## Checklist: What NOT to Do

❌ **Do NOT** add branch protection to `dev/*` and `qa/*` that's too strict
- Your team needs to iterate fast during development
- Too many rules = frustration and workarounds

❌ **Do NOT** require admin approval on dev branches
- Development should be flexible

❌ **Do NOT** enable "Require branches to be up to date" on dev branches
- It slows down development

❌ **Do NOT** dismiss the GitHub App from the bypass list for `main`
- Your automation will break

❌ **Do NOT** give everyone admin access
- Security risk; only for tech leads

❌ **Do NOT** require pull request reviews on `dev/*` branches (in most cases)
- It slows down development
- Use code review for QA and production

---

## Summary: Quick Setup Guide

### 1. Set up `main` branch protection (STRICT)

```
Pattern: main
☑ Require PR + 1-2 Approvals
☑ Require status checks (CI)
☑ Require branches up to date
☑ Allow GitHub Apps to bypass
☑ Allow Administrators to bypass
```

### 2. Set up `dev/*` branch protection (MINIMAL)

```
Pattern: dev/*
☐ Optional: PR + 1 Approval (for knowledge sharing)
☐ Optional: Status checks (warning only, not blocking)
☑ Allow all team members to push directly
```

### 3. Set up `qa/*` branch protection (MINIMAL)

```
Pattern: qa/*
Same as dev/* - keep it loose for testing
```

### 4. Set up `patch/*` branch protection (STRICT)

```
Pattern: patch/*
Same as main - it goes to production
```

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
