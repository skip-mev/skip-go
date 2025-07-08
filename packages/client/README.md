[![npm/v](https://badgen.net/npm/v/@skip-go/client)](https://www.npmjs.com/package/@skip-go/client)
[![npm/dt](https://badgen.net/npm/dt/@skip-go/client?)](https://www.npmjs.com/package/@skip-go/client)
[![stars](https://badgen.net/github/stars/skip-mev/skip-go?)](https://github.com/skip-mev/skip-go)

# `@skip-go/client`

TypeScript library for interacting with the Skip API. It enables cross-chain swaps and transfers across multiple ecosystems.

## Installation

```bash
npm install @skip-go/client
```

```bash
yarn add @skip-go/client
```

## Quick Example

```ts
import { SkipClient } from "@skip-go/client";

const client = new SkipClient();
const route = await client.getRoute({ /* params */ });
```

See the [Getting Started guide](https://docs.skip.build/go/client/getting-started) for a full walkthrough.

Example implementation: [skip-go-example](https://github.com/skip-mev/skip-go-example)
