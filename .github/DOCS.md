# GitHub Documentation Index

Welcome to the GitHub documentation for this project. Here you'll find guides on branch protection rules and CI/CD workflows.

---

## 📋 Documentation Files

### [Branch Protection Rules](BRANCH-PROTECTION.md)

Learn how to set up branch protection rules for a small team. This guide covers:
- What branch protection rules are and why we use them
- Step-by-step setup for `main`, `dev/*`, `qa/*`, and `patch/*` branches
- GitHub App bypass permissions explained
- Team roles and permissions
- Troubleshooting common issues

**Start here if:** You need to configure branch protection rules or understand why certain checks are required.

---

### [Workflow Guide](WORKFLOW-GUIDE.md)

Understand how our CI/CD pipeline works. This guide covers:
- Overview of the CI/CD pipeline
- Reusable actions and workflows
- How each workflow (dev, qa, beta, prod, patch) works
- Required GitHub secrets and setup
- Step-by-step instructions for developers and QA

**Start here if:** You want to understand how code flows through development, testing, and production environments.

---

## 🚀 Quick Links

- **All workflows**: See `.github/workflows/` directory
- **GitHub Actions**: Our pipeline is built on GitHub Actions
- **Repository**: https://github.com/abhisin98/avivox-workspace

---

## 📖 Getting Started

If you're new to the project:

1. Read the [Branch Protection Rules](BRANCH-PROTECTION.md) guide to understand protection policies
2. Read the [Workflow Guide](WORKFLOW-GUIDE.md) to understand how code flows through the system
3. Follow [Workflow Guide - Step-by-Step Instructions](WORKFLOW-GUIDE.md#step-by-step-instructions-for-developers-and-qa) to start contributing

---

**Questions?** Ask your team lead or request updates to these guides if something is unclear.
