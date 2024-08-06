# Skip Go

## Project Structure

```sh
├── examples
│   └── nextjs
├── packages
│   ├── client
│   └── widget
```

- `client` (@skip-go/client): The core package of the project. Contains the core logic, api fetch and types, helper functions, signing, etc.
- `widget` (@skip-go/widget): React library that contains the swap widget components.
- `examples`: The example app of the project

### How the package consumed

`@skip-go/client` -> `@skip-go/widget` -> `examples/nextjs`

## Dev Setup

### Install dependencies

```bash
yarn
```

### Start the development server

It will run the example app on `http://localhost:3000`

```bash
yarn dev
```

### Build the packages

```bash
yarn build
```

### Updating changelog

```
npx changeset
```

## Docs

- [Client](./packages/client/README.md)
- [Widget](./packages/widget/README.md)

## Examples

- Widget: https://github.com/skip-mev/go-widget-example-next-js-app
- Client: https://github.com/skip-mev/skip-next-simple-example
