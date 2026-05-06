export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Architecture", href: "/architecture" },
  { label: "Workflow", href: "/workflow" },
];

export const heroItems = [
  {
    title: "Monorepo-first engineering",
    description: "A single source of truth for apps, design tokens, lint rules, and TypeScript policies across the workspace.",
  },
  {
    title: "Component-driven system",
    description: "Reusable UI lives inside packages/ui while the app layer stays focused on page composition and product flow.",
  },
  {
    title: "Quality by default",
    description: "Protected branches, automation pipelines, and review discipline secure each release from dev to prod.",
  },
];

export const architectureCards = [
  {
    title: "apps/web",
    description: "Next.js application built for modern SaaS presentation, importing only reusable UI from packages/ui.",
  },
  {
    title: "packages/ui",
    description: "A Tailwind-first component library with design primitives, layout patterns, and developer-facing building blocks.",
  },
  {
    title: "packages/eslint-config",
    description: "Shared lint rules to maintain consistent quality, catch issues early, and enforce workspace conventions.",
  },
  {
    title: "packages/typescript-config",
    description: "Centralized TypeScript settings for app and package builds, with strict typing and modern compiler policies.",
  },
];

export const workflowSteps = [
  {
    title: "Development",
    description: "Feature branches are scoped, reviewed, and validated locally before push. Small changes move fast with dedicated UI primitives.",
  },
  {
    title: "QA",
    description: "Automated checks and preview environments verify integration, accessibility, and code hygiene before wider testing.",
  },
  {
    title: "Beta",
    description: "Release candidates are staged with branch protection and integration signoff before final promotion.",
  },
  {
    title: "Production",
    description: "Merged releases flow through guarded branches and deploy with confidence, backed by repeatable automation.",
  },
];

export const branchRules = [
  {
    name: "main",
    policy: "Protected branch with required reviews and passing CI before merge.",
  },
  {
    name: "beta",
    policy: "Staging channel for release candidates, guarding quality before production promotion.",
  },
  {
    name: "dev",
    policy: "Active development branch for feature integration and early validation.",
  },
];

export const automationCards = [
  {
    title: "GitHub Actions pipelines",
    description: "Checks run on every push, enforcing linting, type safety, build integrity, and workspace dependency consistency.",
  },
  {
    title: "Release automation",
    description: "Structured deployment flow from dev to prod with versioned packages and artifact validation.",
  },
  {
    title: "Branch protection",
    description: "Guarded merges, required approvals, and quality gates keep the repository stable at every stage.",
  },
];

export const trustItems = [
  {
    label: "Design system",
    value: "packages/ui",
  },
  {
    label: "Lint rules",
    value: "packages/eslint-config",
  },
  {
    label: "Type safety",
    value: "packages/typescript-config",
  },
  {
    label: "App composition",
    value: "apps/web",
  },
];

export const architectureHighlights = [
  {
    title: "Reusable component philosophy",
    description: "Build once, use everywhere. UI behavior, spacing, and typography are driven by Tailwind utility patterns inside packages/ui.",
  },
  {
    title: "Monorepo boundaries",
    description: "Application code imports stable design primitives. Shared package logic lives outside page-level concerns.",
  },
  {
    title: "Production-ready structure",
    description: "A clean separation between app experience, design system, lint config, and TypeScript rules for scale.",
  },
];
