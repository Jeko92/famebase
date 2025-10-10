# Git Flow Workflow Guide

This document provides a comprehensive guide to the Git Flow workflow used in the Famebase project.

## Table of Contents

- [Branch Structure](#branch-structure)
- [Workflow Steps](#workflow-steps)
- [Common Scenarios](#common-scenarios)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Branch Structure

### Main Branches

#### `main` Branch
- **Purpose**: Production-ready code
- **Protection**: Highly protected, requires PR approval
- **Deployment**: Automatically synced with live webapp
- **Commits**: Only via PR from `develop`
- **History**: Linear (no merge commits)

#### `develop` Branch
- **Purpose**: Integration branch for features
- **Protection**: Protected, requires passing CI checks
- **Source**: Created from `main`
- **Target**: Features and fixes merge here
- **Deployment**: Staging environment (optional)

### Supporting Branches

#### Feature Branches (`feature/issueN-description`)
- **Purpose**: Develop new features
- **Created from**: `develop`
- **Merged into**: `develop`
- **Naming**: `feature/42-add-search-functionality`
- **Lifetime**: Until feature is complete and merged

#### Fix Branches (`fix/issueN-description`)
- **Purpose**: Fix bugs
- **Created from**: `develop`
- **Merged into**: `develop`
- **Naming**: `fix/43-resolve-login-bug`
- **Lifetime**: Until fix is complete and merged

## Workflow Steps

### 1. Starting a New Feature

```bash
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Create GitHub issue first (e.g., issue #42)

# Create feature branch
git checkout -b feature/42-add-search-functionality

# Start coding...
```

### 2. Making Commits

```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat(influencers): add search functionality

Implement full-text search with filters for platforms,
location, and engagement metrics.

Closes #42"

# Push to remote
git push origin feature/42-add-search-functionality
```

### 3. Creating a Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. **Base branch**: `develop` (NOT `main`)
4. **Compare branch**: `feature/42-add-search-functionality`
5. Fill in PR template:
   - Title: `feat(influencers): add search functionality`
   - Reference issue: `Closes #42`
   - Describe changes
   - Add screenshots if applicable
6. Wait for CI checks to pass
7. Request review if needed
8. Merge when approved

### 4. Merging to Develop

```bash
# After PR approval and CI passes
# Use GitHub's "Squash and merge" or "Rebase and merge"
# Delete feature branch after merge
```

### 5. Releasing to Production

```bash
# When develop is stable and ready for release
git checkout develop
git pull origin develop

# Create release PR from develop to main
# On GitHub:
# Base: main
# Compare: develop
# Title: "release: version X.X.X"

# After approval and CI passes, merge to main
# main is automatically deployed to production
```

### 6. After Release

```bash
# Optional: Create a git tag for the release
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Continue development on develop
git checkout develop
```

## Common Scenarios

### Scenario 1: Working on Multiple Features

```bash
# Feature 1
git checkout develop
git checkout -b feature/42-search
# ... work on feature 1 ...

# Switch to Feature 2
git checkout develop
git checkout -b feature/43-export-csv
# ... work on feature 2 ...

# Switch back to Feature 1
git checkout feature/42-search
# ... continue work ...
```

### Scenario 2: Updating Feature Branch with Latest Develop

```bash
# Your feature branch is behind develop
git checkout develop
git pull origin develop

git checkout feature/42-search
git rebase develop
# Or: git merge develop

# Resolve conflicts if any
git push --force-with-lease origin feature/42-search
```

### Scenario 3: Fixing a Bug

```bash
# Create bug fix branch
git checkout develop
git checkout -b fix/44-login-timeout

# Fix the bug
git add .
git commit -m "fix(auth): resolve login timeout issue

Update session handling to prevent timeout errors
during authentication.

Closes #44"

# Push and create PR
git push origin fix/44-login-timeout
```

### Scenario 4: Hotfix on Production

```bash
# Critical bug in production that can't wait for develop
git checkout main
git checkout -b hotfix/critical-security-fix

# Fix the issue
git add .
git commit -m "security(auth): patch critical vulnerability

SECURITY: Fix SQL injection vulnerability in login endpoint.

Closes #45"

# Create PR to main
git push origin hotfix/critical-security-fix

# After merging to main, also merge to develop
git checkout develop
git merge main
git push origin develop
```

## Best Practices

### Commit Messages

✅ **Good Examples:**
```
feat(influencers): add export to CSV functionality
fix(database): resolve connection pool exhaustion
docs(readme): update installation instructions
refactor(api): simplify influencer query logic
```

❌ **Bad Examples:**
```
Added stuff
Fixed bug
WIP
Update
```

### Branch Naming

✅ **Good Examples:**
```
feature/42-add-search-functionality
fix/43-resolve-login-bug
feature/44-implement-analytics-dashboard
```

❌ **Bad Examples:**
```
my-feature
fix
dev
temp-branch
```

### Pull Requests

✅ **Best Practices:**
- Create issue first, then branch
- Reference issue in PR description
- Keep PRs focused and small
- Ensure CI checks pass before requesting review
- Respond to review feedback promptly
- Delete branch after merge

❌ **Avoid:**
- Large PRs with multiple unrelated changes
- Merging PRs with failing CI checks
- Force pushing to shared branches
- Leaving stale branches

### Code Review

- Review your own code before requesting review
- Run all checks locally first
- Test your changes thoroughly
- Update documentation if needed
- Add screenshots for UI changes

## Troubleshooting

### Problem: PR checks failing

**Solution:**
```bash
# Run checks locally
pnpm type-check
pnpm lint
pnpm build

# Fix any errors, then commit and push
git add .
git commit -m "fix(config): resolve linting errors"
git push origin feature/42-search
```

### Problem: Merge conflicts

**Solution:**
```bash
# Update your branch with latest develop
git checkout develop
git pull origin develop

git checkout feature/42-search
git rebase develop

# Resolve conflicts in your editor
# After resolving each file:
git add <resolved-file>

# Continue rebase
git rebase --continue

# Force push (safe with --force-with-lease)
git push --force-with-lease origin feature/42-search
```

### Problem: Accidentally committed to wrong branch

**Solution:**
```bash
# If you committed to develop instead of feature branch
git checkout develop
git log  # Note the commit hash

git reset --hard HEAD~1  # Remove the commit

git checkout -b feature/42-new-feature
git cherry-pick <commit-hash>  # Apply the commit here
git push origin feature/42-new-feature
```

### Problem: Need to update commit message

**Solution:**
```bash
# For the last commit (not yet pushed)
git commit --amend

# For commits already pushed (use with caution)
git rebase -i HEAD~3  # Last 3 commits
# Change 'pick' to 'reword' for commits to update
# Follow prompts to update messages

git push --force-with-lease origin feature/42-search
```

## Workflow Diagram

```
main (production)
  |
  |-- develop (integration)
       |
       |-- feature/42-search
       |
       |-- fix/43-login-bug
       |
       |-- feature/44-analytics
```

**Flow:**
1. `feature/42-search` → PR → `develop`
2. `fix/43-login-bug` → PR → `develop`
3. `feature/44-analytics` → PR → `develop`
4. `develop` → PR → `main` (release)

## Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow Original Article](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)

## Questions?

If you have questions about the workflow, please:
1. Check this document first
2. Review CONTRIBUTING.md
3. Open a discussion on GitHub
4. Create an issue for clarifications