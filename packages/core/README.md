# Deprecation Notice

**⚠️ This project is deprecated**

This repository is no longer actively maintained and may not receive future updates or bug fixes. Please use the now maintained and developed [@skip-go/core](https://www.npmjs.com/package/@skip-go/core) as a replacement.

## Migration Guide

@skip-go/core@^0.4.5 is the same as @skip-go/client@0.4.5. To migrate packages with minimal disruption, please upgrade to @skip-go/core@^0.4.5 and then replace the package with @skip-go/client@0.4.5, then upgrading to the latest version from there.

Thank you for your understanding and for using our software.

For any questions, please reach out to us in our [discord](https://skip.build/discord) if you have any questions and/or need assistance migrating!

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

## Documentation

- [Skip Go API documentation](https://docs.skip.build/go)
- [Skip Go API Reference](https://docs.skip.build/go/api-reference/prod/info/get-v2infochains)
