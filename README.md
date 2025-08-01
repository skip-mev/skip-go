# Skip Go

Skip Go is the official monorepo for the Skip cross-chain swap ecosystem. It contains
both the TypeScript client library and the React widget used to embed Skip's
swap functionality in web applications. An example Next.js project is provided
for reference.

## Project Structure

```text
├── packages
│   ├── client   # `@skip-go/client` library
│   └── widget   # `@skip-go/widget` React component
├── examples
│   └── nextjs   # Example application
└── docs         # Local copy of documentation
```

### Package Relationship

`@skip-go/client` → `@skip-go/widget` → `examples/nextjs`

## Getting Started

### Install dependencies

```bash
yarn
```

### Start the development environment

Runs the client and widget in watch mode and launches the example app on
`http://localhost:3000`.

```bash
yarn dev
```

### Build all packages

```bash
yarn build
```

### Running tests

Client tests:

```bash
yarn test
```

Widget tests:

```bash
yarn test-widget
```

### Updating the changelog

Generate a Changeset entry before submitting a pull request:

```bash
npx changeset
```

## Documentation

Full documentation is available at [docs.skip.build](https://docs.skip.build).
Useful starting points:

- [Client README](./packages/client/README.md)
- [Widget README](./packages/widget/README.md)

## Examples

- Widget Example: <https://github.com/skip-mev/go-widget-example-next-js-app>
- Client Example: <https://github.com/skip-mev/skip-next-simple-example>

## Contributing

See [AGENTS.md](./AGENTS.md) for development guidelines, testing standards and
pull request requirements.

## License

This project is licensed under the terms of the [Apache 2.0](./LICENSE.txt)
license.
