# GitHub Actions Workflows

This directory contains GitHub Actions workflows for continuous integration, testing, and deployment of the monorepo.

## Overview of the CI/CD Pipeline

Our CI/CD pipeline automates the process of building, testing, and deploying our monorepo applications and packages. It ensures code quality through linting, type checking, and testing, then deploys to various environments based on branch patterns. The pipeline uses pnpm for package management and Turbo for efficient caching.

## Reusable Actions

We use GitHub composite actions to standardize common steps across workflows:

- **Setup Action** (`.github/actions/setup`): Prepares the environment by setting up Pnpm, Node.js, installing dependencies, building packages, and restoring Turbo cache.
- **CI Action** (`.github/actions/ci`): Performs linting, type checking, testing, and building. Can be configured to skip specific steps if needed.

## Branching Strategy

We follow a structured branching strategy to manage deployments across different environments:

- **`main`**: The production branch. Merging here triggers CI checks and production deployment.
- **`dev/*`**: Development branches (e.g., `dev/feature-name`). Used for initial development and testing. Triggers deployment to the development environment.
- **`qa/*`**: QA branches (e.g., `qa/feature-name`). Used for quality assurance testing. Triggers deployment to the QA environment.
- **`patch/*`**: Hotfix branches (e.g., `patch/security-fix`). Used for urgent production fixes. Triggers patch deployment directly to production.
- **Pull Requests to `main`**: Triggers beta deployment for staging and final testing before production.

## How Each Workflow Works

### Dev Deployment (dev.yml)
- **Trigger**: Automatically runs when pushing to any branch matching `dev/*`
- **Purpose**: Performs CI checks and deploys code to the development environment for initial testing
- **Jobs**:
  - **CI**: Runs linting, type checking, testing, and building using reusable actions
  - **Deploy Web**: Deploys the web application to the dev environment
  - **Publish Packages**: Publishes npm packages with the `dev` tag for testing

### QA Deployment (qa.yml)
- **Trigger**: Automatically runs when pushing to any branch matching `qa/*`
- **Purpose**: Performs CI checks and deploys code to the QA environment for comprehensive testing
- **Jobs**:
  - **CI**: Runs linting, type checking, testing, and building using reusable actions
  - **Deploy Web**: Deploys the web application to the QA environment
  - **Publish Packages**: Publishes npm packages with the `qa` tag

### Beta Deployment (beta.yml)
- **Trigger**: Automatically runs on pull requests targeting the `main` branch
- **Purpose**: Performs CI checks and deploys code to a staging environment for final pre-production testing
- **Jobs**:
  - **CI**: Runs linting, type checking, testing, and building using reusable actions
  - **Deploy Web**: Deploys the web application to the beta/staging environment
  - **Publish Packages**: Publishes npm packages with the `beta` tag

### Production Deployment (prod.yml)
- **Trigger**: Automatically runs when code is pushed directly to the `main` branch
- **Purpose**: Performs CI checks and deploys approved code to the live production environment
- **Jobs**:
  - **CI**: Runs linting, type checking, testing, and building using reusable actions
  - **Deploy Web**: Deploys the web application to production
  - **Publish Packages**: Publishes npm packages with the `latest` tag

### Patch Deployment (patch.yml)
- **Trigger**: Automatically runs when pushing to any branch matching `patch/*`
- **Purpose**: Performs CI checks and allows quick deployment of critical fixes directly to production
- **Jobs**:
  - **CI**: Runs linting, type checking, testing, and building using reusable actions
  - **Deploy Web**: Deploys hotfixes to the production environment
  - **Publish Packages**: Updates package versions and publishes with the `latest` tag

### Create QA Branch (create-qa.yml)
- **Trigger**: Manually triggered through the GitHub Actions UI
- **Purpose**: Automates the creation of a QA branch from a development branch
- **Inputs** (provided when triggering):
  - `dev_branch`: The development branch name (e.g., `dev/feature-login`) (required)
- **Jobs**:
  - **Create QA Branch**: Fetches the dev branch, creates a corresponding QA branch (replacing `dev/` with `qa/`), and pushes it to the remote

### Create Beta Release PR (create-beta.yml)
- **Trigger**: Manually triggered through the GitHub Actions UI
- **Purpose**: Automates the creation of a pull request to merge a QA branch into `main` for beta deployment
- **Inputs** (provided when triggering):
  - `qa_branch`: The QA branch name (e.g., `qa/feature-name`) (required)
- **Jobs**:
  - **Create Beta PR**: Creates a pull request from the specified QA branch to `main` with auto-generated title and description. Merging this PR triggers the beta deployment workflow.

### Rollback (rollback.yml)
- **Trigger**: Manually triggered through the GitHub Actions UI
- **Purpose**: Reverts deployments and package versions in case of issues
- **Inputs** (provided when triggering):
  - `deploy_id`: The deployment ID to rollback to (required)
  - `npm_version`: The npm version to rollback to (optional)
- **Jobs**:
  - **Rollback**: Redeploys a previous Railway build and optionally re-publishes an npm version

## Required GitHub Secrets

The following secrets must be configured in your GitHub repository settings under "Secrets and variables > Actions":

- **`RAILWAY_API_TOKEN`**: Authentication token for accessing the Railway API.
- **`RAILWAY_PROJECT_ID`**: Unique identifier of the Railway project to deploy.
- **`RAILWAY_ENVIRONMENT_ID`**: Identifier of the target Railway environment (e.g., staging, production).
- **`GITHUB_TOKEN`**: Default GitHub Actions token used for committing, tagging, and pushing changes.
- **`NPM_TOKEN`**: Authentication token for publishing packages to npm registry

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

## Rollback Instructions

If a deployment causes issues in production:

1. Go to the GitHub repository
2. Navigate to the "Actions" tab
3. Find the "Rollback Release" workflow
4. Click "Run workflow"
5. Fill in the inputs:
   - **deploy_id**: The ID of the deployment you want to rollback to (find this in Railway dashboard)
   - **npm_version**: (Optional) The npm version to rollback to, if package rollback is needed
6. Click "Run workflow" to execute the rollback

## Summary: Full Flow

Dev → QA → Beta → Prod → Patch → Rollback

1. **Development** (`dev/*` branches) → **Dev Environment**
   - Use "Create QA Branch" workflow to promote dev branch to QA
2. **QA Testing** (`qa/*` branches) → **QA Environment**
3. **Staging** (PR to `main`) → **Beta Environment**
   - Use "Create Beta Release PR" workflow to promote QA branch to main
4. **Production** (merge to `main`) → **Production Environment**
5. **Hotfixes** (`patch/*` branches) → **Production Environment** (bypasses normal flow)
6. **Rollback** (manual) → Reverts to previous stable state

This flow ensures thorough testing at each stage while allowing for quick hotfixes when necessary.