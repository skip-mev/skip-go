# Local Development — Skip Go

## Prerequisites

- **Node.js** (v18+)
- **Yarn** (v3.2.0, included via `corepack`)
- **Git** (with submodule support)

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/skip-mev/skip-go.git
cd skip-go

# Install dependencies (also initializes submodules and installs Playwright)
yarn install

# Start all dev servers
yarn dev
```

The `postinstall` script automatically runs `git submodule update --init --recursive` and `yarn playwright install`.

---

## Workspace Structure

The project uses Yarn workspaces:

```
skip-go/
├── packages/
│   ├── client/          # @skip-go/client
│   └── widget/          # @skip-go/widget
├── apps/
│   └── explorer/        # Next.js demo app
├── examples/
│   ├── nextjs/          # Next.js integration example
│   ├── nuxtjs/          # Nuxt.js integration example
│   ├── client/          # Headless client example
│   └── raw-html.html    # Web component example
└── vendor/              # Go vendored dependencies
```

---

## Development Scripts

### Root Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `yarn dev` | Runs widget, nextjs, client, explorer in parallel | Full dev environment |
| `yarn dev:widget` | `packages/widget` Vite dev server | Widget development |
| `yarn dev:client` | `packages/client` tsup watch | Client development |
| `yarn dev:nextjs` | `examples/nextjs` Next.js dev | Example app |
| `yarn dev:explorer` | `apps/explorer` Next.js dev | Explorer app |
| `yarn build` | Build client → widget → nextjs | Full production build |
| `yarn build:client` | tsup (ESM + CJS) | Build client package |
| `yarn build:widget` | Vite lib build | Build widget package |
| `yarn test` | Client unit tests (Vitest) | Run client tests |
| `yarn test-widget` | Widget E2E tests (Playwright) | Run widget tests |
| `yarn codegen` | Generate protobuf types | Update generated code |
| `yarn update-registries` | Update chain-registry and initia-registry | Refresh chain data |
| `yarn release` | Build + changeset publish | Publish to npm |

### Widget Scripts

| Script | Purpose |
|--------|---------|
| `yarn dev` | Vite dev server with HMR (`--force --host`) |
| `yarn dev:visual-test` | Dev server with `VISUAL_TEST=true` for Playwright |
| `yarn build` | Production build (generates chains first) |
| `yarn build:web-component` | Webpack build for `<skip-widget>` web component |
| `yarn generate-chains` | Generate Cosmos chain configs from registries |
| `yarn lint` | ESLint with auto-fix |
| `yarn test` | Playwright E2E tests |
| `yarn update-screenshots` | Update visual regression baselines |

### Client Scripts

| Script | Purpose |
|--------|---------|
| `yarn build` | Run codegen + tsup build |
| `yarn watch` | tsup watch mode for development |
| `yarn test` | Vitest unit tests |
| `yarn codegen` | Generate protobuf types |
| `yarn update-types` | Regenerate Swagger types |
| `yarn e2e:setup` | Set up Kind cluster + Helm |
| `yarn e2e:start` | Start local devnet |
| `yarn e2e:test` | Run E2E tests against devnet |
| `yarn e2e:stop` | Stop local devnet |

---

## Build System

### Widget

**Build tool:** Vite (library mode)

| Setting | Value |
|---------|-------|
| Entry | `src/index.tsx` |
| Output | `build/` (ES module) |
| Aliases | `@` → `./src` |
| Plugins | React, DTS generation, Node polyfills |
| Externals | All dependencies + peer deps |

**Web component build:** Webpack

| Setting | Value |
|---------|-------|
| Entry | `src/web-component.tsx` |
| Output | `web-component/build/index.js` (ES module) |
| Loader | `ts-loader` |
| Polyfills | `NodePolyfillPlugin` |

### Client

**Build tool:** tsup

| Setting | Value |
|---------|-------|
| Entries | `src/index.ts`, `src/api/*`, `src/public-functions/*` |
| Formats | ESM (`dist/esm/`) + CJS (`dist/cjs/`) |
| Externals | All dependencies, peer deps, cosmjs, solana, viem |

---

## Dev Mode

**File:** `packages/widget/src/devMode/loadWidget.tsx`

When running `yarn dev` in the widget package, a dev mode UI is served at `http://localhost:5173/`. This is the primary URL used during day-to-day development. The dev UI is mounted with:

- Theme toggle (dark/light)
- API URL switcher (prod/dev)
- Testnet toggle
- Shadow DOM toggle
- Web component toggle
- Reset and set asset buttons
- Route configuration

This uses `index.html` at the widget package root as the entry point.

---

## Code Generation

### Chain Configs

```bash
cd packages/widget && yarn generate-chains
```

**File:** `packages/widget/scripts/generate-chains.cjs`

Reads from `chain-registry` and `@initia/initia-registry` npm packages to generate:

- `src/constants/cosmosChains/mainnet.json` — Mainnet chain configs
- `src/constants/cosmosChains/testnet.json` — Testnet chain configs
- `src/constants/cosmosChains/explorers.json` — Block explorer URLs

### Protobuf Codegen

```bash
cd packages/client && yarn codegen
```

**File:** `packages/client/scripts/codegen.cjs`

Generates TypeScript types from protobuf definitions for Cosmos SDK, Circle CCTP, Evmos, Injective, etc.

### Swagger Types

```bash
cd packages/client && yarn update-types
```

Regenerates TypeScript types from the Skip API Swagger/OpenAPI spec.

---

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `WORD_PHRASE_KEY` | `packages/widget/.env` | Keplr mnemonic for E2E tests |
| `UPDATE_SCREENSHOTS` | CLI | Update visual regression baselines |
| `SLOW_MODE` | CLI | Debugging delay for Playwright |
| `VISUAL_TEST` | Set by `dev:visual-test` script | Enables visual test mode |

Copy the example env file for widget testing:

```bash
cp packages/widget/.env.example packages/widget/.env
```

---

## CI/CD Workflows

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| Client tests | `tests.yml` | PR, push to main/staging | Vitest unit tests |
| Widget tests | `widget-tests.yml` | PR, push to main/staging | Playwright E2E tests |
| ESLint | `eslint.yml` | PR | Lint `packages/widget/` |
| Publish | `publish.yml` | Push to main | Changeset release to npm |
| Web component | `release-web-component.yml` | Push to main (Version Packages commit) | Publish web component |
| Sync staging | `sync-staging.yml` | Push to main | Sync main → staging |

---

## Common Tasks

### Adding a New Dependency

```bash
# Add to a specific workspace
yarn workspace @skip-go/widget add <package>
yarn workspace @skip-go/client add <package>

# Add as dev dependency
yarn workspace @skip-go/widget add -D <package>
```

### Updating Chain Registries

```bash
yarn update-registries
# This updates chain-registry and @initia/initia-registry,
# regenerates chain configs, and rebuilds
```

### Linking Packages Locally

```bash
# In client package: watch + push to yalc
cd packages/client && yarn watch:link

# In consumer project: link from yalc
yalc add @skip-go/client
```

---

## Key Source Files

| File | Purpose |
|------|---------|
| `package.json` | Root workspace configuration and scripts |
| `packages/widget/vite.config.ts` | Widget Vite configuration |
| `packages/widget/webpack.config.js` | Web component Webpack configuration |
| `packages/client/tsup.config.ts` | Client build configuration |
| `packages/widget/src/devMode/loadWidget.tsx` | Dev mode UI |
| `packages/widget/scripts/generate-chains.cjs` | Chain config generator |
| `packages/widget/scripts/prepublish.cjs` | Pre-publish cleanup |
| `packages/client/scripts/codegen.cjs` | Protobuf codegen |
| `.changeset/config.json` | Changeset configuration |
| `.github/workflows/` | CI workflow definitions |
