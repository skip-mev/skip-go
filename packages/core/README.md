![header](https://files.readme.io/4f92aa7-DALLE_Cover_Photo_1..png)

[![npm/v](https://badgen.net/npm/v/@skip-router/core)](https://www.npmjs.com/package/@skip-router/core)
[![npm/dt](https://badgen.net/npm/dt/@skip-router/core?)](https://www.npmjs.com/package/@skip-router/core)
[![stars](https://badgen.net/github/stars/skip-mev/skip-router-sdk?)](https://github.com/skip-mev/skip-router-sdk)

# @skip-router/core

JavaScript SDK for Skip API

## Install

```bash
npm install @skip-router/core
```

## Usage

Read more at Skip API docs website on [Getting Started: TypeScript SDK](https://api-docs.skip.money/docs/getting-started).

## Development

```bash
# clone repository
git clone https://github.com/skip-mev/skip-router-sdk.git
cd skip-router-sdk

# prepare submodules
git submodule update --init --recursive

# install dependencies
npm install

# run watch server to build on changes
npm -w @skip-router/core run watch

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

- [Skip API documentation](https://api-docs.skip.money)
- [Skip API Reference](https://api-docs.skip.money/reference)
- [Skip API Reference (Swagger)](https://api-swagger.skip.money)
