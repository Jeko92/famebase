# Contributing to Addfame Famebase

Thank you for your interest in contributing to Addfame Famebase! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/addfame-famebase.git`
3. Install dependencies: `pnpm install`
4. Create a feature branch from `develop`: `git checkout develop && git checkout -b feature/issue123-your-feature`

## Git Flow Branching Strategy

This project follows Git Flow workflow:

### Branch Structure

- **`main`** - Production branch, always deployable, synced with live webapp
- **`develop`** - Main development branch where features are integrated
- **`feature/issueN-description`** - Feature branches created from `develop`
- **`fix/issueN-description`** - Bug fix branches created from `develop`

### Workflow

1. **Create an Issue** on GitHub first
2. **Create a branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/42-add-search
   # or
   git checkout -b fix/43-login-bug
   ```

3. **Work on your changes** and commit using conventional commits

4. **Push your branch**:
   ```bash
   git push origin feature/42-add-search
   ```

5. **Create a Pull Request** against `develop` branch
   - All PRs must go to `develop`, never directly to `main`
   - Reference the issue number in PR description
   - Wait for CI/CD checks to pass

6. **Merge to develop** after approval

7. **Release to production**: When `develop` is ready, create a PR from `develop` to `main`

## Development Workflow

### Setting Up Your Environment

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Set up database
pnpm --filter database db:push
pnpm --filter database db:seed

# Start development server
pnpm dev
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

## Commit Message Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

For detailed information see [Commit Messages](https://www.conventionalcommits.org/).

Available types and scopes are also defined in the `conventionalcommit.json` file in the root of the project to support the Conventional Commit plugin for JetBrains IDEs.

### Commit Message Format

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

The **header** is mandatory and must conform to the format.

#### Examples

```
feat(influencers): add search functionality

Implement full-text search for influencer profiles with filters
for platforms, location, and engagement metrics.

Closes #123
```

```
fix(database): resolve connection pool exhaustion

Update Prisma client configuration to properly handle connection
limits in production environment.
```

```
docs(readme): update installation instructions
```

### Types

| Type | Description |
|------|-------------|
| `build` | Changes which affect the build system or external dependencies (e.g. vite, pnpm) |
| `chore` | Changes which are not user-facing (see Note) |
| `ci` | Changes which affect CI configuration files and scripts |
| `docs` | Changes which affect documentation |
| `feat` | Changes which introduce a new feature |
| `fix` | Changes which patch a bug |
| `perf` | Changes which improve performance |
| `refactor` | Changes which neither fix a bug nor add a feature |
| `revert` | Changes which revert a previous commit (see Revert Commits) |
| `security` | Changes which improve security |
| `style` | Changes which do not affect code logic, such as white-spaces, formatting |
| `test` | Changes which add missing tests or correct existing tests |

### Scopes

| Scope | Description |
|-------|-------------|
| `web` | Changes to the web application |
| `database` | Changes to database schema, migrations, or utilities |
| `ui` | Changes to shared UI components |
| `config` | Changes to configuration files |
| `deps` | Dependency updates |
| `influencers` | Changes related to influencer features |
| `campaigns` | Changes related to campaign features |
| `api` | Changes to API routes and endpoints |
| `auth` | Changes to authentication and authorization |
| `images` | Changes to image handling and storage |

### Subject

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end
- Limit to 72 characters or less

### Body

The body should include the motivation for the change and contrast this with previous behavior.

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Wrap lines at 72 characters

### Footer

The footer should contain any information about **Breaking Changes** and references to issues that the commit closes.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.

```
feat(api): change influencer endpoint response format

BREAKING CHANGE: The /api/influencers endpoint now returns data in a
different format. Update client code accordingly.

The response structure has changed from:
- { influencers: [...] }
To:
- { data: [...], meta: {...} }

Closes #456
```

### Revert Commits

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit.

The body should contain:
- Information about the SHA of the commit being reverted in the following format: `This reverts commit <SHA>.`
- A clear description of the reason for reverting the commit

```
revert: feat(campaigns): add batch operations

This reverts commit 1234567890abcdef.

Reverting due to performance issues in production.
```

## Pull Request Process

1. **Create a feature/fix branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/issue42-add-search
   ```

2. **Make your changes** following the code style guidelines

3. **Run checks** before committing:
   ```bash
   pnpm type-check
   pnpm lint
   ```

4. **Commit your changes** using conventional commits:
   ```bash
   git add .
   git commit -m "feat(influencers): add search functionality"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/issue42-add-search
   ```

6. **Create a Pull Request** on GitHub:
   - **Target branch**: `develop` (NOT `main`)
   - Provide a clear title following conventional commit format
   - Reference the issue: `Closes #42`
   - Ensure all CI checks pass

7. **Address review feedback** if requested

8. **Merge** once approved and CI passes

### Pull Request Title

Pull request titles must follow conventional commit format:

```
feat(influencers): add export to CSV functionality
```

### CI/CD Checks

All PRs to `develop` must pass:
- Type checking
- Linting
- Build verification

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define proper types; avoid `any`
- Use interfaces for object shapes
- Use type aliases for unions and primitives

### React/Next.js

- Use functional components with hooks
- Prefer server components when possible
- Use proper TypeScript types for props
- Keep components focused and small

### Formatting

This project uses Prettier for code formatting. Run `pnpm format` to format your code automatically.

### Linting

This project uses ESLint. Run `pnpm lint` to check for linting errors.

### Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions/Variables**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`UserData`, `ProfileProps`)

## Questions?

If you have any questions, please open an issue or reach out to the maintainers.

Thank you for contributing!