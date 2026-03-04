**Note:** This document outlines the release process for the Skip Go Widget and associated packages. While the repository is open source, this release process is managed internally by the ICL team.

# Skip Go Release Process

This repo uses a two-branch workflow (`staging` → `main`) with [Changesets](https://github.com/changesets/changesets) for versioning and automated npm publishing via GitHub Actions.

## Overview

```
Feature branch ──PR──► staging ──sync PR──► main ──auto PR──► merge ──► npm publish
                  ▲                                                          │
            add changeset                                                    ▼
                                                                  Consumer apps bump version
```

---

## Phase 1: Development (Feature Branch → Staging)

### 1. Create a feature branch off `staging`

All development work targets the `staging` branch.

```bash
git checkout staging
git pull origin staging
git checkout -b feat/my-feature
```

### 2. Make your changes

Implement the feature, bug fix, or refactor across the relevant packages (`@skip-go/client`, `@skip-go/widget`, or both).

### 3. Add a changeset

Every PR that affects a published package must include a changeset entry. From the repository root:

```bash
npx changeset
```

- Select the packages that changed (`@skip-go/client`, `@skip-go/widget`, or both)
- Choose the appropriate version bump:
  - **patch** — bug fixes, minor improvements, adding a chain already in the registry
  - **minor** — new backward-compatible features
  - **major** — breaking changes (rare, coordinate with the team)
- Write a clear, user-facing description of the change

This generates a markdown file inside `.changeset/`. Commit it with the rest of your changes.

### 4. Open a PR to `staging`

Push your branch and open a pull request targeting `staging`. CI will run:

- **Tests** (`tests.yml`) — client unit tests
- **Widget Tests** (`widget-tests.yml`) — Playwright e2e tests
- **ESLint** (`eslint.yml`) — linting for widget changes

Once approved, merge the PR into `staging`. Repeat this for as many features/fixes as needed before cutting a release.

---

## Phase 2: Release (Staging → Main → npm)

When `staging` has accumulated changes that are ready to ship:

### 5. Create a PR to sync `main` with `staging`

Open a pull request to merge `staging` into `main`. This PR represents the release itself — review it to confirm all the changes and changesets look correct.

### 6. Merge the sync PR

Once approved, merge the PR into `main`. This triggers the **Release** workflow (`publish.yml`), which uses `changesets/action` to:

1. Detect the pending changeset files
2. Automatically open a **"Version Packages"** PR that bumps version numbers in `package.json` files, updates `CHANGELOG.md` entries, and removes the consumed changeset files

### 7. Approve and merge the "Version Packages" PR

Review the auto-generated PR to confirm the version bumps and changelog entries are correct, then merge it. Merging this PR back into `main` triggers the publish step of the Release workflow:

- `yarn release` runs, which executes:
  1. `yarn build` — builds both `@skip-go/client` and `@skip-go/widget`
  2. `yarn workspace @skip-go/widget run pre` — pre-publish preparation
  3. `changeset publish` — publishes the updated packages to npm

The **Release Web Component** workflow (`release-web-component.yml`) also runs automatically when the commit message contains "Version Packages", publishing the widget web component build to npm.

### 8. Sync `main` back to `staging`

After `main` is updated, the **Sync (Staging)** workflow (`sync-staging.yml`) automatically opens a PR to merge `main` back into `staging`, keeping the two branches in sync. Approve and merge this PR.

---

## Phase 3: Consumer App Updates

### 9. Bump versions in consumer applications

After the new versions of `@skip-go/client` and/or `@skip-go/widget` are published to npm, any application that depends on them (e.g., `skip-go-app`) must update:

1. Update `@skip-go/widget` and/or `@skip-go/client` versions in `package.json`
2. Run `npm install` (or the relevant package manager install command)
3. Verify the app builds and works correctly with the new versions
4. Commit, push, and merge the update

Changes will not take effect in consumer apps until they update to the newly published package versions.

---

## Quick Reference

| Step | Action | Trigger |
|------|--------|---------|
| 1–4 | Develop on feature branch, add changeset, merge PR to `staging` | Manual |
| 5–6 | Create and merge PR syncing `staging` → `main` | Manual |
| 7 | "Version Packages" PR is auto-generated | Automatic (on push to `main`) |
| 7 | Approve and merge "Version Packages" PR | Manual |
| 7 | Packages published to npm | Automatic (on merge of Version Packages PR) |
| 8 | `main` → `staging` sync PR is auto-generated | Automatic |
| 9 | Consumer apps bump dependency versions | Manual |

## Relevant Workflows

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| Release | `publish.yml` | Push to `main` | Creates Version Packages PR or publishes to npm |
| Release Web Component | `release-web-component.yml` | Push to `main` (commit msg contains "Version Packages") | Publishes web component build |
| Sync (Staging) | `sync-staging.yml` | Push to `main` | Opens PR to sync `main` back to `staging` |
| Tests | `tests.yml` | PR or push to `main`/`staging` | Runs client tests |
| Widget Tests | `widget-tests.yml` | PR or push to `main`/`staging` | Runs Playwright e2e tests |
| ESLint | `eslint.yml` | PR touching `packages/widget/` | Lints widget code |
