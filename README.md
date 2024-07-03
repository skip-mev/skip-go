# skip-go

## Project Structure

```sh
├── examples
│   └── nextjs
├── packages
│   ├── core
│   └── widget
```

- `core` (@skip-go/core): The core package of the project. Contains the core logic, api fetch and types, helper functions, signing, etc.
- `widget` (@skip-go/widget): React library that contains the swap widget components.
- `examples`: The example app of the project

### How the package consumed

`@skip-go/core` -> `@skip-go/widget` -> `examples/nextjs`

## Dev Setup

### Install dependencies:

```bash
yarn
```

### Start the development server:

it will run watch the core and widget packages,it will run the example app on `http://localhost:3000`

```bash
yarn dev
```

Build the packages:

```bash
yarn build
```

## Docs

- [Core](./packages/core/README.md)
- [Widget](./packages/widget/README.md)

## Examples

- Widget: https://github.com/skip-mev/go-widget-example-next-js-app
- Core: https://github.com/skip-mev/skip-next-simple-example
