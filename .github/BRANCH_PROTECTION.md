# Branch Protection Rules

This document describes the recommended branch protection rules for the Famebase repository.

## How to Set Up

Branch protection rules must be configured through the GitHub web interface:

1. Go to: https://github.com/Jeko92/famebase/settings/branches
2. Click "Add branch protection rule" for each branch below

## Main Branch Protection

**Branch name pattern:** `main`

### Required Settings:

- [x] **Require a pull request before merging**
  - [x] Require approvals: 1 (or more for team projects)
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners (optional, if CODEOWNERS file is added)

- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Required status checks:
    - `type-check`
    - `lint`
    - `build`

- [x] **Require conversation resolution before merging**

- [x] **Require signed commits**

- [x] **Require linear history**
  - This prevents merge commits and enforces rebase or squash merging

- [x] **Do not allow bypassing the above settings**
  - Even administrators must follow these rules

- [x] **Restrict pushes that create matching branches**
  - Only allow deployments from `develop` branch via pull requests

### Recommended Settings:

- [ ] Include administrators (optional - recommended for solo projects)
- [x] Allow force pushes: **Disabled**
- [x] Allow deletions: **Disabled**

## Develop Branch Protection

**Branch name pattern:** `develop`

### Required Settings:

- [x] **Require a pull request before merging**
  - [x] Require approvals: 1 (can be 0 for solo developer)
  - [ ] Dismiss stale pull request approvals when new commits are pushed

- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Required status checks:
    - `type-check`
    - `lint`
    - `build`

- [x] **Require conversation resolution before merging**

- [x] **Require signed commits**

- [ ] **Require linear history** (optional - can allow merge commits on develop)

### Recommended Settings:

- [ ] Include administrators (optional)
- [x] Allow force pushes: **Disabled** (or enable only for admins)
- [x] Allow deletions: **Disabled**

## Feature/Fix Branch Pattern

**Branch name patterns:** `feature/*` and `fix/*`

These branches typically don't need protection rules as they are short-lived and will be reviewed when merged into `develop`.

However, you can optionally require:
- [x] **Require signed commits**
- [x] Allow deletions after merge

## Notes

1. **Signed Commits**: All branches require signed commits to ensure code integrity and authenticity.

2. **Status Checks**: The CI/CD workflows (type-check, lint, build) must pass before merging. These will be automatically enforced once GitHub Actions are set up.

3. **Linear History on Main**: This ensures the main branch has a clean, linear commit history without merge commits. Merges to main should use "Squash and merge" or "Rebase and merge".

4. **PR Reviews**: Even for solo projects, requiring PRs ensures you review changes before they hit production.

5. **Update Branch Protection**: After setting up GitHub Actions (next step), ensure the workflow job names match the required status checks listed above.

## Testing Branch Protection

After setting up:
1. Try to push directly to `main` - it should be rejected
2. Try to push directly to `develop` - it should be rejected
3. Create a feature branch and open a PR - it should work
4. Try to merge a PR without passing checks - it should be blocked
5. Try to merge a PR without signed commits - it should be blocked