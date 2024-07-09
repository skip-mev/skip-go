![header](https://files.readme.io/4f92aa7-DALLE_Cover_Photo_1..png)

[![npm/v](https://badgen.net/npm/v/@skip-go/core)](https://www.npmjs.com/package/@skip-go/core)
[![npm/dt](https://badgen.net/npm/dt/@skip-go/core?)](https://www.npmjs.com/package/@skip-go/core)
[![stars](https://badgen.net/github/stars/skip-mev/skip-go?)](https://github.com/skip-mev/skip-go)

# @skip-go/core

JavaScript SDK for Skip Go API

## Install

```bash
npm install @skip-go/core
```

## Usage

Read more at Skip Go API docs website on [Getting Started: TypeScript SDK](https://docs.skip.build/go/general/getting-started).

## Development

```bash
# clone repository
git clone https://github.com/skip-mev/skip-go.git
cd skip-go/packages/core

# prepare submodules
git submodule update --init --recursive

# install dependencies
npm install

# run watch server to build on changes
npm -w @skip-go/core run watch

# build packages
npm run build
```

## Unit Tests

```bash
# run unit tests
npm run test

# run unit tests in watch mode
npm run test -- --watch

# run unit tests with coverage
npm run test -- --coverage
```

## E2E Tests

E2E tests depend on [Starship](https://starship.cosmology.tech) to test interactions with various blockchains.

```bash
# run starship setup
npm run e2e:setup

# run starship devnets
npm run e2e:start

# run e2e tests
npm run e2e:test

# stop starship devnets
npm run e2e:stop
```

## Documentation

- [Skip Go API documentation](https://docs.skip.build/go)
- [Skip Go API Reference](https://docs.skip.build/go/api-reference/prod/info/get-v2infochains)
