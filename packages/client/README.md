[![npm/v](https://badgen.net/npm/v/@skip-go/client)](https://www.npmjs.com/package/@skip-go/client)
[![npm/dt](https://badgen.net/npm/dt/@skip-go/client?)](https://www.npmjs.com/package/@skip-go/client)
[![stars](https://badgen.net/github/stars/skip-mev/skip-go?)](https://github.com/skip-mev/skip-go)

# `@skip-go/client`

TypeScript library that streamlines interaction with the Skip Go API, enabling cross-chain swaps and transfers across multiple ecosystems.

## Install

```bash
npm install @skip-go/client
```

```bash
yarn add @skip-go/client
```

## Usage

Follow the [Getting Started](https://docs.skip.build/go/client/getting-started) guide to begin your integration.

## Development

```bash
# clone repository
git clone https://github.com/skip-mev/skip-go.git
cd skip-go/packages/client

# prepare submodules
git submodule update --init --recursive

# install dependencies
npm install

# run watch server to build on changes
npm -w @skip-go/client run watch

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

## Documentation

- [Skip Go API documentation](https://docs.skip.build/go)
- [Skip Go API Reference](https://docs.skip.build/go/api-reference/prod/info/get-v2infochains)
