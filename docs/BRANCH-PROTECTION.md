# 🛡️ Avivox Workspace — Branch Protection & GitHub Rulesets Guide

This guide provides a comprehensive, step-by-step procedure for configuring **GitHub Rulesets** to secure the Avivox Workspace codebase across all development tiers (`main`, `qa/*`, `dev/*`, and `patch/*`).

---

## 📑 Table of Contents

1. [Why GitHub Rulesets?](#1-why-github-rulesets)
2. [Branching Strategy & Ruleset Overview](#2-branching-strategy--ruleset-overview)
3. [Step-by-Step Ruleset Configurations](#3-step-by-step-ruleset-configurations)
   - [Ruleset 1: Protect Main Branch (`main`)](#ruleset-1-protect-main-branch-main)
   - [Ruleset 2: Protect QA Branches (`qa/*`)](#ruleset-2-protect-qa-branches-qa)
   - [Ruleset 3: Protect Development Branches (`dev/*`)](#ruleset-3-protect-development-branches-dev)
   - [Ruleset 4: Protect Patch Branches (`patch/*`)](#ruleset-4-protect-patch-branches-patch)
4. [GitHub App Bypass Permissions Explained](#4-github-app-bypass-permissions-explained)
5. [Team Roles & Permission Matrix](#5-team-roles--permission-matrix)
6. [Step-by-Step GitHub Web UI Walkthrough](#6-step-by-step-github-web-ui-walkthrough)
7. [Troubleshooting & FAQ](#7-troubleshooting--faq)

---

## 1. Why GitHub Rulesets?

GitHub **Rulesets** (located under **Settings → Rules → Rulesets**) provide next-generation branch protection with significant advantages over legacy branch protection rules:

- **Target by Pattern**: Apply rules dynamically to wildcard patterns like `qa/*` and `dev/*`.
- **Granular Bypass Controls**: Grant bypass permissions specifically to **GitHub Apps** (such as our automated release bot) or **Repository Admins** without weakening protections for the rest of the team.
- **Enforcement Modes**: Test rules in `Evaluate` mode before switching to `Active`.
- **Multi-layered Governance**: Layer multiple rulesets without collision.

---

## 2. Branching Strategy & Ruleset Overview

| Branch Pattern | Environment | Protection Level | PR Required? | Approvals | Status Checks Required | Bypass Allowed |
|---|---|---|---|---|---|---|
| `main` | Production (Live) | **Strict** | Yes ✅ | 1 or 2 | `CI`, `Deploy Web (Beta)`, `Publish Packages (Beta)` | Administrators, GitHub Apps |
| `qa/*` | QA / Testing | **Strict** | Yes ✅ | 1 (QA Signoff) | `CI` | GitHub Apps |
| `dev/*` | Feature Development | **Flexible** | No ❌ (Direct Push) | None | None (Warning only) | All Team Members |
| `patch/*` | Emergency Hotfixes | **Guarded** | No ❌ (Direct Deploy) | None | `CI` | Administrators |

---

## 3. Step-by-Step Ruleset Configurations

### Ruleset 1: Protect Main Branch (`main`)

The `main` branch represents the live production environment. It requires the strictest protections against unreviewed code, failed builds, and force-push history overwrites.

#### Configuration Settings:
1. **Ruleset Name**: `Protect Main Branch`
2. **Enforcement Status**: `Active`
3. **Target Branches**:
   - Select **Include default branch** (or add pattern `main`).
4. **Branch Protections**:
   - ✅ **Restrict deletions**: Prevents accidental deletion of the `main` branch.
   - ✅ **Block force pushes**: Ensures commit history cannot be rewritten.
   - ✅ **Require linear history**: Enforces clean Git history via `Rebase` or `Squash` merges.
   - ✅ **Require a pull request before merging**:
     - **Required approvals**: `1` (or `2` for larger teams).
     - ✅ **Dismiss stale pull request approvals when new commits are pushed**: Forces re-approval if new commits are added after review.
     - ✅ **Require conversation resolution before merging**: All PR comments must be resolved.
     - **Allowed merge methods**: Check `Rebase` and `Squash` (uncheck Merge Commit if enforcing strict linear history).
   - ✅ **Require status checks to pass**:
     - ✅ **Require branches to be up to date before merging**: Prevents merging outdated branches.
     - **Required Status Checks**:
       - `CI` (the continuous integration job in `beta.yml`)
       - `Deploy Web (Beta)` (the staging preview deployment job in `beta.yml`)
       - `Publish Packages (Beta)` (the beta package verification job in `beta.yml`)
5. **Bypass List**:
   - Click **Add bypass**:
     - Select **Repository admin** (Mode: `Always allow` — for production emergency overrides).
     - Select **GitHub App** (Mode: `Always allow` — select your configured GitHub App, e.g., `release-bot`, to permit automated release tagging and changelog commits).

---

### Ruleset 2: Protect QA Branches (`qa/*`)

QA branches receive promoted features from developers and serve as the staging verification gate before code is promoted to `main`.

#### Configuration Settings:
1. **Ruleset Name**: `Protect QA Branch`
2. **Enforcement Status**: `Active`
3. **Target Branches**:
   - Select **Include by pattern** ➔ Add `qa/*`.
4. **Branch Protections**:
   - ✅ **Restrict deletions**: Protects active QA test branches.
   - ✅ **Block force pushes**: Preserves developer and QA test history.
   - ✅ **Require linear history**: Maintains clean history.
   - ✅ **Require a pull request before merging**:
     - **Required approvals**: `1` (QA engineer approval required for bug fix merges).
     - ✅ **Dismiss stale pull request approvals when new commits are pushed**.
     - **Allowed merge methods**: `Rebase` and `Squash`.
   - ✅ **Require status checks to pass**:
     - **Required Status Check**: `CI` (the lint, type-check, test, and build suite in `qa.yml`).
5. **Bypass List**:
   - Click **Add bypass**:
     - Select **GitHub App** (Mode: `Always allow` — allows `abhisin98/avivox-action-promotion-engine@v1` to automatically create `qa/*` branches from `dev/*`).

> [!IMPORTANT]
> **Human QA and Developers must NOT be in the bypass list for `qa/*`.** All developer code changes targeting a QA branch must pass review and automated CI checks.

---

### Ruleset 3: Protect Development Branches (`dev/*`)

Development branches are working spaces for feature development. They must allow fast iteration, frequent pushes, and rapid prototyping without blocking developers with mandatory PRs or approval gates.

#### Configuration Settings:
1. **Ruleset Name**: `Protect Dev Branch`
2. **Enforcement Status**: `Active`
3. **Target Branches**:
   - Select **Include by pattern** ➔ Add `dev/*`.
4. **Branch Protections**:
   - ❌ **Do NOT require a pull request before merging** (Developers push directly to their `dev/*` branch).
   - ❌ **Do NOT block force pushes** (Developers may rebase or amend their local feature commits).
   - ✅ **Restrict deletions** (Optional: protects against accidental remote branch deletions).
5. **Bypass List**: Leave empty (direct pushes are enabled by default).

---

### Ruleset 4: Protect Patch Branches (`patch/*`)

Patch branches are dedicated to emergency production hotfixes. When pushed, [`.github/workflows/patch.yml`](../.github/workflows/patch.yml) immediately executes CI and deploys directly to production. Therefore, branch creation and updates must be guarded.

#### Configuration Settings:
1. **Ruleset Name**: `Protect Patch Hotfix Branch`
2. **Enforcement Status**: `Active`
3. **Target Branches**:
   - Select **Include by pattern** ➔ Add `patch/*`.
4. **Branch Protections**:
   - ✅ **Restrict creations**: Restricts creating `patch/*` branches to Repository Admins and authorized Maintainers.
   - ✅ **Restrict deletions**: Prevents deletion during active deployments.
   - ✅ **Block force pushes**: Ensures hotfix audit trail is preserved.
   - ✅ **Require status checks to pass**:
     - **Required Status Check**: `CI`.
   - ❌ **Do NOT require pull requests** (`patch.yml` triggers directly on branch push to immediately deploy critical hotfixes).
5. **Bypass List**:
   - Select **Repository admin** (Mode: `Always allow`).

---

## 4. GitHub App Bypass Permissions Explained

### Why Does the GitHub App Need Bypass Access?

When code is merged to `main`, [`.github/workflows/prod.yml`](../.github/workflows/prod.yml) runs `abhisin98/avivox-action-changelogs-and-package-releases@v1`. This action automatically:
1. Bumps package versions in `package.json`.
2. Updates `CHANGELOG.md` files.
3. Commits and pushes `chore(release): publish package versions and changelogs [skip ci]` directly back to `main`.
4. Creates Git release tags (`package@x.y.z`).

If `main` has branch protection enabled without a GitHub App bypass:
- The automated release push will be **rejected by GitHub** with error `Protected branch: push rejected`.
- Granting the GitHub App bypass permissions allows the release bot to commit changelogs and push tags without manual human intervention.

### Is This Secure?
- **Yes**: The GitHub App runs only the code defined in your repository workflows.
- The bypass applies **only to automated actions performed by the authenticated GitHub App**, never to individual developers pushing code from their local machines.

---

## 5. Team Roles & Permission Matrix

For effective team collaboration and safety, assign repository members according to this role matrix:

| Team Role | GitHub Access Level | Responsibilities | Can Direct Push to `main`? | Can Bypass `main` PR? |
|---|---|---|---|---|
| **Developer** | `Write` | Creates `dev/*` branches, writes feature code, opens PRs to `qa/*`. | ❌ No | ❌ No |
| **QA Engineer** | `Maintain` | Reviews & merges PRs to `qa/*`, triggers `Create Beta Release PR`, verifies staging. | ❌ No | ❌ No |
| **Tech Lead / Admin** | `Admin` | Performs code reviews on `main` PRs, merges production releases, manages secrets & rulesets. | ❌ No (Uses PR) | ✅ Yes (Emergency Only) |
| **GitHub App Bot** | Bot Identity | Automates branch promotions, changelogs, release tags, and package publishing. | ✅ Yes (Via Workflow) | ✅ Yes (Configured in Ruleset) |

---

## 6. Step-by-Step GitHub Web UI Walkthrough

```
1. Open Repository on GitHub
   ↓
2. Click "Settings" tab (top navigation bar)
   ↓
3. On left sidebar: Click "Rules" ➔ "Rulesets"
   ↓
4. Click "New ruleset" ➔ Select "New branch ruleset"
   ↓
5. Enter Ruleset Name (e.g., "Protect Main Branch")
   ↓
6. Set Enforcement Status to "Active"
   ↓
7. Under "Bypass list": Click "Add bypass" ➔ Select Role or App
   ↓
8. Under "Target branches": Click "Add target" ➔ Select "Include default branch" or "Include by pattern"
   ↓
9. Check required protection rules (Restrict deletions, Require PR, Require status checks)
   ↓
10. Click "Create" (or "Save changes") at the bottom of the page
```

---

## 7. Troubleshooting & FAQ

### ❓ "Why is my release workflow failing to push to `main`?"
- **Cause**: The GitHub App is missing from the `main` ruleset bypass list.
- **Fix**: Go to **Settings → Rules → Rulesets → Protect Main Branch → Bypass list → Add bypass → GitHub App** and set to `Always allow`.

### ❓ "Status check 'CI' is not appearing in the required status checks list"
- **Cause**: GitHub Rulesets can only auto-complete check names after the workflow has run at least once on the repository.
- **Fix**: Push a commit or run the workflow once. After the job completes, search for `CI`, `Deploy Web (Beta)`, or `Publish Packages (Beta)` in the status checks search bar.

### ❓ "Why did my PR merge get blocked even though tests passed?"
- **Check 1**: Did you receive approval from a reviewer? (1 approval required).
- **Check 2**: Did anyone push new commits after approval? If so, stale approvals were dismissed and re-approval is required.
- **Check 3**: Are all PR conversation threads marked as resolved?

### ❓ "Can a developer push directly to `qa/*`?"
- **Answer**: No. Direct pushes to `qa/*` are blocked. Developers must push to `dev/*` and use the **Create QA Branch** workflow to promote changes to `qa/*` through a reviewed Pull Request.

