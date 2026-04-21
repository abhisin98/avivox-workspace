## Commit Message Guidelines

### Template

Use this structure for commit messages:

```
type(scope): short description

* 🎯 First bullet: summary of change
* 💡 Second bullet: optional detail
* 🔧 Technical note or context

WHY: Motivation behind the change
Closes: <issue-number> (if applicable)
PROJ: <ticket-number> (if applicable)

BREAKING CHANGE: Describe breaking behavior (if applicable)
```

### Allowed types

- `feat` — A new feature
- `fix` — A bug fix
- `docs` — Documentation only changes
- `style` — Formatting, whitespace, etc. (no code logic changes)
- `refactor` — A code change that neither fixes a bug nor adds a feature
- `perf` — A code change that improves performance
- `test` — Adding missing tests or correcting existing tests
- `chore` — Build, tooling, or maintenance tasks
- `ci` — CI/CD configuration or scripts (e.g., GitHub Actions, Travis)
- `revert` — Revert commits

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Accepted scopes

- `infra` (deployment/infra changes)
- `docs` (documentation files)
- `config` (project-level configs like .gitignore, .editorconfig etc.)
- `build` (build system changes like webpack, vite, etc.)
- `deps` (dependency updates like package.json, lockfiles etc.)
- `tests` (test files, fixtures, mocks)
- `scripts` (helper scripts and automation utilities)
- `ci` (CI/CD pipeline configs .github/workflows/*, etc.)
- `security` (security patches, audits, policies)
- `release` (version bumps, changelog, publishing workflows)
- `web` (frontend app code apps/web/*)
- `ui`  (UI components packages/ui/*)
- `eslint-config` (ESLint configuration packages/eslint-config/*)
- `typescript-config` (TypeScript configuration packages/typescript-config/*)

Multiple scopes allowed: `type(scope-1, scope-2): description`

### Subject Rules

* Imperative, present tense: “add” not “added” or “adds”
* No capitalization at start
* No trailing period (.)
* Max length: 100 characters

### Body Rules

* Must start with a blank line
* Imperative, present tense
* Include motivation and contrast with previous behavior
* Add technical context when relevant
* Max line length: 120 characters

### Footer

* Must start with a blank line
* `Closes: #<issue-number>` → links issues
* `PROJ: <ticket-number>` → internal tracking
* `BREAKING CHANGE` → required keyword for major bumps

### Example

```
fix(ui): add dark mode toggle

* 🎯 Introduce dark mode option in settings
* 💡 Improve accessibility for low-light environments
* 🔧 Uses CSS variables for theme switching

WHY: Requested by multiple users for better UX
Closes: #456
PROJ: 1023
```

## Why This Matters

* **Consistency**: Commit types map directly to changelog groups.
* **Automation**: Breaking changes trigger major bumps, features trigger minor bumps.
* **Traceability**: Issue numbers and project tickets flow into changelogs automatically.
* **Reviewer-friendly**: Bullets + WHY section make intent crystal clear.

---

## Scope Decision Table

| File / Area                  | Recommended Scope | Example Commit Message |
|-------------------------------|-------------------|------------------------|
| `Dockerfile`, `docker-compose.yml` | **infra** | `feat(infra): add Dockerfile for local dev environment` |
| `k8s/*.yaml`, `terraform/*.tf`, `railway.json` | **infra** | `chore(infra): update Kubernetes manifests for staging` |
| `README.md`, `docs/*`, tutorials | **docs** | `docs: expand setup instructions for contributors` |
| `.gitignore`, `.editorconfig`, `.gitattributes`, `eslint.config.js`, `.eslintrc.*`, `tsconfig.json`, `jest.config.ts`, | **config** | `chore(config): update .gitignore to exclude build artifacts` |
| `webpack.config.js`, `vite.config.ts`, `rollup.config.js` | **build** | `refactor(build): optimize webpack bundle splitting` |
| `package.json`, `pnpm-lock.yaml`, `yarn.lock` | **deps** | `chore(deps): bump typescript to 5.3.2` |
| `tests/*`, mocks/fixtures` | **tests** | `test(tests): add coverage for auth middleware` |
| `scripts/*.sh`, `tools/*.js` | **scripts** | `chore(scripts): add shell script for changelog generation` |
| `.github/workflows/*`, `.travis.yml`, `azure-pipelines.yml` | **ci** | `ci: add rollback workflow for Railway deployments` |
| Security patches, audits, policies | **security** | `fix(security): patch vulnerable dependency in auth flow` |
| Version bumps, changelog updates | **release** | `chore(release): bump version to 1.2.0` |
| `apps/web/*` (frontend logic, routes) | **web** | `fix(web): correct routing issue in dashboard` |
| `packages/ui/*` (components, styles) | **ui** | `feat(ui): add dark mode toggle` |
| `packages/eslint-config/*` | **eslint-config** | `chore(eslint-config): enforce no-console rule` |
| `packages/typescript-config/*` | **typescript-config** | `chore(typescript-config): enable strictNullChecks` |

---

