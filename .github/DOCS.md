# GitHub Actions Workflows

This directory contains GitHub Actions workflows for continuous integration, testing, and deployment of the monorepo.

## Overview of the CI/CD Pipeline

Our CI/CD pipeline automates the process of building, testing, and deploying our monorepo applications and packages. It ensures code quality through linting, type checking, and testing, then deploys to various environments based on branch patterns. The pipeline uses pnpm for package management and Turbo for efficient caching.

## Reusable Actions and Workflows

We use GitHub composite actions and reusable workflows to standardize common steps across workflows:

- **Setup Action** (`.github/actions/setup`): Prepares the environment by setting up Pnpm, Node.js, installing dependencies, building packages, and restoring Turbo cache.
- **CI Action** (`.github/actions/ci`): Performs linting, type checking, testing, and building. Can be configured to skip specific steps via inputs (`run-lint`, `run-type-check`, `run-test`, `run-build`).
- **Railway Deploy Action** (`.github/actions/railway-deploy`): Smart Railway deployment with support for preview environments. Handles environment setup, deployment, tagging, and PR comments. Supports cleanup of preview environments.
- **Changelogs Action** (`.github/actions/changelogs`): Full release pipeline with changelog generation, version bumping, git tagging, GitHub releases, and package publishing. Supports multiple release types (auto, beta, patch, minor, major, canary). Flexible git identity configuration with support for custom identity, GitHub App bot, or default GitHub Actions bot.
- **Promotion Engine** (`.github/workflows/_promotion-engine.yml`): Reusable workflow for automating branch promotion from dev → qa and qa → main (beta). Validates branch naming conventions and supports both GitHub App authentication and default GitHub Actions bot as fallback.

### Git Identity and Authentication Options

All workflows that perform git operations (commits, tags, branch creation) can be configured with different authentication and identity options:

#### Option 1: GitHub App Bot Identity (Recommended for Production)

When you configure GitHub App secrets (`APP_CLIENT_ID` and `APP_PRIVATE_KEY`), workflows that perform git operations can use the GitHub App bot identity:

**Changelogs Action**:
- To use GitHub App bot identity: Explicitly pass `git-user-name` and `git-user-email` inputs with the app bot values
- Example (used in prod.yml):
  ```yaml
  git-user-name: "${{ steps.app-token.outputs.app-slug }}[bot]"
  git-user-email: "${{ steps.get-user-id.outputs.user-id }}+${{ steps.app-token.outputs.app-slug }}[bot]@users.noreply.github.com"
  ```

**Promotion Engine**:
- Automatically detects and uses GitHub App secrets if available
- Git User Name: `{app-slug}[bot]` (derived from your GitHub App name)
- Git User Email: `{user-id}+{app-slug}[bot]@users.noreply.github.com`

#### Option 2: GitHub Actions Default Bot (Fallback)

If GitHub App secrets are not configured, both workflows automatically fall back to the default GitHub Actions bot:

**Details**:
- Git User Name: `github-actions[bot]`
- Git User Email: `41898282+github-actions[bot]@users.noreply.github.com`
- No additional configuration needed beyond standard GitHub token

**Changelogs Action**:
- The github-actions[bot] identity is the default when no custom `git-user-name` and `git-user-email` inputs are provided

**Promotion Engine**:
- Automatically falls back when `APP_CLIENT_ID` and `APP_PRIVATE_KEY` secrets are not configured

#### Option 3: Custom Git Identity

**Changelogs Action only** - Control git user identity via inputs:

- **`git-user-name`** (default: `github-actions[bot]`): Custom git user name for commits
- **`git-user-email`** (default: `41898282+github-actions[bot]@users.noreply.github.com`): Custom git user email

Example:
```yaml
- uses: ./.github/actions/changelogs
  with:
    github-token: ${{ steps.app-token.outputs.token }}
    git-user-name: "my-custom-bot"
    git-user-email: "bot@example.com"
```

## Branching Strategy

We follow a structured branching strategy to manage deployments across different environments:

- **`main`**: The production branch. Merging here triggers CI checks and production deployment.
- **`dev/*`**: Development branches (e.g., `dev/feature-name`). Used for initial development and testing. Triggers deployment to the development environment.
- **`qa/*`**: QA branches (e.g., `qa/feature-name`). Used for quality assurance testing. Triggers deployment to the QA environment.
- **`patch/*`**: Hotfix branches (e.g., `patch/security-fix`). Used for urgent production fixes. Triggers patch deployment directly to production. Only repo admins can create.
- **Pull Requests to `main`**: Triggers beta deployment for staging and final testing before production.

## Branch Protection Rules Setup

To enforce code quality and control access across branches, configure GitHub branch protection rulesets. This ensures all code follows the branching strategy and only authorized personnel can perform specific actions.

### Important: GitHub App Setup is Required

Before setting up branch protection rules, **you must configure the GitHub App and secrets**. This is essential because:

1. **Main Branch Protection**: When code is merged to `main`, the production deployment workflow needs authentication to:
   - Create git tags and GitHub releases
   - Publish packages to npm
   - Create commits with changelog information
   - All of these require `APP_CLIENT_ID` and `APP_PRIVATE_KEY` secrets

2. **QA/Dev/Patch Workflows**: Workflows that run on these branches use the GitHub App to:
   - Perform git operations (commits, branch creation)
   - Create pull requests automatically
   - Update repository state

3. **Without GitHub App Setup**:
   - Workflows will fall back to `github-actions[bot]` (less secure)
   - PR comments and branch creation may not work properly
   - Git history attribution won't show the proper bot identity

**See the "Required GitHub Secrets" section below to set up your GitHub App BEFORE creating branch protection rules.**

### Overview of Protection Rules

| Branch | Who Can Create | Status Checks | Reviews | Direct Push | Signatures |
|--------|---|---|---|---|---|
| **main** | PR only | ✅ Required | ✅ 1+ approval | ❌ No | ✅ Required |
| **patch/** | Admins only | ✅ Required | ❌ None | ✅ Yes (prod) | ✅ Required |
| **qa/** | QA team only | ✅ Required | ✅ 1+ approval | ❌ No | ✅ Required |
| **dev/** | Anyone | ✅ Required | ❌ None | ✅ Yes | ❌ Optional |

### Step-by-Step Setup Instructions

#### Prerequisites

1. Create GitHub teams in your organization:
   - `qa-team` - QA team members
   - `admins` - Repository administrators

2. Create template branches for each pattern (so rules are applied to existing branches):
   ```bash
   git checkout -b dev/initial-setup && git push -u origin dev/initial-setup
   git checkout -b qa/v1.0.0 && git push -u origin qa/v1.0.0
   git checkout -b patch/v1.0.1 && git push -u origin patch/v1.0.1
   ```

#### Creating Rulesets

Navigate to **Settings → Rules → Rulesets** and click **New ruleset** for each of the following:

**RULESET 1: Main Branch (Production)**

1. **Ruleset Name:** `Protect Main Branch`
2. **Enhancement Status:** Enabled
3. **Target Branches:** Add pattern `main`
4. **Enable Rules:**
   - ✅ Restrict creations (Admins & maintainers only)
   - ✅ Restrict updates (Admins & maintainers only)
   - ✅ Restrict deletions (Admins & maintainers only)
   - ✅ Require linear history
   - ✅ Require signed commits
   - ✅ Require status checks: `ci / lint`, `ci / type-check`, `ci / test`, `ci / build`
   - ✅ Require pull request before merging (1 approval, dismiss stale reviews, require code owner review)
   - ✅ Block force pushes
5. **Create Ruleset**

**RULESET 2: Patch/* (Hotfix - Admins Only)**

1. **Ruleset Name:** `Protect Patch Hotfix Branch`
2. **Enhancement Status:** Enabled
3. **Target Branches:** Add pattern `patch/*`
4. **Enable Rules:**
   - ✅ Restrict creations (Specific actors → Admins & maintainers only)
   - ✅ Restrict updates (Specific actors → Admins & maintainers only)
   - ✅ Restrict deletions (Specific actors → Admins & maintainers only)
   - ✅ Require signed commits
   - ✅ Require status checks: `ci / lint`, `ci / type-check`, `ci / test`, `ci / build`
   - ❌ **Do NOT require pull request** (allows direct deployment to production)
   - ✅ Block force pushes
5. **Create Ruleset**

**RULESET 3: QA/* (Testing - QA Team Only)**

1. **Ruleset Name:** `Protect QA Testing Branch`
2. **Enhancement Status:** Enabled
3. **Target Branches:** Add pattern `qa/*`
4. **Enable Rules:**
   - ✅ Restrict creations (Specific actors → Specific teams → `@{org}/qa-team`)
   - ✅ Restrict updates (Specific actors → Specific teams → `@{org}/qa-team`)
   - ✅ Restrict deletions (Specific actors → Specific teams → `@{org}/qa-team`)
   - ✅ Require signed commits
   - ✅ Require status checks: `ci / lint`, `ci / type-check`, `ci / test`, `ci / build`
   - ✅ Require pull request before merging (1 approval, dismiss stale reviews, require code owner review)
   - ✅ Block force pushes
5. **Create Ruleset**

**RULESET 4: Dev/* (Development - Anyone)**

1. **Ruleset Name:** `Allow Developer Branches`
2. **Enhancement Status:** Enabled
3. **Target Branches:** Add pattern `dev/*`
4. **Enable Rules:**
   - ❌ Do not restrict creations
   - ❌ Do not restrict updates
   - ❌ Do not restrict deletions
   - ✅ Require status checks: `ci / lint`, `ci / type-check`, `ci / test`, `ci / build`
   - ❌ Do not require pull request (developers push directly)
   - ❌ Do not require signed commits
5. **Create Ruleset**

#### Code Owners Configuration (Optional)

Create `.github/CODEOWNERS` file to automatically assign reviewers:

```
# QA team approves QA branches
qa/* @{org}/qa-team

# Admins approve main branch
main @{org}/admins

# Developers own dev branches
dev/* @{org}/developers
```

Replace `{org}` with your organization name (e.g., `abhisin98`).

### Verification

After creating all rulesets, verify in **Settings → Rules → Rulesets** that:
- ✅ All 4 rulesets are listed and **Enabled**
- ✅ Each targets the correct branch pattern
- ✅ Status checks show "ci / lint, ci / type-check, ci / test, ci / build"
- ✅ main and patch/* have appropriate creation/update restrictions

## How Each Workflow Works

### Dev Deployment (dev.yml)

- **Trigger**: Automatically runs when pushing to any branch matching `dev/*`
- **Purpose**: Performs CI checks on development code
- **Jobs**:
  - **CI**: Runs linting, type checking, testing, and building using reusable actions
  - **Deploy Web** (currently disabled): Would deploy the web application to the dev environment
  - **Publish Packages** (currently disabled): Would publish npm packages with the `dev` tag for testing

### QA Deployment (qa.yml)

- **Trigger**: Automatically runs when pushing to any branch matching `qa/*`
- **Purpose**: Performs CI checks on QA code
- **Jobs**:
  - **CI**: Runs linting, type checking, testing, and building using reusable actions
  - **Deploy Web** (currently disabled): Would deploy the web application to the QA environment
  - **Publish Packages** (currently disabled): Would publish npm packages with the `qa` tag

### Beta Deployment (beta.yml)

- **Trigger**: Automatically runs on pull requests targeting the `main` branch (opened, synchronize, reopened)
- **Purpose**: Performs CI checks and deploys code to a staging environment for final pre-production testing
- **Jobs**:
  - **CI**: Runs linting, type checking, testing, and building using reusable actions
  - **Deploy Web**: Deploys the web application to the beta/staging environment using Railway with preview environment support. Posts deployment URL to PR comments.
  - **Publish Packages**: Publishes npm packages with the `beta` tag using the changelogs action. Does not create git tags or releases.

### Production Deployment (prod.yml)

- **Trigger**: Automatically runs when code is pushed directly to the `main` branch
- **Purpose**: Performs CI checks and deploys approved code to the live production environment
- **Jobs**:
  - **CI**: Runs linting, type checking, testing, and building using reusable actions
  - **Deploy Web**: Deploys the web application to production using Railway. Stores deployment URL in environment snapshot.
  - **Publish Packages**: Publishes npm packages with the `latest` tag using the changelogs action with auto release-type detection. Creates git tags and GitHub releases.

### Patch Deployment (patch.yml)

- **Trigger**: Automatically runs when pushing to any branch matching `patch/*`
- **Purpose**: Performs CI checks and allows quick deployment of critical hotfixes directly to production
- **Jobs**:
  - **CI**: Runs linting, type checking, testing, and building using reusable actions
  - **Deploy Web**: Deploys hotfixes to the production environment using Railway
  - **Publish Packages**: Updates package versions as patches and publishes with the `latest` tag using the changelogs action. Does not create git tags or releases.

### Create QA Branch (create-qa.yml)

- **Trigger**: Manually triggered through the GitHub Actions UI
- **Purpose**: Automates the creation of a QA branch from a development branch using the promotion engine
- **Inputs** (provided when triggering):
  - `dev_branch`: The development branch name (e.g., `dev/feature-login`) (required)
- **Validation**: Automatically validates that the source branch follows the `dev/*` naming convention
- **Implementation**: Uses the promotion engine (`.github/workflows/_promotion-engine.yml`) to create the QA branch and push it to remote

### Create Beta Release PR (create-beta.yml)

- **Trigger**: Manually triggered through the GitHub Actions UI
- **Purpose**: Automates the creation of a pull request to merge a QA branch into `main` for beta deployment using the promotion engine
- **Inputs** (provided when triggering):
  - `qa_branch`: The QA branch name (e.g., `qa/feature-name`) (required)
- **Validation**: Automatically validates that the source branch follows the `qa/*` naming convention
- **Implementation**: Uses the promotion engine (`.github/workflows/_promotion-engine.yml`) to create a PR from the QA branch to `main` with auto-generated title and description. Merging this PR triggers the beta deployment workflow

### Beta Cleanup (beta-cleanup.yml)

- **Trigger**: Automatically runs when a pull request targeting `main` is closed
- **Purpose**: Cleans up preview environments and beta packages after a PR is closed or merged
- **Jobs**:
  - **Cleanup Web**: Deletes the preview environment from Railway that was created for the beta deployment
  - **Cleanup Packages**: Placeholder for unpublishing beta packages (currently not implemented)

## Required GitHub Secrets

**⚠️ IMPORTANT: Set up GitHub App secrets BEFORE creating branch protection rules. These are required for all workflows to function properly.**

The following secrets can be configured in your GitHub repository settings under "Secrets and variables > Actions":

**GitHub App Secrets** (Optional - enhances security and attribution):

> **Note**: These secrets are **optional**. If not configured, all workflows will automatically fall back to using the default `github-actions[bot]` identity. However, using a GitHub App is **recommended** for production environments for better security and commit attribution.

- **`APP_CLIENT_ID`**: GitHub App Client ID for authentication across multiple workflows. Create a GitHub App in your repository settings to obtain this value. Used by: create-qa.yml, create-beta.yml, beta.yml, prod.yml, patch.yml, beta-cleanup.yml
- **`APP_PRIVATE_KEY`**: GitHub App private key for authentication. Download the private key file from your GitHub App settings. Used by: create-qa.yml, create-beta.yml, beta.yml, prod.yml, patch.yml, beta-cleanup.yml

#### How to Create a GitHub App for Branch Promotion, Deployment, and Package Publishing

1. **Navigate to GitHub App Settings**:
   - Go to your GitHub repository
   - Click **Settings** → **Developer settings** → **GitHub Apps**
   - Click **New GitHub App**

2. **Configure the App**:
   - **GitHub App name**: Enter a name like `release-bot`
   - **Homepage URL**: Enter your repository URL (e.g., `https://github.com/abhisin98/avivox-workspace`)
   - **Webhook**: Uncheck "Active" (not needed for this use case)
   - **Permissions**: Set the following permissions:
     - **Contents**: Read & write (required for creating branches, commits, and tags)
     - **Pull requests**: Read & write (required for creating and updating PRs)
   - **Where can this GitHub App be installed?**: Select "Only on this account"

3. **Create the App**: Click **Create GitHub App**

4. **Generate Private Key**:
   - On the app details page, scroll down to "Private keys" section
   - Click **Generate a private key**
   - A `.pem` file will download automatically
   - Keep this file secure

5. **Get the Client ID**:
   - On the app details page, look for **Client ID** (usually under "General" section)
   - Copy this value

6. **Configure Repository Secrets**:
   - Go to your repository → **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Add **`APP_CLIENT_ID`** with the value from step 5
   - Add **`APP_PRIVATE_KEY`** with the contents of the `.pem` file from step 4
   - Click **Add secret** for each

7. **Install the App**:
   - Go back to the GitHub App settings page
   - Click **Install App** (or go to **Install App** on the left sidebar)
   - Select your repository
   - Click **Install**

Your GitHub App is now configured for all CI/CD operations including branch promotion, deployments, PR comments, and changelog generation!

**After GitHub App setup, you can now proceed to create branch protection rules** (see "Branch Protection Rules Setup" section below).

**Railway Deployment & Package Publishing Secrets** (used by beta.yml, prod.yml, patch.yml, beta-cleanup.yml):

- **`RAILWAY_API_TOKEN`**: Authentication token for accessing the Railway API. Get this from your Railway account settings at <https://railway.com/account/tokens> (must be an account-level API token, NOT a project token). Required for: beta.yml, prod.yml, patch.yml, beta-cleanup.yml
- **`RAILWAY_PROJECT_ID`**: Unique identifier of the Railway project to deploy. Required for: beta.yml, prod.yml, patch.yml, beta-cleanup.yml
- **`RAILWAY_ENVIRONMENT_ID`**: Identifier of the target Railway environment (e.g., staging, production). Required for: beta.yml, prod.yml, patch.yml, beta-cleanup.yml
- **`RAILWAY_SERVICE_ID`**: Railway service ID used in Railway CLI commands. Required for: beta.yml, prod.yml, patch.yml, beta-cleanup.yml
- **`NPM_TOKEN`**: Authentication token for publishing packages to npm registry. Required for: beta.yml, prod.yml, patch.yml

**Note**: If GitHub App secrets (`APP_CLIENT_ID` and `APP_PRIVATE_KEY`) are not configured, workflows will automatically fall back to using the default `GITHUB_TOKEN` with the `github-actions[bot]` identity. For production environments, configuring GitHub App secrets is recommended for better security and more granular permission control.

## Step-by-Step Instructions for Developers and QA

### For Developers

1. **Start Development**:
   - Create a new branch from `main`: `git checkout -b dev/your-feature-name`
   - Make your changes and commit them

2. **Test in Development**:
   - Push your `dev/*` branch to trigger automatic deployment to the dev environment
   - Test your changes in the dev environment

3. **Move to QA**:
   - Use the "Create QA Branch" workflow (manually triggered) to automatically create a `qa/*` branch from your `dev/*` branch, or create one manually: `git checkout -b qa/release-name`
   - Merge your dev branch into the QA branch (if created manually)
   - Push the QA branch to trigger deployment to QA environment
   - Notify QA team for testing

4. **Prepare for Production**:
   - Create a pull request from your QA branch to `main` by either:
     - Using the "Create Beta Release PR" workflow (manually triggered) to automatically create a PR, or
     - Creating one manually through GitHub's UI
   - The PR will trigger beta deployment for final testing
   - After approval, merge the PR to `main`
   - This triggers production deployment

5. **Hotfixes**:
   - For urgent fixes: Create a `patch/*` branch from `main`
   - Make the fix and push to trigger immediate production deployment

### For QA Team

1. **Receive Notification**: When a `qa/*` branch is pushed, you'll get notified of the QA deployment
2. **Test in QA Environment**: Access the QA environment and perform thorough testing
3. **Report Issues**: If issues are found, report back to developers for fixes
4. **Approve for Production**: Once testing passes, approve the pull request to `main`
5. **Monitor Beta**: Check the beta deployment triggered by the PR for final validation

## Summary: Full Flow

Dev → QA → Beta → Prod → Patch (for hotfixes)

1. **Development** (`dev/*` branches)
   - Push to `dev/*` triggers CI (deploy and publish currently disabled)
   - Use "Create QA Branch" workflow to promote dev branch to QA
2. **QA Testing** (`qa/*` branches)
   - Push to `qa/*` triggers CI (deploy and publish currently disabled)
3. **Staging** (PR to `main`)
   - Create PR from `qa/*` to `main` using "Create Beta Release PR" workflow
   - Triggers beta deployment and package publishing with `beta` tag
   - Automatic cleanup of preview environment when PR is closed (beta-cleanup.yml)
4. **Production** (merge to `main`)
   - Merging PR to `main` triggers production deployment and package publishing with `latest` tag
5. **Hotfixes** (`patch/*` branches)
   - Push to `patch/*` triggers immediate production deployment (bypasses normal flow)
   - Packages published as patch releases with `latest` tag

This flow ensures thorough testing at each stage while allowing for quick hotfixes when necessary.
