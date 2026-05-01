# 🤖 AI Commit Generation Rules (Avivox Workspace)

This file defines the official AI commit generation system for Avivox Workspace.

It ensures:
- Strict Conventional Commits
- Perfect compatibility with commitlint.config.js
- Full alignment with cliff.toml
- Deterministic AI-generated commit messages
- Monorepo scope support
- CI-safe automation

---

# 🎯 Purpose

AI systems MUST generate commit messages that are:

- Human-readable
- Machine-parseable
- Changelog-ready
- CI-valid
- Deterministic

---

# 📌 1. Required Commit Format

<type>(<scope>): <subject>

Example:
feat(api): add OAuth2 authentication middleware
fix(web): resolve login redirect loop

---

# ⚠️ 2. Breaking Change Format

Option A:
feat(api)!: redesign authentication system

Option B:
feat(api): redesign authentication system

BREAKING CHANGE: old authentication endpoints removed

---

# 🧩 3. Allowed Types

feat     - New feature
fix      - Bug fix
docs     - Documentation
style    - Formatting only
refactor - Internal restructuring
perf     - Performance improvements
test     - Tests
build    - Build system
ci       - CI/CD
chore    - Maintenance
revert   - Rollback

Any other type is INVALID

---

# 📦 4. Allowed Scopes (Monorepo)

- api
- web
- cli
- core
- docs
- release
- ci
- deps
- shared
- monorepo

---

# 📏 5. Subject Rules

MUST:
- lowercase
- descriptive
- 10–100 characters
- explain what changed
- avoid ambiguity

MUST NOT:
- end with period
- use vague words:
  - update
  - improve
  - changes
  - fix stuff
  - misc
  - code
  - work

---

# ❌ Invalid AI Outputs

update
fix stuff
improve api
changes
misc

---

# ✅ Valid AI Outputs

feat(api): add OAuth2 authentication middleware
fix(web): resolve login redirect loop
perf(core): reduce cache hydration time
refactor(cli): simplify command loader
docs(monorepo): update workspace guide
ci(ci): optimize GitHub Actions caching

---

# 🧠 6. AI Decision Matrix

New capability      -> feat
Bug/error fix       -> fix
Docs only           -> docs
Formatting only     -> style
Internal cleanup    -> refactor
Speed improvement   -> perf
Tests               -> test
Build tooling       -> build
CI pipeline         -> ci
Maintenance         -> chore
Rollback            -> revert

---

# 🔄 7. AI Generation Workflow

1. Identify primary change
2. Choose valid type
3. Choose valid scope
4. Write clear subject
5. Validate lowercase
6. Validate banned words
7. Validate length
8. Check breaking change
9. Output final commit

---

# 🔗 8. Changelog Mapping

feat      -> 🆕 Features
fix       -> 🐛 Fixes
perf      -> ⚡ Performance
refactor  -> 🔧 Refactoring
docs      -> 📚 Documentation
build     -> 🏗️ Build System
ci        -> 🔄 CI/CD
chore     -> 🧹 Chores
revert    -> ⏪ Reverts
BREAKING  -> ⚠️ Breaking Changes

---

# 🛡️ 9. Validation Checklist

Before output, AI MUST verify:

- Valid type
- Valid scope
- Correct format
- Lowercase
- No trailing punctuation
- Length valid
- No vague wording
- Changelog compatible
- CI compatible

---

# 🚨 10. Breaking Change Conditions

Mark as BREAKING if:
- API contracts changed
- Endpoints removed
- Database schema incompatible
- Package exports removed
- CLI syntax changed incompatibly

---

# 🧪 11. Golden Rule

If the commit message requires guessing, it is INVALID.

Good:
fix(api): resolve token refresh race condition

Bad:
fix api

---

# 🤖 12. AI Prompt Template

Generate a strict Conventional Commit for Avivox Workspace.

Rules:
- Format: <type>(<scope>): <subject>
- Lowercase only
- No vague wording
- No trailing period
- 10–100 chars
- Allowed types/scopes only
- Breaking changes use ! or BREAKING CHANGE:

Output ONLY the final commit message.

---

# 🧠 13. System Consistency Rule

This file MUST remain aligned with:

- commitlint.config.js
- commit-message-guidelines.md
- cliff.toml

No mismatched commit types
No undocumented scope
No parser conflicts

One unified schema

---

# 🚀 Final Rule

Every AI-generated commit must pass lint, generate clean changelogs, and require zero human correction.
